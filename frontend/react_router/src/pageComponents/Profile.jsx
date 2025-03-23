import { useState, useEffect, useRef } from "react"
import { useAuth } from "../contexts/useAuth"
import { updateProfilePhoto } from "../endpoints/api"
import { getUser } from "../endpoints/api"
import { FaPhone  } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import UpdateUserField from "../components/UpdateUserField";
import ImageUPdateForm from "../components/ImageUpdateForm";
import CreditCard from "../components/CreditCards";


export default function Profile(){
    const {currentUser, setCurrentUser} = useAuth()

    const handleUpdateUser = async ()=>{
        try{
            const response = await getUser()
            setCurrentUser(response)
            console.log(currentUser)
        }catch{
            console.log(currentUser)
        }
    }

    return <>
        <div className="">
                   {
                   currentUser && 
                <div>
                    <ImageUPdateForm/>
                    <div>
                    <UpdateUserField Icon={MdEmail} field={'email'} type={'email'} fieldKey='email'/>
                    <UpdateUserField Icon={FaPhone} field={'phone_number'} type={'number'} filedKey='phone_number'/>
                    </div>
                </div>
                   }
                   <CreditCard/>
        </div>

        <div>
            <h1>current reservation</h1>
            <h1>reservations</h1>

        </div>
    </>
}