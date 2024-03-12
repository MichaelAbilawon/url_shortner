import redis, { createClient } from "redis";
import { Request, Response, NextFunction } from "express";
// const redisPort = 6379;

export let isConnected = false;
const client = createClient();

client.on("connect", () => {
  console.log("Connected to Redis server");
  isConnected = true;
});

client.on("error", (error) => {
  console.error("Error connecting to Redis: " + error);
  isConnected = false;
  process.exit(1);
});

export default client;
