const { db, sequelize } = require("../utils/conn");

tableNames = {
  User: db.users,
  Otp: db.Otp,
};

module.exports = Object.freeze(tableNames);
