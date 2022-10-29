const START_DIFF_TAG = "[";
const END_DIFF_TAG = "]";
const EXPECTED_ACTUAL_SEPARATOR = "|";
const ENCODED_START_DIFF_TAG = START_DIFF_TAG + START_DIFF_TAG;
const ENCODED_END_DIFF_TAG = END_DIFF_TAG + END_DIFF_TAG;
const ENCODED_EXPECTED_ACTUAL_SEPARATOR =
  EXPECTED_ACTUAL_SEPARATOR + EXPECTED_ACTUAL_SEPARATOR;

function Diff(input1, input2, delimiter) {
  this.input1 = input1;
  this.input2 = input2;
  this.delimiter = delimiter;
  this.isEqual = input1 === input2;
  this.encodedInput1 = this.encodeString(input1);
  this.encodedInput2 = this.encodeString(input2);
  this.input1Parts = this.encodedInput1.split(this.delimiter);
  this.input2Parts = this.encodedInput2.split(this.delimiter);
  this.totalParts = this.input1Parts.length + this.input2Parts.length;
  this.countOfDiffs = 0;
  this.diffString = this.getDiffString();
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
  } while(this.input1Parts.length > 0 && this.input2Parts.length > 0)
};

Diff.prototype.proccessCommonPrefix = function () {
  const indexOfNextDiff = this.findIndexOfNextDiff();
  const commonPrefix = this.input1Parts.slice(0, indexOfNextDiff);
  this.diffParts = this.diffParts.concat(commonPrefix);
  this.sliceInputs(indexOfNextDiff, indexOfNextDiff);
};

Diff.prototype.proccessNextDiff = function () {
  let { input1NextCommonIndex, input2NextCommonIndex } = this.findIndexOfNextCommon();
  this.countOfDiffs = this.countOfDiffs + input1NextCommonIndex + input2NextCommonIndex;
  const diffOfExpected = this.input1Parts.slice(0, input1NextCommonIndex);
  const diffOfActual = this.input2Parts.slice(0, input2NextCommonIndex);
  const diffPart = this.generateDiffString(diffOfExpected, diffOfActual);
  this.diffParts = this.diffParts.concat(diffPart);
  this.sliceInputs(input1NextCommonIndex, input2NextCommonIndex);
};

Diff.prototype.findIndexOfNextDiff = function () {
  let minLenght = Math.min(this.input1Parts.length, this.input2Parts.length);
  let i = 0;
  for (; i < minLenght; i++) {
    if (this.input1Parts[i] !== this.input2Parts[i]) {
      break;
    }
  }
  return i;
};

Diff.prototype.findIndexOfNextCommon = function () {
  let input1NextCommonIndex = 0;
  let input2NextCommonIndex = 0;
  let input1FirstOccuranceOfItem = {};
  let input2FirstOccuranceOfItem = {};
  let maxOfStringLength = Math.max(this.input1Parts.length, this.input2Parts.length);

  for (let i = 0; i <= maxOfStringLength;i++) {
    const input1CharAtIndex = this.input1Parts[i];
    const input2CharAtIndex = this.input2Parts[i];

    input1FirstOccuranceOfItem[input1CharAtIndex] = input1FirstOccuranceOfItem[input1CharAtIndex] === undefined ? i : input1FirstOccuranceOfItem[input1CharAtIndex];
    input2FirstOccuranceOfItem[input2CharAtIndex] = input2FirstOccuranceOfItem[input2CharAtIndex] === undefined ? i : input2FirstOccuranceOfItem[input2CharAtIndex];

    if(input1FirstOccuranceOfItem[input2CharAtIndex] !== undefined || input2FirstOccuranceOfItem[input1CharAtIndex] !== undefined) {
      let commonItem = input1FirstOccuranceOfItem[input2CharAtIndex] !== undefined ? input2CharAtIndex : input1CharAtIndex;
      input1NextCommonIndex = input1FirstOccuranceOfItem[commonItem];
      input2NextCommonIndex = input2FirstOccuranceOfItem[commonItem];
      break
    }
  }
  return { input1NextCommonIndex, input2NextCommonIndex };
};

Diff.prototype.sliceInputs = function (
  remainingSliceIndex,
  actualSliceIndex
) {
  this.input1Parts = this.input1Parts.slice(remainingSliceIndex);
  this.input2Parts = this.input2Parts.slice(actualSliceIndex);
};

Diff.prototype.getPercentDifferent = function () {
  return (this.countOfDiffs / this.totalParts) * 100;
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
