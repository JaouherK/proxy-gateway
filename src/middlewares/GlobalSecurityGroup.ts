import cors from 'cors';
import {corsConfig} from "../config/corsConfig";
import {SlowDownMiddleware} from "./SpeedLimiterMiddleware";
import {HelmetMiddleware} from "./HelmetMiddleware";

const GlobalSecurityGroup = [
    /* Helmet middleware configuration */
    HelmetMiddleware,

    /* CORS config middleware */
    cors(corsConfig),

    /* Slow down middleware */
    new SlowDownMiddleware().toCallable(),
];

export {GlobalSecurityGroup};
