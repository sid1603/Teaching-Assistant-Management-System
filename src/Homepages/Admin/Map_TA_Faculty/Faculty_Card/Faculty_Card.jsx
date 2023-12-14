import React from 'react'
import './Faculty_Card.css'
import {Link} from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useContext } from 'react';
import {userContext} from '../../../../App.jsx'

const Faculty_Card = ({faculty_id,name,image}) => 
{
    const [userEmail,userType] = useContext(userContext);
   
    const [faculty,set_faculty]=useState("")

    const fetch_faculty = async () =>
    {
        const result = await axios.get(`http://localhost:9000/fetch_faculty?id=${faculty_id}`, { withCredentials: true })
        set_faculty(result.data)  
    }

    useEffect(() => 
    {
        fetch_faculty();

    },[])

    return (
        <div className='container'>
            <Link to="/Faculty_Page" state= {{faculty:faculty}}>
                <div className='image'>
                    <center><img src={image} height="240" max-width="250"/></center>
                </div>
                <p><center>{name}</center></p>
            </Link>
        </div>
    )
}

export default Faculty_Card