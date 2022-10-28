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
    let commonPrefix = findCommonPrefix(expected, actual)
    if(commonPrefix.length === expected.length && commonPrefix.length === actual.length) {
        return actual.join(sepereator)
    }

    actual = actual.slice(commonPrefix.length)
    expected = expected.slice(commonPrefix.length)

    let expectedRemainingPostDiffIndex = 0
    let actualRemainingPostDiffIndex = 0

    let maxOfStringLength = Math.max(expected.length, actual.length)
    let itemsInExpectedDiff = []
    let itemsInActualDiff = []

    for (let i = 0; i <= maxOfStringLength; i++) {
        expectedRemainingPostDiffIndex = i
        actualRemainingPostDiffIndex = i
        let b = false
        if(expected.length > i){
            itemsInExpectedDiff.push(expected[i])
        }
        if(actual.length > i){
            itemsInActualDiff.push(actual[i])
        }
        if(expected.length > 1 && itemsInActualDiff.includes(expected[i])){
            actualRemainingPostDiffIndex = actual.indexOf(expected[i])
            b = true
        }
        if(actual.length > 1 && itemsInExpectedDiff.includes(actual[i])){
            expectedRemainingPostDiffIndex = expected.indexOf(actual[i])
            b = true
        }
        if(b) break
    }

    let diff = generateDiffString(expected.slice(0, expectedRemainingPostDiffIndex), actual.slice(0, actualRemainingPostDiffIndex), sepereator)

    let remainingExpected = expected.slice(expectedRemainingPostDiffIndex)
    let remainingActual = actual.slice(actualRemainingPostDiffIndex)

    commonPrefix.push(diff)
    if(remainingActual.length > 0 && remainingExpected.length > 0) {
        let postFix = createDiffString(remainingExpected, remainingActual, sepereator)
        commonPrefix.push(postFix)
    }
    return commonPrefix.join(sepereator)
}

function generateDiffString(expected, actual, sepereator) {
    return START_DIFF_TAG +
        expected.join(sepereator) +
        EXPECTED_ACTUAL_SEPARATOR +
        actual.join(sepereator) +
        END_DIFF_TAG
}

function encodeString(str) {
    return str.toString()
        .replace(START_DIFF_TAG , ENCODED_START_DIFF_TAG)
        .replace(END_DIFF_TAG , ENCODED_END_DIFF_TAG)
        .replace(EXPECTED_ACTUAL_SEPARATOR , ENCODED_EXPECTED_ACTUAL_SEPARATOR)
}

function findCommonPrefix(expected, actual) {
    let minLenght = Math.min(expected.length, actual.length)
    let i = 0
    for (; i < minLenght; i++) {
        if (expected[i] !== actual[i]) {
            return expected.slice(0, i)
        }
    }
    return actual.slice(0, i)
}

module.exports = Diff