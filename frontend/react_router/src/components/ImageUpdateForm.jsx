import { useState, useEffect } from "react";
import { getUser } from "../endpoints/api";
import { useAuth } from "../contexts/useAuth";
import { updateProfilePhoto } from "../endpoints/api";

export default function ImageUPdateForm(){
    const {currentUser, setCurrentUser} = useAuth()
    const [file, setFile] = useState(null)
    const [encripted, setEncripted] = useState(null)
    
        const handlePhotoUpdate = (e)=>{
            setFile(e.target.files[0])
            setEncripted(URL.createObjectURL(e.target.files[0]))
            console.log(e.target.files[0])
        }
    
        const handleUpdateUser = async ()=>{
            try{
                const response = await getUser()
                setCurrentUser(response)
                console.log(currentUser)
            }catch{
                console.log(currentUser)
                // setCurrentUser(null)
            }
        }
    
        const handleSubmit = async (e)=>{
            try{
                e.preventDefault()
                if (file){
                    const response = await updateProfilePhoto(file)
                    console.log(response)
                    handleUpdateUser()
                    setFile(null)
                }
            }catch(error){
                console.log(error)
            }
    
        }

    useEffect(()=>{
        handleUpdateUser()
    }, [])

    return (
        <form className="flex items-baseline" action="" onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="flex flex-col ">
                <img className="rounded-full h-32 w-32 object-cover" src={encripted || currentUser.profile_photo} alt="" />
                <h1 className="font-semibold text-gray-800 text-lg">{currentUser.first_name} {currentUser.last_name}</h1>
            </div>
            <div className="h-fit flex">
                <input className="bg-slate-200  font-semibold text-slate-900 flex justify-center file:border-0 rounded-md file:p-2 
                    file:mr-4 file:bg-slate-800 file:text-slate-200 file:hover:bg-slate-700 file:font-medium" 
                    type="file"  accept="image/png, image/jpeg"  placeholder="update profile photo" onChange={handlePhotoUpdate}/>
                <input className="rounded-md bg-orange-800 cursor-pointer hover:bg-orange-700 text-slate-200 px-3 py-2 text-base font-bold" type="submit" name="" id="" value="save image" />
            </div>
            
        </form>
    )

}