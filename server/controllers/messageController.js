const Message = require('../models/messageModel');

module.exports.getMessages = async(req,resp,next)=>{
    try {
        const { from, to } = req.body;
    
        const messages = await Message.find({
          users: {
            $all: [from, to],
          },
        }).sort({ updatedAt: 1 });
    
        const projectedMessages = messages.map((msg) => {
          return {
            fromSelf: msg.sender.toString() === from,
            message: msg.message.text,
          };
        });
        resp.json(projectedMessages);
      } catch (ex) {
        next(ex);
      }
} 
module.exports.addMessages =async (req,resp,next)=>{
    try{
        const {from,to,message} = req.body;
        const data = await Message.create({
            message :{text:message},
            users:[from,to],
            sender: from,
        })
        // console.log(data);
        if (data) resp.json({msg:"message loaded sucessfully",status:true});
        else resp.json({msg:"error to load messages",staus:false});
    
    }catch(err){
        next(err);       
    }
    
} 