const Comment = require("../models/comment.model");
const {
  pushNotification,
  mailNotification,
} = require("../middleware/notification.controller");

const ADD_COMMENT = async (req, res) => {
  let { postId, userId } = JSON.parse(req.params.id);
  const userComment = new Comment({
    postId: postId,
    createdBy: userId,
    name: req.body.name,
    question: req.body.question,
  });
  console.log(userComment);
  userComment
    .save()
    .then((data) => {
      console.log(data);
      // let link =
      //   " <h1>`${data.name} asks {data.question}`,<br> Click to answer.<br><a href=" +
      //   `http://${req.get("host")}/profile` +
      //   ">Click here to verify</a>";

      // mailNotification(`${req.body.email}`, `${req.body.name}`, link).then(
      //   (response) => {
      //     res.json(response);
      //     res.end(response);
      //   }
      // );
        let link = `<h1>${data.name} asks ${data.question},</h1> <br> 
          <a href="` + `http://${req.get("host")}/profile`+ `"> Click here to verify</a>`; 
        mailNotification(`${req.body}`)
        console.log(link);
      res.status(200).send({msg:"comment is added"});
    })
    .catch((err) => res.status(400).json("error" + err));
};

const ANS_COMMENT = async (req, res) => {
  console.log(req.body.answer);
  var data = {
    answer: req.body.answer,
    isAnswered: true,
  };
  Comment.findOneAndUpdate({ _id: req.params.id }, data).then((rData) => {
    res.json("Comment answered successfully");
  });
  console.log("comment is answered");
};

const LOAD_COMMENT = async (req, res) => {
  Comment.find({ postId: req.params.id }).then((data) => {
    return res.json(data);
  });
};

module.exports = { ADD_COMMENT, ANS_COMMENT, LOAD_COMMENT };
