const tableNames = require("../../../../utils/table_name");
const bcrypt = require("bcrypt");
const editParameterQuery = require("../../../../utils/edit_query");
const {
  success,
  error,
  successWithdata,
  success1,
  resetpasswordsucess,
  resetpassworderror,
  verifyemailsucess,
} = require("../../../../utils/responseApi");

var jwt = require("jsonwebtoken");

async function login(req, res) {
  try {
    const email = req.body.email;
    const pwd = req.body.password;
    const client_id = req.body.clientId;
    // const user_role = req.body.role_id;

    if (!email || !pwd) {
      res.statusCode = 404;
      return error(res, "Please provide both email and password");
    }

    let user = await tableNames.User.findOne({
      where: { email: email },
    });
    if (!user || !user.password) {
      res.statusCode = 404;
      return error(res, "User not found or password not set.");
    }
    const user_role = user.role_id;
    if (user_role === 1 || user_role === 2) {
      const passChk = await bcrypt.compare(String(pwd), user.password);
      if (!passChk) {
        res.statusCode = 404;
        return error(res, "Incorrect Password!");
      }
      //Generating JWT token and sending user data
      const privatekey = process.env.privateKey;
      let params = {
        user_id: user["user_id"],
        user_number: user["user_number"],
      };
      const token = await jwt.sign(params, privatekey, {
        expiresIn: "365d",
      });

      if (!token) {
        res.statusCode = 409;
        error(res, "Token not generated");
      } else {
        let tokeninfo = {
          user_id: user["user_id"],
          user_number: user["user_number"],
          gen_token: token,
        };
        const accessTokensGenInsetQuery = await tableNames.accessTokens.create(
          tokeninfo
        );
        if (!accessTokensGenInsetQuery) {
          res.statusCode = 409;
          error(res, "Generated token not inserted into db");
        } else {
          if (!client_id) {
            res.statusCode = 404;
            return error(res, "Unable to access the Client Id!");
          } else {
            let checkClientId = await tableNames.clientAccessToken.findOne({
              where: { user_id: user["user_id"], client_id: client_id },
            });
            if (checkClientId === null) {
              const cliendIdInsertQuery =
                await tableNames.clientAccessToken.create({
                  user_id: user["user_id"],
                  client_id: client_id,
                });
              if (!cliendIdInsertQuery) {
                res.statusCode = 409;
                error(res, "Client Id not inserted into DB!");
              }
            }
            return res.status(200).send({
              status: 200,
              isuserfound: true,
              message: "Login successful",
              user_details: [
                {
                  user_id: user["user_id"],
                  user_role: user["role_id"] ?? " ",
                  name: user["name"] ?? " ",
                  email: user["email"] ?? " ",
                  user_number: user["user_number"] ?? " ",
                  city_id: user["city_id"] ?? " ",
                  state_id: user["state_id"] ?? " ",
                  user_online_status: user["user_online_status"],
                  user_delete_flag: user["user_delete_flag"],
                  client_id: client_id ?? " ",
                  token: token ?? " ",
                  avatar: user["avatar"] ?? " ",
                },
              ],
            });
          }
        }
      }
    } else {
      res.statusCode = 404;
      return error(res, "User not an admin.");
    }
  } catch (err) {
    res.statusCode = 500;
    error(res, err);
  }
}

async function passwordrecovery(req, res) {
  try {
    const user_id = req.body.user_id;
    let profileUpdateInfo = {
      password: bcrypt.hashSync(String(req.body.password), 10),
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
      verifyemailsucess(res, "Password has been changed");
    } else {
      res.statusCode = 304;
      error(res, "Profile  not updated please try again later ");
    }
  } catch (err) {
    res.statusCode = 500;
    error(res, err);
  }
}

async function logout(req, res) {
  try {
    var user_id = req.params.user_id;

    const updateQuery = tableNames.User.update(
      { user_online_status: 1 },
      {
        where: {
          user_id: user_id,
        },
      }
    );
    if (updateQuery != null) {
      success1(res, "user has been logout", 200);
    } else {
      res.statusCode = 209;
      error(res, "unable to logout please try again later ");
    }
  } catch (err) {
    res.statusCode = 500;
    error(res, err);
  }
}

module.exports = {
  login,
  logout,
  passwordrecovery,
};
