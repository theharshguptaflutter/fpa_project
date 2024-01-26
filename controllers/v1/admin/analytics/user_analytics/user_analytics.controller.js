// update admin and staff profiles
const tableNames = require("../../../../../utils/table_name");
const moment = require("moment-timezone");
const operatorsAliases = require("../../../../../utils/operator_aliases");
const {
  success,
  error,
  successWithdata,
} = require("../../../../../utils/responseApi");
const editParameterQuery = require("../../../../../utils/edit_query");

async function galleryUpdate(req, res) {
  try {
    var gallery_id = req.params.gallery_id;

    let galleryUpdateInfo = {
      gallery_name: req.body.gallery_name,
      gallery_images: req.body.gallery_images,
      gallery_video: req.body.gallery_video,
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

      console.log(updatedUserData);

      successWithdata(res, "Gallery has been updated", 200, updatedUserData);
    } else {
      res.statusCode = 409;
      error(res, "Gallery not updated please try again later");
    }
  } catch (err) {
    error(res, err, 500);
  }
}

async function getUserAnalytics(req, res) {
  var currentDate = req.body.current_date;
  var futureDate = req.body.future_date;
  var event_types_id = req.body.event_types_id;

  const userAnalyticsFindQuery = await tableNames.userAnalytics.findAll({
    attributes: ["event_types_id", "total_clicks"],
    include: [
      {
        attributes: ["event_types_name"],
        model: tableNames.eventTypes,
      },
    ],
    where: {
      ...(currentDate
        ? {
            createdAt: {
              [operatorsAliases.$between]: [currentDate, futureDate],
            },
          }
        : {}),

      ...(event_types_id ? { event_types_id: event_types_id } : {}),
    },
  });

  successWithdata(
    res,
    "User analytics found",
    "User analytics not found",
    userAnalyticsFindQuery,
    0
  );
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
  getUserAnalytics,
  galleryUpdate,
  galleryDelete,
};
