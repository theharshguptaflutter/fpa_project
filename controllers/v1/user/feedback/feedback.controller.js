const tableNames = require("../../../../utils/table_name");

const {
  success,
  error,
  successWithdata,
} = require("../../../../utils/responseApi");

async function addUserfeedback(req, res) {
  var user_id = req.params.user_id;

  var appointment_booking_id = req.body.appointment_booking_id;

  var doctor_id = req.body.doctor_id;

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
    const findUserBookingFeedback = await tableNames.bookingFeedback.findOne({
      where: {
        appointment_booking_id: appointment_booking_id,
        user_id: user_id,
      },
    });

    if (!findUserBookingFeedback) {
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
              user_review_flag: 1,
            },
            { where: { appointment_booking_id: appointment_booking_id } }
          );
        if (addAppointmentBookingInsert != null) {
          success(res, "User booking feedback added", 200, 0);
        } else {
          res.statusCode = 409;
          error(res, "User booking feedback not added");
        }
      } else {
        res.statusCode = 409;
        error(res, "User booking feedback not added");
      }
    } else {
      res.statusCode = 209;
      error(res, "You have already added your feedback");
    }
  } catch (err) {
    error(res, err, 500);
  }
}

async function getUserfeedback(req, res) {
  var user_id = req.params.user_id;

  var appointment_booking_id = req.query.appointment_booking_id;

  try {
    const findUserBookingFeedback = await tableNames.bookingFeedback.findAll({
        attributes: ["booking_feedback_id", "appointment_booking_id", "stars", "comment"],
      
        include: [
          {
            attributes: [
                "doctor_id",
                "doctor_name",
                 "doctor_email",
                 "doctor_number",
              ],
              model: tableNames.doctorUser,
          },
        ],
      where: {
        user_id: user_id,
        ...(appointment_booking_id
          ? {
              appointment_booking_id: appointment_booking_id,
            }
          : {}),
      },
    });

    if (findUserBookingFeedback != "") {
      successWithdata(
        res,
        "Booking Feedback History",
        200,
        findUserBookingFeedback
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
  addUserfeedback,
  getUserfeedback,
};
