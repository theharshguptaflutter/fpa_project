module.exports = (sequelize, DataTypes) => {
    const chat_message_log = sequelize.define(
      "chat_message_log",
      {
        chat_message_log_id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
  
       
        user_id: {
          type: DataTypes.INTEGER,
        defaultValue: null,
        },
        doctor_id: {
          type: DataTypes.INTEGER,
        defaultValue: null,
        },
        typing: {
          type: DataTypes.STRING,
          defaultValue: 0,
        },
        last_activity_timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.fn("now"),
          },
      },
      {
        createdAt: true,
        updatedAt: false,
      }
    );
    return chat_message_log;
  };
  