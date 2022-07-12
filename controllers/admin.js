const httpStatus = require("http-status");
const { Course, User, Category } = require("../models");
const { Op, and, or, where } = require("sequelize");
const { ROLES } = require("../constants/constants");

const verifyAdmin = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findOne({ where: { id } });
    if (user.role !== "admin") {
      throw new Error("You are not admin");
    }
    return;
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.addTeacher = async (req, res) => {
  try {
    await verifyAdmin(req, res);
    const { email, name, avatar } = req.body;
    const user = await User.findOne({ where: { email } });
    if (user) {
      throw new Error("teacher already exists");
    }
    const newUser = await User.create({
      name,
      email,
      avatar,
      password: "123456",
      role: ROLES.TEACHER,
    });
    return res.status(httpStatus.CREATED).json({
      message: "teacher added successfully",
      data: newUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(httpStatus.BAD_REQUEST).json({ error: error.message });
  }
};

exports.getListTeachers = async (req, res) => {
  try {
    const teachers = await User.findAll({
      where: { role: ROLES.TEACHER },
    });
    return res.status(httpStatus.OK).json({
      message: "List teachers",
      teachers,
    });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ error: error.message });
  }
};
