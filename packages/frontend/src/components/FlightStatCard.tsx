interface FlightStatCardProps {
    title: string;
    value: string | number;
}

function FlightStatCard({ title, value }: FlightStatCardProps) {
    return (
        <div className="stat-card">
            <h3>{title}</h3>
            <p>{value}</p>
        </div>
    );
}

export default FlightStatCard;