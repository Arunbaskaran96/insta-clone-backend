const jwt=require("jsonwebtoken")
const dotenv=require("dotenv")
dotenv.config()

module.exports=(req,res,next)=>{
    const token=req.headers.authorization
    if(token){
        const verify=jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
            if(err) return res.status(401).json({message:"Auth verify failed"})
            req.user=user
           next()
        })
    }else{
        res.status(400).json({message:"Auth failed"})
    }
}