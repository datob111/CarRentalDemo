import { useState, useContext, useEffect, createContext } from "react";
import { isAuth, getUser } from "../endpoints/api";
import { useLocation } from "react-router-dom";
import { RefreshToken } from "../endpoints/api";

const AuthContext = createContext()

export default function AuthProvider({children}){

    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [currentUser, setCurrentUser] = useState(null)
    const location = useLocation()

    useEffect(()=>{

        const fetchIsAuth = async ()=>{
            try{
                let response = await isAuth()
                if (!response){
                    const refreshed = await RefreshToken()
                    if (refreshed){
                        response = await isAuth()
                        console.log({'refrehed': refreshed})
                    }
                }
                setIsAuthenticated(response)
                console.log(isAuthenticated)
            }catch(error){
                console.log(error)
                setIsAuthenticated(false)
            }
        }
        fetchIsAuth()
    }, [location.pathname])

    useEffect(()=>{console.log(isAuthenticated)}, [location.pathname])

    useEffect(()=>{
        const fetchCurrentUser = async ()=>{
            try{
                const response = await getUser()
                setCurrentUser(response)
                console.log(currentUser)
            }catch{
                console.log(currentUser)
                setCurrentUser(null)
            }
        }

        fetchCurrentUser()
        !isAuthenticated && setCurrentUser(null)
    }, [isAuthenticated])

    return <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated, currentUser}}>
        {children}
    </AuthContext.Provider>

}

export const useAuth = ()=> useContext(AuthContext)