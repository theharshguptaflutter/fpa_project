var Router = require("router");
const { authJWT } = require("../../middlewares/verify_token");
const router = Router();

const auth = require("./auth");
const profile = require("./profile");

router.use("/auth", auth);
router.use("/user",authJWT, profile);

module.exports = router;
