const jwt = require('jsonwebtoken');
const logger = require('./logger');
const { ErrorFactory } = require('./errors');

const generateUserToken = (payload) => {
  try {
    return jwt.sign(payload, process.env.JWT_USER_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN||'24h'
    });
  } catch (error) {
    logger.error('Error generating user token:', error);
    throw new Error('Token generation failed');
  }
};

const generateAdminToken = (payload) => {
  try {
    return jwt.sign(payload, process.env.JWT_ADMIN_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN||'24h'
    });
  } catch (error) {
    logger.error('Error generating admin token:', error);
    throw new Error('Token generation failed');
  }
};

const generateResetToken = (payload) => {
  try {
    return jwt.sign(payload, process.env.JWT_RESET_SECRET, {
      expiresIn:process.env.JWT_RESET_EXPIRES_IN ||'60m'
    });
  } catch (error) {
    logger.error('Error generating user token:', error);
    throw new Error('Token generation failed');
  }
};



const verifyUserToken = (token) => {
  try {
    if (!process.env.JWT_USER_SECRET) {
      throw new Error('JWT_USER_SECRET not configured');
    }
    return jwt.verify(token, process.env.JWT_USER_SECRET);
  } catch (error) {
    throw new Error('Token verification failed');
  }
};

const verifyAdminToken = (token) => {
  try {
    if (!process.env.JWT_ADMIN_SECRET) {
      throw new Error('JWT_ADMIN_SECRET not configured');
    }
    return jwt.verify(token, process.env.JWT_ADMIN_SECRET);
  } catch (error) {
    throw new Error('Token verification failed');
  }
};

const verifyResetToken = (token) => {
  try {
    if(!token){
       throw ErrorFactory.validation("NO Token")
    }
    if (!process.env.JWT_RESET_SECRET) {
      throw new Error('JWT_RESET_SECRET not configured');
    }
    return jwt.verify(token,process.env.JWT_RESET_SECRET);
  } catch (error) {
    throw new Error('Token verification failed');
  }
};


module.exports = {
  generateUserToken,
  generateAdminToken,
  generateResetToken,
  verifyUserToken,
  verifyAdminToken,
  verifyResetToken
  
};
