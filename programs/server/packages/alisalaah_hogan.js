(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;

/* Package-scope variables */
var key;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/alisalaah_hogan/packages/alisalaah_hogan.js                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/alisalaah:hogan/hogan-3-0-1.js                                                                          //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
/*!                                                                                                                 // 1
 *  Copyright 2011 Twitter, Inc.                                                                                    // 2
 *  Licensed under the Apache License, Version 2.0 (the "License");                                                 // 3
 *  you may not use this file except in compliance with the License.                                                // 4
 *  You may obtain a copy of the License at                                                                         // 5
 *                                                                                                                  // 6
 *  http://www.apache.org/licenses/LICENSE-2.0                                                                      // 7
 *                                                                                                                  // 8
 *  Unless required by applicable law or agreed to in writing, software                                             // 9
 *  distributed under the License is distributed on an "AS IS" BASIS,                                               // 10
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.                                        // 11
 *  See the License for the specific language governing permissions and                                             // 12
 *  limitations under the License.                                                                                  // 13
 */                                                                                                                 // 14
                                                                                                                    // 15
                                                                                                                    // 16
                                                                                                                    // 17
var Hogan = {};                                                                                                     // 18
                                                                                                                    // 19
(function (Hogan) {                                                                                                 // 20
  Hogan.Template = function (codeObj, text, compiler, options) {                                                    // 21
    codeObj = codeObj || {};                                                                                        // 22
    this.r = codeObj.code || this.r;                                                                                // 23
    this.c = compiler;                                                                                              // 24
    this.options = options || {};                                                                                   // 25
    this.text = text || '';                                                                                         // 26
    this.partials = codeObj.partials || {};                                                                         // 27
    this.subs = codeObj.subs || {};                                                                                 // 28
    this.buf = '';                                                                                                  // 29
  }                                                                                                                 // 30
                                                                                                                    // 31
  Hogan.Template.prototype = {                                                                                      // 32
    // render: replaced by generated code.                                                                          // 33
    r: function (context, partials, indent) { return ''; },                                                         // 34
                                                                                                                    // 35
    // variable escaping                                                                                            // 36
    v: hoganEscape,                                                                                                 // 37
                                                                                                                    // 38
    // triple stache                                                                                                // 39
    t: coerceToString,                                                                                              // 40
                                                                                                                    // 41
    render: function render(context, partials, indent) {                                                            // 42
      return this.ri([context], partials || {}, indent);                                                            // 43
    },                                                                                                              // 44
                                                                                                                    // 45
    // render internal -- a hook for overrides that catches partials too                                            // 46
    ri: function (context, partials, indent) {                                                                      // 47
      return this.r(context, partials, indent);                                                                     // 48
    },                                                                                                              // 49
                                                                                                                    // 50
    // ensurePartial                                                                                                // 51
    ep: function(symbol, partials) {                                                                                // 52
      var partial = this.partials[symbol];                                                                          // 53
                                                                                                                    // 54
      // check to see that if we've instantiated this partial before                                                // 55
      var template = partials[partial.name];                                                                        // 56
      if (partial.instance && partial.base == template) {                                                           // 57
        return partial.instance;                                                                                    // 58
      }                                                                                                             // 59
                                                                                                                    // 60
      if (typeof template == 'string') {                                                                            // 61
        if (!this.c) {                                                                                              // 62
          throw new Error("No compiler available.");                                                                // 63
        }                                                                                                           // 64
        template = this.c.compile(template, this.options);                                                          // 65
      }                                                                                                             // 66
                                                                                                                    // 67
      if (!template) {                                                                                              // 68
        return null;                                                                                                // 69
      }                                                                                                             // 70
                                                                                                                    // 71
      // We use this to check whether the partials dictionary has changed                                           // 72
      this.partials[symbol].base = template;                                                                        // 73
                                                                                                                    // 74
      if (partial.subs) {                                                                                           // 75
        // Make sure we consider parent template now                                                                // 76
        if (!partials.stackText) partials.stackText = {};                                                           // 77
        for (key in partial.subs) {                                                                                 // 78
          if (!partials.stackText[key]) {                                                                           // 79
            partials.stackText[key] = (this.activeSub !== undefined && partials.stackText[this.activeSub]) ? partials.stackText[this.activeSub] : this.text;
          }                                                                                                         // 81
        }                                                                                                           // 82
        template = createSpecializedPartial(template, partial.subs, partial.partials,                               // 83
          this.stackSubs, this.stackPartials, partials.stackText);                                                  // 84
      }                                                                                                             // 85
      this.partials[symbol].instance = template;                                                                    // 86
                                                                                                                    // 87
      return template;                                                                                              // 88
    },                                                                                                              // 89
                                                                                                                    // 90
    // tries to find a partial in the current scope and render it                                                   // 91
    rp: function(symbol, context, partials, indent) {                                                               // 92
      var partial = this.ep(symbol, partials);                                                                      // 93
      if (!partial) {                                                                                               // 94
        return '';                                                                                                  // 95
      }                                                                                                             // 96
                                                                                                                    // 97
      return partial.ri(context, partials, indent);                                                                 // 98
    },                                                                                                              // 99
                                                                                                                    // 100
    // render a section                                                                                             // 101
    rs: function(context, partials, section) {                                                                      // 102
      var tail = context[context.length - 1];                                                                       // 103
                                                                                                                    // 104
      if (!isArray(tail)) {                                                                                         // 105
        section(context, partials, this);                                                                           // 106
        return;                                                                                                     // 107
      }                                                                                                             // 108
                                                                                                                    // 109
      for (var i = 0; i < tail.length; i++) {                                                                       // 110
        context.push(tail[i]);                                                                                      // 111
        section(context, partials, this);                                                                           // 112
        context.pop();                                                                                              // 113
      }                                                                                                             // 114
    },                                                                                                              // 115
                                                                                                                    // 116
    // maybe start a section                                                                                        // 117
    s: function(val, ctx, partials, inverted, start, end, tags) {                                                   // 118
      var pass;                                                                                                     // 119
                                                                                                                    // 120
      if (isArray(val) && val.length === 0) {                                                                       // 121
        return false;                                                                                               // 122
      }                                                                                                             // 123
                                                                                                                    // 124
      if (typeof val == 'function') {                                                                               // 125
        val = this.ms(val, ctx, partials, inverted, start, end, tags);                                              // 126
      }                                                                                                             // 127
                                                                                                                    // 128
      pass = !!val;                                                                                                 // 129
                                                                                                                    // 130
      if (!inverted && pass && ctx) {                                                                               // 131
        ctx.push((typeof val == 'object') ? val : ctx[ctx.length - 1]);                                             // 132
      }                                                                                                             // 133
                                                                                                                    // 134
      return pass;                                                                                                  // 135
    },                                                                                                              // 136
                                                                                                                    // 137
    // find values with dotted names                                                                                // 138
    d: function(key, ctx, partials, returnFound) {                                                                  // 139
      var found,                                                                                                    // 140
          names = key.split('.'),                                                                                   // 141
          val = this.f(names[0], ctx, partials, returnFound),                                                       // 142
          doModelGet = this.options.modelGet,                                                                       // 143
          cx = null;                                                                                                // 144
                                                                                                                    // 145
      if (key === '.' && isArray(ctx[ctx.length - 2])) {                                                            // 146
        val = ctx[ctx.length - 1];                                                                                  // 147
      } else {                                                                                                      // 148
        for (var i = 1; i < names.length; i++) {                                                                    // 149
          found = findInScope(names[i], val, doModelGet);                                                           // 150
          if (found != null) {                                                                                      // 151
            cx = val;                                                                                               // 152
            val = found;                                                                                            // 153
          } else {                                                                                                  // 154
            val = '';                                                                                               // 155
          }                                                                                                         // 156
        }                                                                                                           // 157
      }                                                                                                             // 158
                                                                                                                    // 159
      if (returnFound && !val) {                                                                                    // 160
        return false;                                                                                               // 161
      }                                                                                                             // 162
                                                                                                                    // 163
      if (!returnFound && typeof val == 'function') {                                                               // 164
        ctx.push(cx);                                                                                               // 165
        val = this.mv(val, ctx, partials);                                                                          // 166
        ctx.pop();                                                                                                  // 167
      }                                                                                                             // 168
                                                                                                                    // 169
      return val;                                                                                                   // 170
    },                                                                                                              // 171
                                                                                                                    // 172
    // find values with normal names                                                                                // 173
    f: function(key, ctx, partials, returnFound) {                                                                  // 174
      var val = false,                                                                                              // 175
          v = null,                                                                                                 // 176
          found = false,                                                                                            // 177
          doModelGet = this.options.modelGet;                                                                       // 178
                                                                                                                    // 179
      for (var i = ctx.length - 1; i >= 0; i--) {                                                                   // 180
        v = ctx[i];                                                                                                 // 181
        val = findInScope(key, v, doModelGet);                                                                      // 182
        if (val != null) {                                                                                          // 183
          found = true;                                                                                             // 184
          break;                                                                                                    // 185
        }                                                                                                           // 186
      }                                                                                                             // 187
                                                                                                                    // 188
      if (!found) {                                                                                                 // 189
        return (returnFound) ? false : "";                                                                          // 190
      }                                                                                                             // 191
                                                                                                                    // 192
      if (!returnFound && typeof val == 'function') {                                                               // 193
        val = this.mv(val, ctx, partials);                                                                          // 194
      }                                                                                                             // 195
                                                                                                                    // 196
      return val;                                                                                                   // 197
    },                                                                                                              // 198
                                                                                                                    // 199
    // higher order templates                                                                                       // 200
    ls: function(func, cx, partials, text, tags) {                                                                  // 201
      var oldTags = this.options.delimiters;                                                                        // 202
                                                                                                                    // 203
      this.options.delimiters = tags;                                                                               // 204
      this.b(this.ct(coerceToString(func.call(cx, text)), cx, partials));                                           // 205
      this.options.delimiters = oldTags;                                                                            // 206
                                                                                                                    // 207
      return false;                                                                                                 // 208
    },                                                                                                              // 209
                                                                                                                    // 210
    // compile text                                                                                                 // 211
    ct: function(text, cx, partials) {                                                                              // 212
      if (this.options.disableLambda) {                                                                             // 213
        throw new Error('Lambda features disabled.');                                                               // 214
      }                                                                                                             // 215
      return this.c.compile(text, this.options).render(cx, partials);                                               // 216
    },                                                                                                              // 217
                                                                                                                    // 218
    // template result buffering                                                                                    // 219
    b: function(s) { this.buf += s; },                                                                              // 220
                                                                                                                    // 221
    fl: function() { var r = this.buf; this.buf = ''; return r; },                                                  // 222
                                                                                                                    // 223
    // method replace section                                                                                       // 224
    ms: function(func, ctx, partials, inverted, start, end, tags) {                                                 // 225
      var textSource,                                                                                               // 226
          cx = ctx[ctx.length - 1],                                                                                 // 227
          result = func.call(cx);                                                                                   // 228
                                                                                                                    // 229
      if (typeof result == 'function') {                                                                            // 230
        if (inverted) {                                                                                             // 231
          return true;                                                                                              // 232
        } else {                                                                                                    // 233
          textSource = (this.activeSub && this.subsText && this.subsText[this.activeSub]) ? this.subsText[this.activeSub] : this.text;
          return this.ls(result, cx, partials, textSource.substring(start, end), tags);                             // 235
        }                                                                                                           // 236
      }                                                                                                             // 237
                                                                                                                    // 238
      return result;                                                                                                // 239
    },                                                                                                              // 240
                                                                                                                    // 241
    // method replace variable                                                                                      // 242
    mv: function(func, ctx, partials) {                                                                             // 243
      var cx = ctx[ctx.length - 1];                                                                                 // 244
      var result = func.call(cx);                                                                                   // 245
                                                                                                                    // 246
      if (typeof result == 'function') {                                                                            // 247
        return this.ct(coerceToString(result.call(cx)), cx, partials);                                              // 248
      }                                                                                                             // 249
                                                                                                                    // 250
      return result;                                                                                                // 251
    },                                                                                                              // 252
                                                                                                                    // 253
    sub: function(name, context, partials, indent) {                                                                // 254
      var f = this.subs[name];                                                                                      // 255
      if (f) {                                                                                                      // 256
        this.activeSub = name;                                                                                      // 257
        f(context, partials, this, indent);                                                                         // 258
        this.activeSub = false;                                                                                     // 259
      }                                                                                                             // 260
    }                                                                                                               // 261
                                                                                                                    // 262
  };                                                                                                                // 263
                                                                                                                    // 264
  //Find a key in an object                                                                                         // 265
  function findInScope(key, scope, doModelGet) {                                                                    // 266
    var val, checkVal;                                                                                              // 267
                                                                                                                    // 268
    if (scope && typeof scope == 'object') {                                                                        // 269
                                                                                                                    // 270
      if (scope[key] != null) {                                                                                     // 271
        val = scope[key];                                                                                           // 272
                                                                                                                    // 273
      // try lookup with get for backbone or similar model data                                                     // 274
      } else if (doModelGet && scope.get && typeof scope.get == 'function') {                                       // 275
        val = scope.get(key);                                                                                       // 276
      }                                                                                                             // 277
    }                                                                                                               // 278
                                                                                                                    // 279
    return val;                                                                                                     // 280
  }                                                                                                                 // 281
                                                                                                                    // 282
  function createSpecializedPartial(instance, subs, partials, stackSubs, stackPartials, stackText) {                // 283
    function PartialTemplate() {};                                                                                  // 284
    PartialTemplate.prototype = instance;                                                                           // 285
    function Substitutions() {};                                                                                    // 286
    Substitutions.prototype = instance.subs;                                                                        // 287
    var key;                                                                                                        // 288
    var partial = new PartialTemplate();                                                                            // 289
    partial.subs = new Substitutions();                                                                             // 290
    partial.subsText = {};  //hehe. substext.                                                                       // 291
    partial.buf = '';                                                                                               // 292
                                                                                                                    // 293
    stackSubs = stackSubs || {};                                                                                    // 294
    partial.stackSubs = stackSubs;                                                                                  // 295
    partial.subsText = stackText;                                                                                   // 296
    for (key in subs) {                                                                                             // 297
      if (!stackSubs[key]) stackSubs[key] = subs[key];                                                              // 298
    }                                                                                                               // 299
    for (key in stackSubs) {                                                                                        // 300
      partial.subs[key] = stackSubs[key];                                                                           // 301
    }                                                                                                               // 302
                                                                                                                    // 303
    stackPartials = stackPartials || {};                                                                            // 304
    partial.stackPartials = stackPartials;                                                                          // 305
    for (key in partials) {                                                                                         // 306
      if (!stackPartials[key]) stackPartials[key] = partials[key];                                                  // 307
    }                                                                                                               // 308
    for (key in stackPartials) {                                                                                    // 309
      partial.partials[key] = stackPartials[key];                                                                   // 310
    }                                                                                                               // 311
                                                                                                                    // 312
    return partial;                                                                                                 // 313
  }                                                                                                                 // 314
                                                                                                                    // 315
  var rAmp = /&/g,                                                                                                  // 316
      rLt = /</g,                                                                                                   // 317
      rGt = />/g,                                                                                                   // 318
      rApos = /\'/g,                                                                                                // 319
      rQuot = /\"/g,                                                                                                // 320
      hChars = /[&<>\"\']/;                                                                                         // 321
                                                                                                                    // 322
  function coerceToString(val) {                                                                                    // 323
    return String((val === null || val === undefined) ? '' : val);                                                  // 324
  }                                                                                                                 // 325
                                                                                                                    // 326
  function hoganEscape(str) {                                                                                       // 327
    str = coerceToString(str);                                                                                      // 328
    return hChars.test(str) ?                                                                                       // 329
      str                                                                                                           // 330
        .replace(rAmp, '&amp;')                                                                                     // 331
        .replace(rLt, '&lt;')                                                                                       // 332
        .replace(rGt, '&gt;')                                                                                       // 333
        .replace(rApos, '&#39;')                                                                                    // 334
        .replace(rQuot, '&quot;') :                                                                                 // 335
      str;                                                                                                          // 336
  }                                                                                                                 // 337
                                                                                                                    // 338
  var isArray = Array.isArray || function(a) {                                                                      // 339
    return Object.prototype.toString.call(a) === '[object Array]';                                                  // 340
  };                                                                                                                // 341
                                                                                                                    // 342
})(typeof exports !== 'undefined' ? exports : Hogan);                                                               // 343
                                                                                                                    // 344
                                                                                                                    // 345
                                                                                                                    // 346
(function (Hogan) {                                                                                                 // 347
  // Setup regex  assignments                                                                                       // 348
  // remove whitespace according to Mustache spec                                                                   // 349
  var rIsWhitespace = /\S/,                                                                                         // 350
      rQuot = /\"/g,                                                                                                // 351
      rNewline =  /\n/g,                                                                                            // 352
      rCr = /\r/g,                                                                                                  // 353
      rSlash = /\\/g;                                                                                               // 354
                                                                                                                    // 355
  Hogan.tags = {                                                                                                    // 356
    '#': 1, '^': 2, '<': 3, '$': 4,                                                                                 // 357
    '/': 5, '!': 6, '>': 7, '=': 8, '_v': 9,                                                                        // 358
    '{': 10, '&': 11, '_t': 12                                                                                      // 359
  };                                                                                                                // 360
                                                                                                                    // 361
  Hogan.scan = function scan(text, delimiters) {                                                                    // 362
    var len = text.length,                                                                                          // 363
        IN_TEXT = 0,                                                                                                // 364
        IN_TAG_TYPE = 1,                                                                                            // 365
        IN_TAG = 2,                                                                                                 // 366
        state = IN_TEXT,                                                                                            // 367
        tagType = null,                                                                                             // 368
        tag = null,                                                                                                 // 369
        buf = '',                                                                                                   // 370
        tokens = [],                                                                                                // 371
        seenTag = false,                                                                                            // 372
        i = 0,                                                                                                      // 373
        lineStart = 0,                                                                                              // 374
        otag = '{{',                                                                                                // 375
        ctag = '}}';                                                                                                // 376
                                                                                                                    // 377
    function addBuf() {                                                                                             // 378
      if (buf.length > 0) {                                                                                         // 379
        tokens.push({tag: '_t', text: new String(buf)});                                                            // 380
        buf = '';                                                                                                   // 381
      }                                                                                                             // 382
    }                                                                                                               // 383
                                                                                                                    // 384
    function lineIsWhitespace() {                                                                                   // 385
      var isAllWhitespace = true;                                                                                   // 386
      for (var j = lineStart; j < tokens.length; j++) {                                                             // 387
        isAllWhitespace =                                                                                           // 388
          (Hogan.tags[tokens[j].tag] < Hogan.tags['_v']) ||                                                         // 389
          (tokens[j].tag == '_t' && tokens[j].text.match(rIsWhitespace) === null);                                  // 390
        if (!isAllWhitespace) {                                                                                     // 391
          return false;                                                                                             // 392
        }                                                                                                           // 393
      }                                                                                                             // 394
                                                                                                                    // 395
      return isAllWhitespace;                                                                                       // 396
    }                                                                                                               // 397
                                                                                                                    // 398
    function filterLine(haveSeenTag, noNewLine) {                                                                   // 399
      addBuf();                                                                                                     // 400
                                                                                                                    // 401
      if (haveSeenTag && lineIsWhitespace()) {                                                                      // 402
        for (var j = lineStart, next; j < tokens.length; j++) {                                                     // 403
          if (tokens[j].text) {                                                                                     // 404
            if ((next = tokens[j+1]) && next.tag == '>') {                                                          // 405
              // set indent to token value                                                                          // 406
              next.indent = tokens[j].text.toString()                                                               // 407
            }                                                                                                       // 408
            tokens.splice(j, 1);                                                                                    // 409
          }                                                                                                         // 410
        }                                                                                                           // 411
      } else if (!noNewLine) {                                                                                      // 412
        tokens.push({tag:'\n'});                                                                                    // 413
      }                                                                                                             // 414
                                                                                                                    // 415
      seenTag = false;                                                                                              // 416
      lineStart = tokens.length;                                                                                    // 417
    }                                                                                                               // 418
                                                                                                                    // 419
    function changeDelimiters(text, index) {                                                                        // 420
      var close = '=' + ctag,                                                                                       // 421
          closeIndex = text.indexOf(close, index),                                                                  // 422
          delimiters = trim(                                                                                        // 423
            text.substring(text.indexOf('=', index) + 1, closeIndex)                                                // 424
          ).split(' ');                                                                                             // 425
                                                                                                                    // 426
      otag = delimiters[0];                                                                                         // 427
      ctag = delimiters[delimiters.length - 1];                                                                     // 428
                                                                                                                    // 429
      return closeIndex + close.length - 1;                                                                         // 430
    }                                                                                                               // 431
                                                                                                                    // 432
    if (delimiters) {                                                                                               // 433
      delimiters = delimiters.split(' ');                                                                           // 434
      otag = delimiters[0];                                                                                         // 435
      ctag = delimiters[1];                                                                                         // 436
    }                                                                                                               // 437
                                                                                                                    // 438
    for (i = 0; i < len; i++) {                                                                                     // 439
      if (state == IN_TEXT) {                                                                                       // 440
        if (tagChange(otag, text, i)) {                                                                             // 441
          --i;                                                                                                      // 442
          addBuf();                                                                                                 // 443
          state = IN_TAG_TYPE;                                                                                      // 444
        } else {                                                                                                    // 445
          if (text.charAt(i) == '\n') {                                                                             // 446
            filterLine(seenTag);                                                                                    // 447
          } else {                                                                                                  // 448
            buf += text.charAt(i);                                                                                  // 449
          }                                                                                                         // 450
        }                                                                                                           // 451
      } else if (state == IN_TAG_TYPE) {                                                                            // 452
        i += otag.length - 1;                                                                                       // 453
        tag = Hogan.tags[text.charAt(i + 1)];                                                                       // 454
        tagType = tag ? text.charAt(i + 1) : '_v';                                                                  // 455
        if (tagType == '=') {                                                                                       // 456
          i = changeDelimiters(text, i);                                                                            // 457
          state = IN_TEXT;                                                                                          // 458
        } else {                                                                                                    // 459
          if (tag) {                                                                                                // 460
            i++;                                                                                                    // 461
          }                                                                                                         // 462
          state = IN_TAG;                                                                                           // 463
        }                                                                                                           // 464
        seenTag = i;                                                                                                // 465
      } else {                                                                                                      // 466
        if (tagChange(ctag, text, i)) {                                                                             // 467
          tokens.push({tag: tagType, n: trim(buf), otag: otag, ctag: ctag,                                          // 468
                       i: (tagType == '/') ? seenTag - otag.length : i + ctag.length});                             // 469
          buf = '';                                                                                                 // 470
          i += ctag.length - 1;                                                                                     // 471
          state = IN_TEXT;                                                                                          // 472
          if (tagType == '{') {                                                                                     // 473
            if (ctag == '}}') {                                                                                     // 474
              i++;                                                                                                  // 475
            } else {                                                                                                // 476
              cleanTripleStache(tokens[tokens.length - 1]);                                                         // 477
            }                                                                                                       // 478
          }                                                                                                         // 479
        } else {                                                                                                    // 480
          buf += text.charAt(i);                                                                                    // 481
        }                                                                                                           // 482
      }                                                                                                             // 483
    }                                                                                                               // 484
                                                                                                                    // 485
    filterLine(seenTag, true);                                                                                      // 486
                                                                                                                    // 487
    return tokens;                                                                                                  // 488
  }                                                                                                                 // 489
                                                                                                                    // 490
  function cleanTripleStache(token) {                                                                               // 491
    if (token.n.substr(token.n.length - 1) === '}') {                                                               // 492
      token.n = token.n.substring(0, token.n.length - 1);                                                           // 493
    }                                                                                                               // 494
  }                                                                                                                 // 495
                                                                                                                    // 496
  function trim(s) {                                                                                                // 497
    if (s.trim) {                                                                                                   // 498
      return s.trim();                                                                                              // 499
    }                                                                                                               // 500
                                                                                                                    // 501
    return s.replace(/^\s*|\s*$/g, '');                                                                             // 502
  }                                                                                                                 // 503
                                                                                                                    // 504
  function tagChange(tag, text, index) {                                                                            // 505
    if (text.charAt(index) != tag.charAt(0)) {                                                                      // 506
      return false;                                                                                                 // 507
    }                                                                                                               // 508
                                                                                                                    // 509
    for (var i = 1, l = tag.length; i < l; i++) {                                                                   // 510
      if (text.charAt(index + i) != tag.charAt(i)) {                                                                // 511
        return false;                                                                                               // 512
      }                                                                                                             // 513
    }                                                                                                               // 514
                                                                                                                    // 515
    return true;                                                                                                    // 516
  }                                                                                                                 // 517
                                                                                                                    // 518
  // the tags allowed inside super templates                                                                        // 519
  var allowedInSuper = {'_t': true, '\n': true, '$': true, '/': true};                                              // 520
                                                                                                                    // 521
  function buildTree(tokens, kind, stack, customTags) {                                                             // 522
    var instructions = [],                                                                                          // 523
        opener = null,                                                                                              // 524
        tail = null,                                                                                                // 525
        token = null;                                                                                               // 526
                                                                                                                    // 527
    tail = stack[stack.length - 1];                                                                                 // 528
                                                                                                                    // 529
    while (tokens.length > 0) {                                                                                     // 530
      token = tokens.shift();                                                                                       // 531
                                                                                                                    // 532
      if (tail && tail.tag == '<' && !(token.tag in allowedInSuper)) {                                              // 533
        throw new Error('Illegal content in < super tag.');                                                         // 534
      }                                                                                                             // 535
                                                                                                                    // 536
      if (Hogan.tags[token.tag] <= Hogan.tags['$'] || isOpener(token, customTags)) {                                // 537
        stack.push(token);                                                                                          // 538
        token.nodes = buildTree(tokens, token.tag, stack, customTags);                                              // 539
      } else if (token.tag == '/') {                                                                                // 540
        if (stack.length === 0) {                                                                                   // 541
          throw new Error('Closing tag without opener: /' + token.n);                                               // 542
        }                                                                                                           // 543
        opener = stack.pop();                                                                                       // 544
        if (token.n != opener.n && !isCloser(token.n, opener.n, customTags)) {                                      // 545
          throw new Error('Nesting error: ' + opener.n + ' vs. ' + token.n);                                        // 546
        }                                                                                                           // 547
        opener.end = token.i;                                                                                       // 548
        return instructions;                                                                                        // 549
      } else if (token.tag == '\n') {                                                                               // 550
        token.last = (tokens.length == 0) || (tokens[0].tag == '\n');                                               // 551
      }                                                                                                             // 552
                                                                                                                    // 553
      instructions.push(token);                                                                                     // 554
    }                                                                                                               // 555
                                                                                                                    // 556
    if (stack.length > 0) {                                                                                         // 557
      throw new Error('missing closing tag: ' + stack.pop().n);                                                     // 558
    }                                                                                                               // 559
                                                                                                                    // 560
    return instructions;                                                                                            // 561
  }                                                                                                                 // 562
                                                                                                                    // 563
  function isOpener(token, tags) {                                                                                  // 564
    for (var i = 0, l = tags.length; i < l; i++) {                                                                  // 565
      if (tags[i].o == token.n) {                                                                                   // 566
        token.tag = '#';                                                                                            // 567
        return true;                                                                                                // 568
      }                                                                                                             // 569
    }                                                                                                               // 570
  }                                                                                                                 // 571
                                                                                                                    // 572
  function isCloser(close, open, tags) {                                                                            // 573
    for (var i = 0, l = tags.length; i < l; i++) {                                                                  // 574
      if (tags[i].c == close && tags[i].o == open) {                                                                // 575
        return true;                                                                                                // 576
      }                                                                                                             // 577
    }                                                                                                               // 578
  }                                                                                                                 // 579
                                                                                                                    // 580
  function stringifySubstitutions(obj) {                                                                            // 581
    var items = [];                                                                                                 // 582
    for (var key in obj) {                                                                                          // 583
      items.push('"' + esc(key) + '": function(c,p,t,i) {' + obj[key] + '}');                                       // 584
    }                                                                                                               // 585
    return "{ " + items.join(",") + " }";                                                                           // 586
  }                                                                                                                 // 587
                                                                                                                    // 588
  function stringifyPartials(codeObj) {                                                                             // 589
    var partials = [];                                                                                              // 590
    for (var key in codeObj.partials) {                                                                             // 591
      partials.push('"' + esc(key) + '":{name:"' + esc(codeObj.partials[key].name) + '", ' + stringifyPartials(codeObj.partials[key]) + "}");
    }                                                                                                               // 593
    return "partials: {" + partials.join(",") + "}, subs: " + stringifySubstitutions(codeObj.subs);                 // 594
  }                                                                                                                 // 595
                                                                                                                    // 596
  Hogan.stringify = function(codeObj, text, options) {                                                              // 597
    return "{code: function (c,p,i) { " + Hogan.wrapMain(codeObj.code) + " }," + stringifyPartials(codeObj) +  "}"; // 598
  }                                                                                                                 // 599
                                                                                                                    // 600
  var serialNo = 0;                                                                                                 // 601
  Hogan.generate = function(tree, text, options) {                                                                  // 602
    serialNo = 0;                                                                                                   // 603
    var context = { code: '', subs: {}, partials: {} };                                                             // 604
    Hogan.walk(tree, context);                                                                                      // 605
                                                                                                                    // 606
    if (options.asString) {                                                                                         // 607
      return this.stringify(context, text, options);                                                                // 608
    }                                                                                                               // 609
                                                                                                                    // 610
    return this.makeTemplate(context, text, options);                                                               // 611
  }                                                                                                                 // 612
                                                                                                                    // 613
  Hogan.wrapMain = function(code) {                                                                                 // 614
    return 'var t=this;t.b(i=i||"");' + code + 'return t.fl();';                                                    // 615
  }                                                                                                                 // 616
                                                                                                                    // 617
  Hogan.template = Hogan.Template;                                                                                  // 618
                                                                                                                    // 619
  Hogan.makeTemplate = function(codeObj, text, options) {                                                           // 620
    var template = this.makePartials(codeObj);                                                                      // 621
    template.code = new Function('c', 'p', 'i', this.wrapMain(codeObj.code));                                       // 622
    return new this.template(template, text, this, options);                                                        // 623
  }                                                                                                                 // 624
                                                                                                                    // 625
  Hogan.makePartials = function(codeObj) {                                                                          // 626
    var key, template = {subs: {}, partials: codeObj.partials, name: codeObj.name};                                 // 627
    for (key in template.partials) {                                                                                // 628
      template.partials[key] = this.makePartials(template.partials[key]);                                           // 629
    }                                                                                                               // 630
    for (key in codeObj.subs) {                                                                                     // 631
      template.subs[key] = new Function('c', 'p', 't', 'i', codeObj.subs[key]);                                     // 632
    }                                                                                                               // 633
    return template;                                                                                                // 634
  }                                                                                                                 // 635
                                                                                                                    // 636
  function esc(s) {                                                                                                 // 637
    return s.replace(rSlash, '\\\\')                                                                                // 638
            .replace(rQuot, '\\\"')                                                                                 // 639
            .replace(rNewline, '\\n')                                                                               // 640
            .replace(rCr, '\\r');                                                                                   // 641
  }                                                                                                                 // 642
                                                                                                                    // 643
  function chooseMethod(s) {                                                                                        // 644
    return (~s.indexOf('.')) ? 'd' : 'f';                                                                           // 645
  }                                                                                                                 // 646
                                                                                                                    // 647
  function createPartial(node, context) {                                                                           // 648
    var prefix = "<" + (context.prefix || "");                                                                      // 649
    var sym = prefix + node.n + serialNo++;                                                                         // 650
    context.partials[sym] = {name: node.n, partials: {}};                                                           // 651
    context.code += 't.b(t.rp("' +  esc(sym) + '",c,p,"' + (node.indent || '') + '"));';                            // 652
    return sym;                                                                                                     // 653
  }                                                                                                                 // 654
                                                                                                                    // 655
  Hogan.codegen = {                                                                                                 // 656
    '#': function(node, context) {                                                                                  // 657
      context.code += 'if(t.s(t.' + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,1),' +                       // 658
                      'c,p,0,' + node.i + ',' + node.end + ',"' + node.otag + " " + node.ctag + '")){' +            // 659
                      't.rs(c,p,' + 'function(c,p,t){';                                                             // 660
      Hogan.walk(node.nodes, context);                                                                              // 661
      context.code += '});c.pop();}';                                                                               // 662
    },                                                                                                              // 663
                                                                                                                    // 664
    '^': function(node, context) {                                                                                  // 665
      context.code += 'if(!t.s(t.' + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,1),c,p,1,0,0,"")){';        // 666
      Hogan.walk(node.nodes, context);                                                                              // 667
      context.code += '};';                                                                                         // 668
    },                                                                                                              // 669
                                                                                                                    // 670
    '>': createPartial,                                                                                             // 671
    '<': function(node, context) {                                                                                  // 672
      var ctx = {partials: {}, code: '', subs: {}, inPartial: true};                                                // 673
      Hogan.walk(node.nodes, ctx);                                                                                  // 674
      var template = context.partials[createPartial(node, context)];                                                // 675
      template.subs = ctx.subs;                                                                                     // 676
      template.partials = ctx.partials;                                                                             // 677
    },                                                                                                              // 678
                                                                                                                    // 679
    '$': function(node, context) {                                                                                  // 680
      var ctx = {subs: {}, code: '', partials: context.partials, prefix: node.n};                                   // 681
      Hogan.walk(node.nodes, ctx);                                                                                  // 682
      context.subs[node.n] = ctx.code;                                                                              // 683
      if (!context.inPartial) {                                                                                     // 684
        context.code += 't.sub("' + esc(node.n) + '",c,p,i);';                                                      // 685
      }                                                                                                             // 686
    },                                                                                                              // 687
                                                                                                                    // 688
    '\n': function(node, context) {                                                                                 // 689
      context.code += write('"\\n"' + (node.last ? '' : ' + i'));                                                   // 690
    },                                                                                                              // 691
                                                                                                                    // 692
    '_v': function(node, context) {                                                                                 // 693
      context.code += 't.b(t.v(t.' + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,0)));';                     // 694
    },                                                                                                              // 695
                                                                                                                    // 696
    '_t': function(node, context) {                                                                                 // 697
      context.code += write('"' + esc(node.text) + '"');                                                            // 698
    },                                                                                                              // 699
                                                                                                                    // 700
    '{': tripleStache,                                                                                              // 701
                                                                                                                    // 702
    '&': tripleStache                                                                                               // 703
  }                                                                                                                 // 704
                                                                                                                    // 705
  function tripleStache(node, context) {                                                                            // 706
    context.code += 't.b(t.t(t.' + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,0)));';                       // 707
  }                                                                                                                 // 708
                                                                                                                    // 709
  function write(s) {                                                                                               // 710
    return 't.b(' + s + ');';                                                                                       // 711
  }                                                                                                                 // 712
                                                                                                                    // 713
  Hogan.walk = function(nodelist, context) {                                                                        // 714
    var func;                                                                                                       // 715
    for (var i = 0, l = nodelist.length; i < l; i++) {                                                              // 716
      func = Hogan.codegen[nodelist[i].tag];                                                                        // 717
      func && func(nodelist[i], context);                                                                           // 718
    }                                                                                                               // 719
    return context;                                                                                                 // 720
  }                                                                                                                 // 721
                                                                                                                    // 722
  Hogan.parse = function(tokens, text, options) {                                                                   // 723
    options = options || {};                                                                                        // 724
    return buildTree(tokens, '', [], options.sectionTags || []);                                                    // 725
  }                                                                                                                 // 726
                                                                                                                    // 727
  Hogan.cache = {};                                                                                                 // 728
                                                                                                                    // 729
  Hogan.cacheKey = function(text, options) {                                                                        // 730
    return [text, !!options.asString, !!options.disableLambda, options.delimiters, !!options.modelGet].join('||');  // 731
  }                                                                                                                 // 732
                                                                                                                    // 733
  Hogan.compile = function(text, options) {                                                                         // 734
    options = options || {};                                                                                        // 735
    var key = Hogan.cacheKey(text, options);                                                                        // 736
    var template = this.cache[key];                                                                                 // 737
                                                                                                                    // 738
    if (template) {                                                                                                 // 739
      var partials = template.partials;                                                                             // 740
      for (var name in partials) {                                                                                  // 741
        delete partials[name].instance;                                                                             // 742
      }                                                                                                             // 743
      return template;                                                                                              // 744
    }                                                                                                               // 745
                                                                                                                    // 746
    template = this.generate(this.parse(this.scan(text, options.delimiters), text, options), text, options);        // 747
    return this.cache[key] = template;                                                                              // 748
  }                                                                                                                 // 749
})(typeof exports !== 'undefined' ? exports : Hogan);                                                               // 750
                                                                                                                    // 751
//---------------------- Init Object -----------------------                                                        // 752
                                                                                                                    // 753
this.Hogan = Hogan;                                                                                                 // 754
                                                                                                                    // 755
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['alisalaah:hogan'] = {};

})();
