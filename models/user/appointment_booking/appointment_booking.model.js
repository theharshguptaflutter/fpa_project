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

      menstrualHealth: {
        type: DataTypes.STRING,
        defaultValue: null,
      },

      contraceptive: {
        type: DataTypes.STRING,
        defaultValue: null,
      },

      sexualOrientationCounselling: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
        relationshipCounselling: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
        obstetricService: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
        gynecologyService: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
        abortionService: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
        stiRtiService: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
        hivManagement: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
        gbvSupport: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
        other: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
        payment_mode: {
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
