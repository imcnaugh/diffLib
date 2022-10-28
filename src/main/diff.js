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
    this.diffParts = []
    this.remainingExpected = this.expected.split(this.delimiter)
    this.remainingActual = this.actual.split(this.delimiter)
    return createDiffString.call(this)
}

function createDiffString() {
    if(this.remainingExpected.length === 0 && this.remainingActual.length === 0) return ''
    addNextPrefix.call(this)
    addNextDiff.call(this)
    createDiffString.call(this)
    return this.diffParts.join(this.delimiter)
}

function addNextDiff() {
    let expectedRemainingPostDiffIndex = 0
    let actualRemainingPostDiffIndex = 0
    let itemsInExpectedDiff = []
    let itemsInActualDiff = []
    let maxOfStringLength = Math.max(this.remainingExpected.length, this.remainingActual.length)
    for (let i = 0; i <= maxOfStringLength; i++) {
        expectedRemainingPostDiffIndex = i
        actualRemainingPostDiffIndex = i
        let b = false
        if (this.remainingExpected.length > i) {
            itemsInExpectedDiff.push(this.remainingExpected[i])
        }
        if (this.remainingActual.length > i) {
            itemsInActualDiff.push(this.remainingActual[i])
        }
        if (this.remainingExpected.length > 1 && itemsInActualDiff.includes(this.remainingExpected[i])) {
            actualRemainingPostDiffIndex = this.remainingActual.indexOf(this.remainingExpected[i])
            b = true
        }
        if (this.remainingActual.length > 1 && itemsInExpectedDiff.includes(this.remainingActual[i])) {
            expectedRemainingPostDiffIndex = this.remainingExpected.indexOf(this.remainingActual[i])
            b = true
        }
        if (b)
            break
    }

    const diffOfExpected = this.remainingExpected.slice(0, expectedRemainingPostDiffIndex)
    const diffOfActual = this.remainingActual.slice(0, actualRemainingPostDiffIndex)

    const diffPart = generateDiffString.call(this, diffOfExpected, diffOfActual)
    if(diffPart.length > 3) {
        this.diffParts.push(diffPart)
    }
    this.remainingExpected = this.remainingExpected.slice(expectedRemainingPostDiffIndex)
    this.remainingActual = this.remainingActual.slice(actualRemainingPostDiffIndex)
}

function generateDiffString(expected, actual) {
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

function addNextPrefix() {
    let minLenght = Math.min(this.remainingExpected.length, this.remainingActual.length)
    let i = 0
    for (; i < minLenght; i++) {
        if (this.remainingExpected[i] !== this.remainingActual[i]) {
            break
        }
    }

    if(i > 0) {
        this.diffParts.push(this.remainingActual.slice(0,i).join(this.delimiter))
    }
    this.remainingExpected = this.remainingExpected.slice(i)
    this.remainingActual = this.remainingActual.slice(i)
}

module.exports = Diff