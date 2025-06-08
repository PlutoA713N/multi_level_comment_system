import { PipelineStage } from "mongoose";

// ✅ $match stage
export const matchTopLevelComments = (postId: number): PipelineStage => ({
    $match: {
        postId,
        parentCommentId: null,
    },
});

// ✅ $sort stage
export const sortParentComments = (field: string, order: 1 | -1): PipelineStage => ({
    $sort: {
        [field]: order,
    },
});

// ✅ $lookup stage
export const lookupReplies: PipelineStage = {
    $lookup: {
        from: "comments",
        let: { parentId: "$commentId" },
        pipeline: [
            {
                $match: {
                    $expr: { $eq: ["$parentCommentId", "$$parentId"] },
                },
            },
            { $sort: { createdAt: -1 } },
            { $limit: 2 },
            {
                $project: {
                    _id: 0,
                    id: "$commentId",
                    text: 1,
                    createdAt: 1,
                },
            },
        ],
        as: "replies",
    },
};

// ✅ $project stage
export const projectFinalShape: PipelineStage = {
    $project: {
        _id: 0,
        id: "$commentId",
        text: 1,
        createdAt: 1,
        postId: 1,
        parentCommentId: 1,
        replies: 1,
        totalReplies: 1,
    },
};
