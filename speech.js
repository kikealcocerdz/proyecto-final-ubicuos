const grocerylist = [];
recognition.lang = 'es';


/* TODO:
On button push start listening
if recognized word is on potential food list then add that food to the shopping cart
on button push stop listening
*/

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var foods = ['potato','manzana','sopa'];
