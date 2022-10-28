const WordDiff = require('../main/wordDiff');

describe('Verify diff by word', () =>{
    test('Last word in string has diff', () =>{
        const s1 = 'words but some are misspelled';
        const s2 = 'words but some are misselled';
        const diff = new WordDiff(s1, s2)
        expect(diff.getDiffString()).toBe('words but some are [misspelled|misselled]')
    })

    test('First word in string has diff', () => {
        const s1 = 'words but some are misspelled';
        const s2 = 'word but some are misspelled';
        const diff = new WordDiff(s1, s2)
        expect(diff.getDiffString()).toBe('[words|word] but some are misspelled')
    })

    test('Middle word in string has diff', () => {
        const s1 = 'words but soe are misspelled';
        const s2 = 'words but some are misspelled';
        const diff = new WordDiff(s1, s2)
        expect(diff.getDiffString()).toBe('words but [soe|some] are misspelled')
    })
})