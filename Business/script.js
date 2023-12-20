// app.js (Node.js example)
 
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const fs = require('fs');
 
const app = express();
const port = 3000;
 
const logFilePath = 'logs.txt';
 
app.use(bodyParser.json());
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));
 
passport.use(new LocalStrategy(
    (username, password, done) => {
        if (username === 'meagavyan21' && password === '012345678910') {
            return done(null, { username: 'meagavyan21' });
        } else {
            return done(null, false, { message: 'Incorrect username or password' });
        }
    }
));
 
passport.serializeUser((user, done) => {
    done(null, user.username);
});
 
passport.deserializeUser((username, done) => {
    done(null, { username: 'meagavyan21' });
});
 
app.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })
);
 
app.post('/api/logs', ensureAuthenticated, (req, res) => {
    const logData = req.body;
    writeLog(logData);
    res.status(200).send('Log submitted successfully');
});
 
app.get('/api/logs', ensureAuthenticated, (req, res) => {
    const logs = getLogs();
    res.status(200).json(logs);
});
 
function writeLog(logData) {
    const logEntry = `${new Date().toISOString()}: ${JSON.stringify(logData)}\n`;
    fs.appendFileSync(logFilePath, logEntry);
}
 
function getLogs() {
    const logs = fs.readFileSync(logFilePath, 'utf-8').split('\n').filter(Boolean);
    return logs;
}
 
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).send('Unauthorized');
}
 
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});