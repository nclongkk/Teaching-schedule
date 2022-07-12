const httpStatus = require("http-status");
const jwt = require("jsonwebtoken");
const { User, CodeVerify, sequelize } = require("../models");

const getSignedJwtToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

exports.register = async (req, res) => {
  try {
    const user = await User.create(req.body);
    const token = getSignedJwtToken(user.id);
    const options = {
      httpOnly: true,
    };
    return res.status(httpStatus.CREATED).json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).json({ success: false, error });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Dont't have an account",
      });
    }
    if (password !== user.password) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Password is incorrect",
      });
    }

    const token = getSignedJwtToken(user.id);
    const options = {
      httpOnly: true,
    };
    return res.status(httpStatus.OK).json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).json({ success: false, error });
  }
};

exports.getMe = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findOne({ where: { id } });
    return res.status(httpStatus.OK).json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).json({ success: false, error });
  }
};

exports.updateInfo = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Dont't have an account",
      });
    }
    const { name, email, avatar, password } = req.body;
    await user.update({ name, email, avatar, password });
    return res.status(httpStatus.OK).json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).json({ success: false, error });
  }
};
