// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require('../config/middleware/isAuthenticated');
const db = require('../models');

module.exports = function(app) {

  app.get('/', function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      return res.redirect('/questions'); //was originally members
    }
    res.locals.metaTags = { 
      title: 'Asking for a Friend', 
      description: 'Get answers to the burning questions you\'re too embarrassed to ask irl.'
    }; 
    res.render('index', { layout: "main" });
  });

  app.get('/login', function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      return res.redirect('/questions');
    }
    res.locals.metaTags = { 
      title: 'Login - Asking for a Friend', 
      description: 'Get answers to the burning questions you\'re too embarrassed to ask irl.'
    }; 
    res.render('login', { layout: "main" });
  });

  app.get('/signup', function(req, res) {
    res.locals.metaTags = { 
      title: 'Sign Up - Asking for a Friend', 
      description: 'Get answers to the burning questions you\'re too embarrassed to ask irl.'
    }; 
    res.render('signup', { layout: 'main' });
  });

  app.get('/index', function(req, res) {
    res.locals.metaTags = { 
      title: 'Asking for a Friend', 
      description: 'Get answers to the burning questions you\'re too embarrassed to ask irl.'
    };
    res.render('index', { layout: 'main' });
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get('/questions', isAuthenticated, function(req, res) {
    
    db.Question.findAll({})
      .then(questions => {
        res.locals.metaTags = { 
          title: 'All Questions - Asking for a Friend', 
          description: 'Ask a new question or answer another user.'
        };
        res.render('questions', { questions: questions });
      });
  });

  app.get('/dashboard', isAuthenticated, function(req, res) {
    db.Question.findAll({})
      .then(questions => {
        res.locals.metaTags = { 
          title: 'Dashboard - Asking for a Friend', 
          description: 'Update and delete questions you\'ve asked and answers you\'ve given.'
        };
        res.render('dashboard', { questions: questions });
      });
  });

};