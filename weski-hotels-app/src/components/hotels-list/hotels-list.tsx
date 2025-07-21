import React from "react";
import { FormattedHotel } from "../search-form/search-form";

interface HotelsListProps {
    hotels: FormattedHotel[];
}

const HotelsList: React.FC<HotelsListProps> = ({ hotels }) => {
    if (hotels.length === 0) return null;

    return (
        <div className="wrapper">
            <div className="headerContainer">
                <h2 className="title">Select your ski trip</h2>
            </div>
            <div className="cardList">
                {hotels.map((hotel, index) => (
                    <div className="card" key={index}>
                        <h3>{hotel.hotel_name}</h3>
                        <p>Price: ${hotel.price}</p>
                        {hotel.rating && <p>Rating: {hotel.rating}</p>}
                        {hotel.main_image_url && (
                            <img src={hotel.main_image_url} alt={hotel.hotel_name} width={200} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HotelsList;
