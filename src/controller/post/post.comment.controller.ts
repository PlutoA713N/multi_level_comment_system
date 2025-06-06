import {Request, Response, NextFunction} from "express";
import logger from "../../logger";
import {postCommentService} from "../../service/post.service/post.comment.service";
import HTTP from "http-status-codes";
import {createSuccessResponse} from "../../factory/create.sucess.response";
import {POST} from "../../constants/error.constants";
import {POST_EVENTS} from "../../constants/success.constants";
import {Types} from "mongoose";
import {ICustomRequest} from "../../interfaces/Request_interfaces";

export async function postCommentController(req: ICustomRequest, res: Response, next: NextFunction) {
    try {
        const {postId} = req.params as { postId: string };
        const {text} = req.body;

        const {_id} = req.user!
        const userId = new Types.ObjectId(_id)

        const {comment} = await postCommentService(Number(postId), text, userId);
        res.status(HTTP.CREATED).json(createSuccessResponse({
            status: HTTP.CREATED,
            code: POST.COMMENT_CREATED,
            message: POST_EVENTS.COMMENT_CREATED,
            data: comment,
        }));
        return
    }catch (error) {
        logger.error('Error in post comment Controller: ', error);
        next(error);
    }
}