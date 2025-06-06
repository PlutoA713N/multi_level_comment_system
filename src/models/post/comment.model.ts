import mongoose, {model, Schema, Document, Types, connection} from "mongoose";
import mongooseSequence from "mongoose-sequence";

const AutoIncrementFactory = mongooseSequence(connection);

interface ICommentDocument extends Document {
    __v: number;
    _id: string;
    userId: Types.ObjectId;
    text: string;
    commentId: number;
    createdAt: Date;
    postId: number;
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
    userId: {type:Schema.Types.ObjectId, required:true},
    text: {type: String, required: true},
    commentId: {type:Number, unique:true},
    createdAt: {type: Date, required: true, default: Date.now},
    postId: {type: Number, required: true},
    parentCommentId: {type: Number, required: false, default: null},
    replies: {type: [replySchema], required: false, default: []},
    totalReplies: {type: Number, required: false, default: 0},
},);


commentSchema.plugin(AutoIncrementFactory, {inc_field: 'commentId'});

export const CommentModel = model("Comment", commentSchema);