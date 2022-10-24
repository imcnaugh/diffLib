function Diff(expected, actual) {
    this.expected = expected
    this.actual = actual
    this.isEqual = expected === actual
}

Diff.prototype.gitDiff = function() {
    if(this.isEqual) return this.actual
    let minLenght = Math.min(this.expected.length, this.actual.length)
    
    let diffStartIndex = 0
    for(let i = 0; i < minLenght; i++) {    
        if(this.expected[i] !== this.actual[i]) {
            diffStartIndex = i;
            break;
        }
    }

    let expectedIndex = this.expected.length - 1
    let actualIndex = this.actual.length - 1
    for(;;) {
        if(this.expected[expectedIndex] !== this.actual[actualIndex]) {
            expectedIndex++
            actualIndex++
            break;
        }
        expectedIndex--
        actualIndex--
    }

    let expectedDiff = this.expected.substring(diffStartIndex, expectedIndex)
    let acutalDiff = this.actual.substring(diffStartIndex, actualIndex)

    let ret = this.expected.substring(0, diffStartIndex) + '[' + expectedDiff + '|' + acutalDiff + ']' + this.expected.substring(expectedIndex)

    return ret

}

module.exports = Diff