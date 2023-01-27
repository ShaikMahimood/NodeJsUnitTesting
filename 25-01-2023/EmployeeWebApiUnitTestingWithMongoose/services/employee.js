const Employee = require("../models/employee");


function InsertEmployee(req, res) {
  try {
    const { name, email, position, office, location } = req.body;
    if (email != null) {
      const emp = new Employee({
        name,
        email,
        position,
        office,
        location,
      });
      return emp.save((err, doc) => {
        if (!err) res.status(200).send(doc);
        else
          return res.status(400).send({
            message: "Error in inserting Employee : ",
            err,
          });
      });
    }
    return res.status(400).send({
      message: "Enter email to Insert Employee",
    });
  } catch (error) {
    return res.status(400).send({
      message: "Error in inserting Employee : ",
      error,
    });
  }
}

function getEmployee(req, res) {
  Employee.find()
    .then((employee) => {
      if (!employee.length) throw 'Employee Data is Not Found!';
      res.status(200).json({ employee });
    })
    .catch((err) => {
      return res.status(400).send({
        message: err
      });
    });
}

function getEmployeeById(req, res) {
  const empId = req.params.empId;
  Employee.find({ empId: empId }, (err, employee) => {
    if (err) res.json(err.message);
    else if (!employee.length)
      res
        .status(404)
        .json({ message: "Cannot find an Employee with the empId: " + req.params.empId });
    else res.status(200).json({ employee });
  });
}

function updateEmployeeById(req, res) {
  const {
    params: { empId },
    body: { name, position, office, location },
  } = req;

  const emp = {
    name,
    position,
    office,
    location,
  };
  Employee.findOneAndUpdate({empId: empId}, emp, {new: true}, (err, updatedEmployee) => {
    if (err) {
      return res.status(500).send({ message: 'Error updating employee' });
    }
  
    // return a response with the updated employee details
    if (updatedEmployee) {
      res.status(200).send({ message: 'Employee successfully updated', employee: updatedEmployee });
    } else {
      res.status(404).send({ message: 'Error updating employee, not found'});
    } 
  });
}

function deleteEmployeeById(req, res) {
  const { empId } = req.params;

  Employee.findOneAndDelete({ empId: empId }, function(err, employee) {
    if (err) return res.status(400).json({ error: err });
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    return res.status(200).json({ message: "Employee deleted successfully" });
  });
};

module.exports = {
  getEmployee,
  getEmployeeById,
  InsertEmployee,
  updateEmployeeById,
  deleteEmployeeById,
};
