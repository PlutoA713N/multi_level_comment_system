import { PostModel } from "../../models/post/post.model";
import {Types} from "mongoose";

export const createPostService = async (title: string, content: string, userId: Types.ObjectId) => {
    const post = new PostModel({title, content, userId})
    const savedDocument = await post.save();

    const postObject = savedDocument.toObject();

    const {_id, __v, ...postFields} = postObject;

    return {post: postFields};
}
