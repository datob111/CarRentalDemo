import { useState, useEffect } from "react";
import { getUser } from "../endpoints/api";
import { useAuth } from "../contexts/useAuth";
import { FaCreditCard } from "react-icons/fa";
import CreditCard from "./CreditCard";
import CreditCardForm from "./CreditCardForm";
import { useCards } from "../contexts/CardsContext";
import { cardClasses } from "@mui/material";

export default function CreditCardSection(){
    const [displayForm, setDisplayForm] = useState(false)
    const {cards} = useCards()
    const [displayCards, setDisplayCards] = useState(null)
    const [seeText, setSeeText] = useState("See more...")


    const handleCardsDisplay = (e)=>{
        e.preventDefault()
        setSeeText(prev=>prev == "See more..."? "See less...": "See more...")
    }

    const handleAddButton = ()=>{
        setDisplayForm(true)
    }

    return (
            <div>
                <div className="flex items-center">
                   <h1 className="flex"><FaCreditCard/> credit cards</h1>
                   <button onClick={handleAddButton} className="rounded-md bg-orange-700 cursor-pointer hover:bg-orange-600 text-slate-200 px-3 py-2 text-base font-bold focus-within:outline-none">ADD</button>
               </div>

               <div className="flex flex-col gap-3 items-start">
               {
                (cards.length<=3 || seeText=="See less...") ?cards.map(card=>{
                    return <CreditCard key={card.id} cardNumber={card.card_number} ccv={card.ccv} expDate={card.expiry_date}/>
                   }): cards.slice(0, 3).map(card=>{
                    return <CreditCard key={card.id} cardNumber={card.card_number} ccv={card.ccv} expDate={card.expiry_date}/>
                   })
               }
               {cards.length > 3 && <button onClick={handleCardsDisplay}>{seeText}</button>}
               </div>

               
               {displayForm && <CreditCardForm handleDisplay={setDisplayForm}/>}
            </div>
    )

}