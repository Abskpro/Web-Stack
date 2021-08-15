const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    postId:{
        type:String,
        required:true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    question: {
        type: String,
        default:null
    },
    answer: {
        type: String,
        default:null
    },
    isAnswered: {
        type: Boolean,
        default: false,
    },
});

const Comment = mongoose.model('Comment',commentSchema);

module.exports = Comment;
