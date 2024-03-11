module.exports = (sequelize, DataTypes) => {
    const user_room_permission = sequelize.define(
      "user_room_permission",
      {
        user_room_permission_id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        user_id: {
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
    return user_room_permission;
  };
  