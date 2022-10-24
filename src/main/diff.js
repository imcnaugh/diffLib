const START_DIFF_TAG = '['
const END_DIFF_TAG = ']'
const EXPECTED_ACTUAL_SEPARATOR = '|'
const ENCODED_START_DIFF_TAG = '[['
const ENCODED_END_DIFF_TAG = ']]'
const ENCODED_EXPECTED_ACTUAL_SEPARATOR = '||'

function Diff(expected, actual) {
    this.expected = encodeString(expected)
    this.actual = encodeString(actual)
    this.diffString = getDiffString(this.expected, this.actual)
}

function encodeString(str) {
    return str.replace(START_DIFF_TAG , ENCODED_START_DIFF_TAG)
        .replace(END_DIFF_TAG , ENCODED_END_DIFF_TAG)
        .replace(EXPECTED_ACTUAL_SEPARATOR , ENCODED_EXPECTED_ACTUAL_SEPARATOR)
}

function getDiffString(expected, actual) {
    if(expected === actual) return actual

    let diffStartIndex = findDiffStartIndex(expected, actual)
    let expectedIndex = expected.length - 1
    let actualIndex = actual.length - 1
    for(;;) {
        if(expected[expectedIndex] !== actual[actualIndex]) {
            expectedIndex++
            actualIndex++
            break;
        }
        expectedIndex--
        actualIndex--
    }

    const commonPrefix = expected.substring(0, diffStartIndex)
    const expectedDiff = expected.substring(diffStartIndex, expectedIndex)
    const acutalDiff = actual.substring(diffStartIndex, actualIndex)
    const commonPostfix = expected.substring(expectedIndex)
    return commonPrefix + 
        START_DIFF_TAG + 
        expectedDiff + 
        EXPECTED_ACTUAL_SEPARATOR + 
        acutalDiff + 
        END_DIFF_TAG + 
        commonPostfix
}

module.exports = Diff

function findDiffStartIndex(expected, actual) {
    let minLenght = Math.min(expected.length, actual.length)
    let diffStartIndex = 0
    for (let i = 0; i < minLenght; i++) {
        if (expected[i] !== actual[i]) {
            diffStartIndex = i
            break
        }
    }
    return diffStartIndex
}
