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

async function addUserAnalytics(req, res) {
  var user_id = req.params.user_id;
  var event_types_id = req.body.event_types_id;
  var click = req.body.click;

  try {
  const findUserAnalytics = await tableNames.userAnalytics.findOne({
    where: {
      user_id: user_id,
      event_types_id: event_types_id,
    },
  });
 
  if (!findUserAnalytics) {
    const addAppointmentInsert = await tableNames.userAnalytics.create({
      user_id: user_id,
      event_types_id: event_types_id,
      total_clicks: click,
    });

    if (addAppointmentInsert != null) {
      success(res, "User Analytics added", 200, 0);
    } else {
      error(res, "User Analytics not added", 500);
    }
  } else {
    const addAppointmentInsert = await tableNames.userAnalytics.update(
      {
        user_id: user_id,
        event_types_id: event_types_id,
        total_clicks: sequelize.literal('total_clicks + 1'),
      },
      { where: { user_id: user_id, event_types_id: event_types_id } }
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
  addUserAnalytics,
};
