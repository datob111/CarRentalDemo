import { useState, useContext, createContext } from "react";

export const LocationsContext = createContext(null)


export default function LocationsProvider({children}){
    const [pickUpLocation, setPickUpLocation] = useState([44.79784, 41.69563])
	const [dropOffLocation, setDropOffLocation] = useState([44.79764, 41.68513])
    const [zoom, setZoom] = useState(11)

    return <LocationsContext.Provider value={{pickUpLocation, setPickUpLocation, dropOffLocation, setDropOffLocation, zoom, setZoom}}>
            {children}
    </LocationsContext.Provider>
}


export const useLocations = ()=> useContext(LocationsContext)
