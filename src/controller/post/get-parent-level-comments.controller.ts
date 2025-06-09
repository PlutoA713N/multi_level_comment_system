import {Request, Response, NextFunction} from "express";
import {matchedData} from "express-validator";
import logger from "../../logger";
import {getParentLevelCommentService} from "../../service/post.service/get.parent.level.comment.service";
import {createSuccessResponse} from "../../factory/create.sucess.response";
import HTTP from "http-status-codes";

export async function getParentLevelCommentsController(req: Request, res: Response, next: NextFunction) {
    try{
        const santisedRequest = matchedData(req, { locations: ['query', 'params'], includeOptionals: true });
        const {page, pageSize, postId, commentId} =  santisedRequest

        const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${req.path}`;

        const {comments, pagination} = await getParentLevelCommentService(postId, page, pageSize, commentId, baseUrl);

        res.status(HTTP.OK).json(createSuccessResponse({
            status: HTTP.OK,
            code: 'COMMENTS_EXPANDED',
            message: 'Comments expanded successfully.',
            data: comments,
            meta: pagination,
        }))
        return
    }catch(err){
        logger.error("getParentLevelCommentsController error", err);
        next(err);
    }
}