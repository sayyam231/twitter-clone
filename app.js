// ********** Importing Modules **********
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const middleware = require('./middleware');


// ********** Using Modules **********
const app = express();
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

mongoose.connect(process.env.MONGODB_URI,
    err => {
        if(err) throw err;
        console.log('connected to MongoDB')
    });


// ********** Server listening on port: 3000 **********
const server = app.listen(process.env.PORT || 3000, function () {
    console.log('Server is running');
});

// ********** Routes **********
// Home Route
app.get('/', middleware.isLoggedIn, function(req, res) {
    res.render('home', {userLoggedIn: req.session.user, home:'active'});
});

// Login Route
const loginRoutes = require('./routes/loginRoutes');
app.use('/login', loginRoutes);

// Register Route
const registerRoutes = require('./routes/registerRoutes');
app.use('/register', registerRoutes);

// Post Route
const postRoutes = require('./routes/postRoutes');
app.use('/post', middleware.isLoggedIn, postRoutes);

// Profile Route
const profileRoutes = require('./routes/profileRoutes');
app.use('/profile', middleware.isLoggedIn, profileRoutes);

// Upload Route
const uploadRoutes = require('./routes/uploadRoutes');
app.use('/uploads', middleware.isLoggedIn, uploadRoutes);

// Logout Route
const logoutRoutes = require('./routes/logoutRoutes');
app.use('/logout', middleware.isLoggedIn, logoutRoutes);

// Search Route
const searchRoutes = require('./routes/searchRoutes');
app.use('/search', middleware.isLoggedIn, searchRoutes);


// ********** API Routes **********
// Posts Route
const postsApiRoute = require('./routes/api/posts');
app.use('/api/posts', postsApiRoute);

// Users Route
const usersApiRoute = require('./routes/api/users');
app.use('/api/users', usersApiRoute);
