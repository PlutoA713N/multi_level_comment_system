import {body, param, query} from 'express-validator';
import {POST_VALIDATION_MESSAGES, QUERY_VALIDATION_MESSAGES} from "../../constants/error.details.constants";
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
        param(CONSTANTS.POST_ID)
            .exists()
            .withMessage(POST_VALIDATION_MESSAGES.POST_ID.REQUIRED)
            .bail()
            .notEmpty()
            .withMessage(POST_VALIDATION_MESSAGES.POST_ID.EMPTY)
            .bail()
            .isInt()
            .withMessage(POST_VALIDATION_MESSAGES.POST_ID.TYPE)
            .toInt()
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
                .escape(),


    commentId: () =>
        param(CONSTANTS.COMMENT_ID)
            .exists()
            .withMessage(POST_VALIDATION_MESSAGES.COMMENT_ID.REQUIRED)
            .bail()
            .notEmpty()
            .withMessage(POST_VALIDATION_MESSAGES.COMMENT_ID.EMPTY)
            .bail()
            .isInt()
            .withMessage(POST_VALIDATION_MESSAGES.COMMENT_ID.TYPE)
            .toInt()

}


export const queryValidators = {
    sortBy: () =>
        query(CONSTANTS.SORT_BY)
            .optional()
            .isString()
            .withMessage(QUERY_VALIDATION_MESSAGES.SORT_BY.TYPE)
            .notEmpty()
            .withMessage(QUERY_VALIDATION_MESSAGES.SORT_BY.EMPTY)
            .bail()
            .isIn([CONSTANTS.CREATED_AT, CONSTANTS.REPLIES_COUNT])
            .withMessage(QUERY_VALIDATION_MESSAGES.SORT_BY.INVALID),

    sortOrder: () =>
        query(CONSTANTS.SORT_ORDER)
            .optional()
            .isString()
            .withMessage(QUERY_VALIDATION_MESSAGES.SORT_ORDER.TYPE)
            .notEmpty()
            .withMessage(QUERY_VALIDATION_MESSAGES.SORT_ORDER.EMPTY)
            .bail()
            .isIn([CONSTANTS.ASC, CONSTANTS.DESC])
            .withMessage(QUERY_VALIDATION_MESSAGES.SORT_ORDER.INVALID),

    page: () =>
        query(CONSTANTS.PAGE)
            .default(1)
            .isInt({ min: 1})
            .withMessage(QUERY_VALIDATION_MESSAGES.PAGE.TYPE)
            .toInt(),

    pageSize: () =>
        query(CONSTANTS.PAGE_SIZE)
            .default(2)
            .isInt({ min: 1, max: 50 })
            .withMessage(QUERY_VALIDATION_MESSAGES.PAGE_SIZE.TYPE)
            .toInt()

}