# Jautocomplete
JavaScript autocompletion library optimized for Japanese input.

The library may be imported into your project by navigating to the <i>build</i> folder and downloading <i>jautocomplete.js</i>.

## Demo
Demo running at https://shinonomeiro.github.io/jautocomplete/.<br>
Sample data: Japanese train station names (up to た) and random a-z English words.

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
<i>transforms</i> <b>MAY</b> be omitted if the keyword is identical to the suggestion, as it is the case with hiragana-only or alphabet words.

<i>word</i> <b>MUST</b> be hiragana or alphabet characters (with the exception of ー long bar), but transforms can theoretically be anything, although kanji conversions from the associated furiganas are much preferred (as one would obtain from 自動変換, IME's auto-conversion).

This function has no return value.

### Jautocomplete.find( prefix: String ) : Array
Looks ahead for potential matches with keywords starting with <i>prefix</i>.

```javascript
var res = Jautocomplete.find('こうせい');
console.log(res);
```

Returns ['構成', '厚生', '厚生年金'], or [] if there was no match.

## Todo
- Support for Node.js / Browserify (through npm) and Bower.
- Custom sorting? Weight system?
