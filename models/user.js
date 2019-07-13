var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_FACTOR = 10;

var userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    displayName: String,
    bio: String
});

userSchema.methods.name = () => {
    return this.displayName || this.username;
};

var noop = () => {};

userSchema.pre("save", (done) => {
    var user = this;
    if (!user.isModified("password"))
    {
        return done();
    }
    bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
        if (err) 
        {
            return done(err);
        }
        bcrypt.hash(user.password, salt, noop, (err, hashedPassword) => {
            if (err)
            {
                return done(err);
            }
            user.password = hashedPassword;
            done();
        });
    });
});

userSchema.methods.checkPassword = (guess, done) => {
    bcrypt.compare(guess, this.password, (err, isMatch) => {
        done(err, isMatch);
    });
};

var User = mongoose.model("User", userSchema);

module.exports = User;