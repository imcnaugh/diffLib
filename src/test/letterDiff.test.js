const LetterDiff = require('../main/letterDiff');

describe('Verify diff by letter', () => {
    test('two equal strings should not have a diff', () => {
        const diff = new LetterDiff('1', '1')
        expect(diff.diffString).toBe('1')
    })

    test('should show the diff of a single world', () => {
        const diff = new LetterDiff('abc', 'adc')
        expect(diff.diffString).toBe('a[b|d]c')
    })

    test('should show expected empty when actualy has more chars', () => {
        const diff = new LetterDiff('ac', 'adc')
        expect(diff.diffString).toBe('a[|d]c')
    })
    
    test('should show actual empty when expected has more chars', () => {
        const diff = new LetterDiff('adc', 'ac')
        expect(diff.diffString).toBe('a[d|]c')
    })
    
    test('empty strings should be handled appropriately', () => {
        const diff = new LetterDiff('', '')
        expect(diff.diffString).toBe('')
    })
    
    test('empty expected should be handled appropriately', () => {
        const diff = new LetterDiff('', 'abc')
        expect(diff.diffString).toBe('[|abc]')
    })
    
    test('empty actual should be handled appropriately', () => {
        const diff = new LetterDiff('abc', '')
        expect(diff.diffString).toBe('[abc|]')
    })
    
    test('special chars should be encoded correctly', () => {
        const diff = new LetterDiff('[]|', '[]|')
        expect(diff.diffString).toBe('[[]]||')
    })
    
    test('diff strings with special chars should be encoded and diffed correctly', () => {
        const diff = new LetterDiff('[]|', '[abc]|')
        expect(diff.diffString).toBe('[[[|abc]]]||')
    })

    test('a difference of case should show up as a diff', () => {
        const diff = new LetterDiff('A', 'a')
        expect(diff.diffString).toBe('[A|a]')
    })

    test('diff a longer string with multile diffs', () => {
        const s1 = 'aabbbcccdddeee'
        const s2 = 'aaabbbcccdddee'
        const diff = new LetterDiff(s1, s2, '')
        expect(diff.diffString).toBe('aa[|a]bbbcccdddee[e|]')
    })
})

describe('Verify diff percent', () => {
    test('two equal strings should have a 0% diff', () => {
        const diff = new LetterDiff('1', '1')
        expect(diff.getPercentDifferent()).toBe(0)
    })

    test('two unequal strings should have a 100% diff', () => {
        const diff = new LetterDiff('1', '2')
        expect(diff.getPercentDifferent()).toBe(100)
    })

    test('two unequal strings should have a 50% diff', () => {
        const diff = new LetterDiff('13', '12')
        expect(diff.getPercentDifferent()).toBe(50)
    })

    test('two similar strings should have a small diff percentage', () => {
        const diff = new LetterDiff('aaaaaaaa', 'aaaaaaab')
        expect(diff.getPercentDifferent()).toBe(12.5)
    })
})