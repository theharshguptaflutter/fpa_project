const { db, sequelize } = require("../utils/conn");

tableNames = {
  User: db.users,
  Otp: db.Otp,
  accessTokens: db.access_token,
  doctorUser:db.doctor_user,
};

module.exports = Object.freeze(tableNames);
