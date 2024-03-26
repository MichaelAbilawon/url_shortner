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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
// import { connect } from "http2";
const shortUrl_1 = __importDefault(require("./routes/shortUrl"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const app = (0, express_1.default)();
// Load environment variables from .env file
dotenv_1.default.config();
const server = http_1.default.createServer(app);
// Configure server timeouts
server.keepAliveTimeout = 120000; // 120 seconds
server.headersTimeout = 120000; // 120 seconds
// Connect to MongoDB database using Mongoose
function connectToDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(process.env.MONGO_URL);
            console.log("Connected to Database");
        }
        catch (err) {
            console.error(`Error connecting to database: ${err}`);
        }
    });
}
connectToDatabase();
// Middleware and Routers
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
// Allow cross-origin requests (for testing purposes)
app.use((0, cors_1.default)());
// Set EJS as the view engine
app.set("view engine", "ejs");
// The directory where EJS files are located
app.set("views", path_1.default.join(__dirname, "views"));
// Routes
app.use("/shortUrl", shortUrl_1.default);
app.get("/", (req, res) => {
    res.render("homepage");
});
app.get("/generateqr", (req, res) => {
    res.render("qrcode");
});
app.listen(3001, () => console.log("listening on port 3001"));
exports.default = app;
