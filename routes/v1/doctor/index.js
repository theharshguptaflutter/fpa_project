const Router = require("router");
const { authJWT } = require("../../../middlewares/verify_token");

const router = Router();

const auth = require("../doctor/auth");
const profile = require("../doctor/profile");

router.use("/auth", auth);
router.use("/profile", authJWT, profile);

module.exports = router;
