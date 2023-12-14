import React, {useEffect,useState} from 'react'
import './Map_TA_Faculty.css'
import Header from '../../../Header/header.jsx'
import Faculty_Card from './Faculty_Card/Faculty_Card.jsx'
import { useContext } from 'react';
import {userContext} from '../../../App.jsx'
import axios from 'axios';

function Map_TA_Faculty(props)
{
    const [userEmail,userType] = useContext(userContext);
   
    const [faculties,set_faculties] = useState()

    const fetch_faculties = async () =>
    {
        const data= await axios.get("http://localhost:9000/fetch_faculties", { withCredentials: true })
        set_faculties(data)
    }

    //Fetching items once, when the page loads
    useEffect(() => 
    {
        fetch_faculties();
    },[])

    return(
            <div>
                <Header login_state={props} type={"Admin"}/>
                <div className='faculty_box'>
                    <center>
                    <h1>FACULTIES</h1>
                    <br/>
                    <div className='Fac_details'>
                            <div className='faculties'>
                            {
                                faculties && faculties.data.map((faculty) => 
                                (
                                    <Faculty_Card faculty_id={faculty._id} name={faculty.name} image={faculty.image_url} />
                                ))
                            }   
                        </div>
                    </div>
                    <div>&emsp;</div>
                   
                    </center>
                </div>
            </div>
    )
}

export default Map_TA_Faculty