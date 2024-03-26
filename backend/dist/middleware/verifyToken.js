"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.verifyTokenFromCookie = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const verifyTokenFromCookie = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const tokenFromCookie = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
        if (!tokenFromCookie) {
            throw new Error("No token found.");
        }
        const decoded = jsonwebtoken_1.default.verify(tokenFromCookie, process.env.JWT_SECRET);
        req.user = decoded; // Attach the user to the request for future use
        next(); // Call next() to proceed to the next middleware
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            res.render("login");
            // res.status(401).json({ error: "Token expired" });
        }
        else {
            console.error("Token verification error: ", error);
            // res.status(401).json({ error: "Invalid Token" });
            res.status(401).render("error", { errorMessage: "Invalid Token" });
        }
    }
});
exports.verifyTokenFromCookie = verifyTokenFromCookie;
