module.exports = (sequelize, DataTypes) => {
  const Otp = sequelize.define(
    "otp",
    {
      otp_id: {
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
      
      otp_code: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
      },
      verification_code: {
        type: DataTypes.CHAR,
        defaultValue: null,
      },
      number: {
        type: DataTypes.BIGINT,
        defaultValue: null,
      },

      otp_active_status: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
      },
    },
    {
      createdAt: "otp_creation_dt",
      updatedAt: false,
    }
  );
  return Otp;
};
