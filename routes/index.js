const express = require('express');
const router = express.Router();
const expressValidator = require('express-validator');
const bcrypt = require('bcrypt');
const passport = require('passport');
const saltRounds = 10;
router.get('/',(req, res, next) => res.render('home',{title : 'Home page'}));

router.get('/register',(req, res, next) => {
  res.render('index',{title : 'Registration Page'});
});

router.get('/profile', ensureAuthenticated,(req, res, next) => res.render('profile',{title : 'This is the profile page'}));

router.get('/login',(req, res, next)=> res.render('login',{title : 'This is the login page'}));

router.post('/login',passport.authenticate('local',{
  successRedirect : '/profile',
  failureRedirect : '/login',
  failureFlash: true
}));

router.get('/logout',(req, res, next) => {
  req.flash('success','You are successfully logged out!!');
  req.logout();
  //Since after logout session may persist destroy the session
  req.session.destroy()
  res.redirect('/login');
})

router.post('/',(req, res, next) => {
  // console.log(req.body.username);
  // console.log(req.body.password);
  // console.log(req.body.password2);
  //Pull out the form data from the request body

  //define the validation for each of the fields
  req.checkBody('username','Username field cannot be empty').notEmpty();
  req.checkBody('username','Username must be between 4-15 characters long').len(4,15);
  req.checkBody('email','The email you entered is invalid,please try again').isEmail();
  req.checkBody('email','Email must be between 4 to 100 characters long').len(4,100);
  req.checkBody('password','Password must be between 8 to 100 characters long').len(8,100);
  req.checkBody('password2','Password must be between 8-100 characters long').len(8,100);
  req.checkBody('password2','Passwords do not match, please try agin').equals(password);

  let errors = req.validationErrors();

  if(errors){
    //validation errors
    console.log(JSON.stringify(errors));
    res.render('index',{title : 'Registration Page',errors : errors});
  }
  else {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

    const db = require('../db.js');
    bcrypt.hash(password,saltRounds,(err,hash)=>{
      db.query('INSERT INTO users (username,email,password) VALUES(?,?,?)',[username,email,hash],(error,results,fields)=>{
        if(error){
          throw err;
        }
       db.query('SELECT LAST_INSERT_ID() as user_id',(err,result,fields)=>{
          if(err){
            throw err;
            }
        req.login(results[0], err => {
          if(err){
            throw err;
          }
          res.redirect('/');
        });            

       })
        
      });
      });
  }
});

passport.serializeUser = (user,done)=>{
  done(null,user.id);
}
passport.deserializeUser = (id,done) => {
  User.findById(id,(err,user)=>{
    done(err,user);
  })
}

function ensureAuthenticated(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/register');
}


module.exports = router;
