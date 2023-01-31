
const { insert, get, getById, update, deleteById } = require('../services/product');

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

function getProductById(req, res) {
    const id = req.params.id;

    getById(id)
        .then((product) => {
            res.status(200).json(product);
        })
        .catch((err) => {
            res.status(404).json({ message: err });
        });
}

function updateProduct(req, res) {
  const productParams = req.body;
  update(productParams)
    .then(data => {
      res.status(200).json({ data });
    })
    .catch(err => {
      res.status(400).json({ message: err });
    })  
}

function deleteProduct(req, res) {
    const { id } = req.params;

    deleteById(id)
        .then(response => {
            if (response) {
                res.status(200).json({
                    message: `Product ${id} was deleted succesfully`,
                });
            } else {
                res.status(404).json({ message: `Product ${id} was not found` });  
            } 

        }) 
        .catch(err => res.status(500).json({ error: err })); 
};

module.exports = { getProducts, insertProduct, getProductById, updateProduct, deleteProduct }