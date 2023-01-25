const mongoose = require("mongoose");

const request = require("supertest");
const app = require("../index");

beforeAll(async () => {
  await mongoose.connection.close();
  const url = `mongodb://localhost:27017/test`;
  await mongoose.connect(url);
});

// Test cases for insertEmployee
describe("insertEmployee", () => {
  it("should insert a new employee into the database", async () => {

    const res = await request(app).post("/employees").send({
      name: "John Doe",
      email: "john@doe.com",
      position: "Manager",
      office: "New York",
      location: "USA",
    });

    expect(res.statusCode).toBe(200); // check if status is 200 (OK) after inserting employee into the database
  });

  // check if error is returned when no email is provided in the request body
  it("should return an error if no email is provided in the request body", async () => {

    const errorMessage = "Enter email to Insert Employee";

    const res = await request(app).post("/employees").send({});

    expect(res.statusCode).toBe(400); // check if status is 400 (Bad Request) when no email is provided in the request body
    expect(res.body.message).toEqual(errorMessage); // check error message
  });
});

// test cases for getEmployee
describe("getEmployee", () => {

  //test checks to see if the function returns a list of employees with the correct information
  it("should return a list of employees", async () => {

    const res = await request(app).get("/employees");

    expect(res.statusCode).toBe(200); // check if status is 200 (OK) after getting employee from the database
    expect(res.body.employees).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "John Doe",
          email: "john@doe.com",
          position: "Manager",
          office: "New York",
          location: "USA",
          empId: 1,
        }),
      ])
    ); //check if employee contains inserted employee or not
  });

  //test checks to see if the function returns an error message if there is a problem retrieving the employee data
  it("should return an error if there is a problem retrieving the employees", async () => {
    await removeAllCollections();

    const errorMessage = "Employee Data is Not Found!";

    const res = await request(app).get("/employees");

    expect(res.statusCode).toBe(400); // check if status is 400 (Bad Request) when no data is available in database
    expect(res.body).toEqual({ message: errorMessage }); //check error message
  });
});

//removeAllCollections to remove documents from collections in test database
async function removeAllCollections() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    await collection.deleteMany();
  }
}

//dropAllCollections to drop collections from test database
async function dropAllCollections() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    try {
      await collection.drop();
    } catch (error) {
      // Sometimes this error happens, but you can safely ignore it
      if (error.message === "error not found") return;
      // This error occurs when you use it.todo. You can
      // safely ignore this error too
      if (error.message.includes("a background operation is currently running"))
        return;
      console.log(error.message);
    }
  }
}

// Disconnect Mongoose
afterAll(async () => {
  await dropAllCollections();
});
