import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

const router = express.Router();

const validateInput = (input) => {
    const { first_name, last_name, phone, email, password } = input;
    if (!first_name || !last_name || !phone || !email || !password) {
        return "All fields are required";
    }
    if (password.length < 6) {
        return "Password must be at least 6 characters long";
    }
    if (!/^\d{10}$/.test(phone)) {
        return "Phone number must be 10 digits long";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return "Invalid email address";
    }
    return null;
};

//Register
router.post("/register", async (req, res) => {
    res.header("Access-Control-Allow-Credentials", true);

    const { first_name, last_name, phone, email, password } = req.body;

    const validationError = validateInput(req.body);
    if (validationError) {
        return res.status(400).json({ msg: validationError });
    }

    try {
        let user = await User.findOne({ $or: [{ phone }, { email }] });
        if (user) {
            return res.status(400).json({ msg: "User already exists." });
        }
        user = new User({
            first_name,
            last_name,
            phone,
            email,
            password,
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 3600000,
                }).json({
                    success: true,
                    user: {
                        id: user.id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email,
                        phone: user.phone,
                    },
                });
            }
        );
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
});

//Login
router.post("/login", async (req, res) => {
    res.header("Access-Control-Allow-Credentials", true);

    const { phone, email, password } = req.body;

    try {
        let user;
        if (email) {
            user = await User.findOne({ email });
        } else if (phone) {
            user = await User.findOne({ phone });
        } else {
            return res
                .status(400)
                .json({ msg: "Please provide email or phone number" });
        }

        if (!user) {
            return res.status(400).json({ msg: "Invalid Credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid Credentials" });
        }

        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 3600000,
                }).json({
                    success: true,
                    user: {
                        id: user.id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email,
                        phone: user.phone,
                    },
                });
            }
        );
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
});

//Logout
router.post("/logout", (req, res) => {
    res.header("Access-Control-Allow-Credentials", true);
    res.clearCookie("token").json({ success: true });
});

router.get("/user", async (req, res) => {
    res.header("Access-Control-Allow-Credentials", true);

    try {
        const token = req.cookies.token;
        if (!token)
            return res
                .status(401)
                .json({ msg: "No token, authorization denied" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.user.id).select("-password");

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.json(user);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
});

export default router;
