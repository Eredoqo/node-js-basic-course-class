const {buildAuth} = require("./app")

const app = buildAuth(
    {logger: true},
    {
        routePrefix: "/docs",
        uiConfig: {
            docExpansion: "full",
            deepLinking: false,
        },
        uiHooks: {
            onRequest: function (request, reply, next) {
                next();
            },
            preHandler: function (request, reply, next) {
                next();
            },
        },
        staticCSP: true,
        transformStaticCSP: (header) => header,
        transformSpecification: (swaggerObject, request, reply) => {
            return swaggerObject;
        },
        transformSpecificationClone: true,
    }
);

app.listen({port: 8080, host: "127.0.0.1"})