'use strict';

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
let wrongWords = [];

// Element objects
let btnEl = document.getElementById('startReset');        // Start/Reset button element
let typedEl = document.getElementById('typed-value');     // Text input element where user types
let messageEl = document.getElementById('message');       // Message element to display status
let quoteEl = document.getElementById('quote');           // Paragraph element to display quote
let wordEl = document.getElementById('w0');               // Current word element
let switcher = document.getElementById('theme-switcher');   // Button to switch themes

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
            html += `<span id="w${i}">${words[i]}</span> `;
            words[i] = `${words[i]} `;
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

typedEl.addEventListener('input', function() {
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
        // Hide the input textbox
        this.style.display = 'none';
        endTime = new Date().getTime();

        // Remove highlight from last word
        document.getElementById(`w${wordInd}`).classList.toggle('highlight');

        // Display message
        displayMessage('primary');
        return;
    }
    // Currently typing correct
    else if (words[wordInd].startsWith(input) && inputLen !== currWordLen) {
        // keep the background color of input normal
        this.classList.remove('wrong-inp');
    }
    // Typed full word correctly
    else if (words[wordInd] === input) {
        // Clear input
        this.value = '';

        // Update current word to next word
        wordInd += 1;
        currWordLen = words[wordInd].length;

        // keep the background color of input normal
        this.classList.remove('wrong-inp');

        // Update highlight
        document.getElementById(`w${wordInd - 1}`).classList.toggle('highlight');
        document.getElementById(`w${wordInd}`).classList.toggle('highlight');
    }
    // Typed incorrect word
    else {
        // turn input to red
        this.classList.add('wrong-inp');

        // Add two list of wrong words
        if (!wrongWords.includes(wordInd))
            wrongWords.push(wordInd);
    }
});

// Reset the interface
function resetInterface() {
    // Clear any messages
    message.innerHTML = '';
    message.style.display = 'none';

    // Clear input
    typedEl.value = '';
    // Show the input textbox if hidden
    typedEl.style.display = 'inline';
    typedEl.classList.remove('wrong-inp');

    // Reset all typing variables
    wrongWords = [];

    // Reset typing variables
    wordInd = 0;
    currWordLen = 0;
    initForType = false;

    // highlight the first word
    document.getElementById('w0').classList.toggle('highlight');
}

// Display a message
function displayMessage(classStr, msg='') {
    if (classStr == 'warning')
    {
        messageEl.classList.remove('primary');
        messageEl.classList.add('warning');
    }
    else 
    {
        // typing duration
        let duration = (endTime - startTime)/1000;
        
        msg += `<p>Congratulations!! You completed in <b>${duration.toFixed(2)} seconds..</b></p>`;
        
        // for wrong words
        let wrongWordsLen = wrongWords.length;
        
        if (wrongWordsLen > 0) {
            wrongWords.forEach(i => {
                let word = document.getElementById(`w${i}`).classList;
                word.add('highlight-inc');
            })
                if (wrongWordsLen > 1)
                    msg += `<p><b>${wrongWordsLen} out of ${wordsLen} words</b> are incorrect.`;
                else
                    msg += `<p><b>${wrongWordsLen} out of ${wordsLen} words</b> is incorrect.`;
                
                msg += `<br>Incorrect words are highlighted in red</p>`;
            }
        else
            msg += `<p>Impressive!! You are <b>100% accurate</b>...!!</p>`;
        
        messageEl.classList.remove('warning');
        messageEl.classList.add('primary');
    }

    messageEl.innerHTML = msg;
    messageEl.style.display = 'block';
}

// Switch between light and dark theme
switcher.addEventListener('click', function() {
    // toggle the theme
    document.body.classList.toggle('dark-theme');
    let currTheme = document.body.className;
    if (currTheme === 'light-theme') {
        this.innerHTML = 'Dark';
    }
    else {
        this.innerHTML = 'Light';
    }
})