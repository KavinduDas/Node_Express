const express = require('express')
const { engine } = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser  = require('body-parser')
const methodOverride = require('method-override');
const flash = require('connect-flash')
const session = require('express-session')
const path = require('path')
const passport = require('passport')

//load Routes
const ideas = require('./routes/ideas')
const users = require('./routes/users')

const app = express()

//DB Config
const db = require('./config/database')

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server Running on port ${PORT}`)
})

// CONNECT TO MONGODB
mongoose.connect(db.mongourl)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err))


// const idea = require('./models/Idea')


// Config passport 
require('./config/passport')(passport)

// Handle Middleware
app.engine('handlebars', engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(function(req, res, next) {
    req.name = 'Kavindu Dassanayake'
    next()
})

// Body Parse MiddleWare 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded())


// Static Folder
app.use(express.static(path.join(__dirname,'public')))

// Methid Override Middleware Put Request
app.use(methodOverride('_method'));

// Express session middleware
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);

//Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use(function(req, res,next){
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg  = req.flash("error_msg")
    res.locals.error = req.flash("error") 
    res.locals.users = req.user || null
    next()    

})


// parse application/json
app.use(bodyParser.json())



// Routes
app.get('/', (req, res) => {
    res.render('Index')
})



app.get('/about', (req, res) => {
    console.log(req.name)
    res.send(`Name is ${req.name}`)
})

app.get('/abouthandle', (req, res) => {
    res.render('about')
})


// Edit Form Process

app.put('/ideas/:id', (req,res)=>{
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea =>{
        // New Values 
        idea.title = req.body.title;
        idea.details = req.body.details;

        idea.save()
        .then(idea =>{
            req.flash('Success_msg','Video Idea Updated')
            res.redirect('/ideas')
        })
    })

})

// User Routes 
app.use('/ideas',ideas);
app.use('/users', users)