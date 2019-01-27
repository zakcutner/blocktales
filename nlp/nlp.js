// use this one!
async function validWord(textSoFar, word) {

    var sentenceSoFar = getLastSentence(textSoFar);
    // pre-validate input
    if (word.includes(" ") || word.length == 0) {
        return false;
    }

    sentenceSoFar = sentenceSoFar.trim();
    sentenceSoFar = sentenceSoFar.split(" ");

    var wholeSentence;
    var sentenceEnd = false;
    if (word === ".") {
        sentenceEnd = true;
        wholeSentence = sentenceSoFar;
    } else if (word[word.length - 1] === ".") {
        // skim off the full stop
        word = word.substring(0, word.length - 1);
        sentenceEnd = true;
        wholeSentence = sentenceSoFar.concat([word]);
    }

    let nice = !wordIsNaughty(word);
    let spelledCorrectly = await wordIsSpelledCorrectly(word);
    let partialHeuristicallyCorrect = passesPartialHeuristics(sentenceSoFar, word);

    let holisticallyCorrect = sentenceEnd ? passesHolisticHeuristics(wholeSentence) : true;
    return nice && spelledCorrectly && partialHeuristicallyCorrect && holisticallyCorrect;
}


function wordIsNaughty(word) {
    return naughtyList.includes(word);
}

// returns promise
// idea: if word is spelled correctly, then at least some word will have a similar meaning
async function wordIsSpelledCorrectly(word) {

    let whitelist = ["."];
    if (whitelist.includes(word)) {
        return true;
    }

    let baseURL = "https://api.datamuse.com/words?ml=";
    let suffix = "&max=1";
    let joinedURL = baseURL + word + suffix;

    try {
        let result = await fetch(joinedURL);
        let parsedResult = await result.json();
        return parsedResult.length != 0;
    }
    catch (err) {
        throw err;
    }
}

function passesPartialHeuristics(sentenceSoFar, newWord) {
    let lastWord = sentenceSoFar[sentenceSoFar.length - 1];
    let repeatsWord = lastWord === newWord;

    return !repeatsWord;
}

function passesHolisticHeuristics(sentence) {
    let lastWord = sentence[sentence.length - 1];
    let prepositions = ["a", "an", "the"];
    let endsInPreposition = prepositions.includes(lastWord);

    return !endsInPreposition;
}

function getLastSentence(text) {
    for (var i = text.length - 1; i >= 0; i--) {
        if (text[i] == ".") {
            // skip the leading space
            return text.substring(i + 2);
        }
    }

    return text;
}

// Valid sentence
validWord("Once upon a time there was a", "hackathon.").then(result => result === true ? console.log("PASS") : console.log("FAIL"));
// Expect: true

// Repetition
validWord("Once upon a time there was", "was").then(result => result === false ? console.log("PASS") : console.log("FAIL"));
// Expect: false

// Extra whitespace, with repetition
validWord("Once upon a time there was ", "was").then(result => result === false ? console.log("PASS") : console.log("FAIL"));
// Expect: false

// Sentence terminating with preposition
validWord("Once upon a time there was", "a.").then(result => result === false ? console.log("PASS") : console.log("FAIL"));
// Expect: false

// Sentence terminating with preposition, separate full stop
validWord("Once upon a time there was a", ".").then(result => result === false ? console.log("PASS") : console.log("FAIL"));
// Expect: false

// Profanity
validWord("Once upon a", "ruski").then(result => result === false ? console.log("PASS") : console.log("FAIL"));
// Expect: false

// Miss-spelling
validWord("Once upon a", "tiem").then(result => result === false ? console.log("PASS") : console.log("FAIL"));
// Expect: false

// Space
validWord("Once upon a", "time there").then(result => result === false ? console.log("PASS") : console.log("FAIL"));
// Expect: false

// Getting last sentence
getLastSentence("Once upon. A time there was. Some dude") == "Some dude" ? console.log("PASS") : console.log("FAIL");
// Expect: "Some dude"

// TODO: can't start sentence with full stop
// TODO: singular vs plural matching
