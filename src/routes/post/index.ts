import {Router} from "express";
import {
    validateGetCommentRules,
    validateGetPostsRules,
    validatePostCommentRules,
    validatePostRules,
    validateReplyCommentRules
} from "../../middleware/post_middleware";
import {validateResult} from "../../middleware/user_middleware/validate.middleware";
import {authenticationHandler} from "../../middleware/authentication_middleware/authentication";
import {createPostController} from "../../controller/post/create.post.controller";
import {postCommentController} from "../../controller/post/post.comment.controller";
import {
    postCommentRateLimiter,
    replyCommentRateLimiter
} from "../../middleware/express_middleware/rate.limiter.middleware";
import {
    lookupPostDocument,
    lookupPostReplyCommentDocuments
} from "../../middleware/search_document_middleware";
import {replyCommentController} from "../../controller/post/reply.comment.controller";
import {getPostCommentsController} from "../../controller/post/get.post.comments.controller";
import {getParentLevelCommentsController} from "../../controller/post/get-parent-level-comments.controller";

const router = Router();

router.post("/", authenticationHandler, ...validatePostRules, validateResult, createPostController);

router.post("/:postId/comments", postCommentRateLimiter, authenticationHandler, ...validatePostCommentRules, validateResult, lookupPostDocument, postCommentController );

router.post("/:postId/comments/:commentId/reply", replyCommentRateLimiter, authenticationHandler, ...validateReplyCommentRules, validateResult, lookupPostReplyCommentDocuments, replyCommentController );

router.get("/:postId/comments", authenticationHandler, ...validateGetPostsRules, validateResult, lookupPostDocument, getPostCommentsController)

router.get("/:postId/comments/:commentId/expand", authenticationHandler, ...validateGetCommentRules, validateResult, lookupPostReplyCommentDocuments, getParentLevelCommentsController );

export default router;