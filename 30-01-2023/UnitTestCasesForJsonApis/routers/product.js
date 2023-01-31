const Router = require("express");
const router = Router();

const { getProducts, insertProduct, getProductById, updateProduct, deleteProduct } = require('../controller/product');

router.post('', insertProduct);

router.get('', getProducts);

router.get('/:id', getProductById);

router.put('', updateProduct);

router.delete('/:id', deleteProduct);

module.exports = router;