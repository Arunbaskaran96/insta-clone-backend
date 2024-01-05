const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    senderId:{
        type:String,
        require:true
    },
    receiverId:{
        type:String,
        require:true
    },
    message:{
        type:String
    }
},{timestamps:true})

module.exports = mongoose.model("message",messageSchema)