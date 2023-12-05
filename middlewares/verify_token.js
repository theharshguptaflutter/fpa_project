const tableNames = require("../utils/table_name");
var jwt = require("jsonwebtoken");
const { success, error, successWithdata } = require("../utils/responseApi");
async function authJWT(req, res, next) {
  try {
    var authorization = req.headers.authorization;
    token = authorization.split(" ")[1];

    if (token == null) {
      // res.status(404).send({ message: "Token not found" });
      error(res, "Token not found",1);
    } else {
      const privatekey = process.env.privateKey;
      jwt.verify(token, privatekey, async (err, decoded) => {
        if (err) {
          
          error(res, "invalid token",1);
        }
        data = decoded;
        console.log(data);

        if (data == null) {
          res.status(200).send({ message: "not authorized" });
        }
        {
          let Sqltoken = await tableNames.accessTokens.findOne({
            where: {
              gen_token: token,
              user_id: data.user_id,
            },
          });
          if (!Sqltoken) {
            error(res, "Token failed", err, 1);
          } else {
            let Sqlquery = await tableNames.User.findOne({
              where: { user_id: data.user_id },
            });
            if (!Sqlquery) {
              error(res, "User Not found", 1);
            }
          }
        }

        next();
      });
    }
  } catch (err) {
    error(res, "Token has not been provided", err, 0);
  }
}
module.exports = {
  authJWT,
};
