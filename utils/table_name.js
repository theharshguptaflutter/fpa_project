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
  appointmentBooking: db.appointment_booking,
  bookingStatus: db.booking_status,
  clientAccessToken: db.client_access_token,
  userAnalytics: db.user_analytics,
  eventTypes: db.event_types,
  doctorAnalytics:db.doctor_analytics,
  clientHistoryCard:db.client_history_card,
  Gallery:db.gallery,
  bookingFeedback:db.booking_feedback,
};

module.exports = Object.freeze(tableNames);
