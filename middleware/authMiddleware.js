const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {

    const token = req.cookies.jwt

    // check json web token exists & is verified
    if(token) {
        jwt.verify(token, 'any secret for jwt', (err, decodedToken) => {
            if(err) {
                console.log('requireAuth', err.message);
                res.redirect('/login');
            } else {
                console.log('requireAuth', decodedToken);
                next();
            }
        });
    } else {
        res.redirect('/login');
    }
}

// check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if(err) {
                console.log('checkUser', err.message);
                res.locals.user = null;
                next();
            } else {
                console.log('checkUser', decodedToken);
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
}

module.exports = { requireAuth, checkUser };
