const tableNames = require("../../../../utils/table_name");
const editParameterQuery = require("../../../../utils/edit_query");
const {
  success,
  error,
  successWithdata,
} = require("../../../../utils/responseApi");

async function addUserfeedback(req, res) {

  var doctor_id = req.body.doctor_id;
  var user_id = req.params.user_id;

  var appointment_booking_id = req.body.appointment_booking_id;

  

  console.log(doctor_id);
  console.log(user_id);
  console.log(appointment_booking_id);

  var stars = req.body.stars;
  var comment = req.body.comment;

  var field1 = req.body.field1;
  var field2 = req.body.field2;
  var field3 = req.body.field3;
  var field4 = req.body.field4;
  var field5 = req.body.field5;
  var field6 = req.body.field6;
  var field7 = req.body.field7;
  var field8 = req.body.field8;
  var field9 = req.body.field9;
  var field10 = req.body.field10;

  if (
   
    appointment_booking_id == null ||
    doctor_id == "" 
  ) {
    res.statusCode = 409;
    return error(res, "Please fill up all fields");
  }

  //try {
    const findUserBookingFeedback = await tableNames.userBookingFeedback.findOne({
      where: {
        appointment_booking_id: appointment_booking_id,
        user_id:user_id
        
      },
    });

    if (!findUserBookingFeedback) {
      var addBookingFeedbackInsert = await tableNames.userBookingFeedback.create({
        appointment_booking_id: appointment_booking_id,
        user_id: user_id,
        doctor_id: doctor_id,
        field1: field1,
        field2: field2,
        field3: field3,
        field4: field4,
        field5: field5,
        field6: field6,
        field7: field7,
        field8: field8,
        field9: field9,
        field10: field10,
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
            { where: { appointment_booking_id: appointment_booking_id ,user_id:user_id} }
          );
        if (addAppointmentBookingInsert != null) {
         // success(res, "User booking feedback added", 200, 0);//
          successWithdata(
            res,
            "User booking feedback added",
            200,
            {user_booking_feedback_id:addBookingFeedbackInsert.user_booking_feedback_id}
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
      //res.statusCode = 209;
    //  error(res, "You have already added your feedback");
      successWithdata(
        res,
        "You have already added your feedback",
        200,
        {user_booking_feedback_id:findUserBookingFeedback.user_booking_feedback_id}
      );
    }
  // } catch (err) {
  //   error(res, err, 500);
  // }
}


async function getUserfeedback(req, res) {
  var user_id = req.params.user_id;

  var appointment_booking_id = req.query.appointment_booking_id;

  try {
    const findUserBookingFeedback = await tableNames.userBookingFeedback.findAll({
     // attributes: ["user_booking_feedback_id","doctor_id","user_id","appointment_booking_id", "stars", "comment"],

      include: [
        {
          attributes: [
            "doctor_id",
            "doctor_name",
            "doctor_email",
            "doctor_number",
            "avatar"
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


async function updateDoctorfeedback(req, res) {
  var user_booking_feedback_id  = req.params.user_booking_feedback_id ;

  //var appointment_booking_id = req.body.appointment_booking_id;

 // var doctor_id = req.body.doctor_id;

  var stars = req.body.stars;
  var comment = req.body.comment;

  var field1 = req.body.field1;
  var field2 = req.body.field2;
  var field3 = req.body.field3;
  var field4 = req.body.field4;
  var field5 = req.body.field5;
  var field6 = req.body.field6;
  var field7 = req.body.field7;
  var field8 = req.body.field8;
  var field9 = req.body.field9;
  var field10 = req.body.field10;

  if (
    user_booking_feedback_id  == ""
   
  //  doctor_id == ""
    
  ) {
    res.statusCode = 409;
    return error(res, "Please fill up all fields");
  }

 // try {

    let updateUserData = {
      //  appointment_booking_id: appointment_booking_id,
       // doctor_id: doctor_id,
        field1: field1,
        field2: field2,
        field3: field3,
        field4: field4,
        field5: field5,
        field6: field6,
        field7: field7,
        field8: field8,
        field9: field9,
        field10: field10,
        stars: stars,
        comment: comment,
    };
    var editfeedbackParamiter = await editParameterQuery(
      updateUserData
    );
    const addBookingFeedbackInsert = await tableNames.userBookingFeedback.update(
      editfeedbackParamiter,
      {
        where: {
          user_booking_feedback_id: user_booking_feedback_id,
        },
      }
    );

    if (addBookingFeedbackInsert != 0) {
      res.statusCode = 200;
      return error(res, "feedback edited");
     
    }else{
      res.statusCode = 409;
      return error(res, "feedback not edited");
    }
  
  // } catch (err) {
  //   error(res, err, 500);
  // }
}

module.exports = {
  addUserfeedback,
  getUserfeedback,
  updateDoctorfeedback
};
