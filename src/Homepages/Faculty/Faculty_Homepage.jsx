import React,{useEffect, useState,useContext} from 'react'
import './Faculty_Homepage.css'
import Header from '../../Header/header.jsx'
import Course_Card from './Course_Card/Course_Card.jsx'
import { userContext } from '../../App.jsx'
import axios from 'axios';

const Faculty_homepage = (props) => 
{
    const [userEmail,userType] = useContext(userContext);
    const [courses,setCourses] = useState([]);
    async function fetch_courses()
    {
        const result= await axios.get(`http://localhost:9000/fetch_faculty_courses?facultyEmail=${userEmail}`, { withCredentials: true })
        setCourses(result.data.courses);
    }
    useEffect(()=>{
        fetch_courses()
    },[])

    return(
        <div>
            <Header login_state={props} type={"FACULTY"}/>
                <div className='lander' style={{height:"100%"}}>
                    <center>
                    <h1>FACULTY DASHBOARD</h1>
                    <br/>
                    <br/>
                    <h2>COURSES</h2>
                    <br/>
                    </center>
                    <div className='Course_details'>
                            <div className='courses'>
                            {
                                courses && courses.filter(course=>course!="").map((course) => 
                                (
                                    <Course_Card code={course} />
                                ))
                            }   
                        </div>
                    </div>
                    <br/>
                </div>
        </div>
    )
}

export default Faculty_homepage