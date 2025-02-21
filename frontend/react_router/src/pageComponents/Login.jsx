import { Button, VStack, FormControl, FormLabel, Input } from '@chakra-ui/react'
import { useState } from 'react';
import { Login as login, RefreshToken} from '../endpoints/api';
import { useNavigate } from 'react-router-dom';
import {useCookies} from 'react-cookie'
import { useAuth } from '../contexts/useAuth';

function Login(){

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const {isAuthenticated} = useAuth()
    const [messages, setMessages] = useState([])

    if (isAuthenticated){
        navigate('/home')
    }

    const handleLogin = async (e)=>{
        try{
            e.preventDefault()
            const response = await login(email, password)
                navigate('/home')

            
            

        }catch(error){
            console.log(error)
            console.log(messages)
            setMessages(["Password or email is not valid!"])
        }
        
    }

    const handleRefresh = async()=>{
        try{
            await RefreshToken()
        }catch(error){
            console.log(document.cookie)
            console.log(error)
        }
    
    }

   return (
        <form className='m-auto w-fit my-32 ' action="" onSubmit={handleLogin}>
<VStack className='w-80 flex flex-col bg-slate-300 py-3 px-4 align-top'>
        {messages && messages.map((message, index)=>{
                return <h2 key={index}>{message}</h2>
            })}
      <FormControl>
        <FormLabel className='text-slate-700'>Email address</FormLabel>
        <Input onChange={e=>setEmail(e.target.value)} type='email' value={email} color={'gray.500'} required/>
    </FormControl>
    <FormControl>
        <FormLabel className='text-slate-700'>Password</FormLabel>
        <Input onChange={e=>setPassword(e.target.value)} type='password' value={password} color={'gray.500'} required/>
    </FormControl>
    <Button type='submit'>Login</Button>
    {/* <Button  onClick={handleRefresh}>Refresh</Button> */}
   </VStack>
        </form>
   
   )
}

export default Login;