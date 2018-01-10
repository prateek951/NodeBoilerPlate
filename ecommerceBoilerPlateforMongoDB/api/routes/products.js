const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
	destination: function(req,file,cb){
		cb(null,'./uploads');
	},
	filename : function(req,file,cb){
		cb(null,new Date().toISOString() + file.originalname);
	}
});

const fileFilter = (req,file,cb) => {
 if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
 	// store the file in such case
 	//accept and store the file
 	 cb(null,true);
 }else{
 //reject a file
 cb(null,false);
 	
 }

};

const upload = multer({storage : storage, limits: {
	fileSize: 1024 * 1024 * 5	
	//accept images upto only 5 megabytes
},
fileFilter : fileFilter});


const Product = require('../models/product');
//GET THE LIST OF ALL THE PRODUCTS
router.get('/',(req,res,next)=>{

	Product.find({})
	.select('name price _id productImage')
	.exec()
	.then(results => {
		// console.log(results);
		const response = {
			count : results.length,
			products : results.map(result => {
				return {
					name : result.name,
					price : result.price,
					_id : result._id,
					productImage : result.productImage,
					url : {
						type : 'GET',
						url : 'http://localhost:3999/products/'+result._id
					}
				}
			})
		}
		// if(results.length>=0){
			res.status(200).json(response);
		// }
		// else {
			// res.status(404).json({message : 'No valid entries are found to exist!'});
		// }
	})
	.catch(err => {
		console.log(err)
		res.status(500).json({error : err});
	});

});
//ADD A PRODUCT TO THE SHOPPPING CART
router.post('/', checkAuth, upload.single('productImage'),(req,res,next)=>{
	console.log(req.file);
	//create the product instance with the details that the client provided
	const product = new Product({
		_id : new mongoose.Types.ObjectID,
		name : req.body.name,
		price : req.body.price,
		product : req.file.path
	});

	product.save().then(result => {
		console.log(result);
		res.status(201).json({
			message : 'Handling POST requests to /products',
			createdProduct : {
				_id : result._id,
				name : result.name,
				price : result.price,
				request : {
					type : 'GET',
					url : 'http://localhost:3999/products/' + result._id
				}
			}
	});

	}).catch(err => {
		console.log(err);
		res.status(500).json({error : err});
	});
});
//RETRIEVE A SPECIFIC PRODUCT 
router.get('/:productId',(req,res,next)=>{

	const id = req.params.productId;

	Product.findById(id).select('name price _id productImage')
	.exec()
	.then(doc => {
		console.log(doc);
		if(doc){
			res.status(200).json({
			 product : doc,
			 request : {
			 	type : 'GET',
			 	description: 'GET_ALL_PRODUCTS',
			 	url : 'http://localhost:3999/products'
			 }
			});
		}
		else {
			res.status(404).json({message : 'No valid ID found!!'});
		}
	})
	.catch(err => {
		console.log(err)
		res.status(500).json({error : err})
	});

});

//PATCH REQUEST TO UPDATE A PART OF SOME PRODUCT

router.patch('/:id',checkAuth,(req,res,next)=>{
	
	//Simple object keeps track of the update operations
	const updateOps  = {};
	//Loop over the req.body
	for(const ops of req.body){
		updateOps[ops.propName] = ops.value;
	}

	Product.findByIdAndUpdate(req.params.id,{ $set : updateOps})
		.exec().then(result => {
			console.log(result);
			res.status(200).json({
				message : 'Product Updated',
				request : {
					type : 'GET',
					url : 'http://localhost:3999/products/'+result._id
				}
			});
		}).catch(err => {
			console.log(err);
			res.status(500).json({error : err});
		});

});


//DELETE THE PRODUCT WITH SPECIFIC ID

router.delete('/:id',checkAuth,(req,res,next)=>{
	const id = req.params.id
	Product.remove({_id : id}).exec().then(result => {
		console.log(result);
		res.status(200).json({
			message : 'Product Deleted',
			request : {
				type : 'POST',
				url : 'http://localhost:3999/products',
				data : {
					name : 'String',
					price : 'Number'
				}
			}
		});
	})
	.catch(err => {
		console.log(err);
		res.status.json({error : err});
	});

});

module.exports= router;