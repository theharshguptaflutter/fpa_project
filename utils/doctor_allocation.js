const tableNames = require("../utils/table_name");
const { Op } = require('sequelize');

async function findAvailableDoctor(bookingDate, bookingTime) {
  try {
    const availableDoctors = await tableNames.doctorUser.findAll({
      where: {
        doctor_id: {
          [Op.notIn]: sequelize.literal(`
            SELECT doctor_id
            FROM appointment_booking
            WHERE
              booked_current_date = '${bookingDate}' AND
              booked_current_time = '${bookingTime}' AND
              booking_status_id = 1 AND
              order_status = 'success' AND
              appointment_delete_flag = 0
          `),
        },
      },
      attributes: ['doctor_id'],
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