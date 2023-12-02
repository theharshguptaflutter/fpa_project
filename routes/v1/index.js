var Router = require("router");
// const { authJWT } = require("../../../middlewares/verify_token");
const router = Router();

const auth = require("./auth");



router.use("/auth", auth);


module.exports = router;
