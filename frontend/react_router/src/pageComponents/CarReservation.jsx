import CarDetails from "../components/CarDetails"
import { useParams, useLocation } from "react-router-dom"
import ReservationForm1 from "../components/ReservationForm"
import { useCar } from "../contexts/useCar"
import { useEffect } from "react"
import LocationsProvider from "../contexts/LocationsContext"
import MapBoxMap from "../components/MapBoxMap"
import { useCards } from "../contexts/CardsContext"


export default function CarReservation(){

    // useEffect(()=>{console.log(cars)}, [])
    const {cards} = useCards()
    const {carId} = useParams()
    const location = useLocation()
    const {cars} = useCar()
    let car;
        try{
            car = cars[Number(carId-1)]
            // console.log(carId)
        }catch(error){
            console.log(error)
        }

    let InfoContainer;
    try{
        InfoContainer = (
            <div className="flex flex-col">
                 
                <div className="flex  px-5 py-3 gap-2" >
                
                <MapBoxMap/>
                <ReservationForm1 carId={Number(carId)}/>
                </div>
                <div className="flex flex-col gap-6 justify-between w-full">
                    <p className="w-3/6 text-center font-sans font-bold text-3xl text-slate-900 [text-shadow:_1px_2px_4px]">{car.name}</p>
                    <img className="w-3/6 h-fit aspect-[4/3] object-cover rounded-xl ring-2 ring-gray-500" src={car.car_photo} alt={car.name} />
                </div>
                
                <CarDetails car={car}/>
            </div>
        )
    }catch(error){
        InfoContainer = <h1>There are no car</h1>
    }
    

    return <>
    <LocationsProvider>
        {InfoContainer}
    </LocationsProvider>
    </>
}