const mongoose = require("mongoose");

const variationSchema = require("./VariationSchema");
const { default: slugify } = require("slugify");

const productSchema = new mongoose.Schema({
   name:{
    type:String,
    required:true,
    trim:true
   },
    slug: {
      type: String,
      lowercase: true,
      index: true
    },
    description:{
      type:String,
      required:true
    }
    ,
    brand: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Brand",
           
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
      totalStock: { type: Number, required: true, min: 0 },
    
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


productSchema.pre('save',function(next){
  if(!this.isModified("name")) return next();
  this.slug = slugify(this.name,{
    lower:true,
    strict:true
  })
  next()
})


productSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  const name = update.name || update?.$set?.name;

  if (name) {
    const newSlug = slugify(name, { lower: true, strict: true });
    if (update.$set) update.$set.slug = newSlug;
    else update.slug = newSlug;
  }

  next();
});

module.exports = mongoose.model("Product",productSchema)
