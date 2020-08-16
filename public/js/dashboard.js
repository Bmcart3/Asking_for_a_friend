const $title = $('#display-question-title');
const $buttonsDiv = $('.buttons');
const $content = $('#display-question-content');
const $username = $('#display-username');
const $created = $('#display-createdAt');
const $answerList = $('#answer-list');
const $delBtn = $('.del-btn-main');
const $editBtn = $('.edit-btn-main');

$(document).ready(function () {


    const getQuestions = username => {
        $.get('/api/questions/' + username)
            .then(response => {
                console.log(response);
                $title.text(response[response.length - 1].title);
                const editBtn = $('<button class="edit-btn-main"><i class="far fa-edit"></i></button>');
                const delBtn = $('<button class="del-btn-main"><i class="far fa-trash-alt"></i></button>');
                $buttonsDiv.append(editBtn, delBtn);
                $content.text(response[response.length - 1].question);
                $username.text('Posted by: ' + response[0].username);
                $created.text(response[response.length - 1].createdAt.slice(0, 10));
            })

    }

    const getUser = () => {
        $.get('/api/user_data')
            .then(function (response) {
                getQuestions(response.username);
            });
    }

    $('a.panel-block').on('click', function(event) {
        event.preventDefault();
        $($answerList).empty();
        let id = $(this).attr('data-id');

        // Render the questions and answers to the browser
        $.get('/api/questions/' + id + '/answers')
            .then(function (response) {
                console.log(response);
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

    const editQuestion = event => {
        
    }

    const delQuestion = event => {
        
    }
    $editBtn.on('click', editQuestion);
    $delBtn.on('click', delQuestion);

    getUser();
});