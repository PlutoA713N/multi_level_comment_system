import {Response, NextFunction, RequestHandler} from "express";
import HTTP from "http-status-codes";
import logger from "../../logger";
import {ICustomRequest, IReplyCommentBody, IReplyCommentParams} from "../../interfaces/Request_interfaces";
import {createSuccessResponse} from "../../factory/create.sucess.response";
import {replyCommentService} from "../../service/post.service/reply.comment.service";
import {POST} from "../../constants/error.constants";
import {POST_EVENTS} from "../../constants/success.constants";

export async function replyCommentController (req: ICustomRequest, res: Response, next: NextFunction) {
    try{
        const {postId, commentId} = req.params;
        const {text} = req.body
        const {_id} = req.user!

        const data = {
            commentId: Number(commentId), postId: Number(postId), text, userId: _id
        }

        const {comment} = await replyCommentService(data)

        res.status(HTTP.CREATED).json(createSuccessResponse({
            status: HTTP.CREATED,
            code: POST.REPLY_CREATED,
            message: POST_EVENTS.REPLY_CREATED,
            data: comment,
        }))

        return
    }catch(err){
        logger.error('Error in replyCommentController', err);
        next(err)
    }
}