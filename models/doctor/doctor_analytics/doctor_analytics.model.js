module.exports = (sequelize, DataTypes) => {
  const doctor_analytics = sequelize.define(
    "doctor_analytics",
    {
      doctor_analytics_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      doctor_id: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
      event_types_id: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },

      total_clicks: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
    },
    {
      createdAt: true,
      updatedAt: false,
    }
  );
  return doctor_analytics;
};
