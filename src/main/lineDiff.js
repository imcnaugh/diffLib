const Diff = require("./diff");

function LineDiff(expected, actual) {
    Diff.call(this, expected, actual, '\n')
}

LineDiff.prototype = Object.create(Diff.prototype)

module.exports = LineDiff