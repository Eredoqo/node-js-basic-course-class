require('dotenv').config()
const fastify = require("fastify")
const {bookRoutes} = require("./routes/books")
const swaggerUi =require("@fastify/swagger-ui")
const swagger = require("@fastify/swagger")
const fastifyAuth = require('@fastify/auth');
const fastifyJwt = require('@fastify/jwt');
const fastifySensible = require('fastify-sensible');


const build = (opts = {}, swaggerOpt={}) => {
    const app = fastify(opts)

    app.register(fastifyJwt, { secret: 'node' });
  app.register(fastifyAuth);
  app.register(fastifySensible);

    app.register(require('@fastify/postgres'), {
        connectionString: process.env.DATABASE_URL
      })

    app.register(swagger)
    app.register(swaggerUi, swaggerOpt)
    app.register(bookRoutes)


    return app
}
module.exports={build};