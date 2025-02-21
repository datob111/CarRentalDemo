import CarDetails from "../components/CarDetails"
import ReservationForm from "../components/ReservationForm"
import { useParams, useLocation } from "react-router-dom"
import ReservationForm1 from "../assets/css/ReservationForm"
import { useCar } from "../contexts/useCar"
import { useEffect } from "react"


export default function CarReservation(){

    // useEffect(()=>{console.log(cars)}, [])

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

    let InfoContainer
    try{
        InfoContainer = (
            <div>
                <img className="w-3/6 h-fit aspect-[4/3] object-cover" src={car.car_photo} alt={car.name} />
                <h2>{car.name}</h2>
                <h2>{car.brand}</h2>
                <h2>{car.description}</h2>
                <h2>{car.year}</h2>
                <h2>{car.price}</h2>
            </div>
        )
    }catch(error){
        InfoContainer = <h1>There are no car</h1>
    }
    

    return <>
    {InfoContainer}
    
    <CarDetails/>
    <ReservationForm1 carId={Number(carId)}/>
    </>
}