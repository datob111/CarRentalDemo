import { useState } from "react";
import axios from "axios";
import { useLocations } from "../contexts/LocationsContext";

export default function AddressField({label, setLocation}){
    const [suggestions, setSuggestions] = useState([])
    const {setZoom} = useLocations()
    const apiKey = import.meta.env.VITE_ADDRESS_KEY
    const handleAddressChange = async (e) => {
		const inputValue = e.target.value;
		if (inputValue.length < 3) {
            setSuggestions([]);
            return;} 
	
		try {
			const response = await axios.get(`https://api.locationiq.com/v1/autocomplete.php?key=${apiKey}&q=${inputValue}&format=json`)
        setSuggestions(response.data)
        console.log(response.data)
        console.log(suggestions)
		} catch (error) {
            // setSuggestions([])
		  console.error("Error fetching suggestions:", error);
		}
	  };

      const handleLocationChange = (suggestion) => {
        setLocation([suggestion.lon, suggestion.lat]); 
        setSuggestions([]);
        setZoom(11);
    
        setTimeout(() => {
            setZoom(12);
        }, 1000);
    };


    return <div className=" relative">
                <label className="block text-sm text-gray-300 mb-2 ">{label.toUpperCase()}</label>
				<input type="text" className="w-full p-3 rounded-md bg-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-white" placeholder="Enter ZIP/Location"  onChange={handleAddressChange} required />        
          {suggestions.length>0 && <div className="bg-orange-200 max-h-80 overflow-scroll no-scrollbar flex flex-col gap-3 py-3 px-1 absolute w-full z-20 rounded-md top-20">
                    {suggestions.map((s, index)=>{
                        return <div key={index} onClick={()=>handleLocationChange(s)} className="bg-slate-50 rounded-lg px-2 py-2 shadow-[2px_2px_10px_1px] shadow-gray-500 bg-gradient-to-r from from-white to-slate-200">
                            <p className="text-gray-900 font-bold font-mono">{s.display_place}</p>
                            <p className="text-black">{s.display_address}</p>
                        </div>
                    })}
                </div>}      
    </div>
}