import {Request, Response} from "express";
import {createApiError} from "./create.api.error";
import HTTP from "http-status-codes";
import logger from "../logger";
import rateLimit from "express-rate-limit";

export function createRateLimitHandler(code: string, detail: string, context: string) {
    return (req: Request, res: Response) => {
        const error = createApiError({
            status: HTTP.TOO_MANY_REQUESTS,
            code,
            detail,
            instance: req.originalUrl,
        });

        logger.warn(`[${context}] Rate limit exceeded`, {
            ip: req.ip,
            path: req.originalUrl,
            userAgent: req.headers['user-agent'],
            requestId: req.headers['x-request-id'],
        });

        res.status(error.status).json(error);
    };
}

export function createLimiter(windowMinutes: number, maxRequests: number, handler: ReturnType<typeof createRateLimitHandler>) {
    return rateLimit({
        windowMs: windowMinutes * 60 * 1000,
        limit: maxRequests,
        standardHeaders: true,
        legacyHeaders: false,
        handler,
    });
}