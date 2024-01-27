const tableNames = require("../../../../utils/table_name");
const { literal } = require("sequelize");
const moment = require("moment-timezone");
const operatorsAliases = require("../../../../utils/operator_aliases");
const {
  success,
  error,
  successWithdata,
} = require("../../../../utils/responseApi");
const editParameterQuery = require("../../../../utils/edit_query");
const { s3Upload } = require("../../../../utils/s3_file_upload");

async function addAppointment(req, res) {
  var user_id = req.params.user_id;
  var doctor_id = req.body.doctor_id;
  var user_booking_price = req.body.user_booking_price;
  var total_booking_price = req.body.total_booking_price;
  var booked_current_date = req.body.booked_current_date;
  var booked_current_time = req.body.booked_current_time;
  var order_status = req.body.order_status;

  try {
    const addAppointmentInsert = await tableNames.appointmentBooking.create({
      user_id: user_id,
      doctor_id: doctor_id,
      user_booking_price: user_booking_price,
      total_booking_price: total_booking_price,
      booked_current_date: booked_current_date,
      booking_status_id: 1,
      booked_current_time: booked_current_time,
      order_status: order_status,
    });

    if (addAppointmentInsert != null) {
      //success(res, "Appointment added", 200, 0);
      //console.log(addAppointmentInsert["appointment_booking_id"]);

      let userInboxCreateQuery = {
        appointment_booking_id: addAppointmentInsert["appointment_booking_id"],
        user_id: user_id,
        doctor_id: doctor_id,
      };

      const inboxCreateQuery = await tableNames.Inbox.create(
        userInboxCreateQuery
      );
      if (inboxCreateQuery != null || inboxCreateQuery != "") {
        //    success(res, inboxCreateQuery['inbox_id'], 200, 0);
        let userchatCreateQuery1 = {
          inbox_id: inboxCreateQuery["inbox_id"],
          message: "Congratulations.. your appointment has been confirmed",
          visibility: 1,
        };

        let userchatCreateQuery2 = {
          inbox_id: inboxCreateQuery["inbox_id"],
          message: "Congratulations.. you got a new appointment",
          visibility: 2,
        };

        const inboxCreateQuery1 = await tableNames.chatMessage.create(
          userchatCreateQuery2
        );

        const inboxCreateQuery2 = await tableNames.chatMessage.create(
          userchatCreateQuery1
        );
        success(res, "Appointment added", 200, 0);
      } else {
        error(res, "Inbox not created", 500);
      }
    } else {
      error(res, "Appointment not added", 500);
    }
  } catch (err) {
    error(res, err, 500);
  }
}

async function checkAppointmentAvailability(req, res) {
  const { date, time } = req.query;

  if (
    date == "" ||
    date == 0 ||
    date == null ||
    time == "" ||
    time == 0 ||
    time == null
  ) {
    return error(res, "Date time is empty", 200);
  }
  try {
    const findquery = await tableNames.appointmentBooking.findAll({
      where: {
        [operatorsAliases.$and]: [
          {
            [operatorsAliases.$and]: [
              literal(`appointment_booking.booked_current_date = '${date}'`),
              literal(`appointment_booking.booked_current_time = '${time}'`),
            ],
          },
          {
            booking_status_id: 1,
            // order_status: "0",
            // product_id: product_id,
            // booking_payments_status: [1, 2, 3, 4, 6],
          },
        ],
      },
    });

    if (findquery != "") {
      res.status(404).send({
        status: 404,
        appointment_booking_status: false,
        message: "Appointment already booked",
      });
    } else {
      res.status(200).send({
        status: 200,
        appointment_booking_status: true,
        message: "Appointment available",
      });
    }
  } catch (err) {
    error(res, err, 500);
  }
}

async function getAppointmentUserHistory(req, res) {
  const { user_id } = req.params;

  try {
    const userAppointmentHistory = await tableNames.appointmentBooking.findAll({
      attributes: [
        "appointment_booking_id",
        "total_booking_price",
        "booked_current_date",
        "booked_current_time",
      ],
      include: [
        {
          attributes: [
            "doctor_id",
            "doctor_name",
            "avatar",
            // "doctor_email",
            // "doctor_number",
          ],
          model: tableNames.doctorUser,
        },
        {
          attributes: ["booking_status_name"],
          model: tableNames.bookingStatus,
        },
      ],
      where: {
       // booking_status_id: 1,
        user_id: user_id,
      },
    });
    successWithdata(
      res,
      "User appointment history found",
      "User appointment history not found",
      userAppointmentHistory,
      0
    );

    // if (userAppointmentHistory != "") {
    //   // res.status(404).send({
    //   //   status: 404,
    //   //   message: ,
    //   // });
    //   error(res, "User appointment history not found", 404,1);
    // } else {
    //   // res.status(200).send({
    //   //   status: 200,
    //   //   message: "",
    //   // });
    //   successWithdata(res, "User appointment history found", 200,1);
    // }
  } catch (err) {
    error(res, err, 500);
  }
}

async function getAppointmentByIdHistory(req, res) {
  const { appointment_booking_id  } = req.params;

  try {
    const userAppointmentHistory = await tableNames.appointmentBooking.findOne({
      include: [
        {
          attributes: [
            "doctor_id",
            "doctor_name",
            "doctor_email",
            "doctor_number",
            "doctor_specialist",
            "avatar",
          ],
          model: tableNames.doctorUser,
        },
        {
          attributes: ["booking_status_name"],
          model: tableNames.bookingStatus,
        },
      ],
      where: {
       // booking_status_id: 1,
        appointment_booking_id
      },
    });
    successWithdata(
      res,
      "User appointment history found",
      "User appointment history not found",
      userAppointmentHistory,
      0
    );

   
  } catch (err) {
    error(res, err, 500);
  }
}

async function addClientHistoryCard(req, res) {
  var user_id = req.params.user_id;
  var name = req.body.name;
  var mother_name = req.body.mother_name;
  var reference = req.body.reference;
  var dob = req.body.dob;
  var age = req.body.age;
  var religion = req.body.religion;
  var residence = req.body.residence;
  var address = req.body.address;
  var education = req.body.education;
  var marital_status = req.body.marital_status;
  var disability = req.body.disability;
  var gender = req.body.gender;
  var sexuality = req.body.sexuality;
  var blood_group = req.body.blood_group;
  var height = req.body.height;
  var weight = req.body.weight;

  var male = req.body.male;
  var female = req.body.female;
  var transgender = req.body.transgender;
  try {
    const addClientHistoryCardInserQuery = tableNames.clientHistoryCard.create({
      user_id: user_id,
      name: name,
      mother_name: mother_name,
      reference: reference,
      dob: dob,
      age: age,
      male: male,
      female: female,
      transgender: transgender,
      religion: religion,
      residence: residence,
      address: address,
      education: education,
      marital_status: marital_status,
      disability: disability,
      gender: gender,
      sexuality: sexuality,
      blood_group: blood_group,
      height: height,
      weight: weight,
    });

    successWithdata(
      res,
      "User Client History Card added",
      "User Client History Card not add",
      addClientHistoryCardInserQuery,
      1
    );
  } catch (err) {
    error(res, "Server internal error");
  }
}

async function appointmentCancel(req, res) {
  const appointment_booking_id = req.query.appointment_booking_id;
  const user_id = req.params.user_id;

  if (
    appointment_booking_id == "" ||
    appointment_booking_id == null ||
    user_id == "" ||
    user_id == null
  ) {
    return error(res, "Invalid parameters");
  }

  const appointmentCancelQuery = await tableNames.appointmentBooking.update(
    {
      booking_status_id: 4, // 4 means Appointment cancel
      appointment_delete_flag: 1,
    },
    {
      where: {
        appointment_booking_id: appointment_booking_id,
        user_id: user_id,
      },
    }
  );
  if (appointmentCancelQuery[0] == 1) {
    success(res, "Your appointment has been canceled", 200, 0);
  } else {
    error(res, "Your appointment has not been canceled");
  }

  console.log(appointmentCancelQuery);
}

async function appointmentReschedule(req, res) {
  const appointment_booking_id = req.query.appointment_booking_id;
  const user_id = req.params.user_id;
  const booked_current_date = req.body.booked_current_date;
  const booked_current_time = req.body.booked_current_time;

  if (
    appointment_booking_id == "" ||
    appointment_booking_id == null ||
    user_id == "" ||
    user_id == null
  ) {
    return error(res, "Invalid parameters");
  }

  const appointmentRescheduleQuery = await tableNames.appointmentBooking.update(
    {
      booked_current_date: booked_current_date,
      booked_current_time: booked_current_time,
    },
    {
      where: {
        appointment_booking_id: appointment_booking_id,
        user_id: user_id,
      },
    }
  );
  if (appointmentRescheduleQuery[0] == 1) {
    success(res, "Your appointment has been Reschedule", 200, 0);
  } else {
    error(res, "Your appointment has not been Reschedule");
  }

  console.log(appointmentRescheduleQuery);
}

module.exports = {
  addAppointment,
  checkAppointmentAvailability,
  getAppointmentUserHistory,
  addClientHistoryCard,
  appointmentCancel,
  appointmentReschedule,
  getAppointmentByIdHistory
};
