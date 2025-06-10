import request from "supertest";
import {app} from "../../../app";
import {connectTestDB, clearTestDB, disconnectTestDB} from "../../setup/setupTestDB";
import {UserModel} from "../../../models/user/user.model";
import {IPost, PostModel} from "../../../models/post/post.model";
import {jwtSign} from "../../../utils/jwt";
import {Document} from "mongoose";
import { disconnectRedis} from "../../setup/redis.testDB";
import {storeUserToken} from "../../../config/redis/redis.utils";

const generateToken = (payload: object) => {
   return jwtSign(payload);
}

let token: string , post: Document & IPost;

beforeAll(async () => {
    await connectTestDB()
    const user = new UserModel({username: 'test', password: 'Test123#', email: 'test@gmail.com'})
    const newUser = await user.save()
    const payload = {userId: newUser._id.toString(), username: newUser.username, email: newUser.email}
    token = generateToken(payload)
    await storeUserToken(newUser._id.toString(), token)
    post = new PostModel({userId: newUser.id, title: 'postOne', content: 'About postOne'})
    await post.save()
})

afterAll(async () => {
    await disconnectRedis()
    // await clearTestDB()
    await disconnectTestDB()
})

describe("POST /api/posts/:postId/comments", () => {
    it('should create a comment', async () => {
        const res = await request(app)
            .post(`/api/posts/${post.postId}/comments`)
            .set('Authorization', 'Bearer ' + token)
            .send({text: 'Hello world'})

        const response = res.body

        expect(response.status).toBe(201)
        expect(response.result).toBe('success')
        expect(response.message).toBe('Post comment created successfully')
    })

    it('should throw an error for invalid token', async () => {
        const res = await request(app)
            .post(`/api/posts/${post.postId}/comments`)
            .set('Authorization', 'Bearer ' + 'Invalid token')
            .send({text: 'Hello world'})

        const response = res.body
        expect(response.status).toBe(401)
        expect(response.code).toBe('INVALID_TOKEN')
        expect(response.title).toBe('Unauthorized')

    })

    it('should throw an error for unknown post id', async () => {
        const res = await request(app)
        .post(`/api/posts/${4}/comments`)
        .set('Authorization', 'Bearer ' + token)
        .send({text: 'Hello world'})

        const response = res.body
        expect(response.status).toBe(404)
        expect(response.detail).toBe('The post you are trying to comment on does not exist.')
        expect(response.code).toBe('POST_NOT_FOUND')
    })

    it('should throw an error for invalid url path', async () => {
        const res = await request(app)
            .post(`/invalid/path`)
            .set('Authorization', 'Bearer ' + token)
            .send({text: 'Hello world'})

        const response = res.body
        expect(response.status).toBe(404)
        expect(response.code).toBe('NOT_FOUND')
        expect(response.detail).toBe('The requested resource /invalid/path was not found.')
    })

    it('should throw an error for empty text', async () => {
        const res = await request(app)
        .post(`/api/posts/${post.postId}/comments`)
        .set('Authorization', 'Bearer ' + token)
        .send({text: ''})

        const response = res.body
        expect(response.status).toBe(400)
        expect(response.title).toBe('Bad Request')
        expect(response.errors[0].message).toBe('text value cannot be empty')
    })

    it('should return 500 when database is disconnected', async () => {
        await disconnectTestDB();

        const res = await request(app)
            .post(`/api/posts/${post.postId}/comments`)
            .set('Authorization', 'Bearer ' + token)
            .send({text: 'Hello world'});

        const response = res.body;
        expect(response.status).toBe(500);
        expect(response.code).toBe('INTERNAL_SERVER_ERROR')
        expect(response.detail).toBe('An unexpected error occurred.')
        await connectTestDB();
    });

})