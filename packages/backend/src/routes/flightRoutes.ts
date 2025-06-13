import express from "express";
import { FlightProvider } from "../FlightProvider";

function waitDuration(numMs: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, numMs));
}

function validateFlightData(flightData: any): string | null {
    // Airport codes length validation
    if (flightData.from && (typeof flightData.from !== 'string' || flightData.from.length < 2 || flightData.from.length > 4)) {
        return "Airport 'from' code must be 2-4 characters";
    }
    
    if (flightData.to && (typeof flightData.to !== 'string' || flightData.to.length < 2 || flightData.to.length > 4)) {
        return "Airport 'to' code must be 2-4 characters";
    }

    // Flight number length validation
    if (flightData.flightNumber && (typeof flightData.flightNumber !== 'string' || flightData.flightNumber.length > 20 || flightData.flightNumber.length < 2)) {
        return "Flight number must be between 2-20 characters";
    }

    // Terminal length validation
    if (flightData.terminal && (typeof flightData.terminal !== 'string' || flightData.terminal.length > 5)) {
        return "Terminal designation must be 5 characters or less";
    }

    // Gate length validation
    if (flightData.gate && (typeof flightData.gate !== 'string' || flightData.gate.length > 10)) {
        return "Gate designation must be 10 characters or less";
    }

    // Depart time length validation
    if (flightData.departureTime && (typeof flightData.departureTime !== 'string' || flightData.departureTime.length > 20)) {
        return "Departure time must be 20 characters or less";
    }

    // Date length validation
    if (flightData.date && (typeof flightData.date !== 'string' || flightData.date.length > 20)) {
        return "Date must be 20 characters or less";
    }

    // Same origin/dest
    if (flightData.from && flightData.to && flightData.from === flightData.to) {
        return "Origin and destination airports cannot be the same";
    }

    return null;
}

export function registerFlightRoutes(app: express.Application, flightProvider: FlightProvider) {
    app.get("/api/flights", async (req: express.Request, res: express.Response) => {
        console.log("GET /api/flights - flightProvider exists:", !!flightProvider);
        
        try {
            if (!flightProvider) {
                console.log("Flight provider not initialized, returning 503");
                res.status(503).json({ error: "Database connection not ready" });
                return;
            }
            
            await waitDuration(1000);
            console.log("Fetching flights from database...");
            const flights = await flightProvider.getAllFlights();
            console.log(`Retrieved ${flights.length} flights from database`);
            res.json(flights);
        } catch (error) {
            console.error("Error fetching flights:", error);
            res.status(500).json({ error: "Failed to fetch flights" });
        }
    });

    app.patch("/api/flights/:id", async (req: express.Request, res: express.Response) => {
        console.log("PATCH /api/flights/:id - updating flight:", req.params.id);
        
        try {
            if (!flightProvider) {
                console.log("Flight provider not initialized, returning 503");
                res.status(503).json({ error: "Database connection not ready" });
                return;
            }

            const flightId = req.params.id;
            const updatedFlightData = req.body;
            
            if (!updatedFlightData || typeof updatedFlightData !== 'object') {
                res.status(400).send({
                    error: "Bad Request",
                    message: "Request body must be a valid JSON object"
                });
                return;
            }

            const { id, author, ...flightUpdateData } = updatedFlightData;

            if (Object.keys(flightUpdateData).length === 0) {
                res.status(400).send({
                    error: "Bad Request",
                    message: "No valid fields provided for update"
                });
                return;
            }

            const validationError = validateFlightData(flightUpdateData);
            if (validationError) {
                res.status(422).send({
                    error: "Unprocessable Entity",
                    message: validationError
                });
                return;
            }
            
            console.log("Updating flight with data:", flightUpdateData);
            
            await waitDuration(1000);
            const matchedCount = await flightProvider.updateFlight(flightId, flightUpdateData);
            
            if (matchedCount === 0) {
                console.log("No flight found with id:", flightId);
                res.status(404).send({
                    error: "Not Found",
                    message: "Flight does not exist"
                });
                return
            }
            
            console.log("Flight updated successfully");
            res.status(204).send();
        } catch (error) {
            console.error("Error updating flight:", error);
            res.status(500).json({ error: "Failed to update flight" });
        }
    });
}