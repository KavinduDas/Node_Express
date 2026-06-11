const express = require('express')
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth')
module.exports = router ;


// Load Idea model
const Idea = require('../models/Idea') 

//Idea Index Page 
router.get('/', ensureAuthenticated ,(req,res)=>{
    Idea.find({user : req.user.id})
    .sort({date : 'desc'})
    .lean()
    .then(ideas =>{
        res.render('ideas/index' , {
            ideas : ideas
        }
        )
    })
   
})
//Add Idea form
router.get('/add', ensureAuthenticated, (req,res) =>{
    res.render('ideas/add')
}) 

// Edit Idea Form 

router.get('/edit/:id', ensureAuthenticated, (req,res) =>{
    Idea.findOne({
        _id:req.params.id
    })
    .lean()
    .then(idea =>{
        if(idea.user != req.user.id){
            req.flash('error_msg', 'Not authorized')
            res.redirect('/ideas')
        }else{
            res.render('ideas/edit',{
            idea:idea
        })

        }

    })
   
}) 


// Process Form 
router.post('/', ensureAuthenticated,(req,res)=>{
    // console.log(req.body)
    // res.send('OK')
    let errors = [];

    if(!req.body.title){
        errors.push({text:'Please add a title'});
    }
    if(!req.body.details){
        errors.push({text:'Please add some details'})
    }
    if(errors.length > 0){
        res.render('ideas/add',{
            errors : errors,
            title : req.body.title ,
            details : req.body.details
    })
    }else{
        const newUser = {
            title : req.body.title ,
            details : req.body.details,
            user : req.user.id
        }
        new Idea(newUser).save().then(idea =>{
            req.flash('Success_msg','Video Idea Added')
            res.redirect('/ideas');
        })
    }

})

// Delete IDEa
router.delete('/:id',ensureAuthenticated ,(req,res) =>{
    Idea.deleteOne({_id:req.params.id})
    .then(() =>{
        req.flash('Success_msg','Video removed')
        res.redirect('/ideas');
    })
} )
