const express = require("express");
const authorizeMiddleware = require("../middlewares/authorizeMiddleware");
const EmployeeModel = require("../model/employees.mode");

const employeeRouter = express.Router();

employeeRouter.get("/", authorizeMiddleware, async (req, res) => {
  try {
    const { findByName, filterByDepartment, sortOn, page } = req.query;

    let skipBy = page * 5 - 5;

    let filterObj = {};
    if (findByName) {
      filterObj["employeeFirstName"] = findByName;
    }
    if (filterByDepartment) {
      filterObj["employeeDepartment"] = filterByDepartment;
    }

    let employeeDataForResponse;

    if (sortOn) {
      if (sortOn == "asc") {
        employeeDataForResponse = await EmployeeModel.find(filterObj)
          .sort({
            employeeSalary: 1,
          })
          .skip(skipBy)
          .limit(5);
      } else {
        employeeDataForResponse = await EmployeeModel.find(filterObj)
          .sort({
            employeeSalary: -1,
          })
          .skip(skipBy)
          .limit(5);
      }
    } else {
      employeeDataForResponse = await EmployeeModel.find(filterObj)
        .skip(skipBy)
        .limit(5);
    }

    res.send(employeeDataForResponse);
  } catch (error) {
    console.log("error while getting employee request", error);
  }
});

employeeRouter.post("/", authorizeMiddleware, async (req, res) => {
  try {
    const {
      employeeFirstName,
      employeeLastName,
      employeeEmail,
      employeeDepartment,
      employeeSalary,
    } = req.body;

    const newEmployeeAddedInDataBase = await EmployeeModel.create({
      employeeFirstName,
      employeeLastName,
      employeeEmail,
      employeeDepartment,
      employeeSalary,
    });

    res
      .status(200)
      .send({ message: "New Employee Added", newEmployeeAddedInDataBase });
  } catch (error) {
    console.log("Error in employee post  request", error);
  }
});



employeeRouter.patch("/:employeeId", authorizeMiddleware, async (req, res) => {
  try {
    const input = req.body;
    const { employeeId } = req.params;

    const checkForEmployeePresentInDataBase = await EmployeeModel.findOne({
      _id: employeeId,
    });
    if (checkForEmployeePresentInDataBase) {
      const updatedEmployee = await EmployeeModel.updateOne(
        { _id: employeeId },
        input
      );
      res.status(200).send("Employee Updated");
    } else {
      res.status(400).send("Employee Not Found");
    }
  } catch (error) {
    console.log("Error in employee patch  request", error);
  }
});



employeeRouter.delete("/:employeeId", authorizeMiddleware, async (req, res) => {
  try {
    const { employeeId } = req.params;
      console.log(employeeId)
    const checkForEmployeePresentInDataBase = await EmployeeModel.findOne({
      _id: employeeId,
    });

    if (checkForEmployeePresentInDataBase) {
      await EmployeeModel.deleteOne({ _id: employeeId });
      res.status(200).send("Employee Deleted");
    } else {
      res.status(400).send("Employee Not Found");
    }
  } catch (error) {
    console.log("Error in employee delete request", error);
  }
});

module.exports = employeeRouter;
