module.exports = (sequelize, DataTypes) => {
  const doctor_category = sequelize.define(
    "doctor_category",
    {
      doctor_category_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      category_id: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
      doctor_id: {
        type: DataTypes.INTEGER,
        defaultValue: null,
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
  return doctor_category;
};
