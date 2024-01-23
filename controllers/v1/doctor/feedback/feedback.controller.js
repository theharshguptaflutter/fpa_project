const tableNames = require("../../../../utils/table_name");

const {
  success,
  error,
  successWithdata,
} = require("../../../../utils/responseApi");

async function addDoctorFeedback(req, res) {
  var doctor_id = req.params.doctor_id;

  var appointment_booking_id = req.body.appointment_booking_id;

  var user_id = req.body.user_id;

  var stars = req.body.stars;
  var comment = req.body.comment;
  if (
    user_id == "" ||
    appointment_booking_id == null ||
    doctor_id == "" ||
    stars == "" ||
    comment == ""
  ) {
    res.statusCode = 409;
    return error(res, "Please fill up all fields");
  }

  try {
    // const findDoctorBookingFeedback = await tableNames.bookingFeedback.findOne({
    //   where: {
    //     appointment_booking_id: appointment_booking_id,
    //     doctor_id: doctor_id,
    //   },
    // });

    // if (!findDoctorBookingFeedback) {
    const addBookingFeedbackInsert = await tableNames.bookingFeedback.create({
      appointment_booking_id: appointment_booking_id,
      user_id: user_id,
      doctor_id: doctor_id,
      stars: stars,
      comment: comment,
    });

    if (addBookingFeedbackInsert != null) {
      //  success(res, "User booking feedback added", 200, 0);
      const addAppointmentBookingInsert =
        await tableNames.appointmentBooking.update(
          {
            doctor_review_flag: 1,
          },
          { where: { appointment_booking_id: appointment_booking_id } }
        );
      if (addAppointmentBookingInsert != null) {
        success(res, "Doctor booking feedback added", 200, 0);
      } else {
        res.statusCode = 409;
        error(res, "Doctor booking feedback not added");
      }
    } else {
      res.statusCode = 409;
      error(res, "Doctor booking feedback not added");
    }
    // } else {
    //   res.statusCode = 209;
    //   error(res, "You have already added your feedback");
    // }
  } catch (err) {
    error(res, err, 500);
  }
}

async function getDoctorFeedback(req, res) {
  var doctor_id = req.params.doctor_id;

  var appointment_booking_id = req.query.appointment_booking_id;

  try {
    const findDoctorBookingFeedback = await tableNames.bookingFeedback.findAll({
      attributes: ["booking_feedback_id", "appointment_booking_id", "stars", "comment"],
      
      include: [
        {
          attributes: ["user_id", "name", "email", "user_number"],
          model: tableNames.User,
        },
      ],
      where: {
        doctor_id: doctor_id,
        ...(appointment_booking_id
          ? {
              appointment_booking_id: appointment_booking_id,
            }
          : {}),
      },
    });

    if (findDoctorBookingFeedback != "") {
      successWithdata(
        res,
        "Booking Feedback History",
        200,
        findDoctorBookingFeedback
      );
    } else {
      res.statusCode = 404;
      error(res, "Booking Feedback Not Found");
    }
  } catch (err) {
    error(res, err, 500);
  }
}

module.exports = {
  addDoctorFeedback,
  getDoctorFeedback,
};
