import { useState, useRef } from 'react'
import './App.css'
import About from './pageComponents/About'
import Home from './pageComponents/Home'
import Cars from './pageComponents/Cars'
import Profile from './pageComponents/Profile'
import Register from './pageComponents/Register'
import CarReservation from './pageComponents/CarReservation'
import Navbar from './components/Navbar'
import Login from './pageComponents/Login'
import PageNotFound from './pageComponents/PageNotFound'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { Link } from 'react-router-dom'
import {ChakraProvider} from '@chakra-ui/react'
import { ErrorBoundary } from 'react-error-boundary';
import AuthProvider from './contexts/useAuth'
import { useAuth } from './contexts/useAuth'
import { RefreshToken } from './endpoints/api'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs from 'dayjs'
import { createTheme, ThemeProvider } from '@mui/system'


function App() {
  return (
        <>
        <Routes>
              <Route path='/' element={<Navbar/>}>
              <Route path='/' element={<Home/>}/>
              <Route path='home' element={<Home/>}/>
                <Route path='login' element={<Login/>}/>
                <Route path='register' element={<Register/>}/>
                <Route path='about' element={<About/>}/>
                <Route path='profile' element={<Profile/>}/>
                <Route path='cars' element={<Cars/>}/>
                <Route path='cars/reservation/:carId' element={<CarReservation/>}/>
              </Route>
              
              <Route path='*' element={<PageNotFound/>}/>
              
            </Routes>
            </>
  )
}

export default App
