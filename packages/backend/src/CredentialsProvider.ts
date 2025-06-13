import { MongoClient, Collection } from "mongodb";
import bcrypt from "bcrypt";

interface ICredentialsDocument {
    username: string;
    password: string;
}

export class CredentialsProvider {
    private collection: Collection<ICredentialsDocument>;

    constructor(private readonly mongoClient: MongoClient) {
        const collectionName = process.env.CREDS_COLLECTION_NAME || 'userCreds';
        this.collection = this.mongoClient.db().collection(collectionName);
    }

    async registerUser(username: string, plaintextPassword: string): Promise<boolean> {
        const existingUser = await this.collection.findOne({ username });
        if (existingUser) {
            return false;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(plaintextPassword, salt);

        await this.collection.insertOne({
            username,
            password: hashedPassword
        });

        return true;
    }

    async verifyPassword(username: string, plaintextPassword: string): Promise<boolean> {
        const userRecord = await this.collection.findOne({ username });
        if (!userRecord) {
            return false;
        }

        return await bcrypt.compare(plaintextPassword, userRecord.password);
    }

    async userExists(username: string): Promise<boolean> {
        const user = await this.collection.findOne({ username });
        return user !== null;
    }
}