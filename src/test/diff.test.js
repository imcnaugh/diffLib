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

    test('diff should remember the delimiter', () => {
        const diff = new Diff('1', '2', 'x')
        expect(diff.delimiter).toBe('x')
    })
})

describe('Verify some edge cases are handled', () => {
    test('ints should be diffed propertly', () => {
        const diff = new Diff(1, 2)
        expect(diff.getDiffString()).toBe('[1|2]')
    })
    
    test('two of the same ints should diff properly', () => {
        const diff = new Diff(0, 0)
        expect(diff.getDiffString()).toBe('0')
    })
    
    test('what happens when an int and a string are diffed', () => {
        const diff = new Diff(1, '1')
        expect(diff.getDiffString()).toBe('1')
    })
    
    test('what happens when large ints and a string are diffed', () => {
        const diff = new Diff(1001, '1001')
        expect(diff.getDiffString()).toBe('1001')
    })
})