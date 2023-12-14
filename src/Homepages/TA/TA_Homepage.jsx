import React, {useState, useEffect} from 'react'
import './TA_Homepage.css'
import Header from '../../Header/header.jsx'
import { Link } from 'react-router-dom'
import {BsBookHalf} from 'react-icons/bs'
import Incomplete_Tasks_Card_TA from './Incomplete_Task_Card_TA/Incomplete_Task_Card_TA'
import Completed_Tasks_Card_TA from './Completed_Task_Card_TA/Completed_Tasks_Card_TA.jsx'
import { useContext } from 'react';
import {userContext} from '../../App.jsx';
import axios from 'axios';

const TA_homepage = (props) => 
{
    const [userEmail,userType] = useContext(userContext);
    const [updatePage,setUpdatePage] = useState(0)
   

    const [incomplete_tasks,set_incomplete_tasks] = useState("")
    const [completed_tasks,set_completed_tasks] = useState("")

    const fetch_incomplete_tasks = async () =>
    {
        const data= await axios.get(`http://localhost:9000/fetch_incomplete_tasks_TA?email=${props.email}`, { withCredentials: true })
        set_incomplete_tasks(data)
    }
    const fetch_completed_tasks = async () =>
    {
        const data= await axios.get(`http://localhost:9000/fetch_completed_tasks_TA?email=${props.email}`, { withCredentials: true })
        set_completed_tasks(data)
    }

    useEffect(() => 
    {
        fetch_incomplete_tasks();
        fetch_completed_tasks();
    },[]) 






    return(
        <div>
            <Header login_state={props} type={"TA"}/>
                <div className='faculty_box'>
                    <center>
                    <h1>STUDENT DASHBOARD</h1>
                    </center>
                    <br/>
                     {/*APPLY*/}
                     <Link to="/Apply" className='TA_card'>
                        <BsBookHalf size={50}/>
                        &emsp;APPLY FOR TA-SHIP
                    </Link>
                    <br/>
                    <br/>
                    <br/>
                    <center>
                    <h2>INCOMPLETE TASKS</h2>
                    <div className='task_details'>
                    {
                        incomplete_tasks && incomplete_tasks.data.map((incomplete_task) => 
                        (
                            <Incomplete_Tasks_Card_TA param={incomplete_task} email={props.email} setUpdatePage={setUpdatePage}/>                    
                        ))               
                    }
                    </div>
                    <br/>
                    <h2>COMPLETED TASKS</h2>
                    <div className='task_details'>
                    {
                        completed_tasks && completed_tasks.data.map((completed_task) => 
                        (
                            <Completed_Tasks_Card_TA param={completed_task} email={props.email}/>                    
                        ))               
                    }
                    </div>
                    <br/>
                    </center>
                </div>

        </div>
    )
}

export default TA_homepage