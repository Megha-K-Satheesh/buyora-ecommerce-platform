import UserService from "../services/UserService.js";
import { addAddressValidation } from "../utils/validation.js";

import BaseController from "./BaseController.js";



class UserController extends BaseController{

    
        static getProfile = BaseController.asyncHandler(async (req, res) => {
           const user = BaseController.sanitizeUser(req.user);
           BaseController.sendSuccess(res, 'Profile retrieved successfully', { user });
         });
       
    


    static addAddress = BaseController.asyncHandler(async (req, res) => {
     console.log(req.body)
    const validateData = BaseController.validateRequest(addAddressValidation,req.body)

    const address = await UserService.addAddress(req.user._id, validateData);

    BaseController.logAction('ADDRESS_ADD', req.user);
    BaseController.sendSuccess(res, 'Address added successfully', address, 201);
  });



    static getAddresses = BaseController.asyncHandler(async (req, res) => {
    const addresses = await UserService.getAddresses(req.user._id);

    BaseController.logAction('ADDRESS_LIST', req.user);
    BaseController.sendSuccess(res, 'Addresses fetched successfully', addresses, 200);
  });



   static getAddressById = BaseController.asyncHandler(async (req,res)=>{
    const {addressId} = req.params;
    const result = await UserService.getAddressById(req.user._id,addressId)
    BaseController.logAction("ADDRESS FETCHED BY ID",req.user)
    BaseController.sendSuccess(res,"Address fetched",result)
   })



   static updateAddress = BaseController.asyncHandler(async(req,res)=>{
    
     const {addressId} = req.params;
     const userId = req.user._id;
     
          // const validateData = BaseController.validateRequest(updateAddressValidation,req.body)
      const result = await UserService.updateAddress(userId,addressId,req.body)
       
     BaseController.logAction("ADDRESS UPDATED",req.user);
     BaseController.sendSuccess(res,"Address updated sucessfully",result)
   })
   static deleteAddress = BaseController.asyncHandler(async (req,res)=>{
      const {addressId} = req.params;
      const result = await UserService.deleteAddress(req.user._id,addressId)
      BaseController.logAction("ADDRESS DELETED",req.user);
      BaseController.sendSuccess(res,"Address deleted",result)
   })

}
export default UserController
