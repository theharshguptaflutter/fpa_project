const dbConfig = require("../config/dbConfig");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
});

try {
  sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

const db = {};

db.sequelize = sequelize;

db.users = require("../models/user/profile/user.model.js")(sequelize, DataTypes);

db.doctor_user = require("../models/doctor/profile/doctor.model.js")(
  sequelize,
  DataTypes
);
db.Otp = require("../models/resource/otp/otp.model.js")(sequelize, DataTypes);
db.access_token = require("../models/resource/access_token/access_tokens.model.js")(
  sequelize,
  DataTypes
);

db.city = require("../models/resource/city/city.model.js")(sequelize, DataTypes);
db.state = require("../models/resource/state/state.model.js")(sequelize, DataTypes);

db.category = require("../models/resource/category.model.js")(
  sequelize,
  DataTypes
);
db.doctor_category = require("../models/resource/doctor_category.model.js")(
  sequelize,
  DataTypes
);

db.role = require("../models/resource/role.model.js")(sequelize, DataTypes);

// db.sequelize.sync({ force: false }).then(() => {
//   console.log("yes re-sync done!");
// });

module.exports = { db, sequelize };
