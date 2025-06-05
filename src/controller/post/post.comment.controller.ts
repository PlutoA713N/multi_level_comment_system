import {Request, Response, NextFunction} from "express";
import logger from "../../logger";
import {postCommentService} from "../../service/post.service/post.comment.service";
import HTTP from "http-status-codes";
import {createSuccessResponse} from "../../factory/create.sucess.response";
import {POST} from "../../constants/error.constants";
import {POST_EVENTS} from "../../constants/success.constants";

export async function postCommentController(req: Request, res: Response, next: NextFunction) {
    try {
        const {postId} = req.params as { postId: string };
        const {text} = req.body;
        const {newComment} = await postCommentService(postId, text);
        res.status(HTTP.CREATED).json(createSuccessResponse({
            status: HTTP.CREATED,
            code: POST.COMMENT_CREATED,
            message: POST_EVENTS.COMMENT_CREATED,
            data: newComment,
        }));
        return
    }catch (error) {
        logger.error('Error in post comment Controller: ', error);
        next(error);
    }
}