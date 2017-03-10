(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var CryptoJS = Package['jparker:crypto-core'].CryptoJS;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/jparker_crypto-sha256/packages/jparker_crypto-sha256.js                                                //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/jparker:crypto-sha256/lib/sha256.js                                                             //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                            //
/*                                                                                                          // 1
CryptoJS v3.1.2                                                                                             // 2
code.google.com/p/crypto-js                                                                                 // 3
(c) 2009-2013 by Jeff Mott. All rights reserved.                                                            // 4
code.google.com/p/crypto-js/wiki/License                                                                    // 5
*/                                                                                                          // 6
(function (Math) {                                                                                          // 7
    // Shortcuts                                                                                            // 8
    var C = CryptoJS;                                                                                       // 9
    var C_lib = C.lib;                                                                                      // 10
    var WordArray = C_lib.WordArray;                                                                        // 11
    var Hasher = C_lib.Hasher;                                                                              // 12
    var C_algo = C.algo;                                                                                    // 13
                                                                                                            // 14
    // Initialization and round constants tables                                                            // 15
    var H = [];                                                                                             // 16
    var K = [];                                                                                             // 17
                                                                                                            // 18
    // Compute constants                                                                                    // 19
    (function () {                                                                                          // 20
        function isPrime(n) {                                                                               // 21
            var sqrtN = Math.sqrt(n);                                                                       // 22
            for (var factor = 2; factor <= sqrtN; factor++) {                                               // 23
                if (!(n % factor)) {                                                                        // 24
                    return false;                                                                           // 25
                }                                                                                           // 26
            }                                                                                               // 27
                                                                                                            // 28
            return true;                                                                                    // 29
        }                                                                                                   // 30
                                                                                                            // 31
        function getFractionalBits(n) {                                                                     // 32
            return ((n - (n | 0)) * 0x100000000) | 0;                                                       // 33
        }                                                                                                   // 34
                                                                                                            // 35
        var n = 2;                                                                                          // 36
        var nPrime = 0;                                                                                     // 37
        while (nPrime < 64) {                                                                               // 38
            if (isPrime(n)) {                                                                               // 39
                if (nPrime < 8) {                                                                           // 40
                    H[nPrime] = getFractionalBits(Math.pow(n, 1 / 2));                                      // 41
                }                                                                                           // 42
                K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));                                          // 43
                                                                                                            // 44
                nPrime++;                                                                                   // 45
            }                                                                                               // 46
                                                                                                            // 47
            n++;                                                                                            // 48
        }                                                                                                   // 49
    }());                                                                                                   // 50
                                                                                                            // 51
    // Reusable object                                                                                      // 52
    var W = [];                                                                                             // 53
                                                                                                            // 54
    /**                                                                                                     // 55
     * SHA-256 hash algorithm.                                                                              // 56
     */                                                                                                     // 57
    var SHA256 = C_algo.SHA256 = Hasher.extend({                                                            // 58
        _doReset: function () {                                                                             // 59
            this._hash = new WordArray.init(H.slice(0));                                                    // 60
        },                                                                                                  // 61
                                                                                                            // 62
        _doProcessBlock: function (M, offset) {                                                             // 63
            // Shortcut                                                                                     // 64
            var H = this._hash.words;                                                                       // 65
                                                                                                            // 66
            // Working variables                                                                            // 67
            var a = H[0];                                                                                   // 68
            var b = H[1];                                                                                   // 69
            var c = H[2];                                                                                   // 70
            var d = H[3];                                                                                   // 71
            var e = H[4];                                                                                   // 72
            var f = H[5];                                                                                   // 73
            var g = H[6];                                                                                   // 74
            var h = H[7];                                                                                   // 75
                                                                                                            // 76
            // Computation                                                                                  // 77
            for (var i = 0; i < 64; i++) {                                                                  // 78
                if (i < 16) {                                                                               // 79
                    W[i] = M[offset + i] | 0;                                                               // 80
                } else {                                                                                    // 81
                    var gamma0x = W[i - 15];                                                                // 82
                    var gamma0  = ((gamma0x << 25) | (gamma0x >>> 7))  ^                                    // 83
                                  ((gamma0x << 14) | (gamma0x >>> 18)) ^                                    // 84
                                   (gamma0x >>> 3);                                                         // 85
                                                                                                            // 86
                    var gamma1x = W[i - 2];                                                                 // 87
                    var gamma1  = ((gamma1x << 15) | (gamma1x >>> 17)) ^                                    // 88
                                  ((gamma1x << 13) | (gamma1x >>> 19)) ^                                    // 89
                                   (gamma1x >>> 10);                                                        // 90
                                                                                                            // 91
                    W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];                                          // 92
                }                                                                                           // 93
                                                                                                            // 94
                var ch  = (e & f) ^ (~e & g);                                                               // 95
                var maj = (a & b) ^ (a & c) ^ (b & c);                                                      // 96
                                                                                                            // 97
                var sigma0 = ((a << 30) | (a >>> 2)) ^ ((a << 19) | (a >>> 13)) ^ ((a << 10) | (a >>> 22)); // 98
                var sigma1 = ((e << 26) | (e >>> 6)) ^ ((e << 21) | (e >>> 11)) ^ ((e << 7)  | (e >>> 25)); // 99
                                                                                                            // 100
                var t1 = h + sigma1 + ch + K[i] + W[i];                                                     // 101
                var t2 = sigma0 + maj;                                                                      // 102
                                                                                                            // 103
                h = g;                                                                                      // 104
                g = f;                                                                                      // 105
                f = e;                                                                                      // 106
                e = (d + t1) | 0;                                                                           // 107
                d = c;                                                                                      // 108
                c = b;                                                                                      // 109
                b = a;                                                                                      // 110
                a = (t1 + t2) | 0;                                                                          // 111
            }                                                                                               // 112
                                                                                                            // 113
            // Intermediate hash value                                                                      // 114
            H[0] = (H[0] + a) | 0;                                                                          // 115
            H[1] = (H[1] + b) | 0;                                                                          // 116
            H[2] = (H[2] + c) | 0;                                                                          // 117
            H[3] = (H[3] + d) | 0;                                                                          // 118
            H[4] = (H[4] + e) | 0;                                                                          // 119
            H[5] = (H[5] + f) | 0;                                                                          // 120
            H[6] = (H[6] + g) | 0;                                                                          // 121
            H[7] = (H[7] + h) | 0;                                                                          // 122
        },                                                                                                  // 123
                                                                                                            // 124
        _doFinalize: function () {                                                                          // 125
            // Shortcuts                                                                                    // 126
            var data = this._data;                                                                          // 127
            var dataWords = data.words;                                                                     // 128
                                                                                                            // 129
            var nBitsTotal = this._nDataBytes * 8;                                                          // 130
            var nBitsLeft = data.sigBytes * 8;                                                              // 131
                                                                                                            // 132
            // Add padding                                                                                  // 133
            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);                                    // 134
            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);         // 135
            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;                                   // 136
            data.sigBytes = dataWords.length * 4;                                                           // 137
                                                                                                            // 138
            // Hash final blocks                                                                            // 139
            this._process();                                                                                // 140
                                                                                                            // 141
            // Return final computed hash                                                                   // 142
            return this._hash;                                                                              // 143
        },                                                                                                  // 144
                                                                                                            // 145
        clone: function () {                                                                                // 146
            var clone = Hasher.clone.call(this);                                                            // 147
            clone._hash = this._hash.clone();                                                               // 148
                                                                                                            // 149
            return clone;                                                                                   // 150
        }                                                                                                   // 151
    });                                                                                                     // 152
                                                                                                            // 153
    /**                                                                                                     // 154
     * Shortcut function to the hasher's object interface.                                                  // 155
     *                                                                                                      // 156
     * @param {WordArray|string} message The message to hash.                                               // 157
     *                                                                                                      // 158
     * @return {WordArray} The hash.                                                                        // 159
     *                                                                                                      // 160
     * @static                                                                                              // 161
     *                                                                                                      // 162
     * @example                                                                                             // 163
     *                                                                                                      // 164
     *     var hash = CryptoJS.SHA256('message');                                                           // 165
     *     var hash = CryptoJS.SHA256(wordArray);                                                           // 166
     */                                                                                                     // 167
    C.SHA256 = Hasher._createHelper(SHA256);                                                                // 168
                                                                                                            // 169
    /**                                                                                                     // 170
     * Shortcut function to the HMAC's object interface.                                                    // 171
     *                                                                                                      // 172
     * @param {WordArray|string} message The message to hash.                                               // 173
     * @param {WordArray|string} key The secret key.                                                        // 174
     *                                                                                                      // 175
     * @return {WordArray} The HMAC.                                                                        // 176
     *                                                                                                      // 177
     * @static                                                                                              // 178
     *                                                                                                      // 179
     * @example                                                                                             // 180
     *                                                                                                      // 181
     *     var hmac = CryptoJS.HmacSHA256(message, key);                                                    // 182
     */                                                                                                     // 183
    C.HmacSHA256 = Hasher._createHmacHelper(SHA256);                                                        // 184
}(Math));                                                                                                   // 185
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['jparker:crypto-sha256'] = {};

})();
