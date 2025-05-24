import FlightStatCard from '../components/FlightStatCard';
import FlightHistoryItem from '../components/FlightHistoryItem';

interface FlightHistoryItem {
    id: string;
    flightNumber: string;
    date: string;
}

function FlightHistory() {
    const statistics = {
        totalFlights: 3,
        favoriteAirport: 'SFO',
        avgTime: 'Noon',
        totalMiles: 4538,
        longestFlight: '6.5hr'
    };

    const flightHistory: FlightHistoryItem[] = [
        { id: '1', flightNumber: 'United 2646', date: 'April 13, 2023' },
        { id: '2', flightNumber: 'United 4765', date: 'April 30, 2023' },
        { id: '3', flightNumber: 'Alaska 6796', date: 'June 23, 2024' }
    ];

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
                    {flightHistory.map((item) => (
                        <FlightHistoryItem key={item.id} {...item} />
                    ))}
                </div>
            </section>
        </main>
    );
}

export default FlightHistory;