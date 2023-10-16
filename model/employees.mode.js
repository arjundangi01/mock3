const mongoose = require("mongoose");

const employeeSchema = mongoose.Schema({
  employeeFirstName: String,
  employeeLastName: String,
  employeeEmail: String,
  employeeDepartment: {
    type: String,
    enum: ["tech", "marketing", "operations"],
  },
  employeeSalary: Number,
});

const EmployeeModel = mongoose.model("employee", employeeSchema);

module.exports = EmployeeModel;
