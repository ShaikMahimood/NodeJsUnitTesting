const fs = require('fs');

const products = "./asserts/products.json";

const { generateId} = require('../helpers/utils');

function insert(productParams) {
    const { name, price} = productParams;
    return new Promise((resolve, reject) => {
        fs.readFile(products, (err, data) => {
            if (err) {
                reject(err);
            } else {
                let product = JSON.parse(data);
                product.push({name, price, id: generateId(product)});
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

module.exports = { insert, get };