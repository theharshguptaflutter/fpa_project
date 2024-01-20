module.exports = (sequelize, DataTypes) => {
  const client_history_card = sequelize.define(
    "client_history_card",
    {
      client_history_card_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
      name: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      mother_name: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      reference: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      dob: {
        type: DataTypes.DATEONLY,
        defaultValue: null,
      },
      male: {
        type: DataTypes.BIGINT,
        defaultValue: null,
      },
      female: {
        type: DataTypes.BIGINT,
        defaultValue: null,
      },
      transgender: {
        type: DataTypes.BIGINT,
        defaultValue: null,
      },
      religion: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      residence: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      education: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      marital_status: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      disability: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      gender: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      sexuality: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      blood_group: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      height: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      weight: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      client_history_card_delete_flag: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
      },
    },
    {
      createdAt: true,
      updatedAt: false,
    }
  );
  return client_history_card;
};
