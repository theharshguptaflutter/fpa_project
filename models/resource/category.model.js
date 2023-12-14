module.exports = (sequelize, DataTypes) => {
    const category = sequelize.define(
      "category",
      {
        category_id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        category_name: {
          type: DataTypes.TEXT,
         defaultValue: null
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
    return category;
  };
  