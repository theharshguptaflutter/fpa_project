// update admin and staff profiles
const tableNames = require("../../../../utils/table_name");
const { s3Upload, s3VideoUpload } = require("../../../../utils/s3_file_upload");
const {
  success,
  error,
  successWithdata,
} = require("../../../../utils/responseApi");
const editParameterQuery = require("../../../../utils/edit_query");


async function addGallery(req, res) {
  try {

    var gallery_images = req.body.gallery_images;
    var gallery_video = req.body.gallery_video;

    // if (gallery_images != "") {
    //   gallery_images = await s3Upload(gallery_images);
    //   console.log(gallery_images);
    // }

    // if (gallery_video != "") {
    //   gallery_video = await s3VideoUpload(gallery_video);
    //   console.log(gallery_video);
    // }

    let galleryAddInfo = {
      gallery_name: req.body.gallery_name,
      gallery_images: gallery_images ?? "",
      gallery_video: gallery_video ?? "",
    };

    const addGalletQuery = await tableNames.Gallery.create(galleryAddInfo);

    if (addGalletQuery != null) {


      successWithdata(res, "Gallery has been uploaded", 200, addGalletQuery);
    } else {
      res.statusCode = 409;
      error(res, "Gallery not updated please try again later");
    }
  } catch (err) {
    error(res, err, 500);
  }
}

async function galleryUpdate(req, res) {
  try {
    var gallery_id = req.params.gallery_id;
    var gallery_images = req.body.gallery_images;
    var gallery_video = req.body.gallery_video;
    
     // if (gallery_images != "") {
    //   gallery_images = await s3Upload(gallery_images);
    //   console.log(gallery_images);
    // }

    // if (gallery_video != "") {
    //   gallery_video = await s3VideoUpload(gallery_video);
    //   console.log(gallery_video);
    // }

    let galleryUpdateInfo = {
      gallery_name: req.body.gallery_name,
      gallery_images: gallery_images ?? "",
      gallery_video: gallery_video ?? "",
    };

    var galleryUpdateParamiter = await editParameterQuery(galleryUpdateInfo);
    var galleryupdateQuery = await tableNames.Gallery.update(
      galleryUpdateParamiter,
      {
        where: {
          gallery_id: gallery_id,
        },
      }
    );
    console.log(galleryupdateQuery);
    if (galleryupdateQuery[0] == 1) {
      const updatedUserData = await tableNames.Gallery.findOne({
        where: { gallery_id: gallery_id },
      });

      successWithdata(res, "Gallery has been updated", 200, updatedUserData);
    } else {
      res.statusCode = 409;
      error(res, "Gallery not updated please try again later");
    }
  } catch (err) {
    error(res, err, 500);
  }
}

async function getGallery(req, res) {
  const getGallery = await tableNames.Gallery.findAll({
    where: {
      delete_flag: 0,
    },
  });

  successWithdata(res, "Gallery found", "Gallery not found", getGallery, 0);
}

async function galleryDelete(req, res) {
  try {
    var gallery_id = req.params.gallery_id;

    var galleryDeleteQuery = await tableNames.Gallery.update(
      {
        delete_flag: 1,
      },
      {
        where: {
          gallery_id: gallery_id,
        },
      }
    );
    console.log(galleryDeleteQuery);
    if (galleryDeleteQuery[0] == 1) {
      successWithdata(
        res,
        "Gallery has been delete",
        200,
        galleryDeleteQuery,
        1
      );
    } else {
      res.statusCode = 409;
      error(res, "Already deleted");
    }
  } catch (err) {
    error(res, err, 500);
  }
}

module.exports = {
  addGallery,
  getGallery,
  galleryUpdate,
  galleryDelete,
};
