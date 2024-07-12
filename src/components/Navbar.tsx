import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const NavBar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <Link to="/">Recipe App</Link>
      </div>
      <ul className="navbar__links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/add-recipe">More Recipe Add</Link></li>
        <li><Link to="/menu">Menu</Link></li>
        <li><Link to="/recipe-list">Recipe List</Link></li>
      </ul>
    </nav>
  );
};

export default NavBar;
