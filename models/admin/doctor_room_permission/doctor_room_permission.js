module.exports = (sequelize, DataTypes) => {
    const doctor_room_permission = sequelize.define(
      "doctor_room_permission",
      {
        doctor_room_permission_id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        doctor_id: {
          type: DataTypes.INTEGER,
          defaultValue: null,
        },
        room_permission_id: {
          type: DataTypes.INTEGER,
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
    return doctor_room_permission;
  };
  