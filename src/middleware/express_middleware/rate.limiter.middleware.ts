import { ERROR_CODES } from "../../constants/error.constants";
import { HTTP_ERROR_DETAILS } from "../../constants/error.details.constants";
import {createRateLimitHandler, createLimiter} from "../../factory/create.rate.limiter";
import {LIMITS} from "../../config/rate-limit/rate.limit.config";

export const apiLimiter = createLimiter(
    LIMITS.API.windowMinutes,
    LIMITS.API.maxRequests,
    createRateLimitHandler(ERROR_CODES.TOO_MANY_REQUESTS, HTTP_ERROR_DETAILS.TOO_MANY_REQUESTS, 'API')
);

export const loginRateLimiter = createLimiter(
    LIMITS.LOGIN.windowMinutes,
    LIMITS.LOGIN.maxRequests,
    createRateLimitHandler(ERROR_CODES.TOO_MANY_LOGIN_ATTEMPTS, HTTP_ERROR_DETAILS.TOO_MANY_LOGIN_ATTEMPTS, 'Login')
);

export const postCommentRateLimiter = createLimiter(
    LIMITS.COMMENT.windowMinutes,
    LIMITS.COMMENT.maxRequests,
    createRateLimitHandler(ERROR_CODES.TOO_MANY_REQUESTS, HTTP_ERROR_DETAILS.TOO_MANY_COMMENT_ATTEMPTS, 'Comment')
);

export const replyCommentRateLimiter = createLimiter(
    LIMITS.REPLY.windowMinutes,
    LIMITS.REPLY.maxRequests,
    createRateLimitHandler(ERROR_CODES.TOO_MANY_REQUESTS, HTTP_ERROR_DETAILS.TOO_MANY_REPLY_ATTEMPTS, 'Reply')
);