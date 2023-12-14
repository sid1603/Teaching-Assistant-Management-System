import React,{useState} from 'react'
import Header from '../../../../Header/header.jsx'
import './Add_TA.css'
import Popup from 'reactjs-popup' 
import { CircularProgress } from '@mui/material';
import Papa from 'papaparse'
import {Link} from 'react-router-dom'
import { useContext } from 'react'
import {userContext} from '../../../../App.jsx'
import axios from 'axios';

const Add_TA = (props) => 
{
    
        const [userEmail,userType] = useContext(userContext);
    
        const [bulk_email_flag,set_bulk_email_flag] = useState(false)
        const [bulk_phone_num_flag,set_bulk_phone_num_flag] = useState(false)
        const [duplicate_email_flag,set_duplicate_email_flag] = useState(false)
        const [missing_password_flag,set_missing_password_flag] = useState(false)
        const [no_file_flag,set_no_file_flag] = useState(false)
        const [student_count,set_student_count] = useState(0);

        //Loading Screen
        const [loadingPopup,setLoadingPopup] = useState(false);
        //Popup
        const [popup,setPopup] = useState(false);
        const [success,setSuccess] = useState(0);
        const [popupMessage,setPopupMessage] = useState(null);

        //Regex for checking phone number validity
        const pattern= new RegExp("[6-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]")
        const [bulk_data,set_bulk_data] = useState("")
        const [TA_temp,Set_TA_temp] = useState({
            name:"",
            email:"",
            pass:"",
            contact_num:"",
        })

        const HandleChange  = e =>  /*When someone types, its an 'event', denoted and saved in 'e' here. e.target will return where and what the change was*/
        {    
            const {name,value} = e.target
            Set_TA_temp({
                ...TA_temp, /* Stores the value entered by the user in the respective state variable while the rest remain as their default values ("" in this case)*/
                [name]:value /* Depending on the name of the inputbar, its value is stored in the respective state variable*/
            })
            
        }

        const Save_Changes = async() =>
        {
            if(!TA_temp.name)
            {
                setPopupMessage("Please enter the student's name");
                setPopup(true);
            } 
            else if(!TA_temp.email)
            {
                setPopupMessage("Please enter the student's Email ID");
                setPopup(true);
            }
            else if(!TA_temp.email.endsWith("@pilani.bits-pilani.ac.in"))
            {
                setPopupMessage("Please enter a valid BITS Email ID");
                setPopup(true);
            }
            else if(!TA_temp.pass)
            {
                setPopupMessage("Please enter the student's password");
                setPopup(true);
            } 
            else if(!TA_temp.contact_num)
            {
                setPopupMessage("Please enter the student's contact number");
                setPopup(true);
            }
            else if(!pattern.test(TA_temp.contact_num))
            {
                setPopupMessage("Please enter a valid contact number");
                setPopup(true);
            }
            else
            {
                setLoadingPopup(true);
                const TA = {
                    Name:TA_temp.name,
                    Email:TA_temp.email,
                    Type:"TA",
                    Pass:TA_temp.pass,
                    Contact_Num:Number(TA_temp.contact_num),
                    Dept:"CSIS",
                    Application_Status:"Yet to Apply"
                }
                await axios.post("http://localhost:9000/Add_TA", TA, { withCredentials: true }).then(res=>
                {
                    setLoadingPopup(false);
                    setSuccess(res.data.success);
                    setPopupMessage(res.data.message);
                    setPopup(true);
                    TA_temp.name="";
                    TA_temp.email="";
                    TA_temp.pass="";
                    TA_temp.contact_num="";   
                })
      
                
            }
        }

        const ChangeHandler = (e) =>
        {
            // Passing file data (e.target.files[0]) to parse using Papa.parse
            set_bulk_email_flag(false)
            set_bulk_phone_num_flag(false)
            set_duplicate_email_flag(false)
            set_missing_password_flag(false)
            set_no_file_flag(false)
            try 
            {
                Papa.parse(e.target.files[0], 
                {
                    
                    header: true,
                    skipEmptyLines: true,
                    complete: function (results) 
                    {
                        const col_titles = []
                        const row_values = []
                        const emails = []
                        results.data.map((d) => 
                        {
                            col_titles.push(Object.keys(d));
                            row_values.push(Object.values(d))

                        });
                        set_student_count(row_values.length)
                        if(col_titles[0][0]=="Name"&&col_titles[0][1]=="Email"&&col_titles[0][2]=="Password"&&col_titles[0][3]=="Contact Number")
                        {
                            
                            for(var i=0;i<row_values.length;i++)
                            {
                                if(!row_values[i][1].endsWith("@pilani.bits-pilani.ac.in"))
                                {
                                    set_bulk_email_flag(true)
                                    setPopupMessage("Invalid BITS email found. Please try again!");
                                    setPopup(true);
                                    
                                    break;
                                }
                                if(!pattern.test(row_values[i][3]))
                                {
                                    set_bulk_phone_num_flag(true)
                                    setPopupMessage("Invalid contact number found. Please try again!");
                                    setPopup(true);
                                    break;
                                }
                                if(!row_values[i][2])
                                {
                                    set_missing_password_flag(true)
                                    setPopupMessage("One/more student(s) is/are missing their password.");
                                    setPopup(true);
                                    break;
                                }
                                emails.push(row_values[i][1])
    
                            }
                            var unique_emails = new Set(emails)
                            if(unique_emails.size!=emails.length)
                            {
                                set_duplicate_email_flag(true)
                                setPopupMessage("Duplicate emails found. Please try again.");
                                setPopup(true);
                            }
                            set_bulk_data(row_values)
                        }
                        else
                        {
                            setPopupMessage("Incorrect format found in the uploaded file. Please try again!");
                            setPopup(true);
                        }     
                    },
                });
                
            } 
            catch (error) 
            {
                set_no_file_flag(true)
            }
            
        }

        const Bulk_Upload = async() => 
        {
            setLoadingPopup(true);
            if(bulk_phone_num_flag==false&&bulk_email_flag==false&&no_file_flag==false&&duplicate_email_flag==false&&missing_password_flag==false)
            {
                const TA = {
                    Names:[],
                    Emails:[],
                    Types:[],
                    Passes:[],
                    Contact_Nums:[],
                    Depts:[],
                    Application_Statuses:[]
                }
                for(var i=0;i<student_count;i++)
                {
                    TA.Names.push(bulk_data[i][0])
                    TA.Emails.push(bulk_data[i][1])
                    TA.Types.push("TA")
                    TA.Passes.push(bulk_data[i][2])
                    TA.Contact_Nums.push(Number(bulk_data[i][3]))
                    TA.Depts.push("CSIS")
                    TA.Application_Statuses.push("Yet to Apply")
                }
                await axios.post("http://localhost:9000/Add_TA_in_Bulk", TA, { withCredentials: true }).then(res=>
                {
                    for(var i=0;i<res.data.errs.length;i++)
                        console.log("Student (with Email ID ",res.data.emailsErr[i],") could not be uploaded. Error : ",res.data.errs[i]);
                    setLoadingPopup(false);
                    setSuccess(1);
                    setPopupMessage("Student(s) Successfully Added");
                    setPopup(true);
                })
                    
                   
            }
            else
            {
                setLoadingPopup(false);
                setPopupMessage("Please upload an appropriate file");
                setPopup(true);
            }
        }

        return(

            <div>
                <Header login_state={props} type={"Admin"}/>
                <div className='item_box'>
                    <center>
                    <h1>BULK</h1>
                    <h3><Link to="/Templates/Bulk_Upload_Format_(Students).csv" target="_blank" download="Bulk Upload Format (Students)">DOWNLOAD FORMAT</Link></h3>
                    <br/>
		            Upload File (CSV only) : &emsp;<input type="file" accept="*.csv" onChange={ChangeHandler} />
                    <br/>
                    <br/>
                    <div className='btn' onClick={Bulk_Upload}>Upload</div>
                    <br/>
                    <br/>
                    <br/>
                    <h1>INDIVIDUAL</h1>
                    <br/>
                    <div className='details'>
                        <h3>Name &emsp;: <br/><input type="text" name="name" placeholder="Enter Student Name" className='details_input' onChange={HandleChange} value={TA_temp.name}/></h3>
                        <br/>
                        <h3>Email &emsp;: <br/><input type="text" name="email" placeholder="Enter Student Email" className='details_input' onChange={HandleChange} value={TA_temp.email}/></h3>
                        <br/>
                        <h3>Password &emsp;: <br/><input type="text" name="pass" placeholder="Enter Student Password" className='details_input' onChange={HandleChange} value={TA_temp.pass}/></h3>
                        <br/>
                        <h3>Contact Number &emsp;: <br/><input type="Number" name="contact_num" placeholder="Enter Student Contact Number" className='details_input' onChange={HandleChange} value={TA_temp.contact_num}/></h3>
                        <br/>
                    </div>
                    <div className='btn' onClick={Save_Changes}>ADD</div>
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
                    <div className='export_btn' onClick={()=>{setPopup(false);setSuccess(0);}}>Ok</div>
                    <br/>
                    <br/>
                  </center>
                </Popup>


            </div>
        )
        
}

export default Add_TA