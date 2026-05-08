

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


brandSchema.pre("save", function () {
  if (!this.isModified("name")) return;

  this.slug = slugify(this.name, {
    lower: true,
    strict: true
  });
});

brandSchema.pre("findOneAndUpdate", function () {
  const update = this.getUpdate();
  const name = update.name || update?.$set?.name;

  if (name) {
    const newSlug = slugify(name, {
      lower: true,
      strict: true
    });

    if (update.$set) update.$set.slug = newSlug;
    else update.slug = newSlug;
  }
});
module.exports = mongoose.model("Brand",brandSchema)
