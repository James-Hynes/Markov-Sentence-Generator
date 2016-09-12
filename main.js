let probs = 
[
[0.2, 0.7, 0.1],
[0.1, 0.7, 0.2],
[0.2, 0.6, 0.2]
];


let aliasProbs = initializeMultipleAlias(chaindata);
let finalSentence;

function generateSentence(start) {
	let sentence = [start];
	let currentItem = start;
	while(aliasProbs[currentItem]) {
		currentItem = aliasProbs[currentItem].next();
		sentence.push(currentItem);
	}
	return formatSentence(sentence);
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    finalSentence = generateSentence('a');
}

function draw() {
    background(51);
    textAlign(CENTER);
    textSize(32);
    fill(255);
    text(finalSentence, width / 2, height / 2);
}

function formatSentence(arraySentence) {
	let formatted = '';
	for(let i = 0; i < arraySentence.length; i++) {
		if(i === 0) {
			formatted = formatted.concat(arraySentence[i][0].toUpperCase().concat(arraySentence[i].slice(1)));
		} else {
			formatted = formatted.concat(' ', arraySentence[i]);
		}
	}
	
	return formatted;
}

function mousePressed() {
	finalSentence = generateSentence('a');
}