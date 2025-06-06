import { Request, Response, NextFunction } from "express";
import logger from "../../logger";
import { getPostCommentsService } from "../../service/post.service/get.post.comments.service";
import HTTP from "http-status-codes";
import {createSuccessResponse} from "../../factory/create.sucess.response";
import {COMMENT} from "../../constants/error.constants";
import {POST_EVENTS} from "../../constants/success.constants";

const allowedSortFields = ["createdAt", "repliesCount"] as const;
type SortField = (typeof allowedSortFields)[number];
type SortOrder = "asc" | "desc";

export async function getPostCommentsController(req: Request, res: Response, next: NextFunction) {
    try {
        const { postId } = req.params;

        const rawSortBy = req.query.sortBy as string | undefined;
        const sortBy: SortField = allowedSortFields.includes(rawSortBy as SortField)
            ? (rawSortBy as SortField)
            : "createdAt";

        const rawSortOrder = req.query.sortOrder as string | undefined;
        const sortOrder: SortOrder = rawSortOrder === "desc" ? "desc" : "asc";

        const comments = await getPostCommentsService(Number(postId), sortBy, sortOrder);

        res.status(HTTP.OK).json(createSuccessResponse({
            status: HTTP.OK,
            code: COMMENT.RETRIEVED,
            message: POST_EVENTS.COMMENTS_RETRIEVED,
            data: comments,
        }));

        return
    } catch (err) {
        logger.error("Error in getPostCommentsController", err);
        next(err);
    }
}
