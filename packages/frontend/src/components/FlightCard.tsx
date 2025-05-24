import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

interface FlightCardProps {
    id: string;
    flightNumber: string;
    from: string;
    to: string;
    terminal: string;
    gate: string;
    departureTime: string;
    date: string;
    onDelete: () => void;
}

function FlightCard({ 
    id, 
    flightNumber, 
    from, 
    to, 
    terminal, 
    gate, 
    departureTime, 
    date,
    onDelete
}: FlightCardProps) {
    return (
        <div className="flight-card">
            <div className="flight-card-main">
                <h3>{flightNumber}</h3>
                <p>{from || 'TBD'} → {to || 'TBD'}</p>
                <p>Terminal: {terminal || 'TBD'}</p>
                <p>Gate: {gate || 'TBD'}</p>
                <p>Departs: {departureTime || 'TBD'}</p>
                <p>{date || 'TBD'}</p>
            </div>
            <div className="flight-card-action">
                <Link 
                    to={`/flight/${id}`} 
                    className="edit-button" 
                    aria-label="Edit flight"
                >
                    <FontAwesomeIcon icon={faPenToSquare} />
                </Link>
                <button
                    onClick={onDelete}
                    className="delete-button"
                    aria-label="Delete flight"
                    type="button"
                >
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </div>
        </div>
    );
}

export default FlightCard;