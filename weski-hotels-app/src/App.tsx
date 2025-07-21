import React, {useState} from 'react'
import NavBar from './components/navbar/nav-bar'
import HotelsList from "./components/hotels-list/hotels-list.tsx";
import {FormattedHotel} from "./components/search-form/search-form.tsx";

const App: React.FC = () => {
    const [hotels, setHotels] = useState<FormattedHotel[]>([]);

    const handleNewResults = (newHotels: FormattedHotel[]) => {
        setHotels((prev) => [...prev, ...newHotels]);
    };

    const handleSearchStart = () => {
        setHotels([]);
    };

    return (
        <div className='app'>
            <NavBar
                onResults={handleNewResults}
                onSearchStart={handleSearchStart}
            />
            <HotelsList hotels={hotels} />
        </div>
    );
};


export default App
