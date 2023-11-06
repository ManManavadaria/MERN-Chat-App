const bcrypt = require('bcrypt');
const User = require('../models/userModel');
module.exports.register = async (req,resp,next)=>{
    console.log(req.body);
    try{
        const {username,password,email} = req.body;

        const usernameCheck = await User.findOne({username});
        const emailCheck = await User.findOne({email});
        if(usernameCheck){
            return resp.json({msg:"user already exists",status:false});
        }
        if(emailCheck){
            return resp.json({msg:"email already used",status:false});
        }
            const hashedPassword = await bcrypt.hash(password,10);
            const user = await User.create({username,email,password:hashedPassword});
            delete user.password;
            return resp.json({msg:"registered sucessfully",status:true, user});
    }catch(err){
        next(err);
    }
}

module.exports.login = async(req,resp,next)=>{
    try{
        const {email,username,password} = req.body; 
        const findUser =await User.findOne({username});
        if(!findUser){
            return resp.json({msg:"please use correct credencials",status:false});
        }
        const hashedPassword = await bcrypt.compare(password,findUser.password);
        if(!hashedPassword){
            return resp.json({msg:"please use correct password",status:false});
        }
            delete findUser.password;
            return resp.json({msg:"login sucessfully",status:true,user:findUser})
    
    }
    catch(err){
        next(err);
    }
};

module.exports.setAvatar = async(req,resp,next) =>{
    try{
        console.log("inside async func");
        const {image} = req.body;
        const _id = req.params.id;
        // console.log(userId);
            const user =await User.findByIdAndUpdate(_id,{
            isAvatarImageSet: true,
            avatarImage: image,
        });
        console.log(user);
        return resp.json({msg:"avatar set sucessfully",isSet:true});
    }
    catch(err){
        next(err);
    }
};

module.exports.getAllUser = async(req,resp,next) =>{
    try{
        const user =await User.find({_id:{$ne : req.params.id}}).select(["email","username","avatarImage","_id"]);
        console.log(user);
        return resp.json(user);

}
catch(err){
    next(err);
}
};

module.exports.logOut = (req, res, next) => {
    try {
      if (!req.params.id) return res.json({ msg: "User id is required " });
      onlineUsers.delete(req.params.id);
      return res.status(200).send();
    } catch (ex) {
      next(ex);
    }
  };
