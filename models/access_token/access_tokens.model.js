module.exports = (sequelize, DataTypes) => {
  const access_tokens = sequelize.define(
    "access_tokens",
    {
      gen_token_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      gen_token: {
        type: DataTypes.TEXT,
       defaultValue: null
      },
      user_id: {
        type: DataTypes.INTEGER,
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
  return access_tokens;
};
