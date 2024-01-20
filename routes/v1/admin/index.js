const Router = require("router");
const { authJWT } = require("../../../middlewares/verify_token");

const router = Router();

const analytics = require("./analytics");
const profile = require("../user/profile");
const appointment_booking = require("../user/appointment_booking");
const gallery = require("../admin/gallery");

router.use("/analytics", authJWT, analytics);
router.use("/profile", authJWT, profile);
router.use("/appointment", authJWT, appointment_booking);
router.use("/gallery", authJWT, gallery);

module.exports = router;
