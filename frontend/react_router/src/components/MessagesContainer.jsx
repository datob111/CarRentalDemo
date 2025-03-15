import { useState, useEffect } from "react";
import Message from "./Message";
import { IoCloseCircle } from "react-icons/io5";
import { useMessages } from "../contexts/MessagesContext";

export default function MessagesContainer(){
    const {messages, setMessageDisplay} = useMessages()


    return <div  onClick={e=>e.stopPropagation()} className="absolute right-0 top-16 z-20 bg-slate-200 h-[600px] gap-32 rounded-l-lg" >
        <div className="flex justify-end px-2 pt-3">
            {<IoCloseCircle className="text-indigo-900 cursor-pointer hover:scale-105" size={28} onClick={()=>{setMessageDisplay(false)}}/>}
        </div>
        <div className="h-[550px] overflow-scroll no-scrollbar flex flex-col gap-4 px-2 py-4">
            {messages.map((message, index)=>{
                return <Message  key={index} messageText={message.message} date={message.date}/>
            })}
        </div>
    </div>
}