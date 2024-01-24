const tableNames = require("../../../../utils/table_name");

const {
  success,
  error,
  successWithdata,
} = require("../../../../utils/responseApi");

async function addNotes(req, res) {
  var appointment_booking_id = req.params.appointment_booking_id;

  var notes = req.body.notes;

  if (notes == "" || appointment_booking_id == null) {
    res.statusCode = 409;
    return error(res, "Please fill up all fields");
  }

  try {
    const addNotesInsert = await tableNames.Notes.create({
      appointment_booking_id: appointment_booking_id,
      notes: notes,
    });

    if (addNotesInsert != null) {
      success(res, "Notes added", 200, 0);
    } else {
      res.statusCode = 409;
      error(res, "Notes not added");
    }
  } catch (err) {
    error(res, "Server Error", 500);
  }
}

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

async function updateNotes(req, res) {
    var notes = req.body.notes;
    var appointment_booking_id = req.params.appointment_booking_id;
  const notesEditQuery = await tableNames.Notes.update(
    {
      notes: notes,
    },
    { where: { appointment_booking_id: appointment_booking_id } }
  );
  if (notesEditQuery != null) {
    success(res, "Notes ediited", 200, 0);
  } else {
    res.statusCode = 409;
    error(res, "Notes not added");
  }
}
module.exports = {
  addNotes,
  getNotes,
  updateNotes,
};
