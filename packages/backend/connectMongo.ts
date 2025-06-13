import { MongoClient } from "mongodb";

export function connectMongo() {
    const { MONGO_USER, MONGO_PWD, MONGO_CLUSTER, DB_NAME } = process.env;

    console.log("Environment variables check:");
    console.log("MONGO_USER:", MONGO_USER ? "Set" : "Not set");
    console.log("MONGO_PWD:", MONGO_PWD ? "Set" : "Not set");
    console.log("MONGO_CLUSTER:", MONGO_CLUSTER);
    console.log("DB_NAME:", DB_NAME);

    const connectionStringRedacted = `mongodb+srv://${MONGO_USER}:<password>@${MONGO_CLUSTER}/${DB_NAME}`;
    const connectionString = `mongodb+srv://${MONGO_USER}:${MONGO_PWD}@${MONGO_CLUSTER}/${DB_NAME}`;
    console.log("Attempting Mongo connection at " + connectionStringRedacted);

    return new MongoClient(connectionString);
}