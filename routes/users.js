const { text } = require('body-parser');
const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport = require('passport');
const { default: mongoose } = require('mongoose');

//load user model
require('../models/user')
const User = mongoose.model('users')

//User Login Route

router.get('/login',(req,res) =>{
    res.render('users/login')
})

//User Register Route 
router.get('/register',(req,res)=>{
    res.render('users/register');
})

// login from post 
router.post('/login', (req , res , next) =>{
    passport.authenticate('local' , {
        successRedirect : "/ideas" ,
        failureRedirect : "/users/login",
        failureFlash : true
    })(req , res , next);
})

// Register Form POST 
router.post('/register',(req,res)=>{
    let errors = []

    if(req.body.password != req.body.password2){
        erro.push({text : 'Passwords Does not match'})
    }
    if(req.body.password.length < 4 ){
        errors.push({text : 'Password cannot be less than 4'})
    }

    if(errors.length > 0){
        return res.render('users/register',{
            errors : errors,
            name : req.body.name ,
            email : req.body.email,
            password : req.body.password,
            password2 : req.body.password2
        })
    } else{
        User.findOne({ email : req.body.email})
        .then(user =>{
            if(user){
                console.log("user logged in")
                req.flash('error_msg', "You have already registered")
                return  res.redirect("/users/register")
            }else{
                       const newUser =  new User({
        name : req.body.name,
        email : req.body.email ,
        password : req.body.password
       })
       bcrypt.genSalt(10 , (err , salt)=>{
        bcrypt.hash(newUser.password , salt ,(err,hash)=>{
            if (err) throw err;
            newUser.password = hash
            newUser.save()
            .then(user => {
                req.flash('success_msg',"You are now Registered , You can log in now ")
                res.redirect('/users/login')
            })
            .catch(err => {
                console.log(err)
                return;
            })
        })
       })

            }
        })
    

    }
    // return res.redirect('/users/login');
})

// User Logout 

router.get('/logout',(req , res , next) =>{
    req.logout(function(err){
        if(err){
            return next(err)
        }
    req.flash('success_msg' , 'You are Logged out')
    res.redirect('/users/login')
    })

})


module.exports = router ;