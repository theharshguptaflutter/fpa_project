module.exports = (sequelize, DataTypes) => {
  const doctor = sequelize.define(
    "doctor",
    {
      doctor_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      password: {
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
      doctor_name: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      doctor_email: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      doctor_number: {
        type: DataTypes.BIGINT,
        defaultValue: null,
      },
      photo: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      doctor_occupation: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      doctor_specialist: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      doctor_profile_update: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
      },

      doctor_online_status: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
      },
      doctor_delete_flag: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
      },
    },
    {
      createdAt: true,
      updatedAt: false,
    }
  );
  return doctor;
};
