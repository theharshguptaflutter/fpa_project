module.exports = (sequelize, DataTypes) => {
    const booking_feedback = sequelize.define(
      "booking_feedback",
      {
        booking_feedback_id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        appointment_booking_id: {
          type: DataTypes.INTEGER,
         defaultValue: null
        },
        user_id: {
          type: DataTypes.INTEGER,
         defaultValue: null
        },
       doctor_id: {
          type: DataTypes.INTEGER,
         defaultValue: null
        },
        stars: {
          type: DataTypes.BIGINT,
          defaultValue: 0,
        },
        comment: {
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
    return booking_feedback;
  };
  