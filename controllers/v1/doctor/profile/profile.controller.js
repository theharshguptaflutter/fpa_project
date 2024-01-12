const tableNames = require("../../../../utils/table_name");

const {
  success,
  error,
  successWithdata,
} = require("../../../../utils/responseApi");
const editParameterQuery = require("../../../../utils/edit_query");
const { s3Upload } = require("../../../../utils/s3_file_upload");
const { where } = require("sequelize");
const bcrypt = require("bcrypt");


async function userProfileUpdate(req, res) {
  try {
    var doctor_id = req.params.doctor_id;
    var doctor_photo = req.body.photo;
    var category_id = req.body.category_id;
    var password = req.body.password;
    // if (user_avatar != "") {
    //   user_avatar = await s3Upload(user_avatar);
    // }
    if (password){
      password = bcrypt.hashSync(String(password), 10);
    }

    let profileUpdateInfo = {
      state_id: req.body.state_id,
      city_id: req.body.city_id,
      doctor_name: req.body.doctor_name,
      doctor_email: req.body.doctor_email,
      doctor_number: req.body.doctor_number,
      photo: doctor_photo,
      password:  password,
      doctor_occupation: req.body.doctor_occupation,
      doctor_specialist: req.body.doctor_specialist,
      doctor_profile_update: 1,
    };
    var userProfileUpdateParamiter = await editParameterQuery(
      profileUpdateInfo
    );
    const userProfileupdateQuery = await tableNames.doctorUser.update(
      userProfileUpdateParamiter,
      {
        where: {
          doctor_id: doctor_id,
        },
      }
    );
    if (userProfileupdateQuery != null) {
      let doctorCategoryInfo = {
        doctor_id: doctor_id,
        category_id: category_id,
      };
      const doctorCategory = await tableNames.doctorCategory.findOne({
        where: {doctor_id: doctor_id},
      })
      if(doctorCategory){
        const updateDoctorCategory = await tableNames.doctorCategory.update(
          doctorCategoryInfo,
          {
            where: {
              doctor_id: doctor_id,
            },
          }
        );
      }else{
        const doctorCategoryInsertQuery = tableNames.doctorCategory.create(doctorCategoryInfo);
      }
      // const doctorCategoryInsertQuery = tableNames.doctorCategory.create(doctorCategoryInfo);
      const updatedUserData = await tableNames.doctorUser.findOne({
        where: {doctor_id: doctor_id},
      })
      successWithdata(res, "Profile has been updated", 200, updatedUserData.toJSON());
    } else {
      res.statusCode= 404;
      error(res, "Profile  not updated please try again later ");
    }
  } catch (err) {
    error(res, err, 500);
  }
}

async function getUserProfile(req, res) {
  var doctor_id = req.params.doctor_id;

  let doctorFindQuery = await tableNames.doctorUser.findOne({
    where: { doctor_id: doctor_id, doctor_delete_flag: 0 },
  });
  successWithdata(
    res,
    "Doctor profle details found",
    "Doctor profile details not found",
    doctorFindQuery,
    0
  );
}

module.exports = {
  userProfileUpdate,
  getUserProfile,
};
