const Diff = require('../main/diff.js')

describe('Verify diff paramaters', () => {
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
})

describe('Verify diff by letter', () => {
    test('should show the diff of a single world', () => {
        const diff = new Diff('abc', 'adc')
        expect(diff.diffByLetter()).toBe('a[b|d]c')
    })

    test('should show expected empty when actualy has more chars', () => {
        const diff = new Diff('ac', 'adc')
        expect(diff.diffByLetter()).toBe('a[|d]c')
    })
    
    test('should show actual empty when expected has more chars', () => {
        const diff = new Diff('adc', 'ac')
        expect(diff.diffByLetter()).toBe('a[d|]c')
    })
    
    test('empty strings should be handled appropriately', () => {
        const diff = new Diff('', '')
        expect(diff.diffByLetter()).toBe('')
    })
    
    test('empty expected should be handled appropriately', () => {
        const diff = new Diff('', 'abc')
        expect(diff.diffByLetter()).toBe('[|abc]')
    })
    
    test('empty actual should be handled appropriately', () => {
        const diff = new Diff('abc', '')
        expect(diff.diffByLetter()).toBe('[abc|]')
    })
    
    test('special chars should be encoded correctly', () => {
        const diff = new Diff('[]|', '[]|')
        expect(diff.diffByLetter()).toBe('[[]]||')
    })
    
    test('diff strings with special chars should be encoded and diffed correctly', () => {
        const diff = new Diff('[]|', '[abc]|')
        expect(diff.diffByLetter()).toBe('[[[|abc]]]||')
    })

    test('a difference of case should show up as a diff', () => {
        const diff = new Diff('A', 'a')
        expect(diff.diffByLetter()).toBe('[A|a]')
    })

    test('diff a longer string with multile diffs', () => {
        const s1 = 'aabbbcccdddeee'
        const s2 = 'aaabbbcccdddee'
        const diff = new Diff(s1, s2)
        expect(diff.diffByLetter()).toBe('aa[bbbcccddde|abbbcccddd]ee')
    })
})

describe('Verify diff by word', () =>{
    test('Last word in string has diff', () =>{
        const s1 = 'words but some are misspelled';
        const s2 = 'words but some are misselled';
        const diff = new Diff(s1, s2)
        expect(diff.diffByWord()).toBe('words but some are [misspelled|misselled]')
    })

    test('First word in string has diff', () => {
        const s1 = 'words but some are misspelled';
        const s2 = 'word but some are misspelled';
        const diff = new Diff(s1, s2)
        expect(diff.diffByWord()).toBe('[words|word] but some are misspelled')
    })

    test('Middle word in string has diff', () => {
        const s1 = 'words but soe are misspelled';
        const s2 = 'words but some are misspelled';
        const diff = new Diff(s1, s2)
        expect(diff.diffByWord()).toBe('words but [soe|some] are misspelled')
    })
})

describe('Verify diff by line', () => {
    test('Simple line diff test', () => {
        const s1 = 'aaa\nbbb\nccc'
        const s2 = 'aaa\nccc'
        const diff = new Diff(s1, s2)
        expect(diff.diffByLine()).toBe('aaa\n[bbb|]\nccc')
    })
})

describe('Verify some edge cases are handled', () => {
    test('ints should be diffed propertly', () => {
        const diff = new Diff(1, 2)
        expect(diff.diffByLetter()).toBe('[1|2]')
    })
    
    test('two of the same ints should diff properly', () => {
        const diff = new Diff(0, 0)
        expect(diff.diffByLetter()).toBe('0')
    })
    
    test('what happens when an int and a string are diffed', () => {
        const diff = new Diff(1, '1')
        expect(diff.diffByLetter()).toBe('1')
    })
    
    test('what happens when large ints and a string are diffed', () => {
        const diff = new Diff(1001, '1001')
        expect(diff.diffByLetter()).toBe('1001')
    })
})

describe('Ideal behaivor', () => {
    
    test('diff a longer string with multile diffs', () => {
        const s1 = 'aabbbcccdddeee'
        const s2 = 'aaabbbcccdddee'
        const diff = new Diff(s1, s2)
        expect(diff.diffByLetter()).toBe('aa[|a]bbbccc[e|]ee')
    })
})