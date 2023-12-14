import React, { useState } from 'react'
import Login_page from './Login_Page/Login_page.jsx'
import Recover_pass from './Login_Page/Recover_pass/Recover_pass.jsx'
import Admin_homepage from './Homepages/Admin/admin_homepage.jsx'
import Admin_Profile from './Homepages/Admin/Profile_Page/admin_profile_page.jsx'
import TA_homepage from './Homepages/TA/TA_Homepage.jsx'
import Add_TAs from './Homepages/Admin/TA_Ops/Add_TA/Add_TA.jsx'
import Add_Faculty from './Homepages/Admin/Faculty_Ops/Add_Faculty/Add_Faculty.jsx'
import Add_Course from './Homepages/Admin/Course_Ops/Add_Course/Add_Course.jsx'
import Apply from './Homepages/TA/Apply/Apply.jsx'
import Mapping from './Homepages/Admin/Map_TA_Faculty/Map_TA_Faculty.jsx'
import Faculty_Page from './Homepages/Admin/Map_TA_Faculty/Faculty_Page/Faculty_Page.jsx'
import Faculty_homepage from './Homepages/Faculty/Faculty_Homepage.jsx'
import Faculty_Profile from './Homepages/Profile_Page/Faculty_Profile_Page.jsx'
import Task_Assignment from './Homepages/Faculty/Task_Assignment/Task_Assignment.jsx'
import Course_Page from './Homepages/Faculty/Course_Page/Course_Page.jsx'
import View_Edit_Tasks from './Homepages/Faculty/View_Edit_Tasks/View_Edit_Tasks.jsx'
import Ops from './Homepages/Admin/Ops.jsx'
import Edit_TA from './Homepages/Admin/TA_Ops/Edit_TA/Edit_TA.jsx'
import Edit_TA_Details from './Homepages/Admin/TA_Ops/Edit_TA/Edit_TA_Details/Edit_TA_Details.jsx'
import TA_Profile_Page from './Homepages/TA/Profile_Page/TA_Profile_Page.jsx'
import Edit_Faculty from './Homepages/Admin/Faculty_Ops/Edit_Faculty/Edit_Faculty.jsx'
import Edit_Faculty_Details from './Homepages/Admin/Faculty_Ops/Edit_Faculty/Edit_Faculty_Details/Edit_Faculty_Details.jsx'
import Edit_Course from './Homepages/Admin/Course_Ops/Edit_Course/Edit_Course.jsx'
import Edit_Course_Details from './Homepages/Admin/Course_Ops/Edit_Course/Edit_Course_Details/Edit_Course_Details.jsx'
import Edit_Task_Details from './Homepages/Faculty/View_Edit_Tasks/Edit_Task_Details/Edit_Task_Details.jsx'
import {Routes, BrowserRouter as Router, Route, Navigate} from 'react-router-dom' /*Routes = Switch-case from C++*/
import axios from 'axios'
import secureLocalStorage from 'react-secure-storage'


function App() 
{
  const [userEmail,setUserEmail] = useState(isLoggedIn()?secureLocalStorage.getItem('userEmail'):null)
  const [userType,setUserType] = useState(isLoggedIn()?secureLocalStorage.getItem('userType'):null)
 
  //Checking if the user still has the access token
  function isLoggedIn() 
  {
    var flag=0;
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) 
    {
      const cookie = cookies[i].trim();
      // Check if the cookie string is "loggedIn=1"
      if (cookie === 'loggedIn=1') 
        flag=1;
    }
    if(flag==1)
    {
      return true;
    }
    else
    {
      secureLocalStorage.removeItem('userEmail');
      secureLocalStorage.removeItem('userType');
      return false;
    }
  }


  //Logging out the user across all tabs if the user logs out from any open tab.
  window.addEventListener("storage", async () => {
    if(!isLoggedIn())
    {
        //LOGOUT PROCESS
        setUserEmail(null);
        setUserType(null);
        secureLocalStorage.removeItem('userEmail');
        secureLocalStorage.removeItem('userType');
    }

  });

  
  return (
    //Context will be avaiable to all components inside this and since all components are called here, it may be considered global
    <userContext.Provider value={[userEmail,userType,setUserEmail,setUserType]}> 
    <Router>
      <Routes>
		    <Route exact path="/" element =
          {
            userEmail ? (userType=="TA" ? <TA_homepage email={userEmail}/>  : userType=="Faculty" ? <Faculty_homepage/> : userType=="Admin" ? <Admin_homepage/> : <Navigate to="/Login"/> ) : <Navigate to="/Login"/>
          }
        />
        <Route exact path="/Login" element =
          {
            <Login_page setUserEmail={setUserEmail} setUserType={setUserType}/>
          }
        /> 
        <Route exact path="/Recover_pass" element =
        {
          <Recover_pass/>
        }
        />   
        <Route exact path="/Add_TA" element =
          {
            userEmail && userType=="Admin" ? <Add_TAs/> : <Navigate to="/Login"/>
          }
        />
        <Route exact path="/Add_Faculty" element =
          {
            userEmail && userType=="Admin"? <Add_Faculty/> : <Navigate to="/Login"/>
          }
        />
        <Route exact path="/Add_Course" element =
          {
            userEmail && userType=="Admin" ? <Add_Course/> : <Navigate to="/Login"/>
          }
        />
        <Route exact path="/Apply" element =
          {
            userEmail && userType=="TA" ? <Apply  user_email={userEmail} /> : <Navigate to="/Login"/>
          }
        />
        <Route exact path="/Map" element =
          {
            userEmail && userType=="Admin" ? <Mapping/> : <Navigate to="/Login"/>
          }
        />
        <Route exact path="/Faculty_Page" element =
          {
            userEmail && userType=="Admin" ? <Faculty_Page/> : <Navigate to="/Login"/>
          }
        />
        <Route exact path="/faculty_profile" element =
        {
          userEmail && userType=="Faculty" ? <Faculty_Profile  email={userEmail} /> : <Navigate to="/Login"/>
        }
        />
        <Route exact path="/Course_Page" element =
        {
          userEmail && userType=="Faculty" ? <Course_Page  email={userEmail} /> : <Navigate to="/Login"/>
        }
        />
        <Route exact path="/Assign_Task_Page" element =
        {
          userEmail && userType=="Faculty" ? <Task_Assignment  email={userEmail} /> : <Navigate to="/Login"/>
        }
        />
        <Route exact path="/View_Edit_Tasks_Page" element =
        {
          userEmail && userType=="Faculty" ? <View_Edit_Tasks  email={userEmail} /> : <Navigate to="/Login"/>
        }
        />
        <Route exact path="/Ops" element =
        {
          userEmail && userType=="Admin" ? <Ops  email={userEmail} /> : <Navigate to="/Login"/>
        }
        />
        <Route exact path="/admin_profile" element =
        {
          userEmail && userType=="Admin" ? <Admin_Profile  email={userEmail} /> : <Navigate to="/Login"/>
        }
        />
        <Route exact path="/Edit_TA" element =
        {
          userEmail && userType=="Admin" ? <Edit_TA  email={userEmail} /> : <Navigate to="/Login"/>
        }
        />
        <Route exact path="/Edit_TA_Details" element =
        {
          userEmail && userType=="Admin" ? <Edit_TA_Details/> : <Navigate to="/Login"/>
        }
        />
        <Route exact path="/ta_profile" element =
        {
          userEmail && userType=="TA" ? <TA_Profile_Page  email={userEmail} /> : <Navigate to="/Login"/>
        }
        />
        <Route path="/Edit_Faculty" element =
        {
          userEmail && userType=="Admin" ? <Edit_Faculty  email={userEmail} /> : <Navigate to="/Login"/>
        }
        />
        <Route exact path="/Edit_Faculty_Details" element =
        {
          userEmail && userType=="Admin" ? <Edit_Faculty_Details/> : <Navigate to="/Login"/>
        }
        />
         <Route path="/Edit_Course" element =
        {
          userEmail && userType=="Admin" ? <Edit_Course  email={userEmail} /> : <Navigate to="/Login"/>
        }
        />
        <Route exact path="/Edit_Course_Details" element =
        {
          userEmail && userType=="Admin" ? <Edit_Course_Details/> : <Navigate to="/Login"/>
        }
        />
        <Route exact path="/Edit_Task_Details" element =
        {
          userEmail && userType=="Faculty" ? <Edit_Task_Details  email={userEmail} /> : <Navigate to="/Login"/>
        }
        />
        
	    </Routes>
    </Router>
    </userContext.Provider>
  );
}

export default App
export const userContext = React.createContext()