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

async function getAppointmentsOfUser(req, res) {
  const email = req.body.email;

  try {
    const user = await tableNames.User.findOne({
      where: { email: email },
    });
    if (!user) {
      res.statusCode = 404;
      return error(res, "User not found!");
    }
    const user_id = user.user_id;
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
  } catch (err) {
    res.statusCode = 500;
    error(res, err);
  }
}

async function getAppointmentById(req, res) {
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
    res.statusCode = 500;
    error(res, err);
  }
}

async function getAllAppointments(req, res) {
  try {
    const admin_id = req.params.admin_id;
    const adminCheckQuery = await tableNames.User.findOne({
      where: { user_id: admin_id },
    });
    if (adminCheckQuery.role_id !== 1) {
      res.statusCode = 403;
      return error(res, "Unauthorized Access! Admin Only!");
    } else {
      const allAppointments = await tableNames.appointmentBooking.findAll();

      if (allAppointments.length > 0) {
        successWithdata(res, "All Appointments found", "No Appointment found!", allAppointments, 0);
      } else {
        successWithdata(res, "All Appointments found", "No Appointment found!", [], 0);
      }
    }
  } catch (err) {
    res.statusCode = 500;
    error(res, err);
  }
}

async function cancelAppointment(req, res) {
  try {
    const appointment_booking_id = req.params.appointment_booking_id;
    const email = req.body.email;
    const user = await tableNames.User.findOne({
      where: { email: email },
    });
    if (!user) {
      res.statusCode = 404;
      return error(res, "User not found!");
    }
    const user_id = user.user_id;
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
  } catch (err) {
    res.statusCode = 500;
    error(res, err);
  }
}

async function appointmentReschedule(req, res) {
  try {
    const appointment_booking_id = req.params.appointment_booking_id;
    const email = req.body.email;
    const booked_current_date = req.body.booked_current_date;
    const booked_current_time = req.body.booked_current_time;
    const user = await tableNames.User.findOne({
      where: { email: email },
    });
    if (!user) {
      res.statusCode = 404;
      return error(res, "User not found!");
    }
    const user_id = user.user_id;
    if (
      appointment_booking_id == "" ||
      appointment_booking_id == null ||
      user_id == "" ||
      user_id == null
    ) {
      return error(res, "Invalid parameters");
    }

    const appointmentRescheduleQuery =
      await tableNames.appointmentBooking.update(
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
  } catch (err) {
    res.statusCode = 500;
    error(res, err);
  }
}

module.exports = {
    getAppointmentsOfUser,
    getAppointmentById,
    getAllAppointments,
    cancelAppointment,
    appointmentReschedule,
};