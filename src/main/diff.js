const START_DIFF_TAG = '['
const END_DIFF_TAG = ']'
const EXPECTED_ACTUAL_SEPARATOR = '|'
const ENCODED_START_DIFF_TAG = '[['
const ENCODED_END_DIFF_TAG = ']]'
const ENCODED_EXPECTED_ACTUAL_SEPARATOR = '||'

function Diff(expected, actual) {
    this.expected = encodeString(expected)
    this.actual = encodeString(actual)
    this.isEqual = expected === actual
    this.diffString = this.getDiffString()
}

function encodeString(str) {
    return str.replace(START_DIFF_TAG , ENCODED_START_DIFF_TAG)
        .replace(END_DIFF_TAG , ENCODED_END_DIFF_TAG)
        .replace(EXPECTED_ACTUAL_SEPARATOR , ENCODED_EXPECTED_ACTUAL_SEPARATOR)
}

Diff.prototype.getDiffString = function() {
    if(this.isEqual) return this.expected

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