// List of valid characters
const validChars = [
    ' ', '!', '"', '#', '$', '%', '&', "'", '(',
    ')', '*', '+', ',', '-', '.', '/', '0', '1',
    '2', '3', '4', '5', '6', '7', '8', '9', ':',
    ';', '<', '=', '>', '?', '@', 'A', 'B', 'C',
    'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
    'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U',
    'V', 'W', 'X', 'Y', 'Z', '[', '\\', ']', '^',
    '_', '`', 'a', 'b', 'c', 'd', 'e', 'f', 'g',
    'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
    'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y',
    'z', '{', '|', '}', '~'
];

// Displaying the quote to be typed by user
let quote = '';              // Quote string from API
let quoteLen = 0;            // Length of quote string
let words;                   // Array of words from quote string
let wordsLen = 0;            // Length of array of words

// Typing variables
let initForType = false;    // Initialized for typing
let wordInd = 0;
let currWordLen = 0;

// Statistics
let startTime = 0;
let endTime = 0;
let wrongCharCount = 0;

// Element objects
let btnEl = document.getElementById('startReset');        // Start/Reset button element
let typedEl = document.getElementById('typed-value');     // Text input element where user types
let messageEl = document.getElementById('message');       // Message element to display status
let quoteEl = document.getElementById('quote');           // Paragraph element to display quote
let wordEl = document.getElementById('w0');               // Current word element

// Add event listeners

// When start/reset button is clicked
btnEl.addEventListener('click', function() {
    $.get('https://api.quotable.io/random?minLength=150&maxLength=200', function(response) {
        // Get the quote into quote variable
        quote = response['content'];
        quoteLen = quote.length;
        words = quote.split(' ');
        wordsLen = words.length;
        
        // Display the quote inside html by spanning each word
        let html = '';
        for (let i = 0; i < wordsLen - 1; i++) {
            words[i] = `${words[i]} `;
            html += `<span id="w${i}">${words[i]}</span>`
        }
        html += `<span id="w${wordsLen - 1}">${words[wordsLen - 1]}</span>`
        quoteEl.innerHTML = html;

        resetInterface();

        // Turn Start button to Reset button
        btnEl.innerHTML = 'Reset';
    })
});

typedEl.addEventListener('focus', function (e) {
    if (quoteLen === 0) {
        displayMessage('warning', '<p>Click on <kbd>Start</kbd> first!</p>');
        e.preventDefault();
    }
})

typedEl.addEventListener('input', function(e) {
    // Record start time and get current word
    if (!initForType) {
        startTime = new Date().getTime();
        currWordLen = words[wordInd].length;
        initForType = true;
    }

    let input = this.value;
    let inputLen = input.length;

    // Typing complete
    if (words[wordInd] === input && wordInd === wordsLen - 1) {
        e.preventDefault();
        console.log(input, words[wordInd]);
        endTime = new Date().getTime();

        // Remove highlight from last word
        document.getElementById(`w${wordInd}`).style.backgroundColor = 'transparent';

        // Display message
        displayMessage('primary');
        return;
    }
    // Currently typing correct
    else if (words[wordInd].startsWith(input) && inputLen !== currWordLen) {
        // keep the background color of input normal
        this.style.backgroundColor = 'var(--white)';
        this.style.color = 'var(--dark)';
    }
    // Typed full word correctly
    else if (words[wordInd] === input) {
        // Clear input
        this.value = '';

        // Update current word to next word
        wordInd += 1;
        currWordLen = words[wordInd].length;

        // keep the background color of input normal
        this.style.backgroundColor = 'var(--white)';
        this.style.color = 'var(--dark)';

        // Update highlight
        document.getElementById(`w${wordInd - 1}`).classList.toggle('highlight');
        document.getElementById(`w${wordInd}`).classList.toggle('highlight');
    }
    // Typed incorrect word
    else {
        this.style.backgroundColor = 'var(--red)';
        this.style.color = 'var(--white)';

        let key = e.data;
        if (validChars.includes(key)) {
            wrongCharCount++;
        }
    }
});

// Reset the interface
function resetInterface() {
    // Clear any messages
    message.innerHTML = '';
    message.style.display = 'none';

    // Clear input
    typedEl.value = '';

    // Reset all typing variables
    wrongCharCount = 0;

    // Reset typing variables
    wordInd = 0;
    currWordLen = 0;
    initForType = false;

    // highlight the first word
    document.getElementById('w0').classList.toggle('highlight');
}

// Display a message
function displayMessage(classStr, msg='') {
    message = document.getElementById('message');
    if (classStr == 'warning')
    {
        message.classList.remove('primary');
        message.classList.add('warning');
    }
    else 
    {
        // typing duraction
        let duration = (endTime - startTime)/1000;
        let accuracy = 100 * (1 - wrongCharCount / quoteLen);

        if (accuracy < 0)
            accuracy = 0;

        msg += `<p>Congratulations!! You completed <br>in <b>${duration.toFixed(2)} sec</b> with <b>${accuracy.toFixed(2)}%</b> accuracy...</p>`;

        message.classList.remove('warning');
        message.classList.add('primary');
    }

    message.innerHTML = msg;
    message.style.display = 'block';
}