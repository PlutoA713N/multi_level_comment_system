import {Schema, model, Types, connection} from "mongoose";
import  mongooseSequence from "mongoose-sequence";

const AutoIncrementFactory = mongooseSequence(connection)

export interface IPost extends Document {
    _id: Types.ObjectId;
    __v: number;
    postId: number;
    userId: Types.ObjectId;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

export const postSchema = new Schema<IPost>({
    postId: {type: Number, unique: true},
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    title: {type: String, required: true, trim: true, minLength: 3, maxLength: 50},
    content: {type: String, required: true, trim: true, minLength: 1, maxLength: 150},
}, {timestamps: true});

postSchema.plugin(AutoIncrementFactory, {inc_field: 'postId'});

export const PostModel = model("Post", postSchema);