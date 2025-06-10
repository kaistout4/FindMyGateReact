import type { IApiFlightData } from "csc437-monorepo-backend/src/common/ApiFlightData.ts";

interface FlightSummaryProps {
    flight: IApiFlightData;
    isEditing: boolean;
    editForm: IApiFlightData;
    handleChange: (field: string, value: string) => void;
    handleSubmit: (e: React.FormEvent) => void;
}

function FlightSummary({ 
    flight, 
    isEditing, 
    editForm, 
    handleChange, 
    handleSubmit 
}: FlightSummaryProps) {
    return (
        <div className="flight-summary">
            <h2>{flight.flightNumber}</h2>
            {isEditing ? (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="from">From:</label>
                        <input 
                            type="text" 
                            id="from"
                            value={editForm.from}
                            onChange={(e) => handleChange('from', e.target.value)}
                            className="edit-input"
                        />
                        <span> → </span>
                        <label htmlFor="to" className="sr-only">To:</label>
                        <input 
                            type="text" 
                            id="to"
                            value={editForm.to}
                            onChange={(e) => handleChange('to', e.target.value)}
                            className="edit-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="terminal">Terminal:</label>
                        <input 
                            type="text" 
                            id="terminal"
                            value={editForm.terminal}
                            onChange={(e) => handleChange('terminal', e.target.value)}
                            className="edit-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="gate">Gate:</label>
                        <input 
                            type="text" 
                            id="gate"
                            value={editForm.gate}
                            onChange={(e) => handleChange('gate', e.target.value)}
                            className="edit-input"
                        />
                    </div>
                    <p>Navigate to gate</p>
                    <div className="form-group">
                        <label htmlFor="departureTime">Departs:</label>
                        <input 
                            type="text" 
                            id="departureTime"
                            value={editForm.departureTime}
                            onChange={(e) => handleChange('departureTime', e.target.value)}
                            className="edit-input"
                        />
                        <span>, {editForm.date}</span>
                    </div>
                </form>
            ) : (
                <>
                    <p>From: {flight.from} → {flight.to}</p>
                    <p>Terminal: {flight.terminal}</p>
                    <p>Gate: {flight.gate}</p>
                    <p>Navigate to gate</p>
                    <p>Departs: {flight.departureTime}, {flight.date}</p>
                </>
            )}
        </div>
    );
}

export default FlightSummary;