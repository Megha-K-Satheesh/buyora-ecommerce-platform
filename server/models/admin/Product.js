const mongoose = require("mongoose");

const variationSchema = require("./VariationSchema");

const productSchema = new mongoose.Schema({
   name:{
    type:String,
    required:true,
    trim:true
   },
    description:{
      type:String,
      required:true
    }
    ,
    brand: {
  type: String,
  required: true
},
    category:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Category",
      required:true
    },
    images:[{
      type:String,
      required:true
    }],
    variations:{
      type:[variationSchema],
      required:true
    },
    mrp:{
      type:Number,
      required:true,
      min:0
    },
    sellingPrice:{
      type:Number,
      required:true,
      min:0
    },
    discountPercentage:{
      type:Number,
      default:0
    },
    rating:{
      type:Number,
      default:0,
      min:0,
      max:5
    },
    ratingCount:{
      type:Number,
      default:0
    },
    
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    },
    isVisible: {
      type: Boolean,
      default: true
    }
},{timestamps:true})
module.exports = mongoose.model("Product",productSchema)
