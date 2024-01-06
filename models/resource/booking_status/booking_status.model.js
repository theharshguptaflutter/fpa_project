module.exports = (sequelize, DataTypes) => {
    const booking_status = sequelize.define(
      "booking_statu",
      {
        booking_status_id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        booking_status_name: {
          type: DataTypes.STRING,
         defaultValue: null
        },
      
        booking_status_flag: {
          type: DataTypes.TINYINT,
          defaultValue: 0,
        },
      },
      {
        createdAt: true,
        updatedAt: false,
      }
    );
    return booking_status;
  };
  