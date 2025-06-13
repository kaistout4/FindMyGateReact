import FlightStatCard from '../components/FlightStatCard';
import FlightHistoryItem from '../components/FlightHistoryItem';
import type { IApiFlightData } from "csc437-monorepo-backend/src/common/ApiFlightData.ts";

interface FlightHistoryProps {
    flights: IApiFlightData[];
    isLoading: boolean;
    hasError: boolean;
}

function FlightHistory({ flights, isLoading, hasError }: FlightHistoryProps) {
    const calculateStatistics = () => {
        if (flights.length === 0) {
            return {
                totalFlights: 0,
                favoriteAirport: 'N/A',
                avgTime: 'N/A',
                longestFlight: 'N/A'
            };
        }

        const airportCount: Record<string, number> = {};
        flights.forEach(flight => {
            airportCount[flight.to] = (airportCount[flight.to] || 0) + 1;
        });
        const favoriteAirport = Object.entries(airportCount)
            .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

        const avgTime = flights.length > 0 
            ? (() => {
                const validTimes = flights
                    .map(flight => flight.departureTime)
                    .filter(time => time && /\d{1,2}:\d{2}\s*(AM|PM)/i.test(time));
                
                if (validTimes.length === 0) return 'N/A';
                
                const totalMinutes = validTimes.reduce((sum, time) => {
                    const [timePart, period] = time.split(' ');
                    const [hours, minutes] = timePart.split(':').map(Number);
                    
                    let hour24 = hours;
                    if (period.toUpperCase() === 'PM' && hours !== 12) {
                        hour24 += 12;
                    } else if (period.toUpperCase() === 'AM' && hours === 12) {
                        hour24 = 0;
                    }
                    
                    return sum + (hour24 * 60 + minutes);
                }, 0);
                
                const avgMinutes = totalMinutes / validTimes.length;
                const hours = Math.floor(avgMinutes / 60);
                const minutes = Math.round(avgMinutes % 60);
                
                return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            })()
            : 'N/A';

        const longestFlight = flights.length > 0
            ? (() => {
                const flightDurations = flights.map(flight => {             
                    const isDomestic = flight.from.length === 3 && flight.to.length === 3;
                    return isDomestic ? Math.random() * 4 + 1 : Math.random() * 8 + 4;
                });
                const maxDuration = Math.max(...flightDurations);
                return `${maxDuration.toFixed(1)}hr`;
            })()
            : 'N/A';

        return {
            totalFlights: flights.length,
            favoriteAirport,
            avgTime,
            longestFlight
        };
    };

    const statistics = calculateStatistics();

    return (
        <main className="container">
            <h1>Flight History</h1>

            {isLoading ? (
                <p>Loading flight history...</p>
            ) : hasError ? (
                <p>Error loading flight history. Please try again later.</p>
            ) : (
                <>
                    <section>
                        <h2>Statistics</h2>
                        <div className="stats-grid">
                            <FlightStatCard title="Total flights" value={statistics.totalFlights} />
                            <FlightStatCard title="Favorite airport" value={statistics.favoriteAirport} />
                            <FlightStatCard title="Avg. Time" value={statistics.avgTime} />
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
                </>
            )}
        </main>
    );
}

export default FlightHistory;