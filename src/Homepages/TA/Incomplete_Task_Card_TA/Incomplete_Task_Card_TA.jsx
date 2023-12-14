import React,{useState,useEffect, useTransition} from 'react'
import './Incomplete_Task_Card_TA.css'
import Popup from 'reactjs-popup'
import { CircularProgress } from '@mui/material'
import { format, parseISO } from 'date-fns'
import { useContext } from 'react';
import {userContext} from '../../../App.jsx'
import { resolvePath } from 'react-router-dom'
import axios from 'axios';

const Incomplete_Tasks_Card_TA = (props) => {

    const [userEmail,userType] = useContext(userContext);
   
    const days = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
    const [incomplete_task,set_incomplete_task]=useState(props.param)
    const [index,set_index] = useState()
    const [status,set_status]=useState("") 
    const [status_old,set_status_old] = useState("")
    var today = new Date()
    var deadline = new Date(incomplete_task.Deadline)

    /* The JWT refresh token update is not reflected in the '.then' block of the previous request where the refresh token was updated, 
    so this variable stores if update is needed and calls the fetch_details function when needed */
    const [update,setUpdate] = useState(0)

    //Loading Screen
    const [loadingPopup,setLoadingPopup] = useState(false);
    //Popup
    const [popup,setPopup] = useState(false);
    const [success,setSuccess] = useState(0);
    const [popupMessage,setPopupMessage] = useState(null);

    
    function Setter(incomplete_task)
    {

        for(var i=0;i<incomplete_task.Status.filter(status=>status!="").length;i++)
        {
            if(props.email==incomplete_task.TA_Emails[i]&&incomplete_task.Status[i]!="Completed")
            {
                set_status_old(incomplete_task.Status[i])
                set_index(i)
            }
        }
    }

    const fetch_incomplete_tasks = async () =>
    {
        await axios.get(`http://localhost:9000/fetch_incomplete_task_id?id=${incomplete_task._id}`, { withCredentials: true }).then(res=>
        {
            set_incomplete_task(res.data);
            Setter(res.data);
            setUpdate(0);
        })
        
    }

    useEffect(() =>
    {   
        Setter(incomplete_task);
        fetch_incomplete_tasks();
    },[])

    useEffect(() =>
    {   
        if(update==1)
        { 
            fetch_incomplete_tasks();
        }
    },[update])

    const HandleChange = e =>
    {
        set_status(e.target.value)
    }
 
    const Save_Changes = async() =>
    {
        if(status==status_old)
        {
            setPopupMessage("No Change in Task Status");
            setPopup(true);
        }
        else if(status=="")
        {
            setPopupMessage("Please select a valid task status");
            setPopup(true);
        }
        else
        {    
            setLoadingPopup(true);
            const details = {
                Status:status,
                id:incomplete_task._id,
                index:index
            }
            await axios.put("http://localhost:9000/Update_Task_Status", details, { withCredentials: true }).then(res=>
            {   
                if(status=="Completed")
                    set_status_old("Completed")
                setLoadingPopup(false);
                setPopupMessage(res.data.message);
                setSuccess(res.data.success);
                setPopup(true);
                setUpdate(1);
            })
        }

    }
    
    return (
        

        <div className='request_container'>
            <span>
                  <p>&emsp;&emsp;Name :- {incomplete_task.Name}</p>
                  <br/>
                  <p>&emsp;&emsp;Description :- <br/> &emsp;&emsp;{incomplete_task.Description}</p>
                  <br/>
                  <p>&emsp;&emsp;Deadline :- <br/> <div className={today>deadline ? 'ErrorMsg' : 'SuccessMsg'}>&emsp;&emsp;{format(parseISO(incomplete_task.Deadline),'dd-MM-yyyy')} ({days[parseISO(incomplete_task.Deadline).getDay()]})</div></p>
                  <br/>
                  <p>&emsp;&emsp;Status : &emsp;{status_old}&emsp;
                    <select name="Status" className='details_input_card' onChange={HandleChange} >
                        <option value=""></option>
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                  </p>
                  <br/>
                  <p>&emsp;&emsp;Note : You cannot edit task status once the task has been completed.</p>
                  <br/>
                  <center>
                  <div className={status_old=="Completed"? 'ncbtn' : 'btn'} onClick={status_old=="Completed"? null : Save_Changes}>UPDATE</div>
                  {/* LOADING SCREEN */}
                    <Popup open={loadingPopup} hideBackdrop closeOnDocumentClick={false} onClose={()=>{setLoadingPopup(false)}}>
                         <center>
                           <p style={{color:"#003C71", fontSize:"130%", margin:"3%"}}><center>PLEASE WAIT...</center></p>
                           <br/>
                           <CircularProgress/>
                           <br/>
                           <br/>
                         </center>
                    </Popup> 
                    <Popup open = {popup} closeOnDocumentClick  onClose={()=>{setPopup(false);setSuccess(0);}}>
                    <center> 
                        <br/>
                        <center><div className={success==1 ? 'SuccessMsg' : 'ErrorMsg'}>{popupMessage}</div></center>
                        <br/>
                        <div className='export_btn' onClick={()=>{setPopup(false);setSuccess(0)}}>Ok</div>
                        <br/>
                        <br/>
                      </center>
                    </Popup>
                  </center>
            </span>
        </div>
        
    )


}

export default Incomplete_Tasks_Card_TA