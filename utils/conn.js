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

db.user_analytics =
  require("../models/admin/analytics/user_analytics/user_analytics.model.js")(
    sequelize,
    DataTypes
  );

db.event_types = require("../models/resource/event_type/event_types.model.js")(
  sequelize,
  DataTypes
);

db.doctor_analytics =
  require("../models/admin/analytics/doctor_analytics/doctor_analytics.model.js")(
    sequelize,
    DataTypes
  );

db.client_history_card =
  require("../models/user/appointment_booking/client_history_card.model.js")(
    sequelize,
    DataTypes
  );

db.gallery = require("../models/resource/gallery/gallery.model.js")(
  sequelize,
  DataTypes
);
db.doctor_booking_feedback = require("../models/doctor/feedback/feedback.model.js")(
  sequelize,
  DataTypes
);


db.user_booking_feedback = require("../models/user/feedback/feedback.model.js")(
  sequelize,
  DataTypes
);
db.notes = require("../models/doctor/notes/notes.model.js")(
  sequelize,
  DataTypes
);
db.meeting_room =
  require("../models/resource/meeting_room/meeting_room.model.js")(
    sequelize,
    DataTypes
  );

db.room = require("../models/resource/meeting_room/room_model.js")(
  sequelize,
  DataTypes
);
db.room_permission = require("../models/resource/room_permission/room_permission.model.js")(
  sequelize,
  DataTypes
);
db.user_room_permission = require("../models/admin/user_room_permission/user_room_permission.js")(
  sequelize,
  DataTypes
);
db.doctor_room_permission = require("../models/admin/doctor_room_permission/doctor_room_permission.js")(
  sequelize,
  DataTypes
);

db.platform_usage = require("../models/resource/platform_usage/platform_usage.model.js")(
  sequelize,
  DataTypes
);


// db.sequelize.sync({ force: false }).then(() => {
//   console.log("yes re-sync done!");
//  });


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

//user_analytics
db.user_analytics.belongsTo(db.users, {
  foreignKey: "user_id", // foreign table
  targetKey: "user_id", // primary table
});

db.user_analytics.belongsTo(db.event_types, {
  foreignKey: "event_types_id", // foreign table
  targetKey: "event_types_id", // primary table
});
db.event_types.hasMany(db.user_analytics, {
  foreignKey: "event_types_id",
});
db.client_history_card.belongsTo(db.users, {
  foreignKey: "user_id", // foreign table
  targetKey: "user_id", // primary table
});

//doctor analytics
db.doctor_analytics.belongsTo(db.doctor_user, {
  foreignKey: "doctor_id", // foreign table
  targetKey: "doctor_id", // primary table
});

db.doctor_analytics.belongsTo(db.event_types, {
  foreignKey: "event_types_id", // foreign table
  targetKey: "event_types_id", // primary table
});

//feedback section
db.doctor_booking_feedback.belongsTo(db.appointment_booking, {
  foreignKey: "appointment_booking_id", // foreign table
  targetKey: "appointment_booking_id", // primary table
});

db.doctor_booking_feedback.belongsTo(db.users, {
  foreignKey: "user_id", // foreign table
  targetKey: "user_id", // primary table
});

db.doctor_booking_feedback.belongsTo(db.doctor_user, {
  foreignKey: "doctor_id", // foreign table
  targetKey: "doctor_id", // primary table
});

db.notes.belongsTo(db.appointment_booking, {
  foreignKey: "appointment_booking_id", // foreign table
  targetKey: "appointment_booking_id", // primary table
});

/////////////////////////////////////
db.user_booking_feedback.belongsTo(db.appointment_booking, {
  foreignKey: "appointment_booking_id", // foreign table
  targetKey: "appointment_booking_id", // primary table
});
db.user_booking_feedback.belongsTo(db.users, {
  foreignKey: "user_id", // foreign table
  targetKey: "user_id", // primary table
});

db.user_booking_feedback.belongsTo(db.doctor_user, {
  foreignKey: "doctor_id", // foreign table
  targetKey: "doctor_id", // primary table
});


//meeting room
db.meeting_room.belongsTo(db.appointment_booking, {
  foreignKey: "appointment_booking_id", // foreign table
  targetKey: "appointment_booking_id", // primary table
});


db.meeting_room.belongsTo(db.room, {
  foreignKey: "room_id", // foreign table
  targetKey: "room_id", // primary table
});

db.doctor_user.belongsTo(db.room, {
  foreignKey: "doctor_id", // foreign table
  targetKey: "doctor_id", // primary table
});


db.appointment_booking.hasOne(db.meeting_room, {
  foreignKey: "appointment_booking_id",
});

db.room.hasOne(db.meeting_room, {
  foreignKey: "room_id",
});

db.doctor_user.hasMany(db.appointment_booking, {
  foreignKey: "doctor_id",
});


db.user_room_permission.belongsTo(db.users, {
  foreignKey: "user_id", // foreign table
  targetKey: "user_id", // primary table
});

db.user_room_permission.belongsTo(db.room_permission, {
  foreignKey: "room_permission_id", // foreign table
  targetKey: "room_permission_id", // primary table
});

db.users.hasMany(db.user_room_permission, {
  foreignKey: "user_id",
});

db.room_permission.hasMany(db.user_room_permission, {
  foreignKey: "room_permission_id",
});


//doctor room permission
db.doctor_room_permission.belongsTo(db.doctor_user, {
  foreignKey: "doctor_id", // foreign table
  targetKey: "doctor_id", // primary table
});

db.doctor_room_permission.belongsTo(db.room_permission, {
  foreignKey: "room_permission_id", // foreign table
  targetKey: "room_permission_id", // primary table
});

db.doctor_user.hasMany(db.doctor_room_permission, {
  foreignKey: "doctor_id",
});

module.exports = { db, sequelize };