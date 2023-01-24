const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const users = require('./router/users');

app.use('/users', users);
//SET the server to listen at 3000
app.listen(3000, () =>
  console.log("Node server is running on http://localhost:3000")
);

module.exports = app