import {getEnv} from "../env";

const getNumericEnv = (key: string, fallback: number): number => {
    const value = getEnv(key, false, fallback.toString());
    const parsed = Number(value);
    return isNaN(parsed) ? fallback : parsed;
};

export const LIMITS = {
    API: {
        windowMinutes: getNumericEnv('API_RATE_LIMIT_WINDOW_MINUTES', 15),
        maxRequests: getNumericEnv('API_RATE_LIMIT_REQUESTS', 50),
    },
    LOGIN: {
        windowMinutes: getNumericEnv('LOGIN_RATE_LIMIT_WINDOW_MINUTES', 10),
        maxRequests: getNumericEnv('LOGIN_RATE_LIMIT_REQUESTS', 5),
    },
    COMMENT: {
        windowMinutes: getNumericEnv('POST_COMMENT_RATE_LIMIT_WINDOW_MINUTES', 10),
        maxRequests: getNumericEnv('POST_COMMENT_RATE_LIMIT_REQUESTS', 5),
    },
    REPLY: {
        windowMinutes: getNumericEnv('REPLY_COMMENT_RATE_LIMIT_WINDOW_MINUTES', 5),
        maxRequests: getNumericEnv('REPLY_COMMENT_RATE_LIMIT_REQUESTS', 10),
    }
};
