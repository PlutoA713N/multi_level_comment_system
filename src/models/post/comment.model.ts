import {model, Schema, Document, Types} from "mongoose";

interface ICommentDocument extends Document {
    text: string;
    createdAt: Date;
    postId: Types.ObjectId;
    parentCommentId: number | null;
    replies: IReply[];
    totalReplies: number;
}

interface IReply {
    id: number;
    text: string;
    createdAt: Date;
}

const replySchema: Schema = new Schema<IReply>({
    id: {type:Number, required:true},
    text: {type:String, required:true},
    createdAt: {type:Date, required:true, default: Date.now},
})

const commentSchema = new Schema<ICommentDocument>({
    text: {type: String, required: true},
    createdAt: {type: Date, required: true, default: Date.now},
    postId: {type: Schema.Types.ObjectId, required: true},
    parentCommentId: {type: Number, required: false, default: null},
    replies: {type: [replySchema], required: false, default: []},
    totalReplies: {type: Number, required: false, default: 0},
},);

export const CommentModel = model("Comment", commentSchema);