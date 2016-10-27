var lastEventTimeout;
var waiting = false;
var recognizing = false;

function zamanuha() {
	setTimeout(function() {
		if (recognizing) {
			zamanuha();
		} else {
			speak(getWelcomePhrase(), function() {
				console.log('^^^')
				recognition.start();
			});
		}
	}, 5000)
	// }, 60000*3)
}

var welcomePhrases = [
	'так ты хочешь знать свое будущее?',
	'ты уверен?',
	'смелый человечишка',
	'чувствую дерзновение',
	'я знаю то, что с тобой было, что ты пушил и что с тобой будет',
	'касатик, давай погадаю?',
	'в мастер влили что-то несвеежее'
];
function getWelcomePhrase() {
	return welcomePhrases[(Math.random() * welcomePhrases.length) | 0];
}

var recognition = new webkitSpeechRecognition();
recognition.lang = 'ru-RU';
recognition.continuous = true;
recognition.interimResults = true;
recognition.onstart = function() {
	console.info('## started');
	recognizing = true;
};
recognition.onresult = function(event) {

	var string;
	for (var i = 0; i < event.results.length; i++) {
		var result = event.results[i];
		console.log('##', result.isFinal, result[0].transcript);
		
		if (waiting) {
			clearTimeout(lastEventTimeout);
		} else if (!result.isFinal) {
			waiting = true;
		}
	}

	lastEventTimeout = setTimeout(function() {
		waiting = false;

		recognition.stop();
		console.log('## result.isFinal', result.isFinal);
		if (result.isFinal) {
			var transcript = result[0].transcript;
			if (transcript.indexOf('да') !== -1 ||
				transcript.indexOf('будуще') !== -1 ||
				transcript.indexOf('судьб') !== -1 ||
				transcript.indexOf('предска') !== -1 ||
				transcript.indexOf('скажи') !== -1) {

				speak(null, function() {
					console.log('$$$')
					recognition.start();
				});

				setTimeout(function() {
					try {
						recognition.start();
					} catch(e) {
						console.log('e', typeof e, e);
					}
				}, 10000)

				// var utterance = new SpeechSynthesisUtterance(getWelcomePhrase());
				// utterance.pitch = 0.1;
				// utterance.rate = 0.6;
				// utterance.onend = function() { recognition.start() };
				// speechSynthesis.speak(utterance);

				return;
			} else {
				recognition.start();
			}
		}
	}, 500)
};
recognition.onerror = function(error) {
	console.error(error);
};
recognition.onend = function() {
	console.info('## ended');
	recognizing = false;
};
recognition.start();
