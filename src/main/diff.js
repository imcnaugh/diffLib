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
    if(expected.length === 0 && actual.length === 0) return ''
    if(expected.length === 0) {
        return START_DIFF_TAG + EXPECTED_ACTUAL_SEPARATOR +  actual.join(sepereator) + END_DIFF_TAG
    }
    if(actual.length === 0){
        return START_DIFF_TAG + expected.join(sepereator) + EXPECTED_ACTUAL_SEPARATOR + END_DIFF_TAG
    } 

    let prefixCommonCount = findPrefixCommonCharCount(expected, actual)
    if(prefixCommonCount === expected.length && prefixCommonCount == actual.length) {
        return actual.join(sepereator)
    }
    let commonPrefix = actual.slice(0, prefixCommonCount).join(sepereator)
    if(commonPrefix.length > 0) commonPrefix += sepereator

    let expectedRemainingPostDiffIndex = prefixCommonCount
    let actualRemainingPostDiffIndex = prefixCommonCount

    let maxOfStringLength = Math.max(expected.length, actual.length)
    let itemsInExpectedDiff = []
    let itemsInActualDiff = []

    for (let i = prefixCommonCount; i <= maxOfStringLength; i++) {
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
            actualRemainingPostDiffIndex = actual.slice(prefixCommonCount).indexOf(expected[i]) + prefixCommonCount
            b = true
        }
        if(actual.length > 1 && itemsInExpectedDiff.includes(actual[i])){
            expectedRemainingPostDiffIndex = expected.slice(prefixCommonCount).indexOf(actual[i]) + prefixCommonCount
            b = true
        }
        if(b) break
    }

    let diff = generateDiffString(expected.slice(prefixCommonCount, expectedRemainingPostDiffIndex), actual.slice(prefixCommonCount, actualRemainingPostDiffIndex), sepereator)

    let remainingExpected = expected.slice(expectedRemainingPostDiffIndex)
    let remainingActual = actual.slice(actualRemainingPostDiffIndex)
    let postFix = createDiffString(remainingExpected, remainingActual, sepereator)
    if(postFix.length > 0) postFix = sepereator + postFix
    return commonPrefix + diff + postFix
}

function generateDiffString(expected, actual, sepereator) {
    return START_DIFF_TAG +
        expected.join(sepereator) +
        EXPECTED_ACTUAL_SEPARATOR +
        actual.join(sepereator) +
        END_DIFF_TAG
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

module.exports = Diff