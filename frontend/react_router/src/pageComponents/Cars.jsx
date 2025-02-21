import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { responsive } from '../assets/multiCarouselData'
import axios from "axios";
import CarCard from "../components/CarCard";
import { getCars } from "../endpoints/api";
import { useCar } from "../contexts/useCar";



export default function Cars(){
    // const {cars} = useCar()

    const [cars, setCars] = useState([])

    // const getCars = ()=>{
    //     axios.get('http://127.0.0.1:8000/cars/').
    //   then(response => {
    //     setCars(response.data)
    //     console.log(response.data)
    //   }).catch(error=>console.log(error))
    //   }

      async function fetchData() {
              try{
                  const response = await getCars()
                  
                  console.log(response) 
                  try{
                      setCars([...response.data])
                  }catch(error){
                      throw error
                  }
                  
              }catch(error){
                  console.log({error: error})
              }
          }

      useEffect(()=>{
        fetchData()
      }, [])

    return <>
    <Carousel className='flex gap-8 bg-gray-700 py-3' responsive={responsive} infinite={true}
  draggable={true}
  showDots={false}  keyBoardControl={true} ssr={true}
  autoPlay={true}
  autoPlaySpeed={6000} 
  containerClass="carousel-container"
  dotListClass="custom-dot-list-style"
  itemClass="px-6 "
  >
    {cars.map(car=>{
          return (<CarCard id={car.id} key={car.id} name={car.name} brand={car.brand} description={car.description} 
          price={car.price} release_year={car.release_year} is_rented={car.is_rented} car_image={car.car_photo}/>)
        })}
 
</Carousel>
    </>
}