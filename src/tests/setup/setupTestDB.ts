import mongoose from "mongoose";
import {MongoMemoryServer} from "mongodb-memory-server"

let mongoServer: MongoMemoryServer

export async function connectTestDB() {
    mongoServer = await MongoMemoryServer.create({})
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {dbName: "testDB"})
}


export async function clearTestDB() {
    const collection = mongoose.connection.collections
    for(const key in collection) {
        await collection[key].deleteMany({})
    }
}


export async function disconnectTestDB() {
    await mongoose.disconnect();
    if(mongoServer) await mongoServer.stop()
}