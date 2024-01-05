const router=require("express").Router()
const userModal = require("../Modals/userModal")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const dotenv=require("dotenv")
const verifyToken = require("./verifyToken")
dotenv.config()


router.post("/signup",async(req,res)=>{
    try {
        const isUserExist = await userModal.findOne({email:req.body.email})
        if(!isUserExist) {
        const salt=await bcrypt.genSalt(10)
        const hash =await bcrypt.hash(req.body.password,salt)
        const user= new userModal({
            name:req.body.name,
            email:req.body.email,
            password:hash,
            image:req.body.image,
            username:req.body.username
        })
        await user.save()
        res.status(200).json({message:"user added"})
    }else{
        res.status(400).json({message:"user already exist"})
    }
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})


//login

router.post("/login",async(req,res)=>{
    try{
        const isUserExist= await userModal.findOne({email:req.body.email}) 
        if(isUserExist){
            const verifyPassword=await bcrypt.compare(req.body.password,isUserExist.password)
            if(verifyPassword){
                const userData={
                    email:isUserExist.email,
                    _id:isUserExist._id
                }
                const token = jwt.sign(userData,process.env.JWT_SECRET,{expiresIn:'30d'})
                const {password,...others}=isUserExist._doc
                res.status(200).json({others,token:token})
            }else{
                res.status(400).json({message:"Incorrect username/password"})
            }
        }
    }catch(error){
        res.status(500).json({message:"something went wrong"})
    }
})

//follow user

router.put("/follow/:userID",verifyToken,async(req,res)=>{
    try {
        const currentUser=await userModal.findById(req.body.id)
        const findUser=await userModal.findById(req.params.userID)
        const isAlreadyFollowings=currentUser.followings.includes(findUser._id)
        const isAlreadyFollowers=findUser.followers.includes(currentUser._id)
        if(!(isAlreadyFollowings && isAlreadyFollowers)){
            await currentUser.updateOne({$push:{followings:findUser._id}})
            await findUser.updateOne({$push:{followers:currentUser._id}})
            res.status(200).json({message:"you have started follwing"})
        }else{
            res.status(400).json({message:"follow 404 error"})
        }
        
    } catch (error) {
        res.status(500).json({message:"something went wrong"}) 
    }
})


//unfollow user

router.put("/unfollow/:userId",verifyToken,async(req,res)=>{
    try {
        const currentUser=await userModal.findById(req.body.id)
        const findUser=await userModal.findById(req.params.userId)
        const isAlreadyFollowings=currentUser.followings.includes(findUser._id)
        const isAlreadyFollowers=findUser.followers.includes(currentUser._id)
        if(isAlreadyFollowings && isAlreadyFollowers){
            await currentUser.updateOne({$pull:{followings:findUser._id}})
            await findUser.updateOne({$pull:{followers:currentUser._id}})
            res.status(200).json({message:"you have started unfollwing"})
        }else{
            res.status(400).json({message:" unfollow 404 error"})
        }
    } catch (error) {
        res.status(500).json({message:"something went wrong"}) 
    }
})

//get all users

router.get("/getallusers",verifyToken,async(req,res)=>{
    try {
        const users=await userModal.find()
        const filteredUsers=users.filter((item)=>item._id!=req.user._id)
        res.status(200).json(filteredUsers)
    } catch (error) {
        res.status(500).json({message:"something went wrong"}) 
    }
})

//get individual user

router.get("/user/:id",verifyToken,async(req,res)=>{
    try {
        const user =await userModal.findById(req.params.id)
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({message:"something went wrong"})
    }
})


router.get("/getfriends",verifyToken,async(req,res)=>{
    try {
        const user=await userModal.findById(req.user._id)
        const followers=await Promise.all(
            user.followings.map((item)=>{
                return userModal.findById(item)
            })
        )
        res.status(200).json(followers)
    } catch (error) {
        res.status(500).json({message:"something went wrong"})
    }
})

module.exports=router