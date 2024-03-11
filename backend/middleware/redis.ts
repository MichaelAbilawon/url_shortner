import redis, { createClient } from "redis";
import { Request, Response, NextFunction } from "express";
// const redisPort = 6379;

const client = createClient();

// Check cache for shortened URL
// const checkCache = (req: Request, res: Response, next: NextFunction): void => {
//   const { id } = req.params;
//   client.get(id, (err: Error | null, data: string | null) => {
//     if (err) {
//       console.error("Error in Redis:", err);
//       next();
//     }
//     if (data) {
//       console.log("Cache hit:", data);
//       res.redirect(data); // Redirect to cached URL
//     } else {
//       next();
//     }
//   });
// };

// export default checkCache;

async () => {
  try {
    await client.connect();
    console.log("Connected to Redis server");
  } catch (error) {
    console.error("Error connecting to Redis: " + error);
    process.exit(1); //Exit if connection fails
  }
};

export default client;
