const passport = require('passport');
const {
    Strategy: jwtStrategy,
    ExtractJwt
} = require('passport-jwt');
const {
    UserGame
} = require('../models');

const options = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: 'rahasia-sekali',
};

passport.use(
    new jwtStrategy(options, async (payload, done) => {
        UserGame.findByPk(payload.id)
            .then(user => done(null, user))
            .catch(err => done(err, false));
    })
);

module.exports = passport;