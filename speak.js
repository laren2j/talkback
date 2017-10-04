const SpeechRecognition = webkitSpeechRecognition;
const SpeechGrammarList = webkitSpeechGrammarList;
const SpeechRecognitionEvent = webkitSpeechRecognitionEvent;
const synthesis = window.speechSynthesis;




/**
 * you can define your own grammar list
 */
// const colors = [ 'aqua' , 'azure' , 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral' ];
// const grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;';

const recognition = new SpeechRecognition();
const speechRecognitionList = new SpeechGrammarList();
var speakBtn = document.querySelector('#toggleBtn');

/**
 *  add grammars
 *  the second parameter is a weight value that specifies the importance of this grammar 
 *  in relation of other grammars available in the list (can be from 0 to 1 inclusive.)
 */
// speechRecognitionList.addFromString(grammar, 1);
// recognition.grammars = speechRecognitionList;

window.onload = function(){
    speakBtn.onclick = function(){
        if(speakBtn.className.match('btn-large btn-floating cyan')) {
            speakBtn.className = 'btn-large btn-floating red pulse';
            start();
        }
        else {
            speakBtn.className = 'btn-large btn-floating cyan';
            stop();
        }
    };
};

/**
 * other settings
 */
recognition.lang = 'en-US';
recognition.continuous = false;
recognition.interimResults = false;
recognition.maxAlternatives = 1;

/**
 * event handlers
 */
recognition.onresult = (e) => {
  const result = e.results[e.results.length - 1][0].transcript;
  //console.log('result: ', result);
  toaster('Result: ' + result);
  updateResult(result);
}

recognition.onerror = (e) => {
  toaster('Error: ' + e.error);
}

recognition.onend = () => {
  toaster('Recognition ended.');
  speakBtn.className = 'btn-large btn-floating cyan';
}

/**
 * other functions
 */
function updateResult(result) {
  document.getElementById('recognitionResult').focus();
  if(result.length) {
    document.querySelector('#recognitionResult').value = result;
    talkBack(result)
  } else {
    talkBack("Not able to grasp what you are saying")
  }
}

function talkBack(result){
  setTimeout(function() {
    const utter = new SpeechSynthesisUtterance(result);
    // the list of all available voices
    const voices = synthesis.getVoices();
    
    utter.voice = voices[$('#voices').val()];
    utter.volume = 1;
    utter.rate = $('#rate').val() / 10;
    utter.pitch = $('#pitch').val();
    synthesis.speak(utter);
  }, 1000);
}

function start() {
  recognition.start();
  toaster('Recognition started.');
}

function stop() {
  recognition.stop();
  toaster('Recognition stopped.');
}

function toaster(msg) {
  Materialize.toast(msg, 2500);
}



$(function(){
  if ('speechSynthesis' in window) {
    speechSynthesis.onvoiceschanged = function() {
      var $voicelist = $('#voices');

      if($voicelist.find('option').length == 0) {
        speechSynthesis.getVoices().forEach(function(voice, index) {
          // console.toast(voice);
          var $option = $('<option>')
          .val(index)
          .html(voice.name + (voice.default ? ' (default)' :''));

          $voicelist.append($option);
        });

        $voicelist.material_select();
      }
    }
  } else {
    $('#modal1').openModal();
  }
});

