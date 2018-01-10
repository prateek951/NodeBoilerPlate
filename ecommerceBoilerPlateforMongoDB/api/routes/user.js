const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Import the model here

// Doing authentication using JSON web token
// user routes
router.post('/signup',(req,res,next)=>{

	User.find({email: req.body.email}).exec()
		.then(user => {
			if(user.length >= 1){
				return res.status(422).json({
					message: 'Email exists'
				});
			}
	else
		{
		bcrypt.hash(req.body.password,10,(err,hash)=>{

		if(err){
			return res.status(500).json({error : err});
		}
		else{
			// if the password gets converted to the hash and salting is successful
			const user = new User({
				_id : new mongoose.Types.ObjectId(),
				email : req.body.email,
				password : hash
			});	
			// To save the user in the database
			user.save().then(result => res.status(200).send({message : 'User created'})).catch(err => console.log(err));
		}

	})

			}
		})

//Invoke the bcrypt hash method to hash the password

});

router.post('/login',(req, res, next) => {

	User.find({email : req.body.email}).then(user => {
		if(user.length < 1){
			//Users array length is 0
			return res.status(401).json({
				message : 'Authentication failed'
			});
		}
		//Got the array of users here
		//Compare the password passed in the request body with the one stored in the database
		bcrypt.compare(req.body.password, user[0].password, (err, result) => {
			if (err) {
				return res.status(401).json({
					message : 'Auth failed'
				});
			}
			if (result) {
				//got the user
				const token = jwt.sign({
					email : user[0].email,
					userId : user[0]._id
				}, process.env.JWT_KEY, {
					expiresIn : "1h"
				});

				return res.status(200).json({
					message : 'Auth successful',
					token : token
				})
			}
			// Passwords do not match
			return res.status(401).json({
				message : 'Auth failed'
			});
		})
	})
});


router.delete('/:userId',(req,res,next)=>{
	User.remove({_id : req.body.userId})
		.exec()
		.then(result => res.status(200).json({message : 'User got deleted'}))
		.catch(err =>{
			console.log(err);
			res.status(500).json({
				error : err
			})
		});
});

// Export the router

module.exports = router;