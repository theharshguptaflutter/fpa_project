//manage users and doctors
const tableNames = require("../../../../utils/table_name");
const bcrypt = require("bcrypt");
const {
  success,
  error,
  successWithdata,
  success1,
  resetpasswordsucess,
  resetpassworderror,
  verifyemailsucess,
} = require("../../../../utils/responseApi");

async function createUser(req, res) {
  const email = req.body.email;
  const name = req.body.name;
  var password = req.body.password;
  const role_id = req.body.role_id;

  if (!email || !name || !password || !role_id) {
    res.statusCode = 404;
    return error(res, "Please provide email, name, password and role Id! ");
  }

  if (![1, 2].includes(role_id)) {
    res.statusCode = 404;
    return error(res, "Invalid role id selected. Allowed values are 1 & 2.");
  }

  try {
    const checkExistingUser = await tableNames.User.findOne({
      where: { email: email },
    });

    if (checkExistingUser) {
      res.statusCode = 409;
      return error(res, "User with this email already exists!");
    }

    if (password) {
      password = bcrypt.hashSync(String(password), 10);
    }
    let userInfo = {
      email: email,
      name: name,
      password: password,
      role_id: role_id,
    };
    const newUser = await tableNames.User.create(userInfo);

    return res.status(201).send({
      status: 201,
      message: "User created successfully",
      user_details: [
        {
          user_id: newUser.user_id,
          role_id: newUser.role_id,
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
        },
      ],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getUser(req, res) {
  const email = req.body.email;

  const user = await tableNames.User.findOne({
    where: { email: email },
  });
  if (user != null || user != "") {
    successWithdata(
      res,
      "User profle details found",
      "User not found!!",
      user,
      0
    );
  }
}

async function updateUser(req, res) {
  try {
    var email = req.body.email;
    var user_avatar = req.body.avatar;
    var password = req.body.password;

    if (password) {
      password = bcrypt.hashSync(String(password), 10);
    }
    let profileUpdateInfo = {
      state_id: req.body.state_id,
      city_id: req.body.city_id,
      name: req.body.name,
      email: req.body.email,
      password: password,
      gender: gender,
      avatar: user_avatar,
      role_id: role_id,
      user_profile_update: 1,
    };
    var userProfileUpdateParamiter = await editParameterQuery(
      profileUpdateInfo
    );
    const userProfileupdateQuery = await tableNames.User.update(
      userProfileUpdateParamiter,
      {
        where: {
          email: email,
        },
      }
    );

    if (userProfileupdateQuery != 0) {
      const updatedUserData = await tableNames.User.findOne({
        where: { email: email },
      });

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

async function deleteUser(req, res) {
  const email = req.body.email;

  if (!email) {
    res.statusCode(404);
    return error(res, "Please provide email!");
  }

  try {
    const userToDelete = await tableNames.User.findOne({
      where: { email: email },
    });

    if (!userToDelete) {
      res.statusCode = 404;
      return error(res, "User not found!");
    }
    var userDeleteParamiter = {
      user_delete_flag: 1,
    };
    const deleteUserQuery = await tableNames.User.update(userDeleteParamiter, {
      where: {
        email: email,
      },
    });

    if (deleteUserQuery) {
      const updatedUserData = await tableNames.User.findOne({
        where: { email: email },
      });

      successWithdata(
        res,
        "Profile has been deleted",
        200,
        updatedUserData.toJSON()
      );
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
