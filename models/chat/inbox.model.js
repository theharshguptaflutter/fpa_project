module.exports = (sequelize, DataTypes) => {
  const inbox = sequelize.define(
    "inbox",
    {
      inbox_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      appointment_booking_id: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
      user_id: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
      doctor_id: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
      chat_complete_flag: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
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
  return inbox;
};
