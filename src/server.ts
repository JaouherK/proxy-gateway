import express from 'express';
import {config} from "./config/config";
import {GlobalSecurityGroup} from "./middlewares/GlobalSecurityGroup";
import {ParsersGroup} from "./middlewares/ParsersGroup";
import {ProxyList} from "./api/ProxyList";
import {ProxyProcessData} from "./api/ProxyProcessData";
import {ManagerRouter} from "./routers/ManagerRouter";
import {ProxyRouter} from "./routers/ProxyRouter";
import {CronJob} from "./cronjob";
import {JsonConsoleLogger} from "./logger/jsonConsoleLogger";
// Routers

// Create a new express application instance
const app = express();
const logger = new JsonConsoleLogger();

app.use(GlobalSecurityGroup);
app.use(ParsersGroup);

// Health Check endpoint
app.get('/_healthcheck', function (req, res) {
    res.send('healthy');
});

// Administration
app.use('/manager', ManagerRouter);

// advanced APIS proxy
ProxyList.getAllProxyMappings().then((proxies: ProxyProcessData[]) => {
        proxies.forEach((prox: ProxyProcessData) => {
            app.use(prox.url, ProxyRouter.getRouter(prox, logger));
        });
    }
).catch(err => logger.logError(err));

app.listen(config.port);

new CronJob().start();
