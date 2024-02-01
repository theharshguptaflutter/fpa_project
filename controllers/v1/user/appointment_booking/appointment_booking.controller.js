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
const findAvailableDoctor = require("../../../../utils/doctor_allocation.js");

async function addAppointment(req, res) {
  var user_id = req.params.user_id;

  // var doctor_id = req.body.doctor_id;
  var user_booking_price = req.body.user_booking_price;
  var total_booking_price = req.body.total_booking_price;
  var booked_current_date = req.body.booked_current_date;
  var booked_current_time = req.body.booked_current_time;
  var order_status = req.body.order_status;

  if (!booked_current_date || !booked_current_time) {
    return error(res, "Date and time are required", 400);
  }

  var findAvailableDoctorQuery = await findAvailableDoctor(
    booked_current_date,
    booked_current_time
  );

  if (findAvailableDoctorQuery == null) {
    res.statuscode = 404;
    return error(res, "Doctor not found");
  }

 // try {
    const findquery = await tableNames.appointmentBooking.findAll({
      where: {
        [operatorsAliases.$and]: [
          {
            [operatorsAliases.$and]: [
              literal(
                `appointment_booking.booked_current_date = '${booked_current_date}'`
              ),
              literal(
                `appointment_booking.booked_current_time = '${booked_current_time}'`
              ),
            ],
          },
          {
            doctor_id: findAvailableDoctorQuery,
            booking_status_id: 1,
          },
        ],
      },
    });

    if (findquery != "") {
      error(res, "Appointment already booked", 205);
      // res.status(205).send({
      //   status: 205,
      //   appointment_booking_status: false,
      //   message: "Appointment already booked",
      // });
    } else {
      //try {
      const addAppointmentInsert = await tableNames.appointmentBooking.create({
        user_id: user_id,
        doctor_id: findAvailableDoctorQuery,
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
        const fondroomIDs = await tableNames.Room.findOne({
          where: {
            room_active: 0,
          },
        });

        console.log(fondroomIDs);
        if(fondroomIDs ==null ){
                res.statusCode = 409;
        return   error(res, "Room not available");
        }

        var data = {
          appointment_booking_id: addAppointmentInsert.appointment_booking_id,
          room_id: fondroomIDs.room_id,
          meeting_room_active: 1,
        };

        console.log(data);

        const user = await tableNames.meetingRoom.create(data);

        // console.log("user");
        // console.log(user.meeting_room_id);
        // console.log("user");
        const roomIdUpdateQuery = await tableNames.Room.update(
          { room_active: 1 },
          {
            where: {
              room_id: user.meeting_room_id,
            },
          }
        );

        // console.log("/////harsh");
        // console.log(fondroomIDs.room_code);
         console.log("////harsh");
       //P  console.log(doctor_id);
        let userInboxCreateQuery = {
          appointment_booking_id:
            addAppointmentInsert["appointment_booking_id"],
          user_id: user_id,
          doctor_id: findAvailableDoctorQuery,
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
          //  success(res, "Appointment added", 200, 1);
          successWithdata(
            res,
            "Appointment added",
            "Appointment not added",
            [
              {
                appointment_booking_id:
                  addAppointmentInsert.appointment_booking_id,
              },
            ],
            0
          );
        } else {
          error(res, "Inbox not created", 500);
        }
      } else {
        error(res, "Appointment not added", 500);
      }
      // } catch (err) {
      //   error(res, err, 500);
      // }
    }
  // } catch (err) {
  //   error(res, err, 500);
  // }
}

async function checkAppointmentAvailability(req, res) {
  const { date, time } = req.query;

  if (!date || !time) {
    return error(res, "Date and time are required", 400);
  }
  try {
    const totalDoctors = await tableNames.doctorUser.count({
      where: { doctor_profile_update: 1, doctor_delete_flag: 0 },
    });
    const appointmentCount = await tableNames.appointmentBooking.count({
      where: {
        booked_current_date: date,
        booked_current_time: time,
        booking_status_id: 1,
        appointment_delete_flag: 0,
      },
    });

    if (appointmentCount === totalDoctors) {
      res.status(404).send({
        status: 404,
        appointment_booking_status: false,
        message: "Appointment not available. All doctors are booked at this time.",
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
        {
          attributes: ["meeting_room_id"],
          model: tableNames.meetingRoom,
          include: [
            {
              attributes: ["room_code"],
              model: tableNames.Room,
            },
          ],
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
  const { appointment_booking_id } = req.params;

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
        {
          attributes: ["meeting_room_id"],
          model: tableNames.meetingRoom,
          include: [
            {
              attributes: ["room_code"],
              model: tableNames.Room,
            },
          ],
        },
      ],
      where: {
        // booking_status_id: 1,
        appointment_booking_id,
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
  var dob = req.body.dob;

  var age = req.body.age;
  var religion = req.body.religion;
  var residence = req.body.residence;
  var address = req.body.address;
  var reference = req.body.reference;

  var city = req.body.city;
  var state = req.body.state;
  var pin_code = req.body.pin_code;
  var education = req.body.education;
  var marital_status = req.body.marital_status;
  var disability = req.body.disability;
  var occupation = req.body.occupation;

  var yourself = req.body.yourself;
  var blood_group = req.body.blood_group;
  var height = req.body.height;
  var weight = req.body.weight;

  var medical_history = req.body.medical_history;
  var social_history = req.body.social_history;
  var surgical_history = req.body.surgical_history;

  var current_medicaton = req.body.current_medicaton;
  var family_medical_history = req.body.family_medical_history;

  var gender = req.body.gender;
  var sexuality = req.body.sexuality;
  var male = req.body.male;
  var female = req.body.female;
  var transgender = req.body.transgender;

  var lmp = req.body.lmp;
  var cycle = req.body.cycle;
  var length = req.body.length;
  var obstetric_history = req.body.obstetric_history;
  var currently_pregnant = req.body.currently_pregnant;
  var no_previous_pregnancies = req.body.no_previous_pregnancies;
  var no_currently_children_total = req.body.no_currently_children_total;
  var clc_male = req.body.clc_male;
  var clc_female = req.body.clc_female;
  var clc_other = req.body.clc_other;
  var abortions = req.body.abortions;
  var stillbirth = req.body.stillbirth;
  var age_of_youngest_living_child = req.body.age_of_youngest_living_child;
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
      medical_history: medical_history,
      social_history: social_history,
      surgical_history: surgical_history,

      current_medicaton: current_medicaton,
      family_medical_history: family_medical_history,

      city: city,
      state: state,
      pin_code: pin_code,
      occupation: occupation,
      yourself: yourself,
      lmp: lmp,
      cycle: cycle,
      length: length,
      obstetric_history: obstetric_history,
      currently_pregnant: currently_pregnant,
      no_previous_pregnancies: no_previous_pregnancies,
      no_currently_children_total: no_currently_children_total,
      clc_male: clc_male,
      clc_female: clc_female,
      clc_other: clc_other,
      abortions: abortions,
      stillbirth: stillbirth,
      age_of_youngest_living_child: age_of_youngest_living_child,
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
  getAppointmentByIdHistory,
};
