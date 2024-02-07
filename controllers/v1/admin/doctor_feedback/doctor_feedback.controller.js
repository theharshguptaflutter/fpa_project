const tableNames = require("../../../../utils/table_name.js");
const includeAttributes = require("../sequelize_attributes/doctor_feedback_attributes.js");
const {
  success,
  error,
  successWithdata,
} = require("../../../../utils/responseApi.js");
const includeAttributesList = new includeAttributes();
const editParameterQuery = require("../../../../utils/edit_query.js");


async function doctorFeedbackUpdate(req, res) {
  try {
    var doctor_booking_feedback_id = req.params.doctor_booking_feedback_id;

    let doctorFeedbackUpdateInfo = {
      category: req.body.category,
      sub_category: req.body.sub_category,
      specific_notes: req.body.specific_notes,
      prescription_details: req.body.prescription_details

    };

    var doctorfeedbackUpdateParamiter = await editParameterQuery(doctorFeedbackUpdateInfo);
    var doctorfeedbackupdateQuery = await tableNames.doctorBookingFeedback.update(
      doctorfeedbackUpdateParamiter,
      {
        where: {
          doctor_booking_feedback_id: doctor_booking_feedback_id,
        },
      }
    );
    console.log(doctorfeedbackupdateQuery);
    if (doctorfeedbackupdateQuery[0] == 1) {
      const updatedDoctorFeedData = await tableNames.doctorBookingFeedback.findOne({
        where: { doctor_booking_feedback_id: doctor_booking_feedback_id },
      });

      console.log(updatedDoctorFeedData);

      successWithdata(res, "doctor feedback has been updated", 200, updatedDoctorFeedData);
    } else {
      res.statusCode = 409;
      error(res, "doctor feedback not updated please try again later");
    }
  } catch (err) {
    error(res, err, 500);
  }
}

async function getDoctorFeedback(req, res) {


  const doctorBookingFeedbackQuery = await tableNames.doctorBookingFeedback.findAll({
    attributes: includeAttributesList.doctorBookingFeedbackAttributesList,
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
    }
    ],
  });

  successWithdata(res, "User Feedback found", "User Feedback not found", doctorBookingFeedbackQuery, 0);
}

async function doctorFeedbackDelete(req, res) {
  try {
    var doctor_booking_feedback_id = req.params.doctor_booking_feedback_id;

    var userFeedbackDeleteQuery = await tableNames.doctorBookingFeedback.update(
      {
        delete_flag: 1,
      },
      {
        where: {
          doctor_booking_feedback_id: doctor_booking_feedback_id,
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

  getDoctorFeedback,
  doctorFeedbackUpdate,
  doctorFeedbackDelete,
};
