

const  mongoose  = require("mongoose");
const { default: slugify } = require("slugify");


brandSchema = new mongoose.Schema({
   name:{
    type:String,
    required:true,
    unique:true,
    trim:true
   },
    slug: {
      type: String,
     
      unique: true,
      lowercase: true,
      trim: true
    },
      categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
      }
    ],
   isActive:{
    type:Boolean,
    default:true
   }
},{timestamps:true})


brandSchema.pre("save", function (next) {
  if (!this.isModified("name")) return next();

  this.slug = slugify(this.name, {
    lower: true,
    strict: true
  });

  next();
});
brandSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  const name = update.name || update?.$set?.name;

  if (name) {
    const newSlug = slugify(name, { lower: true, strict: true });

    if (update.$set) update.$set.slug = newSlug;
    else update.slug = newSlug;
  }

  next();
});

module.exports = mongoose.model("Brand",brandSchema)
