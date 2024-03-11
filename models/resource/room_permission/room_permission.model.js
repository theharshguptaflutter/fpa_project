module.exports = (sequelize, DataTypes) => {
  const room_permission = sequelize.define(
    "room_permission",
    {
      room_permission_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      room_permission_name: {
        type: DataTypes.STRING,
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
  return room_permission;
};
