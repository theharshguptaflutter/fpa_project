const tableNames = require("../../../../utils/table_name");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const otpTimeValidation = require("../../../../utils/otp_time_checker");
const editParameterQuery = require("../../../../utils/edit_query");
const { success, error, successWithdata, success1, resetpasswordsucess, verifyemailsucess } = require("../../../../utils/responseApi");

var jwt = require("jsonwebtoken");

async function login(req, res) {
  const doctor_number = req.body.number;
  const doctor_email = req.body.email;
  const pwd = req.body.password;
  if (String(doctor_number).length < 10 && doctor_number !=undefined) {
    return error(res, "Please enter correct phone number", 404);
  }
  let SqlQuery = await tableNames.doctorUser.findOne({
    where: {
      ...(doctor_number
        ? {
            doctor_number: doctor_number
          }
        : {}),
      ...(doctor_email
        ? {
            doctor_email: doctor_email
          }
        : {})
    }
  });
  let result = true;
  if (!doctor_number) {
    let verification_status = await userverify(doctor_email);
    if (SqlQuery) {
      if (SqlQuery?.password != null && pwd) {
        result = await bcrypt.compare(String(pwd), SqlQuery?.password);
      } else {
        return error(res, "your password/email not added yet or you are already user", 404);
      }
    } else {
      if (!verification_status && pwd) {
        return error(res, "you are not registered user or please check your mail id", 404);
      } else {
        if(verification_status && pwd){
          result = null;
        }else{
          result = "not found";
        }
      }
    }
  }
  //comparing the password of the registered user
  if (result == true || result === "not found") {
    const otpcode = Math.floor(1000 + Math.random() * 9000);
    if (doctor_email) {
      const transporter = nodemailer.createTransport({
        host: process.env.HOST_MAIL,
        port: process.env.PORT_MAIL,
        secure: false,
        auth: {
          user: process.env.USER_MAIL,
          pass: process.env.PASSWORD_MAIL
        }
      });
      const mailOptions = {
        from: process.env.USER_MAIL,
        to: doctor_email,
        subject: "Recovery Password",
        html: `
      <html>
        <head></head>
        <body>
          <h1>Hello!</h1>
          <p>This is a validation mail.</p>
          <p>Your Email Otp is ${otpcode}</p>
        </body>
      </html>
    `
      };

      const info = await transporter.sendMail(mailOptions);
    }
    const vvcode = uuidv4();
    var data = null;
    if (SqlQuery) {
      data = SqlQuery.toJSON();
      if (data["doctor_delete_flag"] == 1) {
        error(res, "you account has been deactivated", 404);
      }
    }
    console.log("doctor_email==>", doctor_email);
    const doctorUserOtp = await tableNames.Otp.create({
      verification_code: vvcode,
      otp_code: otpcode,
      doctor_id: data == null ? null : data["doctor_id"],
      ...(doctor_email
        ? {
            email: doctor_email
          }
        : {}),
      ...(doctor_number
        ? {
            number: doctor_number
          }
        : {}),
      ...(pwd
        ? {
            password: bcrypt.hashSync(String(pwd), 10)
          }
        : {})
    });

    if (doctorUserOtp === 0) {
      error(res, "Otp not send");
    } else {
      successWithdata(res, "Verification code Found", "Verification code Not Found", {
        verification_code: doctorUserOtp["verification_code"]
      });
    }
  } else {
    return error(res, "Passwords do not match! Login failed.", 404);
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
      pass: process.env.PASSWORD_MAIL
    }
  });

  try {
    const otpcode = Math.floor(1000 + Math.random() * 9000);

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
    `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    if (verification_status) {
      resetpasswordsucess(res, "Mail has been sent successfully");
    } else {
      error(res, "Unknown User", 404);
    }
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

async function userverify(email) {
  try {
    let SqlQuery = await tableNames.doctorUser.findOne({
      where: { doctor_email: email }
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
    password: bcrypt.hashSync(String(req.body.password), 10)
  };
  var userProfileUpdateParamiter = await editParameterQuery(profileUpdateInfo);
  console.log("userProfileUpdateParamiter===>", userProfileUpdateParamiter);
  const userProfileupdateQuery = tableNames.doctorUser.update(userProfileUpdateParamiter, {
    where: {
      doctor_id: doctor_id
    }
  });

  if (userProfileupdateQuery != null) {
    verifyemailsucess(res, "Password has been changed");
  } else {
    error(res, "Profile  not updated please try again later ", 209, 1);
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
      verification_code: verification_code
    }
  });

  if (otpFindQuery == null) {
    error(res, "Otp not inserted", 409, 1);
  } else if (otpFindQuery["otp_active_status"] == 1) {
    error(res, "Otp already verified", 404, 1);
  } else if (otpFindQuery["otp_code"] != otp || otpFindQuery["verification_code"] != verification_code) {
    error(res, "Otp not match", 404, 1);
  } else {
    var otpTimestamp = otpFindQuery["otp_creation_dt"];
    var isExpired = await otpTimeValidation(otpTimestamp);
    if (isExpired) {
      error(res, "OTP has expired", 410, 1);
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
                doctor_email: d_email
              }
            : {}),
          ...(d_password
            ? {
                password: d_password
              }
            : {})
        };

        const doctorUser = await tableNames.doctorUser.create(userinfo);
        if (doctorUser) {
          const privatekey = process.env.privateKey;
          let params = {
            doctor_id: doctorUser["doctor_id"],
            doctor_number: doctorUser["doctor_number"]
          };
          const token = await jwt.sign(params, privatekey, {
            expiresIn: "365d"
          });

          if (!token) {
            error(res, "Token not generated", 409, 1);
          } else {
            let tokeninfo = {
              doctor_id: doctorUser["doctor_id"],
              doctor_number: doctorUser["doctor_number"],
              gen_token: token
            };
            const accessTokensGenInsetQuery = await tableNames.accessTokens.create(tokeninfo);
            if (!accessTokensGenInsetQuery) {
              error(res, "Generated token not inserted into db", 404, 1);
            } else {
              const otpVerified = await tableNames.Otp.update(
                {
                  otp_active_status: otpActivate
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
                      token: token ?? " "
                    }
                  ]
                });
              }
            }
          }
        }
      } else {
        var otp_active_status = data["otp_active_status"];

        uuid = data["doctor_id"];
        let doctorData = await tableNames.doctorUser.findOne({
          where: { doctor_id: uuid }
        });

        if (doctorData != null) {
          const privatekey = process.env.privateKey;
          let params = {
            doctor_id: doctorData["doctor_id"],
            doctor_number: doctorData["doctor_number"]
          };
          const token = await jwt.sign(params, privatekey, {
            expiresIn: "365Y"
          });

          if (!token) {
            error(res, "Token not generated", 404, 1);
          } else {
            let tokeninfo = {
              doctor_id: doctorData["doctor_id"],

              gen_token: token
            };
            const sqlquery1 = await tableNames.accessTokens.create(tokeninfo);
            if (!sqlquery1) {
              error(res, "Generated token not inserted into db", 404);
            } else {
              const otpVerified = await tableNames.Otp.update(
                {
                  otp_active_status: 1
                },
                { where: { otp_id: data["otp_id"] } }
              );

              if (!otpVerified) {
                error(res, "Otp not verified", 404);
              } else {
                const userOnlineStatus = await tableNames.doctorUser.update(
                  {
                    doctor_online_status: 0
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
                        token: token ?? " "
                      }
                    ]
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
          doctor_id: doctor_id
        }
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
      doctor_id: doctor_id
    }
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
      userNumber: doctorData["doctor_number"]
    };
    const token = await jwt.sign(params, privatekey, {
      expiresIn: "30d"
    });

    if (!token) {
      error(res, "Token not generated", 404);
    } else {
      let tokeninfo = {
        doctor_id: doctorData["doctor_id"],
        doctor_number: doctorData["doctor_number"],
        gen_token: token
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
              token: token
            }
          ]
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
  passwordrecovery
};
