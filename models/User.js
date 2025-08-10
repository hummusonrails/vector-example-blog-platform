const { Schema, model, getModel, addValidators } = require('ottoman');
const jwt = require("jsonwebtoken");
const accessTokenSecret = require('../config/securityConfig');
const { PropertyRequiredError, ValidationError } = require("../api/errors");
const emailRegX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/;

addValidators({
    username: (value) => {
        if (value && /\s/g.test(value)) {
            throw new PropertyRequiredError("username");
        }
    },
});

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        validator: 'username',
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validator: { regexp: emailRegX, message: 'Invalid email' },
        index: true,
    },
    bio: {
        type: String,
        default: "",
    },
    image: {
        type: String,
        default: "",
    },
    favoritedArticles: {
        type: [{ type: String, ref: 'Article' }],
        default: () => [],
    },
    followingUsers: {
        type: [{ type: String, ref: 'User' }],
        default: () => [],
    },
}, {
    timestamps: true,
});

userSchema.methods.generateAccessToken = function () {
    const accessToken = jwt.sign({
        "user": {
            "id": this.id,
            "email": this.email,
            "password": this.password
        }
    },
        accessTokenSecret,
        { expiresIn: "1d" }
    );
    return accessToken;
};

userSchema.methods.toUserResponse = function () {
    return {
        username: this.username,
        email: this.email,
        bio: this.bio,
        image: this.image,
        token: this.generateAccessToken()
    };
};

userSchema.methods.toProfileJSON = function (user) {
    return {
        username: this.username,
        bio: this.bio,
        image: this.image,
        following: user ? user.isFollowing(this.id) : false
    };
};

userSchema.methods.isFollowing = function (id) {
    const idStr = id.toString();
    if (this.followingUsers) {
        for (const followingUser of this.followingUsers) {
            if (followingUser.toString() === idStr) {
                return true;
            }
        }
    }
    return false;
};

userSchema.methods.follow = function (id) {
    if (this.followingUsers.indexOf(id) === -1) {
        this.followingUsers.push(id);
    }
    return this.save();
};

userSchema.methods.unfollow = function (id) {
    const idx = this.followingUsers.indexOf(id);
    if (idx !== -1) {
        this.followingUsers.splice(idx, 1);
    }
    return this.save();
};

userSchema.methods.isFavorite = function (id) {
    const idStr = id.toString();
    if (this.favoritedArticles) {
        for (const article of this.favoritedArticles) {
            if (article.toString() === idStr) {
                return true;
            }
        }
    }
    return false;
};

userSchema.methods.favorite = async function (id) {
    if (this.favoritedArticles.indexOf(id) === -1) {
        this.favoritedArticles.push(id);
    }

    const article = await getModel('Article').findById(id);

    article.favoritesCount += 1;
    await this.save();

    return article.save();
};

userSchema.methods.unfavorite = async function (id) {
    const idx = this.favoritedArticles.indexOf(id);
    if (idx !== -1) {
        this.favoritedArticles.splice(idx, 1);
    }

    const article = await getModel('Article').findById(id);
    article.favoritesCount -= 1;
    await this.save();

    return article.save();
};

const scope = process.env.DB_SCOPE || "_default";
const User = model('User', userSchema, { scopeName: scope });
exports.userSchema = userSchema;
exports.User = User;