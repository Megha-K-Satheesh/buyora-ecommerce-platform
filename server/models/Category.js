const   mongoose  = require("mongoose");



const categorySchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
    trim:true
  },
  parentId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Category",
    default:null,

  },
  level:{
    type:Number,
    required:true,
    enum:[1,2,3]
  },
  isLeaf:{
    type:Boolean,
    default:false
  },
  status:{
    type:String,
    enum:["active","inactive"],
    default:"active"
  },
   isVisible: {     
    type: Boolean,
    default: true
  }
},
{timestamps:true}
)
categorySchema.index({parentId:1});
module.exports = mongoose.model("Category",categorySchema)
