const tableNames = require("../../../../utils/table_name");

const {
  success,
  error,
  successWithdata,
} = require("../../../../utils/responseApi");


async function getNotes(req, res) {
  var appointment_booking_id = req.params.appointment_booking_id;

  try {
    const findDoctorNotes = await tableNames.Notes.findAll({
    // attributes: ["booking_feedback_id", "appointment_booking_id", "stars", "comment"],
    //   include: [
    //     {
    //       model: tableNames.appointmentBooking,
    //       include:[
    //         {
    //             model: tableNames.User,
    //         }
    //       ]
    //     },
    //   ],
      where: {
        appointment_booking_id: appointment_booking_id,
      },
    });

    if (findDoctorNotes != "") {
      successWithdata(res, "Notes History", 200, findDoctorNotes);
    } else {
      res.statusCode = 404;
      error(res, "Notes Not Found");
    }
  } catch (err) {
    error(res, err, 500);
  }
}


module.exports = {
 
  getNotes,
 
};
