import './Edit_Course_Details.css'
import Header from '../../../../../Header/header.jsx'
import { useLocation } from 'react-router-dom'
import Popup from 'reactjs-popup'
import { CircularProgress } from '@mui/material'
import { useState, useContext, useEffect} from 'react';
import {userContext} from '../../../../../App.jsx'
import axios from 'axios';


function Edit_Course_Details(props) 
{
    const location=useLocation()
    const Course_details = location.state.Course

    const [userEmail,userType] = useContext(userContext);

    const [Course_code,set_Course_code] = useState(Course_details.code)
    const [Course_name,set_Course_name]=useState(Course_details.name)
    const pattern = new RegExp("[6,7,8,9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]") 

    /* The JWT refresh token update is not reflected in the '.then' block of the previous request where the refresh token was updated, 
    so this variable stores if update is needed and calls the fetch_details function when needed */
    const [update,setUpdate] = useState(0)
    
    const [Course,SetCourse] = useState(
    {
      Course_code_new:"",
      Course_name_new:""
    })

    //Loading Screen
    const [loadingPopup,setLoadingPopup] = useState(false)
    //Popup
    const [popup,setPopup] = useState(false);
    const [success,setSuccess] = useState(0);
    const [popupMessage,setPopupMessage] = useState(null);

    const fetch_details = async () =>
    {
      axios.get(`http://localhost:9000/fetch_course?courseId=${Course_details._id}`, { withCredentials: true }).then(
        res => {
                  set_Course_code(res.data.code);
                  set_Course_name(res.data.name);
                  setUpdate(0);
               })
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

    

    const HandleChange  = e =>  /*When someone types, its an 'event', denoted and saved in 'e' here. e.target will return where and what the change was*/
    {    
        const {name,value} = e.target
        SetCourse({
            ...Course, /* Stores the value entered by the TA in the respective state variable while the rest remain as their default values ("" in this case)*/
            [name]:value /* Depending on the name of the inputbar, its value is stored in the respective state variable*/
        })
    }

    const Save_Changes = async () =>
    {
        const {Course_code_new,Course_name_new} = Course;
        if(!Course_code_new&&!Course_name_new)
        {
            setPopupMessage("Please enter new data");
            setPopup(true);
        }
        else if(Course_name_new==Course_name&&Course_name_new)
        {
            setPopupMessage("Entered course name matches the existing one.");
            setPopup(true);
        }
        else if(Course_code_new==Course_code&&Course_code_new)
        {
            setPopupMessage("Entered course code matches the existing one.");
            setPopup(true);
        }
        else
        {
            setLoadingPopup(true);
            const courseDetails = 
            {
              courseCode:Course_code,
              Course_name_new:Course_name_new,
              Course_code_new:Course_code_new
            }
            await axios.put("http://localhost:9000/Update_Course_Details", courseDetails, { withCredentials: true })
            .then( res=> {
                            setLoadingPopup(false);
                            setSuccess(res.data.success)
                            setPopupMessage(res.data.message);
                            setPopup(true);
                            Course.Course_code_new="";
                            Course.Course_name_new="";
                            setUpdate(1);
                         })
        }
    }

    return(
        <div>
            
            <Header login_state={props} type={"ADMIN"}/>
              <div className='profile_box'>
                <center><h1>{Course_name}</h1>
                <br/>
                <div className='details'>                
                  <br/>
                  <h3>Course Name &emsp;: &emsp;{Course_name} <br/><input name="Course_name_new" type="text" placeholder="Enter New Course Name" className='details_input' onChange={HandleChange} value={Course.Course_name_new}/></h3>
                  <br/>
                  <h3>Course Code &emsp;: &emsp;{Course_code} <br/><input name="Course_code_new" type="text" placeholder="Enter New Course Code" className='details_input' onChange={HandleChange} value={Course.Course_code_new}/></h3>
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

export default Edit_Course_Details