import React,{useState,useContext} from 'react'
import './Login_page.css'
import Logo from './Assets/Transparent_Logo.png'
import {Link} from 'react-router-dom'
import '../index.css'
import Popup from 'reactjs-popup'
import { CircularProgress } from '@mui/material'
import {useNavigate} from 'react-router-dom'
import {userContext} from '../App.jsx'
import secureLocalStorage from 'react-secure-storage'
import axios from 'axios';


function Login_page(props)
{
    let navigate = useNavigate()
    const [userEmail,setUserEmail,userType,setUserType,userAccessToken,setUserAccessToken,userRefreshToken,setUserRefreshToken] = useContext(userContext);

    const [b1,set_b1] = useState(1)
    const [b2,set_b2] = useState(0)
    const [b3,set_b3] = useState(0)    

    /* Tracking states */
    const [user,Setuser] = useState({
        email:"",
        pass:"",
        type:"TA"
    })

    //Loading Screen
    const [loadingPopup,setLoadingPopup] = useState(false);
    //Popup
    const [popup,setPopup] = useState(false);
    const [popupMessage,setPopupMessage] = useState(null);
    const [success,setSuccess]= useState(0);

    /* Saving entered values */
    const HandleChange  = e =>  /*When someone types, its an 'event', denoted and saved in 'e' here. e.target will return where and what the change was*/
    {    
        const {name,value} = e.target
        Setuser({
            ...user, /* Stores the value entered by the user in the respective state variable while the rest remain as their default values ("" in this case)*/
            [name]:value /* Depending on the name of the inputbar, its value is stored in the respective state variable*/
        })
        if(value=="TA")
        {
            set_b1(1)
            set_b2(0)
            set_b3(0)
        }
        else if(value=="Faculty")
        {
            set_b1(0)
            set_b2(1)
            set_b3(0)
           
        }
        else if(value=="Admin")
        {
            set_b1(0)
            set_b2(0)
            set_b3(1)
      
        }
    }


    const login = () =>
    {
        const {email,pass,type} = user
        if(!email)
        {
            setPopupMessage("Please enter username (BITS email ID)");
            setPopup(true);
        }
        else if(!pass)
        {
            setPopupMessage("Please enter password");
            setPopup(true);
        }
        else if(!email.endsWith("@pilani.bits-pilani.ac.in"))
        {
           setPopupMessage("Please enter a valid BITS ID");
           setPopup(true);
        }
        else
        {  
            /*
            We do not need to refresh any token here so we use axiosLogin (a new instance of axios) instead of "axios" 
            as that would be intercepted and checked for the token but it doesn't exist yet as the user has 
            not logged in
            */
           setLoadingPopup(true);
            axios.post("http://localhost:9000/Login", user, { withCredentials: true })
            .then(res => {
                            setSuccess(res.data.success);
                            setLoadingPopup(false);
                            if(res.data.success==1)
                            {
                                secureLocalStorage.setItem('userEmail',res.data.userEmail.toLowerCase())
                                secureLocalStorage.setItem('userType',res.data.userType)
                                props.setUserEmail(res.data.userEmail.toLowerCase())
                                props.setUserType(res.data.userType)
                                navigate("/",{replace:true})
                            }
                            else
                            {
                                setPopupMessage(res.data.message);
                                setPopup(true);
                            }
                            
                      })
        }
    }


    return(
        <div className='bg_image'>
            <center>
            <img src={Logo} alt="Logo" width="200rem" className="logo"/>
            <span className='central_title'>Teaching Assistantship Management System</span>
            </center>
            <div className='login_box'>
            <h1 color='black'>LOGIN</h1>
            <form>
                <span>
                    <input type="button" className={b1 ? 'selected_btn'  : 'select_btn'} name="type" value="TA" onClick={HandleChange} /> &emsp;
                    <input type="button" className={b2 ? 'selected_btn'  : 'select_btn'} name="type" value="Faculty" onClick={HandleChange}/> &emsp;
                    <input type="button" className={b3 ? 'selected_btn'  : 'select_btn'} name="type" value="Admin" onClick={HandleChange}/>
                </span>
                <label>
                    Username : <input
                                     className='inputbar'
                                     name="email"
                                     pattern=".+@pilani.bits-pilani.ac.in"
                                     value={user.email}
                                     onChange={HandleChange}
                                     type="email" 
                                     placeholder='Please enter your BITS Email ID'
                                />
                </label>         
                <label>
                    Password : <input 
                                     className='inputbar'
                                     name="pass"
                                     value={user.pass} 
                                     onChange={HandleChange} 
                                     type="password"
                                     placeholder='Please enter password'
                                />
                </label>
                <div className='btn' onClick={login}>Login</div>
                <br/>
                <Link to='/Recover_pass'>Forgot password ?</Link>
            </form>
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
            <br/>
        </div>
        );
    
}

export default Login_page