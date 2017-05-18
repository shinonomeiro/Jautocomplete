# Jautocomplete
JavaScript autocompletion library optimized for Japanese input.

The library may be imported into your project by downloading <i>jautocomplete.js</i> from the <i>build</i> folder.

## Demo
Demo running at https://shinonomeiro.github.io/jautocomplete/.<br>
Sample dataset: Japanese train station names (up to た) and random a-z English words.

## Public API
The public API exposes two functions: <i>add</i> and <i>find</i>.

### Jautocomplete.add( words: Array )
Adds an array of words to Jautocomplete. Data must be of the following format:

```javascript
var words = [
  { word: 'こうせい', transforms: ['構成', '厚生'] },
  { word: 'こうせいねんきん', transforms: ['厚生年金'] },
  { word: 'けーき', transforms: ['ケーキ'] },
  { word: 'みなとみらいえき', transforms: ['みなとみらい駅'] },
  { word: 'いけぶくろ らんち', transforms: ['池袋 ランチ'] },
  // ▼ should only have one transform, both included here for completeness
  { word: 'ざ・りんぐ', transforms: ['ザリング', 'ザ・リング'] },
  { word: 'あまつさえ' }
  { word: 'I love JavaScript' }
];

Jautocomplete.add(words);
```

<i>word</i> <b>MUST</b> be hiragana or alphabet characters (with the exception of ー long bar or punctuation such as ・), but transforms can theoretically be anything, although kanji conversions from the associated furiganas are much preferred (as one would obtain from 自動変換, IME's auto-conversion). Spaces <b>SHOULD</b> be half-width.

<i>transforms</i> <b>MAY</b> be omitted if the keyword is identical to the suggestion, as it is the case with hiragana-only or alphabet words.

This function has no return value.

### Jautocomplete.find( prefix: String ) : Array
Looks ahead for potential matches with keywords starting with <i>prefix</i>.

```javascript
var res = Jautocomplete.find('こうせい');
console.log(res); // ['構成', '厚生', '厚生年金'], or [] if there was no match.
```

Returns an array of matches, empty if none.

## Notes
- Support for partial Japanese input not supported and won't be anytime soon. E.g. "新宿ぎょ" will not yield "新宿御苑", but "しんじゅくぎょ" will. In my opinion the trade-off between the added computation and code complexity, and the user experience is not really worth the pain of implementing it.
- Support for partial alphabet input not supported as of yet, e.g. "invrtbr" will not yield "invertebrates" as Google does. I might add it in the future if I come up with a good implementation, though as the library description suggests, it is more optimized for Japanese input. ご了承ください。
- The library yields all possible keywords for a given prefix, and the list could be quite long if you gave it a lot of entries and a short prefix to work with. As a sample, the demo page from above loads 5000 Japanese keywords (10,000 total if counting the transforms as well that auto-add themselves) plus 2500 English keywords. Filtering and/or sorting results is currently left to your discretion (see Todos below).
- Uppercase alphabet entries and prefixes will be forced to lowercase.

## Todo
- Support for Node.js / Browserify (through npm) and Bower.
- Custom sorting? Weight values?

## Issues
Please feel free to leave issues and bug reports in the related section.
