import React from "react";
import "./nav-bar.scss";
import WeSkiLogo from "../weski-logo/weski-logo";
import SearchForm, {FormattedHotel} from "../search-form/search-form";

interface NavBarProps {
    onResults: (hotels: FormattedHotel[]) => void;
    onSearchStart: () => void;
}
const NavBar: React.FC<NavBarProps> = ({ onResults, onSearchStart }) => {


    return (
        <div className="nav-bar">
            <WeSkiLogo />
            <SearchForm onResults={onResults} onSearchStart={onSearchStart} />
        </div>
    );
}

export default NavBar;