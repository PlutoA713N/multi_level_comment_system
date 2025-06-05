import {CommentModel} from "../../models/post/comment.model";
import {checkFieldExists} from "../../models/mongo_operations/mongo_utils";
import {PostModel} from "../../models/post/post.model";
import {createApiError} from "../../factory/create.api.error";
import HTTP from "http-status-codes";
import {POST} from "../../constants/error.constants";
import {POST_ERROR} from "../../constants/error.details.constants";

export async function postCommentService(postId: string, text: string) {

    const {isExists} = await checkFieldExists(PostModel, '_id', postId);

    if (!isExists) {
        throw createApiError({
            status: HTTP.NOT_FOUND,
            code: POST.NOT_FOUND,
            detail: POST_ERROR.NOT_FOUND
        })
    }

    const postComment = new CommentModel({ postId: postId, text });
    const savedComment = await postComment.save();

    return {newComment: savedComment};
}