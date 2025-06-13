import { useState, useId } from 'react';
import FlightCard from '../components/FlightCard';
import type { IApiFlightData } from "csc437-monorepo-backend/src/common/ApiFlightData.ts";
import { searchFlightByNumber, type FlightSearchResult } from '../services/flightSearchService';

interface HomeProps {
    flights: IApiFlightData[];
    addFlight: (flightData: FlightSearchResult) => Promise<string>;
    deleteFlight: (id: string) => Promise<void>;
    isLoading: boolean;
    hasError: boolean;
}

function Home({ flights, addFlight, deleteFlight, isLoading, hasError }: HomeProps) {
    const [flightNumber, setFlightNumber] = useState('');
    const [selectedAirline, setSelectedAirline] = useState('United');
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const flightInputId = useId();
    const airlineSelectId = useId();

    console.log(addFlight);
    
    const airlines = ['United', 'Delta', 'Alaska', 'JetBlue'];
    
    const airlineNameMap: Record<string, string> = {
        'United': 'United Airlines',
        'Delta': 'Delta Air Lines',
        'Alaska': 'Alaska Airlines',
        'JetBlue': 'JetBlue Airways'
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!flightNumber.trim()) return;
        
        setIsSearching(true);
        setSearchError(null);
        
        try {
            const airlineName = airlineNameMap[selectedAirline];
            const result = await searchFlightByNumber(flightNumber.trim(), airlineName);
            
            if (result.success) {
                console.log('Flight found:', result);
                await addFlight(result);
                setFlightNumber('');
                alert(`Flight added to your list!\n${result.flightNumber}\n${result.from} → ${result.to}`);
            } else {
                setSearchError(result.error || 'Flight not found');
            }
        } catch (error) {
            setSearchError('Failed to search flight. Please try again.');
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <main className="container">
            <h1>Flight Tracker Home</h1>
            <section className="add-flight-section">
                <h2>Add Flight</h2>
                <form className="add-flight-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor={airlineSelectId}>Airline</label>
                        <select 
                            id={airlineSelectId}
                            name="airline"
                            value={selectedAirline}
                            onChange={(e) => setSelectedAirline(e.target.value)}
                            className="airline-select"
                            disabled={isSearching}
                        >
                            {airlines.map(airline => (
                                <option key={airline} value={airline}>
                                    {airline}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor={flightInputId}>Flight Number</label>
                        <div className="input-group">
                            <input 
                                type="text" 
                                id={flightInputId}
                                name="flight-number" 
                                placeholder="Enter flight number..."
                                value={flightNumber}
                                onChange={(e) => setFlightNumber(e.target.value)}
                                disabled={isSearching}
                            />
                            <button type="submit" className="find-button" disabled={isSearching}>
                                {isSearching ? 'Searching...' : 'Find'}
                            </button>
                        </div>
                    </div>
                    {searchError && (
                        <p style={{ color: 'red', marginTop: '10px' }}>
                            {searchError}
                        </p>
                    )}
                </form>
            </section>

            <section className="upcoming-flights-section">
                <h2>Upcoming trips</h2>
                {isLoading ? (
                    <p>Loading flights...</p>
                ) : hasError ? (
                    <p>Error loading flights. Please try again later.</p>
                ) : flights.length === 0 ? (
                    <p>No flights available</p>
                ) : (
                    <div className="flights-grid">
                        {flights.map((flight) => (
                            <FlightCard 
                                key={flight.id} 
                                {...flight} 
                                onDelete={() => deleteFlight(flight.id)}
                            />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

export default Home;