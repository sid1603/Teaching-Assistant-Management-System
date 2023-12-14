import mongoose from 'mongoose';

//Admin Schema for DB
const AdminSchema = new mongoose.Schema(
{
name :  {type: String, required:true},
email: {type: String, required:true, index:{unique:true}},
pass: {type: String, required:true},
type : {type : String, required:true, default: "Admin"},
phone_num : {type: Number, required:true, unique:true},
dept : {type : String, required:true, default : "CSIS"},
image_url : {type : String}
}
)
const AdminModel = new mongoose.model("Admin",AdminSchema) 


export default AdminModel