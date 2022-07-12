const express = require("express");
const { addTeacher, getListTeachers } = require("../controllers/admin");
const { authenticate } = require("../middleware/auth");

const router = express.Router();
router.use(authenticate);
router.route("/teachers").get(getListTeachers).post(addTeacher);

module.exports = router;
