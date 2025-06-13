import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import FlightSummary from '../components/FlightSummary';
import AdditionalInfo from '../components/AdditionalInfo';
import type { IApiFlightData } from "csc437-monorepo-backend/src/common/ApiFlightData.ts";
import { getAirlineLogo } from '../utils/airlineLogos';

interface FlightDetailProps {
    flights: IApiFlightData[];
    updateFlight: (id: string, updatedFlight: Partial<IApiFlightData>) => Promise<void>;
    isLoading: boolean;
    hasError: boolean;
}

function FlightDetail({ flights, updateFlight, isLoading, hasError }: FlightDetailProps) {
    const { id } = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    
    const flight = flights.find(f => f.id === id);
    
    const [editForm, setEditForm] = useState<IApiFlightData>(flight || {
        id: '',
        flightNumber: '',
        from: '',
        to: '',
        terminal: '',
        gate: '',
        departureTime: '',
        date: '',
        author: {
            id: '',
            username: ''
        },
    });
    
    useEffect(() => {
        if (flight) {
            setEditForm(flight);
        }
    }, [flight]);
    
    if (!flight) {
        return <div className="container">Flight not found</div>;
    }
    
    const handleEditClick = async () => {
        if (isEditing) {
            // Save functionality
            setIsSaving(true);
            setSaveError(null);
            
            try {
                await updateFlight(id!, {
                    from: editForm.from,
                    to: editForm.to,
                    terminal: editForm.terminal,
                    gate: editForm.gate,
                    departureTime: editForm.departureTime
                });
                
                setIsEditing(false);
                setSaveError(null);
            } catch (error) {
                setSaveError('Failed to save flight.');
            } finally {
                setIsSaving(false);
            }
        } else {
            setEditForm(flight);
            setIsEditing(true);
            setSaveError(null);
        }
    };
    
    const handleCancel = () => {
        setEditForm(flight);
        setIsEditing(false);
        setSaveError(null);
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

            {isLoading ? (
                <p>Loading flight details...</p>
            ) : hasError ? (
                <p>Error loading flight details. Please try again later.</p>
            ) : !flight ? (
                <p>Flight not found.</p>
            ) : (
                <>
                    <section>
                        <div className="flight-details-content">
                            <FlightSummary
                                flight={flight}
                                isEditing={isEditing}
                                editForm={editForm}
                                handleChange={handleChange}
                                handleSubmit={(e) => { e.preventDefault(); handleEditClick(); }}
                                isSaving={isSaving}
                            />
                
                            <div className="airline-logo">
                                <div className="logo-circle">
                                    {getAirlineLogo(flight.flightNumber) ? (
                                        <img 
                                            src={getAirlineLogo(flight.flightNumber) ?? ""} 
                                            alt={`${flight.flightNumber.split(' ')[0]} logo`}
                                            className="airline-logo-img"
                                        />
                                    ) : (
                                        <span>Airline logo</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {saveError && <p style={{color: 'red'}}>{saveError}</p>}

                    <div className="edit-button-container">
                        {isEditing ? (
                            <>
                                <button 
                                    className="cancel-button"
                                    onClick={handleCancel}
                                    type="button"
                                    disabled={isSaving}
                                >
                                    Cancel
                                </button>
                                {isSaving ? (
                                    <div className="loading-spinner" style={{
                                        width: '24px',
                                        height: '24px',
                                        border: '3px solid #f3f3f3',
                                        borderTop: '3px solid var(--button-primary)',
                                        borderRadius: '50%',
                                        animation: 'spin 1s linear infinite',
                                        margin: '0 auto'
                                    }}></div>
                                ) : (
                                    <button 
                                        className="edit-flight-button"
                                        onClick={handleEditClick}
                                        type="button"
                                    >
                                        Save
                                    </button>
                                )}
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

                    <AdditionalInfo
                        title="Travel tips"
                        sections={[
                            {
                                subtitle: "Dining",
                                content: "Bombuza, Blue Star, BurgerVille, Cafe Yumm!, Calliope, Capers Bistro"
                            },
                        ]}
                    />
                </>
            )}
        </main>
    );
}

export default FlightDetail;