const START_DIFF_TAG = '['
const END_DIFF_TAG = ']'
const EXPECTED_ACTUAL_SEPARATOR = '|'
const ENCODED_START_DIFF_TAG = START_DIFF_TAG + START_DIFF_TAG
const ENCODED_END_DIFF_TAG = END_DIFF_TAG + END_DIFF_TAG
const ENCODED_EXPECTED_ACTUAL_SEPARATOR = EXPECTED_ACTUAL_SEPARATOR + EXPECTED_ACTUAL_SEPARATOR

function Diff(expected, actual, delimiter) {
    this.expected = encodeString(expected)
    this.actual = encodeString(actual)
    this.isEqual = this.expected === this.actual
    this.delimiter = delimiter
}

Diff.prototype.getDiffString = function() {
    if(this.isEqual) return this.actual
    return createDiffString.call(this, this.expected.split(this.delimiter), this.actual.split(this.delimiter))
}

function createDiffString(expected, actual) {
    const commonPrefix = findCommonPrefix.call(this, expected, actual)

    expected = expected.slice(commonPrefix.length)
    actual = actual.slice(commonPrefix.length)

    let { expectedRemainingPostDiffIndex, actualRemainingPostDiffIndex } = findIndexsForNextCommonElement.call(this, expected, actual)
    const diffOfExpected = expected.slice(0, expectedRemainingPostDiffIndex)
    const diffOfActual = actual.slice(0, actualRemainingPostDiffIndex)
    
    const diffString = generateDiffString.call(this, diffOfExpected, diffOfActual)
    if(diffString.length !== 0) commonPrefix.push(diffString)

    expected = expected.slice(expectedRemainingPostDiffIndex)
    actual = actual.slice(actualRemainingPostDiffIndex)
    
    if(actual.length > 0 && expected.length > 0) {
        let postFix = createDiffString.call(this, expected, actual)
        commonPrefix.push(postFix)
    }
    return commonPrefix.join(this.delimiter)
}

function findIndexsForNextCommonElement(expected, actual) {
    let expectedRemainingPostDiffIndex = 0
    let actualRemainingPostDiffIndex = 0
    let itemsInExpectedDiff = []
    let itemsInActualDiff = []
    let maxOfStringLength = Math.max(expected.length, actual.length)
    for (let i = 0; i <= maxOfStringLength; i++) {
        expectedRemainingPostDiffIndex = i
        actualRemainingPostDiffIndex = i
        let b = false
        if (expected.length > i) {
            itemsInExpectedDiff.push(expected[i])
        }
        if (actual.length > i) {
            itemsInActualDiff.push(actual[i])
        }
        if (expected.length > 1 && itemsInActualDiff.includes(expected[i])) {
            actualRemainingPostDiffIndex = actual.indexOf(expected[i])
            b = true
        }
        if (actual.length > 1 && itemsInExpectedDiff.includes(actual[i])) {
            expectedRemainingPostDiffIndex = expected.indexOf(actual[i])
            b = true
        }
        if (b)
            break
    }
    return { expectedRemainingPostDiffIndex, actualRemainingPostDiffIndex }
}

function generateDiffString(expected, actual) {
    if(expected.length === 0 && actual.length === 0) return ''
    return START_DIFF_TAG +
        expected.join(this.delimiter) +
        EXPECTED_ACTUAL_SEPARATOR +
        actual.join(this.delimiter) +
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