import { createClient, RedisClientType } from 'redis';
import {getEnv} from "../env";
import logger from "../../logger";
import {AppError} from "../../class/app.error.class";
import HTTP from "http-status-codes";
import { REDIS_ERROR_CODES} from "../../constants/error.constants";
import RedisMock from "ioredis-mock";

const testEnv = getEnv("NODE_ENV") === "test";
let redisClient: RedisClientType | null = null;

if(testEnv) {
    redisClient = new RedisMock() as unknown as RedisClientType;
    logger.info('Using mock Redis for tests');
}

export async function initRedis() {
    if(testEnv) return
    const url = getEnv('REDIS_CLIENT_URL');
    redisClient = createClient({ url });

    redisClient.on('error', (err) => logger.error('Redis error:', err));
    redisClient.on('connect', () => logger.info('Redis connected'));

    await redisClient.connect();
}

export async function closeRedis() {
    if (redisClient) {
        await redisClient.quit();
        logger.info('Redis connection closed');
    }
}

export function getRedisClient(): RedisClientType {
    if (!redisClient) {
        throw new AppError('Redis client is not initialized. Call initRedis() first.', HTTP.INTERNAL_SERVER_ERROR, REDIS_ERROR_CODES.REDIS_NOT_INITIALIZED);
    }
    return redisClient;
}
