const express = require('express');
const mongoose = require('mongoose');
const Blog = require('./models/blog');
require('dotenv').config();

const port = process.env.PORT;

const dbURI = process.env.MONGO_URI

const app = express();

mongoose.connect(dbURI)
    .then((result)=>app.listen(port))
    .catch((err)=>console.log(err));

app.set('view engine', 'ejs');
 


app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res)=>{
    const blogs = [
        {title: 'Nasty at the gym', snippet:'Just hit the nastiest sqaut and bench at the gym im actually goated'},
        {title: 'Nasty in basketball', snippet:'Just hit the nastiest shots in basketball, call me stephen curry'}
    ];
    res.render('index', {blogs});
});

app.get('/about', (req, res)=>{
    res.render('about');
});

app.get('/blogs', (req, res)=>{
    Blog.find().sort({createdAt: -1})
        .then((result)=>{
            res.render('all', {blogs: result});
        })
        .catch((err)=>{
            console.log(err);
        })
});

app.post('/blogs', (req, res)=>{
    const blog = new Blog(req.body);

    blog.save()
        .then((result)=>{
            res.redirect('/blogs');
        })
        .catch((err)=>{
            console.log(err);
        })

})
app.get('/blogs/create', (req, res)=>{
    res.render('create');
})
app.get('/blogs/:id', (req, res)=>{
    const id = req.params.id;
    Blog.findById(id)
        .then(result => { 
            res.render('details', {blog: result});
        })
        .catch((err)=>{
            console.log(err);
        })
})

app.delete('/blogs/:id', (req, res)=>{
    const id = req.params.id;

    Blog.findByIdAndDelete(id)
        .then(result => {
            res.json({redirect: '/blogs'});
        })
        .catch(err=>{
            console.log(err);
        })
})

app.use((req, res)=>{
    res.status(404).render('404');
});