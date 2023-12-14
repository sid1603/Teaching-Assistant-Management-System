import React, { useState } from 'react'
import './admin_homepage.css'
import Header from '../../Header/header.jsx'
import { Link,useLocation } from 'react-router-dom'
import {BiPencil} from 'react-icons/bi'
import {AiFillPlusCircle} from 'react-icons/ai'

const Ops = (props) => 
{
    const location=useLocation()
    const ops_type = location.state.ops_type
    
    const op_type = ops_type=="FACULTY"?"FACULTIES":ops_type+"S"
    const link_append = ops_type=="STUDENT"?"TA":String(ops_type).toUpperCase(true)
    
  return (
    <div>
    <Header login_state={props} type={"Admin"}/>
        <div className='lander'>
            <center><h1>{op_type}</h1></center>
            <br/>
            {/* ADD */}
            <Link to={"/Add_"+link_append} className='card'>
                <AiFillPlusCircle size={50}/>
                &emsp;ADD {op_type}
            </Link>
            {/* VIEW/EDIT */}
            <Link to={"/Edit_"+link_append} className='big_card'>
                <BiPencil size={50}/>
                &emsp;VIEW/EDIT {ops_type} DETAILS
            </Link>
            <br/>
        </div>
</div>
  )
}

export default Ops