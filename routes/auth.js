const express = require("express");
const { register, login, getMe, updateInfo } = require("../controllers/auth");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.use(authenticate);
router.route("/me").get(getMe).patch(updateInfo);

module.exports = router;
