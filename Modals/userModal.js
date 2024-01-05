
const mongoose=require("mongoose")

const userModal=new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    image:{
        type:String,
    },
    password:{
        type:String,
        require:true
    },
    username:{
        type:String,
        require:true
    },
    followings:{
        type:Array
    },
    followers:{
        type:Array
    }
})

module.exports=mongoose.model("users",userModal)