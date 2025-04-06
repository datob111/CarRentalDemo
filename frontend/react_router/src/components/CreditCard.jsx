import { useState, useEffect } from "react";
import { useAuth } from "../contexts/useAuth";
import { getUser } from "../endpoints/api";

export default function CreditCard({cardNumber, ccv, expDate}){
    return (
        <div className="flex justify-around gap-3 items-center bg-orange-400 w-fit hover:bg-orange-300 cursor-pointer py-3 px-4 rounded-md shadow-md shadow-gray-400">
             <img className="h-12 w-fit" src="https://i.ibb.co/B2vQ0xG/Card-1.jpg" />
            <div className="flex flex-col">
                <p className="text-gray-200">{cardNumber}</p>
                <p className="text-gray-50 text-lg font-bold">125.00 ₾</p>
            </div>
        </div>
    )
}