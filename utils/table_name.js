const { db, sequelize } = require("../utils/conn");

tableNames = {
  User: db.users,
  Otp: db.Otp,
  accessTokens: db.access_token,
  doctorUser: db.doctor_user,
  doctorCategory: db.doctor_category,
  Role: db.role,
  State: db.state,
  City: db.city,
  Category: db.category,
};

module.exports = Object.freeze(tableNames);
