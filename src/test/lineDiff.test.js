const LineDiff = require('../main/lineDiff');

describe('Verify diff by line', () => {
    test('Simple line diff test', () => {
        const s1 = 'aaa\nbbb\nccc'
        const s2 = 'aaa\nccc'
        const diff = new LineDiff(s1, s2)
        expect(diff.diffString).toBe('aaa\n[bbb|]\nccc')
    })

    test('a string of words 1 char off should flag the whole line', () => {
        const s1 = 'words but some are misspelled';
        const s2 = 'word but some are misspelled';
        const diff = new LineDiff(s1, s2)
        expect(diff.diffString).toBe('[words but some are misspelled|word but some are misspelled]')
    })
})
