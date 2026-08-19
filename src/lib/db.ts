import mongoose from "mongoose"
import dns from "node:dns/promises"

dns.setServers(["8.8.8.8", "1.1.1.1"])

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected to database");
        return
    }
    try {
        console.log(`${process.env.MONGODB_URI}/UTS`);

        const db = await mongoose.connect(`${process.env.MONGODB_URI}/UTS` as string)

        connection.isConnected = db.connections[0].readyState
        console.log("db connected successfully!");

    } catch (error) {
        console.log("Database connection failed: ", error);
        process.exit(1)
    }
}

export default dbConnect