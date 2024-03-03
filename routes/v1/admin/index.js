const Router = require("router");
const { authJWT } = require("../../../middlewares/verify_token");

const router = Router();

const analytics = require("./analytics");
const profile = require("../admin/profile");
const gallery = require("../admin/gallery");
const auth = require("../admin/auth");
const user = require("../admin/user");
const doctor = require("../admin/doctor");
const appointment = require("../admin/appointments");
const notes = require("../admin/notes");
const user_feedback = require("../admin/user_feedback");
const doctor_feedback = require("../admin/doctor_feedback");
const patient_feedback_analytic = require("../admin/patient_feedback_analytic");
const permission = require("../admin/permission");
const health_outcomes_analytics = require("../admin/health_outcomes_analytics");
const operational_metrics = require("../admin/operational_metrics");


router.use("/auth",auth);
router.use("/profile", authJWT, profile);
router.use("/analytics", authJWT, analytics);
router.use("/gallery", authJWT, gallery);
router.use("/user", authJWT, user);
router.use("/doctor", authJWT, doctor);
router.use("/appointment", authJWT, appointment);
router.use("/notes", authJWT, notes);
router.use("/user_feedback", authJWT, user_feedback);
router.use("/doctor_feedback", authJWT, doctor_feedback);
router.use("/patient_feedback_analytic", authJWT, patient_feedback_analytic);
router.use("/permission", authJWT, permission);
router.use("/health_outcomes_analytics", authJWT, health_outcomes_analytics);
router.use("/operational_metrics", authJWT, operational_metrics);

module.exports = router;
