import { useState, useEffect, useRef } from "react"
import { useMessages } from "../contexts/MessagesContext"
import useSound from 'use-sound'
import sound from '../assets/message_sound.mp3'


export default function Profile(){
    const [textFromSocket, setTextFromSocket] = useState('get text from socket')
    const [connenction, setConnection] = useState(null)
    const {setNewMessages} = useMessages()
    const [play] = useSound(sound)
    const soundRef = useRef(null)
    soundRef.current = play

// useEffect(()=>{
//     const socket = new WebSocket('ws://localhost:8000/ws/live_messages/')
//     soundRef.current()

//     socket.onopen = ()=>{
//         setTextFromSocket('opened')
//     }

//     socket.onmessage = (e) => {
//         const result = JSON.parse(e.data);
//         console.log(result)
//         setTextFromSocket(result.date)
//         setNewMessages(prev=>prev+1)
//         soundRef.current()
//     }

    
//     setConnection(socket)

//     return ()=>{socket.close()}
// }, [])

    const handleSocket = (e)=>{
        if (e.target.value.length > 3){
            connenction.send(JSON.stringify({'message': e.target.value}))


        }
    }




    return <>
    <h1>Profile</h1>
    <div>
        <input  type="text" name="" id=""  placeholder="send to socket"/>
        <h1>{textFromSocket}</h1>

    </div>

    </>
}