/*
import React,{useState,Component} from 'react'
import './Login_page.css'
import Logo from './Assets/Transparent_Logo.png'
import {Link} from 'react-router-dom'
import '../index.css'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'


class Login_page extends Component<{},any> 
{
    constructor(props)
    {
        super(props)
        this.state=
        {
            Message:"",
            show:false,
            b1:1,
            b2:0,
            b3:0,
            user_email: "",
            user_pass: "",
            user_type:"TA"
        }
        this.HandleChange = this.HandleChange.bind(this);

    }

    // Saving entered values 
    HandleChange(e : any) //When someone types, its an 'event', denoted and saved in 'e' here. e.target will return where and what the change was
    {    
        this.setState({show:false})
        this.setState({Message:""})
         
        this.setState({ [e.target.name] : e.target.value })

        if(e.target.value=="TA")
        {
            this.setState({b1:1})
            this.setState({b2:0})
            this.setState({b3:0})

        }
        else if(e.target.value=="Faculty")
        {
            this.setState({b1:0})
            this.setState({b2:1})
            this.setState({b3:0})
        }
        else if(e.target.value=="Admin")
        {
            this.setState({b1:0})
            this.setState({b2:0})
            this.setState({b3:1})
        }

        
    }

    loginfo()
    {
        console.log(this.state)
    }

    login = () =>
    {
        this.setState({show:true})
        const user = [this.state.user_email,this.state.user_pass,this.state.type]
        if(this.state.user_email=="")
        {
            this.setState({Message:"Please enter username (BITS email ID)"})
        }
        else if(this.state.user_pass=="")
        {
            this.setState({Message:"Please enter password"})
        }
        else if(!this.state.user_email.endsWith("@pilani.bits-pilani.ac.in"))
        {
            this.setState({Message:"Please enter a valid BITS ID"})
        }
        else
        {
            if(this.state.user_type=="Admin")
            {
                if(this.state.user_email!="admin@pilani.bits-pilani.ac.in")
                {
                    this.setState({Message:"Incorrect Email Entered"})
                }
                else if(this.state.user_pass!="admin12345")
                {
                    this.setState({Message:"Incorrect Password Entered"})
                }
                else
                {
                    alert("Admin Login")
                }

            }
            else
            {
                let navigate = useNavigate()
                axios.post("http://localhost:9000/Login", user)
                .then(res=> {
                            this.setState({Message:res.data.message})
                            //this.props.setloginuser(res.data.user)
                            navigate("/",{replace:true} )
                      })
            }
        }
    }

    render ()
    {
        return(
        <div className='bg_image'>
            <img src={Logo} alt="Logo" className="logo"/>
            <br/>
            <div className='central_title'>Teaching Assistantship Management System</div>
            <div className='login_box'>
            <h1 color='black'>LOGIN</h1>
            <form>
                <span>
                    <input type="button" className={this.state.b1 ? 'selected_btn'  : 'select_btn'} name="user_type" value="TA" onClick={this.HandleChange.bind(this)} /> &emsp;
                    <input type="button" className={this.state.b2 ? 'selected_btn'  : 'select_btn'} name="user_type" value="Faculty" onClick={this.HandleChange.bind(this)}/> &emsp;
                    <input type="button" className={this.state.b3 ? 'selected_btn'  : 'select_btn'} name="user_type" value="Admin" onClick={this.HandleChange.bind(this)}/>
                </span>
                <label>
                    Username : <input
                                     className='inputbar'
                                     name="user_email"
                                     pattern=".+@pilani.bits-pilani.ac.in"
                                     onChange={this.HandleChange.bind(this)}
                                     type="email" 
                                     placeholder='Please enter your BITS Email ID'
                                />
                </label>         
                <label>
                    Password : <input 
                                     className='inputbar'
                                     name="user_pass" 
                                     onChange={this.HandleChange} 
                                     type="password"
                                     placeholder='Please enter password'
                                />
                </label>
                <div className="ErrorMsg">{this.state.show && this.state.Message!=="Login Successful" ? this.state.Message : ""}</div> {//Only when show is true, Message will be shown. It is false by default and on change (wrt to any input bar it again becomes false). Becomes true on clicking the button}
                <div className='btn' onClick={this.login}>Login</div>
                <br/>
                <Link to='/Recover_pass'>Forgot password ?</Link>
            </form>
            </div>
            <br/>
        </div>
        );
    }
}

export default Login_page */