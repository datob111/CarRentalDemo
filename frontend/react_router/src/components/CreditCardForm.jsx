import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/useAuth";
import { getUser } from "../endpoints/api";
import CreditCardLabelInput from "./CreditCardLabelInput";
import '../assets/css/creditCardForm.css'
import { addCard } from "../endpoints/api";

export default function CreditCardForm({handleDisplay}){

    const ccvRef = useRef()
    const cardNumberRef = useRef()
    const expDateRef = useRef()
    const postalCodeRef = useRef()
    const cardHolderRef = useRef()

    const closeHandler = (e)=>{
        e.preventDefault()
        handleDisplay(false)
    }

    const submitHandler = async (e)=>{
        e.preventDefault()
        try{
            const response = await addCard(ccvRef.current.value, `20${String(expDateRef.current.value).substring(2)}-${String(expDateRef.current.value).slice(0, 2)}-01`, cardNumberRef.current.value, postalCodeRef.current.value, cardHolderRef.current.value);
        }catch(e){
            console.log(e)
        }
    } 

    return (
        <div className="p-24 bg-slate-100 flex flex-col items-center justify-between">
            <form action="" onSubmit={submitHandler} className="bg-white w-full max-w-3xl mx-auto px-6 py-8 shadow-md rounded-md flex">
                <div className="w-1/2 pr-8 border-r-2 border-slate-300">
                   <CreditCardLabelInput label={"card number"} type={'number'} refP={cardNumberRef}/>
                      <div className="flex gap-x-2 mb-4 mt-4 w-full">
                        <CreditCardLabelInput label={"Exp. date"} type={'number'} flex1={true} refP={expDateRef}/>
                        <CreditCardLabelInput label={"CCV"} type={'number'} flex1={true} refP={ccvRef}/>
                      </div>
                      <div className="flex gap-x-2 mb-4 mt-4 w-full">
                      <CreditCardLabelInput label={"Card holder"} type={'text'} refP={cardHolderRef} flex1={true}/>  
                      <CreditCardLabelInput label={"Postal Code"} type={'number'} refP={postalCodeRef} flex1={true}/>  
                      </div>
                   <input className="rounded-md bg-orange-800 cursor-pointer hover:bg-orange-700 text-slate-200 px-3 py-2 text-base font-bold" type="submit" name="" id="" value={"Add the card"}/>
                   <button onClick={closeHandler}>close</button>
                </div > 
                {/* <div className="w-1/2 pl-8 bg-orange-700 h-56" style={{perspective: "1000px"}}>
                    <div className="w-full">
                        <div className="relative cursor-pointer transition-transform duration-500" style={{transformStyle: "preserve-3d"}}>
                        <div className="swap backface w-full m-auto rounded-xl shadow-2xl absolute"
                            style={{backfaceVisibility: "hidden"}}>
                            <img className="z-0" src="https://i.ibb.co/B2vQ0xG/Card-1.jpg" />
                        </div>
                        <div className="w-full m-auto rounded-xl shadow-2xl absolute"
                            style={{backfaceVisibility: "hidden", transform: "rotateY(180deg)"}}>
                            <img className="creditCard z-2" src="https://i.ibb.co/ThGc8mn/Card-2.jpg" />
                        </div>
                        <img className="creditCard" src="https://i.ibb.co/ThGc8mn/Card-2.jpg" />
                        </div>
                    </div>
                </div>          */}
            </form>
        </div>
    )
}