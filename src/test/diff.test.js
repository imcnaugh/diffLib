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
    expect(diff.gitDiff()).toBe('a[b|d]c')
})

test('should show expected empty when actualy has more chars', () => {
    const diff = new Diff('ac', 'adc')
    expect(diff.gitDiff()).toBe('a[|d]c')
})

test('should show actual empty when expected has more chars', () => {
    const diff = new Diff('adc', 'ac')
    expect(diff.gitDiff()).toBe('a[d|]c')
})

test('empty strings should be handled appropriately', () => {
    const diff = new Diff('', '')
    expect(diff.gitDiff()).toBe('')
})

test('empty expected should be handled appropriately', () => {
    const diff = new Diff('', 'abc')
    expect(diff.gitDiff()).toBe('[|abc]')
})

test('empty actual should be handled appropriately', () => {
    const diff = new Diff('abc', '')
    expect(diff.gitDiff()).toBe('[abc|]')
})