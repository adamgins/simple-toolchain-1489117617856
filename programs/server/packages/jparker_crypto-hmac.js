(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var CryptoJS = Package['jparker:crypto-core'].CryptoJS;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// packages/jparker_crypto-hmac/packages/jparker_crypto-hmac.js                                       //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                             //
// packages/jparker:crypto-hmac/lib/hmac.js                                                    //
//                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                               //
/*                                                                                             // 1
CryptoJS v3.1.2                                                                                // 2
code.google.com/p/crypto-js                                                                    // 3
(c) 2009-2013 by Jeff Mott. All rights reserved.                                               // 4
code.google.com/p/crypto-js/wiki/License                                                       // 5
*/                                                                                             // 6
(function () {                                                                                 // 7
    // Shortcuts                                                                               // 8
    var C = CryptoJS;                                                                          // 9
    var C_lib = C.lib;                                                                         // 10
    var Base = C_lib.Base;                                                                     // 11
    var C_enc = C.enc;                                                                         // 12
    var Utf8 = C_enc.Utf8;                                                                     // 13
    var C_algo = C.algo;                                                                       // 14
                                                                                               // 15
    /**                                                                                        // 16
     * HMAC algorithm.                                                                         // 17
     */                                                                                        // 18
    var HMAC = C_algo.HMAC = Base.extend({                                                     // 19
        /**                                                                                    // 20
         * Initializes a newly created HMAC.                                                   // 21
         *                                                                                     // 22
         * @param {Hasher} hasher The hash algorithm to use.                                   // 23
         * @param {WordArray|string} key The secret key.                                       // 24
         *                                                                                     // 25
         * @example                                                                            // 26
         *                                                                                     // 27
         *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);          // 28
         */                                                                                    // 29
        init: function (hasher, key) {                                                         // 30
            // Init hasher                                                                     // 31
            hasher = this._hasher = new hasher.init();                                         // 32
                                                                                               // 33
            // Convert string to WordArray, else assume WordArray already                      // 34
            if (typeof key == 'string') {                                                      // 35
                key = Utf8.parse(key);                                                         // 36
            }                                                                                  // 37
                                                                                               // 38
            // Shortcuts                                                                       // 39
            var hasherBlockSize = hasher.blockSize;                                            // 40
            var hasherBlockSizeBytes = hasherBlockSize * 4;                                    // 41
                                                                                               // 42
            // Allow arbitrary length keys                                                     // 43
            if (key.sigBytes > hasherBlockSizeBytes) {                                         // 44
                key = hasher.finalize(key);                                                    // 45
            }                                                                                  // 46
                                                                                               // 47
            // Clamp excess bits                                                               // 48
            key.clamp();                                                                       // 49
                                                                                               // 50
            // Clone key for inner and outer pads                                              // 51
            var oKey = this._oKey = key.clone();                                               // 52
            var iKey = this._iKey = key.clone();                                               // 53
                                                                                               // 54
            // Shortcuts                                                                       // 55
            var oKeyWords = oKey.words;                                                        // 56
            var iKeyWords = iKey.words;                                                        // 57
                                                                                               // 58
            // XOR keys with pad constants                                                     // 59
            for (var i = 0; i < hasherBlockSize; i++) {                                        // 60
                oKeyWords[i] ^= 0x5c5c5c5c;                                                    // 61
                iKeyWords[i] ^= 0x36363636;                                                    // 62
            }                                                                                  // 63
            oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes;                              // 64
                                                                                               // 65
            // Set initial values                                                              // 66
            this.reset();                                                                      // 67
        },                                                                                     // 68
                                                                                               // 69
        /**                                                                                    // 70
         * Resets this HMAC to its initial state.                                              // 71
         *                                                                                     // 72
         * @example                                                                            // 73
         *                                                                                     // 74
         *     hmacHasher.reset();                                                             // 75
         */                                                                                    // 76
        reset: function () {                                                                   // 77
            // Shortcut                                                                        // 78
            var hasher = this._hasher;                                                         // 79
                                                                                               // 80
            // Reset                                                                           // 81
            hasher.reset();                                                                    // 82
            hasher.update(this._iKey);                                                         // 83
        },                                                                                     // 84
                                                                                               // 85
        /**                                                                                    // 86
         * Updates this HMAC with a message.                                                   // 87
         *                                                                                     // 88
         * @param {WordArray|string} messageUpdate The message to append.                      // 89
         *                                                                                     // 90
         * @return {HMAC} This HMAC instance.                                                  // 91
         *                                                                                     // 92
         * @example                                                                            // 93
         *                                                                                     // 94
         *     hmacHasher.update('message');                                                   // 95
         *     hmacHasher.update(wordArray);                                                   // 96
         */                                                                                    // 97
        update: function (messageUpdate) {                                                     // 98
            this._hasher.update(messageUpdate);                                                // 99
                                                                                               // 100
            // Chainable                                                                       // 101
            return this;                                                                       // 102
        },                                                                                     // 103
                                                                                               // 104
        /**                                                                                    // 105
         * Finalizes the HMAC computation.                                                     // 106
         * Note that the finalize operation is effectively a destructive, read-once operation. // 107
         *                                                                                     // 108
         * @param {WordArray|string} messageUpdate (Optional) A final message update.          // 109
         *                                                                                     // 110
         * @return {WordArray} The HMAC.                                                       // 111
         *                                                                                     // 112
         * @example                                                                            // 113
         *                                                                                     // 114
         *     var hmac = hmacHasher.finalize();                                               // 115
         *     var hmac = hmacHasher.finalize('message');                                      // 116
         *     var hmac = hmacHasher.finalize(wordArray);                                      // 117
         */                                                                                    // 118
        finalize: function (messageUpdate) {                                                   // 119
            // Shortcut                                                                        // 120
            var hasher = this._hasher;                                                         // 121
                                                                                               // 122
            // Compute HMAC                                                                    // 123
            var innerHash = hasher.finalize(messageUpdate);                                    // 124
            hasher.reset();                                                                    // 125
            var hmac = hasher.finalize(this._oKey.clone().concat(innerHash));                  // 126
                                                                                               // 127
            return hmac;                                                                       // 128
        }                                                                                      // 129
    });                                                                                        // 130
}());                                                                                          // 131
                                                                                               // 132
/////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);

////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['jparker:crypto-hmac'] = {};

})();
