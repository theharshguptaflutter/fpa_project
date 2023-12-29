module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define(
    "users",
    {
      user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      state_id: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
      city_id: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
      name: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      email: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      user_number: {
        type: DataTypes.BIGINT,
        defaultValue: null,
      },
      avatar: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      user_profile_update: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
      },
      user_online_status: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
      },
      user_delete_flag: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
      },
    },
    {
      createdAt: true,
      updatedAt: false,
    }
  );
  return users;
};
