// Show the quote to type by clicking on the "Start" button
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

let quote = '';                     // Quote string from API
let quoteLen = 0;                   // Length of quote string
let words;                          // Array of words from quote string
let wordsLen = 0;                   // Length of array of words

let startTime = 0;
let endTime = 0;

// Get the quote from quotable API
btn = document.getElementById('start');
btn.addEventListener('click', function () {
    $.get('https://api.quotable.io/random?minLength=150&maxLength=200', function (response) {
        // Set 'start' button to 'reset'
        btn.innerHTML = 'Reset';

        // Clear any error messages
        message = document.getElementById('message');
        message.innerHTML = '';
        message.style.display = 'none';

        // Clear input textbox
        document.getElementById('typed-value').value = '';

        // Quote which user has to type
        quote = response['content'];
        quoteLen = quote.length;
        words = quote.split(' ');
        wordsLen = words.length;
        for (let i = 0; i < wordsLen; i++) {
            words[i] = `${words[i]} `;
        }

        // put the quote inside the html
        html = '';
        for (let i = 0; i < wordsLen; i++) {
            html += `<span id="w${i}">${words[i]}</span>`;
        }
        article = document.getElementById('quote');
        article.innerHTML = html;

        // Highlight the first word in quote to start typing
        document.getElementById('w0').className = 'highlight';
    })
})

// Get the input and check with the quote
words = quote.split(' ');                    // list of words from the quote

// check if quote is present
input = document.getElementById('typed-value');
input.addEventListener('focus', function (event) {
    if (quoteLen === 0) {
        displayMessage('warning', 'Click on <kbd>Start</kbd> first');
        event.preventDefault();
    }
})

// Listen to the user typing and check if they typed correctly
let wordInd = 0;                            // current word index
let currWordLen = 0;                        // current word length
let initForType = false;

// Statistics
let incCharsCnt = 0;
let incChars = [];
input.addEventListener('keyup', function (event) {
    // Initialize the length of first word
    if (!initForType) {
        let d = new Date();
        startTime = d.getTime();
        currWordLen = words[wordInd].length;
        initForType = true;
    }

    let inpStr = this.value;
    let inpLen = inpStr.length;

    if (inpStr == words[wordInd].slice(0, inpLen)) {
        // Highlight next word if current word is complete
        if (inpLen == currWordLen) {
            this.value = '';
            wordInd += 1;

            if (wordInd == wordsLen) {
                let d = new Date();
                endTime = d.getTime();

                wordInd = 0;
                displayMessage('primary');
                return;
            }

            currWordLen = words[wordInd].length

            document.getElementById(`w${wordInd - 1}`).classList.toggle('highlight');
            document.getElementById(`w${wordInd}`).classList.toggle('highlight');
        }
        // keep the background color 
        this.style.backgroundColor = 'var(--white)';
        this.style.color = 'var(--dark)';
    }
    else {
        this.style.backgroundColor = 'var(--red)';
        this.style.color = 'var(--white)';

        // incorrect characters
        if (validChars.includes(event.key)) {
            incChars.push(event.key);
            incCharsCnt += 1;
        }
    }
})

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
        duration = (endTime - startTime)/1000;                   // duration of typing
        accuracy = 100 * (1 - incCharsCnt / quoteLen);     // percentage of correctness
        msg += `Congratulations!! You completed in <br><b>${duration} sec</b> with <b>${accuracy}%</b> accuracy...`
        message.classList.remove('warning');
        message.classList.add('primary');
    }
    
    message.innerHTML = msg;
    message.style.display = 'block';
}