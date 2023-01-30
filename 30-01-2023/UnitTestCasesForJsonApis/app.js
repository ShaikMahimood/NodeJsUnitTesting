const express = require('express');

const app = express();

const product = require('./routers/product');

//Configure middleware to support JSON data parsing in request object
app.use(express.json());

//Configure router so all routes are prefixed with /products
app.use('/products', product);

//Create server to listen on port 5000
app.listen(5000, function(){
    console.log('Node server is running on http://localhost:5000');
});

module.exports = app;