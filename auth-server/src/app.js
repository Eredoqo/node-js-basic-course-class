const fastify = require('fastify');
const fastifyAuth = require('@fastify/auth');
const fastifyJwt = require('@fastify/jwt');
const fastifySensible = require('fastify-sensible');
const swaggerUi = require('@fastify/swagger-ui');
const swagger = require('@fastify/swagger');
const { authRoutes } = require('./routes/v1/routes-auth');
const { adminRoutes } = require('./routes/v1/authanticated/admin/admin-routes');

require('dotenv').config()

const buildAuth = (opts = {}, swaggerOpt = {}) => {
  const app = fastify(opts);

  app.register(require('@fastify/postgres'), {
    connectionString: process.env.DATABASE_URL,
  });

  app.register(fastifyJwt, { secret: process.env.JTW_SECRET });
  app.register(fastifyAuth);
  app.register(fastifySensible);

  app.register(swagger);
  app.register(swaggerUi, swaggerOpt);
  app.register(authRoutes);
  app.register(adminRoutes);

  return app;
};

module.exports = { buildAuth };