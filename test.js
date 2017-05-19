var assert = require('chai').assert;
var Jautocomplete = require('./index');

describe('Jautocomplete', function() {

    Jautocomplete.add([
        { word: 'せいねんがっぴ', transforms: ['生年月日'] },
        { word: 'きそうてんがい', transforms: ['奇想天外'] },
        { word: 'いらっとくる', transforms: ['イラッとくる'] },
        { word: 'たべる', transforms: ['食べる'] },
        { word: 'しんじゅく らんち', transforms: ['新宿 ランチ'] },
        { word: 'I love JavaScript!' },
        { word: 'I love beer ~' },
        { word: 'けーき', transforms: ['ケーキ'] },
        { word: 'あたらしい', transforms: ['新しい'] },
        { word: 'こうせいず' },
        { word: 'こうせい', transforms: ['構成', '厚生', '公正'] },
        { word: 'ざ・りんぐ', transforms: ['ザリング', 'ザ・リング'] },
        { word: 'てすと', transforms: ['test'] },
        { word: 'こうせいねんきん', transforms: ['厚生年金'] },
    ]);

    describe('Add', function() {

        let wordCount = Jautocomplete.wordCount;

        it('should do nothing if wordset is undefined, null or empty, i.e. []', function() {
            Jautocomplete.add(undefined);
            Jautocomplete.add(null);
            Jautocomplete.add([]);
            assert.equal(Jautocomplete.wordCount, wordCount);
        });

        it('should skip empty words, e.g. { word: \'\' }', function() {
            Jautocomplete.add([
                { word: '', transforms: [ 'foo' ] }
            ]);
            assert.equal(Jautocomplete.wordCount, wordCount);
        });

        it('should skip empty transforms, e.g. transforms: [ \'\', \'あり\' ]', function() {
            Jautocomplete.add([
                { word: 'foo', transforms: [ '', 'あり' ] }
            ]);
            assert.equal(Jautocomplete.wordCount, wordCount + 2);
        });

    });

    describe('Find', function() {

        it('should find English keyword (perfect match)', function() {
            let res = Jautocomplete.find('I love JavaScript!');
            assert.equal(res[0], 'I love JavaScript!');
        });

        it('should find English keywords (look ahead)', function() {
            let res = Jautocomplete.find('I love');
            assert.deepEqual(res.sort(), [ 'I love beer ~', 'I love JavaScript!' ].sort());
        });

        it('should find Japanese keyword (perfect match)', function() {
            let res = Jautocomplete.find('せいねんがっぴ');
            assert.equal(res[0], '生年月日');
        });

        it('should find Japanese keywords (look ahead)', function() {
            let res = Jautocomplete.find('こうせい');
            assert.deepEqual(res.sort(), [ '構成', '厚生', '公正', 'こうせいず', '厚生年金' ].sort());
        });

        it('should find no matches for an unknown keyword', function() {
            let res = Jautocomplete.find('ばんざい');
            assert.equal(res.length, 0);
        });

        it('should find no matches for an empty string', function() {
            let res = Jautocomplete.find('');
            assert.equal(res.length, 0);
        });

    });
});
