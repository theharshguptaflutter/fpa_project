const Router = require("router");
const { authJWT } = require("../../../middlewares/verify_token");

const router = Router();

const analytics = require("./analytics");
const profile = require("../user/profile");
const appointment_booking = require("../user/appointment_booking");

router.use("/analytics",analytics );
router.use("/profile", authJWT, profile);
router.use("/appointment", authJWT, appointment_booking);

module.exports = router;
