import React, {useEffect, useRef, useState} from "react";
import "./search-form.scss";
import { io, Socket } from 'socket.io-client';
import ResortsSelect from "./resorts-select/resorts-select";
import GuestsSelect from "./guests-select/guests-select";
import SearchButton from "./search-button/search-button";
import DatePicker from 'react-datepicker';
import dayjs from 'dayjs';

export interface FormattedHotel {
    hotel_code: string;
    hotel_name: string,
    rating: number | null,
    price: number,
    main_image_url: string | null,
}
interface SearchFormProps {
    onResults: (hotels: FormattedHotel[]) => void;
    onSearchStart: () => void;
}
const SearchForm: React.FC<SearchFormProps> = ({ onResults, onSearchStart }) => {
    const [skiSiteId, setSkiSiteId] = useState<number>(1);
    const [groupSize, setGroupSize] = useState<number>(1);
    const [startDate, setStartDate] = useState<Date | null>(dayjs().toDate());
    const [endDate, setEndDate] = useState<Date | null>(dayjs().add(7, 'days').toDate());
    const [loading, setLoading] = useState(false);
    const socketRef = useRef<Socket | null>(null);
    const WS_URL = 'http://localhost:3000';

    useEffect(() => {

        const socket = io(WS_URL, {
            transports: ["websocket"],
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("Connected to Socket.io");
        });

        socket.on("result", (data: FormattedHotel[]) => {
            console.log('data', data)
            onResults(data)
        });

        socket.on("done", () => {
            setLoading(false);
        });

        socket.on("error", (err: { message: string }) => {
            console.error("Socket error:", err.message);
            setLoading(false);
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from server");
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const handleSearch = () => {
        if (!startDate || !endDate || !socketRef.current) return;

        setLoading(true);
        onSearchStart();

        socketRef.current.emit("search_hotels", {
            ski_site: skiSiteId,
            from_date: dayjs(startDate).format("MM/DD/YYYY"),
            to_date: dayjs(endDate).format("MM/DD/YYYY"),
            group_size: groupSize
        });
    };
    return (
        <div className="search-form">
            <ResortsSelect value={skiSiteId} onChange={skiSiteId => setSkiSiteId(skiSiteId)} />
            <GuestsSelect value={groupSize} onChange={groupSize => setGroupSize(groupSize)} />
            
            <DatePicker className="search-form-date-picker" selected={startDate} onChange={(date) => setStartDate(date)} enableTabLoop={false} />
            <DatePicker className="search-form-date-picker" selected={endDate} onChange={(date) => setEndDate(date)} enableTabLoop={false} />

            <SearchButton onClick={handleSearch} />

            {loading && <p>Loading hotels...</p>}


        </div>
    );
}

export default SearchForm;