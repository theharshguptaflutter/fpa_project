// update admin and staff profiles
const tableNames = require("../../../../utils/table_name.js");
const includeAttributes = require("../sequelize_attributes/user_feedback_attributes.js");
const {
  success,
  error,
  successWithdata,
} = require("../../../../utils/responseApi.js");
const includeAttributesList = new includeAttributes();
const editParameterQuery = require("../../../../utils/edit_query.js");


async function userFeedbackUpdate(req, res) {
  try {
    var user_booking_feedback_id = req.params.user_booking_feedback_id;

    let galleryUpdateInfo = {
      field1: req.body.field1,
      field2: req.body.field2,
      field3: req.body.field3,
      field4: req.body.field4,
      field5: req.body.field5,
      field6: req.body.field6,
      field7: req.body.field7,
      field8: req.body.field8,
      field9: req.body.field9,
      field10: req.body.field10,
      stars: req.body.stars,
      comment: req.body.comment,

    };

    var galleryUpdateParamiter = await editParameterQuery(galleryUpdateInfo);
    var galleryupdateQuery = await tableNames.userBookingFeedback.update(
      galleryUpdateParamiter,
      {
        where: {
          user_booking_feedback_id: user_booking_feedback_id,
        },
      }
    );
    console.log(galleryupdateQuery);
    if (galleryupdateQuery[0] == 1) {
      const updatedUserData = await tableNames.userBookingFeedback.findOne({
        where: { user_booking_feedback_id: user_booking_feedback_id },
      });

      console.log(updatedUserData);

      successWithdata(res, "user feedback has been updated", 200, updatedUserData);
    } else {
      res.statusCode = 409;
      error(res, "user feedback not updated please try again later");
    }
  } catch (err) {
    error(res, err, 500);
  }
}

async function getUserFeedback(req, res) {


  const userBookingFeedbackQuery = await tableNames.userBookingFeedback.findAll({
    attributes: includeAttributesList.userBookingFeedbackAttributesList,
    include: [{
      attributes: includeAttributesList.appointmentBookingAttributesList,
      model: tableNames.appointmentBooking,
      include: [
        {
          attributes: includeAttributesList.bookingStatusAttributesList,
          model: tableNames.bookingStatus,
        },
        {
          attributes: includeAttributesList.UserAttributesList,
          model: tableNames.User,
        },
        {
          attributes: includeAttributesList.doctorUserAttributesList,
          model: tableNames.doctorUser,
        }
      ],
      where: {
        appointment_delete_flag: 0
      }
    }],
    where: {
      delete_flag: 0,
    },
  });

  successWithdata(res, "User Feedback found", "User Feedback not found", userBookingFeedbackQuery, 0);
}

async function userFeedbackDelete(req, res) {
  try {
    var user_booking_feedback_id = req.params.user_booking_feedback_id;

    var userFeedbackDeleteQuery = await tableNames.userBookingFeedback.update(
      {
        delete_flag: 1,
      },
      {
        where: {
          user_booking_feedback_id: user_booking_feedback_id,
        },
      }
    );
    console.log(userFeedbackDeleteQuery);
    if (userFeedbackDeleteQuery[0] == 1) {
      successWithdata(
        res,
        "User Feedback has been delete",
        200,
        userFeedbackDeleteQuery,
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

  getUserFeedback,
  userFeedbackUpdate,
  userFeedbackDelete,
};
