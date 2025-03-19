import { useNavigate, Link } from "react-router-dom"
import { useEffect } from "react"


export default function CarCard({id, name, brand, description, release_year, price, is_rented, car_image, bookingHandler}){

        const navigate = useNavigate()
        const state = {id, name, brand, description, release_year, price, is_rented, car_image}
    
   
    const formatedPrice = new Intl.NumberFormat('en-IN', 
        {
            currency: 'USD', 
            minimumIntegerDigits: 2,
            style: 'currency',
        }
    ).format(price)
    return (<div className='flex-col flex-wrap bg-slate-400 font-bold px-6 py-3 border-2 border-r-emerald-100 cursor-pointer'>

        <img className="border-2 border-red-300 w-fit h-fit aspect-[4/3] object-cover" src={car_image} alt="" />

        <div className="flex flex-col  gap-2 border-2 border-r-emerald-100 py-3 px-10 bg-gray-300 text-slate-700">
                <div className='flex flex-row'>
                    <h5> <span className="text-gray-500">Name:</span> {name}</h5>
                </div>

                <div className='flex flex-col gap-2'>
                    <p><span className="text-gray-500">Year: </span>  {release_year}</p>
                    <p><span className="text-gray-500">Price per hour:</span> {formatedPrice}</p>
                </div>
            <div className="flex justify-between" >
                <Link to={`/cars/reservation/${id}`} state={state} className="bg-amber-600  text-yellow-50 py-2 px-3 rounded-xl focus:border-none focus:outline-none">See more details</Link>
                {/* <button  onClick={()=>{navigate(`/reservation/${id}`, {state})}}  className="bg-amber-600  text-yellow-50 py-2 px-3 rounded-xl focus:border-none focus:outline-none">See more details</button> */}
                <button  className={` text-xl ${is_rented? 'bg-gray-500': 'bg-teal-600'}  text-yellow-50 py-2 px-5 focus:outline-none"`}
                disabled={is_rented} onClick={()=>{bookingHandler()}}>{is_rented? 'rented': 'hire'}</button>
            </div>
        </div>

        </div>
    )
}
