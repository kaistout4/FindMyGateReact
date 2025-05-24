import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import FlightSummary from '../components/FlightSummary';
import AdditionalInfo from '../components/AdditionalInfo';
import type { Flight } from '../App';

interface FlightDetailProps {
    flights: Flight[];
    updateFlight: (id: string, updatedFlight: Partial<Flight>) => void;
}

function FlightDetail({ flights, updateFlight }: FlightDetailProps) {
    const { id } = useParams();
    const [isEditing, setIsEditing] = useState(false);
    
    const flight = flights.find(f => f.id === id);
    
    const [editForm, setEditForm] = useState<Flight>(flight || {
        id: '',
        flightNumber: '',
        from: '',
        to: '',
        terminal: '',
        gate: '',
        departureTime: '',
        date: ''
    });
    
    useEffect(() => {
        if (flight) {
            setEditForm(flight);
        }
    }, [flight]);
    
    if (!flight) {
        return <div className="container">Flight not found</div>;
    }
    
    const handleEditClick = () => {
        if (isEditing) {
            updateFlight(id!, {
                from: editForm.from,
                to: editForm.to,
                terminal: editForm.terminal,
                gate: editForm.gate,
                departureTime: editForm.departureTime
            });
            setIsEditing(false);
        } else {
            setEditForm(flight);
            setIsEditing(true);
        }
    };
    
    const handleCancel = () => {
        setEditForm(flight);
        setIsEditing(false);
    };
    
    const handleChange = (field: string, value: string) => {
        setEditForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <main className="container">
            <div className="flight-details-header">
                <div className="back-button-container">
                    <Link to="/" className="back-button" aria-label="Back to home">
                        <FontAwesomeIcon icon={faArrowLeft} /> Back
                    </Link>
                </div>
                <h1>Flight Details</h1>
            </div>

            <section>
                <div className="flight-details-content">
                    <FlightSummary
                        flight={flight}
                        isEditing={isEditing}
                        editForm={editForm}
                        handleChange={handleChange}
                        handleSubmit={(e) => { e.preventDefault(); handleEditClick(); }}
                    />
        
                    <div className="airline-logo">
                        <div className="logo-circle">
                            <span>Airline logo</span>
                        </div>
                    </div>
                </div>
            </section>

            <AdditionalInfo
                title="Travel tips"
                sections={[
                    {
                        subtitle: "Dining",
                        content: "Bombuza, Blue Star, BurgerVille, Cafe Yumm!, Calliope, Capers Bistro"
                    },
                ]}
            />

            <div className="edit-button-container">
                {isEditing ? (
                    <>
                        <button 
                            className="cancel-button"
                            onClick={handleCancel}
                            type="button"
                        >
                            Cancel
                        </button>
                        <button 
                            className="edit-flight-button"
                            onClick={handleEditClick}
                            type="button"
                        >
                            Save
                        </button>
                    </>
                ) : (
                    <button 
                        className="edit-flight-button"
                        onClick={handleEditClick}
                        type="button"
                    >
                        Edit
                    </button>
                )}
            </div>
        </main>
    );
}

export default FlightDetail;