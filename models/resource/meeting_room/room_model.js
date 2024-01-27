module.exports = (sequelize, DataTypes) => {
    const room = sequelize.define(
      "room",
      {
        room_id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        room_code: {
          type: DataTypes.STRING,
          defaultValue: null,
        },
        room_active: {
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
    return room;
  };
  