module.exports = (sequelize, DataTypes) => {
  const doctor_booking_feedback = sequelize.define(
    "doctor_booking_feedback",
    {
      doctor_booking_feedback_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      appointment_booking_id: {
        type: DataTypes.INTEGER,
        defaultValue: null
      },
      user_id: {
        type: DataTypes.INTEGER,
        defaultValue: null
      },
      doctor_id: {
        type: DataTypes.INTEGER,
        defaultValue: null
      },
      stars: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
      },
      field1: {
        type: DataTypes.STRING,
        defaultValue: null
      },
      field2: {
        type: DataTypes.STRING,
        defaultValue: null
      },
      field3: {
        type: DataTypes.STRING,
        defaultValue: null
      },
      field4: {
        type: DataTypes.STRING,
        defaultValue: null
      },
      field5: {
        type: DataTypes.STRING,
        defaultValue: null
      },
      field6: {
        type: DataTypes.STRING,
        defaultValue: null
      },
      field7: {
        type: DataTypes.STRING,
        defaultValue: null
      },
      field8: {
        type: DataTypes.STRING,
        defaultValue: null
      },
      field9: {
        type: DataTypes.STRING,
        defaultValue: null
      },
      field10: {
        type: DataTypes.STRING,
        defaultValue: null
      },
      comment: {
        type: DataTypes.TEXT,
        defaultValue: null
      },
      delete_flag: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
      },
    },
    {
      createdAt: true,
      updatedAt: false,
    }
  );
  return doctor_booking_feedback;
};
