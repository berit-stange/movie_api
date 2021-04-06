const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    Models = require('./models.js'),
    passportJWT = require('passport-jwt');

let Users = Models.User,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;

//basic HTTP authentication for login requests
passport.use(new LocalStrategy({
    usernameField: 'Username',
    passwordField: 'Password'
}, (username, password, callback) => {
    console.log(username + ' ' + password);
    Users.findOne({ Username: username }, (error, user) => {
        if (error) {
            console.log(error);
            return callback(error);
        }

        if (!user) {
            console.log('incorrect username');
            return callback(null, false, {message: 'Incorrect username'});
        }
        
        if (!user.validatePassword(password)) { //the "validatePassword" from models.js?
            console.log('incorrect password');
            return callback(null, false, {message: 'Incorrect password.'});
        }

        console.log('finished');
        return callback(null, user);
    });
}));

passport.use(new JWTStrategy({  //JWT is extracted from the header of the HTTP request
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret' //“secret” key to verify the signature of the JWT
}, (jwtPayload, callback) => {
    return Users.findById(jwtPayload._id)
    .then((user) => {
        return callback(null, user);
    })
    .catch((error) => {
        return callback(error)
    });
}));