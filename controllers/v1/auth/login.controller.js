const tableNames = require("../../../utils/table_name");
const { v4: uuidv4 } = require("uuid");

const {
  success,
  error,
  validation,
  success1,
} = require("../../../utils/responseApi");

var jwt = require("jsonwebtoken");

async function login(req, res) {
  const mobile_number = req.body.number;

  if (mobile_number != "") {
    let SqlQuery = await tableNames.User.findOne({
      where: { user_number: mobile_number },
    });
    console.log(SqlQuery);

    //const otpcode = Math.floor(1000 + Math.random() * 9000);
    var otpcode = 1234;

    const vvcode = uuidv4();
    var data = null;
    if (SqlQuery) {
      data = SqlQuery.toJSON();
      if (data["user_delete_flag"] == 1) {
        error(res, "you account has been deactivated", 404);
      }
    }

    const UserOtp = await tableNames.Otp.create({
      verification_code: vvcode,
      otp_code: otpcode,
      user_id: data == null ? null : data["user_id"],
      number: mobile_number,
    });

    if (UserOtp === 0) {
      error(res, "Otp not send", 404);
    } else {
      //await sendOtpApi(mobile_number, otpcode);
      success(res, "Verification code", {
        verification_code: UserOtp["verification_code"],
      });
    }
  } else {
    error(res, "Enter your number", 404);
  }
}

async function otpverify(req, res) {
  const otp = req.body.otp;
  const verification_code = req.body.verification_code;

  let otpData = await tableNames.Otp.findOne({
    where: {
      otp_code: otp,
      verification_code: verification_code,
    },
  });
  if (otpData) {
    var data = otpData.toJSON();

    var otp_active_status = data["otp_active_status"];

    if (otp_active_status == 1) {
      error(res, "Otp already verified", 404);
    } else {
      if (data["user_id"] == null) {
        var otp_id = data["otp_id"];

        var otpActivate = 1;
        var u_number = data["number"];
        const coin = 200;

        let userinfo = {
          userNumber: u_number,
          coin: coin,
        };

        const user = await tableNames.User.create(userinfo);
        if (user) {
          const privatekey = process.env.privateKey;
          let params = {
            user_id: user["user_id"],
            userNumber: user["userNumber"],
          };
          const token = await jwt.sign(params, privatekey, {
            expiresIn: "365d",
          });

          if (!token) {
            error(res, "Token not generated", 404);
          } else {
            let tokeninfo = {
              user_id: user["user_id"],
              number: user["userNumber"],
              gen_token: token,
            };
            const sqlquery1 = await tableNames.gen_token.create(tokeninfo);
            if (!sqlquery1) {
              error(res, "Generated token not inserted into db", 404);
            } else {
              let transactioninfo = {
                user_id: user["user_id"],
                booking_id: null,
                reason: "New Registration",
                type: "in",
                coins: coin,
              };

              const sqlquery = await tableNames.walletsTransaction.create(
                transactioninfo
              );
              if (!sqlquery) {
                error(res, "transaction wallet not added", 404);
              } else {
                const otpVerified = await tableNames.Otp.update(
                  {
                    otp_active_status: otpActivate,
                  },
                  { where: { otp_id: otp_id } }
                );

                if (!otpVerified) {
                  error(res, "Otp not verified", 404);
                } else {
                  res.status(200).send({
                    status: 200,
                    isuserfound: false,
                    message: "Otp verified successfully",
                    user_details: [
                      {
                        user_id: user["user_id"],
                        reseller_id: user["reseller_id"],
                        name: user["user_name"] ?? " ",
                        photo: user["user_photo"] ?? " ",
                        email: user["userEmail"] ?? " ",
                        password: user["userPassword"] ?? " ",
                        number: user["userNumber"] ?? " ",
                        city: user["usercity"] ?? " ",
                        state: user["userstate"] ?? " ",
                        coin: user["coin"] ?? " ",
                        user_online_status: user["user_online_status"],
                        user_active_status: user["user_delete_flag"],
                        token: token ?? " ",
                      },
                    ],
                  });
                }
              }
            }
          }
        }
      } else {
        var otp_active_status = data["otp_active_status"];
        if (otp_active_status == 1) {
          error(res, "Otp already verified", 404);
        } else {
          uuid = data["user_id"];
          let userData = await tableNames.User.findOne({
            where: { user_id: uuid },
          });

          if (userData != null) {
            const privatekey = process.env.privateKey;
            let params = {
              user_id: userData["user_id"],
              userNumber: userData["userNumber"],
            };
            const token = await jwt.sign(params, privatekey, {
              expiresIn: "10d",
            });

            if (!token) {
              error(res, "Token not generated", 404);
            } else {
              let tokeninfo = {
                user_id: userData["user_id"],
                number: userData["userNumber"],
                gen_token: token,
              };
              const sqlquery1 = await tableNames.gen_token.create(tokeninfo);
              if (!sqlquery1) {
                error(res, "Generated token not inserted into db", 404);
              } else {
                const otpVerified = await tableNames.Otp.update(
                  {
                    otp_active_status: 1,
                  },
                  { where: { otp_id: data["otp_id"] } }
                );

                if (!otpVerified) {
                  error(res, "Otp not verified", 404);
                } else {
                  const userOnlineStatus = await tableNames.User.update(
                    {
                      user_online_status: 0,
                    },
                    { where: { user_id: uuid } }
                  );
                  if (!userOnlineStatus) {
                    error(res, "user online status not changes", 209);
                  } else {
                    res.status(200).send({
                      status: 200,
                      isuserfound: true,
                      message: "Otp verified successfully",
                      user_details: [
                        {
                          user_id: userData["user_id"],
                          reseller_id: userData["reseller_id"],
                          name: userData["user_name"] ?? " ",
                          photo: userData["user_photo"] ?? " ",
                          email: userData["userEmail"] ?? " ",
                          password: userData["userPassword"] ?? " ",
                          number: userData["userNumber"] ?? " ",
                          city: userData["usercity"] ?? " ",
                          state: userData["userstate"] ?? " ",
                          coin: userData["coin"] ?? " ",
                          user_online_status: userData["user_online_status"],

                          user_active_status: userData["user_delete_flag"],
                          token: token ?? " ",
                        },
                      ],
                    });
                  }
                }
              }
            }
          } else {
            error(res, "user not found", 404);
          }
        }
      }
    }
  } else {
    error(res, "Otp wrong", 404);
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
      error(res, "unable to logout please try again later ", 209);
    }
  } catch (error) {
    error(res, error, 500);
  }
}

async function tokenReGenerate(req, res) {
  var user_id = req.params.user_id;

  const findUser = await tableNames.User.findOne({
    where: {
      user_delete_flag: 0,
      user_id: user_id,
    },
  });
  var userData = null;
  if (findUser) {
    userData = findUser.toJSON();
    if (userData["user_delete_flag"] == 1) {
      error(res, "you account has been deactivated", 404);
    }
  }

  if (userData == null || userData == "") {
    error(res, "User Not Found", 404);
  } else {
    const privatekey = process.env.privateKey;
    let params = {
      user_id: userData["user_id"],
      userNumber: userData["userNumber"],
    };
    const token = await jwt.sign(params, privatekey, {
      expiresIn: "30d",
    });

    if (!token) {
      error(res, "Token not generated", 404);
    } else {
      let tokeninfo = {
        user_id: userData["user_id"],
        number: userData["userNumber"],
        gen_token: token,
      };
      const sqlquery1 = await tableNames.gen_token.create(tokeninfo);
      if (!sqlquery1) {
        error(res, "Generated token not inserted into db", 404);
      } else {
        res.status(200).send({
          status: 200,

          message: "Token Regenerated",
          data: [
            {
              user_id: userData["user_id"],
              token: token,
            },
          ],
        });
      }
    }
  }
}

module.exports = {
  login,
  otpverify,
  logout,
  tokenReGenerate,
};
