import {commentValidators, postValidators, queryValidators} from "./post.validators";
import {ValidationChain} from "express-validator";

export const validatePostRules: ValidationChain[] = [
    postValidators.title(),
    postValidators.content()
]

export const validatePostCommentRules: ValidationChain[] = [
    commentValidators.postId(),
    commentValidators.text()
]


export const validateReplyCommentRules: ValidationChain[] =[
    commentValidators.commentId(),
    ...validatePostCommentRules
]

export const validateGetPostsRules: ValidationChain[] = [
    commentValidators.postId(),
    queryValidators.sortBy(),
    queryValidators.sortOrder()
]