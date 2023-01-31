const request = require('supertest');
const app = require('../app');
const fs = require('fs');
const { deleteProduct } = require('../controller/product');
const products = './asserts/products.json';

beforeAll(() => {
    return new Promise((resolve, reject) => {
        fs.readFile(products, (err, data) => {
            if (err) reject(err);
            let json = JSON.parse(data);
            json.length = 0;
            fs.writeFile(products, JSON.stringify(json), (err) => {
                if (err) reject(err);
                resolve();  // resolves the promise with no parameters 
            });
        });
    });
});

//getAllProducts Test Case to test product before inseted data in json file
describe('getAllProducts Test Cases', () => {
    test('should return a 400 error if there is a problem', done => {  
        request(app)   
            .get('/products')   
            .then(response => {    //the response should contain a message with the error details 
                expect(response.statusCode).toBe(400);   //asserts that the status code is 400 for this specific case  
                expect(response.body.message).toEqual('No products found'); // Message value should be "No products found"  
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

describe('Get Product By Id Test Cases', () => {
    test('should retrieve the product with the given ID from the products array', async () => {
        const id = '1';

        const response = await request(app).get(`/products/${id}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ "id": 1, "name": "Test Product", "price": 10 });  // expected value 
    });
    test('should return a 404 status code if the product is not found', async () => {
        const id = '0';

        const response = await request(app).get(`/products/${id}`);

        expect(response.statusCode).toBe(404);   // Not Found status code expected to be returned if product id does not exist in the database
        expect(response.body.message).toEqual('Product not found'); // Message value should be "Product not found"  
    });
});

describe('updateProduct Text Cases', () => {
    test('should update the product successfully', async () => {
        const response = await request(app)
            .put('/products')
            .send({ id: 1, name: 'iPhone 14' });

        expect(response.status).toBe(200);
        expect(response.body.data).toEqual([{ "id": 1, "name": "iPhone 14", "price": 10 }]);
    });

    test('should return an error if no product is provided', async () => {
        const response = await request(app)
            .put('/products');

        expect(response.status).toBe(400);   // expected 500 status code for error response 
        expect(response.body.message).toBeDefined(); // expecting error to be defined in response body    
    });
    test('should return a 404 status code if the product is not found', async () => {
        const response = await request(app)
            .put('/products').send({ id: 0, name: 'iPhone 13' });

        expect(response.status).toBe(400);   // expected 500 status code for error response 
        expect(response.body.message).toEqual('Product 0 was not found'); // Message value should be "Product not found"  
    });
});

describe('deleteProduct Test Cases', () => {
    it('should successfully delete a product', () => {
        const request = { params: { id: 1 } }; // sample request object
        const response = {
            status: (code) => {
                expect(code).toBe(200); // assert on the response code
                return {
                    json: (data) => { // assert on the response body data 
                        expect(data.message).toBe(`Product 1 was deleted succesfully`);
                    }
                }
            }
        };
        deleteProduct(request, response); // call function to be tested  
    });

    it('should not delete a non-existent product', () => {
        const request = { params: { id: 0 } }; // sample request object
        const response = {
            status: (code) => {  // assert on the response code  
                expect(code).toBe(404);
                return {
                    json: (data) => { // assert on the response body data  
                        expect(data.message).toBe(`Product 0 was not found`);
                    }
                }
            }
        };
        deleteProduct(request, response); // call function to be tested    
    });
});
