module.exports = (sequelize, DataTypes) => {
  const cliend_access_token = sequelize.define(
    "cliend_access_token",
    {
      cliend_access_token: {
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
      cliend_id: {
        type: DataTypes.STRING,
        defaultValue: null,
      },

    },
    {
      createdAt: true,
      updatedAt: false,
    }
  );
  return cliend_access_token;
};
