"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isConnected = exports.client = void 0;
const redis_1 = require("redis");
// Define custom Redis connection options
const redisOptions = {
    host: "your_redis_host", // Update with your Redis host
    port: 6379, // Update with your Redis port if different from default
    // Add any other options like password if required
};
let isConnected = false;
exports.isConnected = isConnected;
let client;
// Create Redis client with custom options
exports.client = client = (0, redis_1.createClient)(redisOptions);
client.on("connect", () => {
    console.log("Connected to Redis server");
    exports.isConnected = isConnected = true;
});
client.on("error", (error) => {
    console.error("Error connecting to Redis: " + error);
    exports.isConnected = isConnected = false;
    // Handle connection errors as needed
    // process.exit(1);
});
