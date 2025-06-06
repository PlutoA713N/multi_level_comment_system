import {checkFieldExists} from "../../models/mongo_operations/mongo_utils";
import {NextFunction, Response} from "express";
import {PostModel} from "../../models/post/post.model";
import {ICustomRequest} from "../../interfaces/Request_interfaces";
import {createApiError} from "../../factory/create.api.error";
import HTTP from "http-status-codes";
import {COMMENT, POST} from "../../constants/error.constants";
import {COMMENT_ERROR, POST_ERROR} from "../../constants/error.details.constants";
import logger from "../../logger";
import {CommentModel} from "../../models/post/comment.model";

export const lookupPostDocument = async(req: ICustomRequest, res: Response, next: NextFunction) => {
    try{
        const {postId} = req.params
        const {isExists} =  await checkFieldExists(PostModel, 'postId', Number(postId))
        if(!isExists){
            throw createApiError({
                status: HTTP.NOT_FOUND,
                code: POST.NOT_FOUND,
                detail: POST_ERROR.NOT_FOUND
            })
        }
        next()
    }catch(e){
        logger.error('Error in searchDocument Middleware', e);
        next(e)
    }
}

export const lookupPostReplyCommentDocuments = async(req: ICustomRequest, res: Response, next: NextFunction) => {
    try{
        const {postId, commentId} = req.params

        const [postResult, commentResult] = await Promise.all([
            checkFieldExists(PostModel, 'postId', Number(postId)),
            checkFieldExists(CommentModel, 'commentId', Number(commentId))
        ])

        if(!postResult.isExists){
            throw createApiError({
                status: HTTP.NOT_FOUND,
                code: POST.NOT_FOUND,
                detail: POST_ERROR.NOT_FOUND
            })
        }

        if(!commentResult.isExists){
            throw createApiError({
                status: HTTP.NOT_FOUND,
                code: COMMENT.NOT_FOUND,
                detail: COMMENT_ERROR.NOT_FOUND
            })
        }

        next()

    }catch(e){
        logger.error('Error in search Document Middleware', e);
        next(e)
    }
}
