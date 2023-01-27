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

    const testData = {
      name: "John Doe",
      email: "john@doe.com",
      position: "Manager",
      office: "New York",
      location: "USA",
    };
    const res = await request(app).post("/employee").send(testData);
    expect(res.statusCode).toBe(200); // check if status is 200 (OK) after inserting employee into the database
  });

  // check if error is returned when no email is provided in the request body
  it("should return an error if no email is provided in the request body", async () => {

    const errorMessage = "Enter email to Insert Employee";

    const res = await request(app).post("/employee").send({});

    expect(res.statusCode).toBe(400); // check if status is 400 (Bad Request) when no email is provided in the request body
    expect(res.body.message).toEqual(errorMessage); // check error message
  });
});

describe('getEmployeeById', () => {
  it('should return an employee with the given empId', async () => {
    const res = await request(app).get('/employee/1')
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      "employee": expect.arrayContaining([
        expect.objectContaining({
          name: "John Doe",
          email: "john@doe.com",
          position: "Manager",
          office: "New York",
          location: "USA",
          empId: 1,
        }),
      ])
    });
  });

  it('should return an error message if no employee is found with the given empId', async () => {
    const res = await request(app).get('/employee/99');
    expect(res.statusCode).toEqual(404); // Not Found status code expected to be returned if empId does not exist in the database  
    expect(res.body).toEqual({ message: "Cannot find an Employee with the empId: 99" }); // Message value should be "Cannot find an Employee with the empId: 99"  
  });
});

describe('Update employee by ID', () => {
  it('should update employee information successfully', async () => {
    const empId = '1';

    const updatedEmployeeInfo = {
      name: 'John Doe',
      position: 'Manager',
      office: 'New York',
      location: 'California'
    };

    const res = await request(app).put(`/employee/${empId}`).send(updatedEmployeeInfo);

    expect(res.status).toBe(200);// check if status is 200 (OK) after updateing employee into the database
    expect(res.body).toEqual({ message: 'Employee successfully updated', employee: expect.objectContaining({
      name: "John Doe",
      email: "john@doe.com",
      position: 'Manager',
      office: 'New York',
      location: 'California',
      empId: 1,
    })
   });
  });

  it('should return an error message if the employee to be updated is not found', async () => {
    const wrongEmpId = '1234';

    const updatedEmployeeInfo = {
      name: 'John Doe',
      position: 'Manager',
      office: 'New York',
      location: 'California'
    };

    const res = await request(app).put(`/employee/${wrongEmpId}`).send(updatedEmployeeInfo);

    expect(res.statusCode).toEqual(404); // Not Found status code expected to be returned if empId does not exist in the database  

    expect(res.body).toEqual({ message: 'Error updating employee, not found' }); // Message value should be "Error updating employee, not found"  
  });
});

// test cases for getEmployee
describe("getEmployee", () => {

  //test checks to see if the function returns a list of employees with the correct information
  it("should return a list of employees", async () => {

    const res = await request(app).get("/employee/1");
    expect(res.statusCode).toBe(200); // check if status is 200 (OK) after getting employee from the database
    expect(res.body.employee).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "John Doe",
          email: "john@doe.com",
          position: 'Manager', 
          office: 'New York', 
          location: 'California',
          empId: 1,
        }),
      ])
    ); //check if employee contains inserted employee or not
  });
});

describe('Test that an employee is deleted when given a valid employee ID', () => {

  it('should delete the employee successfully', async () => {
    const empId = 1;
    const res = await request(app)
      .delete(`/employee/${empId}`);

    expect(res.statusCode).toEqual(200); // check if status is 200 (OK) after deleting employee from the database
    expect(res.body.message).toBe('Employee deleted successfully'); // Message value should be "Employee deleted successfully"  

  });
});

describe('Test that an error is returned if the given employee ID does not exist in the database', () => {

  it('should return an error message', async () => {

    const wrongEmpId = '1234'; // Wrong ID to test error res

    const res = await request(app)
      .delete(`/employee/${wrongEmpId}`);

    expect(res.statusCode).toBe(404); // Not Found status code expected to be returned if empId does not exist in the database  
    expect(res.body.message).toEqual("Employee not found") // Message value should be "Employee not found"  

  });  
});

describe('after deleting employee check get All employee', () =>{
  //test checks to see if the function returns an error message if there is a problem retrieving the employee data
  it("should return an error if there is a problem retrieving the employees", async () => {

    const errorMessage = "Employee Data is Not Found!";

    const res = await request(app).get("/employee");

    expect(res.statusCode).toBe(400); // check if status is 400 (Bad Request) when no data is available in database
    expect(res.body).toEqual({ message: errorMessage }); //check error message
  });
});

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
