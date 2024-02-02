

module.exports = (sequelize, DataTypes) => {
    const doctor_booking_feedback = sequelize.define(
      "doctor_booking_feedback",
      {
        doctor_booking_feedback_id: {
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
       
        category: {
          type: DataTypes.STRING,
          defaultValue: null
        },
        sub_category: {
            type: DataTypes.STRING,
            defaultValue: null
          },
        specific_notes: {
          type: DataTypes.STRING,
          defaultValue: null
        },
        
        prescription_details: {
          type: DataTypes.STRING,
          defaultValue: null
        },
       
      },
      {
        createdAt: true,
        updatedAt: false,
      }
    );
    return doctor_booking_feedback;
  };
  