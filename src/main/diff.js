const START_DIFF_TAG = '['
const END_DIFF_TAG = ']'
const EXPECTED_ACTUAL_SEPARATOR = '|'
const ENCODED_START_DIFF_TAG = '[['
const ENCODED_END_DIFF_TAG = ']]'
const ENCODED_EXPECTED_ACTUAL_SEPARATOR = '||'

function Diff(expected, actual) {
    this.expected = encodeString(expected)
    this.actual = encodeString(actual)
    this.isEqual = this.expected === this.actual
    this.diffString = this.isEqual ? this.actual : getDiffString(this.expected, this.actual)
}

function encodeString(str) {
    return str.toString().replace(START_DIFF_TAG , ENCODED_START_DIFF_TAG)
        .replace(END_DIFF_TAG , ENCODED_END_DIFF_TAG)
        .replace(EXPECTED_ACTUAL_SEPARATOR , ENCODED_EXPECTED_ACTUAL_SEPARATOR)
}

function getDiffString(expected, actual) {
    let prefixCommonCharCount = findPrefixCommonCharCount(expected, actual)
    let postfixCommonCharCount = findPostfixCommonCharsCount(expected, actual)

    const commonPrefix = expected.substring(0, prefixCommonCharCount)
    const expectedDiff = expected.substring(prefixCommonCharCount, expected.length - postfixCommonCharCount)
    const acutalDiff = actual.substring(prefixCommonCharCount, actual.length - postfixCommonCharCount)
    const commonPostfix = expected.substring(expected.length - postfixCommonCharCount)
    return commonPrefix + 
        START_DIFF_TAG + 
        expectedDiff + 
        EXPECTED_ACTUAL_SEPARATOR + 
        acutalDiff + 
        END_DIFF_TAG + 
        commonPostfix
}

function findPrefixCommonCharCount(expected, actual) {
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

function findPostfixCommonCharsCount(expected, actual) {
    let postfixCommonChars = 0
    let expectedIndex = expected.length - 1
    let actualIndex = actual.length - 1
    while ((expected.length > postfixCommonChars || actual.length > postfixCommonChars) && 
        (expected[expectedIndex] === actual[actualIndex])) {
        postfixCommonChars++
        expectedIndex--
        actualIndex--
    }
    return postfixCommonChars
}

module.exports = Diff