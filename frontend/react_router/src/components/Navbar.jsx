import { Button } from "@chakra-ui/react"
import { Link, useNavigate } from "react-router-dom"
import { Outlet } from "react-router-dom"
import { Logout } from "../endpoints/api"
import { useContext, useEffect } from "react"
import { useAuth } from "../contexts/useAuth"



export default function Navbar(){

        const {isAuthenticated} = useAuth()
        const backToLogin = useNavigate()
        const handleLogout=()=>{
            Logout()
            backToLogin('/login')
        }

        const authContent = <>
                    <li className='hover:bg-slate-300 hover:text-gray-700'>
                     <Link to="/login">Login</Link>
                   </li>
                   <li className='hover:bg-slate-300 hover:text-gray-700'>
                     <Link to="/register">Registration</Link>
                   </li>
        </>

        useEffect(()=>{console.log(isAuthenticated)})

        const notAuthContent = 
        <li className='hover:bg-slate-300 hover:text-gray-700'>
            <button onClick={handleLogout}>Logout</button>
        </li>


    return (<>
        <nav className=' flex flex-row bg-slate-500  border-none justify-between'>
        
            <div className="flex flex-row ">
                <ul className="text-xl text-gray-200 flex flex-row gap-4 py-4 px-4">
                <li className='hover:bg-slate-300 hover:text-gray-700'>
              <Link to="/">Home</Link>
            </li>

            <li className='hover:bg-slate-300 hover:text-gray-700'>
                <Link to="/about">About</Link>
            </li>
            {isAuthenticated && (
                <li className='hover:bg-slate-300 hover:text-gray-700'>
                <Link to="/profile">Profile</Link>
            </li>
            )}
            
            <li className='hover:bg-slate-300 hover:text-gray-700'>
                <Link to="/Cars">Cars</Link>
            </li>
                </ul>
            </div>

            <div className="flex flex-row">
                <ul className="text-xl text-gray-200 flex flex-row gap-2 py-4 px-4">
                {isAuthenticated ?notAuthContent: authContent}
                </ul>
            </div>
        
        </nav>
        <Outlet/>
        </>
    )
}