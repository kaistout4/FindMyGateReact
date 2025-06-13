import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import FlightDetail from './pages/FlightDetail';
import FlightHistory from './pages/FlightHistory';
import Login from './pages/Login';
import Register from './pages/Register';
import { ValidRoutes } from "csc437-monorepo-backend/src/shared/ValidRoutes.ts";
import { type IApiFlightData } from "csc437-monorepo-backend/src/common/ApiFlightData.ts";
import './App.css';

function App() {
    const [flights, setFlights] = useState<IApiFlightData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [hasError, setHasError] = useState<boolean>(false);

    useEffect(() => {
        // Code in here will run when App is created
        // (Note in dev mode App is created twice)
        fetch("/api/flights")
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setFlights(data);
            })
            .catch(error => {
                console.error('Error fetching flights:', error);
                setHasError(true);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const handleUpdateFlight = async (id: string, updatedFlight: Partial<IApiFlightData>) => {
        try {
            const response = await fetch(`/api/flights/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedFlight)
            });
            
            if (!response.ok) {
                throw new Error('Failed to update flight');
            }
            
            setFlights(prevFlights => 
                prevFlights.map(flight => 
                    flight.id === id ? { ...flight, ...updatedFlight } : flight
                )
            );
        } catch (error) {
            console.error('Error updating flight:', error);
            throw error;
        }
    };

    const addFlight = (flightNumber: string) => {
        const newFlight: IApiFlightData = {
            id: Date.now().toString(),
            flightNumber: `Airline ${flightNumber}`,
            from: '',
            to: '',
            terminal: '',
            gate: '',
            departureTime: '',
            date: '',
            author: { id: 'temp-user', username: 'temp-user' }
        };
        setFlights(prevFlights => [...prevFlights, newFlight]);
        return newFlight.id;
    };

    const deleteFlight = (id: string) => {
        setFlights(prevFlights => prevFlights.filter(flight => flight.id !== id));
    };

    return (
        <Router>
            <div className="app">
                <Navigation />
                <Routes>
                    <Route path={ValidRoutes.HOME} element={<Home flights={flights} addFlight={addFlight} deleteFlight={deleteFlight} isLoading={isLoading} hasError={hasError} />} />
                    <Route path={ValidRoutes.FLIGHT_DETAILS} element={<FlightDetail flights={flights} updateFlight={handleUpdateFlight} isLoading={isLoading} hasError={hasError} />} />
                    <Route path={ValidRoutes.HISTORY} element={<FlightHistory flights={flights} isLoading={isLoading} hasError={hasError} />} />
                    <Route path={ValidRoutes.LOGIN} element={<Login />} />
                    <Route path={ValidRoutes.REGISTER} element={<Register />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
