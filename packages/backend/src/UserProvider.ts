import { MongoClient, Collection } from "mongodb";

interface IUserDocument {
    id: string;
    username: string;
    email?: string;
}

export class UserProvider {
    private collection: Collection<IUserDocument>;

    constructor(private readonly mongoClient: MongoClient) {
        const collectionName = process.env.USERS_COLLECTION_NAME || 'users';
        this.collection = this.mongoClient.db().collection(collectionName);
    }

    async createUser(username: string, email?: string): Promise<string> {
        const id = Date.now().toString();
        const userData: IUserDocument = {
            id,
            username
        };
        if (email) {
            userData.email = email;
        }
        await this.collection.insertOne(userData);
        return id;
    }

    async getUserByUsername(username: string): Promise<IUserDocument | null> {
        return await this.collection.findOne({ username });
    }

    async getUserById(id: string): Promise<IUserDocument | null> {
        return await this.collection.findOne({ id });
    }

    async getUsersByIds(ids: string[]): Promise<IUserDocument[]> {
        return await this.collection.find({ id: { $in: ids } }).toArray();
    }
}