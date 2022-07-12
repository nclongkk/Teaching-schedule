const express = require("express");

const app = express();

app.use("/auth", require("./auth"));
app.use("/admin", require("./admin"));
app.use("/schedules", require("./schedules"));

module.exports = app;
