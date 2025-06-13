import alaskaLogo from '../../../assets/alaska.png';
import deltaLogo from '../../../assets/delta.png';
import jetblueLogo from '../../../assets/jetblue.png';
import unitedLogo from '../../../assets/united.png';

export function getAirlineLogo(flightNumber: string): string | null {
    if (!flightNumber) return null;
    
    const airlineName = flightNumber.toLowerCase();
    
    if (airlineName.includes('united')) {
        return unitedLogo;
    } else if (airlineName.includes('delta')) {
        return deltaLogo;
    } else if (airlineName.includes('alaska')) {
        return alaskaLogo;
    } else if (airlineName.includes('jetblue')) {
        return jetblueLogo;
    }
    
    return null;
}