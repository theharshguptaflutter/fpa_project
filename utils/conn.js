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

db.users = require("../models/user/profile/user.model.js")(
  sequelize,
  DataTypes
);

db.doctor_user = require("../models/doctor/profile/doctor.model.js")(
  sequelize,
  DataTypes
);
db.Otp = require("../models/resource/otp/otp.model.js")(sequelize, DataTypes);
db.access_token =
  require("../models/resource/access_token/access_tokens.model.js")(
    sequelize,
    DataTypes
  );

db.city = require("../models/resource/city/city.model.js")(
  sequelize,
  DataTypes
);
db.state = require("../models/resource/state/state.model.js")(
  sequelize,
  DataTypes
);

db.category = require("../models/resource/category.model.js")(
  sequelize,
  DataTypes
);
db.doctor_category = require("../models/resource/doctor_category.model.js")(
  sequelize,
  DataTypes
);

db.chat_message = require("../models/chat/chat_message.model.js")(
  sequelize,
  DataTypes
);
db.chat_message_log = require("../models/chat/chat_message_log.model.js")(
  sequelize,
  DataTypes
);
db.appointment_booking =
  require("../models/user/appointment_booking/appointment_booking.model.js")(
    sequelize,
    DataTypes
  );
db.booking_status =
  require("../models/resource/booking_status/booking_status.model.js")(
    sequelize,
    DataTypes
  );

db.inbox = require("../models/chat/inbox.model.js")(sequelize, DataTypes);

db.role = require("../models/resource/role.model.js")(sequelize, DataTypes);
db.client_access_token =
  require("../models/resource/client_access_token/client_id_access_token.model.js")(
    sequelize,
    DataTypes
  );

// db.sequelize.sync({ force: false }).then(() => {
//   console.log("yes re-sync done!");
// });

//access toekn tb link
db.access_token.belongsTo(db.users, {
  foreignKey: "user_id", // foreign table
  targetKey: "user_id", // primary table
});
db.access_token.belongsTo(db.doctor_user, {
  foreignKey: "doctor_id", // foreign table
  targetKey: "doctor_id", // primary table
});

//appointment table link
db.appointment_booking.belongsTo(db.users, {
  foreignKey: "user_id", // foreign table
  targetKey: "user_id", // primary table
  uniqueKey: "apppintment_type_fk",
});

db.appointment_booking.belongsTo(db.doctor_user, {
  foreignKey: "doctor_id", // foreign table
  targetKey: "doctor_id", // primary table
});

//booking_status table link
db.appointment_booking.belongsTo(db.booking_status, {
  foreignKey: "booking_status_id", // foreign table
  targetKey: "booking_status_id", // primary table
});
db.appointment_booking.belongsTo(db.users, {
  foreignKey: "user_id", // foreign table
  targetKey: "user_id", // primary table
});

//chat message table  link
db.chat_message.belongsTo(db.inbox, {
  foreignKey: "inbox_id", // foreign table
  targetKey: "inbox_id", // primary table
});

//user chat log table link
db.chat_message_log.belongsTo(db.users, {
  foreignKey: "user_id", // foreign table
  targetKey: "user_id", // primary table
});
db.chat_message_log.belongsTo(db.doctor_user, {
  foreignKey: "doctor_id", // foreign table
  targetKey: "doctor_id", // primary table
});

//city table link
db.city.belongsTo(db.state, {
  foreignKey: "state_id", // foreign table
  targetKey: "state_id", // primary table
});

//user city table  link
db.users.belongsTo(db.state, {
  foreignKey: "state_id", // foreign table
  targetKey: "state_id", // primary table
});

//user city table  link
db.users.belongsTo(db.city, {
  foreignKey: "city_id", // foreign table
  targetKey: "city_id", // primary table
});

//doctor city and state table link
db.doctor_user.belongsTo(db.state, {
  foreignKey: "state_id", // foreign table
  targetKey: "state_id", // primary table
});

db.doctor_user.belongsTo(db.city, {
  foreignKey: "city_id", // foreign table
  targetKey: "city_id", // primary table
});

//doctor category table link
db.doctor_category.belongsTo(db.category, {
  foreignKey: "category_id", // foreign table
  targetKey: "category_id", // primary table
});

db.doctor_category.belongsTo(db.doctor_user, {
  foreignKey: "doctor_id", // foreign table
  targetKey: "doctor_id", // primary table
});

//inbox table link

db.inbox.belongsTo(db.appointment_booking, {
  foreignKey: "appointment_booking_id", // foreign table
  targetKey: "appointment_booking_id", // primary table
});

db.inbox.belongsTo(db.users, {
  foreignKey: "user_id", // foreign table
  targetKey: "user_id", // primary table
});

db.inbox.belongsTo(db.doctor_user, {
  foreignKey: "doctor_id", // foreign table
  targetKey: "doctor_id", // primary table
});

//otp  tb link
db.Otp.belongsTo(db.users, {
  foreignKey: "user_id", // foreign table
  targetKey: "user_id", // primary table
});
db.Otp.belongsTo(db.doctor_user, {
  foreignKey: "doctor_id", // foreign table
  targetKey: "doctor_id", // primary table
});

// role
db.users.belongsTo(db.role, {
  foreignKey: "role_id", // foreign table
  targetKey: "role_id", // primary table
});

db.users.hasMany(db.appointment_booking, {
  foreignKey: "user_id",
});

db.doctor_user.hasMany(db.appointment_booking, {
  foreignKey: "doctor_id",
});

db.booking_status.hasMany(db.appointment_booking, {
  foreignKey: "booking_status_id",
});

//cliend access code
db.client_access_token.belongsTo(db.users, {
  foreignKey: "user_id", // foreign table
  targetKey: "user_id", // primary table
});

db.client_access_token.belongsTo(db.doctor_user, {
  foreignKey: "doctor_id", // foreign table
  targetKey: "doctor_id", // primary table
});

module.exports = { db, sequelize };
