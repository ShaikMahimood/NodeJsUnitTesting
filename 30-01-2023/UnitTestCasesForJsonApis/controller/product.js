
const { insert, get } = require('../services/product');

function insertProduct(req, res) {
    try{
        const { name, price } = req.body;
        if(!name && !price) throw 'Enter name and price values';
        const productParams = { name, price }
        insert(productParams)
            .then((data) => {
                res.status(200).json(data);
            })
            .catch((err) => {
                res.status(400).json(err);
            });
    }catch(error){
        res.status(400).json(error);
    }
}

// getProducts to return a list of all products
function getProducts(req, res) {
    get()
        .then(products => {
            res.status(200).json({ products });
        })
        .catch(err => {
            res.status(400).json({ message: err });
        });
}

module.exports = { getProducts, insertProduct }