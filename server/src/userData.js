const mongoose = require("mongoose");
const { Product, connectDB } = require("./Productsdb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userdataschema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

    cart: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "productCollection"
            }
        }
    ],

    orders: [
        {
            productid: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "productCollection"
            }
        }
    ]

});

const User = mongoose.model("user_data", userdataschema, "user_data");


// SIGNUP
const signup = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // HASH PASSWORD
        const encryptedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: encryptedPassword
        });

        await newUser.save();

        const token = jwt.sign(
            { email },
            "secret",
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            message: "User created successfully",
            user: newUser
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};


// LOGIN
const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Wrong password"
            });
        }

        res.cookie(
            "token",
            jwt.sign({ email }, "secret", { expiresIn: "1d" }),
            {
                httpOnly: true,
                secure: false,
                maxAge: 24 * 60 * 60 * 1000
            }
        );

        res.status(200).json({
            message: "Login successful",
            user
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};


// SEND OTP
const sendotp = async (req, res) => {

    try {

        const email = req.body.email;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const generateOTP = () =>
            Math.floor(1000 + Math.random() * 9000);

        const otp = generateOTP();

        console.log("OTP:", otp);

        res.status(200).json({
            message: "OTP generated",
            otp: otp
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};


// CHANGE PASSWORD
const forgotpass = async (req, res) => {

    try {

        const email = req.body.email;
        const newpass = req.body.newpass;

        // HASH NEW PASSWORD
        const hashedPassword = await bcrypt.hash(newpass, 10);

        const updatedUser = await User.findOneAndUpdate(
            { email: email },
            { password: hashedPassword },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "Password updated successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

const logout = (req, res) => {

    res.clearCookie("token", {
        httpOnly: true,
        secure: false
    });

    res.status(200).json({
        message: "Logout successful"
    });

};



const handleGoogleLogin = async (req, res) => {
    try {

        const { name, email } = req.body;

        let user = await User.findOne({ email });

        // Existing user
        if (user) {

            const token = jwt.sign(
                { email: user.email },
                "secret",
                { expiresIn: "1d" }
            );

            res.cookie("token", token, {
                httpOnly: true,
                secure: false,
                maxAge: 24 * 60 * 60 * 1000
            });

            return res.status(200).json({
                message: "User already exists",
                user
            });
        }

        // Create new Google user
        const encryptedPassword = await bcrypt.hash(
            "google_user",
            10
        );

        user = await User.create({
            name,
            email,
            password: encryptedPassword
        });


        const token = jwt.sign(
            { email: user.email },
            "secret",
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            message: "User created successfully",
            user
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Server Error"
        });
    }
};


module.exports = {
    User,
    login,
    signup,
    forgotpass,
    sendotp,
    logout,
    handleGoogleLogin
};