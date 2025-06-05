import {body, param, query} from 'express-validator';
import {POST_VALIDATION_MESSAGES} from "../../constants/error.details.constants";
import {CONSTANTS} from "../../constants";

export const postValidators = {
    title: () =>
        body(CONSTANTS.TITLE)
            .exists()
            .withMessage(POST_VALIDATION_MESSAGES.TITLE.REQUIRED)
            .notEmpty()
            .withMessage(POST_VALIDATION_MESSAGES.TITLE.EMPTY)
            .bail()
            .isString()
            .withMessage(POST_VALIDATION_MESSAGES.TITLE.TYPE)
            .bail()
            .isLength({ min: 2 })
            .withMessage(POST_VALIDATION_MESSAGES.TITLE.LENGTH)
            .trim()
            .escape(),

    content: () =>
        body(CONSTANTS.CONTENT)
            .exists()
            .withMessage(POST_VALIDATION_MESSAGES.CONTENT.REQUIRED)
            .notEmpty()
            .withMessage(POST_VALIDATION_MESSAGES.CONTENT.EMPTY)
            .bail()
            .isString()
            .withMessage(POST_VALIDATION_MESSAGES.CONTENT.TYPE)
            .bail()
            .isLength({ min: 2 })
            .withMessage(POST_VALIDATION_MESSAGES.CONTENT.LENGTH)
            .trim()
            .escape(),
}


export const commentValidators = {
    postId: () =>
        param(CONSTANTS.POSTID)
            .exists()
            .withMessage(POST_VALIDATION_MESSAGES.POSTID.REQUIRED)
            .bail()
            .notEmpty()
            .withMessage(POST_VALIDATION_MESSAGES.POSTID.EMPTY)
            .bail()
            .isMongoId()
            .withMessage(POST_VALIDATION_MESSAGES.POSTID.TYPE)
    ,

    text: () =>
            body(CONSTANTS.TEXT)
                .exists()
                .withMessage(POST_VALIDATION_MESSAGES.TEXT.REQUIRED)
                .bail()
                .notEmpty()
                .withMessage(POST_VALIDATION_MESSAGES.TEXT.EMPTY)
                .bail()
                .isString()
                .withMessage(POST_VALIDATION_MESSAGES.TEXT.TYPE)
                .bail()
                .isLength({ min: 2 })
                .withMessage(POST_VALIDATION_MESSAGES.TEXT.LENGTH)
                .trim()
                .escape()

}