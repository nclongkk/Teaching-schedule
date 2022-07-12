"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    static associate(models) {
      Schedule.belongsTo(models.User, {
        foreignKey: "teacherId",
        as: "teacher",
      });
    }
  }
  Schedule.init(
    {
      name: DataTypes.STRING,
      teacherId: DataTypes.INTEGER,
      day: DataTypes.INTEGER,
      from: DataTypes.STRING,
      to: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Schedule",
    }
  );
  return Schedule;
};
