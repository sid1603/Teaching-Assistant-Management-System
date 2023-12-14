import React, { useState, useEffect } from 'react'
import Header from '../../../Header/header.jsx'
import './View_Edit_Tasks.css'
import DataTable from 'react-data-table-component'
import { Link, useLocation } from 'react-router-dom'
import { CircularProgress } from '@mui/material'
import { CSVLink } from 'react-csv'
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css' 
import { useContext } from 'react';
import {userContext} from '../../../App.jsx'
import axios from 'axios';

const View_Edit_Tasks = (props) => 
{

  const [userEmail,userType] = useContext(userContext);
  
  const [tKey,setTKey] = useState(0);

  const [tasks,set_tasks] = useState([])
  const [selected_data,set_selected_data] = useState([])
  const [filtered_tasks,set_filtered_tasks] = useState([])
  const [search,set_search] = useState("")
  const [popup1,set_popup1] = useState(false)
  const [popup2,set_popup2] = useState(false)
  const [inner_popup1,set_inner_popup1] = useState(false)
  const [inner_popup1_message,set_inner_popup1_message] = useState("")
  const [inner_popup2,set_inner_popup2] = useState(false)
  const [inner_popup2_message,set_inner_popup2_message] = useState("")
  const location=useLocation()
  const course = location.state.course

  //Loading Screen
  const [loadingPopup,setLoadingPopup] = useState(false);

  /* The JWT refresh token update is not reflected in the '.then' block of the previous request where the refresh token was updated, 
  so this variable stores if update is needed and calls the fetch_details function when needed */
  const [update,setUpdate] = useState(0);

  const get_tasks = async() =>
  {
    try 
    {
      const response = await axios.get(`http://localhost:9000/fetch_tasks?fac_email=${props.email}&course_code=${course.code}`, { withCredentials: true })
      set_tasks(response.data)
      set_filtered_tasks(response.data)
      setUpdate(0);
    } 
    catch (error) 
    {
      console.log(error)    
      setUpdate(0);  
    }

  }
  

  useEffect(() => 
  {
    get_tasks();
      
  }, [])

  useEffect(() =>
  {
    if(update==1)
      get_tasks();
  },[update])

  useEffect(() => 
  {
    const result = tasks.filter( (task) => {

      return task.Name.toLowerCase().match(search.toLowerCase())

    })
    set_filtered_tasks(result);

  },[search])

  

  //HEADERS FOR EXPORTING DATA
  const headers = [
    {
      label:"Task Name",
      key : "Name"
    },
    {
      label:"Course Code",
      key : "Course_Code"
    },
    {
      label:"Faculty Email ID",
      key : "Faculty_Email"
    },
    {
      label:"Deadline",
      key : "Deadline"
    },
    {
      label:"Description",
      key : "Description"
    },  
    {
        label:"TA 1",
        key : "TA_Emails[0]"
    },
    {
      label:"TA 2",
      key : "TA_Emails[1]"
    },
    {
      label:"TA 3",
      key : "TA_Emails[2]"
    },
    {
      label:"TA 4",
      key : "TA_Emails[3]"
    },
    {
      label:"TA 5",
      key : "TA_Emails[4]"
    },
    {
      label:"Status 1",
      key : "Status[0]"
    },
    {
        label:"Status 2",
        key : "Status[1]"
    },
    {
        label:"Status 3",
        key : "Status[2]"
    },
    {
        label:"Status 4",
        key : "Status[3]"
    },
    {
        label:"Status 5",
        key : "Status[4]"
    },
    {
      label:"Rating 1",
      key : "Rating[0]"
    },
    {
      label:"Rating 2",
      key : "Rating[1]"
    },
    {
      label:"Rating 3",
      key : "Rating[2]"
    },
    {
      label:"Rating 4",
      key : "Rating[3]"
    },
    {
      label:"Rating 5",
      key : "Rating[4]"
    },
    {
      label:"Comment 1",
      key : "Comments[0]"
    },
    {
      label:"Comment 2",
      key : "Comments[1]"
    },
    {
      label:"Comment 3",
      key : "Comments[2]"
    },
    {
      label:"Comment 4",
      key : "Comments[3]"
    },
    {
      label:"Comments 5",
      key : "Comments[4]"
    }
   
  ]

  //DATA TO BE EXPORTED
  const csvLink = {
    filename: "Task_Data.CSV",
    headers: headers,
    data: selected_data
  }

  //DELETION
  const delete_records = () =>
  {
    setLoadingPopup(true);
    const task_Details = {
      ids:[]
    }
    for(var i=0;i<selected_data.length;i++)
    {
      task_Details.ids.push(selected_data[i]._id)
    }
    
    axios.delete(`http://localhost:9000/Delete_Tasks?ids=${task_Details.ids}`, { withCredentials: true }).then( (res) =>
    {
      set_inner_popup1_message(res.data)
      set_popup1(false)
      set_inner_popup1(true)
      setUpdate(1);
      setTKey(tKey+1);
      setLoadingPopup(false);
    })
  }

   //Reset Tasks
   const reset_records = () =>
  {
    setLoadingPopup(true);
    const task_Details = {
      ids:[],
    }

    for(var i=0;i<selected_data.length;i++)
    {
      task_Details.ids.push(selected_data[i]._id)
    }
    
    axios.put("http://localhost:9000/Reset_Tasks", task_Details, { withCredentials: true }).then( (res) =>
    {
      set_inner_popup2_message(res.data)
      set_popup2(false)
      set_inner_popup2(true)
      setUpdate(1);
      setTKey(tKey+1);
      setLoadingPopup(false);
    })
  }

  function deadline_formatter(deadline)
  {
    var deadline_date = deadline.split("-");
    return deadline_date[2]+ "-" +deadline_date[1]+ "-" +deadline_date[0].substring(2);
  }

  function days_remaining(deadline)
  {
    let new_date = new Date();
    var today = new Date(new_date.toJSON().slice(0,10));
    var deadline_date = new Date(deadline);
    // getTime gives the answer in terms of milliseconds. There are 1000*60*60*24 ms in a day
    var difference = (deadline_date.getTime() - today.getTime())/(1000*60*60*24);
    difference=difference.toFixed(0);
    var days_remaining = difference < 0 ? (0-difference)+" (Overdue)" : difference;
    return days_remaining;
  }

  function average(ratings,statuses)
  {
    var sum=0,count=0;
    for(var i=0;i<ratings.length;i++)
    {
      if(statuses[i]=="Completed")
      {
        sum+=ratings[i];
        count++;
      }
    }
    var avg= sum/count ? sum/count : 0;
    return avg;
  }


  //TABLE HEADERS
  const columns =[
    {
      name:"Task Name",
      selector: (row) => row.Name,
      sortable : true
    },  
    {
      name:"TAs Assigned",
      selector: (row) => row.TA_Emails.filter(email => email!="").length,
      sortable : true
    },
    {
      name:"Completion %",
      selector: (row) => Number(100 * row.Status.filter(status => status=="Completed").length/row.Status.filter(status => status!="").length) ? Number(100 * row.Status.filter(status => status=="Completed").length/row.Status.filter(status => status!="").length) : 0,
      sortable : true
    },
    {
      name:"Deadline",
      selector: (row) => deadline_formatter(row.Deadline.slice(0,10)),
      sortable : true
    },
    {
      name:"Days Remaining",
      selector: (row) => days_remaining(row.Deadline.slice(0,10)),
      sortable : true
    },
    {
      name:"Average Rating",
      selector: (row) => average(row.Rating,row.Status)+"/5",
      sortable : true
    },
    {
      name:"Edit",
      cell: (row) => <Link to="/Edit_Task_Details" className='small_btn' state={{Task:row,course:course}}>EDIT</Link>
    }
  
  ]


  return (
    <div>
      <Header login_state={props} type={"FACULTY"}/>
      <div className='item_box'>
          <center>
          <h1>TASK LIST</h1>
          <br/>
          <DataTable 
            key={tKey} //This is changed after every reset or deletion to ensure that the table is reset
            columns={columns} 
            data={filtered_tasks} 
            fixedHeader 
            selectableRows
            selectableRowsHighlight
            onSelectedRowsChange={(e) => set_selected_data(e.selectedRows)}
            highlightOnHover
            pagination
            subHeader
            subHeaderComponent = 
            {
              <div>
              <p>Search by name : &emsp; <input type="text" placeholder='Search...' className='search_bar' value={search} onChange={(e) => set_search(e.target.value)}/></p>
              </div>
            }
            subHeaderAlign="left"
          />
          <br/>
          <CSVLink className='export_btn' {...csvLink}>Export</CSVLink>
          <div className='export_btn' onClick={()=>{set_popup1(o => !o)}}> Delete </div>
          <div className='export_btn' onClick={()=>{set_popup2(o => !o)}}> Reset Tasks </div>
          <Popup open={popup1} modal closeOnDocumentClick onClose={()=>{set_popup1(false)}}>
            <center> 
              <br/>
              <p><center>{selected_data.length==0 ? "Please select at least one record" : selected_data.length==1? "Are you sure you want to delete 1 record ?" : "Are you sure you want to delete "+selected_data.length+" records ?" }</center></p>
              <br/>
              {selected_data.length==0 ? <div><div className='export_btn' onClick={()=>{set_popup1(false)}}>Ok</div><br/></div> : <div><div className='export_btn' onClick={delete_records}>Yes</div><div className='export_btn' onClick={()=>{set_popup1(false)}} >No</div></div>}
              <br/>
            </center>
          </Popup>
          <Popup open = {inner_popup1} closeOnDocumentClick  onClose={()=>{set_inner_popup1(false)}}>
          <center> 
              <br/>
              <center><div className={inner_popup1_message=='Deletion Successfull!' ? 'SuccessMsg' : 'ErrorMsg'}>{inner_popup1_message}</div></center>
              <br/>
              <div className='export_btn' onClick={()=>{set_inner_popup1(false)}}>Ok</div>
              <br/>
              <br/>
            </center>
          </Popup>
          <Popup open={popup2} modal closeOnDocumentClick onClose={()=>{set_popup2(false)}}>
            <center> 
              <br/>
              <p><center>{selected_data.length==0 ? "Please select at least one record" : selected_data.length==1? "Are you sure you want to reset 1 task ?" : "Are you sure you want to reset "+selected_data.length+" tasks ?" }</center></p>
              <br/>
              {selected_data.length==0 ? <div><div className='export_btn' onClick={()=>{set_popup2(false)}}>Ok</div><br/></div> : <div><div className='export_btn' onClick={reset_records}>Yes</div><div className='export_btn' onClick={()=>{set_popup2(false)}}>No</div></div>}
              <br/>
            </center>
          </Popup>
          <Popup open = {inner_popup2} closeOnDocumentClick onClose={()=>{set_inner_popup2(false)}}>
          <center> 
              <br/>
              <center><div className={inner_popup2_message=='Reset Successfull!' ? 'SuccessMsg' : 'ErrorMsg'}>{inner_popup2_message}</div></center>
              <br/>
              <div className='export_btn' onClick={()=>{set_inner_popup2(false)}}>Ok</div>
              <br/>
              <br/>
            </center>
          </Popup>
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
          </center>
          <br/>
      </div>
    </div>
  )
}

export default View_Edit_Tasks