const express = require("express");
const {
  addSchedule,
  getListSchedules,
  getListSchedulesByTeacher,
  removeSchedule,
  updateSchedule,
  getListSchedulesByTeacherId,
} = require("../controllers/schedules");
const { authenticate } = require("../middleware/auth");

const router = express.Router();
router.use(authenticate);
router.route("/").post(addSchedule).get(getListSchedules);
router.route("/teachers").get(getListSchedulesByTeacher);
router.route("/teachers/:id").get(getListSchedulesByTeacherId);
router.route("/:id").delete(removeSchedule).patch(updateSchedule);

module.exports = router;
