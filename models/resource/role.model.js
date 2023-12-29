module.exports = (sequelize, DataTypes) => {
    const role = sequelize.define(
      "role",
      {
        role_id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        role_name: {
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
    return role;
  };
  