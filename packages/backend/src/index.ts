import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { ValidRoutes } from "./shared/ValidRoutes";
import { connectMongo } from "../connectMongo";
import { FlightProvider } from "./FlightProvider";
import { registerFlightRoutes } from "./routes/flightRoutes";

dotenv.config();

const PORT = process.env.PORT || 3000;
const STATIC_DIR = process.env.STATIC_DIR || "public";

const app = express();

app.use(express.json());  // for parsing application/json
app.use(express.static(STATIC_DIR));

const mongoClient = connectMongo();

let flightProvider: FlightProvider;

mongoClient.connect().then(async () => {
    console.log("Connected to MongoDB successfully");
    
    flightProvider = new FlightProvider(mongoClient);
    
    registerFlightRoutes(app, flightProvider);
}).catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
});

app.get("/api/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});

app.get(Object.values(ValidRoutes), (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "..", STATIC_DIR, "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
