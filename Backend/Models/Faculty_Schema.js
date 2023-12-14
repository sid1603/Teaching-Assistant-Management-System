import mongoose from 'mongoose';

//Faculty Schema for DB
const FacultySchema = new mongoose.Schema(
{
name :  {type: String, required:true},
email: {type: String, required:true, index:{unique:true}},
pass: {type: String, required:true},
type : {type : String, required:true, default: "Faculty"},
phone_num : {type: Number, required:true, unique:true},
dept : {type : String, required:true, default : "CSIS"},
TAs_Req : {type: Number},
courses : {type:Array,requried:true},
image_url: {type:String},
TA_Emails : {type:Array, default : []}

}
)
const FacultyModel = new mongoose.model("Faculty",FacultySchema) 

export default FacultyModel