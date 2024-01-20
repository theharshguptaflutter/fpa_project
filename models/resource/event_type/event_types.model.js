module.exports = (sequelize, DataTypes) => {
  const event_types = sequelize.define(
    "event_types",
    {
      event_types_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      event_types_name: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
    },
    {
      createdAt: true,
      updatedAt: false,
    }
  );
  return event_types;
};
