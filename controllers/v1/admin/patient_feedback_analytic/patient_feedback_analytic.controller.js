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






async function getPatientFeedback(req, res) {
  try {
    const startDate = req.query.startDate; 
    const endDate = req.query.endDate;   
    //console.log(startDate);
    const getGallery = await tableNames.userBookingFeedback.findAll({
      attributes: ["stars", "comment", "createdAt"],
      include: [{
        attributes: includeAttributesList.UserAttributesList,
        model: tableNames.User,
      }],
      where: {
        delete_flag: 0,
        ...(startDate && endDate
          ? {
            createdAt: {
              [operatorsAliases.$between]: [
                 literal(`'${startDate}'`),
                 literal(`'${endDate}'`),
              ]
            }
          }
          : startDate
            ? {
              [operatorsAliases.$and]: [
                literal(`DATE(user_booking_feedback.createdAt) = '${startDate}'`)
              ]
            }
            : {}
        ),
        // ...( endDate&& startDate
        //   ? {
        //     createdAt: {
        //       [operatorsAliases.$between]: 
        //       [
        //        // literal(`DATE(user_booking_feedback.createdAt)BETWEEN`),
        //         literal(`DATE(${startDate})`),
        //         literal(`DATE(${endDate})`)
        //       ]
        //     }
        //     }
        //   : {}),
        //   ...(startDate ? {
        //     [operatorsAliases.$and]: [
        //       literal(`DATE(user_booking_feedback.createdAt) = '${startDate}'`)
        //     ]
        //   } : {}),
        // ...(startDate 
        //   ? {
        //     createdAt: 
        //     { [operatorsAliases.$eq]: startDate}
        //     }
        //   : {}),
      },
    });

    if (!getGallery || getGallery.length === 0) {
      throw new Error("No feedback found within the specified date range");
    }

    const totalFeedbacks = getGallery.length;
    const totalStars = getGallery.reduce((acc, feedback) => acc + feedback.stars, 0);
    const averageStars = totalStars / totalFeedbacks;
    const percentage = (averageStars / 5) * 100;
    const cappedPercentage = Math.min(percentage, 100);

    const formattedPercentage = cappedPercentage.toFixed(2) + '%';

    successWithdata(res, "Patient feedback found", "Patient feedback not found within the specified date range", {
      satisfaction_score: formattedPercentage,
      patient_feedback_list: getGallery,
    }, 0);
  } catch (error) {
    console.error("Error:", error.message);
    // Handle the error accordingly
  }
}



module.exports = {
  getPatientFeedback
};