import {mongoDBConfig} from "./index";
import { connect, connection } from "mongoose";
import { AppError } from "../../class/app.error.class";
import logger from "../../logger";
import {retryAsync} from "../../utils/retryAsync";
import HTTP from "http-status-codes";
import { MONGO_ERROR_CODES} from "../../constants/error.constants";

const { mongoUri, retryDelay, retryCount } = mongoDBConfig;

const connectDB = async (): Promise<void> => {
    try {
        await connect(mongoUri);
        logger.info('Connected to MongoDB');
    } catch (err) {
        logger.error('Failed to connect to MongoDB: %o', err);
        throw new AppError(
            `Database connection failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
            HTTP.INTERNAL_SERVER_ERROR,
            MONGO_ERROR_CODES.DB_CONNECTION_ERROR
        );
    }
};


const pingDB = async (): Promise<void> => {
    try {
        await connection.db?.admin().command({ ping: 1 });
        logger.info("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (err) {
        logger.error("Failed to ping MongoDB: %o", err);
        throw new AppError(
            `MongoDB ping failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
            HTTP.INTERNAL_SERVER_ERROR,
            MONGO_ERROR_CODES.DB_PING_ERROR
        )
    }
}

const closeDB = async (): Promise<void> => {
    try {
        await connection.close();
        logger.info('Closed MongoDB connection');
    } catch (err) {
        logger.error('Failed to close MongoDB connection: %o', err);
        throw new AppError(
            `Database disconnection failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
            HTTP.INTERNAL_SERVER_ERROR,
            MONGO_ERROR_CODES.DB_DISCONNECTION_ERROR
        );
    }
};

const run = async (): Promise<void> => {
    try {
        await retryAsync(connectDB,
            {
                retries: retryCount,
                delayMs: retryDelay,
                label: 'MongoDB Connection',
                onRetry: (attempt, error) => {
                    logger.debug(`Attempt ${attempt} failed for MongoDB: ${error instanceof Error ? error.message : error}`)
                },
            })

        const admin = connection.db?.admin();

        if (!admin) {
            throw new Error('Admin interface not available on MongoDB connection.');
        }

        await pingDB()
    } catch (err) {
        logger.error("Failed to ping MongoDB: %o", err);
        throw new AppError(
            `MongoDB ping failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
            HTTP.INTERNAL_SERVER_ERROR,
            MONGO_ERROR_CODES.DB_PING_ERROR
        );
    }
};

export { run, connectDB, closeDB, pingDB };