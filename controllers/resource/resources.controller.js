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
        const existingDateEntry = acc.find(
          (entry) => entry.booked_current_date === booked_current_date
        );

        if (existingDateEntry) {
          existingDateEntry.booked_current_time.push({
            booked_current_time: booked_current_time,
          });
        } else {
          acc.push({
            booked_current_date: booked_current_date,
            booked_current_time: [
              {
                booked_current_time: booked_current_time,
              },
            ],
          });
        }

        return acc;
      }, []);

    res.send({ status: 200, appointments: result });
    console.log("appointments===>", result);
  } catch (err) {
    res.statusCode = 500;
    error(res, err);
  }
}

async function getAppointmentTimeList(req, res) {
  // moment
  try {
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
  } catch (err) {
    res.statusCode = 500;
    error(res, err);
  }
}

async function getGallery(req, res) {
  try {
    const getGallery = await tableNames.Gallery.findAll({
      where: {
        delete_flag: 0,
      },
    });

    successWithdata(res, "Gallery found", "Gallery not found", getGallery, 0);
  } catch (err) {
    res.statusCode = 500;
    error(res, err);
  }
}


async function getPlatformUsage(req, res) {
  try {
    const getplatformUsageQuery = await tableNames.platformUsage.findAll({
      where: {
        delete_flag: 0,
      },
    });

    successWithdata(res, "Platform usage data found", "Platform usage data not found", getplatformUsageQuery, 0);
  } catch (err) {
    res.statusCode = 500;
    error(res, err);
  }
}
async function addPlatformUsage(req, res) {
  let platformInfo = {
    platform_type:req.body.platform_type,
    user_type:req.body.user_type,
  };
  
  if(platformInfo.platform_type == '' || platformInfo.user_type == ''){
 return  error(res, "Please fill up your field");
  }
  try {
    const addplatformUsageQuery = await tableNames.platformUsage.create(platformInfo);

    successWithdata(res, "Platform usage add", "Platform usage data not added", addplatformUsageQuery, 0);
  } catch (err) {
    res.statusCode = 500;
    error(res, err);
  }
}
module.exports = {
  getState,
  getCity,
  getCategory,
  getRole,
  getAppointmentList,
  getGallery,
  getAppointmentTimeList,
  getPlatformUsage,
  addPlatformUsage
};
