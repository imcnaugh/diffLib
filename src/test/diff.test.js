const Diff = require('../main/diff.js')

test('should return true when s1 is equal to s2', () => {
    const diff = new Diff('1', '1')
    expect(diff.isEqual).toBe(true)
})

test('should return false when s1 is not equal to s2', () => {
    const diff = new Diff('1', '2')
    expect(diff.isEqual).toBe(false)
})

test('diff should remember expected and acutal', () => {
    const diff = new Diff('1', '2')
    expect(diff.expected).toBe('1')
    expect(diff.actual).toBe('2')
})

test('should show the diff of a single world', () => {
    const diff = new Diff('abc', 'adc')
    expect(diff.diffString).toBe('a[b|d]c')
})

test('should show expected empty when actualy has more chars', () => {
    const diff = new Diff('ac', 'adc')
    expect(diff.diffString).toBe('a[|d]c')
})

test('should show actual empty when expected has more chars', () => {
    const diff = new Diff('adc', 'ac')
    expect(diff.diffString).toBe('a[d|]c')
})

test('empty strings should be handled appropriately', () => {
    const diff = new Diff('', '')
    expect(diff.diffString).toBe('')
})

test('empty expected should be handled appropriately', () => {
    const diff = new Diff('', 'abc')
    expect(diff.diffString).toBe('[|abc]')
})

test('empty actual should be handled appropriately', () => {
    const diff = new Diff('abc', '')
    expect(diff.diffString).toBe('[abc|]')
})

test('special chars should be encoded correctly', () => {
    const diff = new Diff('[]|', '[]|')
    expect(diff.diffString).toBe('[[]]||')
})

test('diff strings with special chars should be encoded and diffed correctly', () => {
    const diff = new Diff('[]|', '[abc]|')
    expect(diff.diffString).toBe('[[[|abc]]]||')
})

test('should show diff of longer strings', () => {
    const diff = new Diff('this is a longer string it has a few words', 'this s a longer string it has a fe words')
    expect(diff.diffString).toBe('this [is a longer string it has a few|s a longer string it has a fe] words')
})

test('a difference of case should show up as a diff', () => {
    const diff = new Diff('A', 'a')
    expect(diff.diffString).toBe('[A|a]')
})

test('ints should be diffed propertly', () => {
    const diff = new Diff(1, 2)
    expect(diff.diffString).toBe('[1|2]')
})

test('two of the same ints should diff properly', () => {
    const diff = new Diff(0, 0)
    expect(diff.diffString).toBe('0')
})

test('what happens when an int and a string are diffed', () => {
    const diff = new Diff(1, '1')
    expect(diff.diffString).toBe('1')
})

test('what happens when large ints and a string are diffed', () => {
    const diff = new Diff(1001, '1001')
    expect(diff.diffString).toBe('1001')
})