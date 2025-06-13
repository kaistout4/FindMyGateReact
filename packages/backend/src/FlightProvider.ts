import { MongoClient, Collection, ObjectId } from "mongodb";
import { IApiFlightData } from "./common/ApiFlightData";

interface IFlightDocument {
    _id: string;
    flightNumber: string;
    from: string;
    to: string;
    terminal: string;
    gate: string;
    departureTime: string;
    date: string;
    authorId: string;
}

interface IUserDocument {
    _id: string;
    username: string;
    email: string;
}

export class FlightProvider {
    private collection: Collection<IFlightDocument>
    private usersCollection: Collection<IUserDocument>

    constructor(private readonly mongoClient: MongoClient) {
        const collectionName = process.env.FLIGHTS_COLLECTION_NAME;
        const usersCollectionName = process.env.USERS_COLLECTION_NAME || 'users';
        
        if (!collectionName) {
            throw new Error("Missing FLIGHTS_COLLECTION_NAME from environment variables");
        }
        
        this.collection = this.mongoClient.db().collection(collectionName);
        this.usersCollection = this.mongoClient.db().collection(usersCollectionName);
    }

    async getAllFlights(): Promise<IApiFlightData[]> {
        const flightsWithAuthors = await this.collection.aggregate([
            {
                // Join with users collection
                $lookup: {
                    from: 'users',
                    localField: 'authorId',
                    foreignField: '_id',
                    as: 'authorData'
                }
            },
            {
                // Unwind the author array (since lookup returns an array)
                $unwind: {
                    path: '$authorData',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                // Transform the output to match IApiFlightData
                $project: {
                    id: '$_id',
                    flightNumber: 1,
                    from: 1,
                    to: 1,
                    terminal: 1,
                    gate: 1,
                    departureTime: 1,
                    date: 1,
                    author: {
                        id: '$authorData._id',
                        username: '$authorData.username'
                    }
                }
            }
        ]).toArray();

        return flightsWithAuthors as IApiFlightData[];
    }

    async getFlightById(flightId: string): Promise<IFlightDocument | null> {
        return await this.collection.findOne({ _id: flightId });
    }

    async updateFlight(flightId: string, updatedFlightData: Partial<IFlightDocument>): Promise<number> {
        const result = await this.collection.updateOne(
            { _id: flightId },
            { $set: updatedFlightData }
        );
        
        return result.matchedCount;
    }
}