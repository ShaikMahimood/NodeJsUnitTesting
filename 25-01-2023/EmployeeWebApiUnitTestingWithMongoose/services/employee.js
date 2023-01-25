const Employee = require("../models/employee");

function getEmployee(req, res) {
  Employee.find()
    .then((employee) => {
      if (!employee.length) throw 'Employee Data is Not Found!';
      res.status(200).json({ employees: employee });
    })
    .catch((err) => {
      return res.status(400).send({
        message: err
      });
    });
}

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

function getEmployeeById(req, res) {
  const empId = { empId: req.params.empId };
  Employee.find(empId, (err, employee) => {
    if (err) res.json(err.message);
    else if (employee == "")
      res
        .status(400)
        .json("Cannot find an Employee with the empId: " + req.params.empId);
    else res.status(200).json({ employee: employee });
  });
}

function updateEmployeeById(req, res) {
  const {
    params: { empId },
    body: { name, position, office, location },
  } = req;

  const emp = {
    $set: {
      name,
      position,
      office,
      location,
    },
  };
  Employee.findOneAndUpdate(empId, emp, { new: true })
    .then((employee) => {
      if (!employee) {
        return res.status(400).send({
          message: "Employee not found with id " + req.params.empId,
        });
      }
      res.status(200).send(emp);
    })
    .catch((err) => {
      return res.status(400).send({
        message:
          "Error updating Employee with id : " +
          req.params.empId +
          " Error: " +
          err,
      });
    });
}

function deleteEmployeeById(req, res) {
  const empId = { empId: req.params.empId };

  Employee.findOneAndDeconste(empId)
    .then((employee) => {
      if (employee) {
        return res.status(200).send({
          message: "Employee Delete with the empId: " + req.params.empId,
        });
      }
      return res.status(400).send({
        message: "Employee not found with id " + req.params.empId,
      });
    })
    .catch((err) => {
      return res.status(400).send({
        message:
          "Error in Delete Employee : " + req.params.empId + " Error: " + err,
      });
    });
}

module.exports = {
  getEmployee,
  getEmployeeById,
  InsertEmployee,
  updateEmployeeById,
  deleteEmployeeById,
};
