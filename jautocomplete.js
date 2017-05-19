const Jautocomplete = (() => {

    function TrieNode() {
        this.isLeaf = false;
        this.transforms = [];
        this.children = {};
    }

    const root = new TrieNode();
    let wordCount = 0;

    /*
    * References:
    * http://jrgraphix.net/r/Unicode/3040-309F (Hiragana)
    * http://jrgraphix.net/r/Unicode/30A0-30FF (Katakana)
    */
    function getKeyFromChar(c) {
        return c.charCodeAt(0);
    }

    function getCharFromKey(k) {
        return String.fromCharCode(k);
    }

    function _add(word) {
        let node = root;

        for (let i = 0; i < word.length; i++) {
            let key = getKeyFromChar(word[i]);

            if (!node.children[key]) {
                node.children[key] = new TrieNode();
            }

            node = node.children[key];
        }

        node.isLeaf = true;

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
            this.wordCount++;

            if (transforms && transforms.length > 0) {
                // This word has transforms: append them to the list
                leaf.transforms = leaf.transforms.concat(transforms);

                // Add each of them to the trie as well
                transforms.forEach(w => {
                    let c = _add(w);
                    this.wordCount++;

                    // Add itself as a transform
                    c.transforms = c.transforms.concat(w);
                });

            } else {
                // This word doesn't have transforms: add itself as a transform
                leaf.transforms = leaf.transforms.concat(word);
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
            let j = getKeyFromChar(prefix[i]);

            if (!current.children[j]) {
                return matches;
            }

            current = current.children[j];
        }

        (function lookAhead(str, node) {
            if (node.isLeaf) {
                node.transforms.forEach(w => matches.push(w));
            }

            for (let k in node.children) {
                lookAhead(str + getCharFromKey(k), node.children[k]);
            }

        })(prefix, current);

        return matches;
    }

    /*
    * Returns public API
    */
    return {
        add,
        find,
        wordCount // Exposed for testing, should not be used in actual production code!
    };

})();

// Export as module if modules are supported on current platform

if (typeof exports !== 'undefined') {

    if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = Jautocomplete;
    }
}
