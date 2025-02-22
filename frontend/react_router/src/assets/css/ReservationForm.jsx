import './style.css'
import { useState, useEffect } from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import { CarReservation } from '../../endpoints/api'
import { useAuth } from '../../contexts/useAuth'
import { RefreshToken } from '../../endpoints/api'
import { time } from 'framer-motion'
import { getReservations } from '../../endpoints/api'
import { useCar } from '../../contexts/useCar'
import { DeleteReservation } from '../../endpoints/api'



export default function ReservationForm1({carId}){
	

	const [pickUpDate, setPickUpDate] = useState(new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16))
	const [dropOffDate, setDropOffDate] = useState(new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16))

	const [finalPickUpDate, setFinalPickUpDate] = useState(0)
	const [finalDropOffDate, setFinalDropOffDate] = useState(0)

	const {currentUser} = useAuth()
	const {cars} = useCar()
	const car = cars[carId-1]

	const [price, setPrice] = useState(0)
	const [timer, setTimer] = useState({hours: 0, minutes: 0, seconds: 0})
	const [message, setMessage] = useState(null)
	const [timerLeft, setTimLeft] = useState(null)

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
			// console.log(dropOffDate)
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
					// console.log(response)
					// // console.log(currentUser)
					// const refreshed = await RefreshToken()
					// if (refreshed){
					// 	response = await CarReservation(carId, pickUpDate, dropOffDate, price)
					// 	console.log('refreshed')
					// }
					// console.log(response)
					setMessage(response.message)
					setTimeout(()=>{setMessage(null)}, 4000)
				}else
				{
					setMessage("You have successfully booked the car!")
					setTimeout(()=>{setMessage(null)}, 4000)
					const endTime = new Date(new Date(response.data.end_date).toISOString().slice(0, 16)).getTime()
					const startTime = new Date(new Date(response.data.start_date).toISOString().slice(0, 16)).getTime()
					const now = new Date().getTime()
					const time = endTime - startTime
					console.log(startTime)
					setTimLeft(time - (now - startTime))
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
					const startTime = new Date(response.data[0].start_date).toISOString().slice(0, 16)
					const endTime = new Date(response.data[0].end_date).toISOString().slice(0, 16)
					const now = new Date().getTime()
					setTimLeft((new Date(endTime).getTime() - new Date(startTime).getTime()) - (now - new Date(startTime).getTime()))
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
			fetchReservations()
			// console.log(timerLeft)
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
			// console.log(hoursF, minutesF, seconds)
			console.log(timerLeft)
			console.log(timer)

			
			
			// console.log(timerLeft)
			// if (dropOffDate> pickUpDate){
				// setPrice(car.price * hours)
				setTimer({hours: hoursF, minutes: minutesF, seconds: seconds})
			// }
			}

			if (timer!=null &&  timerLeft > 0 && timerLeft < 1000){
				handleDeleteReservation(Number(reservationId))
				console.log('deleted')
				setMessage("Reserve is deleted successfully!")
				const timeOut = setTimeout(()=>{setMessage(null)}, 4000)
				setTimLeft(null)
			}
			// return ()=>clearTimeout(timeOut)
			
		}, [timerLeft])


		useEffect(()=>{
			if (timerLeft >= 0){
				const interval = setInterval(()=>{

						setTimLeft(prev=>prev - 1000)
				}, 1000)
				return ()=>clearInterval(interval)
			}
		}, [])


	return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg max-w-lg w-full">
                <h2 className="text-center text-3xl font-semibold text-yellow-400 mb-6">Book a Car</h2>
                <form onSubmit={handleReservation} className="space-y-4">
                    {/* <div>
                        <label className="block text-sm text-gray-300 mb-2">Phone</label>
                        <input type="tel" className="w-full p-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400" placeholder="Enter your phone number"  onChange={(e) => setPhone(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-300 mb-2 ">Pickup Location</label>
                        <input type="text" className="w-full p-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400" placeholder="Enter ZIP/Location"  onChange={(e) => setLocation(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-300 mb-2">Destination</label>
                        <input type="text" className="w-full p-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400" placeholder="Enter ZIP/Location"  onChange={(e) => setDestination(e.target.value)} required />
                    </div> */}
                    <div>
                        <label className="block text-sm text-gray-300 mb-2">Pickup Date</label>
                        <input type="datetime-local" className="w-full p-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400" min={new Date().toISOString().slice(0, 16)} value={pickUpDate} onChange={handlePickUp} required />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-300 mb-2">Dropoff Date</label>
                        <input type="datetime-local" className="w-full p-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400" min={pickUpDate} value={dropOffDate} onChange={handleDropOff} required />
                    </div>
					{timerLeft>0 && <p className='text-slate-100 font-bold'>{timer.hours}:{timer.minutes}:{timer.seconds}</p>}
                    <button type="submit" className="w-full p-3 mt-4 bg-yellow-400 text-gray-900 font-bold rounded-md hover:bg-yellow-500 transition">Book Now</button>
                    {message && <p className={`text-center ${message.startsWith('You')? "text-green-400": "text-red-400"} mt-4 text-lg`}>{message}</p>}
                </form>
            </div>
        </div>
    );
	
}

					