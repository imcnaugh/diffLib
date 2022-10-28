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
    return this.createDiffString()
}

Diff.prototype.createDiffString = function() {
    if(this.remainingExpected.length === 0 && this.remainingActual.length === 0) return ''
    this.addNextPrefix()
    this.addNextDiff()
    this.createDiffString()
    return this.diffParts.filter(Boolean).join(this.delimiter)
}

Diff.prototype.addNextPrefix = function() {
    let minLenght = Math.min(this.remainingExpected.length, this.remainingActual.length)
    let i = 0
    for (; i < minLenght; i++) {
        if (this.remainingExpected[i] !== this.remainingActual[i]) {
            break
        }
    }

    this.diffParts.push(this.remainingActual.slice(0,i).join(this.delimiter))
    this.sliceRemaining(i, i)
}

Diff.prototype.addNextDiff = function() {
    let expectedRemainingPostDiffIndex = 0
    let actualRemainingPostDiffIndex = 0
    let itemsInExpectedDiff = {}
    let itemsInActualDiff = {}
    let maxOfStringLength = Math.max(this.remainingExpected.length, this.remainingActual.length)

    for (let i = 0; i <= maxOfStringLength; i++) {
        expectedRemainingPostDiffIndex = i
        actualRemainingPostDiffIndex = i

        if (this.remainingExpected.length > i && !itemsInExpectedDiff[this.remainingExpected[i]]) {
            itemsInExpectedDiff[this.remainingExpected[i]] = i
        }
        if (this.remainingActual.length > i && !itemsInActualDiff[this.remainingActual[i]]) {
            itemsInActualDiff[this.remainingActual[i]] = i
        }

        let b = false
        if (itemsInActualDiff[this.remainingExpected[i]] !== undefined) {
            actualRemainingPostDiffIndex = this.remainingActual.indexOf(this.remainingExpected[i])
            b = true
        }
        if (itemsInExpectedDiff[this.remainingActual[i]] !== undefined) {
            expectedRemainingPostDiffIndex = this.remainingExpected.indexOf(this.remainingActual[i])
            b = true
        }
        
        if (b){
            break
        }
    }

    const diffOfExpected = this.remainingExpected.slice(0, expectedRemainingPostDiffIndex)
    const diffOfActual = this.remainingActual.slice(0, actualRemainingPostDiffIndex)

    const diffPart = this.generateDiffString(diffOfExpected, diffOfActual)
    this.diffParts.push(diffPart)
    this.sliceRemaining(expectedRemainingPostDiffIndex, actualRemainingPostDiffIndex)
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