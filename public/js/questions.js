let $title = $('#display-question-title');
let $content = $('#display-question-content');
let $username = $('#display-username');
let $created = $('#display-createdAt');
let $answerBtn = $('#answer-add');
let $answerList = $('answer-list');

$(document).ready(function () {
  // When the page loads, retrieve the last selected question from local storage and render it
  // If local storage is empty, make an api request to render a question from database
  // If nothing in database, display a message in the browser
  const renderLastQuestion = () => {

    const checkLocalStorage = () => {
      let id = localStorage.getItem('questionId');
      if (id !== null) {
        $.get('/api/questions/' + id + '/answers')
          .then(function (response) {
            console.log(response);
            // add a data-id attribute to the submit button in the answer form
            $($answerBtn).attr('data-id', response[0].id);
            // render the question details
            $title.text(response[0].title);
            $content.text(response[0].question);
            $username.text('Posted by: ' + response[0].username);
            $created.text(response[0].createdAt);
            // I changed this index to just 0 since there will only ever be one item in the array
            
            let answers = response[0].Answers;
            console.log(answers);
            // for (let i = 0; i = answers.length; i++) {
            //   let newli = $('<li>').text(answers.answer);
            //   $($answerList).append(newli);
            // }
            // grabs only the last 5 answers from the Answers object
            // let recentAnswers = answers.slice(-5);
            // console.log(recentAnswers);
            // // create a new <li> for each recent answer and append it to the list
            // recentAnswers.forEach((answer) => {
            //   let newli = $('<li>').text(answer.answer);
            //   $($answerList).append(newli);
            // });
          });
      } else {
        $.get('/api/questions/' + 1 + '/answers')
          .then(function (response) {
            console.log(response);
            $($answerBtn).attr('data-id', response[0].id);
            // render the question details
            $title.text(response[0].title);
            $content.text(response[0].question);
            $username.text('Posted by: ' + response[0].username);
            $created.text(response[0].createdAt);
            // I changed this index to just 0 since there will only ever be one item in the array
            let answers = response[0].Answers;
            // grabs only the last 5 answers from the Answers object
            let recentAnswers = answers.slice(-5);
            // render a new <li> for each recent answer
            recentAnswers.forEach((answer) => {
              let newli = $('<li>').text(answer.answer);
              $($answerList).append(newli);
            });
          });
      }
    };

    // First, check to see if any questions exist in the database
    // If so, check local storage for a question id to render
    $.get('/api/all')
      .then(function (response) {
        if (response.length === 0) {
          $title.text('No questions yet!');
          let newLi = $('<li>').appendTo('#question-list');
          let newAnchor = $('<a>').attr('class', 'panel-block').text('Ask a question to see it appear here!');
          newAnchor.appendTo(newLi);
        } else {
          checkLocalStorage();
        }
      });

  };
  // calling function to render last clicked question
  renderLastQuestion();

  // When user submits a new question...
  $('#question-form').on('click', function (event) {
    event.preventDefault();
    const newQuestion = (username) => {
      const newQuestion = {
        title: $('#title-input').val().trim(),
        question: $('#question-input').val().trim(),
        username: username
      };
      // Does a post to the question route.
      $.post('/api/questions', newQuestion)
        .then(function (response) {
          localStorage.setItem('questionId', response.id);
          location.reload();
        })
        .catch(function (err) {
          console.log(err);
        });
    };

    $.get('/api/user_data')
      .then(function (response) {
        newQuestion(response.username);
      });
  });

  // When user adds a new answer...
  $($answerBtn).on('click', function (event) {
    let dataId = $(this).attr('data-id');
    let id = (typeof dataId === 'undefined') ? 1 : dataId;
    event.preventDefault();
    let newAnswer = {
      answer: $('#answer-input').val().trim()
    };
    $.post('/api/questions/' + id + '/answers', newAnswer)
      .then(function (response) {
        // create a new <li> and append it to the <ol> in questions.handlebars
        let newAnswer = $('<li>' + response.answer + '</li>');
        $($answerList).append(newAnswer);
        $('#answer-input').val('');
      });
  });

  // When a question is clicked from the "All Questions" panel
  $('a.panel-block').on('click', function (event) {
    event.preventDefault();
    // remove the <li>s from the <ol> in "Answers"
    $($answerList).empty();
    // get the data-id from questions.handlebars
    let id = $(this).attr('data-id');
    // add a data-id attribute to the submit button in the answer form
    $($answerBtn).attr('data-id', id);

    // Render the questions and answers to the browser
    $.get('/api/questions/' + id + '/answers')
      .then(function (response) {
        // render the question details
        $title.text(response[0].title);
        $content.text(response[0].question);
        $username.text('Posted by: ' + response[0].username);
        $created.text(response[0].createdAt);
        // $created.text(moment.utc(response[i].createdAt.local().format('LLL')));

        // set the Question's id to local storage to use when page reloads
        localStorage.setItem('questionId', response[0].id);
        // I changed this index to just 0 since there will only ever be one item in the array
        let answers = response[0].Answers;
        // grabs only the last 5 answers from the Answers object
        let recentAnswers = answers.slice(-5);
        // render a new <li> for each recent answer
        recentAnswers.forEach((answer) => {
          let newli = $('<li>').text(answer.answer);
          $($answerList).append(newli);
        });
      });
  });
});