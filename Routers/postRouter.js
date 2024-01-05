const router=require("express").Router()
const postModal=require("../Modals/postModal")
const userModal = require("../Modals/userModal")
const verifyToken=require("./verifyToken")

router.post("/addpost",verifyToken,async(req,res)=>{
    try {
       const post =new postModal ({
        user:req.user._id,
        title:req.body.title,
        image:req.body.image,
        video:req.body.video
       })
       await post.save()
       res.status(200).json({message:"post added"})

    } catch (error) {
        res.status(500).json({message:"something went wrong"})
    }
})

//get user post

router.get("/getuserpost",verifyToken,async(req,res)=>{
    try {
        const userpost=await postModal.find({user:req.user._id})
        res.status(200).json(userpost)
    } catch (error) {
        res.status(500).json({message:"something went wrong"})
    }
})

//like on post

router.put("/:id/like",verifyToken,async(req,res)=>{
    const {id}=req.params
    try {
        const post = await postModal.findById(id)
        if(post){
            const isLiked=post.likes.includes(req.body.id)
            if(!isLiked){
                await post.updateOne({$push:{likes:req.user._id}})
                res.status(200).json({message:"liked"})
            }else{
                await post.updateOne({$pull:{likes:req.user._id}}) 
                res.status(200).json({message:"Disliked"}) 
            }
        }
        
    } catch (error) {
        res.status(500).json({message:"something went wrong"})
    }
})

//comment on post

router.put("/:id/comment",async(req,res)=>{
    try {
        const newComment = {
            user:req.body.user,
            comment:req.body.comment
        }
        const post=await postModal.findById(req.params.id)
        if(post) {
            post.comments.push(newComment)
            await post.save()
            res.status(200).json({message:'comment posted'})
        }
    } catch (error) {
        res.status(500).json({message:"something went wrong"})
    }
})

router.get("/fetchfollowersposts",verifyToken,async(req,res)=>{
    try {
        const currentUser=await userModal.findById(req.user._id)
        const currentUserPosts=await postModal.find({user:currentUser._id}).populate("user")
        const otherUsersPost=await Promise.all(
            currentUser.followings.map((item)=>{
                return postModal.find({user:item}).populate("user")
            })
        )
        const posts=currentUserPosts.concat(...otherUsersPost)
        posts.sort((a,b)=>b.createdAt-a.createdAt)
        res.status(200).json(posts)
    } catch (error) {

        res.status(500).json({message:"something went wrong"})
    }
})

//get all posts 

router.get("/allposts",verifyToken,async(req,res)=>{
    try {
        const posts = await postModal.find()
        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json({message:"something went wrong"})
    }
})

//fetch post comment

router.get("/fetchpostcomment/:postId",verifyToken,(async(req,res)=>{
    try {
        const post =await postModal.findById(req.params.postId)
        const comments=await Promise.all(
            post.comments.map((item)=>{
                return item.populate("users")
            })
        )
        res.status(200).json(comments)
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"something went wrong"})
    }
}))

//fetch single user post

router.get("/fetchuserpost/:id",verifyToken,async(req,res)=>{
    try {
        const posts=await postModal.find({user:req.params.id})
        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json({message:"something went wrong"})
    }
})

module.exports=router