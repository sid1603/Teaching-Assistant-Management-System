import mongoose from 'mongoose';

//TA Schema for DB
const TASchema = new mongoose.Schema(
    {
        name :  {type: String, required:true},
        email: {type: String, required:true, index:{unique:true}},
        pass: {type: String, required:true},
        type : {type : String, required:true, default : "TA"},
        dept : {type : String, required:true, default : "CSIS"},
        phone_num : {type: Number, required:true, unique:true},
        course1 : {type:String,requried:true,default:""},
        course2 : {type:String,requried:true,default:""},
        course3 : {type:String,requried:true,default:""},
        Application_Status :{type:String,requried:true},
        Faculty_Email : {type:String,requried:true,default:""},
        Final_Course_Code : {type:String,requried:true,default:""},
        image_url: {type:String}
    }
)
const TAModel = new mongoose.model("TA",TASchema) 

export default TAModel