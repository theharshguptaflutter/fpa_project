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
  doctorBookingFeedback:db.doctor_booking_feedback,
  Notes:db.notes,

  meetingRoom:db.meeting_room,
  Room:db.room,

  userBookingFeedback:db.user_booking_feedback,
  userRoomPermission:db.user_room_permission,
  RoomPermission:db.room_permission,
  doctorRoomPermission:db.doctor_room_permission,
  platformUsage:db.platform_usage,

};

module.exports = Object.freeze(tableNames);
