const Users = require("../model/user");

async function insertUsers(params) {
  return new Promise(async (resolve, reject) => {
    Users.insertMany(params, function (err, result) {
      if (!err) {
        resolve(result);
      } else return reject(err);
    });
  });
}

function getUsers() {
  return new Promise(async (resolve, reject) => {
    await Users.find()
      .then((users) => {
        resolve(users);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

async function getUserPosts(req, res) {
  try {
    const page = parseInt(req.query.page) || 1,
      limit = parseInt(req.query.limit) || 2;
      
    const result = await Users.aggregate([
      {
        $facet: {
          users: [
            {
              $lookup: {
                from: "posts",
                localField: "_id",
                foreignField: "userId",
                pipeline: [{ $count: "count" }],
                as: "posts",
              },
            },
            {
              $addFields: {
                posts: { $sum: "$posts.count" },
              },
            },
            { $sort: { _id: 1 } },
            {
              $skip: (page - 1) * limit,
            },
            {
              $limit: limit,
            },
          ],
          totalDocs: [
            {
              $count: "count",
            },
          ],
        },
      },
    ]);

    if (!result.length) throw "Users Data Not Found!";
    const totalDocs = result[0].totalDocs[0].count;
    const users = result[0].users;
    const pagination = {
      totalDocs,
      limit,
      page,
      totalPages: Math.ceil(totalDocs/limit),
      pagingCounter: (page - 1) * limit + 1,
      hasPrevPage: page - 1 ? true : false,
      hasNextPage: (page * limit) < totalDocs ? true : false,
      prevPage: page - 1 ? page - 1 : null,
      nextPage: (page * limit) < totalDocs ? page + 1 : null,
    };
    const response = { users, pagination };
    res.status(200).json({ status: "Success", data: response });
  } catch (error) {
    res.status(400).json({ status: "Error :", error: error });
  }
}

module.exports = { insertUsers, getUsers, getUserPosts };
