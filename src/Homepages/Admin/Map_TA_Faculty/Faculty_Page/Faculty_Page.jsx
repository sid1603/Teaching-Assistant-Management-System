import React, {useEffect,useState} from 'react'
import Header from '../../../../Header/header.jsx'
import './Faculty_Page.css'
import { useLocation } from 'react-router-dom'
import { useContext } from 'react';
import Popup from 'reactjs-popup'
import { CircularProgress } from '@mui/material'
import {userContext} from '../../../../App.jsx'
import axios from 'axios';

const Faculty_Page = (props) => 
{
    const location=useLocation()
    const faculty = location.state.faculty

    const [userEmail,userType] = useContext(userContext);
   
    const [TA_requests,set_TA_requests] = useState("")
    const [TAs,set_TAs] = useState()
    var arr=[]
    var arr2=[]
    const TA_pattern = new RegExp("TA[0-9]")
    const Course_pattern = new RegExp("C[0-9]")

    /* The JWT refresh token update is not reflected in the '.then' block of the previous request where the refresh token was updated, 
    so this variable stores if update is needed and calls the fetch_details function when needed */
    const [update,setUpdate] = useState(0)

    const [TAs_Temp,set_TAs_Temp] = useState(
      {
        TA_num:0,
        TA_Emails:[""],
        Email : "",
        Courses:[""]
        
      })
      
    //Loading Screen
    const [loadingPopup,setLoadingPopup] = useState(false)

    //Popup
    const [popup,setPopup] = useState(false);
    const [success,setSuccess] = useState(0);
    const [popupMessage,setPopupMessage] = useState(null);
    
    const fetch_TA_requests = async () =>
    {
        const result = await axios.get(`http://localhost:9000/fetch_TA_requests?courses=${faculty.courses}`, { withCredentials: true })
        set_TA_requests(result)
    }
    const fetch_TAs = async () =>
    {
        const result2 = await axios.get("http://localhost:9000/fetch_TAs", { withCredentials: true })
        set_TAs(result2)
        setUpdate(0);
    }

    useEffect(() => 
    {
        fetch_TA_requests();
        fetch_TAs();
    },[])
    
    useEffect(() =>
    {
        if(update==1)
        {
          fetch_TA_requests();
          fetch_TAs();
        }
    },[update])

    //Saving user input
    const HandleChange  = e =>  /*When someone types, its an 'event', denoted and saved in 'e' here. e.target will return where and what the change was*/
    {    
        const {name,value} = e.target
        if(TA_pattern.test(name))
        {
            TAs_Temp.TA_Emails[name[2]-1]=value
        }
        else if(Course_pattern.test(name))
        {
            TAs_Temp.Courses[name[1]-1]=value
        }
        else
        {
            set_TAs_Temp({
                ...TAs_Temp, /* Stores the value entered by the user in the respective state variable while the rest remain as their default values ("" in this case)*/
                [name]:value /* Depending on the name of the inputbar, its value is stored in the respective state variable*/
            })
        }
        if(name=="TA_num")
        {
            Arr2Setter();
        }

    }

    
    function ArrSetter()
    {
        var limit=5
        if(faculty.TAs_Req>-1)
            limit=faculty.TAs_Req
        for(var i=0;i<=limit;i++)
        {
            arr[i]=i
        }

    }

    function Arr2Setter()
    {
        arr2=[]
        for(var i=1;i<=TAs_Temp.TA_num;i++)
        {
            arr2[i-1]=i
        }
    }

    function TA_Course_Remover()
    {
        for(var i=TAs_Temp.TA_num;i<5;i++)
        {
            TAs_Temp.TA_Emails[i]=""
            TAs_Temp.Courses[i]=""
        }
    }


    const Save_Changes = async() =>
    {
        var all_TAs_flag=0;
        var all_courses_flag=0;
        var duplicate_TAs_flag=0;
    
        for(var i=0;i<TAs_Temp.TA_num;i++)
        {
            
            if(!TAs_Temp.TA_Emails[i])
                all_TAs_flag=1
            if(!TAs_Temp.Courses[i])
                all_courses_flag=1
            for(var j=0;j<TAs_Temp.TA_num;j++)
            {
                if(i!=j&&TAs_Temp.TA_Emails[i]!=""&&TAs_Temp.TA_Emails[j]!=""&&TAs_Temp.TA_Emails[i]==TAs_Temp.TA_Emails[j])
                    duplicate_TAs_flag=1;
            }
        }
        if(all_TAs_flag==1)
        {
            setPopupMessage("Please enter all TAs");
            setPopup(true);
        }
        else if(all_courses_flag==1)
        {
            setPopupMessage("Please enter all courses");
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
            TAs_Temp.Email=faculty.email
            const data = {
                Email:TAs_Temp.Email,
                TA_Emails:TAs_Temp.TA_Emails,
                Course_Codes:TAs_Temp.Courses

            }
            await axios.post("http://localhost:9000/Map_TA_Faculty", data, { withCredentials: true }).then(res=>
            {
                setLoadingPopup(false);
                setSuccess(res.data.success);
                setPopupMessage(res.data.message);
                setPopup(true);
                TAs_Temp.TA_num=0;
                TAs_Temp.TA_Emails=[""];
                TAs_Temp.Email = "";
                TAs_Temp.Courses=[""];
                setUpdate(1);  
            })
        }
    } 

    return (
        <div>
        <Header login_state={props} type={"Admin"}/>
        <div className='faculty_box'>
            <center>
            <h1>{faculty.name}</h1>
            <br/>
            <img src={faculty.image_url} height="200" max-width="650"/>
            <br/>
            <br/>
            <br/>
            <div className='details'>
                <h3>Department &emsp;: &emsp;{faculty.dept}</h3>
                <br/>
                <h3>Contact Number &emsp;: &emsp;{faculty.phone_num}</h3>
                <br/>
                <h3>TAs Required &emsp;: &emsp;{faculty.TAs_Req==-1?"Not mentioned":faculty.TAs_Req}</h3>
                <br/>
                <h3>TAs Allotted &emsp;: &emsp;{faculty.TA_Emails.filter(TA_Email => TA_Email!="").length}</h3>
                <br/>
                <h3>Course(s) Offered &emsp;: &emsp; {faculty.courses.filter(course => course!="").map((course)=>(<h3>{course}</h3>))}</h3>
                <br/>
                <br/>
                <h2>Student Requests for Teaching Assistantship :-</h2>
                {
                    TA_requests && TA_requests.data.map((TA_request) => 
                    (
                        <h3>{TA_request.name} &emsp;-&emsp;  {TA_request.course1}, {TA_request.course2}, {TA_request.course3}</h3>
                    ))
                }
                <br/>
                <br/>
                
                <br/>
            </div>
            <h2>STUDENT ALLOTMENT</h2>
            <br/>
            <div className='details'>
            {ArrSetter()}
            {Arr2Setter()}
            {TA_Course_Remover()}
            <h3>Number of TAs &emsp;: <br/>
                <select name="TA_num" className='details_input' onChange={HandleChange} value={TAs_Temp.TA_num}>
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
                            <select name={"TA"+el} className='details_input' onChange={HandleChange}>
                                <option value=""></option>
                                {
                                    TAs && TAs.data.map((el) => 
                                    (
                                        <option value={el.email}>{el.name}</option>     
                                    ))
                                    
                                }
                            </select>
                        </h3>
                        <h3 key={i}>Course {el} &emsp;: <br/>
                            <select name={"C"+el} className='details_input' onChange={HandleChange}>
                                <option value=""></option>
                                {

                                    faculty.courses.filter(course => course!="").map((course) => 
                                    (
                                        <option value={course}>{course}</option>
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
            <div className={TAs_Temp.TA_num==0 ? 'ncbtn' : 'btn'} onClick={TAs_Temp.TA_num==0 ? null : Save_Changes}>ALLOT</div>
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

export default Faculty_Page