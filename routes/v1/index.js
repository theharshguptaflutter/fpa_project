var Router = require("router");
const { authJWT } = require("../../middlewares/verify_token");
const router = Router();

const user = require("./user");
const doctor = require("./doctor");
const resource = require("../resource");
const admin = require("./admin");


router.use("/admin", admin);
router.use("/doctor", doctor);
router.use("/resource", resource);
router.use("/user", user);

module.exports = router;
