const tableNames = require("../utils/table_name");
var jwt = require("jsonwebtoken");
const { success, error, successWithdata } = require("../utils/responseApi");
async function authJWT(req, res, next) {
  try {
    var authorization = req.headers.authorization;
    token = authorization.split(" ")[1];

    if (token == null) {
      res.status(404).send({ message: "Token not found" });
      error(res, "");
    } else {
      const privatekey = process.env.privateKey;
      jwt.verify(token, privatekey, async (err, decoded) => {
        if (err) {
          res.status(200).send({ message: "invalid token" });
        }
        data = decoded;
        //console.log(data.brandlog);

        if (data.brandlog == null) {
          res.status(200).send({ message: "not authorized" });
        }
        {
          if (data.brandlog == true) {
            let Sqltoken = await tableNames.access_tokens.findOne({
              where: { access_tokens: token, brand_id: data.brands_id },
            });
            if (!Sqltoken) {
              res.status(403).send({ message: "token failed" });
            } else {
              let Sqlquery = await tableNames.brands.findOne({
                where: { brands_id: data.brands_id },
              });
              if (!Sqlquery) {
                res.status(403).send({ message: "brand not found" });
              }
            }
          } else {
            let Sqltoken = await tableNames.access_tokens.findOne({
              where: {
                access_tokens: token,
                influencer_id: data.influencer_id,
              },
            });
            if (!Sqltoken) {
              res.status(403).send({ message: "token failed" });
            } else {
              let Sqlquery = await tableNames.influencer.findOne({
                where: { influencer_id: data.influencer_id },
              });
              if (!Sqlquery) {
                res.status(403).send({ message: "Influencer not found" });
              }
            }
          }
        }
        // res.header("Access-Control-Allow-Origin", "*");
        // res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // res.header("Access-Control-Allow-Methods", "PUT, GET,POST");
        next();
      });
      //    let Sqlquery = await tableNames.access_tokens.findOne({ where: { access_tokens: token,} });
      //   console.log(Sqlquery);
      //    if(Sqlquery != null)
      //    {
      //     //       if(!token){
      //     //     res.status(404).send({message:"Token not found"})
      //     // }else{
      //     //        token = token.split(' ')[1];
      //     // const privatekey =  process.env.privateKey;
      //     // jwt.verify(token,privatekey, function(err, decoded){
      //     //     if(err)
      //     //     {
      //     //         res.status(200).send({message:"invalid token"})
      //     //     }else{
      //     //     }
      //     //     res.header("Access-Control-Allow-Origin", "*");
      //     //     res.header("Access-Control-Allow-Headers", "X-Requested-With");
      //     //     res.header("Access-Control-Allow-Methods", "PUT, GET,POST");
      //     //     next();
      //     // })
      //     // }
      //    }else{
      //        res.status(404).send({message:"invalid token"});
      //    }
    }
  } catch (error) {
    res.status(404).send({ message: "Token has not been provided" });
  }
}
module.exports = {
  authJWT,
};
