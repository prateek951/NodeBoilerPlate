const router = require('express').Router();
const Product = require('../../db').Product;


router.get('/',(req, res) => {
    //Retrieve the list of all the products
    Product.findAll().then(products => res.status(200).send(products))
    .catch(err => res.status(500).send({
        error : 'Could not retrieve the list of the products'
    }));
});


router.post('/',(req, res) => {

    //validate the values
    if(isNaN(req.body.price)){
        return res.status(500).send({
            error : 'Price is not a valid number' 
        });
    }

    Product.create({
        name : req.body.name,
        manufacturer : req.body.manufacturer,
        price : parseFloat(req.body.price)
    });
});

module.exports = router;