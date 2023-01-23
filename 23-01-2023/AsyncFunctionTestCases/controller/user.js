const Users = require("../model/user");

function insertUsers(params) {
  return new Promise((resolve, reject) => {
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

function aggr(params) {
  return new Promise(async (resolve, reject) => {
    try {
      const { page, limit } = params;
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
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
}

async function getUserPosts(req, res) {
  try {
    const page = parseInt(req.query.page || 1),
      limit = parseInt(req.query.limit || 10);

    const params = { page, limit };
    const result = await aggr(params);

    if (!result.length) throw "Users Data Not Found!";
    const totalDocs = result[0].totalDocs[0].count;
    const users = result[0].users;
    const pagination = {
      totalDocs,
      limit,
      page,
      totalPages: totalDocs / limit,
      pagingCounter: (page - 1) * limit + 1,
      hasPrevPage: page - 1 ? true : false,
      hasNextPage: page - limit ? true : false,
      prevPage: page - 1 ? page - 1 : null,
      nextPage: page - limit ? page + 1 : null,
    };
    const response = { users, pagination };
    res.status(200).json({ data: response });
  } catch (error) {
    res.status(400).json({ error: error });
  }
}

module.exports = { insertUsers, getUsers, getUserPosts };
