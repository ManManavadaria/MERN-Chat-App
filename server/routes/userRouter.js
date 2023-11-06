const router = require("express").Router();

const {register, login , setAvatar, getAllUser ,logOut} = require("../controllers/userController");

router.post("/register",register);
router.post("/login",login);
router.post("/setavatar/:id",setAvatar);
router.get("/allusers/:id",getAllUser);

router.get("/logout/:id", logOut);
module.exports= router;