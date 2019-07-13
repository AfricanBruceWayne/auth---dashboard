var express = require("express");
var passport = require('passport');
var User = require("./models/user");

var router = express.Router();

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()){
        next();
    } else {
        req.flash("info", "You must be logged in to use see this page.");
    }
}

router.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.errors = req.flash("error");
    res.locals.infos = req.flash("info");
    next();
});

router.get("/", (req, res, next) => {
    User.find()
    .sort({ createdAt: "descending" })
    .exec((err, users) => {
        if (err)
        {
            return next(err);
        } 
        res.render("index", { users: users });
    });
});

router.get("/edit", ensureAuthenticated, (req, res) => {
    res.render("edit");
});

router.post("/edit", ensureAuthenticated, (req, res, next) => {
    req.user.displayName = req.body.displayName;
    req.user.bio = req.body.bio;
    req.user.save((err) => {
        if (err) {
            next(err);
            return;
        }
        req.flash("info", "Profile updated!");
        res.redirect("/edit");
    });
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}));

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

module.exports = router;