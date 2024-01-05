const router=require("express").Router()
const msgSchema=require("../Modals/messageModal")
const verifyToken = require("./verifyToken")

router.post("/newmsg",verifyToken,async(req,res)=>{
    try {
        const newData= new msgSchema({
            senderId:req.body.senderId,
            receiverId:req.body.receiverId,
            message:req.body.message
        })
        await newData.save()
        res.status(200).json({message:"message delivered"})
    } catch (error) {
        res.status(500).json({message:"something went wrong"})
    }
})

router.get("/getmsg/:receiverId",verifyToken,async(req,res)=>{
    try {
        const sendercon=await msgSchema.find({$and:[{senderId:req.user._id},{receiverId:req.params.receiverId}]})
        const receivercon= await msgSchema.find({$and:[{senderId:req.params.receiverId},{receiverId:req.user._id}]})
        let conv=[...sendercon,...receivercon]
        conv.sort((a,b)=>a.createdAt-b.createdAt)

        res.status(200).json(conv)
    } catch (error) {
        res.status(500).json({message:"something went wrong"})
    }
})



module.exports= router