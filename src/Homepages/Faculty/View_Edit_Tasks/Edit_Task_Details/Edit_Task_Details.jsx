import React, {useEffect,useState} from 'react'
import Header from '../../../../Header/header.jsx'
import './Edit_Task_Details.css'
import { useLocation } from 'react-router-dom'
import Popup from 'reactjs-popup'
import { CircularProgress } from '@mui/material'
import { format, parseISO } from 'date-fns'
import { useContext } from 'react';
import {userContext} from '../../../../App.jsx'
import axios from 'axios';

const Edit_Task_Details = (props) => 
{
    const location=useLocation()
    const [task,set_task] = useState(location.state.Task)
    const [course,set_course] = useState(location.state.course)

    const [userEmail,userType] = useContext(userContext);
   
    const [TAs,set_TAs] = useState([""])
    const [Course_TAs,set_Course_TAs] = useState([""])
    const [RT, set_RT] = useState(0)
    const days = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
    const [comments,set_comments] = useState([])
    var arr=[];
    var arr2=[];
    var arr3 = [];
    var TA_Names=[]
    const TA_pattern = new RegExp("TA[0-9]")
    const Rating_pattern = new RegExp("R[0-9]")
    const Comments_pattern = new RegExp("C[0-9]")

    /* The JWT refresh token update is not reflected in the '.then' block of the previous request where the refresh token was updated, 
    so this variable stores if update is needed and calls the fetch_details function when needed */
    const [update,setUpdate] = useState(0)

    const [inputs,set_inputs] = useState({

        Rating:task.Rating,
        Comments:task.Comments
    })
    const [Task_Temp,set_Task_Temp] = useState({
        name : task.Name,
        description : task.description,
        deadline : task.deadline,
        TAs_num : 1,
        TA_Emails:[""]

    })

    //Loading Screen
    const [loadingPopup,setLoadingPopup] = useState(false)
    //Popup
    const [popup,setPopup] = useState(false);
    const [success,setSuccess] = useState(0);
    const [popupMessage,setPopupMessage] = useState(null);

    const fetch_TAs = async () =>
    {
       const result = await axios.get(`http://localhost:9000/fetch_TAs_email_array?emails=${task.TA_Emails}`, { withCredentials: true })
       set_TAs(result.data)
    }

    const fetch_course_TAs = async () =>
    {
       const result2 = await axios.get(`http://localhost:9000/fetch_TAs_by_course_faculty?Faculty_Email=${props.email}&Course_Code=${location.state.course.code}`, { withCredentials: true })
       set_Course_TAs(result2.data)
    }
    const fetch_task = async () =>
    {
        const result= await axios.get(`http://localhost:9000/fetch_task_id?id=${task._id}`, { withCredentials: true })
        set_task(result.data)
        setUpdate(0);
    }

    useEffect(() => 
    {
        fetch_TAs();
        fetch_course_TAs();
        fetch_task();
    },[]) 

    useEffect(() =>
    {
      if(update==1)
      {
        fetch_TAs()
        fetch_course_TAs()
        fetch_task();
      }
    },[update])


    const HandleChange = e =>
    {
        const {name,value} = e.target
        if(Rating_pattern.test(name))
        {
            inputs.Rating[Number(name[1])]=Number(value)
        }
        else if(Comments_pattern.test(name))
        {
            inputs.Comments[Number(name[1])]=String(value);
        }
        else if(TA_pattern.test(name))
        {
            Task_Temp.TA_Emails[name[2]-1]=value
        }
        else if(name=="RT")
        {
            set_RT(value)
        }
        else
        {
            set_Task_Temp({
                ...Task_Temp,
                [name]:value
            })
        }

        if(name=="TAs_num")
        {
            Arr2Setter()
        }

        
    }

    for(var i=0;i<task.TA_Emails.filter(email=>email!="").length;i++)
    {

        arr[i]=i;
        try
        {
            const index = task.TA_Emails.indexOf(TAs[i].email)
            try
            {
                TA_Names.push(TAs[index].name);
            }
            catch
            {
                continue;
            }
            
        }
        catch
        {
            continue;
        }
        
    }
    
    function Arr2Setter()
    {
        for(var i=0;i<=Course_TAs.length;i++)
        {
            arr2[i]=i
        }
    }

    function Arr3Setter()
    {
        arr3=[]
        for(var i=1;i<=Task_Temp.TAs_num;i++)
        {
            arr3[i-1]=i
        }
    }

    function TA_Remover()
    {
        for(var i=Task_Temp.TAs_num;i<5;i++)
        {
            Task_Temp.TA_Emails[i]=""
        }
    }
    

    const Save_Changes = async() =>
    {      
        setLoadingPopup(true);
        const details = {
            ratings:inputs.Rating,
            comments:inputs.Comments,
            id:task._id,
            name:Task_Temp.name,
            description:Task_Temp.description,
            deadline:Task_Temp.deadline
        }
        await axios.post("http://localhost:9000/Edit_Task_Faculty", details, { withCredentials: true }).then(res=>
        {
            setLoadingPopup(false);
            setSuccess(res.data.success);
            setPopupMessage(res.data.message);
            setPopup(true);
            Task_Temp.name = task.Name;
            Task_Temp.description = task.description;
            Task_Temp.deadline = task.deadline;
            Task_Temp.TAs_num = 1;
            Task_Temp.TA_Emails=[""];
            setUpdate(1);
        })
         

    }

    const Remove_TA = async(email) =>
    {
        setLoadingPopup(true);
        const details = {
            task_id:task._id,
            ta_email:email
        }
        await axios.post("http://localhost:9000/Remove_ta_from_task",details, { withCredentials: true }).then(res=>
        {
            setLoadingPopup(false);
            setSuccess(res.data.success);
            setPopupMessage(res.data.message);
            setPopup(true);
            setUpdate(1);
        })
 

    }

 
    const re_assign_tas = async() =>
    {
        setLoadingPopup(true);
        const details = {
            task_id:task._id,
            TA_Emails:Task_Temp.TA_Emails
        }
        await axios.post("http://localhost:9000/Reassign_TAs",details, { withCredentials: true }).then(res=>
        {
            setLoadingPopup(false);
            setSuccess(res.data.success);
            setPopupMessage(res.data.message);
            setPopup(true);
            setUpdate(1);
        }) 

    }
    
    return(

        <div>
        <Header login_state={props} type={"FACULTY"}/>
        <div className='faculty_box'>
            <center>
            <h1>{location.state.cname}</h1>
            <h1>({task.Course_Code})</h1>
            <br/>
            <br/>
            <h2>TASK DETAILS</h2>
            <br/>
            <div className='task_details'>
             <div className='request_container'>
                <span>
                  <h2 className='h2'>&emsp;General Details : </h2>
                  <p>&emsp;&emsp;Name :-{task.Name} <br/>&emsp;&emsp;<input type="text" name="name" placeholder="Enter New Task Name" className='task_details_input' onChange={HandleChange} value={Task_Temp.name}/></p>
                  <br/>
                  <p>&emsp;&emsp;Description :- <br/> &emsp;&emsp;{task.Description}<br/>&emsp;&emsp;<textarea name="description" rows="4" type="text" placeholder="Please Enter New Description" className='details_input_card_large' onChange={HandleChange} value={Task_Temp.description}/></p>
                  <br/>
                  <p>&emsp;&emsp;Deadline :- <br/> &emsp;&emsp;{format(parseISO(task.Deadline),'dd-MM-yyyy')} ({days[parseISO(task.Deadline).getDay()]})<br/> &emsp;&emsp;<input type="date" name="deadline" placeholder="Enter New Task Deadline" className='task_details_input' onChange={HandleChange} value={Task_Temp.deadline}/></p>
                  <br/>
                  <br/>
                  <h2 className='h2'>&emsp;TAs Assigned : </h2>
                  {
                    arr.map((i) =>
                    (
                        <div>
                            <h3 className='h3'>&emsp;&emsp;TA {[i+1]} : </h3>
                            <p>&emsp;&emsp; Name : {TA_Names[i]}</p>
                            <p>&emsp;&emsp; Email : {task.TA_Emails[i]}</p>
                            <p>&emsp;&emsp; Task Status : {task.Status[i]}</p>
                            <p>&emsp;&emsp; Rating : {task.Rating[i]} &emsp;&emsp;
                                <select name={"R"+i} className='details_input_card' onChange={HandleChange} >
                                    <option value={task.Rating[i]?task.Rating[i]:"0"}></option>
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                            </p>
                            <p>&emsp;&emsp; Comments : <br/>&emsp;&emsp; {task.Comments[i]}<br/>&emsp;&emsp;<textarea name={"C"+i} rows="4" type="text" placeholder="Please Enter Comments (if any)" className='details_input_card_large' onChange={HandleChange} value={comments[i]}/></p>
                            &emsp;&emsp;<div className='btn' onClick={() => Remove_TA(task.TA_Emails[i])}>Remove TA from Task</div>
                            <br/>
                            <br/>
                            <br/>
                        </div>
                    ))
                  }
                  <center>
                    <div className='btn' onClick={Save_Changes}>SAVE</div>
                  </center>
                  <br/>
                  <br/>
                  <br/>
                  <h2 className='h2'>&emsp;Re-Assign TAs ? :</h2>
                  &emsp;&emsp;<select name="RT" className='task_details_input' onChange={HandleChange}>
                    <option value={0}></option>
                    <option value={1}>Yes</option>
                    <option value={0}>No</option>
                  </select>
                  <br/>
                  <br/>
                  {Arr2Setter()}
                  {Arr3Setter()}
                  {TA_Remover()}
                  { RT==1 ?
                    (
                        <div>
                        <h3 className='h3'>&emsp;&emsp;Number of TAs &emsp;:</h3>  
                        &emsp;&emsp;<select name="TAs_num" className='task_details_input' onChange={HandleChange} value={Task_Temp.TAs_num}>
                        {
                              arr2.map((el) => 
                              (
                                  <option value={el}>{el}</option>
                              ))

                        }
                        </select>
                        <br/>
                        <br/>
                        {
                        
                          arr3.map( (el,i) => 
                          (
                              <div>
                                   <p key={i}>&emsp;&emsp;TA {el} &emsp;: <br/>
                                   &emsp;&emsp;<select name={"TA"+el} className='task_details_input' onChange={HandleChange}>
                                          <option value=""></option>
                                          {
                                              Course_TAs && Course_TAs.map((el) => 
                                              (
                                                  <option value={el.email}>{el.name}</option>     
                                              ))

                                          }
                                      </select>
                                  </p>
                                  <br/>
                              </div>
                          ))
                        }
                        <br/>
                        <br/>
                        <center>
                         <div className='btn' onClick={re_assign_tas}>Re-Assign TAs</div>
                        </center>
                        </div>
                    )
                    :
                    <div></div>
                }                    
                </span>
             </div>
            </div>
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

export default Edit_Task_Details
