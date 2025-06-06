import {CommentModel} from "../../models/post/comment.model";
import {checkFieldExists} from "../../models/mongo_operations/mongo_utils";
import {PostModel} from "../../models/post/post.model";
import {createApiError} from "../../factory/create.api.error";
import HTTP from "http-status-codes";
import {POST} from "../../constants/error.constants";
import {POST_ERROR} from "../../constants/error.details.constants";
import {Types} from "mongoose";

export async function postCommentService(postId: number, text: string, userId: Types.ObjectId) {
    const postComment = new CommentModel({ postId: postId, text, userId });
    const savedComment = await postComment.save();

    const commentObject = savedComment.toObject();
    const {_id, __v, userId: _, ...comment} = commentObject;

    return {comment};
}