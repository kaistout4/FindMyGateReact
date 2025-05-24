interface Section {
    subtitle: string;
    content: string;
}

interface AdditionalInfoProps {
    title?: string;
    sections?: Section[];
}

function AdditionalInfo({ 
    title = "Travel tips", 
    sections = [
        {
            subtitle: "Dining",
            content: "Bombuza, Blue Star, BurgerVille, Cafe Yumm!, Calliope, Capers Bistro"
        }
    ]
}: AdditionalInfoProps) {
    return (
        <section className="additional-info">
            <h2>{title}</h2>
            {sections.map((section, index) => (
                <div key={index} className="info-section">
                    <h3>{section.subtitle}</h3>
                    <p>{section.content}</p>
                </div>
            ))}
        </section>
    );
}

export default AdditionalInfo;