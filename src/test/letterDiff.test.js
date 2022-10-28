const LetterDiff = require('../main/letterDiff');

describe('Verify diff by letter', () => {
    test('two equal strings should not have a diff', () => {
        const diff = new LetterDiff('1', '1')
        expect(diff.getDiffString()).toBe('1')
    })

    test('should show the diff of a single world', () => {
        const diff = new LetterDiff('abc', 'adc')
        expect(diff.getDiffString()).toBe('a[b|d]c')
    })

    test('should show expected empty when actualy has more chars', () => {
        const diff = new LetterDiff('ac', 'adc')
        expect(diff.getDiffString()).toBe('a[|d]c')
    })
    
    test('should show actual empty when expected has more chars', () => {
        const diff = new LetterDiff('adc', 'ac')
        expect(diff.getDiffString()).toBe('a[d|]c')
    })
    
    test('empty strings should be handled appropriately', () => {
        const diff = new LetterDiff('', '')
        expect(diff.getDiffString()).toBe('')
    })
    
    test('empty expected should be handled appropriately', () => {
        const diff = new LetterDiff('', 'abc')
        expect(diff.getDiffString()).toBe('[|abc]')
    })
    
    test('empty actual should be handled appropriately', () => {
        const diff = new LetterDiff('abc', '')
        expect(diff.getDiffString()).toBe('[abc|]')
    })
    
    test('special chars should be encoded correctly', () => {
        const diff = new LetterDiff('[]|', '[]|')
        expect(diff.getDiffString()).toBe('[[]]||')
    })
    
    test('diff strings with special chars should be encoded and diffed correctly', () => {
        const diff = new LetterDiff('[]|', '[abc]|')
        expect(diff.getDiffString()).toBe('[[[|abc]]]||')
    })

    test('a difference of case should show up as a diff', () => {
        const diff = new LetterDiff('A', 'a')
        expect(diff.getDiffString()).toBe('[A|a]')
    })
})