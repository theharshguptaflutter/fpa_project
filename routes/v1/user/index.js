const Router = require("router");
const { authJWT } = require("../../../middlewares/verify_token");

const router = Router();

const auth = require("../user/auth");
const profile = require("../user/profile");
const appointment_booking = require("../user/appointment_booking");
const analytics = require("../user/analytics");

router.use("/auth",auth );
router.use("/profile", authJWT, profile);
router.use("/appointment", authJWT, appointment_booking);
router.use("/analytics", authJWT, analytics);

module.exports = router;
