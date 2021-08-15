const router = require('express').Router();
const {ANS_COMMENT,ADD_COMMENT, LOAD_COMMENT}= require('../controllers/comment.controller'); 

router.route('/addComment/:id').post(ADD_COMMENT);
router.route('/ansComment/:id').put(ANS_COMMENT);
router.route('/loadComment/:id').get(LOAD_COMMENT);

module.exports = router;
