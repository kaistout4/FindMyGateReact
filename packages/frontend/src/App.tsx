import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import FlightDetail from './pages/FlightDetail';
import FlightHistory from './pages/FlightHistory';
import { LoginPage } from './pages/LoginPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { type FlightSearchResult } from './services/flightSearchService';
import { ValidRoutes } from "csc437-monorepo-backend/src/shared/ValidRoutes.ts";
import { type IApiFlightData } from "csc437-monorepo-backend/src/common/ApiFlightData.ts";
import './App.css';

function App() {
    const [flights, setFlights] = useState<IApiFlightData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [hasError, setHasError] = useState<boolean>(false);
    const [authToken, setAuthToken] = useState<string | null>(null);

    useEffect(() => {
        if (!authToken) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setHasError(false);

        fetch("/api/flights", {
            headers: {
                "Authorization": `Bearer ${authToken}`
            }
        })
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
    }, [authToken]);

    const handleAuthSuccess = (token: string) => {
        setAuthToken(token);
    };

    const handleUpdateFlight = async (id: string, updatedFlight: Partial<IApiFlightData>) => {
        try {
            const response = await fetch(`/api/flights/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
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

    const addFlight = async (flightData: FlightSearchResult): Promise<string> => {
        try {
            const response = await fetch('/api/flights', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    flightNumber: flightData.flightNumber,
                    from: flightData.from,
                    to: flightData.to,
                    terminal: flightData.terminal,
                    gate: flightData.gate,
                    departureTime: flightData.departureTime,
                    date: flightData.date
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create flight');
            }

            const result = await response.json();
            
            if (authToken) {
                const refreshResponse = await fetch("/api/flights", {
                    headers: {
                        "Authorization": `Bearer ${authToken}`
                    }
                });
                if (refreshResponse.ok) {
                    const refreshedFlights = await refreshResponse.json();
                    setFlights(refreshedFlights);
                }
            }
            
            return result.id;
        } catch (error) {
            console.error('Error creating flight:', error);
            throw error;
        }
    };

    const deleteFlight = async (id: string): Promise<void> => {
        try {
            const response = await fetch(`/api/flights/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete flight');
            }

            // Remove flight from local state after successful deletion
            setFlights(prevFlights => prevFlights.filter(flight => flight.id !== id));
        } catch (error) {
            console.error('Error deleting flight:', error);
            throw error;
        }
    };

    return (
        <Router>
            <div className="app">
                <Navigation />
                <Routes>
                    <Route path={ValidRoutes.HOME} element={
                        <ProtectedRoute authToken={authToken}>
                            <Home flights={flights} addFlight={addFlight} deleteFlight={deleteFlight} isLoading={isLoading} hasError={hasError} />
                        </ProtectedRoute>
                    } />
                    <Route path={ValidRoutes.FLIGHT_DETAILS} element={
                        <ProtectedRoute authToken={authToken}>
                            <FlightDetail flights={flights} updateFlight={handleUpdateFlight} isLoading={isLoading} hasError={hasError} />
                        </ProtectedRoute>
                    } />
                    <Route path={ValidRoutes.HISTORY} element={
                        <ProtectedRoute authToken={authToken}>
                            <FlightHistory flights={flights} isLoading={isLoading} hasError={hasError} />
                        </ProtectedRoute>
                    } />
                    <Route path={ValidRoutes.LOGIN} element={<LoginPage onAuthSuccess={handleAuthSuccess} />} />
                    <Route path={ValidRoutes.REGISTER} element={<LoginPage isRegistering={true} onAuthSuccess={handleAuthSuccess} />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
