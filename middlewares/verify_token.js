const tableNames = require("../utils/table_name");
var jwt = require("jsonwebtoken");
const { success, error, successWithdata } = require("../utils/responseApi");
async function authJWT(req, res, next) {
  try {
    var authorization = req.headers.authorization;
    token = authorization.split(" ")[1];

    if (token == null) {
      error(res, "Token not found", 1);
    } else {
      const privatekey = process.env.privateKey;
      jwt.verify(token, privatekey, async (err, decoded) => {
        if (err) {
          error(res, "invalid token", 1);
        }
        data = decoded;

        if (data == null || data == "") {
          res.status(200).send({ message: "not authorized" });
        } else {
          if (
            data.user_id == null ||
            data.user_id == "" ||
            data.user_id == undefined
          ) {
            let Sqltoken = await tableNames.accessTokens.findOne({
              where: {
                gen_token: token,
                doctor_id: data.doctor_id,
              },
            });

            if (Sqltoken == null || Sqltoken == "") {
              error(res, "Token failed", err, 1);
            } else {
              let Sqlquery = await tableNames.doctorUser.findOne({
                where: { doctor_id: data.doctor_id },
              });
              if (!Sqlquery) {
                error(res, "doctor Not found", 1);
              }
              next();
            }
          } else {
            let Sqltoken = await tableNames.accessTokens.findOne({
              where: {
                gen_token: token,
                user_id: data.user_id,
              },
            });

            if (Sqltoken == null || Sqltoken == "") {
              error(res, "Token failed", err, 1);
            } else {
              let Sqlquery = await tableNames.User.findOne({
                where: { user_id: data.user_id },
              });
              if (!Sqlquery) {
                error(res, "User Not found", 1);
              }
              next();
            }
          }
        }
      });
    }
  } catch (err) {
    error(res, "Token has not been provided", err, 0);
  }
}
module.exports = {
  authJWT,
};
