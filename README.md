# Jautocomplete
A lightweight JavaScript autocompletion library optimized for Japanese input. Can be used as a pure front-end alternative to AJAX calls to a back-end database.

## Demo
Demo running at https://shinonomeiro.github.io/jautocomplete/.<br>
Sample dataset: Japanese train station names (up to た) and random a-z English words.

## Installation
#### Browser
The library may be imported onto your webpage by copying <i>jautocomplete.js</i> from the <i>build</i> folder to your project and linking to it with \<script\> tags.

```html
<script src="/path/to/js/jautocomplete.js"></script>
```

#### NPM
WIP

## Usage
The public API exposes three functions: <i>config</i>, <i>add</i> and <i>find</i>.

### Jautocomplete.config( opt: Object )
Sets custom options for the engine.<br>
Below are the currently available options and their default values:

```javascript
{
 limitAlpha: 5, // if search is alphabet, look ahead up to 5 characters
 limitKana: 4, // if search is hiragana / katakana, look ahead up to 4 characters
 limitKanji: 3 // if search is kanji and/or mixed, look ahead up to 3 characters
}
```

These default values should be sufficient for most implementations, but you may tweak them at will to satisfy your accuracy and performance requirements.

```javascript
Jautocomplete.config({ limitKana: 10 });
```

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

<i>word</i> <b>MUST</b> be hiragana or alphabet characters (with the exception of ー long bar and punctuation such as ・), but transforms can theoretically be anything, although kanji conversions from the associated furiganas are much preferred (as one would obtain from 自動変換, IME's auto-conversion). The accuracy of subsequent queries highly depends on your input dataset so be consistent. 

<i>transforms</i> <b>MAY</b> be omitted if the keyword is identical to the suggestion, as it is the case with hiragana-only or alphabet words.

<b>Important:</b> This library has no opinion over character case (upper or lower) or space width (full or half) and will register entries as-is. As mentioned above, accuracy tuning all depends on your dataset and you may have to implement lowercasing and/or other text formatting logic on the front-end if required before feeding user input to <i>find</i>.

This function has no return value. Also, empty words and transforms will be silently ignored.

```javascript
{ word: '', transforms: [ '無視' ] } // Ignored
{ word: 'むし', transforms: [ '' ] } // Ignored
// First transform ignored but 'むし' and '無視しないで' will be processed normally
{ word: 'むし', transforms: [ '', '無視しないで' ] }
```

### Jautocomplete.find( prefix: String ) : Array
Looks ahead for potential matches with keywords starting with <i>prefix</i>.

```javascript
var res = Jautocomplete.find('こうせい');
console.log(res); // ['構成', '厚生', '厚生年金'], or [] if there was no match.
```

Returns an array of matches, empty if none. Passing an empty string will yield an empty array as well.

Adding an existing keyword with different transforms appends those transforms to the existing ones.

```javascript
words = [
  { word: 'こうせい', transforms: ['公正', '校正'] }
];

Jautocomplete.add(words);

res = Jautocomplete.find('こうせい');
console.log(res); // ['構成', '厚生', '厚生年金', '公正', '校正']
```

## Notes
- Support for Japanese partial lookups not supported and won't be anytime soon, e.g. "新宿ぎょ" will not yield "新宿御苑" but "しんじゅくぎょ" will. This involves some heavy modifications in the register and look-ahead logic I'll leave this as a future task (or if anyone's willing to implement it, pull requests are welcome :)).
- Support for alphabet partial lookups not supported as of yet, e.g. "invrtbr" will not yield "invertebrates" as Google does. I might add it in the future if I come up with a good implementation. Also, 'oops, I forgot to turn off IME' kind of inputs—e.g. 'cおおkぱd' for 'cookpad'—are not supported at this point.
- The engine will yield all possible matches for a given prefix up to a configurable limit, and the list could be quite long if you fed it a lot of data, a high limit and a short prefix to work with. At the moment filtering and sorting results are left to your discretion (see Todos below). Fine-tune the limits to suit your needs.
- This is a library, and as such, no UI logic is provided on this repository. The demo is purely, uh, for demonstration purposes and is only a basic usage showcase. You will have to implement the UI yourself.
- Lookups are synchronous.

## Tests
Tests can be run with `npm test` from the command line prompt.

## Todo
- Support for Node.js / Browserify (through npm) and Bower.
- Custom sorting? Weight values?

## Issues
Please feel free to leave issues and bug reports in the related section.
