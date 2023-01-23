const Posts = require("../model/post");

function insertPosts(params) {
  return new Promise(async (resolve, reject) => {
    Posts.insertMany(params, function (err, result) {
      if (!err) {
        resolve(result);
      } else return reject(err);
    });
  });
}

module.exports = { insertPosts };
