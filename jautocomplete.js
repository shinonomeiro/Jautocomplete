const Jautocomplete = (() => {

    function TrieNode() {
        this.isLeaf = false;
        this.transforms = [];
        this.children = {};
    }

    const root = new TrieNode();

    let options = {
        limitAlpha: 5,
        limitKana: 3,
        limitKanji: 2
    }

    /*
    * [Public]
    * Set user-defined options
    */
    function config(opt) {
        options = Object.assign({}, options, opt);
    }

    /*
    * References:
    * http://jrgraphix.net/r/Unicode/3040-309F (Hiragana)
    * http://jrgraphix.net/r/Unicode/30A0-30FF (Katakana)
    */
    function _getKeyFromChar(c) {
        return c.charCodeAt(0);
    }

    function _getCharFromKey(k) {
        return String.fromCharCode(k);
    }

    function _merge(a1, a2) {
        return a1.concat(a2.filter(function(item) {
            return a1.indexOf(item) < 0;
        }));
    }

    function _add(word) {
        let node = root;

        for (let i = 0; i < word.length; i++) {
            let key = _getKeyFromChar(word[i]);

            if (!node.children[key]) {
                node.children[key] = new TrieNode();
            }

            node = node.children[key];
        }

        if (!node.isLeaf) {
            node.isLeaf = true;
            Jautocomplete.wordCount++;
        }

        // Return leaf node
        return node;
    }

    /*
    * [Public]
    * Adds a new entry to the trie
    */
    function add(words) {
        if (!words) {
            return;
        }

        words.forEach(e => {
            let word = e.word;

            if (!word) {
                return;
            }

            // Filter out empty transforms
            let transforms = e.transforms ? e.transforms.filter(w => !!w) : [];

            // Add word to the trie
            let leaf = _add(word);

            if (transforms.length > 0) {
                // This word has transforms: append them to the list
                leaf.transforms = _merge(leaf.transforms, transforms);

                // Add each of them to the trie as well
                transforms.forEach(w => {
                    let c = _add(w);
                    // Add itself as a transform
                    c.transforms = _merge(c.transforms, [ w ]);
                });

            } else {
                // This word doesn't have transforms: add itself as a transform
                leaf.transforms = _merge(leaf.transforms, [ word ]);
            }
        });
    }

    /*
    * [Public]
    * Lookahead for potential matches starting with prefix
    * Returns an array of suggestions, empty if none
    */
    function find(prefix) {
        let matches = [];

        if (!prefix) {
            return matches;
        }

        let current = root;

        for (let i = 0; i < prefix.length; i++) {
            let j = _getKeyFromChar(prefix[i]);

            if (!current.children[j]) {
                return matches;
            }

            current = current.children[j];
        }

        let limit; // How far the lookahead should proceed

        if (/^[\x00-\x7F]+$/.test(prefix)) {
            // prefix is ASCII only
            limit = options.limitAlpha;
        } else if (/^[\u3040-\u30FF]+$/.test(prefix)) {
            // prefix is hiragana/katakana only
            limit = options.limitKana;
        } else {
            // prefix is likely to be kanjis or a mix
            limit = options.limitKanji;
        }

        (function lookAhead(str, node) {
            if (node.isLeaf) {
                node.transforms.forEach(w =>　matches = _merge(matches, [w]));
            }

            if (str.length - prefix.length <= limit) {
                for (let k in node.children) {
                    lookAhead(str + _getCharFromKey(k), node.children[k]);
                }
            }

        })(prefix, current);

        return matches;
    }

    /*
    * Returns public API
    */
    return {
        config,
        add,
        find
    };

})();

Jautocomplete.wordCount = 0;

// Interface for use as a web worker

onmessage = e => {
    var msg = e.data;

    switch (msg.action) {
        case 'CONFIG':
            Jautocomplete.config(msg.options);
            break;
        case 'ADD':
            Jautocomplete.add(msg.words);
            break;
        case 'FIND':
            postMessage(Jautocomplete.find(msg.prefix));
            break;
    }
};

// Export as module if modules are supported on current platform

if (typeof exports !== 'undefined') {

    if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = Jautocomplete;
    }
}
