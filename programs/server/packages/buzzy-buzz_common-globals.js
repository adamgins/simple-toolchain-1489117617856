(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var moment = Package['momentjs:moment'].moment;
var meteorInstall = Package.modules.meteorInstall;
var Buffer = Package.modules.Buffer;
var process = Package.modules.process;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var App, BuzzyGlobal, i;

var require = meteorInstall({"node_modules":{"meteor":{"buzzy-buzz:common-globals":{"lib":{"common-globals.js":["babel-runtime/helpers/typeof","ics-js",function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/buzzy-buzz_common-globals/lib/common-globals.js                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _typeof;module.import("babel-runtime/helpers/typeof",{"default":function(v){_typeof=v}});                         //
// Write your package code here!                                                                                      // 1
App = {};                                                                                                             // 2
                                                                                                                      //
var ICS = require('ics-js');                                                                                          // 5
                                                                                                                      //
BuzzyGlobal = new function () {                                                                                       // 8
    this.WAIT_PHRASE = ["We're crunching the numbers. Sit tight!", "We're retrieving your Buzz.", "We're ironing your Buzz. Here it comes...", "We've sent the monkeys to fetch your Buzz. Please sit tight.", "Sit tight. We're busy buzzing your buzz.", "Hold that thought whilst we retrieve your Buzz.",, "We'll have your stuff in 3 push-ups. Go!", "We're sending in the troops to get your Buzz data...", "We will be right with you. Just fetching your Buzz.", "Thank your lucky stars! We're fetching your Buzz.", "Sit back. Relax. We're juicing your Buzz.", "The monkeys are grabbing your Buzz.", "Buzz me up Scotty! We're just pulling your Buzz together.", "We're just unwrapping your Buzz...", "We're squeezing your Buzz. Here it comes...", "We're just glueing your Buzz together...", "We're extracting your Buzz..."];
    //this.COLLECTIONFS_BASEURL="/files/files";                                                                       // 10
    this.REGEX_EMAIL = '([a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@' + '(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)';
                                                                                                                      //
    this.REGEX_PHONE = /^\+(?:[0-9] ?){6,14}[0-9]$/;                                                                  // 14
    this.gSORT_ORDER = {                                                                                              // 15
        ASCENDING: 'asc', DESCENDING: 'des' };                                                                        // 16
    this.gCOMMENT_LIMIT = 20;                                                                                         // 17
    this.gACTIVITY_LIMIT = 15;                                                                                        // 18
    this.gCOMMENT_PAGE_LIMIT = 50;                                                                                    // 19
    this.gMICROAPPDATA_LIMIT = 10;                                                                                    // 20
    this.gCOMMENT_MAX_LIMIT = 500;                                                                                    // 21
    this.gDEFAULT_LIMIT = 10;                                                                                         // 22
    this.gCOMMENT_TRUNCATE = 100;                                                                                     // 23
    this.gMAX_HISTORY = 10;                                                                                           // 24
    this.gMAX_COLLAGE = 7;                                                                                            // 25
    this.gFILEPICKER_EXPIRY = 1000 + 60 * 60 * 24 * 365 * 100;                                                        // 26
                                                                                                                      //
    this.gPLAN_TYPE = {                                                                                               // 28
        BASIC: 'buzzy_basic', PRO: 'buzzy_pro', ENTERPRISE: 'buzzy_enterprise' };                                     // 29
    this.gMEMBER_TYPE = {                                                                                             // 30
        ADMIN: 'admin', MEMBER: 'member' };                                                                           // 31
    this.gAddMembersExtraLimit = 10;                                                                                  // 32
                                                                                                                      //
    this.gMAX_LINK_DISPLAY_LENGTH = 40;                                                                               // 34
                                                                                                                      //
    this.gNOTIFICATION_CHANNEL = {                                                                                    // 36
        EMAIL: 'email', SMS: 'sms' };                                                                                 // 37
    this.gNOTIFICATION_ACTIONS = {                                                                                    // 38
        ADD: 'add', REMOVE: 'remove' };                                                                               // 39
    this.gIMAGE_QUALITY = 100;                                                                                        // 40
    this.gBASICTYPES = {                                                                                              // 41
        BUZZ: 'buzz', TEXT: 'text', COMMENTS: 'comments', IMAGE: 'buzzyimage', VIDEO: 'video',                        // 42
        EMBEDDED_LINK: 'EmbeddedLink', ATTACHMENT: 'attachment', TAG_QUERY: 'tag-query',                              // 43
        CONTENT_LAYOUT_ROW: 'content-layout-row', CONTENT_LAYOUT_COLUMN: 'content-layout-column', META_FIELD: 'meta-field',
        SLIDESHOW: 'slideshow', GALLERY: 'gallery', TWITTER: 'twitter', EXTERNAL_SERVICE: 'external-service', GOOGLE_MAP: 'googlemap',
        TABLE: 'table', GOOGLE_DRIVE: 'googledrive', FILEPICKER_GALLERY: 'filepickergallery',                         // 46
        FILEPICKER: 'filepicker', APPLICATION: 'application', RESTCALL: 'rest', BUTTON: 'button',                     // 47
        PAYMENT: 'payment', EMBED_BUZZ: 'embeddedBuzz', GIPHY: 'giphy'                                                // 48
                                                                                                                      //
    };                                                                                                                // 41
    this.gPAYMENT_TYPE = { FIXED: 'fixed', VARIABLE: 'variable' };                                                    // 51
    this.gMICROAPP_TYPE = { DISPLAY_COLLAPSE: 'displayCollapse', SUBMIT_STYLE: 'submitStyle', DISPLAY_MODAL: 'displayModal' };
    this.gMICROAPP_RATING_ICON = { STAR: 'star', HEART: 'heart', CHECK: 'check', SQUARE: 'square', BOLT: 'bolt', USD: 'usd' };
                                                                                                                      //
    this.gBUZZ_LINK_TYPE = { BUTTON: 'button', IMAGE: 'image' };                                                      // 56
    this.gMICROAPP_PERMISSION_WHOCANVIEW = {                                                                          // 57
        OWNER_AUTHOR_CREATOR: 'ownerauthorcreator', AUDIENCE_OWNER_AUTHOR: 'audienceownerauthor', OWNER_AUTHOR_CREATORS_VIEWERS: 'ownerauthorcreatorviewers' };
    this.gMICROAPP_SUBMIT_TYPE = { INLINE: 'inline', MODAL: 'modal', NOFORM: 'noform' };                              // 59
    this.gMICROAPP_ACTION_RULE_CONDITION = { SUBMITTED: 'submitted', EDITED: 'edited', DELETED: 'deleted' };          // 60
    this.gAPPFIELD_LISTTYPE = { CHECKLIST: 'checklist', BUTTONS: 'buttons', SELECTBOX: 'selectbox' };                 // 61
    this.gAPPFIELD_VOTE_DISPLAY = { BY_USER: 'user', BY_OPTION: 'option', NONE: 'none' };                             // 62
    this.gAPPFIELD_COLLAPSE = { COLLAPSE: 'collapse', XS: 'xs', S: 's', MD: 'md', L: 'l' };                           // 63
    this.gAPPFIELD_DEFAULT_USETVOTE = {                                                                               // 64
        value: 'Yes',                                                                                                 // 65
        option: {                                                                                                     // 66
            alloWMultiple: true,                                                                                      // 67
            displayAs: this.gAPPFIELD_LISTTYPE.BUTTONS,                                                               // 68
            displayResults: this.gAPPFIELD_VOTE_DISPLAY.BY_USER                                                       // 69
        }                                                                                                             // 66
    };                                                                                                                // 64
                                                                                                                      //
    this.gWATSON_SERVICE_TYPES = { PERSONALITY_INSIGHTS: 'watsonPersonalityInsights', CONVERSATION: 'watsonConversation' };
                                                                                                                      //
    this.gAPPFIELDTYPE = { CHECKBOX: 'checkbox', TEXT: 'text', NUMBER: 'number', DATETIME: 'datetime', EVENT: 'event', USERVOTE: 'uservote',
        AUTHOR: 'author', SUBMITTED: 'submitted', MAP: 'map', SELECT: 'select', RATING: 'rating', ATTACHMENTS: 'attachments',
        FILE_ATTACHMENTS: 'files', IMAGE_ATTACHMENTS: 'images', PAYMENT: 'payment', VIEWERS: 'viewers', ROW_SELECTOR: 'rowselector', TWITTER_FEED: 'twitterFeed', WATSON_PERSONALITY_VIEW: 'watsonPersonalityView' };
    this.gAPPFIELD_DATETYPE = {                                                                                       // 78
        DATETIME: { type: 'datetime', format: 'h:mm a D MMM YYYY' },                                                  // 79
        TIME: { type: 'time', format: 'LT' },                                                                         // 80
        DATE: { type: 'date', format: 'D MMM YYYY' },                                                                 // 81
        MONTH: { type: 'month', format: 'MMM' },                                                                      // 82
        YEAR: { type: 'year', format: 'YYYY' },                                                                       // 83
        EVENT: { type: 'event', format: 'h:mm a D MMM YYYY' }                                                         // 84
    };                                                                                                                // 78
    this.gAPPFIELD_INTERACT = { ANYONE: 'anyone', OWNERS_AND_AUTHORS: 'ownerauthor',                                  // 86
        AUDIENCE_OWNERS_AND_AUTHORS: 'audienceownerauthor', OWNERSAUTHOR_AND_CREATORS: 'ownerauthorcreator' };        // 87
    this.gROLES = { ANYONE: 'anyone', OWNER: 'owner', AUTHOR: 'author', AUDIENCE: 'audience', FOLLOWER: 'follower' };
    this.gPRIVACY = { PRIVATE: 'private', UNLISTED: 'unlisted', PUBLIC: 'public' };                                   // 89
    this.gRESOURCE_STATUS = { DRAFT: 'draft', PUBLISHED: 'published', ARCHIVED: 'archived', DELETED: 'deleted' };     // 90
                                                                                                                      //
    this.gCOMMENTSTATUS = { LIVE: 'live', DELETED: 'deleted', FLAGGED: 'flagged', WAITING_APPROVAL: 'waiting-approval' };
    this.gCOMMENTTYPE = { TEXT: 'text', IMAGE: 'image', VIDEO: 'video', FILE: 'file',                                 // 93
        TWITTER: 'twitter', LINK: 'link', GOOGLEMAP: "googlemap", IMAGE_LIST: "imagelist",                            // 94
        FILE_LIST: "file_list", FILEPICKER_LIST: "filepicker_list", URL_LIST: "url_list",                             // 95
        GIPHY: "giphy", PAYMENT: "payment" };                                                                         // 96
    this.gCOMMENTSHOW = { NONE: 'none', INLINE: 'along-side', MODAL: 'modal' };                                       // 97
                                                                                                                      //
    this.gUSERSTATUS = { PENDING: 'pending', ACTIVE: 'active' };                                                      // 99
                                                                                                                      //
    this.gSPECIALBASICTYPES = [this.gBASICTYPES.TEXT, this.gBASICTYPES.GALLERY, this.gBASICTYPES.VIDEO, this.gBASICTYPES.EXTERNAL_SERVICE];
                                                                                                                      //
    this.gEXTERNALSERVICES = [this.gBASICTYPES.TWITTER, this.gBASICTYPES.EMBEDDED_LINK, this.gBASICTYPES.GOOGLE_MAP, this.gBASICTYPES.RESTCALL];
                                                                                                                      //
    this.gSPECIALBASICTYPESCACHE = [];                                                                                // 113
                                                                                                                      //
    this.gACTIONS = { COMMENTED: { type: 'commented', message: 'commented on' }, SENT_TO_ALL: { type: 'send', message: 'sent to all' }, PUBLISHED: { type: 'published', message: 'published' }, DRAFT: { type: 'draft', message: 'created a draft' }, NOTIFIED: { type: 'notified', message: 'notified' }, SEND: { type: 'send', message: 'sent something related to' } };
    this.gUSER_LIMIT = 9;                                                                                             // 116
    this.gUSER_CONTACTS_LIMIT = 200;                                                                                  // 117
    this.gTRUNCATE_COMMENT_TEXT = 40;                                                                                 // 118
    this.gFormatDate = function (inputDate, options, timezone) {                                                      // 119
        if (inputDate && typeof options === "undefined") {                                                            // 120
            return moment(inputDate).format('DD MMM YYYY');                                                           // 121
        } else if (inputDate && typeof options !== "undefined") {                                                     // 122
            if (options && timezone && typeof timezone !== "undefined") {                                             // 123
                console.log(inputDate, options, timezone);                                                            // 124
                return moment(inputDate).tz(timezone).format(options);                                                // 125
            } else {                                                                                                  // 126
                return moment(inputDate).format(options);                                                             // 127
            }                                                                                                         // 128
        } else {                                                                                                      // 130
            return;                                                                                                   // 131
        }                                                                                                             // 132
    };                                                                                                                // 133
                                                                                                                      //
    this.getCurrentUser = function (optToken) {                                                                       // 135
        var user = Meteor.user();                                                                                     // 136
        if (!user && typeof optToken !== "undefined") {                                                               // 137
            user = Meteor.users.findOne({                                                                             // 138
                "services.resume.loginTokens.hashedToken": optToken                                                   // 139
            });                                                                                                       // 138
        }                                                                                                             // 142
        return user;                                                                                                  // 143
    };                                                                                                                // 144
                                                                                                                      //
    this.isLoggedIn = function (userID, doc) {                                                                        // 146
        return Meteor.userId() === userID;                                                                            // 147
    };                                                                                                                // 148
                                                                                                                      //
    this.isValidNumber = function (number) {                                                                          // 150
        var rgx = /^[0-9]*\.?[0-9]*$/;                                                                                // 151
        return number.match(rgx);                                                                                     // 152
    };                                                                                                                // 153
                                                                                                                      //
    this.formatCurrency = function (number, currency) {                                                               // 155
        if (currency) {                                                                                               // 156
            return currency.toUpperCase() + " " + number.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");       // 157
        } else {                                                                                                      // 158
            return number.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");                                      // 159
        }                                                                                                             // 160
    };                                                                                                                // 162
    this.recalcTotalPayment = function (payment, amount) {                                                            // 163
                                                                                                                      //
        var fee = 0;                                                                                                  // 165
        if (amount) {                                                                                                 // 166
            if (payment.hasFeeBuffer) {                                                                               // 167
                if (payment.applyFeeFixed || payment.applyFeeVariable) {                                              // 168
                    fee = payment.feeFixed + amount * payment.feePercent;                                             // 169
                }                                                                                                     // 170
            }                                                                                                         // 172
                                                                                                                      //
            return parseInt(amount + fee);                                                                            // 174
        } else {                                                                                                      // 175
            return 0;                                                                                                 // 176
        }                                                                                                             // 177
    };                                                                                                                // 179
    this.recalcAmount = function (payment) {                                                                          // 180
                                                                                                                      //
        var amount = 0;                                                                                               // 182
        if (payment.totalAmount) {                                                                                    // 183
            amount = payment.totalAmount;                                                                             // 184
            if (payment.hasFeeBuffer) {                                                                               // 185
                if (payment.applyFeeFixed || payment.applyFeeVariable) {                                              // 186
                    amount = (payment.totalAmount - payment.feeFixed) / (1 + payment.feePercent);                     // 187
                }                                                                                                     // 188
            }                                                                                                         // 190
            return parseInt(amount);                                                                                  // 191
        } else {                                                                                                      // 192
            return 0;                                                                                                 // 193
        }                                                                                                             // 194
    };                                                                                                                // 196
                                                                                                                      //
    this.gRandomNumForLimit = function (limit) {                                                                      // 198
        return Math.floor(Math.random() * limit) + 1;                                                                 // 199
    };                                                                                                                // 201
    this.gGetFilePickerHandle = function (inputURL) {                                                                 // 202
        if (inputURL.indexOf("?") === -1) {                                                                           // 203
            return inputURL.slice("https://www.filepicker.io/api/file/".length);                                      // 204
        } else {                                                                                                      // 205
            return inputURL.match("https://www.filepicker.io/api/file/(.*)/")[1];                                     // 206
        }                                                                                                             // 207
    };                                                                                                                // 208
                                                                                                                      //
    this.throwError = function (message, type) {                                                                      // 210
        if (Meteor.isClient) {                                                                                        // 211
            Errors.insert({ message: message, seen: false, type: type });                                             // 212
        } else {                                                                                                      // 213
            console.log("BUZZY ERROR:", message, type);                                                               // 214
            //throw new Meteor.Error("Buzzy Error", message);                                                         // 215
        }                                                                                                             // 216
    };                                                                                                                // 218
    this.gCapitalizeFirstLetter = function (inpStr) {                                                                 // 219
        if (inpStr) {                                                                                                 // 220
            return inpStr.charAt(0).toUpperCase() + inpStr.slice(1);                                                  // 221
        }                                                                                                             // 222
    };                                                                                                                // 224
    this.gIsValidPhonenumber = function (phonenumber) {                                                               // 225
        var phoneno = /^\+(?:[0-9] ?){6,14}[0-9]$/;                                                                   // 226
        if (phonenumber.match(phoneno)) {                                                                             // 227
                                                                                                                      //
            return true;                                                                                              // 230
        } else {                                                                                                      // 231
                                                                                                                      //
            return false;                                                                                             // 235
        }                                                                                                             // 236
    };                                                                                                                // 237
                                                                                                                      //
    this.IndexOfObjectInArray = function (myArray, property, searchTerm) {                                            // 239
        console.log("about to search", myArray, property, searchTerm);                                                // 240
        for (var i = 0, len = myArray.length; i < len; i++) {                                                         // 241
            console.log(i, myArray[i], myArray[i][property], property, searchTerm);                                   // 242
            if (myArray[i][property] === searchTerm) return i;                                                        // 243
        }                                                                                                             // 244
        return -1;                                                                                                    // 245
    };                                                                                                                // 246
                                                                                                                      //
    this.gEmailIsVerified = function (user, email) {                                                                  // 249
                                                                                                                      //
        if (typeof user.emails !== "undefined") {                                                                     // 251
                                                                                                                      //
            var indexOfEmail = BuzzyGlobal.IndexOfObjectInArray(user.emails, "address", email);                       // 254
                                                                                                                      //
            if (indexOfEmail === -1) {                                                                                // 256
                return false;                                                                                         // 257
            } else {                                                                                                  // 258
                return user.emails[indexOfEmail].verified;                                                            // 259
            }                                                                                                         // 260
        } else {                                                                                                      // 261
                                                                                                                      //
            return false;                                                                                             // 263
        }                                                                                                             // 264
    };                                                                                                                // 265
                                                                                                                      //
    this.gIsValidEmail = function (email) {                                                                           // 267
        var regex = new RegExp('^' + BuzzyGlobal.REGEX_EMAIL + '$', 'i');                                             // 268
        var match = email.match(regex);                                                                               // 269
        if (match) {                                                                                                  // 270
            return true;                                                                                              // 271
        } else {                                                                                                      // 272
            return false;                                                                                             // 273
        }                                                                                                             // 274
    };                                                                                                                // 275
    this.gIsCommentModerator = function (userID, resourceID) {                                                        // 276
        var currentResource = Resources.findOne({ _id: resourceID });                                                 // 277
                                                                                                                      //
        if (currentResource && (currentResource.editors.indexOf(userID) != -1 || currentResource.owners.indexOf(userID) != -1)) {
                                                                                                                      //
            return true;                                                                                              // 281
        } else {                                                                                                      // 282
            return false;                                                                                             // 283
        }                                                                                                             // 284
    };                                                                                                                // 285
    this.gGetSortFilter = function (chosenSortFilter) {                                                               // 286
        var sortFilter;                                                                                               // 287
        switch (chosenSortFilter) {                                                                                   // 288
            case 'recently-updated':                                                                                  // 289
                return sortFilter = { updated: -1 };                                                                  // 290
                break;                                                                                                // 291
            case 'by-name':                                                                                           // 292
                return sortFilter = { title: 1 };                                                                     // 293
                break;                                                                                                // 294
            default:                                                                                                  // 295
                return sortFilter = { updated: -1 };                                                                  // 296
                                                                                                                      //
        }                                                                                                             // 288
    };                                                                                                                // 300
                                                                                                                      //
    this.gGetUserforEmail = function (email) {                                                                        // 302
                                                                                                                      //
        var lowerCaseEmail = email.toLowerCase();                                                                     // 304
        console.log("BuzzyGlobal.gGetUserforEmail: " + lowerCaseEmail);                                               // 305
        return Users.findOne({ $or: [{ 'services.google.email': lowerCaseEmail }, { 'services.facebook.email': lowerCaseEmail }, { 'emails.address': lowerCaseEmail }, { 'email': lowerCaseEmail }] });
    };                                                                                                                // 314
                                                                                                                      //
    this.gGetUserFormattedEmail = function (user) {                                                                   // 316
        var userName = BuzzyGlobal.gGetUserName(user);                                                                // 317
        var userEmail = BuzzyGlobal.gGetUserEmail(user);                                                              // 318
        if (userName !== userEmail) {                                                                                 // 319
            return userName + " <" + userEmail + ">";                                                                 // 320
        } else {                                                                                                      // 321
            return userEmail;                                                                                         // 322
        }                                                                                                             // 323
    };                                                                                                                // 325
                                                                                                                      //
    this.gGetUserEmail = function (user) {                                                                            // 327
        var email;                                                                                                    // 328
        try {                                                                                                         // 329
            if (typeof user.email != 'undefined') {                                                                   // 330
                                                                                                                      //
                email = user.email;                                                                                   // 332
            } else if (typeof user.services != 'undefined') {                                                         // 334
                                                                                                                      //
                if (typeof user.services.google != 'undefined') {                                                     // 336
                    email = user.services.google.email;                                                               // 337
                } else if (typeof user.services.facebook != 'undefined') {                                            // 338
                    email = user.services.facebook.email;                                                             // 339
                }                                                                                                     // 340
            } else if (typeof emails != 'undefined') {                                                                // 342
                email = emails[0].address;                                                                            // 343
            } else {                                                                                                  // 345
                email = null;                                                                                         // 346
            }                                                                                                         // 348
                                                                                                                      //
            return email;                                                                                             // 350
        } catch (err) {                                                                                               // 352
            BuzzyGlobal.throwError("Error getting email: " + err);                                                    // 353
        }                                                                                                             // 354
    };                                                                                                                // 357
                                                                                                                      //
    this.gEmailforUserID = function (userID) {                                                                        // 359
        var user = Meteor.users.findOne({ _id: userID });                                                             // 360
        return BuzzyGlobal.gGetUserEmail(user);                                                                       // 361
    };                                                                                                                // 362
                                                                                                                      //
    this.gGetUserEmails = function (userIDs) {                                                                        // 364
                                                                                                                      //
        var usersCursor = Meteor.users.find({ _id: { $in: userIDs } });                                               // 366
        var userEmailArray = usersCursor.map(function (user) {                                                        // 367
            return BuzzyGlobal.gGetUserEmail(user);                                                                   // 368
        });                                                                                                           // 370
                                                                                                                      //
        return userEmailArray;                                                                                        // 372
    };                                                                                                                // 373
                                                                                                                      //
    this.getFirstMobile = function (userID) {                                                                         // 375
                                                                                                                      //
        var user = Users.findOne({ _id: userID });                                                                    // 377
        if (user) {                                                                                                   // 378
            if (typeof user.profile.channels !== "undefined") {                                                       // 379
                var mobileNumbers = _.filter(user.profile.channels, function (item) {                                 // 380
                    return item.channel === BuzzyGlobal.gNOTIFICATION_CHANNEL.SMS;                                    // 381
                });                                                                                                   // 383
                if (mobileNumbers.length > 0) {                                                                       // 384
                    return mobileNumbers[0].address;                                                                  // 385
                }                                                                                                     // 386
            }                                                                                                         // 388
        }                                                                                                             // 389
    };                                                                                                                // 390
                                                                                                                      //
    this.gGetUserNameByID = function (userID) {                                                                       // 392
        var user = Users.findOne({ _id: userID });                                                                    // 393
        if (user) {                                                                                                   // 394
            return BuzzyGlobal.gGetUserName(user);                                                                    // 395
        } else {                                                                                                      // 396
            return "Unknown";                                                                                         // 397
        }                                                                                                             // 398
    };                                                                                                                // 399
                                                                                                                      //
    this.gGetUserName = function (user) {                                                                             // 401
        var name = "";                                                                                                // 415
        var email = this.gGetUserEmail(user);                                                                         // 416
                                                                                                                      //
        if (typeof user.name != 'undefined' && user.name != email) {                                                  // 418
                                                                                                                      //
            name = user.name;                                                                                         // 421
        } else if (user.profile && typeof user.profile.name != 'undefined') {                                         // 422
            name = user.profile.name;                                                                                 // 423
        } else if (typeof user.services != 'undefined') {                                                             // 425
                                                                                                                      //
            if (typeof user.services.google != 'undefined') {                                                         // 428
                                                                                                                      //
                name = user.services.google.name;                                                                     // 430
            } else if (typeof user.services.facebook != 'undefined') {                                                // 431
                                                                                                                      //
                name = user.services.facebook.name;                                                                   // 433
            } else {                                                                                                  // 434
                if (typeof email !== "undefined" && email) {                                                          // 435
                    name = email.split("@")[0];                                                                       // 436
                } else {                                                                                              // 437
                    name = "Unknown";                                                                                 // 438
                }                                                                                                     // 439
            }                                                                                                         // 442
        } else if (typeof emails !== 'undefined' && emails) {                                                         // 444
                                                                                                                      //
            name = emails[0].address.split("@")[0];                                                                   // 446
        } else if (typeof email !== 'undefined' && email) {                                                           // 448
                                                                                                                      //
            name = email.split("@")[0];                                                                               // 450
        } else {                                                                                                      // 452
            name = "Unknown";                                                                                         // 453
        }                                                                                                             // 455
        //console.log("name:" + name);                                                                                // 456
        return name;                                                                                                  // 457
    };                                                                                                                // 459
                                                                                                                      //
    this.gUniqueUsers = function (resource, limit) {                                                                  // 461
                                                                                                                      //
        var userContacts = [];                                                                                        // 463
                                                                                                                      //
        var readers = resource.readers ? resource.readers : [];                                                       // 465
        var editors = resource.editors ? resource.editors : [];                                                       // 466
        var owners = resource.owners ? resource.owners : [];                                                          // 467
        //resource.readers, resource.editors,resource.owners                                                          // 468
        userContacts = _.uniq(userContacts.concat(readers, editors, owners));                                         // 469
        if ((typeof limit === "undefined" ? "undefined" : _typeof(limit)) != undefined && limit > 0) {                // 470
            return _.first(userContacts, limit);                                                                      // 471
        } else {                                                                                                      // 472
            return userContacts;                                                                                      // 473
        }                                                                                                             // 474
    };                                                                                                                // 475
                                                                                                                      //
    this.isUrl = function (s) {                                                                                       // 477
        var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;             // 478
        return regexp.test(s);                                                                                        // 479
    };                                                                                                                // 480
    this.emailCalenderInvite = function (resourceID, dateData) {                                                      // 481
        var cal = new ICS.VCALENDAR();                                                                                // 482
        cal.addProp('VERSION', 2); // Number(2) is converted to '2.0'                                                 // 483
        cal.addProp('PRODID', 'Buzzy Buzz');                                                                          // 484
        var eventLocation = dateData.value && dateData.value.location && dateData.value.location.formatted_address ? dateData.value.location.formatted_address : "";
        var event = new ICS.VEVENT();                                                                                 // 486
        event.addProp('UID');                                                                                         // 487
        event.addProp('DTSTAMP', new Date(), { VALUE: 'DATE-TIME' });                                                 // 488
        event.addProp('DTSTART', new Date(dateData.value.start), { VALUE: 'DATE-TIME' });                             // 489
        event.addProp('DTEND', new Date(dateData.value.end), { VALUE: 'DATE-TIME' });                                 // 490
        event.addProp('LOCATION', eventLocation, { VALUE: 'STRING' });                                                // 491
        event.addProp('SUMMARY', dateData.value.title, { VALUE: 'STRING' });                                          // 492
                                                                                                                      //
        cal.addComponent(event);                                                                                      // 494
        //console.log(cal.toString());                                                                                // 495
        //cal.toBlob()                                                                                                // 496
        var nameFile = moment().format() + '.ics';                                                                    // 497
        Meteor.call("microAppEmailCalendar", resourceID, cal.toString(), dateData);                                   // 498
    };                                                                                                                // 501
    this.gGetImageRank = function (image) {                                                                           // 502
        var rank = Date.now();                                                                                        // 503
        if (typeof image.EXIF !== "undefined" && image.EXIF) {                                                        // 504
            var tempDateTime = image.EXIF["EXIF DateTimeOriginal"];                                                   // 505
            console.log("tDateTime", tempDateTime);                                                                   // 506
            if (tempDateTime) {                                                                                       // 507
                var tempDate = tempDateTime.match(/^.*(\d{4}:\d{2}:\d{2}).*/)[1].replace(/:/g, '-');                  // 508
                var tempTime = tempDateTime.match(/^.*(\d{2}:\d{2}:\d{2}).*/)[1];                                     // 509
                rank = moment(tempDate + " " + tempTime).valueOf();                                                   // 510
            }                                                                                                         // 511
        }                                                                                                             // 514
        return rank;                                                                                                  // 515
    };                                                                                                                // 517
                                                                                                                      //
    this.gFindSubscription = function (subscriptions, plan) {                                                         // 519
        var found = false;                                                                                            // 520
        for (i = 0; i < subscriptions.data.length && !found; i++) {                                                   // 521
                                                                                                                      //
            if (subscriptions.data[i].plan.id === plan) {                                                             // 523
                return subscriptions.data[i];                                                                         // 524
                found = true;                                                                                         // 525
            }                                                                                                         // 526
        }                                                                                                             // 527
    };                                                                                                                // 528
    this.gIsSubScriptionMatch = function (subscriptions, subscriptionID) {                                            // 529
        var found = false;                                                                                            // 530
        for (i = 0; i < subscriptions.data.length && !found; i++) {                                                   // 531
            if (subscriptions.data[i].id === subscriptionID) {                                                        // 532
                return true;                                                                                          // 533
                found = true;                                                                                         // 534
            }                                                                                                         // 535
        }                                                                                                             // 536
        return false;                                                                                                 // 537
    };                                                                                                                // 538
                                                                                                                      //
    this.gIsPaidByTeam = function (stripeAccount, userID) {                                                           // 540
                                                                                                                      //
        var user = Users.findOne({ _id: userID });                                                                    // 542
        if (user && !user.subscriptionID) {                                                                           // 543
            return true;                                                                                              // 544
        } else if (user && stripeAccount && stripeAccount.subscriptions) {                                            // 545
                                                                                                                      //
            return BuzzyGlobal.gIsSubScriptionMatch(stripeAccount.subscriptions, user.subscriptionID);                // 547
            //return ReactiveMethod.call("retrieveSingleSubscription", user.subscriptionID);                          // 548
        } else {                                                                                                      // 549
            return false;                                                                                             // 550
        }                                                                                                             // 551
    };                                                                                                                // 552
    this.canPayOrUpgrade = function (stripeAccount, userID) {                                                         // 553
                                                                                                                      //
        var user = Users.findOne({ _id: userID });                                                                    // 555
        if (user && !user.subscriptionID) {                                                                           // 556
            return true;                                                                                              // 557
        } else if (user && stripeAccount && stripeAccount.subscriptions) {                                            // 558
                                                                                                                      //
            if (BuzzyGlobal.gIsSubScriptionMatch(stripeAccount.subscriptions, user.subscriptionID)) {                 // 560
                return true;                                                                                          // 561
            } else {                                                                                                  // 562
                return false;                                                                                         // 563
            }                                                                                                         // 564
                                                                                                                      //
            //return ReactiveMethod.call("retrieveSingleSubscription", user.subscriptionID);                          // 566
        } else {                                                                                                      // 567
            return false;                                                                                             // 568
        }                                                                                                             // 569
    };                                                                                                                // 570
}();                                                                                                                  // 573
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]}}}}},{"extensions":[".js",".json"]});
require("./node_modules/meteor/buzzy-buzz:common-globals/lib/common-globals.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['buzzy-buzz:common-globals'] = {}, {
  BuzzyGlobal: BuzzyGlobal
});

})();

//# sourceMappingURL=buzzy-buzz_common-globals.js.map
