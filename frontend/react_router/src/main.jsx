import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './contexts/useAuth.jsx'
import { LocalizationProvider, DateTimePicker, DatePicker } from '@mui/x-date-pickers'
import { createTheme, ThemeProvider } from '@mui/system'
import CarProvider from './contexts/useCar.jsx'
import MessagesProvider from './contexts/MessagesContext.jsx'




const theme = createTheme({
  typography: {
    body1: {
      fontSize: '1rem', // Ensure body1 is defined
    },
  },
  palette: {
    primary: {
      main: 'green',
    },
    secondary: {
      main: 'blue',
    },
  },
})



createRoot(document.getElementById('root')).render(

<StrictMode>
    

<ChakraProvider>
    <BrowserRouter>
      <AuthProvider>
        <CarProvider>
          <MessagesProvider>
            <App />
          </MessagesProvider>
        </CarProvider>
      </AuthProvider>
      </BrowserRouter>
  </ChakraProvider>



   
  
</StrictMode>
  
   
)
