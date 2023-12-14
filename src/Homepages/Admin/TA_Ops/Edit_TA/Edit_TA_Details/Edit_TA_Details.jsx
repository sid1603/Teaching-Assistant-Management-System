import React from 'react'
import './Edit_TA_Details.css'
import Header from '../../../../../Header/header.jsx'
import { useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Popup from 'reactjs-popup'
import { CircularProgress } from '@mui/material'
import { useContext } from 'react';
import {userContext} from '../../../../../App.jsx'
import axios from 'axios';


function Edit_TA_Details(props) 
{
    const location=useLocation()
    const TA_details = location.state.TA

    const [userEmail,userType] = useContext(userContext);
    const TA_id = {id:TA_details._id};

    const [TA_email,set_TA_email] = useState(TA_details.email);
    const [TA_name,set_TA_name]=useState(TA_details.name);
    const [TA_dept,set_dept]=useState("");
    const [TA_image_url,set_image_url] = useState("");
    const [TA_phone_num,set_phone_num]=useState("");
    const pattern = new RegExp("[6,7,8,9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]");

    /* The JWT refresh token update is not reflected in the '.then' block of the previous request where the refresh token was updated, 
    so this variable stores if update is needed and calls the fetch_details function when needed */
    const [update,setUpdate] = useState(0);

    const [TA,SetTA] = useState(
    {
        TA_email_new:"",
        TA_name_new:"",
        TA_phone_num_new:"",
        TA_image_url_new:"",
        TA_dept_new:""
    })

    //Loading Screen
    const [loadingPopup,setLoadingPopup] = useState(false)

    //Popup
    const [popup,setPopup] = useState(false);
    const [success,setSuccess] = useState(0);
    const [popupMessage,setPopupMessage] = useState(null);

    const fetch_details = async () =>
    {
        axios.post("http://localhost:9000/TA_Profile",TA_id, { withCredentials: true }).then(res => 
        {
            set_TA_email(res.data.email);
            set_TA_name(res.data.name);
            set_phone_num(res.data.phone_num);
            set_image_url(res.data.image_url);
            set_dept(res.data.dept);
        })
       setUpdate(0);
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
        SetTA({
            ...TA, /* Stores the value entered by the TA in the respective state variable while the rest remain as their default values ("" in this case)*/
            [name]:value /* Depending on the name of the inputbar, its value is stored in the respective state variable*/
        })
    }

    const Save_Changes = () =>
    {
        const {email,TA_email_new,TA_name_new,TA_phone_num_new,TA_image_url_new} = TA;
        TA.email=TA_details.email;
        if(!TA_email_new&&!TA_name_new&&!TA_phone_num_new&&!TA_image_url_new)
        {
            setPopupMessage("Please enter new data");
            setPopup(true);
        }
        else if(!TA_email_new.endsWith("@pilani.bits-pilani.ac.in")&&TA_email_new)
        {
            setPopupMessage("Please enter a valid BITS ID");
            setPopup(true);
        }
        else if(TA_name_new==TA_name&&TA_name_new)
        {
            setPopupMessage("Entered name matches the existing one.");
            setPopup(true);
        }
        else if(TA_email_new==TA_email&&TA_email_new)
        {
            setPopupMessage("Entered email matches the existing one.");
            setPopup(true);
        }
        else if(TA_phone_num_new==TA_phone_num&&TA_phone_num_new)
        {
            setPopupMessage("Entered phone number matches the existing one.");
            setPopup(true);
        }
        else if(TA_image_url==TA_image_url_new&&TA_image_url_new)
        {
            setPopupMessage("Entered image URL matches the existing one.");
            setPopup(true);
        }
        else if(!pattern.test(TA_phone_num_new)&&TA_phone_num_new)
        {
            setPopupMessage("Please enter a valid phone number");
            setPopup(true);
        }
        else
        {
            axios.put("http://localhost:9000/Update_TA_Profile", TA, { withCredentials: true })
            .then( res=> 
                {
                    setPopupMessage(res.data.message);
                    setPopup(true);
                    setLoadingPopup(false);
                    setSuccess(res.data.success);
                    TA.TA_email_new="";
                    TA.TA_name_new="";
                    TA.TA_phone_num_new="";
                    TA.TA_image_url_new="";
                    TA.TA_dept_new="";
                    setUpdate(1);
                })
        }

    }



    return(
        <div>
            
            <Header login_state={props} type={"ADMIN"}/>
              <div className='profile_box'>
                <center><h1>{TA_name}</h1>
                <br/>
                <img src={TA_image_url} height="200" max-width="650"/>
                <div className='details'>                
                  <br/>
                  <h3>Name &emsp;: &emsp;{TA_name} <br/><input name="TA_name_new" type="text" placeholder="Enter New Name" className='details_input' onChange={HandleChange} value={TA.TA_name_new}/></h3>
                  <br/>
                  <h3>Email &emsp;: &emsp;{TA_email} <br/><input name="TA_email_new" type="text" placeholder="Enter New Email" className='details_input' onChange={HandleChange} value={TA.TA_email_new}/></h3>
                  <br/>
                  <h3>Image URL &emsp;: <br/><input name="TA_image_url_new" type="text" placeholder="Enter Profile Image URL" className='details_input' onChange={HandleChange} value={TA.TA_image_url_new}/></h3>
                  <br/>
                  <h3>Phone Number &emsp;: &emsp;{TA_phone_num}<br/><input name="TA_phone_num_new" type="text" placeholder="Enter New Phone Number" className='details_input' onChange={HandleChange} value={TA.TA_phone_num_new}/></h3>
                  <br/>
                  <h3>Department &emsp;: &emsp;{TA_dept}</h3>
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

export default Edit_TA_Details