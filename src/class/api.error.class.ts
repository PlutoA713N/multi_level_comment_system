export class ApiError extends Error {
    public readonly status: number;
    public readonly type: string;
    public readonly title: string;
    public readonly code: string;
    public readonly detail?: string;
    public readonly instance?: string;
    public readonly meta?: any[];
    public readonly errors?: any[];
    public readonly isOperational: boolean;
    public readonly requestId?: string;
    public readonly timestamp: string;

    constructor({
                    status,
                    type,
                    title,
                    code,
                    detail,
                    instance,
                    meta,
                    errors,
                    isOperational = true,
                    requestId,
                    timestamp,
                }: {
        status: number;
        type: string;
        title: string;
        code: string;
        detail?: string;
        instance?: string;
        meta?: any[];
        errors?: any[];
        isOperational?: boolean;
        requestId?: string;
        timestamp: string;
    }) {
        super(title);
        this.status = status;
        this.type = type;
        this.title = title;
        this.code = code;
        this.detail = detail;
        this.instance = instance;
        this.meta = meta;
        this.errors = errors;
        this.isOperational = isOperational;
        this.requestId = requestId;
        this.timestamp = timestamp;

        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}