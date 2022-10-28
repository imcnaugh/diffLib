const START_DIFF_TAG = '['
const END_DIFF_TAG = ']'
const EXPECTED_ACTUAL_SEPARATOR = '|'
const ENCODED_START_DIFF_TAG = START_DIFF_TAG + START_DIFF_TAG
const ENCODED_END_DIFF_TAG = END_DIFF_TAG + END_DIFF_TAG
const ENCODED_EXPECTED_ACTUAL_SEPARATOR = EXPECTED_ACTUAL_SEPARATOR + EXPECTED_ACTUAL_SEPARATOR

function Diff(expected, actual, delimiter) {
    this.isEqual = expected === actual
    this.originalExpected = expected
    this.originalActual = actual
    this.encodedExpected = this.encodeString(expected)
    this.encodedActual = this.encodeString(actual)
    this.delimiter = delimiter
}

Diff.prototype.getDiffString = function() {
    this.diffParts = []
    this.remainingExpected = this.encodedExpected.split(this.delimiter)
    this.remainingActual = this.encodedActual.split(this.delimiter)
    this.generateDiffParts()
    return this.diffParts.filter(Boolean).join(this.delimiter)
}

Diff.prototype.generateDiffParts = function() {
    if(this.remainingExpected.length === 0 && this.remainingActual.length === 0) return
    this.addNextPrefix()
    this.addNextDiff()
    this.generateDiffParts()
}

Diff.prototype.addNextPrefix = function() {
    const indexOfNextDiff = this.findIndexOfNextDiff()
    const commonPrefix = this.remainingActual.slice(0, indexOfNextDiff).join(this.delimiter)

    this.diffParts.push(commonPrefix)
    this.sliceRemaining(indexOfNextDiff, indexOfNextDiff)
}

Diff.prototype.findIndexOfNextDiff = function() {
    let minLenght = Math.min(this.remainingExpected.length, this.remainingActual.length)
    let i = 0
    for (; i < minLenght; i++) {
        if (this.remainingExpected[i] !== this.remainingActual[i]) {
            break
        }
    }
    return i
}

Diff.prototype.addNextDiff = function() {
    let {expectedNextCommonIndex, actualNextCommonIndex} = this.findIndexOfNextCommon()

    const diffOfExpected = this.remainingExpected.slice(0, expectedNextCommonIndex)
    const diffOfActual = this.remainingActual.slice(0, actualNextCommonIndex)
    const diffPart = this.generateDiffString(diffOfExpected, diffOfActual)
    this.diffParts.push(diffPart)

    this.sliceRemaining(expectedNextCommonIndex, actualNextCommonIndex)
}

Diff.prototype.findIndexOfNextCommon = function() {
    let expectedNextCommonIndex = 0
    let actualNextCommonIndex = 0
    let expectedFirstOccuranceOfItem = {}
    let actualFirstOccuranceOfItem = {}
    let maxOfStringLength = Math.max(this.remainingExpected.length, this.remainingActual.length)
    
    for (let i = 0; i <= maxOfStringLength; i++, expectedNextCommonIndex++, actualNextCommonIndex++) {
        const remainingExpectedCharAti = this.remainingExpected[i]
        const remainingActualCharAti = this.remainingActual[i]

        if (this.remainingExpected.length > i && !expectedFirstOccuranceOfItem[remainingExpectedCharAti]) {
            expectedFirstOccuranceOfItem[remainingExpectedCharAti] = i
        }
        if (this.remainingActual.length > i && !actualFirstOccuranceOfItem[remainingActualCharAti]) {
            actualFirstOccuranceOfItem[remainingActualCharAti] = i
        }

        let b = false
        if (actualFirstOccuranceOfItem[remainingExpectedCharAti] !== undefined) {
            actualNextCommonIndex = this.remainingActual.indexOf(remainingExpectedCharAti)
            b = true
        }
        if (expectedFirstOccuranceOfItem[remainingActualCharAti] !== undefined) {
            expectedNextCommonIndex = this.remainingExpected.indexOf(remainingActualCharAti)
            b = true
        }
        if(b) break
    }
    return {expectedNextCommonIndex, actualNextCommonIndex}
}

Diff.prototype.sliceRemaining = function(remainingSliceIndex, actualSliceIndex) {
    this.remainingExpected = this.remainingExpected.slice(remainingSliceIndex)
    this.remainingActual = this.remainingActual.slice(actualSliceIndex)
}

Diff.prototype.generateDiffString = function(expected, actual) {
    if(expected.length === 0 && actual.length === 0) return ''
    return START_DIFF_TAG +
        expected.join(this.delimiter) +
        EXPECTED_ACTUAL_SEPARATOR +
        actual.join(this.delimiter) +
        END_DIFF_TAG
}

Diff.prototype.encodeString = function(str) {
    return str.toString()
        .replace(START_DIFF_TAG , ENCODED_START_DIFF_TAG)
        .replace(END_DIFF_TAG , ENCODED_END_DIFF_TAG)
        .replace(EXPECTED_ACTUAL_SEPARATOR , ENCODED_EXPECTED_ACTUAL_SEPARATOR)
}

module.exports = Diff