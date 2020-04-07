var wordList;
var seed = 1;
let wordSeed = 1;
let globalSeed = 1;

function loadWordList() {
	var wordList;

	$.ajax({
            url : "wordlist.txt",
            dataType: "text",
            success : function (data) {
            	wordList = data.split("\n");
            },
            async: false
        });
	return wordList;
}

function pickWords(numWords) {
	return sampleArray(wordList, numWords, wordSeed);
}

function sampleWords(numWords) {
	let si = Math.floor(wordList.length * random());
	return wordList.slice(si, si + numWords);
}

function sampleArray(arr, arrLength, localSeed) {
	let returnArr = [];
	while(returnArr.length != arrLength)
	{
		let randomElementIndex = 0;
		if(localSeed != null) {
			randomElementIndex = Math.floor(arr.length * random(localSeed++));
		}
		else {
			randomElementIndex = Math.floor(arr.length * random());
		}
		if(returnArr.includes(arr[randomElementIndex])) {
			continue;
		}
		console.log(arr[randomElementIndex]);
		returnArr.push(arr[randomElementIndex]);
	}
	return returnArr;
}


function random(localSeed) {
	if(localSeed != null) {
		console.log("Taking local seed: " + localSeed.toString());
		var x = Math.sin(localSeed) * 10000;
		return x - Math.floor(x);
	}
	else {
		console.log("Taking global seed");
		var x = Math.sin(globalSeed++) * 10000;
		return x - Math.floor(x);
	}

}

function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;
  
	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
  
	  // Pick a remaining element...
	  randomIndex = Math.floor(random() * currentIndex);
	  currentIndex -= 1;
  
	  // And swap it with the current element.
	  temporaryValue = array[currentIndex];
	  array[currentIndex] = array[randomIndex];
	  array[randomIndex] = temporaryValue;
	}
  
	return array;
  }

function generateCode() {
	//var code = _.sample([1,2,3,4], 3);
	var code = sampleArray([1,2,3,4],3);
	Cookies.set("code", code);
	setCode(code);
	$('#codeModal').modal('show');
}

function setCode(code) {
	for(idx = 0; idx < 3; idx++) {
		$('#code' + idx).text(code[idx]);
	}
	$('#revealCodeButton').show();
}

function setWords(words) {
	for(idx = 0; idx < 4; idx++) {
		$('#word' + idx).text(words[idx]);
	}
}

function loadWords() {
	return Cookies.getJSON("words");
}

function loadCode() {
	var code = Cookies.getJSON("code");
	if (code) {
		setCode(code);
	} else {
		$('#revealCodeButton').hide();
	}
}

function newGame() {
	var words = pickWords(4);
	Cookies.set("words", words);
	Cookies.remove("code");
	$('#revealCodeButton').hide();
	return words;
}

function toggleFullScreen() {
	if (screenfull.isFullscreen) {
		screenfull.exit();
	} else {
		screenfull.request();
	}
	setFullScreenIcon();
}

function setFullScreenIcon() {
    if (screenfull.isFullscreen) {
		$('#enableFullScreen').hide();
		$('#disableFullScreen').show();
    } else {
		$('#enableFullScreen').show();
		$('#disableFullScreen').hide();
    }
}

function startNewGame() {
	setWords(newGame());
}

function disableScreenLock() {
	var noSleep = new NoSleep();
	noSleep.enable();
}

function initScreenfull() {
	var noSleep = new NoSleep();

	if (screenfull.enabled) {
		screenfull.on('change', () => {
			if (screenfull.isFullscreen) {
				noSleep.enable();
			} else {
				noSleep.disable();
			}
		});
        setInterval(setFullScreenIcon, 200);
    } else {
        $('#fullScreenButton').hide();
        $('#disableScreenLockModal').modal('show');
    }
}

function initialize() {
	initScreenfull();

	let url = new URL(window.location.href);
	let s = url.searchParams.get("s").toString();
	if(s != null) {
		wordSeed = s;
		globalSeed = s;
		console.log("Seed: " + s.toString());
	}

	wordList = loadWordList();
	loadCode();

	var words = loadWords();

	if (words) {
		setWords(words);
	} else {
		/*
		startNewGame();
		$('#newGameModalCancelButton').hide();
		$('#newGameModal').modal({
			show: true,
			keyboard: false,
			backdrop: 'static'
		});
		*/
		$('#newGameModal').modal('show');
	}
}
