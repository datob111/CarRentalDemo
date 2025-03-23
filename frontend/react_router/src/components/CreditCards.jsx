import { useState, useEffect } from "react";
import { getUser } from "../endpoints/api";
import { useAuth } from "../contexts/useAuth";
import { FaCreditCard } from "react-icons/fa";

export default function CreditCard(){
    return (
              <div className="flex items-center">
                <h1 className="flex"><FaCreditCard/> credit cards</h1>
                <button className="rounded-md bg-orange-700 cursor-pointer hover:bg-orange-600 text-slate-200 px-3 py-2 text-base font-bold focus-within:outline-none">ADD</button>
            </div>
    )

}