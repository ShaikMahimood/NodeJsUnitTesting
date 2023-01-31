const fs = require('fs');

const products = "./asserts/products.json";

const { generateId, updateObject } = require('../helpers/utils');

function insert(productParams) {
    const { name, price } = productParams;
    return new Promise((resolve, reject) => {
        fs.readFile(products, (err, data) => {
            if (err) {
                reject(err);
            } else {
                let product = JSON.parse(data);
                product.push({ name, price, id: generateId(product) });
                fs.writeFile(products, JSON.stringify(product), (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(product);
                    }
                });
            }
        });
    });
}

function get() {
    return new Promise((resolve, reject) => {
        fs.readFile(products, (err, data) => {
            if (err) {
                reject(err);
            } else {
                const products = JSON.parse(data);
                if (products.length > 0) {
                    resolve(products);
                } else {
                    reject('No products found');
                }
            }
        });

    });
}

function getById(id) {
    return new Promise((resolve, reject) => {
        fs.readFile(products, 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                const products = JSON.parse(data);
                const product = products.find(p => p.id == id);
                if (product) {
                    resolve(product);
                } else {
                    reject('Product not found');
                }

            }
        });

    });
}

function update(productParams) {
    const { id, name, price } = productParams;
    return new Promise((resolve, reject) => {
        fs.readFile(products, async (err, data) => {
            if (err) {
                reject(err);
            } else {
                let product = JSON.parse(data);
                product.find(p => {
                    if (p.id != id)
                        reject(`Product ${id} was not found`);
                });
                // find the product with the given id and update its fields 
                const updatedData = await product.map(product => {
                    if (product.id == id) {

                        let updated = updateObject(product, productParams);
                        return updated;
                    }
                    return product;
                });
                fs.writeFile(products, JSON.stringify(updatedData), (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(updatedData);
                    }
                });
            }
        });
    });
}

function deleteById(id) {
    return new Promise((resolve, reject) => {
        fs.readFile(products, (err, data) => {
            if (err) {
                reject(err);
            } else {
                const product = JSON.parse(data);
                const filterProducts = product.filter(p => p.id != id);

                if(product.length == filterProducts.length) resolve(false); 
                
                fs.writeFile(products, JSON.stringify(filterProducts), (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(true);
                    }
                });
            }
        });
    });
}

module.exports = { insert, get, getById, update, deleteById };