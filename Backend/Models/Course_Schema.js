import mongoose from 'mongoose';

//Course Schema for DB
const CourseSchema = new mongoose.Schema(
{
name :  {type: String, required:true},
code : {type: String, required:true, index:{unique:true}},
}
)
const CourseModel = new mongoose.model("Course",CourseSchema) 

export default CourseModel