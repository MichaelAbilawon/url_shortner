"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutHandler = void 0;
// Define route handler
const logoutHandler = (req, res) => {
    // Clear user session or token
    res.clearCookie("token");
    // Redirect user to the home page
    res.redirect("/");
};
exports.logoutHandler = logoutHandler;
