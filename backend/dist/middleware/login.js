"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../model/user");
function loginUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Login request received");
            // Check if user exists
            const user = yield user_1.userModel.findOne({
                email: req.body.email,
            });
            if (!user) {
                // res.status(400).json({ error: "Invalid email or password" });
                res
                    .status(400)
                    .render("error", { errorMessage: "Invalid Email or Password" });
            }
            else {
                // Check if password is correct
                const validPass = bcrypt_1.default.compareSync(req.body.password, user.password);
                if (!validPass) {
                    // res.status(400).json({ error: "Invalid email or password" });
                    res
                        .status(400)
                        .render("error", { errorMessage: "Invalid Email or password" });
                }
                else {
                    // Generate JWT
                    const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
                        expiresIn: "7h",
                    });
                    // Save the token to a cookie and send a response
                    res.cookie("token", token, { httpOnly: true });
                    // res.status(200).json({ message: "Login successful" });
                    //Take the user to the dashboard
                    res.render("dashboard", { user: user.email });
                    console.log("Login successful");
                }
            }
        }
        catch (error) {
            // res.status(500).json({ error: error.message });
            res.status(500).render("error", { errorMessage: "Internal Server Error" });
        }
    });
}
exports.loginUser = loginUser;
