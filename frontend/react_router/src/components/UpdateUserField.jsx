import { useState, useEffect } from "react"
import { getUser } from "../endpoints/api"
import { useAuth } from "../contexts/useAuth"
import { updateUserField } from "../endpoints/api"

export default function UpdateUserField({field, Icon, type, fieldKey}){

    const {currentUser, setCurrentUser} = useAuth()
    const [buttonText, setButtonText] = useState('Edit')
    const [fieldValue, setFieldValue] = useState(null)

       const handleUpdateUser = async ()=>{
            try{
                const response = await getUser()
                setCurrentUser(response)
                console.log(currentUser)
            }catch{
                console.log(currentUser)
            }
        } 

        const handleFieldValue = (e)=>{
            e.target.value != field && setFieldValue(e.target.value)
        }

        const handleClick = async (e)=>{
            e.preventDefault()
            setButtonText(prev=> prev == 'Edit'? 'Save': 'Edit')
             try{
                if (buttonText == 'Save'  && fieldValue){
                    const response = await updateUserField(currentUser.id, fieldKey, fieldValue)
                    handleUpdateUser()
                        console.log(fieldValue)
                        console.log(e.target.value)
                            }
            }catch(error){
                    console.log(error)
                    console.log(fieldValue)
            }
        }

        useEffect(()=>{
            handleUpdateUser()
        }, [])


    return (
        
        <form className="flex gap-3 w-fit items-center">
            {Icon && <Icon className="align-text-bottom"/> }
            <input disabled={buttonText == 'Edit'? true: false} className="outline-none focus:outline-none bg-transparent focus:bg-transparent " type={type} defaultValue={fieldValue|| currentUser[field]} onChange={handleFieldValue}/>
            <button onClick={handleClick} className="rounded-md bg-orange-700 cursor-pointer hover:bg-orange-600 text-slate-200 px-3 py-2 text-base font-bold focus-within:outline-none">{buttonText}</button>
        </form>
    )
}