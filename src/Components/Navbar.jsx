import React, { useState } from "react";
import { FaSearch } from '@fortawesome/free-solid-svg-icons';


const Navbar = ({ onSearch, onSearchClick }) => {
    const [searchInput, setSearchInput] = useState("");

    const handleInputChange = (event) => {
        setSearchInput(event.target.value);
        onSearch(event.target.value);
    };

    const handleSearch = () => {
        onSearchClick();
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <img src="pokemon-logo.png" alt="Pokemon Logo" />
            </div>
            <div className="navbar-search">
                <input
                    type="text"
                    placeholder="Search by name or ID"
                    value={searchInput}
                    onChange={handleInputChange}
                />
                <button onClick={handleSearch}>send</button>
            </div>
        </nav>
    );
};

export default Navbar;
