import React from 'react'
import './profile.css'
import Header from '../../Header/header.jsx'
import { useState, useEffect } from 'react'
import Popup from 'reactjs-popup'
import { CircularProgress } from '@mui/material'
import { useContext } from 'react';
import {userContext} from '../../App.jsx';
import axios from 'axios';


function Faculty_Profile(props) 
{
    const [userEmail,userType] = useContext(userContext);
   
    const [faculty_name,set_faculty_name]=useState("")
    const [faculty_dept,set_dept]=useState("")
    const [faculty_phone_num,set_phone_num]=useState("")
    const [faculty_TAs_Req,set_TAs_Req]=useState("")
    const [courses,set_courses] = useState([])
    const [TA_Emails,set_TA_Emails] = useState([])
    const [image_url,set_image_url] = useState("")
    const [TA_Names,set_TA_Names]=useState(["","","","",""])
    var arr=[]
    const [pass_copy,set_pass_copy] =useState("")
    const pattern = new RegExp("[6,7,8,9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]") 

    const [faculty,Setfaculty] = useState(
    {
        email:"",
        faculty_name_new:"",
        faculty_phone_num_new:"",
        faculty_TAs_Req_new:"",
        faculty_image_url_new:"",
        faculty_pass_new:""
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

    const fetch_details = async() =>
    {
        axios.post("http://localhost:9000/Faculty_Profile",props, { withCredentials: true }).then(async(res) => 
        {
            set_faculty_name(res.data.name)
            set_TAs_Req(res.data.TAs_Req)
            set_image_url(res.data.image_url)
            set_phone_num(res.data.phone_num)
            set_dept(res.data.dept)
            set_courses(res.data.courses)
            set_TA_Emails(res.data.TA_Emails)
    
            await axios.get(`http://localhost:9000/fetch_TAs_email_array?emails=${res.data.TA_Emails}`, { withCredentials: true }).then(response=>
            {
                set_details_2(response,res.data.TA_Emails)
                setUpdate(0);
            })
        })
       
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

    

    const HandleChange  = e =>  /*When someone types, its an 'event', denoted and saved in 'e' here. e.target will return where and what the change was*/
    {    
        const {name,value} = e.target
        if(name=="pass_copy")
        {
          set_pass_copy(value);
        }
        else
        {
            Setfaculty({
                ...faculty, /* Stores the value entered by the faculty in the respective state variable while the rest remain as their default values ("" in this case)*/
                [name]:value /* Depending on the name of the inputbar, its value is stored in the respective state variable*/
            })
        }
    }

    const Save_Changes = () =>
    {
        const {email,faculty_name_new,faculty_phone_num_new,faculty_TAs_Req_new,faculty_image_url_new,faculty_pass_new} = faculty
        faculty.email=props.email
        if(!faculty_name_new&&!faculty_phone_num_new&&!faculty_TAs_Req_new&&!faculty_image_url_new&&!faculty_pass_new)
        {
            setPopupMessage("Please enter new data");
            setPopup(true);
        }
        else if(faculty_TAs_Req_new==faculty_TAs_Req&&faculty_TAs_Req_new)
        {
            setPopupMessage("Entered TA requirement matches the existing one.");
            setPopup(true);
        }
        else if(faculty_name_new==faculty_name&&faculty_name_new)
        {
            setPopupMessage("Entered name matches the existing one.");
            setPopup(true);
        }
        else if(faculty_phone_num_new==faculty_phone_num&&faculty_phone_num_new)
        {
            setPopupMessage("Entered phone number matches the existing one.");
            setPopup(true);
        }
        else if(faculty_image_url_new==faculty_image_url_new&&faculty_image_url_new)
        {
            setPopupMessage("Entered image URL matches the existing one.");
            setPopup(true);
        }
        else if(!pattern.test(faculty_phone_num_new)&&faculty_phone_num_new)
        {
            setPopupMessage("Please enter a valid phone number");
            setPopup(true);
        }
        else if(faculty.faculty_pass_new != pass_copy)
        {
            setPopupMessage("Please repeat the password correctly.");
            setPopup(true);
        }
        else
        {
            setLoadingPopup(true);
            axios.put("http://localhost:9000/Update_Faculty_Profile", faculty, { withCredentials: true }).then( res=> 
            {
                setLoadingPopup(false);
                setSuccess(res.data.success);
                setPopupMessage(res.data.message);
                setPopup(true);
                faculty.email="";
                faculty.faculty_name_new="";
                faculty.faculty_phone_num_new="";
                faculty.faculty_TAs_Req_new="";
                faculty.faculty_image_url_new="";
                faculty.faculty_pass_new="";
                set_pass_copy("");
                setUpdate(1);
            })
        }

    }



    return(
        <div>        
            <Header login_state={props} type={"FACULTY"}/>
              <div className='profile_box'>
                <center><h1>My Profile</h1>
                <br/>
                <img src={image_url} height="200" max-width="650"/>
                <div className='details'>                
                  <br/>
                  <h3>Name &emsp;: &emsp;{faculty_name}<br/><input type="text" name="faculty_name_new" placeholder="Enter New Name" className='details_input' onChange={HandleChange} value={faculty.faculty_name_new}/></h3>
                  <br/>
                  <h3>Email &emsp;: &emsp;{props.email}</h3>
                  <br/>
                  <h3>Image URL &emsp;: <br/><input name="faculty_image_url_new" type="text" placeholder="Enter Profile Image URL" className='details_input' onChange={HandleChange} value={faculty.faculty_image_url_new}/></h3>
                  <br/>
                  <h3>Phone Number &emsp;: &emsp;{faculty_phone_num}<br/><input name="faculty_phone_num_new" type="text" placeholder="Enter New Phone Number" className='details_input' onChange={HandleChange} value={faculty.faculty_phone_num_new}/></h3>
                  <br/>
                  <h3>Department &emsp;: &emsp;{faculty_dept}</h3>
                  <br/>
                  <br/>
                  <h3>New Password &emsp;: &emsp;<br/><input name="faculty_pass_new" placeholder="Enter New Password" className='details_input' onChange={HandleChange} value={faculty.faculty_pass_new}/></h3>
                  <br/>
                  <input name="pass_copy" placeholder="Repeat Password" className='details_input' onChange={HandleChange} value={pass_copy}/>
                  <br/>
                  <br/>
                  <h3>TAs Required &emsp;: &emsp;{faculty_TAs_Req==-1?"NA":faculty_TAs_Req}<br/><input name="faculty_TAs_Req_new" type="Number" placeholder="Enter TAs Required" className='details_input' onChange={HandleChange} value={faculty.faculty_TAs_Req_new}/></h3>
                  <br/>
                  <h2>Course(s) Offered &emsp;:- &emsp;</h2>{courses.filter(course => course!="").map((course)=>(<h3>{course}</h3>))}<br/>
                  {Arrays_Mapper()}
                  <h2>Current TA(s) &emsp;:- &emsp;</h2>
                    {
                        arr.filter(el => el[0]!=''&&el[1]!='').map( (Value) => 
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

export default Faculty_Profile