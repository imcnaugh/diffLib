const Diff = require('../main/diff.js')

describe('Verify diff paramaters', () => {
    test('should return true when s1 is equal to s2', () => {
        const diff = new Diff('1', '1', '')
        expect(diff.isEqual).toBe(true)
    })
    
    test('should return false when s1 is not equal to s2', () => {
        const diff = new Diff('1', '2', '')
        expect(diff.isEqual).toBe(false)
    })
    
    test('diff should remember expected and acutal', () => {
        const diff = new Diff('1', '2', '')
        expect(diff.expected).toBe('1')
        expect(diff.actual).toBe('2')
    })

    test('diff should remember the delimiter', () => {
        const diff = new Diff('1', '2', 'x')
        expect(diff.delimiter).toBe('x')
    })
})

describe('Verify diff by line', () => {
    test('Simple line diff test', () => {
        const s1 = 'aaa\nbbb\nccc'
        const s2 = 'aaa\nccc'
        const diff = new Diff(s1, s2)
        expect(diff.diffByLine()).toBe('aaa\n[bbb|]\nccc')
    })

    test('a string of words 1 char off should flag the whole line', () => {
        const s1 = 'words but some are misspelled';
        const s2 = 'word but some are misspelled';
        const diff = new Diff(s1, s2)
        expect(diff.diffByLine()).toBe('[words but some are misspelled|word but some are misspelled]')
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
        expect(diff.diffByLetter()).toBe('aa[|a]bbbcccdddee[e|]')
    })
})