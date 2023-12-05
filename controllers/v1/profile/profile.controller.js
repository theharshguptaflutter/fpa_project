const tableNames = require("../../../utils/table_name");

const { success, error } = require("../../../utils/responseApi");
const editParameterQuery = require("../../../utils/edit_query");
const { s3Upload } = require("../../../utils/s3_file_upload");
async function userProfileUpdate(req, res) {
  try {
    var user_id = req.params.user_id;
    var user_avatar = req.body.avatar;

    if ( user_avatar != "") {
      user_avatar = await s3Upload(user_avatar);
    }
   
    let profileUpdateInfo = {
      role: req.body.role,
      state_id: req.body.state_id,
      city_id: req.body.city_id,
      name: req.body.name,
      email: req.body.email,
      avatar: user_avatar,
      user_profile_update: 1,
    };
    var userProfileUpdateParamiter = await editParameterQuery(
      profileUpdateInfo
    );
    const userProfileupdateQuery = tableNames.User.update(
      userProfileUpdateParamiter,
      {
        where: {
          user_id: user_id,
        },
      }
    );
    if (userProfileupdateQuery != null) {
      success(res, "Profile has been updated", 200, 1);
    } else {
      error(res, "Profile  not updated please try again later ", 209, 1);
    }
  } catch (err) {
    error(res, err, 500);
  }
}

module.exports = {
  userProfileUpdate,
};
