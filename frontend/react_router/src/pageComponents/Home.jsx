import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { getPayment } from "../endpoints/api";
import { useAuth } from "../contexts/useAuth";

export default function Home() {
    const [userData, setUserData] = useState([]);
    const navigate = useNavigate();
    const {currentUser} = useAuth()
    let useContent;

    if (currentUser){
        useContent = <>
            <div className="">
                <img className="h-96 w-96 object-cover" src={currentUser.profile_photo} alt={currentUser.first_name} />
            </div>
            <div>
                <p>{currentUser.first_name} {currentUser.last_name}</p>
            </div>
        </>
    }else{
        useContent = <h1 className="text-red-900 text-2xl ">No Active User</h1>
    }

     async function fetchData() {
        try{
            const response = await getPayment()
            
            console.log(response) 
            try{
                setUserData([...response.data])
            }catch(error){
                throw error
            }
            
        }catch(error){
            console.log({error: error})
        }
    }


    useEffect(() => {
        fetchData();
    }, []);

 

    return (
        <>
            {useContent}
            <h1>Home Page</h1>
            <button onClick={() => navigate("/cars")}>Cars</button>

            {userData.length > 0 ? (
                userData.map(data => (
                    <div key={data.id}>
                        <h2>{data.amount}</h2>
                        <p>{data.date}</p>
                    </div>
                ))
            ) : (
                <p>Loading or no payment data available.</p>
            )}
        </>
    );
}
