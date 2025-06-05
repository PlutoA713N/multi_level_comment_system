import { Response, NextFunction} from "express";
import logger from "../../logger";
import {ICustomRequest} from "../../interfaces/Request_interfaces";
import {postCreateService} from "../../service/post.service/post.create.service";
import HTTP from "http-status-codes";
import {createSuccessResponse} from "../../factory/create.sucess.response";
import {POST} from "../../constants/error.constants";
import {POST_EVENTS} from "../../constants/success.constants";
import { Types } from "mongoose";


export const createPostController = async (req: ICustomRequest, res: Response, next: NextFunction) => {
    try{
        const {title, content} = req.body;
        const {_id} = req.user!
        const userId = new Types.ObjectId(_id)

        const {post} = await postCreateService(title, content, userId);

        res.status(HTTP.CREATED).json(createSuccessResponse({
            status: HTTP.CREATED,
            code: POST.CREATED,
            message: POST_EVENTS.CREATED_SUCCESS,
            data: post
        }))

    }catch(err){
        logger.error("Error in create post controller", err);
        next(err)
    }
};
