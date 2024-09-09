const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const { getModel } = require('ottoman');
const User = getModel('User');  // Ensure this is correctly initialized
const { PropertyRequiredError } = require("../api/errors");
const { Logger } = require('../config/logger');
const log = Logger.child({
    namespace: 'UsersController',
});

// @desc registration for a user
// @route POST /api/users
// @access Public
// @required fields {email, username, password}
// @return User
const registerUser = asyncHandler(async (req, res) => {
    console.log("Received request to register user:", req.body);

    const { user } = req.body;

    if (!user || !user.email || !user.username || !user.password) {
        console.log("Validation failed: Missing required fields");
        const error = { message: "All fields are required" };
        if (!user.email) error["email"] = "";
        if (!user.username) error["username"] = "";
        if (!user.password) error["password"] = "";
        return res.status(400).json(error);
    }

    console.log("Hashing password for user:", user.username);
    const hashedPwd = await bcrypt.hash(user.password, 10);  // Salt rounds

    const userObject = {
        "username": user.username,
        "password": hashedPwd,
        "email": user.email
    };

    console.log("Creating user object in Couchbase:", userObject);

    const createdUser = await User.create(userObject).catch(e => {
        console.log("Error creating user:", e);
        log.debug(e.name);
        log.debug(e.message);
        log.debug(e.property);
        log.debug(e);
        if (e instanceof PropertyRequiredError) {
            const err = {
                errors: {
                    body: "Unable to register a user",
                }
            };
            if (e.field) {
                err[e.field] = e.value;
                return res.status(422).json({ err });
            }
        }
    });

    if (createdUser) {  // User object created
        console.log("User created successfully:", createdUser);
        res.status(201).json({
            user: createdUser.toUserResponse()
        });
    } else {
        console.log("Failed to create user");
        res.status(422).json({
            errors: {
                body: "Unable to register a user",
                email: user.email
            }
        });
    }
});

// @desc get currently logged-in user
// @route GET /api/user
// @access Private
// @return User
const getCurrentUser = asyncHandler(async (req, res) => {
    console.log("Fetching current user for email:", req.userEmail);

    const email = req.userEmail;

    const user = await User.findOne({ email }).catch(e => {
        console.log("Error fetching user:", e);
        log.debug(e, "Error fetching user");
    });

    if (!user) {
        console.log("User not found for email:", email);
        return res.status(404).json({ message: "User Not Found" });
    }

    console.log("User found:", user);
    res.status(200).json({
        user: user.toUserResponse()
    });
});

// @desc login for a user
// @route POST /api/users/login
// @access Public
// @required fields {email, password}
// @return User
const userLogin = asyncHandler(async (req, res) => {
    console.log("Attempting login for user:", req.body.user);

    const { user } = req.body;

    // Confirm data
    if (!user || !user.email || !user.password) {
        console.log("Login failed: Missing email or password");
        return res.status(400).json({ message: "All fields are required" });
    }

    const loginUser = await User.findOne({ email: user.email }).catch(e => {
        console.log("Error fetching user for login:", e);
        log.debug(e, "Error fetching user");
    });

    if (!loginUser) {
        console.log("Login failed: User not found for email", user.email);
        return res.status(404).json({ errors: { message: 'User Not Found' } });
    }

    const match = await bcrypt.compare(user.password, loginUser.password);
    if (!match) {
        console.log("Login failed: Incorrect password");
        return res.status(401).json({ errors: { message: 'Unauthorized: Wrong password' } });
    }

    console.log("User logged in successfully:", loginUser);
    res.status(200).json({
        user: loginUser.toUserResponse()
    });
});

// @desc update currently logged-in user
// Warning: if password or email is updated, client-side must update the token
// @route PUT /api/user
// @access Private
// @return User
const updateUser = asyncHandler(async (req, res) => {
    console.log("Attempting to update user:", req.body.user);

    const { user } = req.body;

    // Confirm data
    if (!user) {
        console.log("Update failed: Missing user object");
        return res.status(400).json({ message: "Required a User object" });
    }

    const email = req.userEmail;

    const target = await User.findOne({ email }).catch(e => {
        console.log("Error fetching user for update:", e);
        log.debug(e, "Error fetching user");
    });

    if (!target) {
        console.log("Update failed: User not found for email", email);
        return res.status(404).json({ message: "User not found" });
    }

    if (user.email) target.email = user.email;
    if (user.username) target.username = user.username;
    if (user.password) {
        const hashedPwd = await bcrypt.hash(user.password, 10);
        target.password = hashedPwd;
    }
    if (typeof user.image !== 'undefined') target.image = user.image;
    if (typeof user.bio !== 'undefined') target.bio = user.bio;

    await target.save();
    console.log("User updated successfully:", target);

    return res.status(200).json({
        user: target.toUserResponse()
    });
});

module.exports = {
    registerUser,
    getCurrentUser,
    userLogin,
    updateUser
};
