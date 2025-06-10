import Redis from "ioredis";
import logger from "../../logger";
import {getRedisClient} from "../../config/redis/redis.client";

let redisClient = getRedisClient()

// export const initRedisClient = async () => {
//     try {
//         // redisClient = getRedisClient()
//         // await redisClient.connect();
//         logger.info("Redis client initialized");
//     } catch (error) {
//         logger.error("Error initializing Redis client:", error);
//         throw error;
//     }
// };


// export const getRedisClient = () => {
//     if (!redisClient) {
//         throw new Error("Error in redisTestDD: Redis client is not initialized. Call initRedis() first.");
//     }
//     return redisClient;
// };


// export const clearRedis = async() => {
//     if (!redisClient) {
//         throw new Error("Redis client is not initialized.");
//     }
//     await redisClient.flushDb();
// }

export const disconnectRedis = async () => {
    if (redisClient) {
        await redisClient.quit();
        logger.info('Redis disconnected');
    }
}
