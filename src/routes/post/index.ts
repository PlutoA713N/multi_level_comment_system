import {Router} from "express";
import {validatePostCommentRules, validatePostRules} from "../../middleware/post_middleware";
import {validateResult} from "../../middleware/user_middleware/validate.middleware";
import {authenticationHandler} from "../../middleware/authentication_middleware/authentication";
import {createPostController} from "../../controller/post/post.create.controller";
import {postCommentController} from "../../controller/post/post.comment.controller";
import {postCommentRateLimiter} from "../../middleware/express_middleware/rate.limiter.middleware";
const router = Router();

router.post("/", authenticationHandler, ...validatePostRules, validateResult, createPostController);

router.post("/:postId/comments", postCommentRateLimiter, authenticationHandler, ...validatePostCommentRules, validateResult, postCommentController );

export default router;