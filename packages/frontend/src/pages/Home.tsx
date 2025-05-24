import { useState, useId } from 'react';
import FlightCard from '../components/FlightCard';
import type { Flight } from '../App';

interface HomeProps {
    flights: Flight[];
    addFlight: (flightNumber: string) => string;
    deleteFlight: (id: string) => void;
}

function Home({ flights, addFlight, deleteFlight }: HomeProps) {
    const [flightNumber, setFlightNumber] = useState('');
    const flightInputId = useId();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (flightNumber.trim()) {
            addFlight(flightNumber.trim());
            setFlightNumber('');
        }
    };

    return (
        <main className="container">
            <h1>Flight Tracker Home</h1>
            <section className="add-flight-section">
                <h2>Add Flight</h2>
                <form className="add-flight-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor={flightInputId}>Enter flight #...</label>
                        <div className="input-group">
                            <input 
                                type="text" 
                                id={flightInputId}
                                name="flight-number" 
                                placeholder="Enter flight #..."
                                value={flightNumber}
                                onChange={(e) => setFlightNumber(e.target.value)}
                            />
                            <button type="submit" className="find-button">Find</button>
                        </div>
                    </div>
                </form>
            </section>

            <section className="upcoming-flights-section">
                <h2>Upcoming trips</h2>
                <div className="flights-grid">
                    {flights.map((flight) => (
                        <FlightCard 
                            key={flight.id} 
                            {...flight} 
                            onDelete={() => deleteFlight(flight.id)}
                        />
                    ))}
                </div>
            </section>
        </main>
    );
}

export default Home;