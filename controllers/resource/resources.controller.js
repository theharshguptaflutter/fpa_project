const tableNames = require("../../utils/table_name");
const { success, error, successWithdata } = require("../../utils/responseApi");
const operatorsAliases = require("../../utils/operator_aliases");
const moment = require("moment");
const { sequelize } = require("../../utils/conn");
async function getState(req, res) {
  try {
    findQuery = await tableNames.State.findAll({
      attributes: ["state_id", "state_name"],
      where: { delete_flag: 0 },
    });
    if (findQuery != "") {
      res.status(200).send({
        status: 200,
        message: "Data found",
        data: findQuery,
      });
    } else {
      res.status(404).send({
        status: 404,
        message: "Not found",
      });
    }
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "Internal server error",
    });
  }
}

async function getCity(req, res) {
  state_id = req.query.state_id;

  let where = {
    delete_flag: 0,
    ...(state_id
      ? {
          state_id: state_id,
        }
      : {}),
  };
  let paranoid = { paranoid: true };
  findQuery = await tableNames.City.findAll({
    attributes: ["city_id", "state_id", "city_name"],
    where,
    paranoid,
  });

  if (findQuery != "") {
    res.status(200).send({
      status: 200,
      message: "Data found",
      data: findQuery,
    });
  } else {
    res.status(404).send({
      status: 404,
      message: "No cities found",
    });
  }
}

async function getCategory(req, res) {
  let where = {
    delete_flag: 0,
  };
  let paranoid = { paranoid: true };
  findQuery = await tableNames.Category.findAll({
    attributes: ["category_id", "category_name"],
    where,
    paranoid,
  });

  if (findQuery != "") {
    res.status(200).send({
      status: 200,
      message: "Data found",
      data: findQuery,
    });
  } else {
    res.status(404).send({
      status: 404,
      message: "No cities found",
    });
  }
}

async function getRole(req, res) {
  let where = {
    delete_flag: 0,
  };
  let paranoid = { paranoid: true };
  findQuery = await tableNames.Role.findAll({
    attributes: ["role_id", "role_name"],
    where,
    paranoid,
  });

  if (findQuery != "") {
    res.status(200).send({
      status: 200,
      message: "Data found",
      data: findQuery,
    });
  } else {
    res.status(404).send({
      status: 404,
      message: "No cities found",
    });
  }
}

async function getAppointmentList(req, res) {
  // const currentDate = moment().startOf("day").format("YYYY-MM-DD");
  // const threeMonthsLater = moment()
  //   .add(3, "months")
  //   .startOf("day")
  //   .format("YYYY-MM-DD");

  // tableNames.appointmentBooking
  //   .findAll({
  //     attributes: ["booked_current_date", "booked_current_time"], // Include booked_current_time
  //     where: {
  //       booked_current_date: {
  //         [operatorsAliases.$between]: [currentDate, threeMonthsLater],
  //       },
  //       booking_status_id: 1,
  //     },
  //     raw: true,
  //   })
  //   .then((appointments) => {
  //     // Group appointments by booked_current_date
  //     const groupedAppointments = {};
  //     appointments.forEach((appointment) => {
  //       const date = appointment.booked_current_date;
  //       if (!groupedAppointments[date]) {
  //         groupedAppointments[date] = {
  //           booked_current_date: date,
  //           booked_current_time: [],
  //         };
  //       }
  //       groupedAppointments[date].booked_current_time.push({
  //         booked_current_time: appointment.booked_current_time,
  //       });
  //     });

  //     // Convert the object back to an array
  //     const result = Object.values(groupedAppointments);

  //     res.send({ status: 200, appointments: result });
  //     console.log("appointments===>", result);
  //   })
  //   .catch((error) => {
  //     console.error("Error fetching appointments:", error);
  //   });
  try {
    const currentDate = moment().startOf("day").format("YYYY-MM-DD");
    const threeMonthsLater = moment()
      .add(3, "months")
      .startOf("day")
      .format("YYYY-MM-DD");

    const appointmentCounts = await tableNames.appointmentBooking.findAll({
      attributes: [
        "booked_current_date",
        "booked_current_time",
        [sequelize.fn("COUNT", "appointment_booking_id"), "appointment_count"],
      ],
      where: {
        booked_current_date: {
          [operatorsAliases.$between]: [currentDate, threeMonthsLater],
        },
        booking_status_id: 1,
        appointment_delete_flag: 0,
      },
      group: ["booked_current_date", "booked_current_time"],
      raw: true,
    });

    const totalDoctors = await tableNames.doctorUser.count({
      where: { doctor_profile_update: 1, doctor_delete_flag: 0 },
    });

    const result = appointmentCounts
      .filter((appointment) => appointment.appointment_count === totalDoctors)
      .reduce((acc, appointment) => {
        const { booked_current_date, booked_current_time } = appointment;
        if (!acc[booked_current_date]) {
          acc[booked_current_date] = [];
        }
        acc[booked_current_date].push(booked_current_time);
        return acc;
      }, {});

    

    res.send({ status: 200, appointments: result });
    console.log("appointments===>", result);
  } catch (err) {
    error(res, err, 500);
  }
}

async function getAppointmentTimeList(req, res) {
  // moment
  var booked_current_date = req.body.booked_current_date;
  const currentDate = moment().startOf("day").format("YYYY-MM-DD");
  const threeMonthsLater = moment()
    .add(3, "months")
    .startOf("day")
    .format("YYYY-MM-DD");

  tableNames.appointmentBooking
    .findAll({
      attributes: ["booked_current_time"],
      where: {
        booked_current_date: {
          [operatorsAliases.$between]: [currentDate, threeMonthsLater],
        },
        booking_status_id: 1,
        booked_current_date: booked_current_date,
      },
      raw: true,
    })
    .then((appointments) => {
      res.send({ status: 200, appointments });
      console.log("appointments===>", appointments);
    })
    .catch((error) => {
      console.error("Error fetching appointments:", error);
    });
}

async function getGallery(req, res) {
  const getGallery = await tableNames.Gallery.findAll({
    where: {
      delete_flag: 0,
    },
  });

  successWithdata(res, "Gallery found", "Gallery not found", getGallery, 0);
}

module.exports = {
  getState,
  getCity,
  getCategory,
  getRole,
  getAppointmentList,
  getGallery,
  getAppointmentTimeList,
};
