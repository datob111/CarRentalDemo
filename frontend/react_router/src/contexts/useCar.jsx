import { useState, useContext, useEffect, createContext } from "react";
import { isAuth, getUser } from "../endpoints/api";
import { useLocation } from "react-router-dom";
import { RefreshToken } from "../endpoints/api";
import { getCars } from "../endpoints/api";


const CarContext = createContext()

export default function CarProvider({children}){
    const [cars, setCars] =useState([])

    async function fetchData() {
        try{
            const response = await getCars()
            try{
                setCars([...response.data])
            }catch(error){
                throw error
            }
        }catch(error){
            console.log({error: error})
        }
    }

    useEffect(()=>{
        fetchData()
    }, [])

    return <CarContext.Provider value={{cars}}>
                {children}
            </CarContext.Provider>
}


export const useCar = ()=>useContext(CarContext)