var Router = require("router");
const { authJWT } = require("../../middlewares/verify_token");
const router = Router();

const user = require("./user");
const doctor = require("./doctor");

router.use("/doctor", user);
router.use("/user", doctor);

module.exports = router;
