const Room = require("../models/rooms.model.js");
const House = require("../models/house.model");
const User = require("../models/user.model");
const Comment = require("../models/comment.model");
const { v4: uuidv4 } = require("uuid");
const { cloudinary } = require("../config/cloudinary");

/**
 * USER_PROFILE_POST.
 *
 * @param {} req [id of the user logged in ]
 * @param {} res [json format of data]
 */
const USER_PROFILE_POST = (req, res) => {
  var posts = [];
  try {
    Room.find({ createdBy: req.params.id })
      .then((data) => {
        if (data) {
          posts = [...data];
          console.log(data);
        }
      })
      .then(() => {
        House.find({ createdBy: req.params.id }).then((data) => {
          if (data) {
            posts = [...posts, ...data];
            res.json(posts);
            console.log(data);
          }
        });
      });
  } catch (e) {
    res.json("There seems to be some problem try refreshing your page");
  }
};

/**
 * USER_PROFILE_INFO.
 *
 * @param {} req
 * @param {} res
 */
const USER_PROFILE_INFO = (req, res) => {
  User.findById(req.params.id).then((data) => {
    res.json(data);
  });
};

/**
 * UPDATE_USER_INFO.
 *
 * @param {} req
 * @param {} res
 */
const UPDATE_USER_INFO = (req, res) => {
  console.log(req.body, req.params.id);
  const data = {
    name: req.body.name,
    email: req.body.email,
  };
  User.findByIdAndUpdate(req.params.id, data).then((data) => {
    console.log(data);
    res.json({ message: "Info updated" });
  });
};

/**
 * UPDATE_USER_POST.
 *
 * @param {} req
 * @param {} res
 */
const UPDATE_USER_POST = async (req, res) => {
  const datas = await JSON.parse(req.body.additionalImage);
  var arr = [];
  if (datas.length > 0) {
    // try {
    await Promise.all(
      datas.map(async (data) => {
        console.log("reached block");
        let id = uuidv4();
        arr.push(id);
        let response = cloudinary.uploader.upload(data, {
          upload_preset: "dev_setups", // changes will be made later on
          public_id: id,
        });
        return response;
      })
    ).then(() => {
      let updated = {
        name: req.body.name,
        email: req.body.email,
        number: req.body.number,
        title: req.body.title,
        location: req.body.location,
        description: req.body.description,
        coordinates: {
          latitude: req.body.coordinates.latitude,
          longitude: req.body.coordinates.longitude,
        },
        rooms: {
          bedroom: req.body.rooms.bedroom,
          kitchen: req.body.rooms.kitchen,
          toilet: req.body.rooms.toilet,
          livingRoom: req.body.rooms.livingRoom,
        },
        facilities: req.body.facilities,
        furnished: req.body.furnished,
        price: req.body.price,
        imageCollection: [...req.body.imageCollection, ...arr],
      };
      console.log(updated);
      Room.findByIdAndUpdate(req.params.id, updated).then((data) => {
        console.log(data);
        res.status(201).send({ msg: "Post Updated" });
        // res.json({ message: "Post updated" });
      });
    });
  } else {
    let updated = {
      name: req.body.name,
      email: req.body.email,
      number: req.body.number,
      title: req.body.title,
      location: req.body.location,
      description: req.body.description,
      coordinates: {
        latitude: req.body.coordinates.latitude,
        longitude: req.body.coordinates.longitude,
      },
      rooms: {
        bedroom: req.body.rooms.bedroom,
        kitchen: req.body.rooms.kitchen,
        toilet: req.body.rooms.toilet,
        livingRoom: req.body.rooms.livingRoom,
      },
      facilities: req.body.facilities,
      furnished: req.body.furnished,
      price: req.body.price,
      imageCollection: [...req.body.imageCollection],
    };
    Room.findByIdAndUpdate(req.params.id, updated).then((data) => {
      console.log(data);
      // res.json({ message: "Post updated" });
      res.status(201).send({ msg: "Post Updated" });
    });
  }
};

const UPDATE_HOME_POST = async (req, res) => {
  const datas = await JSON.parse(req.body.additionalImage);
  var arr = [];
  if (datas.length > 0) {
    await Promise.all(
      datas.map(async (data) => {
        console.log("reached block");
        let id = uuidv4();
        arr.push(id);
        let response = cloudinary.uploader.upload(data, {
          upload_preset: "dev_setups", // changes will be made later on
          public_id: id,
        });
        return response;
      })
    ).then(() => {
      let updated = {
        name: req.body.name,
        email: req.body.email,
        number: req.body.number,
        title: req.body.title,
        location: req.body.location,
        description: req.body.description,
        coordinates: {
          latitude: req.body.coordinates.latitude,
          longitude: req.body.coordinates.longitude,
        },
        area: req.body.area,
        rooms: {
          bedroom: req.body.rooms.bedroom,
          kitchen: req.body.rooms.kitchen,
          toilet: req.body.rooms.toilet,
          livingRoom: req.body.rooms.livingRoom,
        },
        facilities: req.body.facilities,
        furnished: req.body.furnished,
        price: req.body.price,
        imageCollection: [...req.body.imageCollection, ...arr],
      };
      console.log(updated);
      House.findByIdAndUpdate(req.params.id, updated).then((data) => {
        console.log(data);
        // res.json({ message: "Post updated" });
        res.status(201).send({ msg: "Post Updated" });
      });
    });
  } else {
    let updated = {
      name: req.body.name,
      email: req.body.email,
      number: req.body.number,
      title: req.body.title,
      location: req.body.location,
      description: req.body.description,
      coordinates: {
        latitude: req.body.coordinates.latitude,
        longitude: req.body.coordinates.longitude,
      },
      area: req.body.area,
      rooms: {
        bedroom: req.body.rooms.bedroom,
        kitchen: req.body.rooms.kitchen,
        toilet: req.body.rooms.toilet,
        livingRoom: req.body.rooms.livingRoom,
      },
      facilities: req.body.facilities,
      furnished: req.body.furnished,
      price: req.body.price,
      imageCollection: [...req.body.imageCollection],
    };
    House.findByIdAndUpdate(req.params.id, updated).then((data) => {
      console.log(data);
      res.status(201).send({ msg: "Post Updated" });
    });
  }
};

/**
 * DELETE_USER_POST.
 *
 * @param {} req [post request that contains the id of post to be deleted]
 * @param {} res
 */
const DELETE_USER_POST = (req, res) => {
  console.log("yehol");
  console.log(req.params.id);
  console.log(req.body.type);
  if (req.body.type == "Room") {
    Room.findByIdAndDelete(req.params.id)
      .then((data) => {
        console.log("image data" + data);
        data.imageCollection.map(async (id) => {
          console.log("deleted" + id);
          await cloudinary.uploader.destroy(id, async (error, result) =>
            console.log(result, error)
          );
        });
      })
      .then(() => res.json("post deleted"))
      .catch((err) => res.status(404).json("error" + err));
  } else {
    House.findByIdAndDelete(req.params.id)
      .then((data) => {
        console.log("image data" + data);
        data.imageCollection.map(async (id) => {
          console.log("deleted" + id);
          await cloudinary.uploader.destroy(id, async (error, result) =>
            console.log(result, error)
          );
        });
      })
      .then(() => res.json("post deleted"))
      .catch((err) => res.status(404).json("error" + err));
  }
};

const ANSWER_USER_COMMENTS = (req, res) => {
  console.log("ansercomment");
  Room.find({ createdBy: req.params.id })
    .then(async (data) => {
      let datum1 = await Promise.all(
        data.map(async (item) => {
          return await Comment.find({ postId: item._id }).then((comment) => {
            // console.log(comment);
            return {
              title: item.title,
              image: item.imageCollection[0],
              comment: comment,
            };
          });
        })
      );
      return datum1;
    })
    .then((datum1) => {
      House.find({ createdBy: req.params.id }).then(async (data) => {
        let datum2 = await Promise.all(
          data.map(async (item) => {
            return await Comment.find({ postId: item._id }).then((comment) => {
              return {
                title: item.title,
                image: item.imageCollection[0],
                comment: comment,
              };
            });
          })
        );
        res.json([...datum1, ...datum2]);
      });
    });
};

const Notify = (req, res) => {};

module.exports = {
  USER_PROFILE_POST,
  USER_PROFILE_INFO,
  UPDATE_USER_INFO,
  UPDATE_USER_POST,
  UPDATE_HOME_POST,
  DELETE_USER_POST,
  ANSWER_USER_COMMENTS,
};
