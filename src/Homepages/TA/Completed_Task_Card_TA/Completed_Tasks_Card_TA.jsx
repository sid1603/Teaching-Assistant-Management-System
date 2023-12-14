import React,{useState,useEffect} from 'react'
import './Completed_Tasks_Card_TA.css'
import { format, parseISO } from 'date-fns';

const Completed_Tasks_Card = (props) => {

    const completed_task=props.param
    const days = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
    const [rating,set_rating] = useState()
    const [comments,set_comments] = useState()

    useEffect(() => 
    {
        for(var i=0;i<completed_task.Status.filter(status=>status!="").length;i++)
        {
            if(props.email==completed_task.TA_Emails[i])
            {
                set_rating(completed_task.Rating[i])
                set_comments(completed_task.Comments[i])
            }
        }
    },[])
    


    
    return (

        <div className='request_container'>
            <span>
                  <p>&emsp;&emsp;Name :- {completed_task.Name}</p>
                  <br/>
                  <p>&emsp;&emsp;Description :- <br/> &emsp;&emsp;{completed_task.Description}</p>
                  <br/>
                  <p>&emsp;&emsp;Deadline :- <br/> &emsp;&emsp;{format(parseISO(completed_task.Deadline),'dd-MM-yyyy')} ({days[parseISO(completed_task.Deadline).getDay()]})</p>
                  <br/>
                  <p>&emsp;&emsp; Rating : {rating}/5</p>
                  <br/>
                  <p>&emsp;&emsp; Comments :- <br/> &emsp;&emsp; {comments}</p>

            </span>
        </div>
        
    )


}

export default Completed_Tasks_Card