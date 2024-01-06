module.exports = (sequelize, DataTypes) => {
  const appointment_booking = sequelize.define(
    "appointment_booking",
    {
      appointment_booking_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
      doctor_id: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
      user_booking_price: {
        type: DataTypes.BIGINT,
        defaultValue: null,
      },
      total_booking_price: {
        type: DataTypes.BIGINT,
        defaultValue: null,
      },
      booking_status_id: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
      order_status: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      booked_current_date: {
        type: DataTypes.DATEONLY,
        defaultValue: null,
      },
      booked_current_time: {
        type: DataTypes.TIME,
        defaultValue: null,
      },
      user_review_flag: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
      },
      doctor_review_flag: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
      },
      appointment_delete_flag: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
      },
    },
    {
      createdAt: true,
      updatedAt: false,
    }
  );
  return appointment_booking;
};
