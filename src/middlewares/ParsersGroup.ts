import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import {config} from "../config/config";

const ParsersGroup = [
    bodyParser.json({limit: config.jsonLimit}),
    cookieParser(),
];

export {ParsersGroup};
