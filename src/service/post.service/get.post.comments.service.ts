import { CommentModel } from "../../models/post/comment.model";
import { SortOrder } from "mongoose";

type SortField = "createdAt" | "repliesCount";
type SortDirection = "asc" | "desc";

interface FormattedReply {
    id: number;
    text: string;
    createdAt: Date;
}

interface FormattedComment {
    id: number;
    text: string;
    createdAt: Date;
    postId: number;
    parentCommentId: null;
    replies: FormattedReply[];
    totalReplies: number;
}

export async function getPostCommentsService(
    postId: number,
    sortBy: SortField,
    sortOrder: SortDirection
): Promise<FormattedComment[]> {
    const sortValue: SortOrder = sortOrder === "asc" ? 1 : -1;
    const sortField = sortBy === "repliesCount" ? "totalReplies" : "createdAt";

    const parentComments = await CommentModel
        .find({ postId, parentCommentId: null })
        .sort({ [sortField]: sortValue })
        .lean()
        .exec()

    const commentsWithReplies = await Promise.all(
        parentComments.map(async (comment) => {
            const replies = await CommentModel.find({ parentCommentId: comment.commentId })
                .sort({ createdAt: -1 })
                .limit(2)
                .select({ commentId: 1, text: 1, createdAt: 1 })
                .lean()
                .exec()

            const formattedReplies: FormattedReply[] = replies.map((reply) => ({
                id: reply.commentId,
                text: reply.text,
                createdAt: reply.createdAt,
            }));

            return {
                id: comment.commentId,
                text: comment.text,
                createdAt: comment.createdAt,
                postId: comment.postId,
                parentCommentId: null,
                replies: formattedReplies,
                totalReplies: comment.totalReplies,
            };
        })
    );

    return commentsWithReplies;
}
