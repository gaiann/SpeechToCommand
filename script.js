var SpeechRecognition = SpeechRecognition|| webkitSpeechRecognition
var res = window.speechSynthesis;

//Collect our input and output variables from our html file.
let command = document.querySelector('.command');
let task = document.querySelector('.task');
let button = document.getElementById('talkButton')
let loading = document.getElementById('loading');
loading.style.visibility = 'hidden';

function main(args) {

    let welcomes = ['hi', 'hey', 'hello', 'greetings'];
    welcomes.forEach(welcome => {
        if(args.includes(welcome)) {
            task.textContent="Hi! What are you looking for today?";
            res.speak(new SpeechSynthesisUtterance("Hi! What are you looking for today?"));
            return;
        }
    })

    let goodbyes = ['bye', 'goodbye', 'so long', 'close'];
    goodbyes.forEach(goodbye => {
        if(args.includes(goodbye)) {
            task.textContent="Goodbye! I hope I was able to assist you.";
            res.speak(new SpeechSynthesisUtterance("Goodbye! I hope I was able to assist you."));
            return;
        }
    })

    let reg_command = true;
    let sites = ['scan', 'access', 'open', 'navigate', 'browse', 'find'];
    sites.forEach(site => {
        if(args.includes(site)) {
            let speechArr = args.split(" ");
            for(var idx = 0; idx < speechArr.length; idx++) {
                // Command is to open a website
                if(speechArr[idx].includes(".")) {
                    reg_command = false;
                    let site_cmd = speechArr[idx];
                    window.open("https://" + site_cmd, '_blank').focus();
                    res.speak(new SpeechSynthesisUtterance("Opening " + site_cmd));
                    return;
                }
            }
            // Regular non-website command
            if(reg_command == true) {
                args = args.replaceAll(site, "");
                window.open("https://www.google.co.in/search?q=" + args, '_blank').focus();
                res.speak(new SpeechSynthesisUtterance("Searching Google for " + args));
                return;
            }
        }
    })
}

function testSpeech() {
    button.style.visibility = 'hidden';
    loading.style.visibility = 'visible';
    var recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = function(event) {
        var speechResult = event.results[0][0].transcript;
        command.textContent = 'You said: ' + speechResult + '.';
        main(speechResult.toLowerCase());
    }

    recognition.onspeechend = function() {
        button.style.visibility = 'visible';
        loading.style.visibility = 'hidden';
        recognition.stop();
        button.disabled = false;
        button.value = 'Talk!';
    }

    recognition.onerror = function(event) {
        button.disabled = false;
        button.value = 'Try Again';
        task.textContent = 'Error occurred in recognition: ' + event.error;
    }
}

button.addEventListener('click', testSpeech);