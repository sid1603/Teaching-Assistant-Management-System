import React from 'react'
import './Course_Card.css'
import {Link} from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useContext } from 'react';
import {userContext} from '../../../App.jsx'

const Course_Card = ({code}) => 
{
    const [userEmail,userType] = useContext(userContext);
    
    const [course,set_course]=useState("")
    useEffect(() => 
    {
        const fetch_course = async () =>
        {
            const result = await axios.get(`http://localhost:9000/fetch_course?courseCode=${code}`, { withCredentials: true })
            set_course(result.data)  
        }
        fetch_course();
        

    },[])

    return (
        <div className='container'>
            <Link to="/Course_Page" state= {{course:course}}>
                <div className='image'>
                    <center><img src="/default_course_image.jpg" height="240" max-width="250"/></center>
                </div>
                <p><center>{course.name+" ("+code+")"}</center></p>
            </Link>
        </div>
    )
}

export default Course_Card