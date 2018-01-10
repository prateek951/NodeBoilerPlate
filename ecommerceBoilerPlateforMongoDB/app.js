const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
//CROSS ORIGIN RESOURCE SHARING
// added cors
const mongoose = require('mongoose');

const products = require('./api/routes/products');
const orders = require('./api/routes/orders');
const user = require('./api/routes/user');

mongoose.connect('mongodb://localhost:27017/node-shop');
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

app.use((req,res,next)=>{
	res.header('Access-Control-Allow-Origin','*');
	res.header('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type,Accept,Authorization');

	if(req.method === 'OPTIONS'){
		res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,GET,DELETE');
		return res.status(200).json({});
	}
	next();
});

app.use('/products',products);
app.use('/orders',orders);
app.use('/user',user);

app.use((req,res,next)=>{
	const error = new Error('Not Found!!');
	error.status = 404;
	next(error);
});

app.use((error,req,res,next)=>{
	res.status(error.status || 500).json({
		error : {
			message : error.message
		}
	});
});


module.exports = app;
