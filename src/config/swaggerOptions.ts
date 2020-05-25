import {config} from "./config";

export const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Proxy gateway",
            version: "0.2.0",
            description:
                "An initial swagger file for proxy-gateway",
            termsOfService: "https://jaouherk.github.io/proxy-gateway/",
        },
        servers: [
            {
                url: `http://localhost:${config.port}/manager/`
            }
        ],
        tags: [
            {
                name: "Namespaces",
                description: "Everything about Namespace",
                externalDocs:
                    {
                        description: "Find out more about our store",
                        url: "https://jaouherk.github.io/proxy-gateway/"
                    }
            },
            {
                name: "Proxies",
                description: "Everything about Proxy table",
                externalDocs:
                    {
                        description: "Find out more about our store",
                        url: "https://jaouherk.github.io/proxy-gateway/"
                    }
            }
        ],
        schemes: [
            "http"
        ]
    },
    apis: ['./src/routers/**/*.ts', './src/models/*.ts'],
};
