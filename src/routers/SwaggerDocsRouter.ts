import {swaggerOptions} from "../config/swaggerOptions";
import {Router} from "express";

const router: Router = Router();
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const specs = swaggerJsdoc(swaggerOptions);

router.use("/", swaggerUi.serve);

router.get('/', swaggerUi.setup(specs));

export const SwaggerDocsRouter: Router = router;
