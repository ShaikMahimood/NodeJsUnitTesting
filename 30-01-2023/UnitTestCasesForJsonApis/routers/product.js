const Router = require("express");
const router = Router();

const { getProducts, insertProduct } = require('../controller/product');

router.post('', insertProduct);

router.get('', getProducts);

module.exports = router;