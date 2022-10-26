const START_DIFF_TAG = '['
const END_DIFF_TAG = ']'
const EXPECTED_ACTUAL_SEPARATOR = '|'
const ENCODED_START_DIFF_TAG = START_DIFF_TAG + START_DIFF_TAG
const ENCODED_END_DIFF_TAG = END_DIFF_TAG + END_DIFF_TAG
const ENCODED_EXPECTED_ACTUAL_SEPARATOR = EXPECTED_ACTUAL_SEPARATOR + EXPECTED_ACTUAL_SEPARATOR

function Diff(expected, actual) {
    this.expected = encodeString(expected)
    this.actual = encodeString(actual)
    this.isEqual = this.expected === this.actual
}

Diff.prototype.diffByLetter = function() {
    const sepereator = ''
    if(this.isEqual) return this.actual
    return createDiffString(this.expected.split(sepereator), this.actual.split(sepereator), sepereator)
}

Diff.prototype.diffByWord = function() {
    const sepereator = ' '
    if(this.isEqual) return this.actual
    return createDiffString(this.expected.split(sepereator), this.actual.split(sepereator), sepereator)
}

Diff.prototype.diffByLine = function() {
    const sepereator = '\n'
    if(this.isEqual) return this.actual
    return createDiffString(this.expected.split(sepereator), this.actual.split(sepereator), sepereator)
}

function createDiffString(expected, actual, sepereator) {
    let prefixCommonCount = findPrefixCommonCharCount(expected, actual)
    let postfixCommonCount = findPostfixCommonCharsCount(expected, actual)

    const commonPrefix = expected.slice(0, prefixCommonCount).join(sepereator)
    const expectedDiff = expected.slice(prefixCommonCount, expected.length - postfixCommonCount).join(sepereator)
    const acutalDiff = actual.slice(prefixCommonCount, actual.length - postfixCommonCount).join(sepereator)
    const commonPostfix = expected.slice(expected.length - postfixCommonCount).join(sepereator)
    return commonPrefix + (commonPrefix.length > 0 ? sepereator : '') +
        START_DIFF_TAG +
        expectedDiff +
        EXPECTED_ACTUAL_SEPARATOR +
        acutalDiff +
        END_DIFF_TAG + (commonPostfix.length > 0 ? sepereator: '') +
        commonPostfix
}

function encodeString(str) {
    return str.toString().replace(START_DIFF_TAG , ENCODED_START_DIFF_TAG)
        .replace(END_DIFF_TAG , ENCODED_END_DIFF_TAG)
        .replace(EXPECTED_ACTUAL_SEPARATOR , ENCODED_EXPECTED_ACTUAL_SEPARATOR)
}

function findPrefixCommonCharCount(expected, actual) {
    let minLenght = Math.min(expected.length, actual.length)
    let i = 0
    for (; i < minLenght; i++) {
        if (expected[i] !== actual[i]) {
            break
        }
    }
    return i
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