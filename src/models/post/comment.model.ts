import mongoose, { model, Schema, Types, Model, HydratedDocument } from "mongoose";
import mongooseSequence from "mongoose-sequence";

const AutoIncrementFactory = (mongooseSequence as any)(mongoose);

interface IReply {
    id: number;
    text: string;
    createdAt: Date;
}

export interface IComment {
    userId: Types.ObjectId;
    text: string;
    commentId: number;
    createdAt: Date;
    postId: number;
    parentCommentId: number | null;
    replies: IReply[];
    totalReplies: number;
}

// Create schema with interface type IComment
const replySchema = new Schema<IReply>({
    id: { type: Number, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
});

const commentSchema = new Schema<IComment>({
    userId: { type: Schema.Types.ObjectId, required: true },
    text: { type: String, required: true },
    commentId: { type: Number, unique: true },
    createdAt: { type: Date, required: true, default: Date.now },
    postId: { type: Number, required: true },
    parentCommentId: { type: Number, default: null },
    replies: { type: [replySchema], default: [] },
    totalReplies: { type: Number, default: 0 },
});

commentSchema.plugin(AutoIncrementFactory, { inc_field: "commentId" });

// Define model type: Model with HydratedDocument for full typing
export type CommentDocument = HydratedDocument<IComment>;
export const CommentModel: Model<IComment> = model("Comment", commentSchema);
