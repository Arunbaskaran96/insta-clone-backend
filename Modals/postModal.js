
const mongoose=require("mongoose")

const postModal=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    title:{
        type:String
    },
    video:{
        type:String
    },
    image:{
        type:String
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            require:true
        }
    ],
    comments:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                require:true
            },
            comment:{
                type:String,
                require:true
            }
        }
    ]
},{timestamps:true})

module.exports=mongoose.model("posts",postModal)