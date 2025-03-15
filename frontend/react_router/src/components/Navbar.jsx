import { Button } from "@chakra-ui/react"
import { Link, useNavigate } from "react-router-dom"
import { Outlet } from "react-router-dom"
import { Logout } from "../endpoints/api"
import { useState, useEffect } from "react"
import { useAuth } from "../contexts/useAuth"
import {AiOutlineMessage} from "react-icons/ai"
import MessagesContainer from "./MessagesContainer"
import { useMessages } from "../contexts/MessagesContext";
import { seeNewMessages } from "../endpoints/api"

export default function Navbar(){

        const {messageDisplay, setMessageDisplay, newMessages, setNewMessages} = useMessages()

        const {isAuthenticated} = useAuth()
        const backToLogin = useNavigate()

        const handleLogout=()=>{
            Logout()
            backToLogin('/login')
        }

        const handleNewMessages = async ()=>{
            try{
                const response = await seeNewMessages()
                console.log(response)
            }catch(error){
                console.log(error)
            }
        }

        const clickMessage = (e)=>{
            e.stopPropagation(); 
            setMessageDisplay(true); 
            handleNewMessages()
            setNewMessages(0)
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

        useEffect(()=>{
                    setMessageDisplay(false)}, 
            [location.pathname])

            useEffect(()=>{
                document.addEventListener('click', ()=>setMessageDisplay(false))
            }, [])

        const notAuthContent = <div className="flex gap-14 align">
        <li className="'hover:bg-slate-300 hover:text-gray-700 flex align-middle">
            
            <button className=" flex focus:outline-none hover:outline-none" onClick={(e)=>{clickMessage(e)}}>
                {<AiOutlineMessage className="text-gray-200 hover:scale-110" size={24}/>}
                <p className="text-base text-green-400 font-semibold">{newMessages}</p>
                </button>
        </li>
        <li className='hover:bg-slate-300 hover:text-gray-700 focus:outline-none hover:outline-none flex align-middle'>
            <button onClick={handleLogout}>Logout</button>
        </li>
        </div>


    return (<div className="flex flex-col">
        <nav className=' flex flex-row bg-slate-500  border-none justify-between w-full relative'>
        
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
                <ul className="text-xl text-gray-200 flex flex-row gap-2 py-4 px-4 align-middle">
                {isAuthenticated ?notAuthContent: authContent}
                </ul>
            </div>
        </nav>
        <Outlet/>
        {messageDisplay && <MessagesContainer/>}
        </div>
    )
}