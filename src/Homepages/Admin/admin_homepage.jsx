import React, { useState } from 'react'
import './admin_homepage.css'
import Header from '../../Header/header.jsx'
import { Link } from 'react-router-dom'
import {FaChalkboardTeacher, FaUserGraduate} from 'react-icons/fa'
import {BiSitemap} from 'react-icons/bi'
import {SiCoursera} from 'react-icons/si'

const Admin_homepage = (props) => 
{

    return(
        <div>
            <Header login_state={props} type={"Admin"}/>
                <div className='lander'>
                    <center><h1>ADMIN DASHBOARD</h1></center>
                    <br/>

                    <Link to="/Ops" className='card' state={{ops_type:"FACULTY"}}>
                        <FaChalkboardTeacher size={50}/>
                        &emsp;FACULTIES
                    </Link>

                    <Link to="/Ops" className='card' state={{ops_type:"STUDENT"}}>
                        <FaUserGraduate size={50}/>
                        &emsp;STUDENTS
                    </Link>

                    <Link to="/Map" className='big_card'>
                        <BiSitemap size={50}/>
                        &emsp;ALLOT TAs TO FACULTIES
                    </Link>
                    
                    <br/>
                    <Link to="/Ops" className='card' state={{ops_type:"COURSE"}}>
                        <SiCoursera size={50}/>
                        &emsp;COURSES
                    </Link>
                    <br/>
                </div>
        </div>
    )
}

export default Admin_homepage