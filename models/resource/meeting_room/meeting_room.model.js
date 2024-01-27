module.exports = (sequelize, DataTypes) => {
  const meeting_room = sequelize.define(
    "meeting_room",
    {
      meeting_room_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      appointment_booking_id: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
      room_id: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
      meeting_room_active: {
        type: DataTypes.TINYINT,
        defaultValue: null,
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
  return meeting_room;
};
