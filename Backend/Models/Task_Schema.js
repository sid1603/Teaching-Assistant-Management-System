import mongoose from 'mongoose';

//Task Schema for DB
const Task_Schema = new mongoose.Schema(
{
Name :  {type: String, required:true},
Description: {type: String, required:true, default:""},
Deadline: {type: Date, required:true, default:""},
Status : {type : Array, required:true},
Rating : {type : Array, required:true},
Comments : {type: Array, required:true},
TA_Emails : {type:Array, default : []},
Faculty_Email : {type:String,requried:true,default:""},
Course_Code : {type:String,requried:true,default:""}
}
)
const TaskModel = new mongoose.model("Task",Task_Schema) 


export default TaskModel