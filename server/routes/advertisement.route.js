const router = require('express').Router();
const {addRoomPost, addHousePost}= require('../controllers/advertise.controller');

router.route('/addRoom/:id').post(addRoomPost);
router.route('/addHouse/:id').post(addHousePost);

module.exports = router;
