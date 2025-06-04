import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import FlightDetail from './pages/FlightDetail';
import FlightHistory from './pages/FlightHistory';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

export interface Flight {
    id: string;
    flightNumber: string;
    from: string;
    to: string;
    terminal: string;
    gate: string;
    departureTime: string;
    date: string;
}

function App() {
    const [flights, setFlights] = useState<Flight[]>([
        {
            id: '1',
            flightNumber: 'United 2646',
            from: 'SFO',
            to: 'Portland',
            terminal: 'T3',
            gate: 'E5',
            departureTime: '6:23 PM',
            date: 'April 13'
        },
        {
            id: '2',
            flightNumber: 'Air Canada 1245',
            from: 'Portland',
            to: 'Portland',
            terminal: 'T5',
            gate: 'C8',
            departureTime: '8:45 PM',
            date: 'April 30'
        },
        {
            id: '3',
            flightNumber: 'Alaska 879',
            from: 'Seattle',
            to: 'Denver',
            terminal: 'T2',
            gate: 'B4',
            departureTime: '1:15 PM',
            date: 'May 5'
        }
    ]);

    const updateFlight = (id: string, updatedFlight: Partial<Flight>) => {
        setFlights(prevFlights => 
            prevFlights.map(flight => 
                flight.id === id ? { ...flight, ...updatedFlight } : flight
            )
        );
    };

    const addFlight = (flightNumber: string) => {
        const newFlight: Flight = {
            id: Date.now().toString(),
            flightNumber: `Airline ${flightNumber}`,
            from: '',
            to: '',
            terminal: '',
            gate: '',
            departureTime: '',
            date: ''
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
                    <Route path="/" element={<Home flights={flights} addFlight={addFlight} deleteFlight={deleteFlight} />} />
                    <Route path="/flight/:id" element={<FlightDetail flights={flights} updateFlight={updateFlight} />} />
                    <Route path="/history" element={<FlightHistory flights={flights} />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
