import { Button, VStack, FormControl, FormLabel, Input, FormErrorMessage } from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import { Login as login, RefreshToken} from '../endpoints/api';
import { useNavigate } from 'react-router-dom';
import {useCookies} from 'react-cookie'
import { useAuth } from '../contexts/useAuth';
import { Register as Registration } from '../endpoints/api';

export default function Register(){

    const navigate = useNavigate()
    const {isAuthenticated} = useAuth()
    const [data, setData] = useState({firstName: '', 
        lastName: '', 
        email: '', 
        password1: '', 
        password2: '', 
        phoneNumber: '', 
        cardNumber: ''})

        const [messages, setMessages] = useState([])

        const handleLogin = async ()=>{
            try{
                await login(data.email, data.password1)

                console.log(document.cookie)
                
                navigate('/home')
    
                
            }catch(error){
                console.log(error)
            }
            
        }



    const handleRegister = async(e)=>{
        e.preventDefault()
        const response = await Registration(data.firstName, data.lastName, data.email, 
            data.password1, data.password2, data.phoneNumber, data.cardNumber)
            if (response.errors){
                const errors = Object.entries(response.errors) || []
                setMessages(errors)
            }else{
                setMessages(null)
            }
        
        response == true  && handleLogin()
    }

    

    if (isAuthenticated){
        navigate('/home')
    }

    useEffect(()=>{
        console.log(messages)
    }, [messages])



    return (
        <form className='m-auto w-fit my-8' action="" onSubmit={handleRegister}>
        <VStack className='w-80 flex flex-col bg-slate-300 py-3 px-4 align-top'>


            {messages && messages.map((message, index)=>{
                return <h2 key={index}>{message[1][0]}</h2>
            })}

        <FormControl>
                <FormLabel className='text-slate-700'>First Name</FormLabel>
                <Input onChange={e=>setData(prev=>
                    ({
                        ...prev,
                         firstName: e.target.value
                        })
                )} type='text' color={'gray.500'} value={data.firstName} required/>
            </FormControl>
            <FormControl>
                <FormLabel className='text-slate-700'>Last Name</FormLabel>
                <Input onChange={e=>setData(prev=>
                    ({
                        ...prev,
                        lastName: e.target.value
                    })
                )} type='text'color={'gray.500'} value={data.lastName} required/>
            </FormControl>

              <FormControl>
                <FormLabel className='text-slate-700'>Email address</FormLabel>
                <Input onChange={e=>setData(prev=>
                    ({
                        ...prev,
                        email: e.target.value
                    })
                )} type='email' value={data.email} color={'gray.500'} required/>
            </FormControl>
            <FormControl>
                <FormLabel className='text-slate-700'>Password</FormLabel>
                <Input onChange={e=>setData(prev=>
                    ({
                        ...prev,
                        password1: e.target.value
                    })
                )} type='password' value={data.password1} color={'gray.500'} required/>
            </FormControl>
            <FormControl>
                <FormLabel className='text-slate-700'>Repeat Password</FormLabel>
                <Input onChange={e=>setData(prev=>
                    ({
                        ...prev,
                        password2: e.target.value
                    })
                )} type='password' value={data.password2} color={'gray.500'} required/>
            </FormControl>
            <FormControl>
                <FormLabel className='text-slate-700'>Phone Number</FormLabel>
                <Input onChange={e=>setData(prev=>
                    ({
                        ...prev,
                        phoneNumber: e.target.value
                    })
                )} type='number'  color={'gray.500' } value={data.phoneNumber} required/>
            </FormControl>
            <FormControl>
                <FormLabel className='text-slate-700'>Card Number</FormLabel>
                <Input onChange={e=>setData(prev=>
                    ({
                        ...prev,
                        cardNumber: e.target.value
                    })
                )} type='number' color={'gray.500'} value={data.cardNumber} required/>
            </FormControl>

            <Button type='submit'>Registration</Button>
           </VStack>
                </form>
    )

}