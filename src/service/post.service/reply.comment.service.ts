import {Types} from "mongoose";
import {CommentModel} from "../../models/post/comment.model";

export async function replyCommentService(data: { commentId: number; postId: number; text: string; userId: Types.ObjectId }) {

    const commentInstance = new CommentModel({
        text: data.text,
        userId: data.userId,
        postId: data.postId,
        parentCommentId: data.commentId,
    })

    const commentDocument = await commentInstance.save()

    await CommentModel.updateOne(
        {commentId: data.commentId},
        {$inc: {totalReplies: 1} },
    )

    const commentObject = commentDocument.toObject();

    const {_id, __v, userId, ...comment} = commentObject
    return {comment}
}