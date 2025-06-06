import {IUser} from "../../models/user/user.model";
import {IPost} from "../../models/post/post.model";
import {Request} from "express";

export interface ICustomRequest<
    P = Record<string, any>,
    B = Record<string, any>,
    Q = Record<string, any>,
> extends Request<P,any, B, Q> {
    user?: IUser
    post?: IPost
}

export type AttachField = Extract<keyof ICustomRequest, string>;

export interface IReplyCommentParams {
    commentId: string;
    postId: string;
}

export interface IReplyCommentBody {
    text: string;
}