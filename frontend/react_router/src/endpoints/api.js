import axios from "axios";
// axios.defaults.withCredentials = true;

const baseUrl = "http://127.0.0.1:8000/auth/"
const loginUrl = `${baseUrl}token`
const RegisterUrl = `${baseUrl}register`
const refreshTokenUrl = `${loginUrl}/refresh/`
const logoutUrl = `${baseUrl}logout/`
const paymentsUrl = `${baseUrl}payment/`
const isAuthUrl = `${baseUrl}is_auth`
const getUserUrl = `${baseUrl}get_user`
const CarReservationUrl = 'http://127.0.0.1:8000/cars_list/reserve-car/'
const getReservationsUrl = 'http://127.0.0.1:8000/get_reservations/'
const deleteReservationUrl = 'http://127.0.0.1:8000/reservations/'
const getMessagesUrl = `${baseUrl}get_messages`
const seeNewMEssagesUrl = `${baseUrl}get_new_messages`
const updateProfilePhotoUrl = `${baseUrl}get_user`
const addCardURl = `${baseUrl}add_card`
const getCardsUrl = `${baseUrl}get_cards`


export async function Login(email, password){
    const response = await axios.post(loginUrl, {email:email, password:password}, {withCredentials:true})
    // document.cookie = `access_token=${response.data['access']}, refresh_token=${response.data['refresh']}`
    console.log(response)
    return response.data
}

export async function Register(firstName, lastName, email, password1, password2, phoneNumber, cardNumber){
    try{
        const response = await axios.post(RegisterUrl, {first_name: firstName, last_name: lastName, email: email, password1: password1, 
            password2: password2, phone_number:phoneNumber, card_number:cardNumber
        }, {withCredentials: true})
        // console.log(response.statusText)
        if (response.statusText == 'Created'){
            return true
        }else{
            return response.data
        }
    }
    catch(error){
        console.log({'error': error})
    }
    
}


export async function RefreshToken(){
    const response = await axios.post(refreshTokenUrl, {}, {withCredentials:true})
    return response.data.refreshed
}

export async function Logout(){
    try{
        const response = await axios.post(logoutUrl, {}, {withCredentials: true})
        return response
    }catch(error){
        console.log(error)
    }
}


export async function callRefresh(error, func){
    try{
        if (error.response && error.response.status == 401){
            const refreshed = await RefreshToken()
            if (refreshed){
                return await func()
            }else{
                throw new Error("Token refresh failed!!!")
            }
        }
    }catch(error){
        throw error
    }
}

export async function getPayment() {
    try{
        const response = await axios.get(paymentsUrl, {withCredentials: true})
        return response
    }
    catch(error){
        await RefreshToken()
        console.log('refreshed')
        return await axios.get(paymentsUrl, {withCredentials: true})
    }
}


export async function getCars(){
    try{
        const response = await axios.get('http://127.0.0.1:8000/cars/', {withCredentials: true})
        return response
    }
    catch(error){
        await RefreshToken()
        console.log('refreshed')
        return await axios.get('http://127.0.0.1:8000/cars/', {withCredentials: true})
    }
}

export async function isAuth(){
    try{
        const response = await axios.get(isAuthUrl, {withCredentials:true})
        return response.data
    }catch(error){
        return false
    }
}


export async function getUser() {
    try{
        const response = await axios.get(getUserUrl, {withCredentials:true})
        return response.data
    }catch(error){
            await RefreshToken()
        console.log(error)
        console.log('refreshed')
        const response = await axios.get(getUserUrl, {withCredentials:true})
        return response.data
    }
}

export async function CarReservation(carPk, startDate, endDate, price) {
    try{
        const response = await axios.post(CarReservationUrl, {
            "car_pk": carPk, "start_date": startDate, "end_date": endDate, "price": price
        }, {withCredentials: true})
        console.log(response)
        return response
    }catch(error){
        // await RefreshToken()
        // console.log('refreshed')
        // await axios.post(CarReservationUrl, {
        //     "car_pk": carPk, "start_date": startDate, "end_date": endDate, "price": price
        // }, {withCredentials: true})
        return error.response.data
    }
}



export async function getReservations(carPk) {
    try{
        const response = await axios.get(getReservationsUrl + carPk + '/', {withCredentials:true})
        console.log(response)
        return response
    }catch(error){
        await RefreshToken()
        console.log('refreshed')
        console.log(carPk)
        return await axios.get(getReservationsUrl + carPk + '/', {withCredentials:true})
        
    }
}


export async function DeleteReservation(pk) {
    console.log(deleteReservationUrl + pk)
    try{
        const response = await axios.delete(deleteReservationUrl + pk + '/', {withCredentials: true})
        return response
    }catch(error){
        await RefreshToken()
        console.log(error.response.data)
        console.log('refreshed')
        return await axios.delete(deleteReservationUrl + pk + '/', {withCredentials:true})
        
    }
} 


export async function GetMessages() {
    try{
        const response = axios.get(getMessagesUrl, {withCredentials: true})
        return response
    }catch(error){
        await RefreshToken()
        console.log(error.response.data)
        console.log('refreshed')
        return await axios.delete(getMessagesUrl, {withCredentials:true})
    }
}

export async function seeNewMessages() {
    try{
        const response = axios.get(seeNewMEssagesUrl, {withCredentials: true})
        return response
    }catch(error){
        await RefreshToken()
        console.log(error.response.data)
        console.log('refreshed')
        return await axios.delete(getMessagesUrl, {withCredentials:true})
    }
}


export async function updateProfilePhoto(profilePicture) {
    const formData = new FormData()
        formData.append('profile_photo', profilePicture)
    try{
        const response = await axios.put(updateProfilePhotoUrl, formData, {withCredentials:true} )
        return response.data
    }catch(error){
            await RefreshToken()
        console.log(error)
        console.log('refreshed')
        const response = await axios.put(updateProfilePhotoUrl, formData, {withCredentials:true})
        return response.data
    }
}


export async function updateUserField(pk, fieldkey, field) {
    let data;
    if (fieldkey == 'email'){
        data = {'email': field}
    }else{
        data = {'phone_number': field}
    }

    const updateUrl = `http://127.0.0.1:8000/auth/update_user_data`
    try{

        const response = await axios.put(updateUrl, data, {withCredentials:true} )
        console.log(response)
        return response.data
    }catch(error){
            await RefreshToken()
        console.log(error)
        console.log('refreshed')
        const response = await axios.put(updateUrl, {}, {withCredentials:true})
        return response.data
    }
}



export async function addCard(ccv, expDate, cardNumber, postalCode, cardHolder){
    try{
        const response = axios.post(addCardURl, {'ccv': ccv, 'expiry_date': expDate, 'card_number': cardNumber, 'card_holder': cardHolder, 'postal_code': postalCode}, {withCredentials: true})
        return response
    }catch(error){
        await RefreshToken()
        console.log(error.response.data)
        console.log('refreshed')
        return await axios.post(addCardURl, {'ccv': ccv, 'expiry_date': expDate, 'card_number': cardNumber, 'card_holder': cardHolder, 'postal_code': postalCode}, {withCredentials:true})
    }
}


export async function getCards(){
    try{
        const response = axios.get(getCardsUrl, {withCredentials: true})
        return response
    }catch(error){
        await RefreshToken()
        console.log(error.response.data)
        console.log('refreshed')
        return await axios.get(getCardsUrl, {withCredentials:true})
    }
}