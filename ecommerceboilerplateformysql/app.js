const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.use('/',express.static(path.join(__dirname,'public')));
app.use('/api',require('./routes/api'));




const port = process.env.PORT || 1776;
app.listen(port,() => console.log(`Server running on the port:${port}`));