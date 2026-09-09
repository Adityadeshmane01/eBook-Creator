const mongoose=require('mongoose');

const chapterSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        default:"",
    },
    content:{
        type:String,
        default:""
    }
});

 const bookSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:"User",
    },
    title:{
        type:String,
        required:true,
    },
    subtitle:{
        type:String,
        required:true,
    },
    author:{
        type:String,
        required:true
    },
    coverImage:{
        type:String,
        default:""
    },
    chapters:[chapterSchema],
    status:{
        type:String,
        enum:["draft","published"],
        default:"draft",
    },
 },{timestamp:true}
);

module.exports=mongoose.model("Book",bookSchema);