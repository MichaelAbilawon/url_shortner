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
exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = require("../model/user");
function registerUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const isExisting = yield user_1.userModel.findOne({ email: req.body.email });
            if (isExisting) {
                // res.status(400).json({ error: "Email has already been used." });
                res
                    .status(400)
                    .render("error", { errorMessage: "Email has already been used." });
            }
            else if (!req.body.password) {
                res.status(400).json({ error: "Password is required" });
                res.status(400).render("error", { errorMessage: "Password is required" });
            }
            else {
                const hashedPassword = yield bcrypt_1.default.hash(req.body.password, 10);
                const newUser = new user_1.userModel({
                    email: req.body.email,
                    password: hashedPassword,
                });
                yield newUser.save();
                res.render("successfulRegistration");
            }
        }
        catch (error) {
            console.error(error);
            // res.status(500).json({ error: "Internal server error" });
            res.status(500).render("error", { errorMessage: "Internal Server Error" });
        }
    });
}
exports.registerUser = registerUser;
exports.default = registerUser;
