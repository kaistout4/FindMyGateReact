import { Link } from 'react-router-dom';

interface HistoryItemProps {
    id: string;
    flightNumber: string;
    date: string;
}

function HistoryItem({ id, flightNumber, date }: HistoryItemProps) {
    return (
        <Link to={`/flight/${id}`} className="history-link">
            <div className="history-item">
                <span className="flight-info">{flightNumber}</span>
                <span className="flight-date">{date}</span>
            </div>
        </Link>
    );
}

export default HistoryItem;