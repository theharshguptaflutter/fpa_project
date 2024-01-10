const tableNames = require("../../../../utils/table_name");

const {
  success,
  error,
  successWithdata,
} = require("../../../../utils/responseApi");

async function getAppointmentDoctorHistory(req, res) {
  const { doctor_id } = req.params;

  try {
    const doctorAppointmentHistory =
      await tableNames.appointmentBooking.findAll({
        include: [
          {
            attributes: ["user_id", "name", "email", "user_number"],
            model: tableNames.User,
          },
          {
            attributes: ["booking_status_name"],
            model: tableNames.bookingStatus,
          },
        ],
        where: {
          booking_status_id: 1,
          doctor_id: doctor_id,
        },
      });
    successWithdata(
      res,
      "Doctor appointment history found",
      "Doctor appointment history not found",
      doctorAppointmentHistory,
      0
    );
  } catch (err) {
    error(res, err, 500);
  }
}
module.exports = {
  getAppointmentDoctorHistory,
};
