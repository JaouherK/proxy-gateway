import express from 'express';
import {config} from "./config/config";
// import {GlobalSecurityGroup} from "./middlewares/GlobalSecurityGroup";
import {ParsersGroup} from "./middlewares/ParsersGroup";
import {ProxyList} from "./api/ProxyList";
import {ProxyProcessData} from "./api/ProxyProcessData";
import {ManagerRouter} from "./routers/ManagerRouter";
import {ProxyRouter} from "./routers/ProxyRouter";
import {CronJob} from "./cronjob";
import {JsonConsoleLogger} from "./logger/JsonConsoleLogger";
import {ErrorHandler} from "./handlers/ErrorHandler";
import passport = require("passport");
import {User} from "./models/User";

var cors = require('cors');

const session = require('express-session');

const cluster = require('cluster');

// worker array that keeps relative PIDs
let workers: any = [];

const app = express();
const logger = new JsonConsoleLogger();


app.use(cors());
app.options('*', cors());

// todo: to read number of cores on system
// let numCores = require('os').cpus().length;

let GitHubStrategy = require('passport-github2').Strategy;

passport.use(new GitHubStrategy({
        clientID: '378f9143a4dd707c4257',
        clientSecret: '55effb11ada89d7daeb727ce8e8a482889600eef',
        callbackURL: "http://localhost:3232/auth/github/callback"
    },
    function (accessToken: any, refreshToken: any, profile: any, done: any) {
        // asynchronous verification, for effect...
        process.nextTick(function () {
                const uuid = require('uuid-v4');
                const id = uuid();
                User.upsert(
                    {
                        id: id,
                        githubId: profile.id,
                        username: profile.username,
                        displayName: profile.displayName,
                        photo: profile.photos[0].value
                    }
                );
                return done(null, profile);
            }
        );
    }
));

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});

app.use(require('cookie-parser')());
app.use(session({secret: 'keyboard cat', resave: false, saveUninitialized: false}));

app.use(passport.initialize());
app.use(passport.session());


app.get('/account', ensureAuthenticated, function (req, res) {
    res.send({user: req.user});
});

app.get('/auth', (req, res) => {
    res.send({marco: 'polo'});
});

app.get('/auth/github',
    passport.authenticate('github', {scope: ['user:email']}),
    function (req, res) {
        console.log(req.query);
        // The request will be redirected to GitHub for authentication, so this
        // function will not be called.
    });

app.get('/auth/github/callback',
    passport.authenticate('github', {failureRedirect: '/auth'}),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/account');
    });

app.get('/logout', function (req, res) {
    req.logout();
    res.sendStatus(200);
});

function ensureAuthenticated(req: any, res: any, next: any) {
    if (req.isAuthenticated()) {
        return next();
    }
    logger.logSecurity({message: "Unauthenticated access", tag: "authentication"});
    res.send({user: false})
    // res.sendStatus(401);
}

// app.use(GlobalSecurityGroup);
app.use(ParsersGroup);

// Health Check endpoint
app.get('/_healthcheck', function (req, res) {
    res.send('healthy');
});

// Administration
app.use('/manager', ManagerRouter);

// advanced APIs proxy
ProxyList.getAllProxyMappings().then((proxies: ProxyProcessData[]) => {
        proxies.forEach((prox: ProxyProcessData) => {
            app.use(prox.url, ProxyRouter.getRouter(prox, logger));
        });
    }
).catch(err => logger.logError(err));


app.use(function (req, res, next) {
    logger.logError({process: '404 - Route ' + req.url + ' Not found.', tag: '404'});
    return res.sendStatus(404);
});

// 500 - Any server error
app.use(function (err: any, req: any, res: any, next: any) {
    logger.logError({process: '505 - Route ' + req.url + ' caused Server error.', tag: '500'});
    return res.status(500).send({error: err});
});

if (cluster.isMaster) {

    //could be used later to create parameterizable number of clusters
    workers.push(cluster.fork());

    // to receive messages from worker process
    workers[0].on('message', function (message: string) {
        logger.log({process: message, tag: 'cluster'});
    });

    // process is clustered on a core and process id is assigned
    cluster.on('online', function (worker: any) {
        logger.log({process: 'Worker PID-' + worker.process.pid + ' is listening', tag: 'cluster'});
    });

    // if any of the worker process dies then start a new one by simply forking another one
    cluster.on('exit', function (worker: any, code: string) {
        logger.logError({process: 'Worker ' + worker.process.pid + ' died with code: ' + code, tag: 'cluster'});
        logger.log({process: 'Starting a new worker', tag: 'cluster'});
        cluster.fork();
        workers.push(cluster.fork());
        // to receive messages from worker process
        workers[workers.length - 1].on('message', function (message: string) {
            logger.log({process: message, tag: 'cluster'});
        });
    });

    cluster.on('listening', (worker: any, address: any) => {
        logger.log({
            process: 'Worker PID-' + worker.process.pid + ' is now connected to port: ' + address.port,
            tag: 'cluster'
        });
    });
} else {
    app.listen(config.port);
}

new ErrorHandler().listenUncatchErrors();
new CronJob().start();
