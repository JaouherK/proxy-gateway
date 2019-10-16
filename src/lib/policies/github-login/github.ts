import {User} from "../../../models/User";
import passport = require("passport");
import {config} from "../../../config/config";

let GitHubStrategy = require('passport-github2').Strategy;

passport.use(new GitHubStrategy({
        clientID: config.githubClientID,
        clientSecret: config.githubClientSecret,
        callbackURL: config.githubCallbackURL
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

const passportGithub = passport;

export {passportGithub};