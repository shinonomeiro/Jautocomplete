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
        { word: 'こうせいねんきん', transforms: ['厚生年金'] }
    ]);

    it('should find English keyword (perfect match)', function() {
        let res = Jautocomplete.find('I love JavaScript');
        assert.equal(res.length, 1);
        assert.deepEqual(res, [ 'I love JavaScript!' ]);
    });

    it('should find English keywords (look ahead)', function() {
        let res = Jautocomplete.find('I love');
        assert.equal(res.length, 2);
        assert.deepEqual(res, [ 'I love beer ~', 'I love JavaScript!' ]);
    });

    it('should find Japanese keyword (perfect match)', function() {
        let res = Jautocomplete.find('せいねんがっぴ');
        assert.equal(res.length, 1);
        assert.deepEqual(res, [ '生年月日' ]);
    });

    it('should find Japanese keywords (look ahead)', function() {
        let res = Jautocomplete.find('こうせい');
        assert.equal(res.length, 5);
        assert.deepEqual(res, [ '構成', '厚生', '公正', 'こうせいず', '厚生年金' ]);
    });

    it('should find no matches for an unregistered keyword', function() {
        let res = Jautocomplete.find('ばんざい');
        assert.equal(res.length, 0);
        assert.deepEqual(res, []);
    });
});
