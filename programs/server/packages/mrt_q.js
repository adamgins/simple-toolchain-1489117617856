(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;

/* Package-scope variables */
var Q;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                 //
// packages/mrt_q/packages/mrt_q.js                                                                //
//                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                   //
(function () {

/////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                         //
// packages/mrt:q/lib/q-1/q.js                                                             //
//                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////
                                                                                           //
// vim:ts=4:sts=4:sw=4:                                                                    // 1
/*!                                                                                        // 2
 *                                                                                         // 3
 * Copyright 2009-2012 Kris Kowal under the terms of the MIT                               // 4
 * license found at http://github.com/kriskowal/q/raw/master/LICENSE                       // 5
 *                                                                                         // 6
 * With parts by Tyler Close                                                               // 7
 * Copyright 2007-2009 Tyler Close under the terms of the MIT X license found              // 8
 * at http://www.opensource.org/licenses/mit-license.html                                  // 9
 * Forked at ref_send.js version: 2009-05-11                                               // 10
 *                                                                                         // 11
 * With parts by Mark Miller                                                               // 12
 * Copyright (C) 2011 Google Inc.                                                          // 13
 *                                                                                         // 14
 * Licensed under the Apache License, Version 2.0 (the "License");                         // 15
 * you may not use this file except in compliance with the License.                        // 16
 * You may obtain a copy of the License at                                                 // 17
 *                                                                                         // 18
 * http://www.apache.org/licenses/LICENSE-2.0                                              // 19
 *                                                                                         // 20
 * Unless required by applicable law or agreed to in writing, software                     // 21
 * distributed under the License is distributed on an "AS IS" BASIS,                       // 22
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.                // 23
 * See the License for the specific language governing permissions and                     // 24
 * limitations under the License.                                                          // 25
 *                                                                                         // 26
 */                                                                                        // 27
                                                                                           // 28
(function (definition) {                                                                   // 29
    // Turn off strict mode for this function so we can assign to global.Q                 // 30
    /* jshint strict: false */                                                             // 31
                                                                                           // 32
    // This file will function properly as a <script> tag, or a module                     // 33
    // using CommonJS and NodeJS or RequireJS module formats.  In                          // 34
    // Common/Node/RequireJS, the module exports the Q API and when                        // 35
    // executed as a simple <script>, it creates a Q global instead.                       // 36
                                                                                           // 37
    // Montage Require                                                                     // 38
    if (typeof bootstrap === "function") {                                                 // 39
        bootstrap("promise", definition);                                                  // 40
                                                                                           // 41
    // CommonJS                                                                            // 42
    } else if (typeof exports === "object") {                                              // 43
        module.exports = definition();                                                     // 44
                                                                                           // 45
    // RequireJS                                                                           // 46
    } else if (typeof define === "function" && define.amd) {                               // 47
        define(definition);                                                                // 48
                                                                                           // 49
    // SES (Secure EcmaScript)                                                             // 50
    } else if (typeof ses !== "undefined") {                                               // 51
        if (!ses.ok()) {                                                                   // 52
            return;                                                                        // 53
        } else {                                                                           // 54
            ses.makeQ = definition;                                                        // 55
        }                                                                                  // 56
                                                                                           // 57
    // <script>                                                                            // 58
    } else {                                                                               // 59
        Q = definition();                                                                  // 60
    }                                                                                      // 61
                                                                                           // 62
})(function () {                                                                           // 63
"use strict";                                                                              // 64
                                                                                           // 65
var hasStacks = false;                                                                     // 66
try {                                                                                      // 67
    throw new Error();                                                                     // 68
} catch (e) {                                                                              // 69
    hasStacks = !!e.stack;                                                                 // 70
}                                                                                          // 71
                                                                                           // 72
// All code after this point will be filtered from stack traces reported                   // 73
// by Q.                                                                                   // 74
var qStartingLine = captureLine();                                                         // 75
var qFileName;                                                                             // 76
                                                                                           // 77
// shims                                                                                   // 78
                                                                                           // 79
// used for fallback in "allResolved"                                                      // 80
var noop = function () {};                                                                 // 81
                                                                                           // 82
// Use the fastest possible means to execute a task in a future turn                       // 83
// of the event loop.                                                                      // 84
var nextTick =(function () {                                                               // 85
    // linked list of tasks (single, with head node)                                       // 86
    var head = {task: void 0, next: null};                                                 // 87
    var tail = head;                                                                       // 88
    var flushing = false;                                                                  // 89
    var requestTick = void 0;                                                              // 90
    var isNodeJS = false;                                                                  // 91
                                                                                           // 92
    function flush() {                                                                     // 93
        /* jshint loopfunc: true */                                                        // 94
                                                                                           // 95
        while (head.next) {                                                                // 96
            head = head.next;                                                              // 97
            var task = head.task;                                                          // 98
            head.task = void 0;                                                            // 99
            var domain = head.domain;                                                      // 100
                                                                                           // 101
            if (domain) {                                                                  // 102
                head.domain = void 0;                                                      // 103
                domain.enter();                                                            // 104
            }                                                                              // 105
                                                                                           // 106
            try {                                                                          // 107
                task();                                                                    // 108
                                                                                           // 109
            } catch (e) {                                                                  // 110
                if (isNodeJS) {                                                            // 111
                    // In node, uncaught exceptions are considered fatal errors.           // 112
                    // Re-throw them synchronously to interrupt flushing!                  // 113
                                                                                           // 114
                    // Ensure continuation if the uncaught exception is suppressed         // 115
                    // listening "uncaughtException" events (as domains does).             // 116
                    // Continue in next event to avoid tick recursion.                     // 117
                    if (domain) {                                                          // 118
                        domain.exit();                                                     // 119
                    }                                                                      // 120
                    setTimeout(flush, 0);                                                  // 121
                    if (domain) {                                                          // 122
                        domain.enter();                                                    // 123
                    }                                                                      // 124
                                                                                           // 125
                    throw e;                                                               // 126
                                                                                           // 127
                } else {                                                                   // 128
                    // In browsers, uncaught exceptions are not fatal.                     // 129
                    // Re-throw them asynchronously to avoid slow-downs.                   // 130
                    setTimeout(function() {                                                // 131
                       throw e;                                                            // 132
                    }, 0);                                                                 // 133
                }                                                                          // 134
            }                                                                              // 135
                                                                                           // 136
            if (domain) {                                                                  // 137
                domain.exit();                                                             // 138
            }                                                                              // 139
        }                                                                                  // 140
                                                                                           // 141
        flushing = false;                                                                  // 142
    }                                                                                      // 143
                                                                                           // 144
    nextTick = function (task) {                                                           // 145
        tail = tail.next = {                                                               // 146
            task: task,                                                                    // 147
            domain: isNodeJS && process.domain,                                            // 148
            next: null                                                                     // 149
        };                                                                                 // 150
                                                                                           // 151
        if (!flushing) {                                                                   // 152
            flushing = true;                                                               // 153
            requestTick();                                                                 // 154
        }                                                                                  // 155
    };                                                                                     // 156
                                                                                           // 157
    if (typeof process !== "undefined" && process.nextTick) {                              // 158
        // Node.js before 0.9. Note that some fake-Node environments, like the             // 159
        // Mocha test runner, introduce a `process` global without a `nextTick`.           // 160
        isNodeJS = true;                                                                   // 161
                                                                                           // 162
        requestTick = function () {                                                        // 163
            process.nextTick(flush);                                                       // 164
        };                                                                                 // 165
                                                                                           // 166
    } else if (typeof setImmediate === "function") {                                       // 167
        // In IE10, Node.js 0.9+, or https://github.com/NobleJS/setImmediate               // 168
        if (typeof window !== "undefined") {                                               // 169
            requestTick = setImmediate.bind(window, flush);                                // 170
        } else {                                                                           // 171
            requestTick = function () {                                                    // 172
                setImmediate(flush);                                                       // 173
            };                                                                             // 174
        }                                                                                  // 175
                                                                                           // 176
    } else if (typeof MessageChannel !== "undefined") {                                    // 177
        // modern browsers                                                                 // 178
        // http://www.nonblocking.io/2011/06/windownexttick.html                           // 179
        var channel = new MessageChannel();                                                // 180
        // At least Safari Version 6.0.5 (8536.30.1) intermittently cannot create          // 181
        // working message ports the first time a page loads.                              // 182
        channel.port1.onmessage = function () {                                            // 183
            requestTick = requestPortTick;                                                 // 184
            channel.port1.onmessage = flush;                                               // 185
            flush();                                                                       // 186
        };                                                                                 // 187
        var requestPortTick = function () {                                                // 188
            // Opera requires us to provide a message payload, regardless of               // 189
            // whether we use it.                                                          // 190
            channel.port2.postMessage(0);                                                  // 191
        };                                                                                 // 192
        requestTick = function () {                                                        // 193
            setTimeout(flush, 0);                                                          // 194
            requestPortTick();                                                             // 195
        };                                                                                 // 196
                                                                                           // 197
    } else {                                                                               // 198
        // old browsers                                                                    // 199
        requestTick = function () {                                                        // 200
            setTimeout(flush, 0);                                                          // 201
        };                                                                                 // 202
    }                                                                                      // 203
                                                                                           // 204
    return nextTick;                                                                       // 205
})();                                                                                      // 206
                                                                                           // 207
// Attempt to make generics safe in the face of downstream                                 // 208
// modifications.                                                                          // 209
// There is no situation where this is necessary.                                          // 210
// If you need a security guarantee, these primordials need to be                          // 211
// deeply frozen anyway, and if you don’t need a security guarantee,                       // 212
// this is just plain paranoid.                                                            // 213
// However, this **might** have the nice side-effect of reducing the size of               // 214
// the minified code by reducing x.call() to merely x()                                    // 215
// See Mark Miller’s explanation of what this does.                                        // 216
// http://wiki.ecmascript.org/doku.php?id=conventions:safe_meta_programming                // 217
var call = Function.call;                                                                  // 218
function uncurryThis(f) {                                                                  // 219
    return function () {                                                                   // 220
        return call.apply(f, arguments);                                                   // 221
    };                                                                                     // 222
}                                                                                          // 223
// This is equivalent, but slower:                                                         // 224
// uncurryThis = Function_bind.bind(Function_bind.call);                                   // 225
// http://jsperf.com/uncurrythis                                                           // 226
                                                                                           // 227
var array_slice = uncurryThis(Array.prototype.slice);                                      // 228
                                                                                           // 229
var array_reduce = uncurryThis(                                                            // 230
    Array.prototype.reduce || function (callback, basis) {                                 // 231
        var index = 0,                                                                     // 232
            length = this.length;                                                          // 233
        // concerning the initial value, if one is not provided                            // 234
        if (arguments.length === 1) {                                                      // 235
            // seek to the first value in the array, accounting                            // 236
            // for the possibility that is is a sparse array                               // 237
            do {                                                                           // 238
                if (index in this) {                                                       // 239
                    basis = this[index++];                                                 // 240
                    break;                                                                 // 241
                }                                                                          // 242
                if (++index >= length) {                                                   // 243
                    throw new TypeError();                                                 // 244
                }                                                                          // 245
            } while (1);                                                                   // 246
        }                                                                                  // 247
        // reduce                                                                          // 248
        for (; index < length; index++) {                                                  // 249
            // account for the possibility that the array is sparse                        // 250
            if (index in this) {                                                           // 251
                basis = callback(basis, this[index], index);                               // 252
            }                                                                              // 253
        }                                                                                  // 254
        return basis;                                                                      // 255
    }                                                                                      // 256
);                                                                                         // 257
                                                                                           // 258
var array_indexOf = uncurryThis(                                                           // 259
    Array.prototype.indexOf || function (value) {                                          // 260
        // not a very good shim, but good enough for our one use of it                     // 261
        for (var i = 0; i < this.length; i++) {                                            // 262
            if (this[i] === value) {                                                       // 263
                return i;                                                                  // 264
            }                                                                              // 265
        }                                                                                  // 266
        return -1;                                                                         // 267
    }                                                                                      // 268
);                                                                                         // 269
                                                                                           // 270
var array_map = uncurryThis(                                                               // 271
    Array.prototype.map || function (callback, thisp) {                                    // 272
        var self = this;                                                                   // 273
        var collect = [];                                                                  // 274
        array_reduce(self, function (undefined, value, index) {                            // 275
            collect.push(callback.call(thisp, value, index, self));                        // 276
        }, void 0);                                                                        // 277
        return collect;                                                                    // 278
    }                                                                                      // 279
);                                                                                         // 280
                                                                                           // 281
var object_create = Object.create || function (prototype) {                                // 282
    function Type() { }                                                                    // 283
    Type.prototype = prototype;                                                            // 284
    return new Type();                                                                     // 285
};                                                                                         // 286
                                                                                           // 287
var object_hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty);                  // 288
                                                                                           // 289
var object_keys = Object.keys || function (object) {                                       // 290
    var keys = [];                                                                         // 291
    for (var key in object) {                                                              // 292
        if (object_hasOwnProperty(object, key)) {                                          // 293
            keys.push(key);                                                                // 294
        }                                                                                  // 295
    }                                                                                      // 296
    return keys;                                                                           // 297
};                                                                                         // 298
                                                                                           // 299
var object_toString = uncurryThis(Object.prototype.toString);                              // 300
                                                                                           // 301
function isObject(value) {                                                                 // 302
    return value === Object(value);                                                        // 303
}                                                                                          // 304
                                                                                           // 305
// generator related shims                                                                 // 306
                                                                                           // 307
// FIXME: Remove this function once ES6 generators are in SpiderMonkey.                    // 308
function isStopIteration(exception) {                                                      // 309
    return (                                                                               // 310
        object_toString(exception) === "[object StopIteration]" ||                         // 311
        exception instanceof QReturnValue                                                  // 312
    );                                                                                     // 313
}                                                                                          // 314
                                                                                           // 315
// FIXME: Remove this helper and Q.return once ES6 generators are in                       // 316
// SpiderMonkey.                                                                           // 317
var QReturnValue;                                                                          // 318
if (typeof ReturnValue !== "undefined") {                                                  // 319
    QReturnValue = ReturnValue;                                                            // 320
} else {                                                                                   // 321
    QReturnValue = function (value) {                                                      // 322
        this.value = value;                                                                // 323
    };                                                                                     // 324
}                                                                                          // 325
                                                                                           // 326
// long stack traces                                                                       // 327
                                                                                           // 328
var STACK_JUMP_SEPARATOR = "From previous event:";                                         // 329
                                                                                           // 330
function makeStackTraceLong(error, promise) {                                              // 331
    // If possible, transform the error stack trace by removing Node and Q                 // 332
    // cruft, then concatenating with the stack trace of `promise`. See #57.               // 333
    if (hasStacks &&                                                                       // 334
        promise.stack &&                                                                   // 335
        typeof error === "object" &&                                                       // 336
        error !== null &&                                                                  // 337
        error.stack &&                                                                     // 338
        error.stack.indexOf(STACK_JUMP_SEPARATOR) === -1                                   // 339
    ) {                                                                                    // 340
        var stacks = [];                                                                   // 341
        for (var p = promise; !!p; p = p.source) {                                         // 342
            if (p.stack) {                                                                 // 343
                stacks.unshift(p.stack);                                                   // 344
            }                                                                              // 345
        }                                                                                  // 346
        stacks.unshift(error.stack);                                                       // 347
                                                                                           // 348
        var concatedStacks = stacks.join("\n" + STACK_JUMP_SEPARATOR + "\n");              // 349
        error.stack = filterStackString(concatedStacks);                                   // 350
    }                                                                                      // 351
}                                                                                          // 352
                                                                                           // 353
function filterStackString(stackString) {                                                  // 354
    var lines = stackString.split("\n");                                                   // 355
    var desiredLines = [];                                                                 // 356
    for (var i = 0; i < lines.length; ++i) {                                               // 357
        var line = lines[i];                                                               // 358
                                                                                           // 359
        if (!isInternalFrame(line) && !isNodeFrame(line) && line) {                        // 360
            desiredLines.push(line);                                                       // 361
        }                                                                                  // 362
    }                                                                                      // 363
    return desiredLines.join("\n");                                                        // 364
}                                                                                          // 365
                                                                                           // 366
function isNodeFrame(stackLine) {                                                          // 367
    return stackLine.indexOf("(module.js:") !== -1 ||                                      // 368
           stackLine.indexOf("(node.js:") !== -1;                                          // 369
}                                                                                          // 370
                                                                                           // 371
function getFileNameAndLineNumber(stackLine) {                                             // 372
    // Named functions: "at functionName (filename:lineNumber:columnNumber)"               // 373
    // In IE10 function name can have spaces ("Anonymous function") O_o                    // 374
    var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);                        // 375
    if (attempt1) {                                                                        // 376
        return [attempt1[1], Number(attempt1[2])];                                         // 377
    }                                                                                      // 378
                                                                                           // 379
    // Anonymous functions: "at filename:lineNumber:columnNumber"                          // 380
    var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);                            // 381
    if (attempt2) {                                                                        // 382
        return [attempt2[1], Number(attempt2[2])];                                         // 383
    }                                                                                      // 384
                                                                                           // 385
    // Firefox style: "function@filename:lineNumber or @filename:lineNumber"               // 386
    var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);                                       // 387
    if (attempt3) {                                                                        // 388
        return [attempt3[1], Number(attempt3[2])];                                         // 389
    }                                                                                      // 390
}                                                                                          // 391
                                                                                           // 392
function isInternalFrame(stackLine) {                                                      // 393
    var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);                       // 394
                                                                                           // 395
    if (!fileNameAndLineNumber) {                                                          // 396
        return false;                                                                      // 397
    }                                                                                      // 398
                                                                                           // 399
    var fileName = fileNameAndLineNumber[0];                                               // 400
    var lineNumber = fileNameAndLineNumber[1];                                             // 401
                                                                                           // 402
    return fileName === qFileName &&                                                       // 403
        lineNumber >= qStartingLine &&                                                     // 404
        lineNumber <= qEndingLine;                                                         // 405
}                                                                                          // 406
                                                                                           // 407
// discover own file name and line number range for filtering stack                        // 408
// traces                                                                                  // 409
function captureLine() {                                                                   // 410
    if (!hasStacks) {                                                                      // 411
        return;                                                                            // 412
    }                                                                                      // 413
                                                                                           // 414
    try {                                                                                  // 415
        throw new Error();                                                                 // 416
    } catch (e) {                                                                          // 417
        var lines = e.stack.split("\n");                                                   // 418
        var firstLine = lines[0].indexOf("@") > 0 ? lines[1] : lines[2];                   // 419
        var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);                   // 420
        if (!fileNameAndLineNumber) {                                                      // 421
            return;                                                                        // 422
        }                                                                                  // 423
                                                                                           // 424
        qFileName = fileNameAndLineNumber[0];                                              // 425
        return fileNameAndLineNumber[1];                                                   // 426
    }                                                                                      // 427
}                                                                                          // 428
                                                                                           // 429
function deprecate(callback, name, alternative) {                                          // 430
    return function () {                                                                   // 431
        if (typeof console !== "undefined" &&                                              // 432
            typeof console.warn === "function") {                                          // 433
            console.warn(name + " is deprecated, use " + alternative +                     // 434
                         " instead.", new Error("").stack);                                // 435
        }                                                                                  // 436
        return callback.apply(callback, arguments);                                        // 437
    };                                                                                     // 438
}                                                                                          // 439
                                                                                           // 440
// end of shims                                                                            // 441
// beginning of real work                                                                  // 442
                                                                                           // 443
/**                                                                                        // 444
 * Constructs a promise for an immediate reference, passes promises through, or            // 445
 * coerces promises from different systems.                                                // 446
 * @param value immediate reference or promise                                             // 447
 */                                                                                        // 448
function Q(value) {                                                                        // 449
    // If the object is already a Promise, return it directly.  This enables               // 450
    // the resolve function to both be used to created references from objects,            // 451
    // but to tolerably coerce non-promises to promises.                                   // 452
    if (isPromise(value)) {                                                                // 453
        return value;                                                                      // 454
    }                                                                                      // 455
                                                                                           // 456
    // assimilate thenables                                                                // 457
    if (isPromiseAlike(value)) {                                                           // 458
        return coerce(value);                                                              // 459
    } else {                                                                               // 460
        return fulfill(value);                                                             // 461
    }                                                                                      // 462
}                                                                                          // 463
Q.resolve = Q;                                                                             // 464
                                                                                           // 465
/**                                                                                        // 466
 * Performs a task in a future turn of the event loop.                                     // 467
 * @param {Function} task                                                                  // 468
 */                                                                                        // 469
Q.nextTick = nextTick;                                                                     // 470
                                                                                           // 471
/**                                                                                        // 472
 * Controls whether or not long stack traces will be on                                    // 473
 */                                                                                        // 474
Q.longStackSupport = false;                                                                // 475
                                                                                           // 476
/**                                                                                        // 477
 * Constructs a {promise, resolve, reject} object.                                         // 478
 *                                                                                         // 479
 * `resolve` is a callback to invoke with a more resolved value for the                    // 480
 * promise. To fulfill the promise, invoke `resolve` with any value that is                // 481
 * not a thenable. To reject the promise, invoke `resolve` with a rejected                 // 482
 * thenable, or invoke `reject` with the reason directly. To resolve the                   // 483
 * promise to another thenable, thus putting it in the same state, invoke                  // 484
 * `resolve` with that other thenable.                                                     // 485
 */                                                                                        // 486
Q.defer = defer;                                                                           // 487
function defer() {                                                                         // 488
    // if "messages" is an "Array", that indicates that the promise has not yet            // 489
    // been resolved.  If it is "undefined", it has been resolved.  Each                   // 490
    // element of the messages array is itself an array of complete arguments to           // 491
    // forward to the resolved promise.  We coerce the resolution value to a               // 492
    // promise using the `resolve` function because it handles both fully                  // 493
    // non-thenable values and other thenables gracefully.                                 // 494
    var messages = [], progressListeners = [], resolvedPromise;                            // 495
                                                                                           // 496
    var deferred = object_create(defer.prototype);                                         // 497
    var promise = object_create(Promise.prototype);                                        // 498
                                                                                           // 499
    promise.promiseDispatch = function (resolve, op, operands) {                           // 500
        var args = array_slice(arguments);                                                 // 501
        if (messages) {                                                                    // 502
            messages.push(args);                                                           // 503
            if (op === "when" && operands[1]) { // progress operand                        // 504
                progressListeners.push(operands[1]);                                       // 505
            }                                                                              // 506
        } else {                                                                           // 507
            nextTick(function () {                                                         // 508
                resolvedPromise.promiseDispatch.apply(resolvedPromise, args);              // 509
            });                                                                            // 510
        }                                                                                  // 511
    };                                                                                     // 512
                                                                                           // 513
    // XXX deprecated                                                                      // 514
    promise.valueOf = function () {                                                        // 515
        if (messages) {                                                                    // 516
            return promise;                                                                // 517
        }                                                                                  // 518
        var nearerValue = nearer(resolvedPromise);                                         // 519
        if (isPromise(nearerValue)) {                                                      // 520
            resolvedPromise = nearerValue; // shorten chain                                // 521
        }                                                                                  // 522
        return nearerValue;                                                                // 523
    };                                                                                     // 524
                                                                                           // 525
    promise.inspect = function () {                                                        // 526
        if (!resolvedPromise) {                                                            // 527
            return { state: "pending" };                                                   // 528
        }                                                                                  // 529
        return resolvedPromise.inspect();                                                  // 530
    };                                                                                     // 531
                                                                                           // 532
    if (Q.longStackSupport && hasStacks) {                                                 // 533
        try {                                                                              // 534
            throw new Error();                                                             // 535
        } catch (e) {                                                                      // 536
            // NOTE: don't try to use `Error.captureStackTrace` or transfer the            // 537
            // accessor around; that causes memory leaks as per GH-111. Just               // 538
            // reify the stack trace as a string ASAP.                                     // 539
            //                                                                             // 540
            // At the same time, cut off the first line; it's always just                  // 541
            // "[object Promise]\n", as per the `toString`.                                // 542
            promise.stack = e.stack.substring(e.stack.indexOf("\n") + 1);                  // 543
        }                                                                                  // 544
    }                                                                                      // 545
                                                                                           // 546
    // NOTE: we do the checks for `resolvedPromise` in each method, instead of             // 547
    // consolidating them into `become`, since otherwise we'd create new                   // 548
    // promises with the lines `become(whatever(value))`. See e.g. GH-252.                 // 549
                                                                                           // 550
    function become(newPromise) {                                                          // 551
        resolvedPromise = newPromise;                                                      // 552
        promise.source = newPromise;                                                       // 553
                                                                                           // 554
        array_reduce(messages, function (undefined, message) {                             // 555
            nextTick(function () {                                                         // 556
                newPromise.promiseDispatch.apply(newPromise, message);                     // 557
            });                                                                            // 558
        }, void 0);                                                                        // 559
                                                                                           // 560
        messages = void 0;                                                                 // 561
        progressListeners = void 0;                                                        // 562
    }                                                                                      // 563
                                                                                           // 564
    deferred.promise = promise;                                                            // 565
    deferred.resolve = function (value) {                                                  // 566
        if (resolvedPromise) {                                                             // 567
            return;                                                                        // 568
        }                                                                                  // 569
                                                                                           // 570
        become(Q(value));                                                                  // 571
    };                                                                                     // 572
                                                                                           // 573
    deferred.fulfill = function (value) {                                                  // 574
        if (resolvedPromise) {                                                             // 575
            return;                                                                        // 576
        }                                                                                  // 577
                                                                                           // 578
        become(fulfill(value));                                                            // 579
    };                                                                                     // 580
    deferred.reject = function (reason) {                                                  // 581
        if (resolvedPromise) {                                                             // 582
            return;                                                                        // 583
        }                                                                                  // 584
                                                                                           // 585
        become(reject(reason));                                                            // 586
    };                                                                                     // 587
    deferred.notify = function (progress) {                                                // 588
        if (resolvedPromise) {                                                             // 589
            return;                                                                        // 590
        }                                                                                  // 591
                                                                                           // 592
        array_reduce(progressListeners, function (undefined, progressListener) {           // 593
            nextTick(function () {                                                         // 594
                progressListener(progress);                                                // 595
            });                                                                            // 596
        }, void 0);                                                                        // 597
    };                                                                                     // 598
                                                                                           // 599
    return deferred;                                                                       // 600
}                                                                                          // 601
                                                                                           // 602
/**                                                                                        // 603
 * Creates a Node-style callback that will resolve or reject the deferred                  // 604
 * promise.                                                                                // 605
 * @returns a nodeback                                                                     // 606
 */                                                                                        // 607
defer.prototype.makeNodeResolver = function () {                                           // 608
    var self = this;                                                                       // 609
    return function (error, value) {                                                       // 610
        if (error) {                                                                       // 611
            self.reject(error);                                                            // 612
        } else if (arguments.length > 2) {                                                 // 613
            self.resolve(array_slice(arguments, 1));                                       // 614
        } else {                                                                           // 615
            self.resolve(value);                                                           // 616
        }                                                                                  // 617
    };                                                                                     // 618
};                                                                                         // 619
                                                                                           // 620
/**                                                                                        // 621
 * @param resolver {Function} a function that returns nothing and accepts                  // 622
 * the resolve, reject, and notify functions for a deferred.                               // 623
 * @returns a promise that may be resolved with the given resolve and reject               // 624
 * functions, or rejected by a thrown exception in resolver                                // 625
 */                                                                                        // 626
Q.Promise = promise; // ES6                                                                // 627
Q.promise = promise;                                                                       // 628
function promise(resolver) {                                                               // 629
    if (typeof resolver !== "function") {                                                  // 630
        throw new TypeError("resolver must be a function.");                               // 631
    }                                                                                      // 632
    var deferred = defer();                                                                // 633
    try {                                                                                  // 634
        resolver(deferred.resolve, deferred.reject, deferred.notify);                      // 635
    } catch (reason) {                                                                     // 636
        deferred.reject(reason);                                                           // 637
    }                                                                                      // 638
    return deferred.promise;                                                               // 639
}                                                                                          // 640
                                                                                           // 641
promise.race = race; // ES6                                                                // 642
promise.all = all; // ES6                                                                  // 643
promise.reject = reject; // ES6                                                            // 644
promise.resolve = Q; // ES6                                                                // 645
                                                                                           // 646
// XXX experimental.  This method is a way to denote that a local value is                 // 647
// serializable and should be immediately dispatched to a remote upon request,             // 648
// instead of passing a reference.                                                         // 649
Q.passByCopy = function (object) {                                                         // 650
    //freeze(object);                                                                      // 651
    //passByCopies.set(object, true);                                                      // 652
    return object;                                                                         // 653
};                                                                                         // 654
                                                                                           // 655
Promise.prototype.passByCopy = function () {                                               // 656
    //freeze(object);                                                                      // 657
    //passByCopies.set(object, true);                                                      // 658
    return this;                                                                           // 659
};                                                                                         // 660
                                                                                           // 661
/**                                                                                        // 662
 * If two promises eventually fulfill to the same value, promises that value,              // 663
 * but otherwise rejects.                                                                  // 664
 * @param x {Any*}                                                                         // 665
 * @param y {Any*}                                                                         // 666
 * @returns {Any*} a promise for x and y if they are the same, but a rejection             // 667
 * otherwise.                                                                              // 668
 *                                                                                         // 669
 */                                                                                        // 670
Q.join = function (x, y) {                                                                 // 671
    return Q(x).join(y);                                                                   // 672
};                                                                                         // 673
                                                                                           // 674
Promise.prototype.join = function (that) {                                                 // 675
    return Q([this, that]).spread(function (x, y) {                                        // 676
        if (x === y) {                                                                     // 677
            // TODO: "===" should be Object.is or equiv                                    // 678
            return x;                                                                      // 679
        } else {                                                                           // 680
            throw new Error("Can't join: not the same: " + x + " " + y);                   // 681
        }                                                                                  // 682
    });                                                                                    // 683
};                                                                                         // 684
                                                                                           // 685
/**                                                                                        // 686
 * Returns a promise for the first of an array of promises to become fulfilled.            // 687
 * @param answers {Array[Any*]} promises to race                                           // 688
 * @returns {Any*} the first promise to be fulfilled                                       // 689
 */                                                                                        // 690
Q.race = race;                                                                             // 691
function race(answerPs) {                                                                  // 692
    return promise(function(resolve, reject) {                                             // 693
        // Switch to this once we can assume at least ES5                                  // 694
        // answerPs.forEach(function(answerP) {                                            // 695
        //     Q(answerP).then(resolve, reject);                                           // 696
        // });                                                                             // 697
        // Use this in the meantime                                                        // 698
        for (var i = 0, len = answerPs.length; i < len; i++) {                             // 699
            Q(answerPs[i]).then(resolve, reject);                                          // 700
        }                                                                                  // 701
    });                                                                                    // 702
}                                                                                          // 703
                                                                                           // 704
Promise.prototype.race = function () {                                                     // 705
    return this.then(Q.race);                                                              // 706
};                                                                                         // 707
                                                                                           // 708
/**                                                                                        // 709
 * Constructs a Promise with a promise descriptor object and optional fallback             // 710
 * function.  The descriptor contains methods like when(rejected), get(name),              // 711
 * set(name, value), post(name, args), and delete(name), which all                         // 712
 * return either a value, a promise for a value, or a rejection.  The fallback             // 713
 * accepts the operation name, a resolver, and any further arguments that would            // 714
 * have been forwarded to the appropriate method above had a method been                   // 715
 * provided with the proper name.  The API makes no guarantees about the nature            // 716
 * of the returned object, apart from that it is usable whereever promises are             // 717
 * bought and sold.                                                                        // 718
 */                                                                                        // 719
Q.makePromise = Promise;                                                                   // 720
function Promise(descriptor, fallback, inspect) {                                          // 721
    if (fallback === void 0) {                                                             // 722
        fallback = function (op) {                                                         // 723
            return reject(new Error(                                                       // 724
                "Promise does not support operation: " + op                                // 725
            ));                                                                            // 726
        };                                                                                 // 727
    }                                                                                      // 728
    if (inspect === void 0) {                                                              // 729
        inspect = function () {                                                            // 730
            return {state: "unknown"};                                                     // 731
        };                                                                                 // 732
    }                                                                                      // 733
                                                                                           // 734
    var promise = object_create(Promise.prototype);                                        // 735
                                                                                           // 736
    promise.promiseDispatch = function (resolve, op, args) {                               // 737
        var result;                                                                        // 738
        try {                                                                              // 739
            if (descriptor[op]) {                                                          // 740
                result = descriptor[op].apply(promise, args);                              // 741
            } else {                                                                       // 742
                result = fallback.call(promise, op, args);                                 // 743
            }                                                                              // 744
        } catch (exception) {                                                              // 745
            result = reject(exception);                                                    // 746
        }                                                                                  // 747
        if (resolve) {                                                                     // 748
            resolve(result);                                                               // 749
        }                                                                                  // 750
    };                                                                                     // 751
                                                                                           // 752
    promise.inspect = inspect;                                                             // 753
                                                                                           // 754
    // XXX deprecated `valueOf` and `exception` support                                    // 755
    if (inspect) {                                                                         // 756
        var inspected = inspect();                                                         // 757
        if (inspected.state === "rejected") {                                              // 758
            promise.exception = inspected.reason;                                          // 759
        }                                                                                  // 760
                                                                                           // 761
        promise.valueOf = function () {                                                    // 762
            var inspected = inspect();                                                     // 763
            if (inspected.state === "pending" ||                                           // 764
                inspected.state === "rejected") {                                          // 765
                return promise;                                                            // 766
            }                                                                              // 767
            return inspected.value;                                                        // 768
        };                                                                                 // 769
    }                                                                                      // 770
                                                                                           // 771
    return promise;                                                                        // 772
}                                                                                          // 773
                                                                                           // 774
Promise.prototype.toString = function () {                                                 // 775
    return "[object Promise]";                                                             // 776
};                                                                                         // 777
                                                                                           // 778
Promise.prototype.then = function (fulfilled, rejected, progressed) {                      // 779
    var self = this;                                                                       // 780
    var deferred = defer();                                                                // 781
    var done = false;   // ensure the untrusted promise makes at most a                    // 782
                        // single call to one of the callbacks                             // 783
                                                                                           // 784
    function _fulfilled(value) {                                                           // 785
        try {                                                                              // 786
            return typeof fulfilled === "function" ? fulfilled(value) : value;             // 787
        } catch (exception) {                                                              // 788
            return reject(exception);                                                      // 789
        }                                                                                  // 790
    }                                                                                      // 791
                                                                                           // 792
    function _rejected(exception) {                                                        // 793
        if (typeof rejected === "function") {                                              // 794
            makeStackTraceLong(exception, self);                                           // 795
            try {                                                                          // 796
                return rejected(exception);                                                // 797
            } catch (newException) {                                                       // 798
                return reject(newException);                                               // 799
            }                                                                              // 800
        }                                                                                  // 801
        return reject(exception);                                                          // 802
    }                                                                                      // 803
                                                                                           // 804
    function _progressed(value) {                                                          // 805
        return typeof progressed === "function" ? progressed(value) : value;               // 806
    }                                                                                      // 807
                                                                                           // 808
    nextTick(function () {                                                                 // 809
        self.promiseDispatch(function (value) {                                            // 810
            if (done) {                                                                    // 811
                return;                                                                    // 812
            }                                                                              // 813
            done = true;                                                                   // 814
                                                                                           // 815
            deferred.resolve(_fulfilled(value));                                           // 816
        }, "when", [function (exception) {                                                 // 817
            if (done) {                                                                    // 818
                return;                                                                    // 819
            }                                                                              // 820
            done = true;                                                                   // 821
                                                                                           // 822
            deferred.resolve(_rejected(exception));                                        // 823
        }]);                                                                               // 824
    });                                                                                    // 825
                                                                                           // 826
    // Progress propagator need to be attached in the current tick.                        // 827
    self.promiseDispatch(void 0, "when", [void 0, function (value) {                       // 828
        var newValue;                                                                      // 829
        var threw = false;                                                                 // 830
        try {                                                                              // 831
            newValue = _progressed(value);                                                 // 832
        } catch (e) {                                                                      // 833
            threw = true;                                                                  // 834
            if (Q.onerror) {                                                               // 835
                Q.onerror(e);                                                              // 836
            } else {                                                                       // 837
                throw e;                                                                   // 838
            }                                                                              // 839
        }                                                                                  // 840
                                                                                           // 841
        if (!threw) {                                                                      // 842
            deferred.notify(newValue);                                                     // 843
        }                                                                                  // 844
    }]);                                                                                   // 845
                                                                                           // 846
    return deferred.promise;                                                               // 847
};                                                                                         // 848
                                                                                           // 849
/**                                                                                        // 850
 * Registers an observer on a promise.                                                     // 851
 *                                                                                         // 852
 * Guarantees:                                                                             // 853
 *                                                                                         // 854
 * 1. that fulfilled and rejected will be called only once.                                // 855
 * 2. that either the fulfilled callback or the rejected callback will be                  // 856
 *    called, but not both.                                                                // 857
 * 3. that fulfilled and rejected will not be called in this turn.                         // 858
 *                                                                                         // 859
 * @param value      promise or immediate reference to observe                             // 860
 * @param fulfilled  function to be called with the fulfilled value                        // 861
 * @param rejected   function to be called with the rejection exception                    // 862
 * @param progressed function to be called on any progress notifications                   // 863
 * @return promise for the return value from the invoked callback                          // 864
 */                                                                                        // 865
Q.when = when;                                                                             // 866
function when(value, fulfilled, rejected, progressed) {                                    // 867
    return Q(value).then(fulfilled, rejected, progressed);                                 // 868
}                                                                                          // 869
                                                                                           // 870
Promise.prototype.thenResolve = function (value) {                                         // 871
    return this.then(function () { return value; });                                       // 872
};                                                                                         // 873
                                                                                           // 874
Q.thenResolve = function (promise, value) {                                                // 875
    return Q(promise).thenResolve(value);                                                  // 876
};                                                                                         // 877
                                                                                           // 878
Promise.prototype.thenReject = function (reason) {                                         // 879
    return this.then(function () { throw reason; });                                       // 880
};                                                                                         // 881
                                                                                           // 882
Q.thenReject = function (promise, reason) {                                                // 883
    return Q(promise).thenReject(reason);                                                  // 884
};                                                                                         // 885
                                                                                           // 886
/**                                                                                        // 887
 * If an object is not a promise, it is as "near" as possible.                             // 888
 * If a promise is rejected, it is as "near" as possible too.                              // 889
 * If it’s a fulfilled promise, the fulfillment value is nearer.                           // 890
 * If it’s a deferred promise and the deferred has been resolved, the                      // 891
 * resolution is "nearer".                                                                 // 892
 * @param object                                                                           // 893
 * @returns most resolved (nearest) form of the object                                     // 894
 */                                                                                        // 895
                                                                                           // 896
// XXX should we re-do this?                                                               // 897
Q.nearer = nearer;                                                                         // 898
function nearer(value) {                                                                   // 899
    if (isPromise(value)) {                                                                // 900
        var inspected = value.inspect();                                                   // 901
        if (inspected.state === "fulfilled") {                                             // 902
            return inspected.value;                                                        // 903
        }                                                                                  // 904
    }                                                                                      // 905
    return value;                                                                          // 906
}                                                                                          // 907
                                                                                           // 908
/**                                                                                        // 909
 * @returns whether the given object is a promise.                                         // 910
 * Otherwise it is a fulfilled value.                                                      // 911
 */                                                                                        // 912
Q.isPromise = isPromise;                                                                   // 913
function isPromise(object) {                                                               // 914
    return isObject(object) &&                                                             // 915
        typeof object.promiseDispatch === "function" &&                                    // 916
        typeof object.inspect === "function";                                              // 917
}                                                                                          // 918
                                                                                           // 919
Q.isPromiseAlike = isPromiseAlike;                                                         // 920
function isPromiseAlike(object) {                                                          // 921
    return isObject(object) && typeof object.then === "function";                          // 922
}                                                                                          // 923
                                                                                           // 924
/**                                                                                        // 925
 * @returns whether the given object is a pending promise, meaning not                     // 926
 * fulfilled or rejected.                                                                  // 927
 */                                                                                        // 928
Q.isPending = isPending;                                                                   // 929
function isPending(object) {                                                               // 930
    return isPromise(object) && object.inspect().state === "pending";                      // 931
}                                                                                          // 932
                                                                                           // 933
Promise.prototype.isPending = function () {                                                // 934
    return this.inspect().state === "pending";                                             // 935
};                                                                                         // 936
                                                                                           // 937
/**                                                                                        // 938
 * @returns whether the given object is a value or fulfilled                               // 939
 * promise.                                                                                // 940
 */                                                                                        // 941
Q.isFulfilled = isFulfilled;                                                               // 942
function isFulfilled(object) {                                                             // 943
    return !isPromise(object) || object.inspect().state === "fulfilled";                   // 944
}                                                                                          // 945
                                                                                           // 946
Promise.prototype.isFulfilled = function () {                                              // 947
    return this.inspect().state === "fulfilled";                                           // 948
};                                                                                         // 949
                                                                                           // 950
/**                                                                                        // 951
 * @returns whether the given object is a rejected promise.                                // 952
 */                                                                                        // 953
Q.isRejected = isRejected;                                                                 // 954
function isRejected(object) {                                                              // 955
    return isPromise(object) && object.inspect().state === "rejected";                     // 956
}                                                                                          // 957
                                                                                           // 958
Promise.prototype.isRejected = function () {                                               // 959
    return this.inspect().state === "rejected";                                            // 960
};                                                                                         // 961
                                                                                           // 962
//// BEGIN UNHANDLED REJECTION TRACKING                                                    // 963
                                                                                           // 964
// This promise library consumes exceptions thrown in handlers so they can be              // 965
// handled by a subsequent promise.  The exceptions get added to this array when           // 966
// they are created, and removed when they are handled.  Note that in ES6 or               // 967
// shimmed environments, this would naturally be a `Set`.                                  // 968
var unhandledReasons = [];                                                                 // 969
var unhandledRejections = [];                                                              // 970
var trackUnhandledRejections = true;                                                       // 971
                                                                                           // 972
function resetUnhandledRejections() {                                                      // 973
    unhandledReasons.length = 0;                                                           // 974
    unhandledRejections.length = 0;                                                        // 975
                                                                                           // 976
    if (!trackUnhandledRejections) {                                                       // 977
        trackUnhandledRejections = true;                                                   // 978
    }                                                                                      // 979
}                                                                                          // 980
                                                                                           // 981
function trackRejection(promise, reason) {                                                 // 982
    if (!trackUnhandledRejections) {                                                       // 983
        return;                                                                            // 984
    }                                                                                      // 985
                                                                                           // 986
    unhandledRejections.push(promise);                                                     // 987
    if (reason && typeof reason.stack !== "undefined") {                                   // 988
        unhandledReasons.push(reason.stack);                                               // 989
    } else {                                                                               // 990
        unhandledReasons.push("(no stack) " + reason);                                     // 991
    }                                                                                      // 992
}                                                                                          // 993
                                                                                           // 994
function untrackRejection(promise) {                                                       // 995
    if (!trackUnhandledRejections) {                                                       // 996
        return;                                                                            // 997
    }                                                                                      // 998
                                                                                           // 999
    var at = array_indexOf(unhandledRejections, promise);                                  // 1000
    if (at !== -1) {                                                                       // 1001
        unhandledRejections.splice(at, 1);                                                 // 1002
        unhandledReasons.splice(at, 1);                                                    // 1003
    }                                                                                      // 1004
}                                                                                          // 1005
                                                                                           // 1006
Q.resetUnhandledRejections = resetUnhandledRejections;                                     // 1007
                                                                                           // 1008
Q.getUnhandledReasons = function () {                                                      // 1009
    // Make a copy so that consumers can't interfere with our internal state.              // 1010
    return unhandledReasons.slice();                                                       // 1011
};                                                                                         // 1012
                                                                                           // 1013
Q.stopUnhandledRejectionTracking = function () {                                           // 1014
    resetUnhandledRejections();                                                            // 1015
    trackUnhandledRejections = false;                                                      // 1016
};                                                                                         // 1017
                                                                                           // 1018
resetUnhandledRejections();                                                                // 1019
                                                                                           // 1020
//// END UNHANDLED REJECTION TRACKING                                                      // 1021
                                                                                           // 1022
/**                                                                                        // 1023
 * Constructs a rejected promise.                                                          // 1024
 * @param reason value describing the failure                                              // 1025
 */                                                                                        // 1026
Q.reject = reject;                                                                         // 1027
function reject(reason) {                                                                  // 1028
    var rejection = Promise({                                                              // 1029
        "when": function (rejected) {                                                      // 1030
            // note that the error has been handled                                        // 1031
            if (rejected) {                                                                // 1032
                untrackRejection(this);                                                    // 1033
            }                                                                              // 1034
            return rejected ? rejected(reason) : this;                                     // 1035
        }                                                                                  // 1036
    }, function fallback() {                                                               // 1037
        return this;                                                                       // 1038
    }, function inspect() {                                                                // 1039
        return { state: "rejected", reason: reason };                                      // 1040
    });                                                                                    // 1041
                                                                                           // 1042
    // Note that the reason has not been handled.                                          // 1043
    trackRejection(rejection, reason);                                                     // 1044
                                                                                           // 1045
    return rejection;                                                                      // 1046
}                                                                                          // 1047
                                                                                           // 1048
/**                                                                                        // 1049
 * Constructs a fulfilled promise for an immediate reference.                              // 1050
 * @param value immediate reference                                                        // 1051
 */                                                                                        // 1052
Q.fulfill = fulfill;                                                                       // 1053
function fulfill(value) {                                                                  // 1054
    return Promise({                                                                       // 1055
        "when": function () {                                                              // 1056
            return value;                                                                  // 1057
        },                                                                                 // 1058
        "get": function (name) {                                                           // 1059
            return value[name];                                                            // 1060
        },                                                                                 // 1061
        "set": function (name, rhs) {                                                      // 1062
            value[name] = rhs;                                                             // 1063
        },                                                                                 // 1064
        "delete": function (name) {                                                        // 1065
            delete value[name];                                                            // 1066
        },                                                                                 // 1067
        "post": function (name, args) {                                                    // 1068
            // Mark Miller proposes that post with no name should apply a                  // 1069
            // promised function.                                                          // 1070
            if (name === null || name === void 0) {                                        // 1071
                return value.apply(void 0, args);                                          // 1072
            } else {                                                                       // 1073
                return value[name].apply(value, args);                                     // 1074
            }                                                                              // 1075
        },                                                                                 // 1076
        "apply": function (thisp, args) {                                                  // 1077
            return value.apply(thisp, args);                                               // 1078
        },                                                                                 // 1079
        "keys": function () {                                                              // 1080
            return object_keys(value);                                                     // 1081
        }                                                                                  // 1082
    }, void 0, function inspect() {                                                        // 1083
        return { state: "fulfilled", value: value };                                       // 1084
    });                                                                                    // 1085
}                                                                                          // 1086
                                                                                           // 1087
/**                                                                                        // 1088
 * Converts thenables to Q promises.                                                       // 1089
 * @param promise thenable promise                                                         // 1090
 * @returns a Q promise                                                                    // 1091
 */                                                                                        // 1092
function coerce(promise) {                                                                 // 1093
    var deferred = defer();                                                                // 1094
    nextTick(function () {                                                                 // 1095
        try {                                                                              // 1096
            promise.then(deferred.resolve, deferred.reject, deferred.notify);              // 1097
        } catch (exception) {                                                              // 1098
            deferred.reject(exception);                                                    // 1099
        }                                                                                  // 1100
    });                                                                                    // 1101
    return deferred.promise;                                                               // 1102
}                                                                                          // 1103
                                                                                           // 1104
/**                                                                                        // 1105
 * Annotates an object such that it will never be                                          // 1106
 * transferred away from this process over any promise                                     // 1107
 * communication channel.                                                                  // 1108
 * @param object                                                                           // 1109
 * @returns promise a wrapping of that object that                                         // 1110
 * additionally responds to the "isDef" message                                            // 1111
 * without a rejection.                                                                    // 1112
 */                                                                                        // 1113
Q.master = master;                                                                         // 1114
function master(object) {                                                                  // 1115
    return Promise({                                                                       // 1116
        "isDef": function () {}                                                            // 1117
    }, function fallback(op, args) {                                                       // 1118
        return dispatch(object, op, args);                                                 // 1119
    }, function () {                                                                       // 1120
        return Q(object).inspect();                                                        // 1121
    });                                                                                    // 1122
}                                                                                          // 1123
                                                                                           // 1124
/**                                                                                        // 1125
 * Spreads the values of a promised array of arguments into the                            // 1126
 * fulfillment callback.                                                                   // 1127
 * @param fulfilled callback that receives variadic arguments from the                     // 1128
 * promised array                                                                          // 1129
 * @param rejected callback that receives the exception if the promise                     // 1130
 * is rejected.                                                                            // 1131
 * @returns a promise for the return value or thrown exception of                          // 1132
 * either callback.                                                                        // 1133
 */                                                                                        // 1134
Q.spread = spread;                                                                         // 1135
function spread(value, fulfilled, rejected) {                                              // 1136
    return Q(value).spread(fulfilled, rejected);                                           // 1137
}                                                                                          // 1138
                                                                                           // 1139
Promise.prototype.spread = function (fulfilled, rejected) {                                // 1140
    return this.all().then(function (array) {                                              // 1141
        return fulfilled.apply(void 0, array);                                             // 1142
    }, rejected);                                                                          // 1143
};                                                                                         // 1144
                                                                                           // 1145
/**                                                                                        // 1146
 * The async function is a decorator for generator functions, turning                      // 1147
 * them into asynchronous generators.  Although generators are only part                   // 1148
 * of the newest ECMAScript 6 drafts, this code does not cause syntax                      // 1149
 * errors in older engines.  This code should continue to work and will                    // 1150
 * in fact improve over time as the language improves.                                     // 1151
 *                                                                                         // 1152
 * ES6 generators are currently part of V8 version 3.19 with the                           // 1153
 * --harmony-generators runtime flag enabled.  SpiderMonkey has had them                   // 1154
 * for longer, but under an older Python-inspired form.  This function                     // 1155
 * works on both kinds of generators.                                                      // 1156
 *                                                                                         // 1157
 * Decorates a generator function such that:                                               // 1158
 *  - it may yield promises                                                                // 1159
 *  - execution will continue when that promise is fulfilled                               // 1160
 *  - the value of the yield expression will be the fulfilled value                        // 1161
 *  - it returns a promise for the return value (when the generator                        // 1162
 *    stops iterating)                                                                     // 1163
 *  - the decorated function returns a promise for the return value                        // 1164
 *    of the generator or the first rejected promise among those                           // 1165
 *    yielded.                                                                             // 1166
 *  - if an error is thrown in the generator, it propagates through                        // 1167
 *    every following yield until it is caught, or until it escapes                        // 1168
 *    the generator function altogether, and is translated into a                          // 1169
 *    rejection for the promise returned by the decorated generator.                       // 1170
 */                                                                                        // 1171
Q.async = async;                                                                           // 1172
function async(makeGenerator) {                                                            // 1173
    return function () {                                                                   // 1174
        // when verb is "send", arg is a value                                             // 1175
        // when verb is "throw", arg is an exception                                       // 1176
        function continuer(verb, arg) {                                                    // 1177
            var result;                                                                    // 1178
                                                                                           // 1179
            // Until V8 3.19 / Chromium 29 is released, SpiderMonkey is the only           // 1180
            // engine that has a deployed base of browsers that support generators.        // 1181
            // However, SM's generators use the Python-inspired semantics of               // 1182
            // outdated ES6 drafts.  We would like to support ES6, but we'd also           // 1183
            // like to make it possible to use generators in deployed browsers, so         // 1184
            // we also support Python-style generators.  At some point we can remove       // 1185
            // this block.                                                                 // 1186
                                                                                           // 1187
            if (typeof StopIteration === "undefined") {                                    // 1188
                // ES6 Generators                                                          // 1189
                try {                                                                      // 1190
                    result = generator[verb](arg);                                         // 1191
                } catch (exception) {                                                      // 1192
                    return reject(exception);                                              // 1193
                }                                                                          // 1194
                if (result.done) {                                                         // 1195
                    return Q(result.value);                                                // 1196
                } else {                                                                   // 1197
                    return when(result.value, callback, errback);                          // 1198
                }                                                                          // 1199
            } else {                                                                       // 1200
                // SpiderMonkey Generators                                                 // 1201
                // FIXME: Remove this case when SM does ES6 generators.                    // 1202
                try {                                                                      // 1203
                    result = generator[verb](arg);                                         // 1204
                } catch (exception) {                                                      // 1205
                    if (isStopIteration(exception)) {                                      // 1206
                        return Q(exception.value);                                         // 1207
                    } else {                                                               // 1208
                        return reject(exception);                                          // 1209
                    }                                                                      // 1210
                }                                                                          // 1211
                return when(result, callback, errback);                                    // 1212
            }                                                                              // 1213
        }                                                                                  // 1214
        var generator = makeGenerator.apply(this, arguments);                              // 1215
        var callback = continuer.bind(continuer, "next");                                  // 1216
        var errback = continuer.bind(continuer, "throw");                                  // 1217
        return callback();                                                                 // 1218
    };                                                                                     // 1219
}                                                                                          // 1220
                                                                                           // 1221
/**                                                                                        // 1222
 * The spawn function is a small wrapper around async that immediately                     // 1223
 * calls the generator and also ends the promise chain, so that any                        // 1224
 * unhandled errors are thrown instead of forwarded to the error                           // 1225
 * handler. This is useful because it's extremely common to run                            // 1226
 * generators at the top-level to work with libraries.                                     // 1227
 */                                                                                        // 1228
Q.spawn = spawn;                                                                           // 1229
function spawn(makeGenerator) {                                                            // 1230
    Q.done(Q.async(makeGenerator)());                                                      // 1231
}                                                                                          // 1232
                                                                                           // 1233
// FIXME: Remove this interface once ES6 generators are in SpiderMonkey.                   // 1234
/**                                                                                        // 1235
 * Throws a ReturnValue exception to stop an asynchronous generator.                       // 1236
 *                                                                                         // 1237
 * This interface is a stop-gap measure to support generator return                        // 1238
 * values in older Firefox/SpiderMonkey.  In browsers that support ES6                     // 1239
 * generators like Chromium 29, just use "return" in your generator                        // 1240
 * functions.                                                                              // 1241
 *                                                                                         // 1242
 * @param value the return value for the surrounding generator                             // 1243
 * @throws ReturnValue exception with the value.                                           // 1244
 * @example                                                                                // 1245
 * // ES6 style                                                                            // 1246
 * Q.async(function* () {                                                                  // 1247
 *      var foo = yield getFooPromise();                                                   // 1248
 *      var bar = yield getBarPromise();                                                   // 1249
 *      return foo + bar;                                                                  // 1250
 * })                                                                                      // 1251
 * // Older SpiderMonkey style                                                             // 1252
 * Q.async(function () {                                                                   // 1253
 *      var foo = yield getFooPromise();                                                   // 1254
 *      var bar = yield getBarPromise();                                                   // 1255
 *      Q.return(foo + bar);                                                               // 1256
 * })                                                                                      // 1257
 */                                                                                        // 1258
Q["return"] = _return;                                                                     // 1259
function _return(value) {                                                                  // 1260
    throw new QReturnValue(value);                                                         // 1261
}                                                                                          // 1262
                                                                                           // 1263
/**                                                                                        // 1264
 * The promised function decorator ensures that any promise arguments                      // 1265
 * are settled and passed as values (`this` is also settled and passed                     // 1266
 * as a value).  It will also ensure that the result of a function is                      // 1267
 * always a promise.                                                                       // 1268
 *                                                                                         // 1269
 * @example                                                                                // 1270
 * var add = Q.promised(function (a, b) {                                                  // 1271
 *     return a + b;                                                                       // 1272
 * });                                                                                     // 1273
 * add(Q(a), Q(B));                                                                        // 1274
 *                                                                                         // 1275
 * @param {function} callback The function to decorate                                     // 1276
 * @returns {function} a function that has been decorated.                                 // 1277
 */                                                                                        // 1278
Q.promised = promised;                                                                     // 1279
function promised(callback) {                                                              // 1280
    return function () {                                                                   // 1281
        return spread([this, all(arguments)], function (self, args) {                      // 1282
            return callback.apply(self, args);                                             // 1283
        });                                                                                // 1284
    };                                                                                     // 1285
}                                                                                          // 1286
                                                                                           // 1287
/**                                                                                        // 1288
 * sends a message to a value in a future turn                                             // 1289
 * @param object* the recipient                                                            // 1290
 * @param op the name of the message operation, e.g., "when",                              // 1291
 * @param args further arguments to be forwarded to the operation                          // 1292
 * @returns result {Promise} a promise for the result of the operation                     // 1293
 */                                                                                        // 1294
Q.dispatch = dispatch;                                                                     // 1295
function dispatch(object, op, args) {                                                      // 1296
    return Q(object).dispatch(op, args);                                                   // 1297
}                                                                                          // 1298
                                                                                           // 1299
Promise.prototype.dispatch = function (op, args) {                                         // 1300
    var self = this;                                                                       // 1301
    var deferred = defer();                                                                // 1302
    nextTick(function () {                                                                 // 1303
        self.promiseDispatch(deferred.resolve, op, args);                                  // 1304
    });                                                                                    // 1305
    return deferred.promise;                                                               // 1306
};                                                                                         // 1307
                                                                                           // 1308
/**                                                                                        // 1309
 * Gets the value of a property in a future turn.                                          // 1310
 * @param object    promise or immediate reference for target object                       // 1311
 * @param name      name of property to get                                                // 1312
 * @return promise for the property value                                                  // 1313
 */                                                                                        // 1314
Q.get = function (object, key) {                                                           // 1315
    return Q(object).dispatch("get", [key]);                                               // 1316
};                                                                                         // 1317
                                                                                           // 1318
Promise.prototype.get = function (key) {                                                   // 1319
    return this.dispatch("get", [key]);                                                    // 1320
};                                                                                         // 1321
                                                                                           // 1322
/**                                                                                        // 1323
 * Sets the value of a property in a future turn.                                          // 1324
 * @param object    promise or immediate reference for object object                       // 1325
 * @param name      name of property to set                                                // 1326
 * @param value     new value of property                                                  // 1327
 * @return promise for the return value                                                    // 1328
 */                                                                                        // 1329
Q.set = function (object, key, value) {                                                    // 1330
    return Q(object).dispatch("set", [key, value]);                                        // 1331
};                                                                                         // 1332
                                                                                           // 1333
Promise.prototype.set = function (key, value) {                                            // 1334
    return this.dispatch("set", [key, value]);                                             // 1335
};                                                                                         // 1336
                                                                                           // 1337
/**                                                                                        // 1338
 * Deletes a property in a future turn.                                                    // 1339
 * @param object    promise or immediate reference for target object                       // 1340
 * @param name      name of property to delete                                             // 1341
 * @return promise for the return value                                                    // 1342
 */                                                                                        // 1343
Q.del = // XXX legacy                                                                      // 1344
Q["delete"] = function (object, key) {                                                     // 1345
    return Q(object).dispatch("delete", [key]);                                            // 1346
};                                                                                         // 1347
                                                                                           // 1348
Promise.prototype.del = // XXX legacy                                                      // 1349
Promise.prototype["delete"] = function (key) {                                             // 1350
    return this.dispatch("delete", [key]);                                                 // 1351
};                                                                                         // 1352
                                                                                           // 1353
/**                                                                                        // 1354
 * Invokes a method in a future turn.                                                      // 1355
 * @param object    promise or immediate reference for target object                       // 1356
 * @param name      name of method to invoke                                               // 1357
 * @param value     a value to post, typically an array of                                 // 1358
 *                  invocation arguments for promises that                                 // 1359
 *                  are ultimately backed with `resolve` values,                           // 1360
 *                  as opposed to those backed with URLs                                   // 1361
 *                  wherein the posted value can be any                                    // 1362
 *                  JSON serializable object.                                              // 1363
 * @return promise for the return value                                                    // 1364
 */                                                                                        // 1365
// bound locally because it is used by other methods                                       // 1366
Q.mapply = // XXX As proposed by "Redsandro"                                               // 1367
Q.post = function (object, name, args) {                                                   // 1368
    return Q(object).dispatch("post", [name, args]);                                       // 1369
};                                                                                         // 1370
                                                                                           // 1371
Promise.prototype.mapply = // XXX As proposed by "Redsandro"                               // 1372
Promise.prototype.post = function (name, args) {                                           // 1373
    return this.dispatch("post", [name, args]);                                            // 1374
};                                                                                         // 1375
                                                                                           // 1376
/**                                                                                        // 1377
 * Invokes a method in a future turn.                                                      // 1378
 * @param object    promise or immediate reference for target object                       // 1379
 * @param name      name of method to invoke                                               // 1380
 * @param ...args   array of invocation arguments                                          // 1381
 * @return promise for the return value                                                    // 1382
 */                                                                                        // 1383
Q.send = // XXX Mark Miller's proposed parlance                                            // 1384
Q.mcall = // XXX As proposed by "Redsandro"                                                // 1385
Q.invoke = function (object, name /*...args*/) {                                           // 1386
    return Q(object).dispatch("post", [name, array_slice(arguments, 2)]);                  // 1387
};                                                                                         // 1388
                                                                                           // 1389
Promise.prototype.send = // XXX Mark Miller's proposed parlance                            // 1390
Promise.prototype.mcall = // XXX As proposed by "Redsandro"                                // 1391
Promise.prototype.invoke = function (name /*...args*/) {                                   // 1392
    return this.dispatch("post", [name, array_slice(arguments, 1)]);                       // 1393
};                                                                                         // 1394
                                                                                           // 1395
/**                                                                                        // 1396
 * Applies the promised function in a future turn.                                         // 1397
 * @param object    promise or immediate reference for target function                     // 1398
 * @param args      array of application arguments                                         // 1399
 */                                                                                        // 1400
Q.fapply = function (object, args) {                                                       // 1401
    return Q(object).dispatch("apply", [void 0, args]);                                    // 1402
};                                                                                         // 1403
                                                                                           // 1404
Promise.prototype.fapply = function (args) {                                               // 1405
    return this.dispatch("apply", [void 0, args]);                                         // 1406
};                                                                                         // 1407
                                                                                           // 1408
/**                                                                                        // 1409
 * Calls the promised function in a future turn.                                           // 1410
 * @param object    promise or immediate reference for target function                     // 1411
 * @param ...args   array of application arguments                                         // 1412
 */                                                                                        // 1413
Q["try"] =                                                                                 // 1414
Q.fcall = function (object /* ...args*/) {                                                 // 1415
    return Q(object).dispatch("apply", [void 0, array_slice(arguments, 1)]);               // 1416
};                                                                                         // 1417
                                                                                           // 1418
Promise.prototype.fcall = function (/*...args*/) {                                         // 1419
    return this.dispatch("apply", [void 0, array_slice(arguments)]);                       // 1420
};                                                                                         // 1421
                                                                                           // 1422
/**                                                                                        // 1423
 * Binds the promised function, transforming return values into a fulfilled                // 1424
 * promise and thrown errors into a rejected one.                                          // 1425
 * @param object    promise or immediate reference for target function                     // 1426
 * @param ...args   array of application arguments                                         // 1427
 */                                                                                        // 1428
Q.fbind = function (object /*...args*/) {                                                  // 1429
    var promise = Q(object);                                                               // 1430
    var args = array_slice(arguments, 1);                                                  // 1431
    return function fbound() {                                                             // 1432
        return promise.dispatch("apply", [                                                 // 1433
            this,                                                                          // 1434
            args.concat(array_slice(arguments))                                            // 1435
        ]);                                                                                // 1436
    };                                                                                     // 1437
};                                                                                         // 1438
Promise.prototype.fbind = function (/*...args*/) {                                         // 1439
    var promise = this;                                                                    // 1440
    var args = array_slice(arguments);                                                     // 1441
    return function fbound() {                                                             // 1442
        return promise.dispatch("apply", [                                                 // 1443
            this,                                                                          // 1444
            args.concat(array_slice(arguments))                                            // 1445
        ]);                                                                                // 1446
    };                                                                                     // 1447
};                                                                                         // 1448
                                                                                           // 1449
/**                                                                                        // 1450
 * Requests the names of the owned properties of a promised                                // 1451
 * object in a future turn.                                                                // 1452
 * @param object    promise or immediate reference for target object                       // 1453
 * @return promise for the keys of the eventually settled object                           // 1454
 */                                                                                        // 1455
Q.keys = function (object) {                                                               // 1456
    return Q(object).dispatch("keys", []);                                                 // 1457
};                                                                                         // 1458
                                                                                           // 1459
Promise.prototype.keys = function () {                                                     // 1460
    return this.dispatch("keys", []);                                                      // 1461
};                                                                                         // 1462
                                                                                           // 1463
/**                                                                                        // 1464
 * Turns an array of promises into a promise for an array.  If any of                      // 1465
 * the promises gets rejected, the whole array is rejected immediately.                    // 1466
 * @param {Array*} an array (or promise for an array) of values (or                        // 1467
 * promises for values)                                                                    // 1468
 * @returns a promise for an array of the corresponding values                             // 1469
 */                                                                                        // 1470
// By Mark Miller                                                                          // 1471
// http://wiki.ecmascript.org/doku.php?id=strawman:concurrency&rev=1308776521#allfulfilled // 1472
Q.all = all;                                                                               // 1473
function all(promises) {                                                                   // 1474
    return when(promises, function (promises) {                                            // 1475
        var countDown = 0;                                                                 // 1476
        var deferred = defer();                                                            // 1477
        array_reduce(promises, function (undefined, promise, index) {                      // 1478
            var snapshot;                                                                  // 1479
            if (                                                                           // 1480
                isPromise(promise) &&                                                      // 1481
                (snapshot = promise.inspect()).state === "fulfilled"                       // 1482
            ) {                                                                            // 1483
                promises[index] = snapshot.value;                                          // 1484
            } else {                                                                       // 1485
                ++countDown;                                                               // 1486
                when(                                                                      // 1487
                    promise,                                                               // 1488
                    function (value) {                                                     // 1489
                        promises[index] = value;                                           // 1490
                        if (--countDown === 0) {                                           // 1491
                            deferred.resolve(promises);                                    // 1492
                        }                                                                  // 1493
                    },                                                                     // 1494
                    deferred.reject,                                                       // 1495
                    function (progress) {                                                  // 1496
                        deferred.notify({ index: index, value: progress });                // 1497
                    }                                                                      // 1498
                );                                                                         // 1499
            }                                                                              // 1500
        }, void 0);                                                                        // 1501
        if (countDown === 0) {                                                             // 1502
            deferred.resolve(promises);                                                    // 1503
        }                                                                                  // 1504
        return deferred.promise;                                                           // 1505
    });                                                                                    // 1506
}                                                                                          // 1507
                                                                                           // 1508
Promise.prototype.all = function () {                                                      // 1509
    return all(this);                                                                      // 1510
};                                                                                         // 1511
                                                                                           // 1512
/**                                                                                        // 1513
 * Waits for all promises to be settled, either fulfilled or                               // 1514
 * rejected.  This is distinct from `all` since that would stop                            // 1515
 * waiting at the first rejection.  The promise returned by                                // 1516
 * `allResolved` will never be rejected.                                                   // 1517
 * @param promises a promise for an array (or an array) of promises                        // 1518
 * (or values)                                                                             // 1519
 * @return a promise for an array of promises                                              // 1520
 */                                                                                        // 1521
Q.allResolved = deprecate(allResolved, "allResolved", "allSettled");                       // 1522
function allResolved(promises) {                                                           // 1523
    return when(promises, function (promises) {                                            // 1524
        promises = array_map(promises, Q);                                                 // 1525
        return when(all(array_map(promises, function (promise) {                           // 1526
            return when(promise, noop, noop);                                              // 1527
        })), function () {                                                                 // 1528
            return promises;                                                               // 1529
        });                                                                                // 1530
    });                                                                                    // 1531
}                                                                                          // 1532
                                                                                           // 1533
Promise.prototype.allResolved = function () {                                              // 1534
    return allResolved(this);                                                              // 1535
};                                                                                         // 1536
                                                                                           // 1537
/**                                                                                        // 1538
 * @see Promise#allSettled                                                                 // 1539
 */                                                                                        // 1540
Q.allSettled = allSettled;                                                                 // 1541
function allSettled(promises) {                                                            // 1542
    return Q(promises).allSettled();                                                       // 1543
}                                                                                          // 1544
                                                                                           // 1545
/**                                                                                        // 1546
 * Turns an array of promises into a promise for an array of their states (as              // 1547
 * returned by `inspect`) when they have all settled.                                      // 1548
 * @param {Array[Any*]} values an array (or promise for an array) of values (or            // 1549
 * promises for values)                                                                    // 1550
 * @returns {Array[State]} an array of states for the respective values.                   // 1551
 */                                                                                        // 1552
Promise.prototype.allSettled = function () {                                               // 1553
    return this.then(function (promises) {                                                 // 1554
        return all(array_map(promises, function (promise) {                                // 1555
            promise = Q(promise);                                                          // 1556
            function regardless() {                                                        // 1557
                return promise.inspect();                                                  // 1558
            }                                                                              // 1559
            return promise.then(regardless, regardless);                                   // 1560
        }));                                                                               // 1561
    });                                                                                    // 1562
};                                                                                         // 1563
                                                                                           // 1564
/**                                                                                        // 1565
 * Captures the failure of a promise, giving an oportunity to recover                      // 1566
 * with a callback.  If the given promise is fulfilled, the returned                       // 1567
 * promise is fulfilled.                                                                   // 1568
 * @param {Any*} promise for something                                                     // 1569
 * @param {Function} callback to fulfill the returned promise if the                       // 1570
 * given promise is rejected                                                               // 1571
 * @returns a promise for the return value of the callback                                 // 1572
 */                                                                                        // 1573
Q.fail = // XXX legacy                                                                     // 1574
Q["catch"] = function (object, rejected) {                                                 // 1575
    return Q(object).then(void 0, rejected);                                               // 1576
};                                                                                         // 1577
                                                                                           // 1578
Promise.prototype.fail = // XXX legacy                                                     // 1579
Promise.prototype["catch"] = function (rejected) {                                         // 1580
    return this.then(void 0, rejected);                                                    // 1581
};                                                                                         // 1582
                                                                                           // 1583
/**                                                                                        // 1584
 * Attaches a listener that can respond to progress notifications from a                   // 1585
 * promise's originating deferred. This listener receives the exact arguments              // 1586
 * passed to ``deferred.notify``.                                                          // 1587
 * @param {Any*} promise for something                                                     // 1588
 * @param {Function} callback to receive any progress notifications                        // 1589
 * @returns the given promise, unchanged                                                   // 1590
 */                                                                                        // 1591
Q.progress = progress;                                                                     // 1592
function progress(object, progressed) {                                                    // 1593
    return Q(object).then(void 0, void 0, progressed);                                     // 1594
}                                                                                          // 1595
                                                                                           // 1596
Promise.prototype.progress = function (progressed) {                                       // 1597
    return this.then(void 0, void 0, progressed);                                          // 1598
};                                                                                         // 1599
                                                                                           // 1600
/**                                                                                        // 1601
 * Provides an opportunity to observe the settling of a promise,                           // 1602
 * regardless of whether the promise is fulfilled or rejected.  Forwards                   // 1603
 * the resolution to the returned promise when the callback is done.                       // 1604
 * The callback can return a promise to defer completion.                                  // 1605
 * @param {Any*} promise                                                                   // 1606
 * @param {Function} callback to observe the resolution of the given                       // 1607
 * promise, takes no arguments.                                                            // 1608
 * @returns a promise for the resolution of the given promise when                         // 1609
 * ``fin`` is done.                                                                        // 1610
 */                                                                                        // 1611
Q.fin = // XXX legacy                                                                      // 1612
Q["finally"] = function (object, callback) {                                               // 1613
    return Q(object)["finally"](callback);                                                 // 1614
};                                                                                         // 1615
                                                                                           // 1616
Promise.prototype.fin = // XXX legacy                                                      // 1617
Promise.prototype["finally"] = function (callback) {                                       // 1618
    callback = Q(callback);                                                                // 1619
    return this.then(function (value) {                                                    // 1620
        return callback.fcall().then(function () {                                         // 1621
            return value;                                                                  // 1622
        });                                                                                // 1623
    }, function (reason) {                                                                 // 1624
        // TODO attempt to recycle the rejection with "this".                              // 1625
        return callback.fcall().then(function () {                                         // 1626
            throw reason;                                                                  // 1627
        });                                                                                // 1628
    });                                                                                    // 1629
};                                                                                         // 1630
                                                                                           // 1631
/**                                                                                        // 1632
 * Terminates a chain of promises, forcing rejections to be                                // 1633
 * thrown as exceptions.                                                                   // 1634
 * @param {Any*} promise at the end of a chain of promises                                 // 1635
 * @returns nothing                                                                        // 1636
 */                                                                                        // 1637
Q.done = function (object, fulfilled, rejected, progress) {                                // 1638
    return Q(object).done(fulfilled, rejected, progress);                                  // 1639
};                                                                                         // 1640
                                                                                           // 1641
Promise.prototype.done = function (fulfilled, rejected, progress) {                        // 1642
    var onUnhandledError = function (error) {                                              // 1643
        // forward to a future turn so that ``when``                                       // 1644
        // does not catch it and turn it into a rejection.                                 // 1645
        nextTick(function () {                                                             // 1646
            makeStackTraceLong(error, promise);                                            // 1647
            if (Q.onerror) {                                                               // 1648
                Q.onerror(error);                                                          // 1649
            } else {                                                                       // 1650
                throw error;                                                               // 1651
            }                                                                              // 1652
        });                                                                                // 1653
    };                                                                                     // 1654
                                                                                           // 1655
    // Avoid unnecessary `nextTick`ing via an unnecessary `when`.                          // 1656
    var promise = fulfilled || rejected || progress ?                                      // 1657
        this.then(fulfilled, rejected, progress) :                                         // 1658
        this;                                                                              // 1659
                                                                                           // 1660
    if (typeof process === "object" && process && process.domain) {                        // 1661
        onUnhandledError = process.domain.bind(onUnhandledError);                          // 1662
    }                                                                                      // 1663
                                                                                           // 1664
    promise.then(void 0, onUnhandledError);                                                // 1665
};                                                                                         // 1666
                                                                                           // 1667
/**                                                                                        // 1668
 * Causes a promise to be rejected if it does not get fulfilled before                     // 1669
 * some milliseconds time out.                                                             // 1670
 * @param {Any*} promise                                                                   // 1671
 * @param {Number} milliseconds timeout                                                    // 1672
 * @param {Any*} custom error message or Error object (optional)                           // 1673
 * @returns a promise for the resolution of the given promise if it is                     // 1674
 * fulfilled before the timeout, otherwise rejected.                                       // 1675
 */                                                                                        // 1676
Q.timeout = function (object, ms, error) {                                                 // 1677
    return Q(object).timeout(ms, error);                                                   // 1678
};                                                                                         // 1679
                                                                                           // 1680
Promise.prototype.timeout = function (ms, error) {                                         // 1681
    var deferred = defer();                                                                // 1682
    var timeoutId = setTimeout(function () {                                               // 1683
        if (!error || "string" === typeof error) {                                         // 1684
            error = new Error(error || "Timed out after " + ms + " ms");                   // 1685
            error.code = "ETIMEDOUT";                                                      // 1686
        }                                                                                  // 1687
        deferred.reject(error);                                                            // 1688
    }, ms);                                                                                // 1689
                                                                                           // 1690
    this.then(function (value) {                                                           // 1691
        clearTimeout(timeoutId);                                                           // 1692
        deferred.resolve(value);                                                           // 1693
    }, function (exception) {                                                              // 1694
        clearTimeout(timeoutId);                                                           // 1695
        deferred.reject(exception);                                                        // 1696
    }, deferred.notify);                                                                   // 1697
                                                                                           // 1698
    return deferred.promise;                                                               // 1699
};                                                                                         // 1700
                                                                                           // 1701
/**                                                                                        // 1702
 * Returns a promise for the given value (or promised value), some                         // 1703
 * milliseconds after it resolved. Passes rejections immediately.                          // 1704
 * @param {Any*} promise                                                                   // 1705
 * @param {Number} milliseconds                                                            // 1706
 * @returns a promise for the resolution of the given promise after milliseconds           // 1707
 * time has elapsed since the resolution of the given promise.                             // 1708
 * If the given promise rejects, that is passed immediately.                               // 1709
 */                                                                                        // 1710
Q.delay = function (object, timeout) {                                                     // 1711
    if (timeout === void 0) {                                                              // 1712
        timeout = object;                                                                  // 1713
        object = void 0;                                                                   // 1714
    }                                                                                      // 1715
    return Q(object).delay(timeout);                                                       // 1716
};                                                                                         // 1717
                                                                                           // 1718
Promise.prototype.delay = function (timeout) {                                             // 1719
    return this.then(function (value) {                                                    // 1720
        var deferred = defer();                                                            // 1721
        setTimeout(function () {                                                           // 1722
            deferred.resolve(value);                                                       // 1723
        }, timeout);                                                                       // 1724
        return deferred.promise;                                                           // 1725
    });                                                                                    // 1726
};                                                                                         // 1727
                                                                                           // 1728
/**                                                                                        // 1729
 * Passes a continuation to a Node function, which is called with the given                // 1730
 * arguments provided as an array, and returns a promise.                                  // 1731
 *                                                                                         // 1732
 *      Q.nfapply(FS.readFile, [__filename])                                               // 1733
 *      .then(function (content) {                                                         // 1734
 *      })                                                                                 // 1735
 *                                                                                         // 1736
 */                                                                                        // 1737
Q.nfapply = function (callback, args) {                                                    // 1738
    return Q(callback).nfapply(args);                                                      // 1739
};                                                                                         // 1740
                                                                                           // 1741
Promise.prototype.nfapply = function (args) {                                              // 1742
    var deferred = defer();                                                                // 1743
    var nodeArgs = array_slice(args);                                                      // 1744
    nodeArgs.push(deferred.makeNodeResolver());                                            // 1745
    this.fapply(nodeArgs).fail(deferred.reject);                                           // 1746
    return deferred.promise;                                                               // 1747
};                                                                                         // 1748
                                                                                           // 1749
/**                                                                                        // 1750
 * Passes a continuation to a Node function, which is called with the given                // 1751
 * arguments provided individually, and returns a promise.                                 // 1752
 * @example                                                                                // 1753
 * Q.nfcall(FS.readFile, __filename)                                                       // 1754
 * .then(function (content) {                                                              // 1755
 * })                                                                                      // 1756
 *                                                                                         // 1757
 */                                                                                        // 1758
Q.nfcall = function (callback /*...args*/) {                                               // 1759
    var args = array_slice(arguments, 1);                                                  // 1760
    return Q(callback).nfapply(args);                                                      // 1761
};                                                                                         // 1762
                                                                                           // 1763
Promise.prototype.nfcall = function (/*...args*/) {                                        // 1764
    var nodeArgs = array_slice(arguments);                                                 // 1765
    var deferred = defer();                                                                // 1766
    nodeArgs.push(deferred.makeNodeResolver());                                            // 1767
    this.fapply(nodeArgs).fail(deferred.reject);                                           // 1768
    return deferred.promise;                                                               // 1769
};                                                                                         // 1770
                                                                                           // 1771
/**                                                                                        // 1772
 * Wraps a NodeJS continuation passing function and returns an equivalent                  // 1773
 * version that returns a promise.                                                         // 1774
 * @example                                                                                // 1775
 * Q.nfbind(FS.readFile, __filename)("utf-8")                                              // 1776
 * .then(console.log)                                                                      // 1777
 * .done()                                                                                 // 1778
 */                                                                                        // 1779
Q.nfbind =                                                                                 // 1780
Q.denodeify = function (callback /*...args*/) {                                            // 1781
    var baseArgs = array_slice(arguments, 1);                                              // 1782
    return function () {                                                                   // 1783
        var nodeArgs = baseArgs.concat(array_slice(arguments));                            // 1784
        var deferred = defer();                                                            // 1785
        nodeArgs.push(deferred.makeNodeResolver());                                        // 1786
        Q(callback).fapply(nodeArgs).fail(deferred.reject);                                // 1787
        return deferred.promise;                                                           // 1788
    };                                                                                     // 1789
};                                                                                         // 1790
                                                                                           // 1791
Promise.prototype.nfbind =                                                                 // 1792
Promise.prototype.denodeify = function (/*...args*/) {                                     // 1793
    var args = array_slice(arguments);                                                     // 1794
    args.unshift(this);                                                                    // 1795
    return Q.denodeify.apply(void 0, args);                                                // 1796
};                                                                                         // 1797
                                                                                           // 1798
Q.nbind = function (callback, thisp /*...args*/) {                                         // 1799
    var baseArgs = array_slice(arguments, 2);                                              // 1800
    return function () {                                                                   // 1801
        var nodeArgs = baseArgs.concat(array_slice(arguments));                            // 1802
        var deferred = defer();                                                            // 1803
        nodeArgs.push(deferred.makeNodeResolver());                                        // 1804
        function bound() {                                                                 // 1805
            return callback.apply(thisp, arguments);                                       // 1806
        }                                                                                  // 1807
        Q(bound).fapply(nodeArgs).fail(deferred.reject);                                   // 1808
        return deferred.promise;                                                           // 1809
    };                                                                                     // 1810
};                                                                                         // 1811
                                                                                           // 1812
Promise.prototype.nbind = function (/*thisp, ...args*/) {                                  // 1813
    var args = array_slice(arguments, 0);                                                  // 1814
    args.unshift(this);                                                                    // 1815
    return Q.nbind.apply(void 0, args);                                                    // 1816
};                                                                                         // 1817
                                                                                           // 1818
/**                                                                                        // 1819
 * Calls a method of a Node-style object that accepts a Node-style                         // 1820
 * callback with a given array of arguments, plus a provided callback.                     // 1821
 * @param object an object that has the named method                                       // 1822
 * @param {String} name name of the method of object                                       // 1823
 * @param {Array} args arguments to pass to the method; the callback                       // 1824
 * will be provided by Q and appended to these arguments.                                  // 1825
 * @returns a promise for the value or error                                               // 1826
 */                                                                                        // 1827
Q.nmapply = // XXX As proposed by "Redsandro"                                              // 1828
Q.npost = function (object, name, args) {                                                  // 1829
    return Q(object).npost(name, args);                                                    // 1830
};                                                                                         // 1831
                                                                                           // 1832
Promise.prototype.nmapply = // XXX As proposed by "Redsandro"                              // 1833
Promise.prototype.npost = function (name, args) {                                          // 1834
    var nodeArgs = array_slice(args || []);                                                // 1835
    var deferred = defer();                                                                // 1836
    nodeArgs.push(deferred.makeNodeResolver());                                            // 1837
    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);                         // 1838
    return deferred.promise;                                                               // 1839
};                                                                                         // 1840
                                                                                           // 1841
/**                                                                                        // 1842
 * Calls a method of a Node-style object that accepts a Node-style                         // 1843
 * callback, forwarding the given variadic arguments, plus a provided                      // 1844
 * callback argument.                                                                      // 1845
 * @param object an object that has the named method                                       // 1846
 * @param {String} name name of the method of object                                       // 1847
 * @param ...args arguments to pass to the method; the callback will                       // 1848
 * be provided by Q and appended to these arguments.                                       // 1849
 * @returns a promise for the value or error                                               // 1850
 */                                                                                        // 1851
Q.nsend = // XXX Based on Mark Miller's proposed "send"                                    // 1852
Q.nmcall = // XXX Based on "Redsandro's" proposal                                          // 1853
Q.ninvoke = function (object, name /*...args*/) {                                          // 1854
    var nodeArgs = array_slice(arguments, 2);                                              // 1855
    var deferred = defer();                                                                // 1856
    nodeArgs.push(deferred.makeNodeResolver());                                            // 1857
    Q(object).dispatch("post", [name, nodeArgs]).fail(deferred.reject);                    // 1858
    return deferred.promise;                                                               // 1859
};                                                                                         // 1860
                                                                                           // 1861
Promise.prototype.nsend = // XXX Based on Mark Miller's proposed "send"                    // 1862
Promise.prototype.nmcall = // XXX Based on "Redsandro's" proposal                          // 1863
Promise.prototype.ninvoke = function (name /*...args*/) {                                  // 1864
    var nodeArgs = array_slice(arguments, 1);                                              // 1865
    var deferred = defer();                                                                // 1866
    nodeArgs.push(deferred.makeNodeResolver());                                            // 1867
    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);                         // 1868
    return deferred.promise;                                                               // 1869
};                                                                                         // 1870
                                                                                           // 1871
/**                                                                                        // 1872
 * If a function would like to support both Node continuation-passing-style and            // 1873
 * promise-returning-style, it can end its internal promise chain with                     // 1874
 * `nodeify(nodeback)`, forwarding the optional nodeback argument.  If the user            // 1875
 * elects to use a nodeback, the result will be sent there.  If they do not                // 1876
 * pass a nodeback, they will receive the result promise.                                  // 1877
 * @param object a result (or a promise for a result)                                      // 1878
 * @param {Function} nodeback a Node.js-style callback                                     // 1879
 * @returns either the promise or nothing                                                  // 1880
 */                                                                                        // 1881
Q.nodeify = nodeify;                                                                       // 1882
function nodeify(object, nodeback) {                                                       // 1883
    return Q(object).nodeify(nodeback);                                                    // 1884
}                                                                                          // 1885
                                                                                           // 1886
Promise.prototype.nodeify = function (nodeback) {                                          // 1887
    if (nodeback) {                                                                        // 1888
        this.then(function (value) {                                                       // 1889
            nextTick(function () {                                                         // 1890
                nodeback(null, value);                                                     // 1891
            });                                                                            // 1892
        }, function (error) {                                                              // 1893
            nextTick(function () {                                                         // 1894
                nodeback(error);                                                           // 1895
            });                                                                            // 1896
        });                                                                                // 1897
    } else {                                                                               // 1898
        return this;                                                                       // 1899
    }                                                                                      // 1900
};                                                                                         // 1901
                                                                                           // 1902
// All code before this point will be filtered from stack traces.                          // 1903
var qEndingLine = captureLine();                                                           // 1904
                                                                                           // 1905
return Q;                                                                                  // 1906
                                                                                           // 1907
});                                                                                        // 1908
                                                                                           // 1909
/////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);

/////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['mrt:q'] = {}, {
  Q: Q
});

})();
