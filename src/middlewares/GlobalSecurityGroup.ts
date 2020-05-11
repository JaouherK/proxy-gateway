import cors from 'cors';
import {corsConfig} from "../config/corsConfig";
import {SlowDownMiddleware} from "./SpeedLimiterMiddleware";
import {HelmetMiddleware} from "./HelmetMiddleware";


/************* Helmet config **********************/
/* more details: https://helmetjs.github.io/docs/ */
const GlobalSecurityGroup = [
    /* Helmet middleware configuration */
    HelmetMiddleware,

    /* CORS config middleware */
    cors(corsConfig),

    /* Slow down middleware */
    new SlowDownMiddleware().toCallable(),
];

export {GlobalSecurityGroup};
