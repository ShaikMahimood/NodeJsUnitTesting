const express = require('express');

const employee = require('./controllers/employee');
const app = express();
app.use(express.json());

app.listen(4000, () => console.log('Node server is running on http://localhost:4000'));

app.use('/employee', employee);

module.exports = app;