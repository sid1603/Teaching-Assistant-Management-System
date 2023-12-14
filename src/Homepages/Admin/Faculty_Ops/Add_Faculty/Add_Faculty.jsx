import React,{useEffect, useState} from 'react'
import Header from '../../../../Header/header.jsx'
import './Add_Faculty.css'
import Popup from 'reactjs-popup' 
import { CircularProgress } from '@mui/material';
import Papa from 'papaparse'
import { Link } from 'react-router-dom'
import { useContext } from 'react';
import {userContext} from '../../../../App.jsx'
import axios from 'axios';

const Add_Faculty = (props) => 
{

        const [userEmail,userType] = useContext(userContext);
   
  
        const [courses,set_courses] = useState("")
        const [bulk_email_flag,set_bulk_email_flag] = useState(false)
        const [bulk_phone_num_flag,set_bulk_phone_num_flag] = useState(false)
        const [bulk_tas_req_flag,set_bulk_tas_req_flag] = useState(false)
        const [bulk_course_codes_flag,set_bulk_course_codes_flag] = useState(false)
        const [duplicate_email_flag,set_duplicate_email_flag] = useState(false)
        const [duplicate_course_code_flag,set_duplicate_course_code_flag] = useState(false)
        const [missing_password_flag,set_missing_password_flag] = useState(false)

        const [no_file_flag,set_no_file_flag] = useState(true)
        const [faculty_count,set_faculty_count] = useState(0)

        //Loading Screen
        const [loadingPopup,setLoadingPopup] = useState(false);
        //Popup
        const [popup,setPopup] = useState(false);
        const [success,setSuccess] = useState(0);
        const [popupMessage,setPopupMessage] = useState(null);

        var arr=[]
        const [courseCodes,set_course_codes] = useState([])
        //Regex for checking phone number validity
        const pattern= new RegExp("[6-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]")
        const [bulk_data,set_bulk_data] = useState("")

        const [Faculty_temp,Set_Faculty_temp] = useState({
            name:"",
            email:"",
            pass:"",
            contact_num:"",
            course_num:1,
            courses:[""],
            image_url:""

        })

        const fetch_courses = async () =>
        {
            setLoadingPopup(true);
            await axios.get("http://localhost:9000/fetch_courses", { withCredentials: true }).then(res=>
            {
                set_courses(res.data.courses);
                const courseCodesReceived = res.data.courses.map(course => course.code);
                set_course_codes(courseCodesReceived);
                setLoadingPopup(false);
            })

        }
        
        useEffect(() => 
        {
            fetch_courses(); 
        },[])

        const HandleChange  = e =>  /*When someone types, its an 'event', denoted and saved in 'e' here. e.target will return where and what the change was*/
        {    
            const {name,value} = e.target;
            if(Number(name))
            {
                Faculty_temp.courses[name-1]=value
            }
            else
            {
                Set_Faculty_temp({
                    ...Faculty_temp, /* Stores the value entered by the user in the respective state variable while the rest remain as their default values ("" in this case)*/
                    [name]:value /* Depending on the name of the inputbar, its value is stored in the respective state variable*/
                    
                })
            }
            
            if(name=="course_num")
            {      
                ArrMapper();
            }
            
        }

        const ArrMapper = () =>
        {
            arr=[]
            for(var i=1;i<=Faculty_temp.course_num;i++)
            {
                arr[i-1]=i;
            }
        }
        function Course_Remover()
        {
            for(var i=Faculty_temp.course_num;i<5;i++)
            {
                Faculty_temp.courses[i]="";
            }
        }


        const Save_Changes = async() =>
        {
            if(!Faculty_temp.name)
            {
                setPopupMessage("Please enter the faculty's name");
                setPopup(true);
            } 
            else if(!Faculty_temp.email)
            {
                setPopupMessage("Please enter the faculty's Email ID");
                setPopup(true);
            }
            else if(!Faculty_temp.email.endsWith("@pilani.bits-pilani.ac.in"))
            {
               setPopupMessage("Please enter a valid BITS Email ID");
               setPopup(true);

            }
            else if(!Faculty_temp.pass)
            {
                setPopupMessage("Please enter the faculty's password");
                setPopup(true);
            } 
            else if(!Faculty_temp.contact_num)
            {
                setPopupMessage("Please enter the faculty's contact number");
                setPopup(true);
            }
            else if(!pattern.test(Faculty_temp.contact_num))
            {
                setPopupMessage("Please enter a valid contact number");
                setPopup(true);
            }
            else 
            {
                setLoadingPopup(true);
                var all_courses_flag=0;
                var duplicate_courses_flag=0;  
                for(var i=0;i<Faculty_temp.course_num;i++)
                {
                    
                    if(!Faculty_temp.courses[i])
                        all_courses_flag=1
                    for(var j=0;j<Faculty_temp.course_num;j++)
                    {
                        if(i!=j&&Faculty_temp.courses[i]!=""&&Faculty_temp.courses[j]!=""&&Faculty_temp.courses[i]==Faculty_temp.courses[j])
                        duplicate_courses_flag=1;
                    }
                }
                if(all_courses_flag==1)
                {
                    setLoadingPopup(false);
                    setPopupMessage("Please enter all courses");
                    setPopup(true);

                }
                else if(duplicate_courses_flag==1)
                {  
                    setLoadingPopup(false);
                    setPopupMessage("Courses must be different");
                    setPopup(true);

                }
                else
                {
                    const faculty = {
                        Name:Faculty_temp.name,
                        Email:Faculty_temp.email,
                        Type:"Faculty",
                        Pass:Faculty_temp.pass,
                        Contact_Num:Number(Faculty_temp.contact_num),
                        TAs_Required:-1,
                        Dept:"CSIS",
                        Courses:Faculty_temp.courses,
                        Image_URL:Faculty_temp.image_url

                    }
                    await axios.post("http://localhost:9000/Add_Faculty", faculty, { withCredentials: true }).then(res=>
                    {
                        setLoadingPopup(false);
                        setPopupMessage(res.data.message);
                        setSuccess(res.data.success);
                        setPopup(true);
                        Faculty_temp.name="";
                        Faculty_temp.email="";
                        Faculty_temp.pass="";
                        Faculty_temp.contact_num="";
                        Faculty_temp.course_num=1;
                        Faculty_temp.courses=[""];
                        Faculty_temp.image_url="";

                    })


                }
            }
        } 

        const ChangeHandler = (e) =>
        {
            // Passing file data (e.target.files[0]) to parse using Papa.parse
            set_bulk_email_flag(false);
            set_bulk_phone_num_flag(false);
            set_bulk_tas_req_flag(false);
            set_bulk_course_codes_flag(false);
            set_duplicate_email_flag(false);
            set_missing_password_flag(false);
            set_duplicate_course_code_flag(false);
            set_no_file_flag(false);
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
                        const course_codes = []
                        results.data.map((d) => 
                        {
                            col_titles.push(Object.keys(d));
                            row_values.push(Object.values(d))

                        });
                        set_faculty_count(row_values.length)
                        if(col_titles[0][0]=="Name"&&col_titles[0][1]=="Email"&&col_titles[0][2]=="Password"&&col_titles[0][3]=="Contact Number"&&col_titles[0][4]=="TAs_Req"&&col_titles[0][5]=="Course Code 1"&&col_titles[0][6]=="Course Code 2"&&col_titles[0][7]=="Course Code 3"&&col_titles[0][8]=="Course Code 4"&&col_titles[0][9]=="Course Code 5")
                        {
                            for(var i=0;i<row_values.length;i++)
                            {
                                if(!row_values[i][1].endsWith("@pilani.bits-pilani.ac.in"))
                                {
                                    set_bulk_email_flag(true);
                                    setPopupMessage("Invalid/Missing BITS email found. Please try again!");
                                    setPopup(true);
                                    break;
                                }
                                if(!pattern.test(row_values[i][3]))
                                {
                                    set_bulk_phone_num_flag(true);
                                    setPopupMessage("Invalid/Missing contact number found. Please try again!");
                                    setPopup(true);
                                    break;
                                }
                                if(row_values[i][4]&&(row_values[i][4]<-1||isNaN(row_values[i][4])))
                                {
                                    set_bulk_tas_req_flag(true);
                                    setPopupMessage("Invalid TA Requirement found. Please try again!");
                                    setPopup(true);
                                    break;
                                }
                                if(row_values[i][5]&&!courseCodes.includes(row_values[i][5])||row_values[i][6]&&!courseCodes.includes(row_values[i][6])||row_values[i][7]&&!courseCodes.includes(row_values[i][7])||row_values[i][8]&&!courseCodes.includes(row_values[i][8])||row_values[i][9]&&!courseCodes.includes(row_values[i][9]))
                                {
                                    set_bulk_course_codes_flag(true);
                                    setPopupMessage("Invalid Course Code(s) found. Please try again!");
                                    setPopup(true);
                                    break;
                                }
                                if(!row_values[i][2])
                                {
                                    set_missing_password_flag(true);
                                    setPopupMessage("One/more faculties is/are missing their password.");
                                    setPopup(true);
                                    break;
                                }
                                for(var j=5;j<10;j++)
                                {
                                    if(row_values[i][j]!="")
                                        course_codes.push(row_values[i][j]);
                                }
                                var unique_course_codes = new Set(course_codes)
                                if(unique_course_codes.size!=course_codes.length)
                                {
                                    set_duplicate_course_code_flag(true);
                                    setPopupMessage("One/more faculties have duplicate course codes among the list of courses offered by them. Please try again.");
                                    setPopup(true);
                                }

                                emails.push(row_values[i][1])
    
                            }
                            var unique_emails = new Set(emails)
                            if(unique_emails.size!=emails.length)
                            {
                                set_duplicate_email_flag(true);
                                setPopupMessage("Duplicate emails found. Please try again.");
                                setPopup(true);
                            }
                            set_bulk_data(row_values);
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
                set_no_file_flag(true);
            }
            
        }

        
        const Bulk_Upload = async() => 
        {
            setLoadingPopup(true);
            if(bulk_phone_num_flag==false&&bulk_email_flag==false&&bulk_tas_req_flag==false&&bulk_course_codes_flag==false&&no_file_flag==false&&missing_password_flag==false&&duplicate_email_flag==false&&duplicate_course_code_flag==false)
            {
                const faculty = {
                    Names:[],
                    Emails:[],
                    Types:[],
                    Passes:[],
                    Contact_Nums:[],
                    TAs_Required:[],
                    Depts:[],
                    Courses:[]

                }
                for(var i=0;i<faculty_count;i++)
                {
                    const Courses = [bulk_data[i][5],bulk_data[i][6],bulk_data[i][7],bulk_data[i][8],bulk_data[i][9]]
                    faculty.Names.push(bulk_data[i][0]);
                    faculty.Emails.push(bulk_data[i][1]);
                    faculty.Types.push("Faculty");
                    faculty.Passes.push(bulk_data[i][2]);
                    faculty.Contact_Nums.push(Number(bulk_data[i][3]));
                    faculty.TAs_Required.push(bulk_data[i][4]);
                    faculty.Depts.push("CSIS");
                    faculty.Courses.push(Courses);
                }
                
                await axios.post("http://localhost:9000/Add_Faculty_in_Bulk", faculty, { withCredentials: true }).then(res=>
                {

                    for(var i=0;i<res.data.errs.length;i++)
                        console.log("Faculty (with Email ID ",res.data.emailsErr[i],") could not be uploaded. Error : ",res.data.errs[i]);
                    setLoadingPopup(false);
                    setSuccess(1);
                    setPopupMessage("Faculties Successfully Added!");
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
                    <h3><Link to="/Templates/Bulk_Upload_Format_(Faculties).csv" target="_blank" download="Bulk Upload Format (Faculties)">DOWNLOAD FORMAT</Link></h3>
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
                        <h3>Name &emsp;: <br/><input type="text" name="name" placeholder="Enter Faculty Name" className='details_input' onChange={HandleChange} value={Faculty_temp.name}/></h3>
                        <br/>
                        <h3>Email &emsp;: <br/><input type="text" name="email" placeholder="Enter Faculty Email" className='details_input' onChange={HandleChange} value={Faculty_temp.email}/></h3>
                        <br/>
                        <h3>Password &emsp;: <br/><input type="text" name="pass" placeholder="Enter Faculty Password" className='details_input' onChange={HandleChange} value={Faculty_temp.pass}/></h3>
                        <br/>
                        <h3>Contact Number &emsp;: <br/><input type="Number" name="contact_num" placeholder="Enter Faculty Contact Number" className='details_input' onChange={HandleChange} value={Faculty_temp.contact_num}/></h3>
                        <br/>
                        <h3>Image URL &emsp;: <br/><input type="text" name="image_url" placeholder="Enter Faculty Image URL" className='details_input' onChange={HandleChange} value={Faculty_temp.image_url=="https://t3.ftcdn.net/jpg/03/34/83/22/360_F_334832255_IMxvzYRygjd20VlSaIAFZrQWjozQH6BQ.jpg"?"":Faculty_temp.image_url}/></h3>
                        <br/>
                        <h3>Number of Courses Offered&emsp;: <br/>
                            <select name="course_num" className='details_input' onChange={HandleChange} value={Faculty_temp.course_num}>
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
                            arr.map( (el,i) => (
                                                <h3 key={i}>Course {el} &emsp;: <br/>
                                                    <select name={el} className='details_input' onChange={HandleChange}>
                                                        <option value=""></option>
                                                        {
                                                            courses && courses.map((el) => 
                                                            (
                                                                <option value={el.code}>{el.name}</option>
                                                            ))
                                                            
                                                        }
                                                    </select>
                                                </h3>
                                                ))
                        }
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

export default Add_Faculty