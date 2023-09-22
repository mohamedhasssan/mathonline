// JavaScript (script.js) using jQuery
$(document).ready(function () {
    let num1, num2;
    let startTime;
    let timerInterval;
    let tries = 0;
    let results = [];



// Function to save results as JSON file
function saveResultsAsJson() {
    if (results.length === 0) {
        alert('No results to save.');
        return;
    }

    const playerName = prompt('Enter your name:');
    if (!playerName) return;

    const filename = `${new Date().toISOString()}_${playerName}.json`;
    const jsonData = JSON.stringify(results, null, 2);

    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    alert(`Results saved as ${filename}`);
}


// Event listener for the "Save Results as JSON" button click
$('#saveResults').click(saveResultsAsJson);


    // Function to start a new question
    function startNewQuestion() {
        generateRandomNumbers();
        startTimer();
        $('#result').text(''); // Clear the result message
        $('#answer').val(''); // Clear the answer input field
        $('#answer').focus(); // Set focus on the answer input field
        $('#tries').text(tries);
        
        
    }

    // Function to generate random numbers and start the timer
    function generateRandomNumbers() {
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        $('#num1').text(num1);
        $('#num2').text(num2);
    }

    // Function to start the timer
    function startTimer() {
        startTime = new Date().getTime();
        timerInterval = setInterval(updateTimer, 1000);
    }

    // Function to update the timer display
    function updateTimer() {
        const currentTime = new Date().getTime();
        const elapsedTimeInSeconds = Math.floor((currentTime - startTime) / 1000);
        $('#timer').text(elapsedTimeInSeconds + ' seconds');
    }

    // Function to stop the timer
    function stopTimer() {
        clearInterval(timerInterval);
    }

    // Function to check the answer
    function checkAnswer() {
        const userAnswer = parseInt($('#answer').val());
        const correctAnswer = num1 * num2;
        tries++; // Increment the number of tries

        if (userAnswer === correctAnswer) {
            stopTimer();
            const result = {
                date: new Date().toLocaleDateString(),
                playerName: '',
                question: `${num1} x ${num2}`,
                tries: tries, // Record the number of tries
                timeTaken: $('#timer').text(), // Record the time taken
                result: 'Correct',
            };

            results.push(result);
            $('#timer').text('0 seconds');
            tries = 0; // Reset the number of tries
            $('#answer').val(''); // Clear the answer input field
            $('#result').text('Correct'); // Display the result message
            startNewQuestion();
        } else {
            $('#result').text('Wrong'); // Display the result message
            $('#answer').val(''); // Clear the answer input field
            $('#answer').focus(); // Set focus on the answer input field
        }
        $('#tries').text(tries); // Update the number of tries displayed
    }

    // Event listener for the "Check Answer" button click
    $('#checkAnswer').click(checkAnswer);

    // Event listener for the "End Game" button click
    $('#endGame').click(function () {
        const playerName = prompt('Enter your name:');
        if (playerName) {
            for (const result of results) {
                result.playerName = playerName;
            }
            displayResults();
            
        }
    });

    // Event listener for Enter key press (equivalent to clicking "Check Answer" button)
    $('#answer').keypress(function (event) {
        if (event.which === 13) {
            // Enter key pressed
            checkAnswer();
        }
    });

    // Function to display results in the table
    function displayResults() {
        const resultsTable = $('#resultsTable');
        resultsTable.empty(); // Clear previous table content

        if (results.length === 0) {
            resultsTable.html('<p>No results to display.</p>');
            return;
        }

        const table = $('<table>').addClass('table table-bordered');
        const thead = $('<thead>').html(`
            <tr>
                <th>Date</th>
                <th>Player Name</th>
                <th>Question</th>
                <th>Tries</th>
                <th>Time Taken</th>
                <th>Result</th>
            </tr>
        `);
        const tbody = $('<tbody>');

        for (const result of results) {
            const row = $('<tr>').html(`
                <td>${result.date}</td>
                <td>${result.playerName}</td>
                <td>${result.question}</td>
                <td>${result.tries}</td>
                <td>${result.timeTaken}</td>
                <td>${result.result}</td>
            `);
            tbody.append(row);
        }

        table.append(thead);
        table.append(tbody);
        resultsTable.append(table);
    }

    // Start the initial question
    startNewQuestion();
});
