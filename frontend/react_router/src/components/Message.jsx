 import { useStat, useEffect } from "react";
 
 export default function Message({messageText, date, type}){

return <div className="w-96 flex flex-col gap-3 px-5 py-2 bg-slate-500 text-gray-300 rounded-xl cursor-pointer">
            <span>{messageText}</span>
            <p className="font-bold">{date}</p>
    </div>

}