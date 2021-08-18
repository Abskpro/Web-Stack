const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const port = process.env.PORT || 5000;
const InitiateMongoServer = require("./config/db");

const UserRouter = require("./routes/user.route");
const AdRouter = require("./routes/advertisement.route");
const SearchRouter = require("./routes/search.route");
const CommentRouter = require("./routes/comment.route");
const ProfileRouter = require("./routes/profile.route");
const AdminRouter = require("./routes/admin.route");
const PostNotifications = require("./routes/postNotification.route");
const { mailNotification } = require("./middleware/notification.controller");

const app = express();

app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);

    // Pass to next layer of middleware
    next();
});

InitiateMongoServer();

app.use("/admin", AdminRouter);
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
app.use(cors());

app.use("/api/user", UserRouter);
app.use("/api/ad", AdRouter);
app.use("/api/search", SearchRouter);
app.use("/api/comment", CommentRouter);
app.use("/api/profile", ProfileRouter);
app.use("/api/notify", PostNotifications);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.resolve(__dirname, "../client", "build")));
    app.get("*", (req, res) => {
        res.sendFile(
            path.resolve(__dirname, "../client", "build", "index.html")
        );
    });
}

app.listen(port, () => {
    console.log(`server started in port ${port}`);
});
