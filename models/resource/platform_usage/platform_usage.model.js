
module.exports = (sequelize, DataTypes) => {
    const platform_usage = sequelize.define(
      "platform_usage",
      {
        platform_id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        platform_type: {
          type: DataTypes.TEXT,
         defaultValue: null
        },
        user_type: {
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
    return platform_usage;
  };
  




