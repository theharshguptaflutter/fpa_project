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
      age: {
        type: DataTypes.BIGINT,
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
      address: {
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
      // height: {
      //   type: DataTypes.STRING,
      //   defaultValue: null,
      // },
      // weight: {
      //   type: DataTypes.STRING,
      //   defaultValue: null,
      // },



      heightFt: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      heightIn : {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      weightKg : {

        type: DataTypes.STRING,
        defaultValue: null,
      },
      weightGm : {
        type: DataTypes.STRING,
        defaultValue: null,
      },


      city: { type: DataTypes.STRING, defaultValue: null },
      state: { type: DataTypes.STRING, defaultValue: null },
      pin_code: { type: DataTypes.BIGINT, defaultValue: null },
      occupation: { type: DataTypes.STRING, defaultValue: null },
      yourself: { type: DataTypes.STRING, defaultValue: null },

      medical_history: { type: DataTypes.STRING, defaultValue: null },
      medical_history_other: { type: DataTypes.STRING, defaultValue: null },
      social_history: { type: DataTypes.STRING, defaultValue: null },
      surgical_history: { type: DataTypes.STRING, defaultValue: null },

      current_medicaton: { type: DataTypes.STRING, defaultValue: null },
      family_medical_history: { type: DataTypes.STRING, defaultValue: null },

      client_history_card_delete_flag: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
      },

      lmp: {
        type: DataTypes.DATEONLY,
        defaultValue: null,
      },
      cycle: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      length: {
        type: DataTypes.BIGINT,
        defaultValue: null,
      },
      obstetric_history: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      currently_pregnant: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      no_previous_pregnancies: {
        type: DataTypes.BIGINT,
        defaultValue: null,
      },
      no_currently_children_total: {
        type: DataTypes.BIGINT,
        defaultValue: null,
      },
      clc_male: {
        type: DataTypes.BIGINT,
        defaultValue: null,
      },
      clc_female: {
        type: DataTypes.BIGINT,
        defaultValue: null,
      },
      clc_other: {
        type: DataTypes.BIGINT,
        defaultValue: null,
      },
      abortions: {
        type: DataTypes.BIGINT,
        defaultValue: null,
      },
      stillbirth: {
        type: DataTypes.BIGINT,
        defaultValue: null,
      },
      age_of_youngest_living_child: {
        type: DataTypes.DATEONLY,
        defaultValue: null,
      },
    },
    {
      createdAt: true,
      updatedAt: false,
    }
  );
  return client_history_card;
};
