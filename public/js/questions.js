$(document).ready(function() {
  // going to write code here to render question to main body
  // $(window).on( 'load', function() {

  // });

  $('#question-form').on('click', function(event) {
    event.preventDefault();
    var newQuestion = {
      title: $('#title-input').val().trim(),
      question: $('#question-input').val().trim()
    };

    // Does a post to the question route.
    $.post('/api/questions', newQuestion)
      .then(function() {
        alert('New question added');
        location.reload();
      });
  });

  $('#answer-add').on('click', function(event) {
    event.preventDefault();
    var id = $(this).data('id');
    var newAnswer = {
      answer: $('#answer-input').val().trim()
    };
    $.post('/api/questions/' + id + '/answers', newAnswer)
      .then(function(response) {
        // create a new <li> and append it to the <ol> in 
        var newAnswer = $('<li>' + response.answer + '</li>');
        $('#answer-list').append(newAnswer);
        $('#answer-input').val('');
      });
  });

  // When a question is clicked from the "Unanswered Questions" or "Answered Questions" panels
  $('a.panel-block').on('click', function(event) {
    event.preventDefault();
    $('#answer-list').empty(); // remove the <li>s from the <ol> in "Answers"
    // $(this).addClass('is-active'); // Bulma CSS class/Need to removeClass() somewhere
    var id = $(this).data('id');
    var $title = $('#display-question-title');
    var $content = $('#display-question-content');
    // add a data-id attribute to the submit button in the answer form
    $('#answer-add').attr('data-id', id);

    $.get('/api/all')
      .then(function(questions) {
        // compare the id of the questions table with the id of the question that was clicked
        for (let i = 0; i < questions.length; i++) {
          if (questions[i].id === id) {
            $title.text(questions[i].title);
            $content.text(questions[i].question);
          }
        }
      });
  });
});