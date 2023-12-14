import React from 'react'
import './Edit_Faculty_Details.css'
import Header from '../../../../../Header/header.jsx'
import { useLocation } from 'react-router-dom'
import { useState, useEffect,useContext } from 'react'
import Popup from 'reactjs-popup'
import { CircularProgress } from '@mui/material'
import {userContext} from '../../../../../App.jsx'
import axios from 'axios';


function Edit_Faculty_Details(props) 
{
    const location=useLocation()
    const Faculty_details = location.state.Faculty 

    const [userEmail,userType] = useContext(userContext);
    
    const Faculty_id = {id:Faculty_details._id}

    const [Faculty_email,set_Faculty_email] = useState(Faculty_details.email)
    const [Faculty_name,set_Faculty_name]=useState(Faculty_details.name)
    const [Faculty_TAs_Req,set_TAs_Req]=useState("")
    const [Faculty_dept,set_dept]=useState("")
    const [all_courses,set_all_courses]=useState([])
    const [Faculty_image_url,set_image_url] = useState("")
    const [Faculty_phone_num,set_phone_num]=useState("")
    const [courses,set_courses] = useState([])
    const [TA_Emails,set_TA_Emails] = useState([])
    const [TAs,set_TAs] = useState()
    const [TA_Names,set_TA_Names]=useState(["","","","",""])
    var arr=[]
    var arr2=[]
    const pattern = new RegExp("[6,7,8,9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]") 

    /* The JWT refresh token update is not reflected in the '.then' block of the previous request where the refresh token was updated, 
    so this variable stores if update is needed and calls the fetch_details function when needed */
    const [update,setUpdate] = useState(0)

    const [Faculty,Set_Faculty] = useState(
    {
        faculty_email_new:"",
        faculty_name_new:"",
        faculty_phone_num_new:"",
        faculty_image_url_new:"",
        faculty_TAs_Req_new:"",
        course_num:1,
        courses:[""]
    })
    
     //Loading Screen
     const [loadingPopup,setLoadingPopup] = useState(false)

     //Popup
     const [popup,setPopup] = useState(false);
     const [success,setSuccess] = useState(0);
     const [popupMessage,setPopupMessage] = useState(null);


     const fetch_details = async () =>
    {
        setLoadingPopup(true);
        await axios.post("http://localhost:9000/Faculty_Profile",Faculty_id, { withCredentials: true }).then(res => 
        {
            set_Faculty_email(res.data.email)
            set_Faculty_name(res.data.name)
            set_TAs_Req(res.data.TAs_Req)
            set_phone_num(res.data.phone_num)
            set_image_url(res.data.image_url)
            set_dept(res.data.dept)
            set_courses(res.data.courses)
            set_TA_Emails(res.data.TA_Emails)
        })
        await axios.get(`http://localhost:9000/fetch_TAs_email_array?emails=${Faculty_details.TA_Emails}`, { withCredentials: true }).then(response=>{set_details_2(response,Faculty_details.TA_Emails)})
        await axios.get("http://localhost:9000/fetch_courses", { withCredentials: true }).then(res=>{set_all_courses(res.data.courses)}) 
        function set_details_2(res,emails)
        {
           for(var i=0;i<emails.filter(email => email!="").length;i++)
           {
               for(var j=0;j<emails.filter(email => email!="").length;j++)
               {
                   if(res.data[j].email==emails[i])
                   {
                       TA_Names[i]=res.data[j].name
                   }
               }
           }
           arr = TA_Emails.map(function(e,i) 
           {
               return [e, TA_Names[i]];
           })
        }
        setUpdate(0);
        setLoadingPopup(false);
    }

    useEffect(() =>
    {
        fetch_details()
    },[])

    useEffect(() =>
    {
      if(update==1)
        fetch_details();
    },[update])

    function Arrays_Mapper()
    {
        
        arr = TA_Emails.map(function(e,i) 
        {
            return [e, TA_Names[i]];
        })
        
    } 
    
    

    const ArrMapper = () =>
    {
        arr2=[]
        for(var i=1;i<=Faculty.course_num;i++)
        {
            arr2[i-1]=i
        }
    }
    function Course_Remover()
    {
        for(var i=Faculty.course_num;i<5;i++)
        {
            Faculty.courses[i]=""
        }
    }


    const HandleChange  = e =>  /*When someone types, its an 'event', denoted and saved in 'e' here. e.target will return where and what the change was*/
    {    
        const {name,value} = e.target;
        if(Number(name))
        {
            Faculty.courses[name-1]=value
        }
        else
        {
            Set_Faculty({
                ...Faculty, /* Stores the value entered by the user in the respective state variable while the rest remain as their default values ("" in this case)*/
                [name]:value /* Depending on the name of the inputbar, its value is stored in the respective state variable*/
                
            })
        }
        if(name=="course_num")
        {      
            ArrMapper();
        }
    }


    const Save_Changes = () =>
    {
        const {email,faculty_email_new,faculty_name_new,faculty_phone_num_new,faculty_TAs_Req_new,faculty_image_url_new,courses} = Faculty
        Faculty.email = Faculty_details.email
        if(!faculty_email_new&&!faculty_name_new&&!faculty_phone_num_new&&!faculty_image_url_new&&!faculty_TAs_Req_new&&!courses[0])
        {
            setPopupMessage("Please enter new data");
            setPopup(true);
        }
        else if(!faculty_email_new.endsWith("@pilani.bits-pilani.ac.in")&&faculty_email_new)
        {
            setPopupMessage("Please enter a valid BITS ID");
            setPopup(true);
        }
        else if(faculty_name_new==Faculty_name&&faculty_name_new)
        {
            setPopupMessage("Entered name matches the existing one.");
            setPopup(true);
        }
        else if(faculty_email_new==Faculty_email&&faculty_email_new)
        {
            setPopupMessage("Entered email matches the existing one.");
            setPopup(true);
        }
        else if(faculty_phone_num_new==Faculty_phone_num&&faculty_phone_num_new)
        {
            setPopupMessage("Entered phone number matches the existing one.");
            setPopup(true);
        }
        else if(Faculty_image_url==faculty_image_url_new&&faculty_image_url_new)
        {
            setPopupMessage("Entered image URL matches the existing one.");
            setPopup(true);
        }
        else if(!pattern.test(faculty_phone_num_new)&&faculty_phone_num_new)
        {
            setPopupMessage("Please enter a valid phone number");
            setPopup(true);
        }
        else if(faculty_TAs_Req_new&&(isNaN(faculty_TAs_Req_new)||Faculty_TAs_Req<-1)) 
        {
            setPopupMessage("Please enter a valid TA Requirement");
            setPopup(true);
        }
        else
        {
            var all_courses_flag=0;
            var duplicate_courses_flag=0;  
            for(var i=0;i<Faculty.course_num;i++)
            {
                
                if(!Faculty.courses[i])
                    all_courses_flag=1
                for(var j=0;j<Faculty.course_num;j++)
                {
                    if(i!=j&&Faculty.courses[i]!=""&&Faculty.courses[j]!=""&&Faculty.courses[i]==Faculty.courses[j])
                    duplicate_courses_flag=1;
                }
            }
            if(courses[0]&&all_courses_flag==1)
            {

                setPopupMessage("Please enter all courses");
                setPopup(true);
            }
            else if(courses[0]&&duplicate_courses_flag==1)
            {  
                setPopupMessage("Courses must be different");
                setPopup(true);
            }
            else
            {
                setLoadingPopup(true);
                axios.put("http://localhost:9000/Update_Faculty_Profile", Faculty, { withCredentials: true })
                .then( res=> 
                    {
                        setLoadingPopup(false);
                        setSuccess(res.data.success);
                        setPopupMessage(res.data.message);
                        setPopup(true);
                        Faculty.faculty_email_new="";
                        Faculty.faculty_name_new="";
                        Faculty.faculty_phone_num_new="";
                        Faculty.faculty_image_url_new="";
                        Faculty.faculty_TAs_Req_new="";
                        Faculty.course_num=1;
                        Faculty.courses=[""];
                        setUpdate(1);
                    })
            }
        }

    }

    function render_course_options(courses)
    {    
        return ( courses && courses.map((el) => (<option value={el.code}>{el.name}</option>)) )
    }

    return(
        <div>
            
            <Header login_state={props} type={"ADMIN"}/>
              <div className='profile_box'>
                <center><h1>{Faculty_name}</h1>
                <br/>
                <img src={Faculty_image_url} height="200" max-width="650"/>
                <div className='details'>                
                  <br/>
                  <h3>Name &emsp;: &emsp;{Faculty_name} <br/><input name="faculty_name_new" type="text" placeholder="Enter New Name" className='details_input' onChange={HandleChange} value={Faculty.faculty_name_new}/></h3>
                  <br/>
                  <h3>Email &emsp;: &emsp;{Faculty_email} <br/><input name="faculty_email_new" type="text" placeholder="Enter New Email" className='details_input' onChange={HandleChange} value={Faculty.faculty_email_new}/></h3>
                  <br/>
                  <h3>Image URL &emsp;: <br/><input name="faculty_image_url_new" type="text" placeholder="Enter Profile Image URL" className='details_input' onChange={HandleChange} value={Faculty.faculty_image_url_new}/></h3>
                  <br/>
                  <h3>Phone Number &emsp;: &emsp;{Faculty_phone_num}<br/><input name="faculty_phone_num_new" type="text" placeholder="Enter New Phone Number" className='details_input' onChange={HandleChange} value={Faculty.faculty_phone_num_new}/></h3>
                  <br/>
                  <h3>Department &emsp;: &emsp;{Faculty_dept}</h3>
                  <br/>
                  <h3>TAs Required &emsp;: &emsp;{Faculty_TAs_Req==-1?"NA":Faculty_TAs_Req}<br/><input name="faculty_TAs_Req_new" type="Number" placeholder="Enter TAs Required" className='details_input' onChange={HandleChange} value={Faculty.faculty_TAs_Req_new}/></h3>
                  <br/>
                  <h2>Course(s) Offered Currently&emsp;:- &emsp;</h2>{courses.filter(course => course!="").map((course)=>(<h3>{course}</h3>))}<br/>
                  <h3>EDIT :-</h3>
                  <h3>Number of Courses Offered&emsp;: <br/>
                            <select name="course_num" className='details_input' onChange={HandleChange} value={Faculty.course_num}>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                        </h3>
                        <br/>
                        {ArrMapper()}
                        {Course_Remover()}
                        {
                            arr2.map( (el,i) => (
                                                <h3 key={i}>Course {el} &emsp;: <br/>
                                                    <select name={el} className='details_input' onChange={HandleChange}>
                                                        <option value=""></option>
                                                        {
                                                            render_course_options(all_courses)
                                                        }
                                                    </select>
                                                </h3>
                                                ))
                        }
                  <br/>
                  {Arrays_Mapper()}
                  <h2>Current TA(s) &emsp;:- &emsp;</h2>
                    {arr.filter(el => el[0]!=''&&el[1]!='').map( (Value) => 

                        (
                            <div>     
                            <h3>Name : {Value[1]}</h3>
                            <h3>Email : {Value[0]}</h3>
                            <br/>
                            </div>
                        ))
                    }
                  <br/>
                </div>
                <div className='btn' onClick={Save_Changes}>Save</div>
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

export default Edit_Faculty_Details