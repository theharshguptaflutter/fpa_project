module.exports = (sequelize, DataTypes) => {
  const notes = sequelize.define(
    "notes",
    {
      notes_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
    
      appointment_booking_id: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
     
      notes: {
        type: DataTypes.STRING,
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
  return notes;
};
