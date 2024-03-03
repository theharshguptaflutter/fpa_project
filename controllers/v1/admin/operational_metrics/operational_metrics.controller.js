


// update admin and staff profiles
const tableNames = require("../../../../utils/table_name");
const { s3Upload, s3VideoUpload } = require("../../../../utils/s3_file_upload");
const includeAttributes = require("../sequelize_attributes/doctor_feedback_attributes.js");
const operatorsAliases = require("../../../../utils/operator_aliases");
const includeAttributesList = new includeAttributes();
const { literal, fn } = require("sequelize");
const {
  success,
  error,
  successWithdata,
} = require("../../../../utils/responseApi");
const editParameterQuery = require("../../../../utils/edit_query");






async function getOperationalMetrics(req, res) {
  try {
    const startDate = req.query.startDate; 
    const endDate = req.query.endDate;   
    //console.log(startDate);
    const doctorsFindQuery = await tableNames.doctorUser.findAll({
      where: {
        doctor_delete_flag: 0,
      },
    });
    
    const data = await Promise.all(doctorsFindQuery.map(async (doctor) => {
      console.log(doctor);
    
    
      const appointmentBookingFindQuery = await tableNames.appointmentBooking.findAll({
        attributes: ["appointment_booking_id"],
        where: {
          doctor_id: doctor.doctor_id,
          appointment_delete_flag: 0,
          doctor_availability_status: 0,
          ...(startDate && endDate ? {
            createdAt: {
              [operatorsAliases.$between]: [startDate, endDate]
            }
          } : {})
        },
      });
    
     
      const appointmentCount = appointmentBookingFindQuery.length;
    
     
      const totalAppointments = await tableNames.appointmentBooking.count({
        where: {
          doctor_id: doctor.doctor_id,
          appointment_delete_flag: 0,
          doctor_availability_status: 0,
          booking_status_id:5
          , ...(startDate && endDate ? {
            createdAt: {
              [operatorsAliases.$between]: [startDate, endDate]
            }
          } : {})
        }
      });
    
     
      const utilization = totalAppointments === 0 ? 0 : (appointmentCount / totalAppointments) * 100;
      const utilizationPercentage = Math.min(100, Math.max(0, utilization));
    
      return {
        doctor_id: doctor.doctor_id,
        doctor_name: doctor.doctor_name,
        doctor_email: doctor.doctor_email,
      
        total_schedules: totalAppointments,
        utilization: utilizationPercentage.toFixed(2) 
      };
    }));

    successWithdata(
      res,
      "Operational Metrics data",
      200,
      data,
      0
    );
    
  } catch (error) {
    console.error("Error:", error.message);
  }
}



module.exports = {
    getOperationalMetrics
};