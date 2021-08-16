const router = require("express").Router();
const House = require("../models/house.model.js");
const Room = require("../models/rooms.model.js");
const { v4: uuidv4 } = require("uuid");
const { cloudinary } = require("../config/cloudinary");
const Notifier = require("../middleware/notifier.middleware");

/**
 * addPost.
 *
 * @param {[req]} req [req has category, title, description, images, location, coordinates]
 * @param {} res [res send in response of json confirming the state of the action]
 * @param {} next
 */
const addRoomPost = async (req, res, next) => {
  console.log(req.body);
  let _ = req.body;
  try {
    const datas = JSON.parse(_.imageCollection);
    const arr = [];
    await Promise.all(
      datas.map(async (data) => {
        let id = uuidv4();
        arr.push(id);
        let response = cloudinary.uploader.upload(data, {
          upload_preset: "dev_setups", // changes will be made later on
          public_id: id,
        });
        return response;
      })
    ).then(() => {
      const imageCollection = arr;
      const newRoom = new Room({
        createdBy: req.params.id,
        name: _.name,
        email: _.email,
        number: _.number,
        title: _.title,
        location: _.location,
        description: _.description,
        coordinates: {
          latitude: _.coordinates.latitude,
          longitude: _.coordinates.longitude,
        },
        rooms: {
          bedroom: _.rooms.bedroom,
          kitchen: _.rooms.kitchen,
          toilet: _.rooms.toilet,
          livingRoom: _.rooms.livingRoom,
        },
        facilities: _.facilities,
        furnished: _.furnished,
        price: _.price,
        imageCollection: imageCollection,
      });

      newRoom
        .save()
        .then((data) => {
          // Notifier(_.location, "Room", data._id, req.get("host"));
          res.status(201).json({msg: "Post added" });
        })
        .catch((err) => res.status(400).json("error" + err));
    });
  } catch (err) {
    res.status(500).json({ err: err });
  }
};

/**
 * addHousePost.
 *
 * @param {} req [id, title, location, coordinates,house details, price, imageCollection ]
 * @param {} res [status of the process]
 * @param {} next
 */

const addHousePost = async (req, res, next) => {
  let _ = req.body;
  try {
    const datas = JSON.parse(_.imageCollection);
    const arr = [];
    await Promise.all(
      datas.map(async (data) => {
        let id = uuidv4();
        arr.push(id);
        let response = cloudinary.uploader.upload(data, {
          upload_preset: "dev_setups", // changes will be made later on
          public_id: id,
        });
        return response;
      })
    ).then(() => {
      const imageCollection = arr;
      const newHouse = new House({
        createdBy: req.params.id,
        name: _.name,
        email: _.email,
        number: _.number,
        title: _.title,
        location: _.location,
        description: _.description,
        coordinates: {
          latitude: _.coordinates.latitude,
          longitude: _.coordinates.longitude,
        },
        area: _.area,
        rooms: {
          bedroom: _.rooms.bedroom,
          kitchen: _.rooms.kitchen,
          toilet: _.rooms.toilet,
          livingRoom: _.rooms.livingRoom,
        },
        facilities: _.facilities,
        furnished: _.furnished,
        price: _.price,
        imageCollection: imageCollection,
      });
      console.log(newHouse);
      newHouse
        .save()
        .then((data) => {
          // Notifier(_.location, "House", data._id, req.get("host"));
          res.status(201).json({msg: "Post added" });
        })
        .catch((err) => res.status(400).json("error" + err));
    });
  } catch (err) {
    res.status(500).json({ err: "Something went wrong" });
  }
};

module.exports = { addRoomPost, addHousePost };
