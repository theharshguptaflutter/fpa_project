const tableNames = require("../../../../utils/table_name");
const operatorsAliases = require("../../../../utils/operator_aliases");
const { literal, fn } = require("sequelize");
const {
  success,
  error,
  successWithdata,
} = require("../../../../utils/responseApi");

async function getTreatmentSuccessRate(req, res) {
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  try {
    const allAppointmentsRevenue = await tableNames.appointmentBooking.findAll({
      where: {
        booking_status_id: [1,2, 3, 5],
        appointment_delete_flag: 0,
        ...(startDate && endDate ? {
          createdAt: {
            [operatorsAliases.$between]: [startDate, endDate]
          }
        } : {})
      }
    });
    const paidAppointments = allAppointmentsRevenue.filter(appointment => [1, 5].includes(appointment.booking_status_id));
    
    const totalBookingPrice = paidAppointments.reduce((total, appointment) => total + appointment.total_booking_price, 0);
    const averageRevenue = totalBookingPrice / allAppointmentsRevenue.length;
    
    const unpaidAppointments = allAppointmentsRevenue.filter(appointment => [2, 3].includes(appointment.booking_status_id));
    const totalOutstandingPayments = unpaidAppointments.reduce((total, appointment) => total + appointment.total_booking_price, 0);
    
   // successWithdata(res, `Total revenue generated`, "as", { totalBookingPrice, averageRevenue, totalOutstandingPayments }, 0);
    
    //successWithdata(res, `Total_revenue_generated`, "as", { totalBookingPrice, averageRevenue ,totalOutstandingPayments}, 0);



    const allAppointments = await tableNames.appointmentBooking.findAll({
      where: {
        booking_status_id: [4, 5],
        appointment_delete_flag: 0,
        ...(startDate && endDate
          ? {
            createdAt: {
              [operatorsAliases.$between]: [
                literal(`'${startDate}'`),
                literal(`'${endDate}'`),
              ]
            }
          }
          : {})
      },
    });

    const totalAppointments = allAppointments.length;

    if (totalAppointments !== 0) {
      const successfulAppointments = allAppointments.filter(appointment => appointment.booking_status_id === 5);
      const unsuccessfulAppointments = allAppointments.filter(appointment => appointment.booking_status_id === 4);

      const successfulCount = successfulAppointments.length;
      const unsuccessfulCount = unsuccessfulAppointments.length;

      const successRate = (successfulCount / totalAppointments) * 100;
      const failureRate = (unsuccessfulCount / totalAppointments) * 100;



      // Retrieve user IDs from the user table
      const users = await tableNames.User.findAll();

      if (users.length === 0) {
        res.statusCode = 404;
        error(res, "No users found");
        return;
      }

      let regularPatientCount = 0;
      let newPatientCount = 0;

      for (const user of users) {
        const appointments = await tableNames.appointmentBooking.findAll({
          where: {
            user_id: user.user_id
          }
        });

        // If a user has multiple appointments, consider them as a regular patient
        if (appointments.length > 1) {
          regularPatientCount++;
        } else {
          newPatientCount++;
        }
      }

      const totalPatients = regularPatientCount + newPatientCount;
      const regularPatientsPercentage = (regularPatientCount / totalPatients) * 100;
      const newPatientsPercentage = (newPatientCount / totalPatients) * 100;

      const responseData = {
        regularPatients: regularPatientsPercentage.toFixed(2) + "%",
        newPatients: newPatientsPercentage.toFixed(2) + "%"
      };
      successWithdata(res, `Treatment success rate found`, 200, { Treatment_success_rate: `${successRate.toFixed(2)}%`, Treatment_failure_rate: `${failureRate.toFixed(2)}%`, Follow_up_Rate: responseData , totalBookingPrice, averageRevenue ,totalOutstandingPayments});//{ successfulAppointments, unsuccessfulAppointments }
    }

  } catch (err) {
    error(res, err, 500);

  }


}

module.exports = {
  getTreatmentSuccessRate,
};
