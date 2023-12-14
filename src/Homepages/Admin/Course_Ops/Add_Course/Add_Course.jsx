import React,{useState} from 'react'
import Header from '../../../../Header/header.jsx'
import Papa from 'papaparse'
import {Link} from 'react-router-dom'
import { useContext } from 'react'
import {userContext} from '../../../../App.jsx'
import Popup from 'reactjs-popup' 
import { CircularProgress } from '@mui/material';
import axios from 'axios';

const Add_Course = (props) => 
{
        const [userEmail,userType] = useContext(userContext);
        const [duplicate_course_code_flag,set_duplicate_course_code_flag] = useState(false)
        const [no_file_flag,set_no_file_flag] = useState(true)
        const [course_count,set_course_count] = useState(0)

        //Regex for checking phone number validity
        const pattern= new RegExp("[6-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]")
        const [bulk_data,set_bulk_data] = useState("")
        const [Course_temp,Set_Course_temp] = useState({
            name:"",
            code:"",
        })

        //Loading Screen
        const [loadingPopup,setLoadingPopup] = useState(false)

        //Popup
        const [popup,setPopup] = useState(false);
        const [success,setSuccess] = useState(0);
        const [popupMessage,setPopupMessage] = useState(null);

        const HandleChange  = e =>  /*When someone types, its an 'event', denoted and saved in 'e' here. e.target will return where and what the change was*/
        {    
            const {name,value} = e.target;
            Set_Course_temp({
                ...Course_temp, /* Stores the value entered by the user in the respective state variable while the rest remain as their default values ("" in this case)*/
                [name]:value /* Depending on the name of the inputbar, its value is stored in the respective state variable*/
            })
            
        }

        const Save_Changes = async() =>
        {
            if(!Course_temp.name)
            {
                setPopupMessage("Please enter the course's name");
                setPopup(true);
            } 
            else if(!Course_temp.code)
            {
                setPopupMessage("Please enter the course's code");
                setPopup(true);
            }
            else
            {
                setLoadingPopup(true);
                const course={course_name: Course_temp.name,course_code: Course_temp.code};
                await axios.post("http://localhost:9000/Add_Course", course, { withCredentials: true }).then(res=>{
                    
                    setLoadingPopup(false);
                    setSuccess(res.data.success)
                    setPopupMessage(res.data.message);
                    setPopup(true);
                    Course_temp.name="";
                    Course_temp.code="";
                })
                                 
            }
        }



        const ChangeHandler = (e) =>
        {
            // Passing file data (e.target.files[0]) to parse using Papa.parse
            set_duplicate_course_code_flag(false)
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
                        const course_codes = []
                        results.data.map((d) => 
                        {
                            col_titles.push(Object.keys(d));
                            row_values.push(Object.values(d))

                        });
                        set_course_count(row_values.length)
                        if(col_titles[0][0]=="Course Name"&&col_titles[0][1]=="Course Code")
                        {
                            
                            for(var i=0;i<row_values.length;i++)
                            {
                                course_codes.push(row_values[i][1])
    
                            }
                            var unique_course_codes = new Set(course_codes)
                            if(unique_course_codes.size!=course_codes.length)
                            {
                                set_duplicate_course_code_flag(true)
                                setPopupMessage("Duplicate course codes found. Please try again.");
                                setPopup(true);                                
                            }
                            set_bulk_data(row_values)
                        }
                        else
                        {
                            setPopupMessage("Incorrect format found in the uploaded file. Please try again!")
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
            if(no_file_flag==false&&duplicate_course_code_flag==false)
            {
                const course = {
                    Names:[],
                    Codes:[]
                }
                for(var i=0;i<course_count;i++)
                {
                    course.Names.push(bulk_data[i][0]);
                    course.Codes.push(bulk_data[i][1]);
                }      
                await axios.post("http://localhost:9000/Add_Course_in_Bulk", course, { withCredentials: true }).then(res=>
                {
                    for(var i=0;i<res.data.errs.length;i++)
                        console.log("Course (with Course code ",res.data.codesErr[i],") could not be uploaded. Error : ",res.data.errs[i]);
                    setLoadingPopup(false);
                    setSuccess(1);
                    setPopupMessage("Course(s) Uploaded!");
                    setPopup(true);
                })
                    
            }
            else
            {
                setLoadingPopup(false);
                setPopupMessage("Please upload an appropriate file.");
                setPopup(true);
            }
        }


        return(

            <div>
                <Header login_state={props} type={"Admin"}/>
                <div className='item_box'>
                    <center>
                    <h1>BULK</h1>
                    <h3><Link to="/Templates/Bulk_Upload_Format_(Courses).csv" target="_blank" download="Bulk Upload Format (Courses)">DOWNLOAD FORMAT</Link></h3>
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
                        <h3>Course Name &emsp;: <br/><input type="text" name="name" placeholder="Enter Course Name" className='details_input' onChange={HandleChange} value={Course_temp.name}/></h3>
                        <br/>
                        <h3>Course Code &emsp;: <br/><input type="text" name="code" placeholder="Enter Course Code" className='details_input' onChange={HandleChange} value={Course_temp.code}/></h3>
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

export default Add_Course