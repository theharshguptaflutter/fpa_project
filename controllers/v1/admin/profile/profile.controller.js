// update admin and staff profiles
const tableNames = require("../../../../utils/table_name");

const {
  success,
  error,
  successWithdata,
} = require("../../../../utils/responseApi");
const editParameterQuery = require("../../../../utils/edit_query");
const bcrypt = require("bcrypt");

async function userProfileUpdate(req, res) {
  try {
    var user_id = req.params.user_id;
    var password = req.body.password;
    if (password) {
      password = bcrypt.hashSync(String(password), 10);
    }
    let profileUpdateInfo = {
      email: req.body.email,
      password: password,
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
    res.statusCode = 500;
    error(res, err);
  }
}

async function getUserProfile(req, res) {
  try {
    var user_id = req.params.user_id;
    let userFindQuery = await tableNames.User.findOne({
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
  } catch (err) {
    res.statusCode = 500;
    error(res, err);
  }
}

module.exports = {
  userProfileUpdate,
  getUserProfile,
};
