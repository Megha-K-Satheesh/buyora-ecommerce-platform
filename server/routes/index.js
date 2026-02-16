const config = require('../config/config');
const { createAuthLimiter } = require('../middlewares/setup');

const authRoutes = require('./auth');
const adminRoutes = require('./admin');
const userRoutes = require('./user')
const categoryRoutes = require('./category')
const productRoutes = require('./product')
const brandRoutes = require('./brand')
const usersProductsRoutes = require('./general/productsUser')
const setupRoutes = (app) => {
    const authLimiter = createAuthLimiter();
    const shouldUseAuthLimiter = config.NODE_ENV === 'production';

    app.use('/api/auth',shouldUseAuthLimiter ? authLimiter : [] ,authRoutes); 
    app.use('/api/admin', adminRoutes);
    app.use('/api/user',userRoutes);
    app.use('/api/admin/category',categoryRoutes)
    app.use('/api/admin/product',productRoutes)
    app.use('/api/admin/brand',brandRoutes)
    app.use('/api/products',usersProductsRoutes)
};

module.exports = {
    setupRoutes
};
