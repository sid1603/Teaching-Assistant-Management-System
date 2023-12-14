/*import { useContext } from 'react';
import {userContext} from '../App.jsx'
  
abstract class User 
{
    protected Name : String
	protected Type : String
    protected Email: String
    protected Pass : String
	protected Contact_Num : Number
    protected Dept : String = "CSIS"

    //Getters
    public get get_name()
    {
        return this.Name
    }
    public get get_email()
    {
        return this.Email
    }
    public get get_pass()
    {
        return this.Pass
    }
    public get get_number()
    {
        return this.Contact_Num
    }


    //Setters
    public set set_name(Name : String) 
    {
        this.Name = Name;
    }
    public set_email(Email : String) 
    {
        this.Email = Email;
    }
    public set set_Pass(Pass : String) 
    {
        this.Pass = Pass;
    }
    public set set_number(Num : Number) 
    {
        this.Contact_Num = Num;
    }
   

}

export function axios()
{
    const [
        userEmail,
        setUserEmail,
        userType,
        setUserType,
        userAccessToken,
        setUserAccessToken,
        userRefreshToken,
        setUserRefreshToken,
        axios
      ] = useContext(userContext);
      return axios
}

export function UserAccessToken()
{
    const [
        userEmail,
        setUserEmail,
        userType,
        setUserType,
        userAccessToken,
        setUserAccessToken,
        userRefreshToken,
        setUserRefreshToken,
        axios
      ] = useContext(userContext);
      return userAccessToken
}

export class TA extends User
{
    Type="TA"
    private course1 : String
    private course2 : String
    private course3 : String
    private Application_Status : String
    private Faculty_Email : String
    private Final_Course_Code : String
    public message=""

    //Public Constructor for Admin to access
    public TA(Name : String, Email : String, Pass : String, Contact_Num : Number)
    {
        this.Type="TA"
        this.Application_Status="Yet to Apply"
        this.Name = Name
        this.Email = Email
        this.Pass = Pass
        this.Contact_Num = Contact_Num
    }  

    async set_choices(Email: String, course1 : String, course2 : String, course3 : String)
    {
        this.Application_Status="Applied"
        this.course1 = course1
        this.course2 = course2
        this.course3 = course3
        this.Email = Email
        var temp;  
        temp = await axios().post("http://localhost:9000/Set_choices", this, {headers:{'authorization':"Bearer "+UserAccessToken()}})
        this.message = temp.data.message
        return this.message
    }

    async Update_Task_Status(Status_Update : String, Task_ID : String,Index : Number)
    {
        const details = 
        {
            Status : Status_Update,
            id : Task_ID,
            index : Index
        }
        var temp;  
        temp = await axios().put("http://localhost:9000/Update_Task_Status", details, {headers:{'authorization':"Bearer "+UserAccessToken()}})
        this.message = temp.data.message
        return this.message
    }

    public set_final_course_code(Course_Code : String) 
    {
        this.Final_Course_Code = Course_Code;
    }
}

export class Faculty extends User
{
    Type="Faculty";
    private Courses : String[];
    private TAs_Required : Number;
    private TA_Emails : String[];
    private Image_URL : String;
    public message: String;
  
    //Public Constructor for Admin to access
    public Faculty(Name : String, Email : String, Pass : String, Contact_Num : Number, TAs_Req : Number, Courses : String[], Image_URL : String)
    {
        this.Type="Faculty"
        this.Name = Name
        this.Email = Email
        this.Pass = Pass
        this.Contact_Num = Contact_Num
        this.TAs_Required = TAs_Req
        this.Courses = Courses
        this.Image_URL=Image_URL        
    }

    public set_TAs(TA_Emails : String[])
    {
        this.TA_Emails = TA_Emails

    }

    async Edit_Task(Ratings :Number[], Comments : String[],Task_ID : String,Name : String, Description : String, Deadline : Date)
    {
        const details = 
        {
            ratings : Ratings,
            id : Task_ID,
            comments : Comments,
            name : Name,
            description : Description,
            deadline : Deadline
        }
        var temp;  
        temp = await axios().post("http://localhost:9000/Edit_Task_Faculty", details, {headers:{'authorization':"Bearer "+UserAccessToken()}})
        this.message = temp.data.message
        return this.message
    } 


    async Assign_Task(Task_Name : String, Description : String, Deadliine : Date, TA_Emails : String[], Faculty_Email : String, Course_Code : String)
    {
        var temp;
        let T1 = new Task();
        T1.Task(Task_Name, Description, Deadliine, TA_Emails, Faculty_Email, Course_Code)
        temp = await axios().post("http://localhost:9000/Assign_Task", T1, {headers:{'authorization':"Bearer "+UserAccessToken()}})
        this.message = temp.data.message
        return this.message  
    }
}

export class Admin extends User
{
    protected Type="Admin"
    public message=""
   
    async Map_TA_Faculty(Email : String, TA_Emails: String[], Course_Codes : String[])
    {
        var temp;
        let F1 = new Faculty();
        F1.set_email(Email)
        F1.set_TAs(TA_Emails);
        const data = {F1,Course_Codes}
        temp = await axios().post("http://localhost:9000/Map_TA_Faculty", data, {headers:{'authorization':"Bearer "+UserAccessToken()}})
        this.message = temp.data.message
        return this.message
    }

    async Create_TA(Name : String, Email : String, Pass : String, Contact_Num : Number)
    {   
        var temp;
        let T1 = new TA();
        T1.TA(Name,Email,Pass,Contact_Num);
        temp = await axios().post("http://localhost:9000/Add_TA", T1, {headers:{'authorization':"Bearer "+UserAccessToken()}})
        this.message = temp.data.message
        return this.message

    }

    async Create_Faculty(Name : String, Email : String, Pass : String, Contact_Num : Number, TAs_Req : Number, Courses: String[], Image_URL: String)
    {   
        var temp;
        let F1 = new Faculty();
        F1.Faculty(Name,Email,Pass,Contact_Num,TAs_Req,Courses,Image_URL);
        temp = await axios().post("http://localhost:9000/Add_Faculty", F1, {headers:{'authorization':"Bearer "+UserAccessToken()}})
        this.message = temp.data.message
        return this.message
    }

    async Create_Course(Name : String, Code : String)
    {   
        var temp;
        let C1 = new Course();
        C1.Course(Name,Code);
        temp = await axios().post("http://localhost:9000/Add_Course", C1, {headers:{'authorization':"Bearer "+UserAccessToken()}})
        this.message = temp.data.message
        return this.message
    }
}


export class Course
{
    private course_name : String;
    private course_code : String;

    public Course(Name : String, Code : String)
    {
        this.course_name=Name
        this.course_code=Code
    }
}


export class Task
{
    private Task_Name : String;
    private Description : String;
    private Deadliine : Date;
    private Status : String;
    private Rating : Number;
    private Comments : String;
    private TA_Emails : String[];
    private Faculty_Email : String;
    private Course_Code : String;

    public Task(Task_Name : String, Description : String, Deadliine : Date, TA_Emails : String[], Faculty_Email : String, Course_Code : String)
    {
        this.Task_Name=Task_Name
        this.Description=Description
        this.Deadliine=Deadliine
        this.Status="Not Started"
        this.TA_Emails=TA_Emails
        this.Faculty_Email=Faculty_Email
        this.Course_Code=Course_Code        
    }
}*/