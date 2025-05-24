import { Link } from 'react-router-dom';

interface FlightHistoryItemProps {
    id: string;
    flightNumber: string;
    date: string;
}

function FlightHistoryItem({ id, flightNumber, date }: FlightHistoryItemProps) {
    return (
        <Link to={`/flight/${id}`} className="history-link">
            <div className="history-item">
                <span className="flight-info">{flightNumber}</span>
                <span className="flight-date">{date}</span>
            </div>
        </Link>
    );
}

export default FlightHistoryItem;