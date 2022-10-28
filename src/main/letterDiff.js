const Diff = require("./diff");

function LetterDiff(expected, actual) {
    Diff.call(this, expected, actual, '')
}

LetterDiff.prototype = Object.create(Diff.prototype)

module.exports = LetterDiff