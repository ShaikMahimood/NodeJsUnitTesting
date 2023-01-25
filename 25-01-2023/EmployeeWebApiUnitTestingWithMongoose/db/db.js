const mongoose = require('mongoose');
require("dotenv/config");

mongoose.connect(process.env.dbconnection, (err) => {
if (!err) {
    console.log('Successfully Connected to MongoDB')
}
else {
    console.log('Failed to Connect MongoDB  '+ err)
}
});

module.exports = mongoose;