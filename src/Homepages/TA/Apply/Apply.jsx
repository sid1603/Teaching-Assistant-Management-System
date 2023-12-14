import React,{useEffect, useState} from 'react'
import Header from '../../../Header/header.jsx'
import './Apply.css'
import Popup from 'reactjs-popup'
import { CircularProgress } from '@mui/material'
import { useContext } from 'react';
import {userContext} from '../../../App.jsx'
import axios from 'axios';

const Apply = (props) => 
{
        const [userEmail,userType] = useContext(userContext);
   
        const [Status,set_status] = useState()
        const [user,set_user] = useState({
            course1:"",
            course2:"",
            course3:""
        })
        const [courses,set_courses] = useState([]);
        const [fac,set_fac] = useState({name:""})
        const [choices_temp,Set_choices_temp] = useState({
            course1:"",
            course2:"",
            course3:""
        })

        /* The JWT refresh token update is not reflected in the '.then' block of the previous request where the refresh token was updated, 
        so this variable stores if update is needed and calls the fetch_details function when needed */
        const [update,setUpdate] = useState(0)

        //Loading Screen
        const [loadingPopup,setLoadingPopup] = useState(false);
        //Popup
        const [popup,setPopup] = useState(false);
        const [success,setSuccess] = useState(0);
        const [popupMessage,setPopupMessage] = useState(null);

        const fetch_courses = async () =>
        {
            await axios.get("http://localhost:9000/fetch_courses", { withCredentials: true }).then(res=>
            {
                setSuccess(res.data.success);
                if(res.data.success==1)
                {
                    set_courses(res.data.courses);
                }
                else
                {
                    setPopupMessage(res.data.message);
                    setPopup(true);
                }
            }) 
        }  
        const fetch_user = async () =>
        {
            await axios.get(`http://localhost:9000/fetch_TA_by_email?email=${props.user_email}`, { withCredentials: true }).then(async(res)=>
            {
                if(res.data.success==1)
                {
                    set_user(res.data.TA)
                    set_status(res.data.TA.Application_Status)
                    await axios.get(`http://localhost:9000/fetch_faculty_by_email?email=${res.data.TA.Faculty_Email}`, { withCredentials: true }).then(res=>
                    {
                        if(res.data.success==1)
                        {
                            set_fac(res.data.Faculty);
                        }
                        else
                        {
                            setPopupMessage(res.data.message);
                            setPopup(true);
                        }   
                    })
                }
                else
                {
                    setPopupMessage(res.data.message);
                    setPopup(true);
                }     
            })    
            setUpdate(0);
        }  

        useEffect(() => 
        {
            fetch_courses();
            fetch_user();   
            setSuccess(0);     
        },[])

        useEffect(() => 
        {
            if(update==1)
            {
                fetch_courses();
                fetch_user(); 
            }        
        },[update])
        
        const HandleChange  = e =>  /*When someone types, its an 'event', denoted and saved in 'e' here. e.target will return where and what the change was*/
        {    
            const {name,value} = e.target
            Set_choices_temp({
                ...choices_temp, /* Stores the value entered by the user in the respective state variable while the rest remain as their default values ("" in this case)*/
                [name]:value /* Depending on the name of the inputbar, its value is stored in the respective state variable*/   
            })
  
        }


        const Save_Changes = async() =>
        {
            if(!choices_temp.course1)
            {
                setPopupMessage("Please choose course 1");
                setPopup(true);
            } 
            else if(!choices_temp.course2)
            {
                setPopupMessage("Please choose course 2");
                setPopup(true);
            } 
            else if(!choices_temp.course3)
            {
                setPopupMessage("Please choose course 3");
                setPopup(true);
            } 
            else if(choices_temp.course1==choices_temp.course2||choices_temp.course1==choices_temp.course3||choices_temp.course2==choices_temp.course3)
            {
                setPopupMessage("Courses must be different");
                setPopup(true);
            }
            else
            {
                setLoadingPopup(true);
                const details = {
                    Email:props.user_email,
                    course1:choices_temp.course1,
                    course2:choices_temp.course2,
                    course3:choices_temp.course3,
                    Application_Status:"Applied"
                }
                await axios.post("http://localhost:9000/Set_choices", details, { withCredentials: true }).then(res=>
                {
                    if(res.data.success==1)
                    {
                        set_status("Applied");
                    }
                    setLoadingPopup(false);
                    setSuccess(res.data.success);
                    setPopupMessage(res.data.message);
                    setPopup(true);
                    setUpdate(1);
                })
            }
        } 



        return(
            <div>
                <Header login_state={props} type={"TA"}/>
                <div className='item_box'>
                    <center>
                    <h1>APPLY FOR TEACHING ASSISTANTSHIP</h1>
                    <br/>
                    <h2 className={Status=="Yet to Apply" ? "ErrorMsg" : "SuccessMsg"}>Status : {Status}</h2>     
                    {Status=="Yet to Apply" ? <h2>Please choose 3 courses of your liking</h2> : Status=="Applied" ? <h2>Please wait for the admin to assign you to a course.</h2> : <h2>You have been assigned to {user.Final_Course_Code} under {fac.name}</h2>}
                    <br/>
                    { 
                        Status=="Yet to Apply"
                        
                        ?

                        <div className='details'>
                            <h3>Course 1&emsp;: <br/>
                                <select name="course1" className='details_input' onChange={HandleChange} value={choices_temp.course1}>
                                    <option value=""></option>
                                        {
                                            courses.length>0 
                                            ? 
                                            courses.map((el) => 
                                            (
                                                <option value={el.code}>{el.name}</option>
                                            ))
                                            :
                                            ""
                                            
                                        }
                                </select>
                            </h3>
                            <br/>
                            <h3>Course 2&emsp;: <br/>
                                <select name="course2" className='details_input' onChange={HandleChange} value={choices_temp.course2}>
                                    <option value=""></option>
                                        {
                                            courses.length>0 
                                            ? 
                                            courses.map((el) => 
                                            (
                                                <option value={el.code}>{el.name}</option>
                                            ))
                                            :
                                            ""
                                            
                                        }
                                </select>
                            </h3>
                            <br/>
                            <h3>Course 3&emsp;: <br/>
                                <select name="course3" className='details_input' onChange={HandleChange} value={choices_temp.course3}>
                                    <option value=""></option>
                                        {
                                            courses.length>0
                                            ?
                                            courses.map((el) => 
                                            (
                                                <option value={el.code}>{el.name}</option>
                                            ))
                                            :
                                            ""
                                            
                                        }
                                </select>
                            </h3>
                            <br/>
                        </div>


                        :

                        
                        <div className='details'>
                            <h3>Course 1&emsp;:&emsp;{user.course1}</h3>
                            <br/>
                            <h3>Course 2&emsp;:&emsp;{user.course2}</h3>
                            <br/>
                            <h3>Course 3&emsp;:&emsp;{user.course3}</h3>
                            <br/>
                        </div>

                    }
                    <div className={Status=="Yet to Apply" ? 'btn' : 'ncbtn'} onClick={Status=="Yet to Apply" ? Save_Changes : null}>APPLY</div>
                    <br/>
                    <br/>
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
              </div>
            </div>
        )
        
}

export default Apply