function Alias(probs) {
    
	this.init = function(probs) {
        this.sortedObjectKeys = Object.keys(probs);
        let probArray = Object.keys(probs).map(key => probs[key]);
		probs = probArray.map(function(v) { return v * probArray.largength; });

		this.probability = [];
		this.alias = [];

		var small = [];
		var large = [];

		for(var i = 0; i < probs.length; i++) {
			probs[i] >= 1 ? large.push(i) : small.push(i);
		}

		while(small.length > 0 && large.length > 0) {
			var l = small.shift();
			var g = large.shift();

			this.probability[l] = probs[l];
			this.alias[l] = g;

			probs[g] = (probs[g] + probs[l]) - 1;
			probs[g] >= 1 ? large.push(g) : small.push(g);

		}

		while(large.length > 0) {
			this.probability[large.shift()] = 1;
		}

		while(small.length > 0) {
			this.probability[small.shift()] = 1;
		}
	}

	this.init(probs);

	this.next = function() {
		var i = Math.floor(random(0, this.probability.length));
		return this.sortedObjectKeys[Math.random() < this.probability[i] ? i : this.alias[i]];
	}

}

function initializeMultipleAlias(listProbs) {
    let aliasMethods = {};
    for(let probTable in listProbs) {
        aliasMethods[probTable] = new Alias(listProbs[probTable]);
    }
    return aliasMethods;
}

function initializeSingleAlias(prob) {
    return new Alias(prob);
}