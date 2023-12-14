import React from 'react'
import Header from '../../../../Header/header.jsx'
import './Edit_Course.css'
import DataTable from 'react-data-table-component'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CircularProgress } from '@mui/material'
import { CSVLink } from 'react-csv'
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css' 
import { useContext } from 'react';
import {userContext} from '../../../../App.jsx'
import axios from 'axios';

const Edit_Course = (props) => 
{

  const [userEmail,userType] = useContext(userContext);

  const [courses,set_courses] = useState([]);
  const [selected_data,set_selected_data] = useState([]);
  const [filtered_courses,set_filtered_courses] = useState([]);
  const [search,set_search] = useState("");
  const [popup1,set_popup1] = useState(false);
  const [popup2,set_popup2] = useState(false);
  const [inner_popup1,set_inner_popup1] = useState(false);
  const [inner_popup1_message,set_inner_popup1_message] = useState("");
  const [inner_popup2,set_inner_popup2] = useState(false);
  const [inner_popup2_message,set_inner_popup2_message] = useState("");

  const [cKey,setCKey] = useState(0);

  /* The JWT refresh token update is not reflected in the '.then' block of the previous request where the refresh token was updated, 
  so this variable stores if update is needed and calls the fetch_details function when needed */
  const [update,setUpdate] = useState(0)

  //Loading Screen
  const [loadingPopup,setLoadingPopup] = useState(false);

  const get_courses = async() =>
  {
    const response = await axios.get("http://localhost:9000/fetch_courses", { withCredentials: true });
    set_filtered_courses(response.data.courses);
    set_courses(response.data.courses);
    setUpdate(0);  
  }


  useEffect(() => 
  {
    get_courses();   
  }, [])

  useEffect(() =>
  {
    if(update==1)
    get_courses();
  },[update])

  useEffect(() => 
  {
    const result = courses.filter( (course) => {

        
      return course.name.toLowerCase().match(search.toLowerCase())

    })
    set_filtered_courses(result)

  },[search])

  

  //HEADERS FOR EXPORTING DATA
  const headers = [
    {
      label:"Course Name",
      key : "name"
    },
    {
      label:"Course Code",
      key : "code"
    },
]

  //DATA TO BE EXPORTED
  const csvLink = {
    filename: "Course_Data.CSV",
    headers: headers,
    data: selected_data
  }

  //DELETION
  const delete_records = () =>
  {
    setLoadingPopup(true)
    const Course_Details = {
      ids:[],
      codes:[]
      
    }
    for(var i=0;i<selected_data.length;i++)
    {
      Course_Details.ids.push(selected_data[i]._id)
      Course_Details.codes.push(selected_data[i].code)
    }
    
    axios.delete(`http://localhost:9000/Delete_Courses?ids=${Course_Details.ids}&codes=${Course_Details.codes}`, { withCredentials: true }).then( (res) =>
    {
      setLoadingPopup(false);
      set_inner_popup1_message(res.data);
      set_popup1(false);
      set_inner_popup1(true);
      setCKey(cKey+1);
      setUpdate(1);
    })
  }

   //Reset TA-Ship
   const reset_records = () =>
   {
    setLoadingPopup(true);
     const Course_Details = {
       codes:[]
     }
     for(var i=0;i<selected_data.length;i++)
     {
       Course_Details.codes.push(selected_data[i].code)
     }
     
     axios.put("http://localhost:9000/Reset_TA-Ship_Courses", Course_Details, { withCredentials: true }).then( (res) =>
     {
       setLoadingPopup(false);
       set_inner_popup2_message(res.data);
       set_popup2(false);
       set_inner_popup2(true);
       setCKey(cKey+1);
       setUpdate(1);
     })
   }



  //TABLE HEADERS
  const columns =[
    {
      name:"Course Name",
      selector: (row) => row.name,
      sortable : true
    },
    {
      name:"Course Code",
      selector: (row) => row.code,
      sortable : true
    },
    {
      name:"Edit",
      cell: (row) => <Link to="/Edit_Course_Details" className='small_btn' state={{Course:row}}>EDIT</Link>
    }
  ]


  return (
    <div>
      <Header login_state={props} type={"Admin"}/>
      <div className='item_box'>
          <center>
          <h1>COURSE LIST</h1>
          <br/>
          <DataTable 
            key={cKey} //This is changed after every reset or deletion to ensure that the table is reset
            columns={columns} 
            data={filtered_courses} 
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
          <div className='export_btn' onClick={()=>{set_popup2(o => !o)}}> Reset TA-Ship </div>
          <Popup open={popup1} modal closeOnDocumentClick onClose={()=>{set_popup1(false)}}>
            <center> 
              <br/>
              <p><center>{selected_data.length==0 ? "Please select at least one record" : selected_data.length==1? "Are you sure you want to delete 1 course ?" : "Are you sure you want to delete "+selected_data.length+" courses ?" }</center></p>
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
              <p><center>{selected_data.length==0 ? "Please select at least one course" : selected_data.length==1? "Are you sure you want to reset TA-Ship for 1 course ?" : "Are you sure you want to reset TA-Ship for "+selected_data.length+" courses ?" }</center></p>
              <br/>
              {selected_data.length==0 ? <div><div className='export_btn' onClick={()=>{set_popup2(false)}}>Ok</div><br/></div> : <div><div className='export_btn' onClick={reset_records}>Yes</div><div className='export_btn' onClick={()=>{set_popup2(false)}}>No</div></div>}
              <br/>
            </center>
          </Popup>
          <Popup open = {inner_popup2} closeOnDocumentClick onClose={()=>{set_inner_popup2(false)}}>
          <center> 
              <br/>
              <center><div className={inner_popup2_message=='TA-Ship Reset Successfull!' ? 'SuccessMsg' : 'ErrorMsg'}>{inner_popup2_message}</div></center>
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

export default Edit_Course