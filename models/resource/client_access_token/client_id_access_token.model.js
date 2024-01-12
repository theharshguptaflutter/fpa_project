module.exports = (sequelize, DataTypes) => {
  const client_access_token = sequelize.define(
    "client_access_token",
    {
      client_access_token: {
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
      client_id: {
        type: DataTypes.STRING,
        defaultValue: null,
      },

    },
    {
      createdAt: true,
      updatedAt: false,
    }
  );
  return client_access_token;
};
