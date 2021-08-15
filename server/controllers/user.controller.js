const validateRegisterInput = require("../validation/register.validate.js");
const path = require("path");
const validateLoginInput = require("../validation/login.validate.js");
const validateResetPassword = require("../validation/resetPassword.validate.js");
const key = require("../config/key.js");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const User = require("../models/user.model.js");
const Token = require("../models/token.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {
  pushNotification,
  mailNotification,
} = require("../middleware/notification.controller");

//register new user
const registerUser = (req, res, next) => {
  console.log("api is working");
  const { errors, isValid } = validateRegisterInput(req.body);

  //check validation
  if (!isValid) {
    console.log("validing" + errors);
    for (var property in errors) {
      console.log(property + "=" + errors[property]);
    }
    return res.status(400).json({ err: errors });
  }

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ msg: "email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        number: req.body.number,
      });

      //hash password before saving in databse
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => {
              const token = uuidv4();
              const newToken = new Token({
                _userId: user._id,
                token: token,
              });
              newToken.save(function (err) {
                if (err) {
                  return res.status(500).send({ msg: err.message });
                }

                let link =
                  "Hello,<br> Please Click on the link to verify you email.<br><a href=" +
                  `http://${req.get("host")}/api/user/verify?id=${token}` +
                  ">Click here to verify</a>";

                mailNotification(
                  `${req.body.email}`,
                  `${req.body.name}`,
                  link
                ).then((response) => {
                  return res
                    .status(201)
                    .json({ msg: "User created Please verify account" });
                  res.json(response);
                  res.end(response);
                });
              });
            })
            .catch((err) => console.log(err));
        });
      });
    }
  });
};

const verifyUser = (req, res) => {
  console.log(req.query.id, req.protocol, req.get("host"));
  Token.findOne({ token: req.query.id }).then((token) => {
    if (!token) {
      return res.status(400).json({ token: "token doest exist" });
    }
    console.log(token._id, token._userId);
    User.findOneAndUpdate({ _id: token._userId }, { isVerified: true }).then(
      res.sendFile(path.resolve(__dirname, "../landing", "verified.html"))
    );
  });
};

const loginUser = (req, res) => {
  //form validation
  const { errors, isValid } = validateLoginInput(req.body);

  //check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then((user) => {
    //check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        msg: "User is not verified please verify you account",
      });
    }

    if (user.profile) {
      if (user.password == password) {
        const payload = {
          id: user.id,
          name: user.name,
          profile: user.profile,
          email: user.email,
          number: user.number,
        };

        jwt.sign(
          payload,
          key.secretKey,
          {
            expiresIn: 3600,
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer" + token,
            });
          }
        );
      } else {
        return res
          .status(400)
          .send({ error: "username or passsword incorrect" });
      }
    }

    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        const payload = {
          id: user.id,
          name: user.name,
          profile: user.profile,
          email: user.email,
          number: user.number,
        };

        jwt.sign(
          payload,
          key.secretKey,
          {
            expiresIn: 3600,
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer" + token,
            });
          }
        );
      } else {
        return res
          .status(400)
          .send({ error: "username or passsword incorrect" });
      }
      console.log("logged");
    });
  });
};

const resetPasswordLink = async (req, res) => {
  let baseUrl =
    process.env.NODE_ENV === "production"
      ? `http://${req.get("host")}`
      : "http://localhost:3000";
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ msg: "User does not exists" });
  } else {
    console.log(`user exist ${user}`);
  }
  let token = await Token.findOne({ userId: user._id });
  if (token) await token.deleteOne();
  const newToken = uuidv4();
  await new Token({
    _userId: user._id,
    token: newToken,
  }).save();

  let link =
    "Hello,<br> Please Click on the link to  reset your password.<br><a href=" +
    `${baseUrl}/resetPassword/${newToken}` +
    ">Click here to verify</a>";

  mailNotification(`${req.body.email}`, `${user.name}`, link).then(
    (response) => {
      return res
        .status(201)
        .json({ msg: `Password Reset link sent to ${req.body.email}` });
      // res.json(response);
      // res.end(response);
    }
  );
};

const passwordResetToken = async (req, res) => {
  let token = await Token.findOne({ token: req.params.token });
  if (!token) {
    return res.status(404).json({ emailnotfound: "Email not found" });
  }

  const { errors, isValid } = validateResetPassword(req.body);
  if (!isValid) {
    console.log("is not valid");
    return res.status(400).json(errors);
  }
  console.log(token._userId);
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(req.body.newPassword, salt, (err, hash) => {
      if (err) throw err;
      User.findByIdAndUpdate(token._userId, {
        password: hash,
      }).then((data) => {
        console.log(data);
        res.status(200).send({ msg: "Password reset successful" });
      });
    });
  });
};

const resetPasswordLogged = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user.profile) {
    if (user.password == req.body.oldPassword) {
      const { errors, isValid } = validateResetPassword(req.body);
      if (!isValid) {
        console.log("is not valid");
        return res.status(400).json(errors);
      }
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.newPassword, salt, (err, hash) => {
          if (err) throw err;
          User.findByIdAndUpdate(req.params.id, {
            profile: false,
            password: hash,
          }).then((data) => {
            console.log(data);
            res.status(200).send({ msg: "Password reset successful" });
          });
        });
      });
    } else {
      res.status(403).send({ msg: "Incorrect OldPassword" });
    }
  } else {
    bcrypt.compare(req.body.oldPassword, user.password).then((isMatch) => {
      if (isMatch) {
        console.log("asdf");
        const { errors, isValid } = validateResetPassword(req.body);
        if (!isValid) {
          console.log("is not valid");
          return res.status(400).json(errors);
        }
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(req.body.newPassword, salt, (err, hash) => {
            if (err) throw err;
            User.findByIdAndUpdate(req.params.id, {
              password: hash,
            }).then((data) => {
              console.log(data);
              res.status(200).send({ msg: "Password reset successful" });
            });
          });
        });
      } else {
        res.status(403).send({ msg: "Incorrect OldPassword" });
      }
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyUser,
  resetPasswordLogged,
  resetPasswordLink,
  passwordResetToken,
};
