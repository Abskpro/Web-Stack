const Room = require("../models/rooms.model");
const House = require("../models/house.model");
const recommend = require("../middleware/contentFiltering.middleware");

const searchPost = (req, res) => {
    //search is based on the price, location and the facilities the the person is looking for.
    console.log(req.body.data.type);
    if (req.body.data.type == "room") {
        Room.find({ location: req.body.data.location })
            .then(async (data) => {
                // console.log(data);
                let arr = new Array(data.length).fill(0);
                let arr2 = [];
                const list = await recommend(data, req.body);
                console.log("this is recommendation", list.length);
                list.map((value) => {
                    arr2.push(value.id);
                });
                data.map((data) => {
                    index = arr2.indexOf(data.id);
                    arr[index] = data;
                });
                console.log("this is sorted recommendation", arr);
                res.json(arr);
            })
            .catch((err) => console.log(err));
    } else {
        House.find({ location: req.body.data.location })
            .then(async (data) => {
                // console.log(data);
                let arr = new Array(data.length).fill(0);
                let arr2 = [];
                const list = await recommend(data, req.body);
                console.log("this is recommendation", list);
                list.map((value) => {
                    arr2.push(value.id);
                });
                data.map((data) => {
                    index = arr2.indexOf(data.id);
                    arr[index] = data;
                });
                console.log("this is sorted recommendation", arr);
                res.json(arr);
            })
            .catch((err) => console.log(err));
    }
};

const getLatest = (req, res) => {
    console.log(`host is ${req.get("host")}`);
    House.find({})
        .then((data) => {
            return data.slice(-4);
        })
        .then((house) => {
            Room.find({}).then((data) => {
                res.json([house, data.slice(-4)]);
            });
        });
};

const searchOne = (req, res) => {
    if (req.params.type == "Room") {
        Room.findById(req.params.id).then((data) => {
            console.log(data);
            res.json(data);
        });
    } else {
        House.findById(req.params.id).then((data) => {
            console.log(data);
            res.json(data);
        });
    }
};

module.exports = { searchPost, getLatest, searchOne };
