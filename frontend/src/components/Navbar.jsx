import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="navbar-icon">🍳</span>
          <span className="navbar-title">Moja Kuchnia</span>
        </Link>
        <div className="navbar-actions">
          <Link to="/" className={`navbar-link ${pathname === "/" ? "active" : ""}`}>
            Przepisy
          </Link>
          <Link to="/add" className="btn btn-primary btn-sm">
            + Nowy przepis
          </Link>
        </div>
      </div>
    </nav>
  );
}
