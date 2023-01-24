const Router = require("express");
const router = Router();

const { getUserPosts } = require('../controller/user');
router.get('', getUserPosts)

module.exports = router;