export interface IApiFlightData {
    id: string;
    flightNumber: string;
    from: string;
    to: string;
    terminal: string;
    gate: string;
    departureTime: string;
    date: string;
    author: IApiUserData;
}

export interface IApiUserData {
    id: string,
    username: string
}

export const FLIGHTS: IApiFlightData[] = [
    {
        id: '1',
        flightNumber: 'United 2646',
        from: 'SFO',
        to: 'Portland',
        terminal: 'T3',
        gate: 'E5',
        departureTime: '6:23 PM',
        date: 'April 13',
        author: {
            id: 'user1',
            username: 'testuser1'
        }
    },
    {
        id: '2',
        flightNumber: 'Air Canada 1245',
        from: 'Portland',
        to: 'Portland',
        terminal: 'T5',
        gate: 'C8',
        departureTime: '8:45 PM',
        date: 'April 30',
        author: {
            id: 'user2',
            username: 'testuser2'
        }
    },
    {
        id: '3',
        flightNumber: 'Alaska 879',
        from: 'Seattle',
        to: 'Denver',
        terminal: 'T2',
        gate: 'B4',
        departureTime: '1:15 PM',
        date: 'May 5',
        author: {
            id: 'user3',
            username: 'testuser3'
        }
    }
];