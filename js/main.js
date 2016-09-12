let markovChain;
let sentences = [];
function setup() {
    createCanvas(windowWidth, windowHeight);
    markovChain = new MarkovChain(chaindata);
    for(let i = 0; i < 5; i++) {
        sentences.push(markovChain.createSentence());
    }
}

function draw() {
    background(51);
    textSize(16);
    fill(255);
    for(let i = 0; i < sentences.length; i++) {
        text(sentences[i].toString(), 0, (i + 1) * 100);
    }
}

function mousePressed() {
    for(let i = 0; i < sentences.length; i++) {
        sentences[i] = markovChain.createSentence();
    }
    print(sentence);
}