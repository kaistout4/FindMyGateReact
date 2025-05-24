import { NavLink } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';

function Navigation() {
    return (
        <nav className="navigation">
            <span className="nav-logo">Flight Tracker</span>
            <div className="nav-right">
                <ul className="nav-links">
                    <li>
                        <NavLink 
                            to="/" 
                            className={({ isActive }) => 
                                isActive ? "nav-link active" : "nav-link"
                            }
                        >
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink 
                            to="/history" 
                            className={({ isActive }) => 
                                isActive ? "nav-link active" : "nav-link"
                            }
                        >
                            Flight History
                        </NavLink>
                    </li>
                </ul>
                <DarkModeToggle />
            </div>
        </nav>
    );
}

export default Navigation;