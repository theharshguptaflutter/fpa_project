module.exports = (sequelize, DataTypes) => {
  const chat_messages = sequelize.define(
    "chat_messages",
    {
      chat_messages_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      inbox_id: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
      from: {
        type: DataTypes.TINYINT,
        defaultValue: null,
      },
      to: {
        type: DataTypes.TINYINT,
        defaultValue: null,
      },
      message: {
        type: DataTypes.TEXT,
        defaults: null,
      },
      visibility: {
        type: DataTypes.TINYINT,
        defaults: null,
      },
      msg_seen: {
        type: DataTypes.TINYINT,
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
  return chat_messages;
};
