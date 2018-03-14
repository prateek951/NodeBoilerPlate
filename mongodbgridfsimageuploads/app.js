const express = require('express');
const app = express();

/*Setting up the view engine*/ 
app.set('view engine',ejs);

/*GET request for the index page*/
app.get('/',(req, res) => res.render('index'));

const port = process.env.PORT || Math.floor(Math.random()*10000) + 1;
app.listen(port,()=>  console.log(`Server up and running ${port}`));