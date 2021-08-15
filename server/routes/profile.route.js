const router = require('express').Router();
const {
    UPDATE_USER_INFO,
    USER_PROFILE_INFO,
    UPDATE_USER_POST,
    UPDATE_HOME_POST,
    USER_PROFILE_POST,
    DELETE_USER_POST,
    ANSWER_USER_COMMENTS,
    LOAD_REPLY
} = require('../controllers/profile.controller');


router.route('/post/:id').get(USER_PROFILE_POST);
router.route('/info/:id').get(USER_PROFILE_INFO);
router.route('/updatePost/:id').put(UPDATE_USER_POST);
router.route('/updateHomePost/:id').put(UPDATE_HOME_POST);
router.route('/updateUser/:id').put(UPDATE_USER_INFO);
router.route('/deletepost/:id').post(DELETE_USER_POST);
router.route('/loadComment/:id').get(ANSWER_USER_COMMENTS);
router.route('/loadReply/:id').get(LOAD_REPLY);


module.exports = router
