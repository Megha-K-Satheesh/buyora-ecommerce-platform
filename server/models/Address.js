const { model, default: mongoose } = require("mongoose")


const addressSchema= new mongoose.Schema({
  
userId:{
   type:mongoose.Schema.Types.ObjectId,
   ref:"User",
   required:true
}
    ,
    fullName: {
       type: String, 
       required: true },
    label: { 
    type: String, 
    enum: ["Home", "Work", "Other"],
     default: "Home" },

     houseNumber:
      { type: String, required: true },
  addressLine: 
  { type: String, required: true },
  locality: 
  { type: String, required: true },
  city: 
  { type: String, required: true },
  pinCode: 
  { type: String, required: true,
     match: /^\d{6}$/ },
  state:
   { type: String, required: true },
  phone: 
  { type: String, required: true,
     match: /^[6-9]\d{9}$/ },
  isDefault: 
  { type: Boolean, default: false },


  
},
{timestamps:true})
addressSchema.index(
  {  houseNumber: 1, addressLine: 1, city: 1, pinCode: 1 },
  { unique: true }
);
module.exports = mongoose.model('Address',addressSchema)
