//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
 
const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

console.log(process.env.API_KEY)

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
     email: String,
     password: String 
});

//Thisisourlittlesecret.

userSchema.plugin(encrypt, { secret: process.env.SECRET , encryptedFields: ["password"] });

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save().then(() => {
        res.render("secrets");
    }).catch((e) => {
        console.log(e)
    });
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}).then((user) => {
        if( user.password === password ) {
            res.render("secrets");
        }
    }).catch((e) => {
        console.log(e);
    })
});

app.listen(3000, () => {
    console.log("App started on port 3000");
});