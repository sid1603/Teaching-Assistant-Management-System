/*import React, {useEffect,useState} from 'react'
import Header from '../../../Header/header.jsx'
import './View_Tasks.css'
import { Link, useLocation } from 'react-router-dom'
import axios from 'axios'
import Completed_Tasks_Card from '../Completed_Tasks_Card/Completed_Tasks_Card.jsx'
import Incomplete_Tasks_Card from '../Incomplete_Tasks_Card/Incomplete_Tasks_Card.jsx'
import { useContext } from 'react';
import {userContext} from '../App.jsx'

const View_Tasks = (props) => 
{

    const [userEmail,userType] = useContext(userContext);
   
    const location=useLocation()
    const course = location.state.course
    const [TAs,set_TAs] = useState([""])
    const [incomplete_tasks,set_incomplete_tasks] = useState("")
    const [completed_tasks,set_completed_tasks] = useState("")

    useEffect(() => 
    {
        const fetch_TAs = async () =>
        {
            const result2 = await axios.get(`http://localhost:9000/fetch_TAs_by_course_faculty?Faculty_Email=${props.email}&Course_Code=${course.code}`)
            set_TAs(result2.data)
        }
        fetch_TAs()

        const fetch_incomplete_tasks = async () =>
        {
            const data= await axios.get(`http://localhost:9000/fetch_incomplete_tasks?fac_email=${props.email}&course_code=${course.code}`)
            set_incomplete_tasks(data)
        }
        fetch_incomplete_tasks();

        const fetch_completed_tasks = async () =>
        {
            const data= await axios.get(`http://localhost:9000/fetch_completed_tasks?fac_email=${props.email}&course_code=${course.code}`)
            set_completed_tasks(data)
        }
        fetch_completed_tasks();

    },[]) 
    

    return(

        <div>
        <Header login_state={props} type={"FACULTY"}/>
        <div className='faculty_box'>
            <center>
            <h1>{course.name}</h1>
            <h1>({course.code})</h1>
            <br/>
            <br/>
            <div className='details'>
                <br/>
                <h3>TAs Allotted &emsp;:- &emsp;<p>{TAs.length}</p></h3>
                <br/>
                <h3>TAs &emsp;:- &emsp; {TAs.map((TA)=>(<p>{TA.name}</p>))}</h3>
                <br/>
                <br/>
            </div>
            <h2>COMPLETED TASKS</h2>
            <div className='task_details'>
            {
                completed_tasks && completed_tasks.data.map((completed_task) => 
                (
                    <Completed_Tasks_Card param={completed_task} TAs={TAs}/>                    
                ))               
            }
            </div>
            <br/>
            <h2>INCOMPLETE TASKS</h2>
            <div className='task_details'>
            {
                incomplete_tasks && incomplete_tasks.data.map((incomplete_task) => 
                (
                    <Incomplete_Tasks_Card param={incomplete_task} TAs={TAs}/>                    
                ))               
            }
            </div>
            <br/>
            </center>
        </div>
        </div>
    )
    

}

export default View_Tasks
*/