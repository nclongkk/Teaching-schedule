const httpStatus = require("http-status");
const { Course, User, Schedule } = require("../models");
const { Op, and, or, where } = require("sequelize");
const { ROLES } = require("../constants/constants");
const { validateTime } = require("../utils/validate-time");

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

exports.addSchedule = async (req, res) => {
  try {
    await verifyAdmin(req, res);
    const schedules = req.body.schedules;
    console.log(schedules);
    schedules.forEach((schedule) => {
      if (!validateTime(schedule.from) || !validateTime(schedule.to)) {
        throw new Error("Time is invalid, please format like hh:mm");
      }
    });

    //await bulk create
    const result = await Schedule.bulkCreate(schedules);
    return res.status(httpStatus.CREATED).json({
      message: "Schedule added successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(httpStatus.BAD_REQUEST).json({ error: error.message });
  }
};

exports.getListSchedules = async (req, res) => {
  try {
    await verifyAdmin(req, res);
    const schedules = await Schedule.findAll({
      include: [
        {
          model: User,
          as: "teacher",
          attributes: ["name", "email"],
        },
      ],
    });
    return res.status(httpStatus.OK).json({
      message: "List schedules",
      schedules,
    });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ error: error.message });
  }
};

exports.getListSchedulesByTeacher = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findOne({ where: { id } });
    if (user.role !== "teacher") {
      throw new Error("You are not teacher");
    }
    const schedules = await Schedule.findAll({
      where: { teacherId: user.id },
      include: [
        {
          model: User,
          as: "teacher",
          attributes: ["name", "email"],
        },
      ],
    });
    return res.status(httpStatus.OK).json({
      message: "List schedules",
      schedules,
    });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ error: error.message });
  }
};

exports.removeSchedule = async (req, res) => {
  try {
    await verifyAdmin(req, res);
    const { id } = req.params;
    const schedule = await Schedule.findOne({ where: { id } });
    if (!schedule) {
      throw new Error("Schedule not found");
    }
    await schedule.destroy();
    return res.status(httpStatus.OK).json({
      message: "Schedule removed successfully",
    });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ error: error.message });
  }
};

exports.updateSchedule = async (req, res) => {
  try {
    await verifyAdmin(req, res);
    const { id } = req.params;
    const schedule = await Schedule.findOne({ where: { id } });
    if (!schedule) {
      throw new Error("Schedule not found");
    }
    const { from, to } = req.body;
    if (!validateTime(from) || !validateTime(to)) {
      throw new Error("Time is invalid, please format like hh:mm");
    }

    await schedule.update(req.body);
    return res.status(httpStatus.OK).json({
      message: "Schedule updated successfully",
    });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ error: error.message });
  }
};

exports.getListSchedulesByTeacherId = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await User.findOne({ where: { id } });
    const schedules = await Schedule.findAll({
      where: { teacherId: id },
      include: [
        {
          model: User,
          as: "teacher",
          attributes: ["name", "email"],
        },
      ],
    });
    return res.status(httpStatus.OK).json({
      message: "List schedules",
      schedules,
      teacher,
    });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ error: error.message });
  }
};
