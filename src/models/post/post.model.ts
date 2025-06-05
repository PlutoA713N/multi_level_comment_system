import {Schema, model, Types} from "mongoose";

export interface IPost extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

export const postSchema = new Schema<IPost>({
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    title: {type: String, required: true, trim: true, minLength: 3, maxLength: 50},
    content: {type: String, required: true, trim: true, minLength: 1, maxLength: 150},
}, {timestamps: true});


export const PostModel = model("Post", postSchema);