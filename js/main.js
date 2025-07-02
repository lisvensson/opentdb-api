let quizContent = document.getElementById('quiz-content');

//Function to fetch questions based on the user's input.
async function fetchQuiz() {
    const amount = document.getElementById('select-amount').value; //Fetches the number of questions the user enters
    const category = document.getElementById('select-category').value; //Fetches the category selected by the user
    const difficulty = document.getElementById('select-difficulty').value; //Fetches the difficulty level selected by the user
    const type = document.getElementById('select-type').value; //Fetches the type of question selected by the user

    if(amount < 1 || amount > 20) {
        displayError('You must select a number of questions between 1-20.');
        return;
    }

    //Determines the URL for the API request based on the user's choices
    let url = `https://opentdb.com/api.php?amount=${amount}`;

    //If a category is selected, it is added to the URL
    if (category) {
        url += `&category=${category}`;
    }
    //If a difficulty is selected, it is added to the URL
    if (difficulty !== 'any') {
        url += `&difficulty=${difficulty}`;
    }
    //If a type is selected, it is added to the URL
    if (type !== 'any') {
        url += `&type=${type}`;
    }

    try {
        const response = await fetch(url); //API request

        //Error handling if the response is not OK
        if (!response.ok) { 
            throw new Error(`HTTP error code: ${response.status}, HTTP error message: ${response.statusText}`);
        }

        const data = await response.json(); //Converts the response to JSON

        //Calls the displayQuiz() function to show the quiz based on the user's selection
        displayQuiz(data.results); 
        
    } catch (error) {
        console.error('Error:', error); //Handles errors during the API request     
        displayError('An error occurred while fetching the quiz questions, please wait and try again...');   
    }
}

//Function to display error messages
function displayError(message) {
    quizContent.innerHTML = `<p class="error">${message}</p>`; 
}

//Function to display the quiz questions
function displayQuiz(quizQuestions) {
    quizContent.innerHTML = ''; //Clears previous content

    //Loop that iterates through each question in the question array
    quizQuestions.forEach((question, index) => {
        const questionHTML = `
        <div class="question-content">
                <p>${index + 1}. ${question.question}</p>
                ${createAnswers(question, index)}
        </div>
        `;
        quizContent.innerHTML += questionHTML; //Adds the questions to the quiz-content element
    });

    //Creates submit button
    const buttonSubmit = `
        <button class="button-submit">Submit answers</button>
    `;
    quizContent.innerHTML += buttonSubmit; //Adds the submit button to the quiz-content element

    //Event listener for the submit button that calls the submitAnswers() function
    document.querySelector('.button-submit').addEventListener('click', () => {
        submitAnswers(quizQuestions);
    });
}

//Function to create the answer options
function createAnswers(question, questionIndex) {
    //Collects all answer options, both correct and incorrect, in an array
    const answers = [question.correct_answer, ...question.incorrect_answers];

    //Shuffles the answer options randomly
    answers.sort(() => Math.random() - 0.5); 
    
    let answersHTML = ''; //Creates an empty string to add content to

    //Loop that iterates through each answer option in the array
    answers.forEach(answer => {
        //Adds each answer option to the string
        answersHTML += `
            <div class="answer-content">
                <input type="radio" name="question${questionIndex}" value="${answer}">
                <label>${answer}</label>
            </div>
        `;
    });
    //Returns the answersHTML string
    return answersHTML; 
}

//Function to handle submitted answers
function submitAnswers(quizQuestions) {
    const questions = quizContent.querySelectorAll('.question-content'); //Fetches all questions

    let counterCorrectAnswers = 0; //Counter to count how many correct answers the user has

    //Loop that goes through each answer option the user selected and adds to the counter if correct
    questions.forEach((question, index) => {
        const selectedAnswer = question.querySelector('input[type="radio"]:checked');
        if (selectedAnswer && selectedAnswer.value === quizQuestions[index].correct_answer) {
            counterCorrectAnswers++; //Increases the counter for each correct answer
        }
    });
    
    //Calls the displayResult function and sends the number of correct answers and total questions to the function
    displayResult(counterCorrectAnswers, questions.length); 
}

//Function that displays the result
function displayResult(counterCorrectAnswers, totalQuestions) {
    quizContent.innerHTML = `<p class="result">You got ${counterCorrectAnswers} out of ${totalQuestions} correct!</p>`;
}