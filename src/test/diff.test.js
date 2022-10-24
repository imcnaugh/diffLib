const Diff = require('../main/diff.js')

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