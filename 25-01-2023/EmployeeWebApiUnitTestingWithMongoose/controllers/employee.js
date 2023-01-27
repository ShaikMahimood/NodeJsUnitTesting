const express = require('express');
let router = express.Router();

const { getEmployee, getEmployeeById, InsertEmployee, updateEmployeeById, deleteEmployeeById } = require('../services/employee');

// localhost:4040/employees/
router.get('/', getEmployee);

router.post('/', InsertEmployee);

router.get('/:empId', getEmployeeById);

router.put('/:empId', updateEmployeeById);

router.delete('/:empId', deleteEmployeeById);

module.exports = router;