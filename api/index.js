require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path')
const PORT = process.env.PORT || 4000;
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('../config/corsOptions');
const {setupOttoman} = require('../config/dbConnect');
const  {Logger} = require('../config/logger');
const log = Logger.child({
    namespace: 'Index',
});

const main = async () => {
    console.log("Starting Ottoman setup...");
    await setupOttoman();
    console.log("Ottoman setup complete.");
  
    console.log("Setting up middleware...");
    app.use(cors(corsOptions));
    app.use(express.json()); // middleware to parse json
    app.use(cookieParser());
  
    // static route
    app.use('/', express.static(path.join(__dirname, '/public')));
    console.log("Static routes set up.");
  
    // user routes - for testing
    app.use('/test', require('../routes/testRoutes'));
    console.log("Test routes set up.");
  
    // user routes - for /api/users and /api/user
    app.use('/api', require('../routes/userRoutes'));
    console.log("User routes set up.");
  
    // user routes - for profiles
    app.use('/api/profiles', require('../routes/profileRoutes'));
    console.log("Profile routes set up.");
  
    // article routes
    app.use('/api/articles', require('../routes/articleRoutes'));
    console.log("Article routes set up.");
  
    // comment routes
    app.use('/api/articles/:articleId/comments', require('../routes/commentRoutes'));
    console.log("Comment routes set up.");
  
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
};
  
main();
  
module.exports = app;
