import React, {useEffect,useState} from 'react'
import Header from '../../../Header/header.jsx'
import './Task_Assignment.css'
import { useLocation } from 'react-router-dom'
import Popup from 'reactjs-popup'
import { CircularProgress } from '@mui/material'
import { useContext } from 'react';
import {userContext} from '../../../App.jsx'
import axios from 'axios';


const Task_Assignment = (props) => 
{
    const location=useLocation();
    const course = location.state.course

    const [userEmail,userType] = useContext(userContext);
   
    const [TAs,set_TAs] = useState([""])
    var arr=[]
    var arr2=[]
    const TA_pattern = new RegExp("TA[0-9]")

    /* The JWT refresh token update is not reflected in the '.then' block of the previous request where the refresh token was updated, 
    so this variable stores if update is needed and calls the fetch_details function when needed */
    const [update,setUpdate] = useState(0)

    const [Task_Temp,set_Task_Temp] = useState(
      {
        name:"",
        description :"",
        deadline : "",
        TAs_num : 1,
        TA_Emails:[""],
        Email : ""
        
      })

      
    //Loading Screen
    const [loadingPopup,setLoadingPopup] = useState(false)

    //Popup
    const [popup,setPopup] = useState(false);
    const [success,setSuccess] = useState(0);
    const [popupMessage,setPopupMessage] = useState(null);

    const fetch_TAs = async () =>
    {
        await axios.get(`http://localhost:9000/fetch_TAs_by_course_faculty?Faculty_Email=${props.email}&Course_Code=${course.code}`, { withCredentials: true }).then(res=>
        {
            set_TAs(res.data);
            setUpdate(0);
        })

    }

    useEffect(() => 
    {
        fetch_TAs()
    },[]) 

    useEffect(() =>
    {
      if(update==1)
        fetch_TAs();
    },[update])


    //Saving user input
    const HandleChange  = e =>  /*When someone types, its an 'event', denoted and saved in 'e' here. e.target will return where and what the change was*/
    {    
        const {name,value} = e.target
        if(TA_pattern.test(name))
        {
            Task_Temp.TA_Emails[name[2]-1]=value
        }
        else
        {
            set_Task_Temp({
                ...Task_Temp, /* Stores the value entered by the user in the respective state variable while the rest remain as their default values ("" in this case)*/
                [name]:value /* Depending on the name of the inputbar, its value is stored in the respective state variable*/
            })
        }
        if(name=="TAs_num")
        {
            Arr2Setter();
        }

    }

    function ArrSetter()
    {
        for(var i=0;i<=TAs.length;i++)
        {
            arr[i]=i;
        }
    }

    function Arr2Setter()
    {
        arr2=[]
        for(var i=1;i<=Task_Temp.TAs_num;i++)
        {
            arr2[i-1]=i;
        }
    }

    function TA_Remover()
    {
        for(var i=Task_Temp.TAs_num;i<5;i++)
        {
            Task_Temp.TA_Emails[i]=""
        }
    }

    const Save_Changes = async() =>
    {
        var all_TAs_flag=0;
        var duplicate_TAs_flag=0;
        if(!Task_Temp.name)
        {
            setPopupMessage("Please enter task name");
            setPopup(true);
        }
        else if(!Task_Temp.deadline)
        {
            setPopupMessage("Please enter task deadline");
            setPopup(true);
        }
        else
        {
            for(var i=0;i<Task_Temp.TAs_num;i++)
            { 
                if(!Task_Temp.TA_Emails[i])
                    all_TAs_flag=1
                for(var j=0;j<Task_Temp.TAs_num;j++)
                {
                    if(i!=j&&Task_Temp.TA_Emails[i]!=""&&Task_Temp.TA_Emails[j]!=""&&Task_Temp.TA_Emails[i]==Task_Temp.TA_Emails[j])
                        duplicate_TAs_flag=1;
                }
            }
            if(all_TAs_flag==1)
            {
                setPopupMessage("Please enter all TAs");
                setPopup(true);
            }
            else if(duplicate_TAs_flag==1)
            {  
                setPopupMessage("TAs must be different");
                setPopup(true);
            }
            else
            {
                setLoadingPopup(true);
                Task_Temp.Email=props.email
                const task = {
                    Name:Task_Temp.name,
                    Description:Task_Temp.description,
                    Deadline:Task_Temp.deadline,
                    TA_Emails:Task_Temp.TA_Emails,
                    Faculty_Email:Task_Temp.Email,
                    Course_Code:course.code
                }
                await axios.post("http://localhost:9000/Assign_Task", task, { withCredentials: true }).then(res=>
                {
                    setLoadingPopup(false);
                    setSuccess(res.data.success);
                    setPopupMessage(res.data.message);
                    setPopup(true);
                    Task_Temp.name="";
                    Task_Temp.description ="";
                    Task_Temp.deadline = "";
                    Task_Temp.TAs_num = 0;
                    Task_Temp.TA_Emails=[""];
                    Task_Temp.Email = "";
                    setUpdate(1);
                })
                  
            }
        }
        
    } 




    return (
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
            <h2>ASSIGN TASK</h2>
            <br/>
            <div className='details'>
            {ArrSetter()}
            {Arr2Setter()}
            {TA_Remover()}
            <h3>Task Name &emsp;: <br/><input type="text" name="name" placeholder="Enter Task Name" className='task_details_input' onChange={HandleChange} value={Task_Temp.name}/></h3>
            <br/>
            <h3>Task Description &emsp;: <br/><textarea name="description" cols="20" rows="6" type="text" placeholder="Enter Task Description" className='task_details_input_large' onChange={HandleChange} value={Task_Temp.description}/></h3>
            <br/>
            <h3>Deadline &emsp;: <br/><input type="date" name="deadline" placeholder="Enter Task Deadline" className='task_details_input' onChange={HandleChange} value={Task_Temp.deadline}/></h3>
            <br/>
            <h3>Number of TAs &emsp;: <br/>
                <select name="TAs_num" className='task_details_input' onChange={HandleChange} value={Task_Temp.TAs_num}>
                    {
                        arr.map((el) => 
                        (
                            <option value={el}>{el}</option>
                        ))
                                                
                    }
                </select>
                </h3>
                <br/>
                {

                    arr2.map( (el,i) => (
                    <div>
                        <h3 key={i}>TA {el} &emsp;: <br/>
                            <select name={"TA"+el} className='task_details_input' onChange={HandleChange}>
                                <option value=""></option>
                                {
                                    TAs && TAs.map((el) => 
                                    (
                                        <option value={el.email}>{el.name}</option>     
                                    ))
                                    
                                }
                            </select>
                        </h3>
                        <br/>
                    </div>
                    ))
                    
                            
               }
            <br/>
            </div>
            <div className={Task_Temp.TAs_num==0 ? 'ncbtn' : 'btn'} onClick={Task_Temp.TAs_num==0 ? null : Save_Changes}>ASSIGN TASK</div>
            <br/>
            <br/>
            </center>
      </div>
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
    </div>

    )
}

export default Task_Assignment