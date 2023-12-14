import React from 'react'
import './profile.css'
import Header from '../../../Header/header.jsx'
import { useState } from 'react'
import Popup from 'reactjs-popup'
import { CircularProgress } from '@mui/material'
import { useContext,useEffect} from 'react';
import {userContext} from '../../../App.jsx'
import axios from 'axios';


function TA_Profile(props) 
{
  
    const [userEmail,userType] = useContext(userContext);
   
    const [TA_name,set_TA_name]=useState("")
    const [TA_dept,set_dept]=useState("")
    const [TA_image_url,set_image_url] = useState("")
    const [TA_phone_num,set_phone_num]=useState("")
    const [pass_copy,set_pass_copy] =useState("")

    const pattern = new RegExp("[6,7,8,9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]") 

    const [TA,SetTA] = useState(
    {
        email:"",
        TA_name_new:"",
        TA_phone_num_new:"",
        TA_image_url_new:"",
        TA_pass_new:""
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
      axios.post("http://localhost:9000/TA_Profile",props, { withCredentials: true }).then(res => 
      {
          set_TA_name(res.data.name)
          set_phone_num(res.data.phone_num)
          set_image_url(res.data.image_url)
          set_dept(res.data.dept)
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
        if(name=="pass_copy")
        {
          set_pass_copy(value);
        }
        else
        {
            SetTA({
                ...TA, /* Stores the value entered by the TA in the respective state variable while the rest remain as their default values ("" in this case)*/
                [name]:value /* Depending on the name of the inputbar, its value is stored in the respective state variable*/
            })
        }
    }

    const Save_Changes = () =>
    {
      const {email,TA_name_new,TA_phone_num_new,TA_image_url_new,TA_pass_new} = TA
      TA.email=props.email
      if(!TA_name_new&&!TA_phone_num_new&&!TA_image_url_new&&!TA_pass_new)
      {
        setPopupMessage("Please enter new data");
        setPopup(true);
      }
      else if(TA_name_new==TA_name&&TA_name_new)
      {
        setPopupMessage("Entered name matches the existing one.");
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
      else if(TA.TA_pass_new != pass_copy)
      {
        setPopupMessage("Please repeat the password correctly.");
        setPopup(true);
      }
      else
      {
        setLoadingPopup(true);
        axios.put("http://localhost:9000/Update_TA_Profile", TA, { withCredentials: true }).then( res=> 
        {
          setLoadingPopup(false);
          setSuccess(res.data.success);
          setPopupMessage(res.data.message);
          setPopup(true);
          TA.email="";
          TA.TA_name_new="";
          TA.TA_phone_num_new="";
          TA.TA_image_url_new="";
          TA.TA_pass_new="";
          set_pass_copy("");
          setUpdate(1);
        })
      }
    }



    return(
        <div>
            
            <Header login_state={props} type={"TA"}/>
              <div className='profile_box'>
                <center><h1>My Profile</h1>
                <br/>
                <img src={TA_image_url} height="200" max-width="650"/>
                <div className='details'>                
                  <br/>
                  <h3>Name &emsp;: &emsp;{TA_name}<br/><input type="text" name="TA_name_new" placeholder="Enter New Name" className='details_input' onChange={HandleChange} value={TA.TA_name_new}/></h3>
                  <br/>
                  <h3>Email &emsp;: &emsp;{props.email}</h3>
                  <br/>
                  <h3>Image URL &emsp;: <br/><input name="TA_image_url_new" type="text" placeholder="Enter Profile Image URL" className='details_input' onChange={HandleChange} value={TA.TA_image_url_new}/></h3>
                  <br/>
                  <h3>Phone Number &emsp;: &emsp;{TA_phone_num}<br/><input name="TA_phone_num_new" type="text" placeholder="Enter New Phone Number" className='details_input' onChange={HandleChange} value={TA.TA_phone_num_new}/></h3>
                  <br/>
                  <h3>Department &emsp;: &emsp;{TA_dept}</h3>
                  <br/>
                  <br/>
                  <h3>New Password &emsp;: &emsp;<br/><input name="TA_pass_new" placeholder="Enter New Password" className='details_input' onChange={HandleChange} value={TA.TA_pass_new}/></h3>
                  <br/>
                  <input name="pass_copy" placeholder="Repeat Password" className='details_input' onChange={HandleChange} value={pass_copy}/>
                  <br/>
                  <br/>
                </div>
                <div className='btn' onClick={Save_Changes}>Save</div>
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

export default TA_Profile