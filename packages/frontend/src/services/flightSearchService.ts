export interface FlightSearchResult {
    flightNumber: string;
    from: string;
    to: string;
    terminal: string;
    gate: string;
    departureTime: string;
    date: string;
    success: boolean;
    error?: string;
}

const AVIATION_STACK_API_KEY = '07eede1926f7de4b1b982ae34e3e0808';
const AVIATION_STACK_BASE_URL = 'https://api.aviationstack.com/v1';

export async function searchFlightByNumber(flightNumber: string, airlineName: string): Promise<FlightSearchResult> {
    try {
        const params = new URLSearchParams({
            access_key: AVIATION_STACK_API_KEY,
            flight_number: flightNumber,
            airline_name: airlineName
        });
        
        const url = `${AVIATION_STACK_BASE_URL}/flights?${params.toString()}`;
        console.log('Making API request to:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API Response:', data);
        
        if (data.error) {
            throw new Error(data.error.message || 'API error occurred');
        }
        
        if (!data.data || data.data.length === 0) {
            return {
                flightNumber: flightNumber,
                from: '',
                to: '',
                terminal: '',
                gate: '',
                departureTime: '',
                date: '',
                success: false,
                error: 'Flight not found. Please check the flight number and try again.'
            };
        }
        
        const flight = data.data[0];
        
        const departureTime = flight.departure?.scheduled ? 
            new Date(flight.departure.scheduled).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            }) : '';
            
        const date = flight.departure?.scheduled ?
            new Date(flight.departure.scheduled).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            }) : '';
        
        return {
            flightNumber: `${flight.airline?.name || airlineName} ${flight.flight?.number || flightNumber}`,
            from: flight.departure?.iata || '',
            to: flight.arrival?.iata || '',
            terminal: flight.departure?.terminal || '',
            gate: flight.departure?.gate || '',
            departureTime: departureTime,
            date: date,
            success: true
        };
        
    } catch (error) {
        console.error('Flight search error:', error);
        return {
            flightNumber: flightNumber,
            from: '',
            to: '',
            terminal: '',
            gate: '',
            departureTime: '',
            date: '',
            success: false,
            error: error instanceof Error ? error.message : 'Failed to search flight. Please try again.'
        };
    }
}