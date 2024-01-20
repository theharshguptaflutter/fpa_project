const tableNames = require("../../../../utils/table_name");
const { db, sequelize } = require("../../../../utils/conn");
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

async function addDoctorAnalytics(req, res) {
  var doctor_id = req.params.doctor_id;
  var event_types_id = req.body.event_types_id;
  var click = req.body.click;

  try {
  const findUserAnalytics = await tableNames.doctorAnalytics.findOne({
    where: {
      doctor_id: doctor_id,
      event_types_id: event_types_id,
    },
  });
 
  if (!findUserAnalytics) {
    const addAppointmentInsert = await tableNames.doctorAnalytics.create({
      doctor_id: doctor_id,
      event_types_id: event_types_id,
      total_clicks: click,
    });

    if (addAppointmentInsert != null) {
      success(res, "User Analytics added", 200, 0);
    } else {
      error(res, "User Analytics not added", 500);
    }
  } else {
    const addAppointmentInsert = await tableNames.doctorAnalytics.update(
      {
        doctor_id: doctor_id,
        event_types_id: event_types_id,
        total_clicks: sequelize.literal('total_clicks + 1'),
      },
      { where: { doctor_id: doctor_id, event_types_id: event_types_id } }
    );

    if (addAppointmentInsert != null) {
      success(res, "User Analytics added", 200, 0);
    } else {
      error(res, "User Analytics not added", 500);
    }
  }

    } catch (err) {
      error(res, err, 500);
    }
}

module.exports = {
  addDoctorAnalytics,
};
