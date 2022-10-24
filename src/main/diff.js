const START_DIFF_TAG = '['
const END_DIFF_TAG = ']'
const EXPECTED_ACTUAL_SEPARATOR = '|'


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

    const commonPrefix = this.expected.substring(0, diffStartIndex)
    const expectedDiff = this.expected.substring(diffStartIndex, expectedIndex)
    const acutalDiff = this.actual.substring(diffStartIndex, actualIndex)
    const commonPostfix = this.expected.substring(expectedIndex)
    return commonPrefix + 
        START_DIFF_TAG + 
        expectedDiff + 
        EXPECTED_ACTUAL_SEPARATOR + 
        acutalDiff + 
        END_DIFF_TAG + 
        commonPostfix
}

module.exports = Diff