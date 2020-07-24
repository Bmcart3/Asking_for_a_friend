let $title = $('#display-question-title');
let $content = $('#display-question-content');
let $username = $('#display-username');
let $created = $('#display-createdAt');
let $answerList = $('#answer-list');

$(document).ready(function () {

    const getQuestions = (username) => {
        $.get('/api/questions/' + username)
            .then(function (response) {
                $title.text(response[response.length - 1].title);
                $content.text(response[response.length - 1].question);
                $username.text('Posted by: ' + response[0].username);
                $created.text(response[response.length - 1].createdAt.slice(0, 10));
                let answers = response[response.length - 1].Answers;
                // grabs only the last 5 answers from the Answers object
                let recentAnswers = answers.slice(-5);
                recentAnswers.forEach((answer) => {
                let newli = $('<li>').text(answer.answer);
                $($answerList).append(newli);
                });
            })

    }

    const getUser = () => {
        $.get('/api/user_data')
            .then(function (response) {
                getQuestions(response.username);
            });
    }

    $('a.panel-block').on('click', function (event) {
        event.preventDefault();
        $($answerList).empty();
        let id = $(this).attr('data-id');

        // Render the questions and answers to the browser
        $.get('/api/questions/' + id + '/answers')
            .then(function (response) {
                // render the question details
                $title.text(response[0].title);
                $content.text(response[0].question);
                $username.text('Posted by: ' + response[0].username);
                $created.text(response[0].createdAt.slice(0, 10));

                localStorage.setItem('questionId', response[0].id);
                let answers = response[0].Answers;
                // grabs only the last 5 answers from the Answers object
                let recentAnswers = answers.slice(-5);
                recentAnswers.forEach((answer) => {
                    let newli = $('<li>').text(answer.answer);
                    $($answerList).append(newli);
                });
            });
    });

    getUser();
});