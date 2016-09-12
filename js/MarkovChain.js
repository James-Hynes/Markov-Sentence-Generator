class MarkovChain {
    constructor(data, startWords) {
        this.startWords = startWords || ['if', 'after', 'since', 'before', 'so', 'that', 'whenever', 'as', 'although', 'until', 'where', 'though', 'wherever'];
        this.data = data;
        this.aliasObjects = initializeMultipleAlias(data);
    }
    
    getNextWord(prev_word) {
        return this.aliasObjects[prev_word].next();
    }
    
    createSentence(start_word) {
        let current_word = start_word || this.startWords[Math.floor(Math.random() * this.startWords.length)];
        let sentence = [];
        while(this.aliasObjects[current_word]) {
            sentence.push(current_word);
            current_word = this.getNextWord(current_word);
        }
        if(sentence.length > 0) {
            return this.formatSentence(sentence);
        }
        return this.createSentence(start_word);
    }
    
    formatSentence(arraySentence) {
        let formatted = '';
        for(let i = 0; i < arraySentence.length; i++) {
            if(i === 0) {
                formatted = formatted.concat(arraySentence[i][0].toUpperCase().concat(arraySentence[i].slice(1)));
            } else {
                formatted = formatted.concat(' ', arraySentence[i]);
            }
        }
        formatted += '.';
        return formatted;
    }
}