const { getUsers, insertUsers } = require("../controller/user");
const { insertPosts } = require("../controller/posts");

const users = require("../files/users.json");
const posts = require("../files/posts.json");

async function seedUsersData() {
  await insertUsers(users);
}

async function getUserId() {
  const users = await getUsers();
  const userId = [];
  users.map((user) => {
    if (!userId.includes(user._id)) userId.push(user._id);
  });
  return userId;
}

async function seedPostsData() {
  const users = await getUserId();
  for (i = 0; i < users.length; i++) {
    const post = posts;
    for (j = 0; j < post.length; j++) {
      post[j]["userId"] = users[i];
    }
    await insertPosts(post);
  }
}

async function main() {
  await seedUsersData();
  seedPostsData();
}

main();
