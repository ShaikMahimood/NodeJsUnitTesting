const request = require('supertest');
const app = require('../app');

const products = require('../asserts/products.json');

//getAllProducts Test Case to test product before inseted data in json file
describe('getAllProducts Test Cases', () => {
    test('should return a 400 error if there is a problem', done => {  //this test mocks an error that could occur when trying to get the products from the database 
        request(app)   //it should return a 400 status code in this case 
            .get('/products')   //GET request to get the products from the API endpoint  
            .then(response => {    //the response should contain a message with the error details 
                expect(response.statusCode).toBe(400);   //asserts that the status code is 400 for this specific case  
                expect(response.body.message).toBeDefined();  //asserts that there is a message defined in the response body containing details about the error   
                done();   //tells Jest that the test is done so it can finish running it  
            });
    });
})

describe('insertProduct Test Cases', () => {
    test('should successfully insert a product', async () => {
        const body = {
            name: 'Test Product',
            price: 10.00
        };

        const res = await request(app).post('/products').send(body);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([{ "id": 1, "name": "Test Product", "price": 10 }]);
    });
    test('should throw error if name and price is missing', async () => {

        const body = {};

        const res = await request(app).post('/products').send(body);

        expect(res.statusCode).toBe(400);  // or whatever status code you set for an error condition in the API call 
        expect(res.body).toBe("Enter name and price values");   // or whatever message you set for an error condition in the API call  
    });
});

//getAllProducts Test Cases after inserted product in json data
describe('getAllProducts Test Cases', () => {
    test('should return an array of products', done => {
        request(app)
            .get('/products')
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(Array.isArray(response.body.products)).toBeTruthy();  //asserts that the response body contains an array of products       
                done();  //tells Jest that the test is done so it can finish running it 
            });
    });
})
