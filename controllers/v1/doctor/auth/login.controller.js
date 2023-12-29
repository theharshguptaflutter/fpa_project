const tableNames = require("../../../../utils/table_name");
const { v4: uuidv4 } = require("uuid");
const otpTimeValidation = require("../../../../utils/otp_time_checker");
const {
  success,
  error,
  successWithdata,
  success1,
} = require("../../../../utils/responseApi");

var jwt = require("jsonwebtoken");

async function login(req, res) {
  const mobile_number = req.body.number;
  
  if (mobile_number != "") {
    let SqlQuery = await tableNames.doctorUser.findOne({
      where: { doctor_number: mobile_number },
    });

    var otpcode = 1234;

    const vvcode = uuidv4();
    var data = null;
    if (SqlQuery) {
      data = SqlQuery.toJSON();
      if (data["doctor_delete_flag"] == 1) {
        error(res, "you account has been deactivated", 404);
      }
    }

    const doctorUserOtp = await tableNames.Otp.create({
      verification_code: vvcode,
      otp_code: otpcode,
      doctor_id : data == null ? null : data["doctor_id"],
      number: mobile_number,
    });

    if (doctorUserOtp === 0) {
      error(res, "Otp not send");
    } else {
      successWithdata(
        res,
        "Verification code Found",
        "Verification code Not Found",
        {
          verification_code: doctorUserOtp["verification_code"],
        }
      );
    }
  } else {
    error(res, "Enter your number", 1);
  }
}

async function otpverify(req, res) {
  const otp = req.body.otp;
  const verification_code = req.body.verification_code;

  if (verification_code == null || verification_code == "") {
    error(res, "Enter your number", 1);
  }

  let otpFindQuery = await tableNames.Otp.findOne({
    where: {
      otp_code: otp,
      verification_code: verification_code,
    },
  });

  if (otpFindQuery == null) {
    error(res, "Otp not inserted", 409, 1);
  } else if (otpFindQuery["otp_active_status"] == 1) {
    error(res, "Otp already verified", 404, 1);
  } else if (
    otpFindQuery["otp_code"] != otp ||
    otpFindQuery["verification_code"] != verification_code
  ) {
    error(res, "Otp not match", 404, 1);
  } else {
    var otpTimestamp = otpFindQuery["otp_creation_dt"];
    var isExpired = await otpTimeValidation(otpTimestamp);
    if (isExpired) {
     
      error(res, "OTP has expired", 410, 1);
    } else {
      var data = otpFindQuery.toJSON();

      if (data["doctor_id"] == null) {
        var otp_id = data["otp_id"];
        var otpActivate = 1;
        var doctor_number = data["number"];

        let userinfo = {
          doctor_number: doctor_number,
        };

        const doctorUser = await tableNames.doctorUser.create(userinfo);
        if (doctorUser) {
          const privatekey = process.env.privateKey;
          let params = {
            doctor_id: doctorUser["doctor_id"],
            doctor_number: doctorUser["doctor_number"],
          };
          const token = await jwt.sign(params, privatekey, {
            expiresIn: "365d",
          });

          if (!token) {
            error(res, "Token not generated", 409, 1);
          } else {
            let tokeninfo = {
              doctor_id: doctorUser["doctor_id"],
              doctor_number: doctorUser["doctor_number"],
              gen_token: token,
            };
            const accessTokensGenInsetQuery =
              await tableNames.accessTokens.create(tokeninfo);
            if (!accessTokensGenInsetQuery) {
              error(res, "Generated token not inserted into db", 404, 1);
            } else {
              const otpVerified = await tableNames.Otp.update(
                {
                  otp_active_status: otpActivate,
                },
                { where: { otp_id: otp_id } }
              );

              if (!otpVerified) {
                error(res, "Otp not verified", 404, 1);
              } else {
                // success1(res, "doctorUser has been logout", 200);
                res.status(200).send({
                  status: 200,
                  isuserfound: false,
                  message: "Otp verified successfully",
                  user_details: [
                    {
                      doctor_id: doctorUser["doctor_id"],
                      token: token ?? " ",
                    },
                  ],
                });
              }
            }
          }
        }
      } else {
        var otp_active_status = data["otp_active_status"];

        uuid = data["doctor_id"];
        let doctorData = await tableNames.doctorUser.findOne({
          where: { doctor_id: uuid },
        });

        if (doctorData != null) {
          const privatekey = process.env.privateKey;
          let params = {
            doctor_id: doctorData["doctor_id"],
            doctor_number: doctorData["doctor_number"],
          };
          const token = await jwt.sign(params, privatekey, {
            expiresIn: "365Y",
          });

          if (!token) {
            error(res, "Token not generated", 404, 1);
          } else {
            let tokeninfo = {
              doctor_id: doctorData["doctor_id"],

              gen_token: token,
            };
            const sqlquery1 = await tableNames.accessTokens.create(tokeninfo);
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
                const userOnlineStatus = await tableNames.doctorUser.update(
                  {
                    doctor_online_status: 0,
                  },
                  { where: { doctor_id: uuid } }
                );
                if (!userOnlineStatus) {
                  error(res, "doctorUser online status not changes", 209);
                } else {
                  res.status(200).send({
                    status: 200,
                    isuserfound: true,
                    message: "Otp verified successfully",
                    doctor_details: [
                      {
                        doctor_id: doctorData["doctor_id"],
                        token: token ?? " ",
                      },
                    ],
                  });
                }
              }
            }
          }
        } else {
          error(res, "doctor not found", 404, 1);
        }
      }
    }
  }
}

async function logout(req, res) {
  try {
    var doctor_id = req.params.doctor_id;

    const updateQuery = tableNames.doctorUser.update(
      { doctor_online_status: 1 },
      {
        where: {
          doctor_id: doctor_id,
        },
      }
    );
    if (updateQuery != null) {
      success1(res, "doctorUser has been logout", 200);
    } else {
      error(res, "unable to logout please try again later ", 209);
    }
  } catch (error) {
    error(res, error, 500);
  }
}

async function tokenReGenerate(req, res) {
  var doctor_id = req.params.doctor_id;

  const findUser = await tableNames.doctorUser.findOne({
    where: {
      doctor_delete_flag: 0,
      doctor_id: doctor_id,
    },
  });
  var doctorData = null;
  if (findUser) {
    doctorData = findUser.toJSON();
    if (doctorData["doctor_delete_flag"] == 1) {
      error(res, "you account has been deactivated", 404);
    }
  }

  if (doctorData == null || doctorData == "") {
    error(res, "User Not Found", 404);
  } else {
    const privatekey = process.env.privateKey;
    let params = {
      doctor_id: doctorData["doctor_id"],
      userNumber: doctorData["doctor_number"],
    };
    const token = await jwt.sign(params, privatekey, {
      expiresIn: "30d",
    });

    if (!token) {
      error(res, "Token not generated", 404);
    } else {
      let tokeninfo = {
        doctor_id: doctorData["doctor_id"],
        number: doctorData["doctor_number"],
        gen_token: token,
      };
      const sqlquery1 = await tableNames.accessTokens.create(tokeninfo);
      if (!sqlquery1) {
        error(res, "Generated token not inserted into db", 404);
      } else {
        res.status(200).send({
          status: 200,

          message: "Token Regenerated",
          data: [
            {
              doctor_id: doctorData["doctor_id"],
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
