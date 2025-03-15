import '../assets/css/style.css'
import { useState, useEffect, useRef, useContext } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { LocationsContext } from '../contexts/LocationsContext'
import MapBoxMap from './MapBoxMap'
// import ReactMapGl, {Marker} from 'react-map-gl'
import axios from 'axios'


// import { LocalizationProvider } from '@mui/x-date-pickers'
// import { DatePicker } from '@mui/x-date-pickers'
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
// import dayjs from 'dayjs'
// import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import { CarReservation } from '../endpoints/api'
import { useAuth } from '../contexts/useAuth'
import { RefreshToken } from '../endpoints/api'
// import { time } from 'framer-motion'
import { getReservations } from '../endpoints/api'
import { useCar } from '../contexts/useCar'
import { DeleteReservation } from '../endpoints/api'
import AddressField from './AddressField'



export default function ReservationForm1({carId}){
	
	const [currentTime, setCurrentTime] = useState(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
	const [pickUpDate, setPickUpDate] = useState(new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16))
	const [dropOffDate, setDropOffDate] = useState(new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16))

	const {cars} = useCar()
	const car = cars[carId-1]

	const [price, setPrice] = useState(0)
	const [bookTimer, setBookTimer] = useState({hours: 0, minutes: 0, seconds: 0})
	const [timer, setTimer] = useState({hours: 0, minutes: 0, seconds: 0})
	const [message, setMessage] = useState(null)
	const [timerLeft, setTimerLeft] = useState(null)
	const [timeToBook, setTimeToBook] = useState(null)

	const {setPickUpLocation} = useContext(LocationsContext)
	const {setDropOffLocation} = useContext(LocationsContext)

	const [reservationId, setReservationId] = useState(null)

	const {isAuthenticated} = useAuth()
	const {setIsAuthenticated} = useAuth()

		const handlePickUp = (e)=>{
			setPickUpDate(e.target.value)
			if (e.target.value>dropOffDate)
			setDropOffDate(e.target.value)
			console.log(car)
		}

		const handleDropOff = (e)=>{
			setDropOffDate(e.target.value)
		}

		const handleReservation =  async (e)=> {
			try{
				e.preventDefault()
				let response = await CarReservation(carId, pickUpDate, dropOffDate, price)

				if (response.code == 'token_not_valid'){
					const refreshed = await RefreshToken()
					if (refreshed){
						response = await CarReservation(carId, pickUpDate, dropOffDate, price)
						console.log('refreshed')
						setIsAuthenticated(true)
					}else{
						setIsAuthenticated(true)
					}
				}
				
				if (response.message !=null){
					setMessage({text: response.message, color: 'text-red-500'})
					setTimeout(()=>{setMessage(null)}, 4000)
				}else
				{
					setMessage({text: "You have successfully booked the car!", color: 'text-green-500'})
					setTimeout(()=>{setMessage(null)}, 4000)
					let endTime = new Date(response.data.end_date);
					const offsetEnd = endTime.getTimezoneOffset() * 60000; // Offset in milliseconds
					endTime = new Date(new Date(endTime - offsetEnd).toISOString().slice(0, 16)).getTime();
					let startTime = new Date(response.data.start_date)
					const offsetStart = startTime.getTimezoneOffset() * 60000
					startTime = new Date(new Date(startTime - offsetStart).toISOString().slice(0, 16)).getTime();
					const now = new Date().getTime()
					const time = endTime - startTime
					console.log(endTime, startTime, new Date())
					console.log(now)
					setTimerLeft(time - (now - startTime))
					console.log(time - (now - startTime))
					if (startTime > now){
						setTimeToBook(startTime - now)
						console.log(startTime - now)
					}
					setReservationId(response.data.id)
				}
			}catch(error){
				console.log({'error': error})
				console.log(isAuthenticated)
			}

		}

		const fetchReservations = async ()=>{
			try{
				const response = await getReservations(carId)
				console.log(response.data[0].id)
				
				if (response.data != []){
					let endTime = new Date(response.data[0].end_date);
					const offsetEnd = endTime.getTimezoneOffset() * 60000; // Offset in milliseconds
					endTime = new Date(new Date(endTime - offsetEnd).toISOString().slice(0, 16)).getTime();
					let startTime = new Date(response.data[0].start_date)
					const offsetStart = startTime.getTimezoneOffset() * 60000
					startTime = new Date(new Date(startTime - offsetStart).toISOString().slice(0, 16)).getTime();
					const now = new Date().getTime()
					setTimerLeft((new Date(endTime).getTime() - new Date(startTime).getTime()) - (now - new Date(startTime).getTime()))
					if (new Date(startTime).getTime() > now){
						setTimeToBook(new Date(startTime).getTime() - now)
					}
					setReservationId(response.data[0].id)
				}
			}catch(error){
				console.log(error) 
				console.log(isAuthenticated)
			}
		}

		const handleDeleteReservation = async (pk)=>{
			try{
				const response = await DeleteReservation(pk)
				console.log(response)
			}catch(error){
				console.log(error)
			}
		}

		useEffect(()=>{
			const interval = setInterval(()=>{setCurrentTime(prev=>prev+60000)}, 60000)
			return ()=>{clearInterval(interval)}
		}, [])

		useEffect(()=>{
			fetchReservations()
		}, [])


		useEffect(()=>{
			const d = new Date(dropOffDate).getTime()
			const p = new Date(pickUpDate).getTime()
			const hours = d-p
			hours>0 && setPrice(hours * car.price)
		}, [pickUpDate, dropOffDate])

		useEffect(()=>{
			if (timerLeft>=0){
			const hours = timerLeft/3600000
			const hoursF = Math.floor(hours)
			const minutes = (hours - hoursF) * 60
			const minutesF = Math.floor(minutes)
			const seconds = Number(((minutes- minutesF) * 60).toFixed(0))
			console.log(timerLeft)
			console.log(timer)

				setTimer({hours: hoursF, minutes: minutesF, seconds: seconds})
			}

			if (timer!=null &&  timerLeft > 0 && timerLeft < 1000){
				handleDeleteReservation(Number(reservationId))
				console.log('deleted')
				setMessage({text: "Reservation is deleted successfully!", color: 'text-orange-500'})
				const timeOut = setTimeout(()=>{setMessage(null)}, 4000)
				setTimerLeft(null)
			}
			// return ()=>clearTimeout(timeOut)
			
		}, [timerLeft])


		useEffect(()=>{
			if (timeToBook>=0){
				const hours = timeToBook/3600000
				const hoursF = Math.floor(hours)
				const minutes = (hours - hoursF) * 60
				const minutesF = Math.floor(minutes)
				const seconds = Number(((minutes- minutesF) * 60).toFixed(0))
				console.log(timeToBook)
				console.log(bookTimer)
					setBookTimer({hours: hoursF, minutes: minutesF, seconds: seconds})
				}
	
				if (bookTimer!=null &&  timeToBook > 0 && timeToBook < 1000){
					setMessage({text: "Reservation is activated successfully!", color: 'text-green-500'})
					const timeOut = setTimeout(()=>{setMessage(null)}, 4000)
					setTimeToBook(null)
				}
		}, [timeToBook])


		useEffect(()=>{
			if (timerLeft >= 0){
				const interval = setInterval(()=>{
						setTimerLeft(prev=>prev - 1000)
				}, 1000)
				return ()=>clearInterval(interval)
			}
		}, [])

		useEffect(()=>{
			if (timeToBook >= 0){
				const interval = setInterval(()=>{
						setTimeToBook(prev=>prev - 1000)
				}, 1000)
				return ()=>clearInterval(interval)
			}
		}, [])



	return (
            <div className="bg-gray-800 p-8 rounded-xl shadow-[5px_5px_17px_1px] shadow-gray-800  max-w-lg w-full">
                <h2 className="text-center text-3xl font-semibold text-gray-200 mb-6">Book a Car</h2>
                <form onSubmit={handleReservation} className="space-y-4">
				<AddressField label={"Pickup Location"} setLocation = {setPickUpLocation}/>
				<AddressField label={"DropOff Location"} setLocation = {setDropOffLocation}/>
                    <div>
                        <label className="block text-sm text-gray-200 mb-2">Pickup Date</label>
                        <input type="datetime-local" className="w-full p-3 rounded-md bg-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-white" min={new Date(currentTime).toISOString().slice(0, 16)} value={pickUpDate} onChange={handlePickUp} required />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-200 mb-2">Dropoff Date</label>
                        <input type="datetime-local" className="w-full p-3 rounded-md bg-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-white" min={pickUpDate} value={dropOffDate} onChange={handleDropOff} required />
                    </div>
					{(timerLeft>0 && timeToBook<=0)&& <p className={timer.hours>=1? 'text-green-700': 'text-orange-600'}>{timer.hours}:{timer.minutes}:{timer.seconds}</p>}
					{timeToBook>0 && <p className='text-slate-100 font-bold'>The reservation will be active in {bookTimer.hours}:{bookTimer.minutes}: {bookTimer.seconds}</p>}
                    <button type="submit" className="w-full p-3 mt-4 bg-slate-300 text-amber-600 text-xl font-bold rounded-md focus:outline-none 
					hover:bg-amber-600 hover:text-slate-300 hover:outline-none transition focus:ring-offset-0 ">Book Now</button>
                    {message && <p className={`text-center ${message.color} mt-4 text-lg`}>{message.text}</p>}
                </form>
            </div>
    );
	
}

					