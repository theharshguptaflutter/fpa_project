const tableNames = require("../utils/table_name");
const { Op } = require("sequelize");
const { db, sequelize } = require("../utils/conn");
// async function findAvailableDoctor(bookingDate, bookingTime) {
//   try {
//     const availableDoctors = await tableNames.doctorUser.findAll({
//       attributes: ["doctor_id"],
//       include:[{
//         model:tableNames.appointmentBooking,
//         where:{
//           booked_current_date : bookingDate ,
//                   booked_current_time : bookingTime,
//                   booking_status_id : 1 ,
//                   order_status : 'success' ,
//                   appointment_delete_flag : 0
//         }
//       }]
//       // where: {
//       //   doctor_id: {
//       //     [Op.notIn]: sequelize.literal(`
//       //       SELECT doctor_id
//       //       FROM appointment_bookings
//       //       WHERE
//       //         booked_current_date = '${bookingDate}' AND
//       //         booked_current_time = '${bookingTime}' AND
//       //         booking_status_id = 1 AND
//       //         order_status = 'success' AND
//       //         appointment_delete_flag = 0
//       //     `),
//       //   },
//       // },
//     });

//     if (availableDoctors.length > 0) {
//       return availableDoctors[0].doctor_id;
//     } else {
//       // No available doctors
//       return null;
//     }
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }

async function findAvailableDoctor(bookingDate, bookingTime) {
  try {
    const bookedDoctors = await tableNames.appointmentBooking.findAll({
      attributes: ["doctor_id"],
      where: {
        booked_current_date: bookingDate,
        booked_current_time: bookingTime,
        booking_status_id: 1,
        order_status: "success",
        appointment_delete_flag: 0,
      },
      raw: true,
    });

    const notBookedDoctorIds = bookedDoctors.map((doctor) => doctor.doctor_id);

    const availableDoctors = await tableNames.doctorUser.findAll({
      where: {
        doctor_id: {
          [Op.notIn]: notBookedDoctorIds,
        },
        doctor_profile_update: 1,
        doctor_delete_flag:0
      },
      attributes: ["doctor_id"],
    });
    if (availableDoctors.length > 0) {
      return availableDoctors[0].doctor_id;
    } else {
      // No available doctors
      return null;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = findAvailableDoctor;
