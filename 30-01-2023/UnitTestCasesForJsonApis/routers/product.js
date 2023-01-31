const Router = require("express");
const router = Router();

const { getProducts, insertProduct, getProductById, updateProduct } = require('../controller/product');

router.post('', insertProduct);

router.get('', getProducts);

router.get('/:id', getProductById);

router.put('', updateProduct);

module.exports = router;