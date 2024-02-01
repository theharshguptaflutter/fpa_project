const tableNames = require("../../../../utils/table_name");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const otpTimeValidation = require("../../../../utils/otp_time_checker");
const editParameterQuery = require("../../../../utils/edit_query");
const {
  success,
  error,
  successWithdata,
  success1,
  resetpasswordsucess,
  verifyemailsucess,
} = require("../../../../utils/responseApi");

var jwt = require("jsonwebtoken");

async function login(req, res) {
  const doctor_number = req.body.number;
  const doctor_email = req.body.email;
  const pwd = req.body.password;
  const client_id = req.body.clientId;

  if (!doctor_number && !doctor_email) {
    res.statusCode = 404;
    return error(res, "Please provide either email or phone number");
  }

  if (String(doctor_number).length < 10 && doctor_number != undefined) {
    res.statusCode = 404;
    return error(res, "Please enter correct phone number");
  }

  if (doctor_email && pwd) {
    let user = await tableNames.doctorUser.findOne({
      where: { doctor_email: doctor_email },
    });
    if (!user || !user.password) {
      res.statusCode = 404;
      return error(res, "Doctor not found or password not set. Please signUp.");
    }
    const passChk = await bcrypt.compare(String(pwd), user.password);
    if (!passChk) {
      res.statusCode = 404;
      return error(res, "Incorrect Password!");
    }
    //Generating JWT token and sending user data
    const privatekey = process.env.privateKey;
    let params = {
      doctor_id: user["doctor_id"],
      doctor_number: user["doctor_number"],
    };
    const token = await jwt.sign(params, privatekey, {
      expiresIn: "365d",
    });

    if (!token) {
      res.statusCode = 409;
      error(res, "Token not generated");
    } else {
      let tokeninfo = {
        doctor_id: user["doctor_id"],
        doctor_number: user["doctor_number"],
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
          res.statusCode = 409;
          return error(res, "Please provide client Id");
        }
        let checkClientId = await tableNames.clientAccessToken.findOne({
          where: { doctor_id: user["doctor_id"], client_id: client_id },
        });
        if (checkClientId === null) {
          const cliendIdInsertQuery = await tableNames.clientAccessToken.create(
            {
              doctor_id: user["doctor_id"],
              client_id: client_id,
            }
          );
          if (!cliendIdInsertQuery) {
            res.statusCode = 409;
            return error(res, "Client Id not inserted into DB!");
          }
        }
        return res.status(200).send({
          status: 200,
          isuserfound: true,
          message: "Login successful",
          doctor_details: [
            {
              doctor_id: user["doctor_id"],
              doctor_name: user["doctor_name"] ?? " ",
              avatar: user["avatar"] ?? " ",
              gender: user["gender"] ?? " ",
              doctor_email: user["doctor_email"] ?? " ",
              doctor_number: user["doctor_number"] ?? " ",
              city_id: user["city_id"] ?? " ",
              state_id: user["state_id"] ?? " ",
              client_id: client_id ?? " ",
              doctor_online_status: user["doctor_online_status"],
              doctor_delete_flag: user["doctor_delete_flag"],
              token: token ?? " ",
            },
          ],
        });
      }
    }
  } else {
    let SqlQuery = await tableNames.doctorUser.findOne({
      where: {
        ...(doctor_number
          ? {
              doctor_number: doctor_number,
            }
          : {}),
        ...(doctor_email
          ? {
              doctor_email: doctor_email,
            }
          : {}),
      },
    });

    if (SqlQuery.doctor_number == doctor_number || SqlQuery.doctor_email == doctor_email) {
      res.statusCode = 404;
      return error(res, "Doctor already exists!");
    }
    let result = true;
    if (!doctor_number) {
      let verification_status = await userverify(doctor_email);
      if (SqlQuery) {
        if (SqlQuery?.password != null && pwd) {
          result = await bcrypt.compare(String(pwd), SqlQuery?.password);
        } else {
          res.statusCode = 401;
          return error(res, "You are already a User");
        }
      } else {
        if (!verification_status && pwd) {
          res.statusCode = 401;
          return error(
            res,
            "you are not registered user or please check your mail id"
          );
        } else {
          if (verification_status && pwd) {
            result = null;
          } else {
            result = "not found";
          }
        }
      }
    }
    //comparing the password of the registered user
    if (result == true || result === "not found") {
      // const otpcode = Math.floor(1000 + Math.random() * 9000);
      var otpcode = 4444;
      if (doctor_email) {
        const transporter = nodemailer.createTransport({
          host: process.env.HOST_MAIL,
          port: process.env.PORT_MAIL,
          secure: false,
          auth: {
            user: process.env.USER_MAIL,
            pass: process.env.PASSWORD_MAIL,
          },
        });
        const mailOptions = {
          from: process.env.USER_MAIL,
          to: doctor_email,
          subject: "Validation mail",
          html: `
      <html>
        <head></head>
        <body>
          <h1>Hello!</h1>
          <p>This is a validation mail.</p>
          <p>Your Email Otp is ${otpcode}</p>
        </body>
      </html>
    `,
        };

        const info = await transporter.sendMail(mailOptions);
      }
      const vvcode = uuidv4();
      var data = null;
      if (SqlQuery) {
        data = SqlQuery.toJSON();
        if (data["doctor_delete_flag"] == 1) {
          res.statusCode = 403;
          error(res, "you account has been deactivated");
        }
      }
      console.log("doctor_email==>", doctor_email);
      const doctorUserOtp = await tableNames.Otp.create({
        verification_code: vvcode,
        otp_code: otpcode,
        doctor_id: data == null ? null : data["doctor_id"],
        ...(doctor_email
          ? {
              email: doctor_email,
            }
          : {}),
        ...(doctor_number
          ? {
              number: doctor_number,
            }
          : {}),
        ...(pwd
          ? {
              password: bcrypt.hashSync(String(pwd), 10),
            }
          : {}),
      });

      if (doctorUserOtp === 0) {
        res.statusCode = 422;
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
      res.statusCode = 401;
      return error(res, "Passwords do not match! Login failed.");
    }
  }
}

async function verifyemail(req, res) {
  // const doctor_number = req.body.number;
  const email = req.body.email;

  const transporter = nodemailer.createTransport({
    host: process.env.HOST_MAIL,
    port: process.env.PORT_MAIL,
    secure: false,
    auth: {
      user: process.env.USER_MAIL,
      pass: process.env.PASSWORD_MAIL,
    },
  });

  try {
    // const otpcode = Math.floor(1000 + Math.random() * 9000);
    const otpcode = 4444;

    let verification_status = await userverify(email);
    const mailOptions = {
      from: process.env.USER_MAIL,
      to: email,
      subject: "Recovery Password",
      html: `
      <html>
        <head></head>
        <body>
          <h1>Hello!</h1>
          <p>This is a test recovery email.</p>
          <p>to change the password use the link below</p>
          <a href="http://localhost:8000/reset-password/doctor_id=${verification_status.data}">Reset Password</a>
        </body>
      </html>
    `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    if (verification_status) {
      resetpasswordsucess(res, "Mail has been sent successfully");
    } else {
      resetpassworderror(res, "Unknown User");
    }
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

async function userverify(email) {
  try {
    let SqlQuery = await tableNames.doctorUser.findOne({
      where: { doctor_email: email },
    });
    let data = null;
    if (SqlQuery) {
      data = SqlQuery.toJSON();
      return { status: true, data: data["doctor_id"] };
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error in Sequelize query===>", error);
  }
}

async function passwordrecovery(req, res) {
  const doctor_id = req.body.doctor_id;

  let profileUpdateInfo = {
    password: bcrypt.hashSync(String(req.body.password), 10),
  };
  var userProfileUpdateParamiter = await editParameterQuery(profileUpdateInfo);
  console.log("userProfileUpdateParamiter===>", userProfileUpdateParamiter);
  const userProfileupdateQuery = tableNames.doctorUser.update(
    userProfileUpdateParamiter,
    {
      where: {
        doctor_id: doctor_id,
      },
    }
  );

  if (userProfileupdateQuery != null) {
    verifyemailsucess(res, "Password has been changed");
  } else {
    res.statusCode = 304;
    error(res, "Profile  not updated please try again later ");
  }
}

async function otpverify(req, res) {
  const otp = req.body.otp;
  const verification_code = req.body.verification_code;

  if (verification_code == null || verification_code == "") {
    res.statusCode = 209;
    return error(res, "Enter your Verification Code");
  }

  let otpFindQuery = await tableNames.Otp.findOne({
    where: {
      otp_code: otp,
      verification_code: verification_code,
    },
  });

  if (otpFindQuery == null) {
    res.statusCode = 404;
    error(res, "Otp not matched/inserted");
  } else if (otpFindQuery["otp_active_status"] == 1) {
    res.statusCode = 400;
    error(res, "Otp already verified");
  } else if (
    otpFindQuery["otp_code"] != otp ||
    otpFindQuery["verification_code"] != verification_code
  ) {
    error(res, "Otp not match", 404, 1);
  } else {
    var otpTimestamp = otpFindQuery["otp_creation_dt"];
    var isExpired = await otpTimeValidation(otpTimestamp);
    if (isExpired) {
      res.statusCode = 404;
      error(res, "OTP has expired");
    } else {
      var data = otpFindQuery.toJSON();

      if (data["doctor_id"] == null) {
        console.log("userinfo==>", data);
        var otp_id = data["otp_id"];
        var otpActivate = 1;
        var doctor_number = data["number"];
        var d_password = data["password"];
        var d_email = data["email"];

        let userinfo = {
          doctor_number: doctor_number,
          ...(d_email
            ? {
                doctor_email: d_email,
              }
            : {}),
          ...(d_password
            ? {
                password: d_password,
              }
            : {}),
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
            res.statusCode = 409;
            error(res, "Token not generated");
          } else {
            let tokeninfo = {
              doctor_id: doctorUser["doctor_id"],
              doctor_number: doctorUser["doctor_number"],
              gen_token: token,
            };
            const accessTokensGenInsetQuery =
              await tableNames.accessTokens.create(tokeninfo);
            if (!accessTokensGenInsetQuery) {
              res.statusCode = 409;
              error(res, "Generated token not inserted into db");
            } else {
              const otpVerified = await tableNames.Otp.update(
                {
                  otp_active_status: otpActivate,
                },
                { where: { otp_id: otp_id } }
              );

              if (!otpVerified) {
                res.statusCode = 409;
                error(res, "Otp not verified");
              } else {
                // success1(res, "doctorUser has been logout", 200);
                res.status(200).send({
                  status: 200,
                  isuserfound: false,
                  message: "Otp verified successfully",
                  doctor_details: [
                    {
                      doctor_id: doctorUser["doctor_id"],
                      doctor_name: doctorUser["doctor_name"] ?? " ",
                      avatar: doctorUser["avatar"] ?? " ",
                      gender: doctorUser["gender"] ?? " ",
                      doctor_email: doctorUser["doctor_email"] ?? " ",
                      doctor_number: doctorUser["doctor_number"] ?? " ",
                      city_id: doctorUser["city_id"] ?? " ",
                      state_id: doctorUser["state_id"] ?? " ",
                      doctor_online_status: doctorUser["doctor_online_status"],
                      doctor_delete_flag: doctorUser["doctor_delete_flag"],
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
            res.statusCode = 404;
            error(res, "Token not generated");
          } else {
            let tokeninfo = {
              doctor_id: doctorData["doctor_id"],

              gen_token: token,
            };
            const sqlquery1 = await tableNames.accessTokens.create(tokeninfo);
            if (!sqlquery1) {
              res.statusCode = 404;
              error(res, "Generated token not inserted into db");
            } else {
              const otpVerified = await tableNames.Otp.update(
                {
                  otp_active_status: 1,
                },
                { where: { otp_id: data["otp_id"] } }
              );

              if (!otpVerified) {
                res.statusCode = 404;
                error(res, "Otp not verified");
              } else {
                const userOnlineStatus = await tableNames.doctorUser.update(
                  {
                    doctor_online_status: 0,
                  },
                  { where: { doctor_id: uuid } }
                );
                if (!userOnlineStatus) {
                  res.statusCode = 209;
                  error(res, "doctorUser online status not changes");
                } else {
                  res.status(200).send({
                    status: 200,
                    isuserfound: true,
                    message: "Otp verified successfully",
                    doctor_details: [
                      {
                        doctor_id: doctorData["doctor_id"],
                        doctor_name: doctorData["doctor_name"] ?? " ",
                        avatar: doctorData["avatar"] ?? " ",
                        gender: doctorData["gender"] ?? " ",
                        doctor_email: doctorData["doctor_email"] ?? " ",
                        doctor_number: doctorData["doctor_number"] ?? " ",
                        city_id: doctorData["city_id"] ?? " ",
                        state_id: doctorData["state_id"] ?? " ",
                        doctor_online_status:
                          doctorData["doctor_online_status"],
                        doctor_delete_flag: doctorData["doctor_delete_flag"],
                        token: token ?? " ",
                      },
                    ],
                  });
                }
              }
            }
          }
        } else {
          res.statusCode = 404;
          error(res, "doctor User not found");
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
      res.statusCode = 209;
      error(res, "unable to logout please try again later ");
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
      res.statusCode = 404;
      error(res, "you account has been deactivated");
    }
  }

  if (doctorData == null || doctorData == "") {
    res.statusCode = 404;
    error(res, "User Not Found");
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
      res.statusCode = 404;
      error(res, "Token not generated", 404);
    } else {
      let tokeninfo = {
        doctor_id: doctorData["doctor_id"],
        doctor_number: doctorData["doctor_number"],
        gen_token: token,
      };
      const sqlquery1 = await tableNames.accessTokens.create(tokeninfo);
      if (!sqlquery1) {
        res.statusCode = 400;
        error(res, "Generated token not inserted into db");
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
  verifyemail,
  passwordrecovery,
};
