import FlightStatCard from '../components/FlightStatCard';
import FlightHistoryItem from '../components/FlightHistoryItem';
import type { IApiFlightData } from "csc437-monorepo-backend/src/common/ApiFlightData.ts";

interface FlightHistoryProps {
    flights: IApiFlightData[];
}

function FlightHistory({ flights }: FlightHistoryProps) {
    const statistics = {
        totalFlights: flights.length,
        favoriteAirport: 'SFO',
        avgTime: 'Noon',
        totalMiles: 4538,
        longestFlight: '6.5hr'
    };

    return (
        <main className="container">
            <h1>Flight History</h1>

            <section>
                <h2>Statistics</h2>
                <div className="stats-grid">
                    <FlightStatCard title="Total flights" value={statistics.totalFlights} />
                    <FlightStatCard title="Favorite airport" value={statistics.favoriteAirport} />
                    <FlightStatCard title="Avg. Time" value={statistics.avgTime} />
                    <FlightStatCard title="Total miles" value={statistics.totalMiles} />
                    <FlightStatCard title="Longest flight" value={statistics.longestFlight} />
                </div>
            </section>

            <section className="history-section">
                <h2>History</h2>
                <div className="flight-history-list">
                    {flights.map((flight) => (
                        <FlightHistoryItem 
                            key={flight.id} 
                            id={flight.id}
                            flightNumber={flight.flightNumber}
                            date={flight.date}
                        />
                    ))}
                </div>
            </section>
        </main>
    );
}

export default FlightHistory;