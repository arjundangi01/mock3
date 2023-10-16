const express = require("express");
const UserModel = require("../model/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  const checkForAlreadyRegisteredUser = await UserModel.findOne({ email });
  if (checkForAlreadyRegisteredUser) {
    return res.send({ message: "User Is Already Registered" });
  }

  bcrypt.hash(password, 5, async function (err, hash) {
    const newRegisteredUser = await UserModel.create({
      email,
      password: hash,
    });

    res.send({ message: "User Registration Successful", newRegisteredUser });
  });
});

//
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  //checking for user is presentInDataBase
  const userInDataBase = await UserModel.findOne({ email });
  if (!userInDataBase) {
    return res.send({ message: "user not found " });
  } else {
    bcrypt.compare(password, userInDataBase.password, function (err, result) {
      // result == true
      if (result) {
        let userToken = jwt.sign(
          { userId: userInDataBase._id },
          "thisIsSecretKey"
        );

        return res.send({ message: "User Login Successful ", userToken });
      } else {
        return res.send({ message: "Entered Wrong Credentials" });
      }
    });
  }
});

module.exports = userRouter;
