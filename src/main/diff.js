const START_DIFF_TAG = "[";
const END_DIFF_TAG = "]";
const EXPECTED_ACTUAL_SEPARATOR = "|";
const ENCODED_START_DIFF_TAG = START_DIFF_TAG + START_DIFF_TAG;
const ENCODED_END_DIFF_TAG = END_DIFF_TAG + END_DIFF_TAG;
const ENCODED_EXPECTED_ACTUAL_SEPARATOR =
  EXPECTED_ACTUAL_SEPARATOR + EXPECTED_ACTUAL_SEPARATOR;

function Diff(expected, actual, delimiter) {
  this.expected = expected;
  this.actual = actual;
  this.delimiter = delimiter;
  this.isEqual = expected === actual;

  this.encodedExpected = this.encodeString(expected);
  this.encodedActual = this.encodeString(actual);
  this.input1 = this.encodedExpected.split(this.delimiter);
  this.input2 = this.encodedActual.split(this.delimiter);
}

Diff.prototype.getDiffString = function () {
  this.diffParts = [];
  this.populateDiffParts();
  return this.diffParts.filter(Boolean).join(this.delimiter);
};

Diff.prototype.populateDiffParts = function () {
  do {
    this.proccessCommonPrefix();
    this.proccessNextDiff(); 
  } while(this.input1.length > 0 && this.input2.length > 0)
};

Diff.prototype.proccessCommonPrefix = function () {
  const indexOfNextDiff = this.findIndexOfNextDiff();
  const commonPrefix = this.input1.slice(0, indexOfNextDiff);
  this.diffParts = this.diffParts.concat(commonPrefix);
  this.sliceInputs(indexOfNextDiff, indexOfNextDiff);
};

Diff.prototype.proccessNextDiff = function () {
  let { expectedNextCommonIndex, actualNextCommonIndex } = this.findIndexOfNextCommon();

  const diffOfExpected = this.input1.slice(0, expectedNextCommonIndex);
  const diffOfActual = this.input2.slice(0, actualNextCommonIndex);
  const diffPart = this.generateDiffString(diffOfExpected, diffOfActual);
  this.diffParts = this.diffParts.concat(diffPart);
  this.sliceInputs(expectedNextCommonIndex, actualNextCommonIndex);
};

Diff.prototype.findIndexOfNextDiff = function () {
  let minLenght = Math.min(this.input1.length, this.input2.length);
  let i = 0;
  for (; i < minLenght; i++) {
    if (this.input1[i] !== this.input2[i]) {
      break;
    }
  }
  return i;
};

Diff.prototype.findIndexOfNextCommon = function () {
  let expectedNextCommonIndex = 0;
  let actualNextCommonIndex = 0;
  let expectedFirstOccuranceOfItem = {};
  let actualFirstOccuranceOfItem = {};
  let maxOfStringLength = Math.max(this.input1.length, this.input2.length);

  for (let i = 0; i <= maxOfStringLength;i++, expectedNextCommonIndex++, actualNextCommonIndex++) {
    const remainingExpectedCharAti = this.input1[i];
    const remainingActualCharAti = this.input2[i];

    if (
      this.input1.length > i &&
      !expectedFirstOccuranceOfItem[remainingExpectedCharAti]
    ) {
      expectedFirstOccuranceOfItem[remainingExpectedCharAti] = i;
    }
    if (
      this.input2.length > i &&
      !actualFirstOccuranceOfItem[remainingActualCharAti]
    ) {
      actualFirstOccuranceOfItem[remainingActualCharAti] = i;
    }

    let b = false;
    if (actualFirstOccuranceOfItem[remainingExpectedCharAti] !== undefined) {
      actualNextCommonIndex = this.input2.indexOf(
        remainingExpectedCharAti
      );
      b = true;
    }
    if (expectedFirstOccuranceOfItem[remainingActualCharAti] !== undefined) {
      expectedNextCommonIndex = this.input1.indexOf(
        remainingActualCharAti
      );
      b = true;
    }
    if (b) break;
  }
  return { expectedNextCommonIndex, actualNextCommonIndex };
};

Diff.prototype.sliceInputs = function (
  remainingSliceIndex,
  actualSliceIndex
) {
  this.input1 = this.input1.slice(remainingSliceIndex);
  this.input2 = this.input2.slice(actualSliceIndex);
};

Diff.prototype.generateDiffString = function (expected, actual) {
  if (expected.length === 0 && actual.length === 0) return "";
  return (
    START_DIFF_TAG +
    expected.join(this.delimiter) +
    EXPECTED_ACTUAL_SEPARATOR +
    actual.join(this.delimiter) +
    END_DIFF_TAG
  );
};

Diff.prototype.encodeString = function (str) {
  return str
    .toString()
    .replace(START_DIFF_TAG, ENCODED_START_DIFF_TAG)
    .replace(END_DIFF_TAG, ENCODED_END_DIFF_TAG)
    .replace(EXPECTED_ACTUAL_SEPARATOR, ENCODED_EXPECTED_ACTUAL_SEPARATOR);
};

module.exports = Diff;
