import {CommentModel} from "../../models/post/comment.model";
import {createApiError} from "../../factory/create.api.error";
import HTTP from "http-status-codes";
import {
    expandCommentReplies,
} from "../../models/mongo_aggregation_pipelines";


export async function getParentLevelCommentService(postId: number, page: number, pageSize: number, commentId: number, baseUrl: string): Promise<any> {
    const totalReplies = await CommentModel.countDocuments({postId, parentCommentId: commentId});
    const totalPages = Math.max(1, Math.ceil(totalReplies / pageSize));

    if(page > totalPages && totalReplies > 0) {
        throw createApiError({
            status: HTTP.BAD_REQUEST,
            code: 'PAGE_OUT_OF_BOUNDS',
            title: `Page ${page} not found`,
            detail: `Only ${totalPages} pages available.`,
            meta: [{ page, pageSize, totalReplies, totalPages }]
        })
    }

    const comments = await CommentModel.aggregate(expandCommentReplies(postId, commentId, page, pageSize))

    const buildLink = (targetPage: number) =>
        `${baseUrl}?page=${targetPage}&pageSize=${pageSize}`;

    const pagination  = {
        page,
        pageSize,
        totalReplies,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        links: {
            self: buildLink(page),
            first: buildLink(1),
            last: buildLink(totalPages),
            ...(page > 1 && {previous: buildLink(page - 1)}),
            ...(page < totalPages && {next: buildLink(page + 1)})
        }
    }

    return {comments, pagination, }
}