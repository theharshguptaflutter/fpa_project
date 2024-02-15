const tableNames = require("../../../../utils/table_name");
const operatorsAliases = require("../../../../utils/operator_aliases");

const {
  success,
  error,
  successWithdata,
} = require("../../../../utils/responseApi");
const editParameterQuery = require("../../../../utils/edit_query");
const { s3Upload } = require("../../../../utils/s3_file_upload");
const bcrypt = require("bcrypt");

async function userProfileUpdate(req, res) {
  try {
    var user_id = req.params.user_id;
    var user_avatar = req.body.avatar;
    var password = req.body.password;
    var email = req.body.email;
    var number = req.body.number;
    // if (user_avatar != "") {
    //   user_avatar = await s3Upload(user_avatar);
    // }
    let user = await tableNames.User.findOne({
      where: { user_id: user_id },
    });
    if (user.user_delete_flag === 1) {
      res.statusCode = 404;
      return error(res, "Can't Update profile! User already deleted");
    }

    if (email) {
      const existingUserWithEmail = await tableNames.User.findOne({
        where: {
          email: req.body.email,
          user_id: { [operatorsAliases.$ne]: user_id }, // Exclude the current user from the check
        },
      });
      if (existingUserWithEmail) {
        res.statusCode = 400;
        return error(res, "Email is already in use");
      }
    }

    if (number) {
      const existingUserWithNumber = await tableNames.User.findOne({
        where: {
          user_number: req.body.number,
          user_id: { [operatorsAliases.$ne]: user_id }, // Exclude the current user from the check
        },
      });
      if (existingUserWithNumber) {
        res.statusCode = 400;
        return error(res, "Phone number is already in use");
      }
    }

    if (password) {
      password = bcrypt.hashSync(String(password), 10);
    }
    let profileUpdateInfo = {
      state_id: req.body.state_id,
      city_id: req.body.city_id,
      name: req.body.name,
      email: req.body.email,
      avatar: user_avatar,
      user_number: req.body.number,
      user_profile_update: 1,
      password: password,
      gender: req.body.gender,
    };
    var userProfileUpdateParamiter = await editParameterQuery(
      profileUpdateInfo
    );
    const userProfileupdateQuery = await tableNames.User.update(
      userProfileUpdateParamiter,
      {
        where: {
          user_id: user_id,
        },
      }
    );

    if (userProfileupdateQuery != 0) {
      const updatedUserData = await tableNames.User.findOne({
        where: { user_id: user_id },
      });

      console.log(updatedUserData);

      successWithdata(
        res,
        "Profile has been updated",
        200,
        updatedUserData.toJSON()
      );
    } else {
      res.statusCode = 404;
      error(res, "Profile  not updated please try again later ");
    }
  } catch (err) {
    error(res, err, 500);
  }
}

async function getUserProfile(req, res) {
  var user_id = req.params.user_id;
  let userFindQuery = await tableNames.User.findOne({
    include:[
     { 
      attributes: [
        "user_room_permission_id"
      ],
      model:tableNames.userRoomPermission,
      include:
      [
          {
            attributes: [
              "room_permission_name"
            ],
            model:tableNames.RoomPermission,
          }
      ]
      }
    ],
    where: { user_id: user_id, user_delete_flag: 0 },
  });
  if (userFindQuery != null || userFindQuery != "") {
    successWithdata(
      res,
      "User profle details found",
      "User profile details not found",
      userFindQuery,
      0
    );
  }
}

module.exports = {
  userProfileUpdate,
  getUserProfile,
};
