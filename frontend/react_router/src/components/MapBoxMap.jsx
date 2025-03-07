import { useEffect, useRef, useContext } from "react";
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { LocationsContext } from "../contexts/LocationsContext";

export default function MapBoxMap(){

    const apiKey = import.meta.env.VITE_MAPBOX_API_KEY
    const mapRef = useRef()
    const mapContainerRef = useRef()
    const markerRef = useRef()
    const markerRef2 = useRef()

        const {pickUpLocation} = useContext(LocationsContext)
        const {dropOffLocation} = useContext(LocationsContext)
        const {zoom} = useContext(LocationsContext)

    useEffect(() => {
        console.log(pickUpLocation)
        mapboxgl.accessToken = apiKey
        mapRef.current = new mapboxgl.Map({
          container: mapContainerRef.current,
          center: pickUpLocation,
          zoom: zoom,
          
        });
    
            markerRef.current = new mapboxgl.Marker({draggable: true, color: 'green'}).setLngLat(pickUpLocation).addTo(mapRef.current)
            markerRef2.current = new mapboxgl.Marker({draggable: true, color: 'red'}).setLngLat(dropOffLocation).addTo(mapRef.current)
    
        return () => {
          mapRef.current.remove()
        }
      }, [pickUpLocation, dropOffLocation])

      useEffect(()=>{
        mapRef.current.setZoom(zoom)
      }, [zoom])


      return <div  className='h-72 rounded-lg w-4/6 mx-auto' id='map-container' ref={mapContainerRef}></div>
}