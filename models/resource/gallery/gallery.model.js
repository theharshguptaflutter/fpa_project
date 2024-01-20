module.exports = (sequelize, DataTypes) => {
  const gallery = sequelize.define(
    "gallery",
    {
      gallery_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      gallery_name: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      gallery_images: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      gallery_video: {
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
  return gallery;
};
