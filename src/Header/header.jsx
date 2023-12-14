import { useContext } from 'react'
import '../Header/header.css'
import Logo from './Assets/Transparent_Logo.png'
import axios from 'axios'
import {CgProfile} from 'react-icons/cg'
import {Link} from 'react-router-dom'
import {userContext} from '../App.jsx' 
import secureLocalStorage from 'react-secure-storage'

const Header = (props) => 
{
    const [userEmail,userType,setUserEmail,setUserType] = useContext(userContext);
    return(
        <div>
            <header>
                <Link to='/'><img src={Logo} alt='Logo' className='logo_mini'/></Link>
                <Link to='/' className='Name'>Teaching Assistantship Management System</Link>
                <div className='Profile_Page_Button'>
                    <Link to={'/'+props.type.toLowerCase()+'_profile'}><CgProfile className='icon' size={50} /></Link>
                </div>
                <div className='UserType'>
                    <center>{props.type}</center>
                </div>
                <div className="logout_btn" 
                    onClick={() => 
                                {
                                    //LOGOUT PROCESS
                                    setUserEmail(null);
                                    setUserType(null);
                                    secureLocalStorage.removeItem('userEmail');
                                    secureLocalStorage.removeItem('userType');
                                    axios.post("http://localhost:9000/Logout", null, { withCredentials: true });
                                }}>
                    Logout
                </div>
            </header>
        </div>
    )
}

export default Header