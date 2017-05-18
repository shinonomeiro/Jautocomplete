# Jautocomplete
Japanese-optimized autocompletion library for JavaScript.

The library may be imported into your project by navigating to the <i>build</i> folder and downloading <i>jautocomplete.js</i>.

## Public API
The public API exposes these two functions: <i>add</i> and <i>find</i>.

### Jautocomplete.add( words: Array )
Adds an array of words to Jautocomplete. Data must be of the following format:

```javascript
var words = [
  { word: 'こうせい', transforms: ['構成', '厚生'] },
  { word: 'こうせいねんきん', transforms: ['厚生年金'] },
  { word: 'けーき', transforms: ['ケーキ'] },
  { word: 'みなとみらいえき', transforms: ['みなとみらい駅'] },
  { word: 'いけぶくろ らんち', transforms: ['池袋 ランチ'] },
  { word: 'まとめる' }
  { word: 'I love JavaScript' }
];

Jautocomplete.add(words);
```
Transforms may be omitted if the keyword is identical to the suggestion, as it is the case with hiragana-only or alphabet words.

<i>word</i> <b>MUST</b> be hiragana or alphabet characters, but transforms can theoretically be anything, although kanji conversions from the associated furiganas are much preferred (as one would obtain from 自動変換, IME's auto-conversion).

This function doesn't return anything.

### Jautocomplete.find( prefix: String ) : Array
Looks ahead for potential matches with keywords starting with <i>prefix</i>.

```javascript
var res = Jautocomplete.find('こうせい');
console.log(res); // ['構成', '厚生'], or [] if there was no match.
```

## Todo
- Support for Node.js / Browserify (through npm) and Bower.
- Custom sorting? Weight system?