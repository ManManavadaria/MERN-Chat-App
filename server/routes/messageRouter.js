const { getMessages, addMessages } = require('../controllers/messageController');

const router = require('express').Router();

router.post("/getmsg",getMessages);
router.post("/addmsg",addMessages);

module.exports = router ;