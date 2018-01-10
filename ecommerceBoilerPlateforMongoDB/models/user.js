///This is how a user should look like

const mongoose = require('mongoose');

//create the user schema

const userSchema = mongoose.Schema({
	
	// What are the credentials that 
	// I require for the user
	_id : mongoose.Schema.Types.ObjectID,
	email : {
		type : String,
		required : true,
		unique : true,
	},
	password : {
		type : String,
		required : true
	}
});

// create the mongoose model and export it

module.exports = mongoose.model('User',userSchema);
