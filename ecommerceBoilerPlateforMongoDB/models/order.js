const mongoose = require('mongoose');
const orderSchema = mongoose.Schema({
	//Unique id per order 
	_id : mongoose.Schema.Types.ObjectId,
	product : {
		type : mongoose.Schema.Types.ObjectId,
		ref: 'Product',
		required : true
	}
	name : {
		type : String,
		required : true
	},
	quantity : {
		type : Number,
		default : 1 //Assuming atleast one order will be placed
	}
	price : {
		type : Number,
		required : true
	}

});

module.exports = mongoose.model('Order',orderSchema);
