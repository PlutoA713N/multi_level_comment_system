import request from "supertest";
import {app} from "../../../app";
import {connectTestDB, clearTestDB, disconnectTestDB} from "../../setup/setupTestDB";
import {UserModel} from "../../../models/user/user.model";
import {IPost, PostModel} from "../../../models/post/post.model";
import {jwtSign} from "../../../utils/jwt";
import {Document} from "mongoose";
import { disconnectRedis} from "../../setup/redis.testDB";
import {storeUserToken} from "../../../config/redis/redis.utils";
import {CommentModel} from "../../../models/post/comment.model";

const generateToken = (payload: object) => {
    return jwtSign(payload);
}

let token: string , post: Document & IPost, parentCommentId: number

beforeAll(async () => {
    await connectTestDB()
    const user = new UserModel({username: 'test', password: 'Test123#', email: 'test@gmail.com'})
    const newUser = await user.save()
    const payload = {userId: newUser._id.toString(), username: newUser.username, email: newUser.email}
    token = generateToken(payload)
    await storeUserToken(newUser._id.toString(), token)
    post = new PostModel({userId: newUser.id, title: 'postOne', content: 'About postOne'})
    await post.save()
    const parentComment = new CommentModel({postId: post.postId, userId: newUser._id.toString(), text: 'parentCommentOne'})
    const savedComment= await parentComment.save()
    parentCommentId = savedComment.commentId
})

afterAll(async () => {
    await disconnectRedis()
    // await clearTestDB()
    await disconnectTestDB()
})

describe("GET /api/posts/:postId/comments", () => {
    it('should get a comment', async () => {
        const res = await request(app)
            .get(`/api/posts/${post.postId}/comments`)
            .set('Authorization', 'Bearer ' + token)

        const response = res.body
        console.log(response)

        expect(response.status).toBe(200)
        expect(response.result).toBe('success')
        expect(response.message).toBe('Post Comments fetched successfully')
    })

    it('should throw an error for invalid token', async () => {
        const res = await request(app)
            .get(`/api/posts/${post.postId}/comments`)
            .set('Authorization', 'Bearer ' + 'Invalid token')

        const response = res.body
        expect(response.status).toBe(401)
        expect(response.code).toBe('INVALID_TOKEN')
        expect(response.title).toBe('Unauthorized')

    })

    it('should throw an error for unknown post id', async () => {
        const res = await request(app)
            .get(`/api/posts/${4}/comments`)
            .set('Authorization', 'Bearer ' + token)

        const response = res.body
        expect(response.status).toBe(404)
        expect(response.detail).toBe('The post you are trying to comment on does not exist.')
        expect(response.code).toBe('POST_NOT_FOUND')
    })

    it('should throw an error for invalid url path', async () => {
        const res = await request(app)
            .get(`/invalid/path`)
            .set('Authorization', 'Bearer ' + token)

        const response = res.body
        expect(response.status).toBe(404)
        expect(response.code).toBe('NOT_FOUND')
        expect(response.detail).toBe('The requested resource /invalid/path was not found.')
    })


    it('should return 500 when database is disconnected', async () => {
        await disconnectTestDB();

        const res = await request(app)
            .get(`/api/posts/${post.postId}/comments`)
            .set('Authorization', 'Bearer ' + token)

        const response = res.body;
        expect(response.status).toBe(500);
        expect(response.code).toBe('INTERNAL_SERVER_ERROR')
        expect(response.detail).toBe('An unexpected error occurred.')

        await connectTestDB();
    });

})