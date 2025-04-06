import { useState, useEffect, useContext, createContext } from "react";
import { getCards } from "../endpoints/api";
import { useAuth } from "./useAuth";

export const CardsContext = createContext(null)

export default function CardsProvider({children}){
    const [cards, setCards] = useState([])
    const {setCurrentUser, currentUser} = useAuth()

    const fetchCards = async ()=>{
        try{
            const response = await getCards()
            console.log(response.data)
            setCards(response.data)
        }catch(error){
            console.log(error)
        }
    }

    useEffect(()=>{
        fetchCards()
    }, [])

    useEffect(()=>{
        fetchCards()
    }, [currentUser])

    return <CardsContext.Provider value={{cards, setCards}} >
                {children}
    </CardsContext.Provider>

}

export const useCards = ()=>useContext(CardsContext)