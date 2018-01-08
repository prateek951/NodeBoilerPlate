const Sequelize = require('sequelize');

const db = new Sequelize('edb','shopo','shopify',{
    host : 'localhost',
    dialect : 'mysql',
    pool: {
        min : 0,
        max : 5
    }
});

//create a model
const User = db.define('users',{
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        primaryKey: true
    },
    name : {
        type : Sequelize.STRING,
        allowNull : false
    }
});



//create product model
const Product = db.define('products',{
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        primaryKey: true
    },
    name : {
        type : Sequelize.STRING,
        allowNull : false
    },
    manufacturer : Sequelize.STRING,
    price : {
        type : Sequelize.FLOAT,
        allowNull : false,
        default : 0.0
    }
});

db.sync()
.then(() => console.log('Database has been synced'))
.catch(err => console.log(err));

module.exports = {
    User,Product
}