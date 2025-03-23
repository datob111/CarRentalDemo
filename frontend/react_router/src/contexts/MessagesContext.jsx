import { useState, useRef, useEffect, createContext, useContext } from "react";
import { GetMessages, RefreshToken } from "../endpoints/api";
import { useAuth } from "./useAuth";
import messageSound from '../assets/message_sound.mp3'
import useSound from 'use-sound'
import { getUser } from "../endpoints/api";

const MessagesContext = createContext()

export default function MessagesProvider({children}){
        const {setCurrentUser, currentUser} = useAuth()
        const [messages, setMessages] = useState([])
        const [messageDisplay, setMessageDisplay] = useState(false)
        const [newMessages, setNewMessages] = useState(0)
        const [connenction, setConnection] = useState(null)
        const [play] = useSound(messageSound)
        const [shakeBell, setShakeBell] = useState(false)
        const soundRef = useRef(null)
        soundRef.current = play



        const handleMessages = async ()=>{
            try{
                const response = await GetMessages()
                setMessages(response.data)
            }catch(error){
                const refresh = await RefreshToken()
                const response = await GetMessages()
                setMessages(response.data)
                console.log(error)
            }
        }
    
        useEffect(()=>{
            handleMessages();
        }, [])

        useEffect(()=>{
            if (currentUser)
            setNewMessages(currentUser.new_messages_count)
            handleMessages();
            console.log(currentUser)
        }, [currentUser])


        useEffect(()=>{

            const fetchCurrentUser = async ()=>{
                try{
                    const response = await getUser()
                    setCurrentUser(response)
                    setNewMessages(response.new_messages_count)
                    console.log(response)
                }catch{
                    console.log(currentUser)
                }
            }
           
            const socket = new WebSocket('ws://localhost:8000/ws/live_messages/')
        
            socket.onopen = ()=>{
               console.log('opened')
            }
        
            socket.onmessage = () => {
                handleMessages()
                fetchCurrentUser()
                soundRef.current()
                setShakeBell(true)
                setTimeout(()=>{setShakeBell(false)}, 1000)
            }

            socket.onclose = ()=>{
                console.log('closed')
            }
        
            
            setConnection(socket)
        
            return ()=>{socket.close()}
        }, [])

    return <MessagesContext.Provider value={{messages, setMessages, messageDisplay, setMessageDisplay, 
                                            newMessages, setNewMessages, shakeBell, setShakeBell}}>
        {children}
    </MessagesContext.Provider>
}


export const useMessages = ()=> useContext(MessagesContext)