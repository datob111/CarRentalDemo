import { useState, useEffect } from "react"
import axios from "axios"
import { GetMessages } from "../endpoints/api"
import Message from "../components/Message"

export default function Profile(){


    const [messages, setMessages] = useState([])

    const handleMessages = async ()=>{
        try{
            const response = await GetMessages()
            setMessages(response.data)
            console.log(response.data)
        }catch(error){
            console.log(error)
        }
    }

    useEffect(()=>{
        handleMessages()
    }, [])


    return <>
<h1>Profile</h1>
    </>
}