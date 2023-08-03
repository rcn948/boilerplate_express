var LocalStrategy = require('passport-local').Strategy;
// var RememberMeStrategy = require('passport-remember-me').Strategy;
var models = require('../models');

module.exports = function(passport) {
    function randomString(len) {
        var buf = []
            , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
            , charlen = chars.length;

        for (var i = 0; i < len; ++i) {
            buf.push(chars[getRandomInt(0, charlen - 1)]);
        }

        return buf.join('');
    }

    passport.serializeUser(function(user, done) {
        console.log({user_id: user.user_id, status: user.status});
        done(null, {user_id: user.user_id, status: user.status});
    });

    passport.deserializeUser(function(obj, done) {
        models.User.findOne({where: {user_id: obj.user_id}}).then(function (user) {
            console.log(user);
            done(null, user);
        }).catch(function (err) {
            done(err, null);
        });
    });

    function issueToken(user, done) {
        var token = randomString(64);
        saveRememberMeToken(token, user, function(err) {
            if (err) { return done(err); }
            return done(null, token);
        });
    }

    const saveRememberMeToken = (token, user, fn) => {
        models.User.update({remember_me: token}, {where:{user_id: user.user_id}}).then(()=>{
            return fn();
        });
    };

    const consumeRememberMeToken = (token, fn) => {
        models.User.findOne({where:{remember_me: token}, raw: true}).then(user=>{
            return fn(null, user);
        })
    };

    //
    // passport.use("remember-me",new RememberMeStrategy(
    //     function(token, done) {
    //         consumeRememberMeToken(token, function(err, user) {
    //             if (err) { return done(err); }
    //             if (!user) { return done(null, false); }
    //             return done(null, user);
    //
    //         });
    //     },
    //     issueToken
    // ));

    passport.use('local',new LocalStrategy({
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback: true,
        },
        function(req, username, password, done) {
            models.User.findOne({where: {user_id: username}}).then(async function (user) {
                console.log(user);
                if (!user) {
                    done(null, false, {message: `noUserid`});
                }
                if(user.password != password){
                    return done(null, false, {message: '비밀번호가 올바르지 않습니다'});
                }
                return done(null, user);
            }).catch(function (err) {
                return done(err);
            });
        }
    ));
};
