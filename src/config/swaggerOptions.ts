import {config} from "./config";

export const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Proxy gateway",
            version: "0.2.0",
            description:
                "An initial swagger file for proxy-gateway",
        },
        servers: [
            {
                url: `http://localhost:${config.port}/`
            }
        ]
    },
    apis: ['./src/routers/*.ts', './src/models/*.ts']
};
