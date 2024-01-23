const Router = require("router");
const { authJWT } = require("../../../middlewares/verify_token");

const router = Router();

const auth = require("../doctor/auth");
const profile = require("../doctor/profile");
const appointment = require("../doctor/appointment");
const analytics = require("../doctor/analytics");
const feedback = require("../doctor/feedback");



router.use("/analytics", authJWT, analytics);
router.use("/auth", auth);
router.use("/profile", authJWT, profile);
router.use("/appointment", authJWT, appointment);
router.use("/feedback", authJWT, feedback);

module.exports = router;
