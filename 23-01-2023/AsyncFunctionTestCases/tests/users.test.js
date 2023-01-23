const { mongoose } = require("../db/db");
const { getUsers, insertUsers } = require("../controller/user");
const { insertPosts } = require("../controller/posts");

beforeAll(async () => {
  const url = `mongodb://localhost:27017/test`;
  await mongoose.connect(url);
});

const users = [
  {
    name: "Zell",
  },
  {
    name: "Vincy",
  },
  {
    name: "Shion",
  },
];

const posts = [
  {
    title: "tresure island",
    description:
      "Treasure Island is the story of a boy who sails on a ship searching for treasure",
  },

  {
    title: "The adventure of tom sawyer",
    description:
      "Tom Sawyer is a troublemaking little boy who is always causing problems, having fun and enjoying many crazy adventures",
  },
];

const userId = [];

describe("Test", function () {
  beforeEach(async function () {
    await insertUsers(users).then((result) => {
      expect(result).toHaveLength(3);
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: "Zell",
          }),
        ])
      );
    });
  });

  test("Get Users", async () => {
    await getUsers().then((result) => {
      result.map((user) => {
        if (!userId.includes(user._id)) userId.push(user._id);
      });
      expect(result).toHaveLength(3);
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: "Zell",
          }),
        ])
      );
    });
  });

  test("UserId test", async () => {
    expect(userId).toHaveLength(3);
  });

  test("Insert Posts for Users", async () => {
    for (i = 0; i < userId.length; i++) {
      const post = posts;
      for (j = 0; j < post.length; j++) {
        post[j]["userId"] = userId[i];
      }
      await insertPosts(post).then((data) => {
        expect(data).toHaveLength(2);
        expect(data).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              description: expect.any(String),
              title: expect.any(String),
            }),
          ])
        );
      });
    }
  });
});

function removeAllCollections() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    collection.deleteMany();
  }
}

async function dropAllCollections() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    try {
      await collection.drop();
    } catch (error) {
      // Sometimes this error happens, but you can safely ignore it
      if (error.message === "ns not found") return;
      // This error occurs when you use it.todo. You can
      // safely ignore this error too
      if (error.message.includes("a background operation is currently running"))
        return;
      console.log(error.message);
    }
  }
}

// Cleans up database between each test
afterEach(async () => {
  removeAllCollections();
});

// Disconnect Mongoose
afterAll(async () => {
  await dropAllCollections();
  await mongoose.connection.close();
});
