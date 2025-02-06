import { randomUUID } from "crypto"
import mongoose from "mongoose"
const chatSchema=new mongoose.Schema({
    id:{
        type:String,
        default :randomUUID(),

    },
role:{
    type:String,
    required:true,
},
content:{
    type:String,
    required:true,
},
});
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,

    },
    password:{
        type:String,
        required:true,
    },
    chats:[chatSchema],
});
export default mongoose.model("User",userSchema);