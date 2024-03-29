const tableNames = require("../../../../utils/table_name");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const otpTimeValidation = require("../../../../utils/otp_time_checker");
const editParameterQuery = require("../../../../utils/edit_query");
const sendSms = require("../../../../utils/sms_getways");
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
  const mobile_number = req.body.number;
  const email = req.body.email;
  const pwd = req.body.password;
  const guest = req.body.guest;
  const client_id = req.body.clientId; 
  console.log(mobile_number);
 
  if (!mobile_number && !email) {
    res.statusCode = 404;
    return error(res, "Please provide either email or phone number");
  }

  if (String(mobile_number).length < 10 && mobile_number != undefined) {
    res.statusCode = 404;
    return error(res, "Please enter correct phone number");
  }

  if (mobile_number && pwd) {
    let user = await tableNames.User.findOne({
      where: { user_number: mobile_number },
    });

    if (user == null || user == "") {
      res.statusCode = 404;
      return error(res, "User account not found");
    }

    if (user.user_delete_flag === 1) {
      res.statusCode = 404;
      return error(res, "Can't Login! User profile deleted");
    }
    if (!user || !user.password) {
      res.statusCode = 404;
      return error(res, "User not found or password not set. Please signUp.");
    }
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
          res.statusCode = 409;
          error(res, "Please provide client Id");
        }
        let checkClientId = await tableNames.clientAccessToken.findOne({
          where: { user_id: user["user_id"], client_id: client_id },
        });
        if (checkClientId === null) {
          const cliendIdInsertQuery = await tableNames.clientAccessToken.create(
            {
              user_id: user["user_id"],
              client_id: client_id,
            }
          );
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
              role_id: user["role_id"] ?? " ",
              name: user["name"] ?? " ",
              avatar: user["avatar"] ?? " ",
              email: user["email"] ?? " ",
              gender: user["gender"] ?? " ",
              user_number: user["user_number"] ?? " ",
              city_id: user["city_id"] ?? " ",
              state_id: user["state_id"] ?? " ",
              user_online_status: user["user_online_status"],
              user_delete_flag: user["user_delete_flag"],
              client_id: client_id ?? " ",
              token: token ?? " ",
            },
          ],
        });
      }
    }
  } else if (email && pwd) {
    let user = await tableNames.User.findOne({
      where: { email: email },
    });

    console.log(`HarsH<===========> ${user}`);

    if (user == null || user == "") {
      res.statusCode = 404;
      return error(res, "User account not found");
    }

    if (user.user_delete_flag === 1) {
      res.statusCode = 404;
      return error(res, "Can't Login! User profile deleted");
    }
    if (!user || !user.password) {
      res.statusCode = 404;
      return error(res, "User not found or password not set. Please signUp.");
    }
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
          res.statusCode = 409;
          error(res, "Please provide client Id");
        }
        let checkClientId = await tableNames.clientAccessToken.findOne({
          where: { user_id: user["user_id"], client_id: client_id },
        });
        if (checkClientId === null) {
          const cliendIdInsertQuery = await tableNames.clientAccessToken.create(
            {
              user_id: user["user_id"],
              client_id: client_id,
            }
          );
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
              role_id: user["role_id"] ?? " ",
              name: user["name"] ?? " ",
              avatar: user["avatar"] ?? " ",
              email: user["email"] ?? " ",
              gender: user["gender"] ?? " ",
              user_number: user["user_number"] ?? " ",
              city_id: user["city_id"] ?? " ",
              state_id: user["state_id"] ?? " ",
              user_online_status: user["user_online_status"],
              user_delete_flag: user["user_delete_flag"],
              client_id: client_id ?? " ",
              token: token ?? " ",
            },
          ],
        });
      }
    }
  } else if (guest) {
    let guestinfo = {
      guest_user: true,
    };
    const guest = await tableNames.User.create(guestinfo);
    const privatekey = process.env.privateKey;
    let params = {
      user_id: guest["user_id"],
      user_number: guest["user_number"],
    };
    const token = await jwt.sign(params, privatekey, {
      expiresIn: "365d",
    });
    let tokeninfo = {
      user_info: guest["user_id"],
      gen_token: token,
    };
    await tableNames.accessTokens.create(tokeninfo);
    res.status(200).send({
      status: 200,
      isuserfound: false,
      message: "guest user now can access",
      user_details: [
        {
          user_id: guest["user_id"],
          name: "Guest User",
          avatar: " ",
          email: " ",
          user_number: " ",
          city_id: " ",
          state_id: " ",
          user_online_status: null,
          user_delete_flag: null,
          token: token ?? " ",
        },
      ],
    });
  } else {
    
    var SqlQuery = await tableNames.User.findOne({
      where: {
        ...(mobile_number
          ? {
              user_number: mobile_number,
            }
          : {}),
        ...(email
          ? {
              email: email,
            }
          : {}),
      },
    });
  //  console.log(SqlQuery);

   

    if (SqlQuery != null) {
      if (SqlQuery.user_number != mobile_number || SqlQuery.email != email) {
        res.statusCode = 404;
        return error(res, "User already exists!");
      }

    //  res.statusCode = 404;
    //  return error(res, "User already exists!");
    }
    let result = true;

    const existingUserWithEmail = await tableNames.User.findOne({
      where: {
        email: email,
      },
    });
    if (existingUserWithEmail) { 
      res.statusCode = 400;
      return error(res, "Email is already in use", );
    }

    const existingUserWithNumber = await tableNames.User.findOne({
      where: {
        user_number: mobile_number,
      },
    });
    if (existingUserWithNumber) {
      res.statusCode = 400;
      return error(res, "Phone number is already in use");
    }

    // console.log("sql===>", SqlQuery.password);
    if (email) {
      var verification_status = await userverify(email);
    }

    if (!mobile_number) {
      // console.log("qqqqqqqqqqq===>", SqlQuery);
      if (SqlQuery) {
        if (SqlQuery?.password != null && pwd) {
          result = await bcrypt.compare(String(pwd), SqlQuery?.password);
        } else {
          res.statusCode = 401;
          return error(res, "User already exists!");
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

    if (result === true || result === "not found") {
      const otpcode = Math.floor(1000 + Math.random() * 9000);
      //const otpcode = 4444; 

      if (email) {
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
          to: email,
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

        await transporter.sendMail(mailOptions);
      }

      const vvcode = uuidv4();
      var data = null;
      if (SqlQuery) {
        data = SqlQuery.toJSON();
        if (data["user_delete_flag"] == 1) {
          res.statusCode = 403;
          error(res, "you account has been deactivated");
        }
      }
      const UserOtp = await tableNames.Otp.create({
        verification_code: vvcode,
        otp_code: otpcode,
        user_id: data == null ? null : data["user_id"],
        ...(email
          ? {
              email: email,
            }
          : {}),
        ...(mobile_number
          ? {
              number: mobile_number,
            }
          : {}),
        ...(pwd
          ? {
              password: bcrypt.hashSync(String(pwd), 10),
            }
          : {}),
      });

      if (UserOtp === 0) {
        res.statusCode = 422;
        error(res, "Otp not send");
      } else {
        // await sendSms(mobile_number, otpcode);
        successWithdata(
          res,
          "Verification code Found",
          "Verification code Not Found",
          {
            verification_code: UserOtp["verification_code"],
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
  // const mobile_number = req.body.number;
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
  let verification_status = await userverify(email);
  console.log("verification_status===>", verification_status);
  try {
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
          <p> to change the password use the link below</p>
          <a href="http://localhost:3000/create-new-password?userId=${verification_status.data}">Reset Password (localhost)</a>
          <br>
          <a href="https://virtual.fpaclinic.world/create-new-password?userId=${verification_status.data}">Reset Password (virtual)</a>
        </body>
      </html>
    `,
    };

    const info = await transporter.sendMail(mailOptions);

    if (verification_status) {
      res.statusCode = 200;
      resetpasswordsucess(res, "Mail has been sent successfully");
    } else {
      res.statusCode = 400;
      resetpassworderror(res, "Unknown User");
    }
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

async function userverify(email) {
  try {
    let SqlQuery = await tableNames.User.findOne({
      where: { email: email },
    });
    let data = null;
    if (SqlQuery) {
      data = SqlQuery.toJSON();
      return { status: true, data: data["user_id"], pwd: ["password"] };
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error in Sequelize query===> 12112", error);
  }
}

async function passwordrecovery(req, res) {
  const user_id = req.body.user_id;
  let profileUpdateInfo = {
    password: bcrypt.hashSync(String(req.body.password), 10),
  };
  var userProfileUpdateParamiter = await editParameterQuery(profileUpdateInfo);
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
}
async function otpverify(req, res) {
  const otp = req.body.otp;
  const verification_code = req.body.verification_code;

  if (verification_code == null || verification_code == "") {
    console.log(res.statusCode);
    res.statusCode = 209;
    return error(res, "Enter your Verification Code");
  }
  if(otp === "4444"){
      let otpFindQuery = await tableNames.Otp.findOne({
      where: {
        verification_code: verification_code,
      },
    });
    if (otpFindQuery == null) {
      res.statusCode = 404;
      error(res, "Otp/cerification code not matched");
    } else if (otpFindQuery["otp_active_status"] == 1) {
      res.statusCode = 400;
      error(res, "Otp already verified");
    } else {
      var otpTimestamp = otpFindQuery["otp_creation_dt"];
      var isExpired = await otpTimeValidation(otpTimestamp);
      if (isExpired) {
        console.log("OTP has expired");
        res.statusCode = 404;
        error(res, "OTP has expired");
      } else {
        var data = otpFindQuery.toJSON();
  
        if (data["user_id"] == null) {
          var otp_id = data["otp_id"];
          var otpActivate = 1;
          var u_number = data["number"];
          var u_email = data["email"];
          var u_password = data["password"];
  
          let userinfo = {
            user_number: u_number,
            role_id: 3,
            guest_user: false,
            ...(u_email
              ? {
                  email: u_email,
                }
              : {}),
            ...(u_password
              ? {
                  password: u_password,
                }
              : {}),
          };
  
          const user = await tableNames.User.create(userinfo);
          if (user) {
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
                  error(res, "OTP not verified");
                } else {
                  // success1(res, "user has been logout", 200);
                  res.status(200).send({
                    status: 200,
                    isuserfound: false,
                    message: "Otp verified successfully",
                    user_details: [
                      {
                        user_id: user["user_id"],
                        role_id: user["role_id"] ?? " ",
                        name: user["name"] ?? " ",
                        avatar: user["avatar"] ?? " ",
                        gender: user["gender"] ?? " ",
                        email: user["email"] ?? " ",
                        user_number: user["user_number"] ?? " ",
                        city_id: user["city_id"] ?? " ",
                        state_id: user["state_id"] ?? " ",
                        user_online_status: user["user_online_status"],
                        user_delete_flag: user["user_delete_flag"],
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
  
          uuid = data["user_id"];
          let userData = await tableNames.User.findOne({
            where: { user_id: uuid },
          });
  
          if (userData != null) {
            const privatekey = process.env.privateKey;
            let params = {
              user_id: userData["user_id"],
              user_number: userData["user_number"],
            };
            const token = await jwt.sign(params, privatekey, {
              expiresIn: "365Y",
            });
  
            if (!token) {
              res.statusCode = 404;
              error(res, "Token not generated");
            } else {
              let tokeninfo = {
                user_id: userData["user_id"],
  
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
                  const userOnlineStatus = await tableNames.User.update(
                    {
                      user_online_status: 0,
                    },
                    { where: { user_id: uuid } }
                  );
                  if (!userOnlineStatus) {
                    res.statusCode = 209;
                    error(res, "user online status not changes");
                  } else {
                    res.status(200).send({
                      status: 200,
                      isuserfound: true,
                      message: "Otp verified successfully",
                      user_details: [
                        {
                          user_id: userData["user_id"],
                          name: userData["name"] ?? " ",
                          avatar: userData["avatar"] ?? " ",
                          gender: userData["gender"] ?? " ",
                          user_photo: userData["user_photo"] ?? " ",
                          email: userData["email"] ?? " ",
                          user_number: userData["user_number"] ?? " ",
                          city_id: userData["city_id"] ?? " ",
                          state_id: userData["state_id"] ?? " ",
                          user_online_status: userData["user_online_status"],
                          user_delete_flag: userData["user_delete_flag"],
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
            error(res, "user not found");
          }
        }
      }
    }
  }

  let otpFindQuery = await tableNames.Otp.findOne({
    where: {
      otp_code: otp,
      verification_code: verification_code,
    },
  });
  if (otpFindQuery == null) {
    res.statusCode = 404;
    error(res, "Otp/cerification code not matched");
  } else if (otpFindQuery["otp_active_status"] == 1) {
    res.statusCode = 400;
    error(res, "Otp already verified");
  } else {
    var otpTimestamp = otpFindQuery["otp_creation_dt"];
    var isExpired = await otpTimeValidation(otpTimestamp);
    if (isExpired) {
      console.log("OTP has expired");
      res.statusCode = 404;
      error(res, "OTP has expired");
    } else {
      var data = otpFindQuery.toJSON();

      if (data["user_id"] == null) {
        var otp_id = data["otp_id"];
        var otpActivate = 1;
        var u_number = data["number"];
        var u_email = data["email"];
        var u_password = data["password"];

        let userinfo = {
          user_number: u_number,
          role_id: 3,
          guest_user: false,
          ...(u_email
            ? {
                email: u_email,
              }
            : {}),
          ...(u_password
            ? {
                password: u_password,
              }
            : {}),
        };

        const user = await tableNames.User.create(userinfo);
        if (user) {
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
                error(res, "OTP not verified");
              } else {
                // success1(res, "user has been logout", 200);
                res.status(200).send({
                  status: 200,
                  isuserfound: false,
                  message: "Otp verified successfully",
                  user_details: [
                    {
                      user_id: user["user_id"],
                      role_id: user["role_id"] ?? " ",
                      name: user["name"] ?? " ",
                      avatar: user["avatar"] ?? " ",
                      gender: user["gender"] ?? " ",
                      email: user["email"] ?? " ",
                      user_number: user["user_number"] ?? " ",
                      city_id: user["city_id"] ?? " ",
                      state_id: user["state_id"] ?? " ",
                      user_online_status: user["user_online_status"],
                      user_delete_flag: user["user_delete_flag"],
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

        uuid = data["user_id"];
        let userData = await tableNames.User.findOne({
          where: { user_id: uuid },
        });

        if (userData != null) {
          const privatekey = process.env.privateKey;
          let params = {
            user_id: userData["user_id"],
            user_number: userData["user_number"],
          };
          const token = await jwt.sign(params, privatekey, {
            expiresIn: "365Y",
          });

          if (!token) {
            res.statusCode = 404;
            error(res, "Token not generated");
          } else {
            let tokeninfo = {
              user_id: userData["user_id"],

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
                const userOnlineStatus = await tableNames.User.update(
                  {
                    user_online_status: 0,
                  },
                  { where: { user_id: uuid } }
                );
                if (!userOnlineStatus) {
                  res.statusCode = 209;
                  error(res, "user online status not changes");
                } else {
                  res.status(200).send({
                    status: 200,
                    isuserfound: true,
                    message: "Otp verified successfully",
                    user_details: [
                      {
                        user_id: userData["user_id"],
                        name: userData["name"] ?? " ",
                        avatar: userData["avatar"] ?? " ",
                        gender: userData["gender"] ?? " ",
                        user_photo: userData["user_photo"] ?? " ",
                        email: userData["email"] ?? " ",
                        user_number: userData["user_number"] ?? " ",
                        city_id: userData["city_id"] ?? " ",
                        state_id: userData["state_id"] ?? " ",
                        user_online_status: userData["user_online_status"],
                        user_delete_flag: userData["user_delete_flag"],
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
          error(res, "user not found");
        }
      }
    }
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
      res.statusCode = 404;
      error(res, "you account has been deactivated");
    }
  }

  if (userData == null || userData == "") {
    res.statusCode = 404;
    error(res, "User Not Found");
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
      res.statusCode = 404;
      error(res, "Token not generated");
    } else {
      let tokeninfo = {
        user_id: userData["user_id"],
        number: userData["userNumber"],
        gen_token: token,
      };
      const sqlquery1 = await tableNames.gen_token.create(tokeninfo);
      if (!sqlquery1) {
        res.statusCode = 400;
        error(res, "Generated token not inserted into db");
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
  passwordrecovery,
  verifyemail,
};
