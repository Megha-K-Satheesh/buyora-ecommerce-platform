const Admin = require('../models/Admin');
const User = require('../models/User');
const { ErrorFactory } = require('../utils/errors');
const { generateAdminToken } = require('../utils/jwt');
const logger = require('../utils/logger');
const { notifyUserBanned, notifyUserUnbanned } = require('../utils/socket');

class AdminService {
  static async login(credentials) {
    
      const { email, password } = credentials;

      const admin = await Admin.findByEmail(email);
      if (!admin || admin.role !== 'admin') {
        throw ErrorFactory.conflict('Invalid admin credentials');
      }

      const isPasswordValid = await admin.comparePassword(password);
      if (!isPasswordValid) {
        throw ErrorFactory.notFound('Invalid admin credentials');
      }

      admin.lastLogin = new Date();
      await admin.save();

      const token = generateAdminToken({
        id: admin._id,
        email: admin.email,
        role: admin.role
      });

      logger.info(`Admin logged in: ${email}`);

      return {
        admin: admin.getPublicProfile(),
        token
      };
   
  }

  
}

module.exports = AdminService;
