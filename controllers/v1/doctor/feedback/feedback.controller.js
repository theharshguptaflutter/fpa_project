const tableNames = require("../../../../utils/table_name");
const editParameterQuery = require("../../../../utils/edit_query")
const {
  success,
  error,
  successWithdata,
} = require("../../../../utils/responseApi");

// async function addDoctorFeedback(req, res) {
//   var doctor_id = req.params.doctor_id;

//   var appointment_booking_id = req.body.appointment_booking_id;

//   var user_id = req.body.user_id;

//   var stars = req.body.stars;
//   var comment = req.body.comment;
//   if (
//     user_id == "" ||
//     appointment_booking_id == null ||
//     doctor_id == "" ||
//     stars == "" ||
//     comment == ""
//   ) {
//     res.statusCode = 409;
//     return error(res, "Please fill up all fields");
//   }

//   try {
//     // const findDoctorBookingFeedback = await tableNames.bookingFeedback.findOne({
//     //   where: {
//     //     appointment_booking_id: appointment_booking_id,
//     //     doctor_id: doctor_id,
//     //   },
//     // });

//     // if (!findDoctorBookingFeedback) {
//     const addBookingFeedbackInsert = await tableNames.bookingFeedback.create({
//       appointment_booking_id: appointment_booking_id,
//       user_id: user_id,
//       doctor_id: doctor_id,
//       stars: stars,
//       comment: comment,
//     });

//     if (addBookingFeedbackInsert != null) {
//       //  success(res, "User booking feedback added", 200, 0);
//       const addAppointmentBookingInsert =
//         await tableNames.appointmentBooking.update(
//           {
//             doctor_review_flag: 1,
//           },
//           { where: { appointment_booking_id: appointment_booking_id } }
//         );
//       if (addAppointmentBookingInsert != null) {
//         success(res, "Doctor booking feedback added", 200, 0);
//       } else {
//         res.statusCode = 409;
//         error(res, "Doctor booking feedback not added");
//       }
//     } else {
//       res.statusCode = 409;
//       error(res, "Doctor booking feedback not added");
//     }
//     // } else {
//     //   res.statusCode = 209;
//     //   error(res, "You have already added your feedback");
//     // }
//   } catch (err) {
//     error(res, err, 500);
//   }
// }

// async function getDoctorFeedback(req, res) {
//   var doctor_id = req.params.doctor_id;

//   var appointment_booking_id = req.query.appointment_booking_id;

//   try {
//     const findDoctorBookingFeedback = await tableNames.bookingFeedback.findAll({
//       attributes: ["booking_feedback_id", "appointment_booking_id", "stars", "comment"],

//       include: [
//         {
//           attributes: ["user_id", "name", "email", "user_number"],
//           model: tableNames.User,
//         },
//       ],
//       where: {
//         doctor_id: doctor_id,
//         ...(appointment_booking_id
//           ? {
//               appointment_booking_id: appointment_booking_id,
//             }
//           : {}),
//       },
//     });

//     if (findDoctorBookingFeedback != "") {
//       successWithdata(
//         res,
//         "Booking Feedback History",
//         200,
//         findDoctorBookingFeedback
//       );
//     } else {
//       res.statusCode = 404;
//       error(res, "Booking Feedback Not Found");
//     }
//   } catch (err) {
//     error(res, err, 500);
//   }
// }

async function addDoctorFeedback(req, res) {


  var user_id = req.body.user_id;
  var appointment_booking_id = req.body.appointment_booking_id;
  var doctor_id = req.params.doctor_id;




  var category = req.body.category;
  var sub_category = req.body.sub_category;

  var specific_notes = req.body.specific_notes;
  var prescription_details = req.body.prescription_details;


  if (

    appointment_booking_id == null ||
    doctor_id == ""
  ) {
    res.statusCode = 409;
    return error(res, "Please fill up all fields");
  }

  try {
    const findUserBookingFeedback = await tableNames.doctorBookingFeedback.findOne({
      where: {
        appointment_booking_id: appointment_booking_id,
        doctor_id: doctor_id

      },
    });

    if (!findUserBookingFeedback) {
      const addBookingFeedbackInsert = await tableNames.doctorBookingFeedback.create({
        appointment_booking_id: appointment_booking_id,
        user_id: user_id,
        doctor_id: doctor_id,
        category: category,
        sub_category: sub_category,
        specific_notes: specific_notes,
        prescription_details: prescription_details
      });

      if (addBookingFeedbackInsert != null) {
        //  success(res, "User booking feedback added", 200, 0);
        const addAppointmentBookingInsert =
          await tableNames.appointmentBooking.update(
            {
              doctor_review_flag: 1,
            },
            { where: { appointment_booking_id: appointment_booking_id, doctor_id: doctor_id } }
          );
        if (addAppointmentBookingInsert != null) {
          //success(res, "User booking feedback added", 200, 0);
          successWithdata(
            res,
            "doctor booking feedback added",
            200,
            {doctor_booking_feedback_id:addBookingFeedbackInsert.doctor_booking_feedback_id}
          );
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
     // error(res, "You have already added your feedback");
      successWithdata(
        res,
        "You have already added your feedback",
        200,
        {doctor_booking_feedback_id:findUserBookingFeedback.doctor_booking_feedback_id}
      );
    }
  } catch (err) {
    error(res, err, 500);
  }
}

async function getDoctorFeedback(req, res) {
  var doctor_id = req.params.doctor_id;

  var appointment_booking_id = req.query.appointment_booking_id;

  try {
    const findUserBookingFeedback = await tableNames.doctorBookingFeedback.findAll({
      // attributes: ["doctor_booking_feedback","doctor_id","user_id","appointment_booking_id", "stars", "comment"],

      include: [
        {
          attributes: [
            "user_id",
            "name",
            "email",
            "user_number",
            "avatar"
          ],
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

async function updateDoctorfeedback(req, res) {
  var doctor_booking_feedback_id = req.params.doctor_booking_feedback_id;

  //var appointment_booking_id = req.body.appointment_booking_id;

  // var doctor_id = req.body.doctor_id;


  var category = req.body.category;
  var sub_category = req.body.sub_category;

  var specific_notes = req.body.specific_notes;
  var prescription_details = req.body.prescription_details;

  if (
    doctor_booking_feedback_id == ""
  ) {
    res.statusCode = 409;
    return error(res, "Please fill up all fields");
  }

  // try {

  let updateUserData = {

    category: category,
    sub_category: category,
    specific_notes: category,
    prescription_details: category
  };
  var editfeedbackParamiter = await editParameterQuery(
    updateUserData
  );
  const addBookingFeedbackInsert = await tableNames.doctorBookingFeedback.update(
    editfeedbackParamiter,
    {
      where: {
        doctor_booking_feedback_id: doctor_booking_feedback_id,
      },
    }
  );

  if (addBookingFeedbackInsert != 0) {
    res.statusCode = 200;
    return error(res, "feedback edited");

  } else {
    res.statusCode = 409;
    return error(res, "feedback not edited");
  }

  // } catch (err) {
  //   error(res, err, 500);
  // }
}

module.exports = {
  addDoctorFeedback,
  getDoctorFeedback,
  updateDoctorfeedback
};
