module.exports = (sequelize, DataTypes) => {
  const user_analytics = sequelize.define(
    "user_analytics",
    {
      user_analytics_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
      event_types_id: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },

      total_clicks: {
        type: DataTypes.BIGINT,
        defaultValue: null,
      },
    },
    {
      createdAt: true,
      updatedAt: false,
    }
  );
  return user_analytics;
};
