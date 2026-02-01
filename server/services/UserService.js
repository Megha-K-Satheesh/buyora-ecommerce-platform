import Address from '../models/Address.js';
import User from '../models/User.js';
import { ErrorFactory } from '../utils/errors.js';




class UserService {
  

   static async addAddress (userId,addressData){
      console.log(userId)
      const user = await User.findById(userId);
      if(!user){
        throw ErrorFactory.notFound("User not found")
      }
      if(!user.addresses || user.addresses.length ===0){
         addressData.isDefault = true;
      }
       



       if(addressData.isDefault){
             await Address.updateMany(
              {_id:{$in:user.addresses}},
              {isDefault:false}
             )
       }
      const address = await Address.create({
            ...addressData,
            userId:user._id
      })
      user.addresses.push(address._id);
      await user.save()
      return address;
      
      }

      static async getAddresses(userId) {
    const user = await User.findById(userId).populate("addresses"); // populate the addresses
    if (!user) {
      throw ErrorFactory.notFound("User not found");
    }
    return user.addresses;
  }

  static async getAddressById(userId,addressId){
       const address = await Address.findOne({
        _id:addressId,
       userId:userId
       })
       if(!address){
         throw ErrorFactory.notFound("Address not found")
       }
       return address
  }

  static async updateAddress(userId,addressId,updateAddress){
      const address = await Address.findOne({
        _id:addressId,
        userId:userId
      })

      if(!address) throw ErrorFactory.notFound("Address not found")

        Object.assign(address,updateAddress);
        await address.save()
        return address
  }

  static async deleteAddress(userId,addressId){
       const address = await Address.findOne({
        _id:addressId,
        userId:userId
       })

       if(!address){
        throw ErrorFactory.notFound("Address not found")
       }
       await address.deleteOne()
       return true;
  }
}

    

export default UserService
