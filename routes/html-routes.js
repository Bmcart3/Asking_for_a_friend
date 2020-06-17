// Requiring path to so we can use relative routes to our HTML files
var path = require('path');

// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require('../config/middleware/isAuthenticated');
const db = require('../models');

// const QandA = [
//   { title: 'question title 1', question: 'question body 1', answer: null },
//   { title: 'question title 2', question: 'question body 2', answer: null },
//   { title: 'question title 3', question: 'question body 3', answer: null },
//   { title: 'question title 4', question: 'question body 4', answer: null },
//   { title: 'question title 5', question: 'question body 5', answer: null }
// ]

module.exports = function(app) {

  app.get('/', function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      return res.redirect('/questions'); //was originally members
    }
    res.render('index');
  });

  app.get('/login', function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      return res.redirect('/questions');
    }
    res.render('login');
  });

  app.get('/signup', function(req, res) {
    res.render('signup');
  });

  app.get('/index', function(req, res) {
    res.render('index');
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get('/questions', isAuthenticated, function(req, res) {
    db.Question.findAll({})
      .then(questions => {
        res.render('questions', { questions: questions });
      });
  });

  // app.get('/questions', isAuthenticated, function(req,res) {
  //   db.Answer.findAll({where: {QuestionId:{
  //     [Op.eq]: 2
  //   }}})
  //     .then(answers => {
  //       res.render('questions', { answers: answers });
  //     });
  // });

  //isAuthenticated above is the middleware being inserted into just a specific route.
  //On line 27, it is checking to see if the user is authenticated before sending back the questions page.
};


