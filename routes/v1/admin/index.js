const Router = require("router");
const { authJWT } = require("../../../middlewares/verify_token");

const router = Router();

const analytics = require("./analytics");
const profile = require("../admin/profile");
const gallery = require("../admin/gallery");
const auth = require("../admin/auth");
const user = require("../admin/user");
const doctor = require("../admin/doctor");

router.use("/auth",auth );
router.use("/profile", authJWT, profile);
router.use("/analytics", authJWT, analytics);
router.use("/gallery", authJWT, gallery);
router.use("/user", authJWT, user);
router.use("/doctor", authJWT, doctor);

module.exports = router;
