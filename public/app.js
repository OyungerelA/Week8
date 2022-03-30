let socket = io();
let randomWord;
let languages = [];

socket.on('connect', ()=>{
    console.log('connected to the server via sockets');
})

// receive info from server
socket.on('wordTranslation', (data) => {
    console.log(data);

    // display the info on screen
    let wordBox = document.getElementById('word-box');
    let inputArea = document.getElementById('input-area');
    let dropDownMenu = document.getElementById('language-select');
    let inputLanguage = document.createElement('p');
    let inputWord = document.createElement('p');
    let inputWrapper = document.createElement('div');
    inputWrapper.classList.add('inputRow');
    inputLanguage.innerHTML = data.language;
    inputWord.innerHTML = data.word;
    // if both language and word are filled in
    if (data.language != '' && data.word != ''){
        document.getElementById('error-msg').style.display = 'none';
        inputWrapper.appendChild(inputLanguage);
        inputWrapper.appendChild(inputWord);
        wordBox.appendChild(inputWrapper);
        dropDownMenu.value = '';
        inputArea.value = '';
    }
    else{
        // alert('Make sure to choose a language and fill in the input field.');
        let error = socket.id;
        socket.emit('error', error);
    }

    if (!languages.includes(data.language) && data.language != ''){
        let languageNumBox = document.getElementById('languageNum-box');
        let languageNum = document.createElement('h4');
        languages.push(data.language);
        languageNumBox.removeChild(languageNumBox.firstElementChild);
        languageNum.innerHTML = languages.length;
        languageNumBox.appendChild(languageNum);
    }
})

socket.on('error', (data) => {
    document.getElementById('error-msg').style.display = 'block';
})

socket.on('randomWord', (data) => {
    console.log(data);

    // display the word on the screen
    let wordArea = document.getElementById('prompt-word');
    console.log(wordArea.children.length);
    while (wordArea.children.length != 0){
        wordArea.removeChild(wordArea.firstElementChild);
    }
    let word = document.createElement('h2');
    word.innerHTML = data;
    wordArea.appendChild(word);

    // whenever word changes (get randomword message from server), the screen will get emptied
    let wordBox = document.getElementById('word-box');
    for(let i=wordBox.children.length; i>0; i--){
        wordBox.removeChild(wordBox.firstElementChild);
    }
})

window.addEventListener('load', () => {
    let languageNumBox = document.getElementById('languageNum-box');
    let languageNum = document.createElement('h4');
    languageNum.innerHTML = languages.length;
    languageNumBox.appendChild(languageNum);

    let submitBtn = document.getElementById('submitBtn');
    let getWordBtn = document.getElementById('changeWordBtn');
    let startBtn = document.getElementById('startBtn');
    let inputArea = document.getElementById('input-area');
    let dropDownMenu = document.getElementById('language-select');
    let wordArea = document.getElementById('prompt-word');

    fetch('languages.json')
    .then(response => response.json())
    .then(data => {
        let options = "";
        let languages = data.languages;
        let dropDownMenu = document.getElementById('language-select');
        options += `<option value="">Select a language</option>`;
        languages.forEach(language => {
            options += `<option value="${language}">${language}</option>`
        });
        dropDownMenu.innerHTML = options;
    })

    let word = document.createElement('h2');
    word.innerHTML = 'Press to start -->';
    wordArea.appendChild(word);
    
    // getting input from user and displaying it on the screen
    submitBtn.addEventListener('click', () => {
        let language = dropDownMenu.value;
        let inputWord = inputArea.value;

        inputObject = {
            'language': language,
            'word': inputWord
        }

        socket.emit('wordTranslation', inputObject);
    })

    getWordBtn.addEventListener('click', () => {
        fetch('words.json')
        .then(response => response.json())
        .then(data => {
            // generating random word and sending it to server
            let wordNum = data.words.length;
            randomNum = Math.floor(Math.random() * wordNum);
            randomWord = data.words[randomNum];
            socket.emit('randomWord', randomWord);
        })
    })

    startBtn.addEventListener('click', () => {
        document.getElementById('info-screen').style.display = 'none';
        document.getElementById('game-screen').style.display = 'block';
    })

    // automatically scroll to the bottom of the div when the div gets full with words 
    // let objDiv = document.getElementById("container2");
    // objDiv.scrollTop = objDiv.scrollHeight;
})
