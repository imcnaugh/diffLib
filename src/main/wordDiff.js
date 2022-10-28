const Diff = require("./diff");

function WordDiff(expected, actual) {
    Diff.call(this, expected, actual, ' ')
}

WordDiff.prototype = Object.create(Diff.prototype)

module.exports = WordDiff