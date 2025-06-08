import mongoose, { Schema, Types, Document, Model } from "mongoose";
import mongooseSequence from "mongoose-sequence";

// 1. Define the interface for a Comment document
export interface IComment extends Document {
    userId: Types.ObjectId;
    text: string;
    commentId: number;
    createdAt: Date;
    postId: number;
    parentCommentId: number | null;
    replies: {
        id: number;
        text: string;
        createdAt: Date;
    }[];
    totalReplies: number;
}

// 2. Define schemas
const replySchema = new Schema({
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

commentSchema.index({ postId: 1, parentCommentId: 1 });
commentSchema.index({ parentCommentId: 1, createdAt: -1 });
commentSchema.index({ commentId: 1}, {unique: true});
commentSchema.index({ totalReplies: -1 });


// 3. Add plugin properly
const AutoIncrement = mongooseSequence(mongoose);
commentSchema.plugin(AutoIncrement, { inc_field: "commentId" });

// 4. Export the model with full typing
export const CommentModel: Model<IComment> = mongoose.model("Comment", commentSchema);
