import { useState, useEffect, createContext, useContext } from "react";
import { GetMessages } from "../endpoints/api";
import { useAuth } from "./useAuth";

const MessagesContext = createContext()

export default function MessagesProvider({children}){
        const {currentUser} = useAuth()
        const [messages, setMessages] = useState([])
        const [messageDisplay, setMessageDisplay] = useState(false)
        const [newMessages, setNewMessages] = useState(0)
        const [length, setLength] = useState(0)

        const handleMessages = async ()=>{
            try{
                const response = await GetMessages()
                setMessages(response.data)
                setLength(response.data.length)
                console.log(response.data)
            }catch(error){
                console.log(error)
            }
        }
    
        useEffect(()=>{
            handleMessages()
        }, [])

        useEffect(()=>{
            if (currentUser)
            setNewMessages(currentUser.new_messages_count)
        }, [currentUser])

    return <MessagesContext.Provider value={{messages, setMessages, messageDisplay, setMessageDisplay, newMessages, setNewMessages}}>
        {children}
    </MessagesContext.Provider>
}


export const useMessages = ()=> useContext(MessagesContext)