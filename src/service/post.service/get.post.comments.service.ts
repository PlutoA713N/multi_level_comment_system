import { CommentModel } from "../../models/post/comment.model";
import {PipelineStage, SortOrder} from "mongoose";
import {
    lookupReplies,
    matchTopLevelComments,
    projectFinalShape, sortParentComments,
} from "../../models/mongo_aggregation_pipelines";

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

    const pipeline : PipelineStage[] = [
        matchTopLevelComments(postId),
        sortParentComments(sortField, sortValue),
        lookupReplies,
        projectFinalShape
    ]

    const comments = await CommentModel.aggregate(pipeline).exec()
    return comments as FormattedComment[]
}
