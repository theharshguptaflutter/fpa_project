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
  chatMessage: db.chat_message,
  Inbox: db.inbox,
  chatMessagesLog: db.chat_message_log,
  appointmentBooking:db.appointment_booking,
  bookingStatus:db.booking_status,
  clientAccessToken:db.client_access_token,
};

module.exports = Object.freeze(tableNames);
