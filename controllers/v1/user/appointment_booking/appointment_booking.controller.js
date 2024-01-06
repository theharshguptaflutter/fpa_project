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

  // try {
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

async function checkAppointmentAvailability(req, res) {
  const { date, time } = req.query;

  // const datePartsStart = date.split(" ");
  // const datePartsEnd = time.split(" ");

  // const startDateInUTC = moment(date, "YYYY-MM-DD");
  // const endDateInUTC = moment(date, "YYYY-MM-DD");

  // const oneDayAgo = startDateInUTC.clone().subtract(1, "days");
  // const oneDayLater = endDateInUTC.clone().add(1, "days");

  // var checkAvailabilityStartDate = oneDayAgo.format("YYYY-MM-DD");
  // var checkAvailabilityEndDate = oneDayLater.format("YYYY-MM-DD");

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

module.exports = {
  addAppointment,
  checkAppointmentAvailability,
};
