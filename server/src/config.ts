import dotenv from 'dotenv';

dotenv.config();

export const config = {
    jwtSecret: process.env.JWT_SECRET || 'mi_clave_secreta',
    dbUrl: process.env.DB_URL || 'mongodb://localhost/webStore',
    port: process.env.PORT || 3000,
    corsOptions: {
        origin: process.env.CORS_ORIGIN || '*',
        methods: process.env.CORS_METHODS || 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
        allowedHeaders: process.env.CORS_ALLOWED_HEADERS || 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    },
    apiRoutes: {
        users: '/api/users',
        roles: '/api/roles',
        products: '/api/products',
    }
};
