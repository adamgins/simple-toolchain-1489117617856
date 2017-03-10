(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var _ = Package.underscore._;
var Mailer = Package['lookback:emails'].Mailer;
var Push = Package['raix:push'].Push;
var BuzzyGlobal = Package['buzzy-buzz:common-globals'].BuzzyGlobal;
var meteorInstall = Package.modules.meteorInstall;
var Buffer = Package.modules.Buffer;
var process = Package.modules.process;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;
var DDP = Package['ddp-client'].DDP;
var DDPServer = Package['ddp-server'].DDPServer;
var Async = Package['meteorhacks:async'].Async;
var moment = Package['momentjs:moment'].moment;
var Autoupdate = Package.autoupdate.Autoupdate;

/* Package-scope variables */
var BuzzyLogging, Resources, FollowedResources, directChildrenCursor, j, k, UserContacts, ExternalData, ExternalRestData, MicroAppData, i, MicroAppFields, MicroAppVotes, MicroAppChild, MicroAppActionRules, gCleanString, Teams, TeamMembers, Comments, CommentsViewed, Notifications, twilio, ResourceFollowers, Users, PaymentHistory;

var require = meteorInstall({"node_modules":{"meteor":{"buzzy-buzz:resources-core":{"lib":{"logging.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/buzzy-buzz_resources-core/lib/logging.js                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**                                                                                                                    // 1
 * Created by adamginsburg on 22/02/2016.                                                                              //
 */                                                                                                                    //
                                                                                                                       //
BuzzyLogging = {};                                                                                                     // 5
if (Meteor.settings['public'].BUZZY_LOGGING_SERVER) {                                                                  // 6
    BuzzyLogging = DDP.connect(Meteor.settings['public'].BUZZY_LOGGING_SERVER);                                        // 7
}                                                                                                                      // 8
                                                                                                                       //
Meteor.startup(function () {                                                                                           // 10
                                                                                                                       //
    if (Meteor.isClient) {                                                                                             // 12
        BuzzyLogging.onReconnect = function () {                                                                       // 13
            var loginToken = Meteor._localStorage.getItem('Meteor.loginToken');                                        // 14
            this.call('authenticate', loginToken);                                                                     // 15
        };                                                                                                             // 16
        BuzzyLogging.onReconnect();                                                                                    // 17
    }                                                                                                                  // 18
});                                                                                                                    // 21
                                                                                                                       //
if (Meteor.isServer) {}                                                                                                // 23
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"collections":{"resources.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/buzzy-buzz_resources-core/lib/collections/resources.js                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**                                                                                                                    // 1
 * Created by adamginsburg on 27/01/2016.                                                                              //
 */                                                                                                                    //
Resources = new Meteor.Collection('resources');                                                                        // 4
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"usercontacts.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/buzzy-buzz_resources-core/lib/collections/usercontacts.js                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**                                                                                                                    // 1
 * Created by adamginsburg on 22/05/2014.                                                                              //
 */                                                                                                                    //
UserContacts = new Meteor.Collection('userContacts');                                                                  // 4
                                                                                                                       //
UserContacts.allow({                                                                                                   // 7
    update: Resources.ownsDocument,                                                                                    // 8
    remove: Resources.ownsDocument,                                                                                    // 9
    insert: Meteor.user                                                                                                // 10
});                                                                                                                    // 7
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"external_data.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/buzzy-buzz_resources-core/lib/collections/external_data.js                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**                                                                                                                    // 1
 * Created by adamginsburg on 23/10/2014.                                                                              //
 */                                                                                                                    //
ExternalData = new Meteor.Collection('externalData');                                                                  // 4
ExternalData.displayLinkResult = function (link) {                                                                     // 5
    //encode link and call iFramely                                                                                    // 6
    var encodedURL = encodeURIComponent(link);                                                                         // 7
    var newTempID = new Meteor.Collection.ObjectID()._str;                                                             // 8
    Session.set('tempLinkID', newTempID);                                                                              // 9
    Meteor.call('gGetURLMetaData', newTempID, link);                                                                   // 10
};                                                                                                                     // 13
                                                                                                                       //
ExternalData.allow({                                                                                                   // 16
    update: Resources.canEdit,                                                                                         // 17
    remove: Resources.ownsDocument,                                                                                    // 18
    insert: Meteor.user                                                                                                // 19
});                                                                                                                    // 16
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"external_rest_data.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/buzzy-buzz_resources-core/lib/collections/external_rest_data.js                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**                                                                                                                    // 1
 * Created by adamginsburg on 2/02/2016.                                                                               //
 */                                                                                                                    //
ExternalRestData = new Meteor.Collection('externalRestData');                                                          // 4
                                                                                                                       //
if (Meteor.isServer) {                                                                                                 // 6
    Meteor.methods({                                                                                                   // 7
        updateExternalRestData: function () {                                                                          // 8
            function updateExternalRestData(resoureID, url, optUserToken) {                                            // 8
                var user = BuzzyGlobal.getCurrentUser(optUserToken);                                                   // 9
                if (!user) {                                                                                           // 10
                    BuzzyGlobal.throwError("You do not have the rights to do that!!!");                                // 11
                }                                                                                                      // 12
                                                                                                                       //
                HTTP.call("GET", url, {}, function (err, result) {                                                     // 14
                    console.log("POST RESULT:", result, " ERR:", err);                                                 // 17
                    if (err) {                                                                                         // 18
                        console.log({ message: 'Test failed error.' });                                                // 19
                    } else {                                                                                           // 20
                        console.log("TT res:", result);                                                                // 21
                        console.log({ message: 'Test passed - got result: ' + result });                               // 22
                        ExternalRestData.upsert({ parentResourceID: resoureID }, {                                     // 23
                            parentResourceID: resoureID,                                                               // 26
                            restURL: url,                                                                              // 27
                            result: result                                                                             // 28
                        }, {                                                                                           // 25
                            upsert: true                                                                               // 31
                        }, function (err) {                                                                            // 30
                            if (err) {                                                                                 // 34
                                BuzzyGlobal.throwError(err);                                                           // 35
                            }                                                                                          // 36
                        });                                                                                            // 37
                    }                                                                                                  // 38
                });                                                                                                    // 39
            }                                                                                                          // 42
                                                                                                                       //
            return updateExternalRestData;                                                                             // 8
        }()                                                                                                            // 8
    });                                                                                                                // 7
}                                                                                                                      // 44
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"micro_app_data.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/buzzy-buzz_resources-core/lib/collections/micro_app_data.js                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**                                                                                                                    // 1
 * Created by adamginsburg on 8/11/2015.                                                                               //
 */                                                                                                                    //
MicroAppData = new Meteor.Collection('microAppData');                                                                  // 4
/*                                                                                                                     // 5
 AppData.allow({                                                                                                       //
 //update: Resources.ownsDocument                                                                                      //
 //update: Resources.ownsNotification,                                                                                 //
 insert: Meteor.user                                                                                                   //
 });                                                                                                                   //
 */                                                                                                                    //
                                                                                                                       //
MicroAppData.currentDataItemField = function (currentDataItem, fieldID) {                                              // 14
    if (currentDataItem && fieldID) {                                                                                  // 15
        for (i in meteorBabelHelpers.sanitizeForInObject(currentDataItem.content)) {                                   // 16
            if (currentDataItem.content[i]._id === fieldID) {                                                          // 17
                return currentDataItem.content[i];                                                                     // 18
            }                                                                                                          // 19
        }                                                                                                              // 20
    }                                                                                                                  // 21
};                                                                                                                     // 23
MicroAppData.duplicateMicroAppData = function (srcResourceID, newResourceID, oldVsNewFieldIDs, optUserToken) {         // 24
                                                                                                                       //
    var findNewID = function findNewID(contentID) {                                                                    // 27
        if (oldVsNewFieldIDs) {                                                                                        // 28
            var foundItem = oldVsNewFieldIDs.find(function (item) {                                                    // 29
                return contentID === item.oldFieldID;                                                                  // 30
            });                                                                                                        // 31
            if (foundItem) {                                                                                           // 32
                return foundItem.newFieldID;                                                                           // 33
            } else {                                                                                                   // 34
                return "undefined";                                                                                    // 35
            }                                                                                                          // 36
        } else {                                                                                                       // 38
            return "undefined";                                                                                        // 40
        }                                                                                                              // 41
    };                                                                                                                 // 42
                                                                                                                       //
    var user = BuzzyGlobal.getCurrentUser(optUserToken);                                                               // 44
    var resource = Resources.findOne(srcResourceID);                                                                   // 45
    if (!user && !Resources.canView(user._id, resource)) {                                                             // 46
        BuzzyGlobal.throwError("You do not have the permission to do that!");                                          // 47
    }                                                                                                                  // 48
                                                                                                                       //
    var allAppData = MicroAppData.find({ parentResourceID: srcResourceID });                                           // 50
    if (allAppData) {                                                                                                  // 51
        allAppData.forEach(function (appDataItem) {                                                                    // 52
            appDataItem._id = new Meteor.Collection.ObjectID()._str;                                                   // 53
            appDataItem.parentResourceID = newResourceID;                                                              // 54
            for (i in meteorBabelHelpers.sanitizeForInObject(appDataItem.content)) {                                   // 55
                var newID = findNewID(appDataItem.content[i]._id);                                                     // 56
                appDataItem.content[i]._id = newID; //swap ID's with new Field ID's                                    // 57
                //appDataItem.content[i]._id = oldVsNewFieldIDs.IDs[appDataItem.content[i]._id]; //swap ID's with new Field ID's
            }                                                                                                          // 59
            MicroAppData.insert(appDataItem);                                                                          // 60
        });                                                                                                            // 61
    }                                                                                                                  // 62
};                                                                                                                     // 63
                                                                                                                       //
if (Meteor.isServer) {                                                                                                 // 65
    Meteor.methods({                                                                                                   // 66
                                                                                                                       //
        addMicroAppData: function () {                                                                                 // 68
            function addMicroAppData(resourceID, topLevelParentID) {                                                   // 68
                var user = Meteor.user();                                                                              // 69
                                                                                                                       //
                var getSortInitialVal = function () {                                                                  // 71
                    function getSortInitialVal(field) {                                                                // 71
                        var fieldValueToSort = "";                                                                     // 72
                        if (field) {                                                                                   // 73
                            switch (field.fieldType) {                                                                 // 74
                                case BuzzyGlobal.gAPPFIELDTYPE.AUTHOR:                                                 // 75
                                    fieldValueToSort = author;                                                         // 76
                                    break;                                                                             // 77
                                case BuzzyGlobal.gAPPFIELDTYPE.SUBMITTED:                                              // 78
                                    fieldValueToSort = submittedDate;                                                  // 79
                                    break;                                                                             // 80
                                case BuzzyGlobal.gAPPFIELDTYPE.DATETIME:                                               // 81
                                    fieldValueToSort = new Date().getTime();                                           // 82
                                                                                                                       //
                                    break;                                                                             // 84
                                default:                                                                               // 85
                                    fieldValueToSort = "";                                                             // 86
                            }                                                                                          // 74
                        };                                                                                             // 89
                        return fieldValueToSort;                                                                       // 90
                    }                                                                                                  // 91
                                                                                                                       //
                    return getSortInitialVal;                                                                          // 71
                }();                                                                                                   // 71
                                                                                                                       //
                var resource = Resources.findOne(resourceID);                                                          // 93
                // ensure the user is logged in                                                                        // 94
                if (!user) {                                                                                           // 95
                    BuzzyGlobal.throwError("You need to be logged complete this operation.");                          // 96
                };                                                                                                     // 98
                if (!Resources.canAddRow(resource)) {                                                                  // 99
                    BuzzyGlobal.throwError("You are not allowed to perform this operation.");                          // 100
                }                                                                                                      // 101
                                                                                                                       //
                var submittedDate;                                                                                     // 103
                if (Meteor.isClient) {                                                                                 // 104
                    submittedDate = TimeSync.serverTime();                                                             // 105
                } else {                                                                                               // 106
                    submittedDate = new Date().getTime();                                                              // 107
                }                                                                                                      // 108
                var author = BuzzyGlobal.gGetUserNameByID(user._id);                                                   // 109
                var sortedFieldVal = typeof resource.content.sortField != "undefined" ? getSortInitialVal(MicroAppFields.findOne({ _id: resource.content.sortField })) : new Date().getTime();
                var sortedFieldVal2 = typeof resource.content.sortField2 != "undefined" ? getSortInitialVal(MicroAppFields.findOne({ _id: resource.content.sortField2 })) : null;
                var sortedFieldVal3 = typeof resource.content.sortField3 != "undefined" ? getSortInitialVal(MicroAppFields.findOne({ _id: resource.content.sortField3 })) : null;
                                                                                                                       //
                var appFields = MicroAppFields.find({ parentResourceID: resourceID }).fetch();                         // 115
                                                                                                                       //
                if (appFields) {                                                                                       // 117
                    var appDataToInsert = {                                                                            // 118
                        userID: user._id,                                                                              // 119
                        author: author,                                                                                // 120
                        submitted: submittedDate,                                                                      // 121
                        content: appFields,                                                                            // 122
                        parentResourceID: resourceID,                                                                  // 123
                        sortVal: sortedFieldVal,                                                                       // 124
                        sortVal2: sortedFieldVal2,                                                                     // 125
                        sortVal3: sortedFieldVal3,                                                                     // 126
                        _id: new Meteor.Collection.ObjectID()._str                                                     // 127
                    };                                                                                                 // 118
                    var appID = MicroAppData.insert(appDataToInsert, function (error) {                                // 129
                        if (!error) {                                                                                  // 130
                            Meteor.call("updateUpdatedDate", topLevelParentID);                                        // 131
                        }                                                                                              // 133
                    });                                                                                                // 134
                    return appDataToInsert._id;                                                                        // 135
                }                                                                                                      // 136
            }                                                                                                          // 139
                                                                                                                       //
            return addMicroAppData;                                                                                    // 68
        }(),                                                                                                           // 68
        addFieldMicroAppData: function () {                                                                            // 140
            function addFieldMicroAppData(fieldData) {                                                                 // 140
                var user = Meteor.user();                                                                              // 141
                                                                                                                       //
                var resource = Resources.findOne(fieldData.parentResourceID);                                          // 143
                // ensure the user is logged in                                                                        // 144
                if (!user) {                                                                                           // 145
                    BuzzyGlobal.throwError("You need to be logged complete this operation.");                          // 146
                };                                                                                                     // 148
                if (!Resources.canEdit(Meteor.userId(), resource)) {                                                   // 149
                    BuzzyGlobal.throwError("You are not allowed to perform this operation.");                          // 150
                }                                                                                                      // 151
                                                                                                                       //
                var submittedDate;                                                                                     // 153
                if (Meteor.isClient) {                                                                                 // 154
                    submittedDate = TimeSync.serverTime();                                                             // 155
                } else {                                                                                               // 156
                    submittedDate = new Date().getTime();                                                              // 157
                }                                                                                                      // 158
                                                                                                                       //
                var allAppData = MicroAppData.find({ parentResourceID: fieldData.parentResourceID });                  // 160
                if (allAppData) {                                                                                      // 161
                    allAppData.forEach(function (appDataItem) {                                                        // 162
                        MicroAppData.update({ _id: appDataItem._id }, { $push: { content: fieldData } });              // 163
                    });                                                                                                // 165
                }                                                                                                      // 166
            }                                                                                                          // 169
                                                                                                                       //
            return addFieldMicroAppData;                                                                               // 140
        }(),                                                                                                           // 140
        addMicroAppDataFields: function () {                                                                           // 170
            function addMicroAppDataFields(fieldData, embeddingResourceID) {                                           // 170
                var user = Meteor.user();                                                                              // 171
                                                                                                                       //
                var resource = Resources.findOne(fieldData.parentResourceID);                                          // 173
                // ensure the user is logged in                                                                        // 174
                if (!user) {                                                                                           // 175
                    BuzzyGlobal.throwError("You need to be logged complete this operation.");                          // 176
                };                                                                                                     // 178
                if (!Resources.canAddRow(resource)) {                                                                  // 179
                    BuzzyGlobal.throwError("You are not allowed to perform this operation.");                          // 180
                }                                                                                                      // 181
                                                                                                                       //
                var submittedDate;                                                                                     // 183
                if (Meteor.isClient) {                                                                                 // 184
                    submittedDate = TimeSync.serverTime();                                                             // 185
                } else {                                                                                               // 186
                    submittedDate = new Date().getTime();                                                              // 187
                }                                                                                                      // 188
                                                                                                                       //
                MicroAppData.insert(fieldData, function (err) {                                                        // 190
                    if (err) {                                                                                         // 191
                        BuzzyGlobal.throwError(err);                                                                   // 192
                        return;                                                                                        // 193
                    }                                                                                                  // 194
                    Meteor.call("actionRuleNotificationsMicroApp", fieldData, embeddingResourceID, function (err) {    // 195
                        if (err) {                                                                                     // 196
                            BuzzyGlobal.throwError(err);                                                               // 197
                            console.log(err);                                                                          // 198
                        }                                                                                              // 199
                    });                                                                                                // 200
                });                                                                                                    // 202
            }                                                                                                          // 205
                                                                                                                       //
            return addMicroAppDataFields;                                                                              // 170
        }(),                                                                                                           // 170
        updateMicroAppData: function () {                                                                              // 206
            function updateMicroAppData(resourceID, topLevelParentID, microAppDataID, microAppDataFieldID, val) {      // 206
                var user = Meteor.user();                                                                              // 207
                var resource = Resources.findOne(resourceID);                                                          // 208
                                                                                                                       //
                // ensure the user is logged in                                                                        // 211
                if (!user) {                                                                                           // 212
                    BuzzyGlobal.throwError("You need to be logged complete this operation.");                          // 213
                };                                                                                                     // 215
                var currField = MicroAppFields.findOne({ _id: microAppDataFieldID });                                  // 216
                if (!currField && !Resources.canEditMicroAppField(Meteor.userId(), resource, currField.whoCanEdit, currField.whoCanEdit, null)) {
                    BuzzyGlobal.throwError("You are not allowed to perform this operation.");                          // 218
                }                                                                                                      // 219
                                                                                                                       //
                var submittedDate;                                                                                     // 221
                if (Meteor.isClient) {                                                                                 // 222
                    submittedDate = TimeSync.serverTime();                                                             // 223
                } else {                                                                                               // 224
                    submittedDate = new Date().getTime();                                                              // 225
                }                                                                                                      // 226
                var searchVal = val;                                                                                   // 227
                if (currField.fieldType == BuzzyGlobal.gAPPFIELDTYPE.DATETIME && currField.option.type === BuzzyGlobal.gAPPFIELD_DATETYPE.EVENT.type && typeof val.start !== "undefined") {
                    searchVal = val.start;                                                                             // 229
                } else if (currField.fieldType == BuzzyGlobal.gAPPFIELDTYPE.RATING && typeof val !== "undefined") {    // 230
                    searchVal = val ? val.toString() : "";                                                             // 231
                }                                                                                                      // 232
                                                                                                                       //
                var searchID = typeof resource.content.sortField !== "undefined" ? resource.content.sortField : "";    // 236
                var searchID2 = typeof resource.content.sortField2 !== "undefined" ? resource.content.sortField2 : "";
                var searchID3 = typeof resource.content.sortField3 !== "undefined" ? resource.content.sortField3 : "";
                var updateObj = { "content.$.value": val };                                                            // 239
                switch (microAppDataFieldID) {                                                                         // 240
                    case searchID:                                                                                     // 241
                        updateObj.sortVal = searchVal;                                                                 // 242
                        break;                                                                                         // 243
                    case searchID2:                                                                                    // 244
                        updateObj.sortVal2 = searchVal;                                                                // 245
                        break;                                                                                         // 246
                    case searchID3:                                                                                    // 247
                        updateObj.sortVal3 = searchVal;                                                                // 248
                        break;                                                                                         // 249
                    default:                                                                                           // 250
                                                                                                                       //
                }                                                                                                      // 240
                MicroAppData.update({ _id: microAppDataID, "content._id": microAppDataFieldID }, { $set: updateObj }, function (error) {
                    if (!error) {                                                                                      // 257
                        Meteor.call("updateUpdatedDate", topLevelParentID);                                            // 258
                    } else {                                                                                           // 259
                        BuzzyGlobal.throwError(error);                                                                 // 260
                    }                                                                                                  // 261
                });                                                                                                    // 262
            }                                                                                                          // 269
                                                                                                                       //
            return updateMicroAppData;                                                                                 // 206
        }(),                                                                                                           // 206
                                                                                                                       //
        removeFieldsMicroAppData: function () {                                                                        // 271
            function removeFieldsMicroAppData(resourceID, microAppDataFieldID) {                                       // 271
                var user = Meteor.user();                                                                              // 272
                                                                                                                       //
                var resource = Resources.findOne(resourceID);                                                          // 274
                // ensure the user is logged in                                                                        // 275
                if (!user) {                                                                                           // 276
                    BuzzyGlobal.throwError("You need to be logged complete this operation.");                          // 277
                };                                                                                                     // 279
                var currField = MicroAppFields.findOne({ _id: microAppDataFieldID });                                  // 280
                if (!currField && !Resources.canEditMicroAppField(Meteor.userId(), resource, currField.whoCanEdit, currField.whoCanEdit, null)) {
                    BuzzyGlobal.throwError("You are not allowed to perform this operation.");                          // 282
                }                                                                                                      // 283
                                                                                                                       //
                var submittedDate;                                                                                     // 285
                if (Meteor.isClient) {                                                                                 // 286
                    submittedDate = TimeSync.serverTime();                                                             // 287
                } else {                                                                                               // 288
                    submittedDate = new Date().getTime();                                                              // 289
                }                                                                                                      // 290
                var searchVal = "";                                                                                    // 291
                                                                                                                       //
                if (resource.content.sortField === microAppDataFieldID) {                                              // 293
                    MicroAppData.update({ "content._id": microAppDataFieldID }, { $pull: { content: { _id: microAppDataFieldID } } }, { multi: true }, function (error) {
                        if (!error) {                                                                                  // 299
                            //Meteor.call("updateUpdatedDate", resource._id);                                          // 300
                        } else {                                                                                       // 301
                            BuzzyGlobal.throwError(error);                                                             // 302
                        }                                                                                              // 303
                    });                                                                                                // 304
                } else {                                                                                               // 307
                    MicroAppData.update({ "content._id": microAppDataFieldID }, { $pull: { content: { _id: microAppDataFieldID } } }, { multi: true }, function (error) {
                        if (!error) {                                                                                  // 313
                            //Meteor.call("updateUpdatedDate", resource._id);                                          // 314
                        } else {                                                                                       // 315
                            BuzzyGlobal.throwError(error);                                                             // 316
                        }                                                                                              // 317
                    });                                                                                                // 318
                }                                                                                                      // 320
            }                                                                                                          // 322
                                                                                                                       //
            return removeFieldsMicroAppData;                                                                           // 271
        }(),                                                                                                           // 271
        updateAllFieldsMicroAppData: function () {                                                                     // 323
            function updateAllFieldsMicroAppData(resourceID, fieldID, fieldName, fieldVal) {                           // 323
                var user = Meteor.user();                                                                              // 324
                                                                                                                       //
                var resource = Resources.findOne(resourceID);                                                          // 326
                // ensure the user is logged in                                                                        // 327
                if (!user) {                                                                                           // 328
                    BuzzyGlobal.throwError("You need to be logged complete this operation.");                          // 329
                };                                                                                                     // 331
                if (!Resources.canEdit(Meteor.userId(), resource)) {                                                   // 332
                    BuzzyGlobal.throwError("You are not allowed to perform this operation.");                          // 333
                }                                                                                                      // 334
                var fieldObj = {};                                                                                     // 335
                fieldObj[fieldName] = fieldVal;                                                                        // 336
                MicroAppData.update({ parentResourceID: resourceID, "content._id": fieldID }, { $set: { "content.$": fieldObj } }, { multi: true }, function (error) {
                    if (!error) {                                                                                      // 342
                        //Meteor.call("updateUpdatedDate", topLevelParentID);                                          // 343
                    } else {                                                                                           // 344
                        BuzzyGlobal.throwError(error);                                                                 // 345
                    }                                                                                                  // 346
                });                                                                                                    // 347
            }                                                                                                          // 350
                                                                                                                       //
            return updateAllFieldsMicroAppData;                                                                        // 323
        }(),                                                                                                           // 323
        getAutoIncrementField: function () {                                                                           // 351
            function getAutoIncrementField(microAppID, fieldID) {                                                      // 351
                var user = Meteor.user();                                                                              // 352
                                                                                                                       //
                if (!user) {                                                                                           // 355
                    BuzzyGlobal.throwError("You need to be logged complete this operation.");                          // 356
                }                                                                                                      // 358
                var highestItem = MicroAppData.findOne({ parentResourceID: microAppID }, { limit: 1, sort: { sortVal: -1 } });
                if (highestItem) {                                                                                     // 360
                    var highestVal = MicroAppData.currentDataItemField(highestItem, fieldID);                          // 361
                    if (!isNaN(highestVal.value)) {                                                                    // 362
                        return parseInt(highestVal.value) + 1;                                                         // 363
                    }                                                                                                  // 364
                }                                                                                                      // 365
            }                                                                                                          // 367
                                                                                                                       //
            return getAutoIncrementField;                                                                              // 351
        }(),                                                                                                           // 351
        updateAllFieldsMicroAppDataOption: function () {                                                               // 368
            function updateAllFieldsMicroAppDataOption(resourceID, fieldID, fieldVal) {                                // 368
                var user = Meteor.user();                                                                              // 369
                                                                                                                       //
                var resource = Resources.findOne(resourceID);                                                          // 371
                // ensure the user is logged in                                                                        // 372
                if (!user) {                                                                                           // 373
                    BuzzyGlobal.throwError("You need to be logged complete this operation.");                          // 374
                };                                                                                                     // 376
                if (!Resources.canEdit(Meteor.userId(), resource)) {                                                   // 377
                    BuzzyGlobal.throwError("You are not allowed to perform this operation.");                          // 378
                }                                                                                                      // 379
                                                                                                                       //
                MicroAppData.update({ parentResourceID: resourceID, "content._id": fieldID }, { $set: { "content.$.option": fieldVal } }, { multi: true }, function (error) {
                    if (!error) {                                                                                      // 386
                        //Meteor.call("updateUpdatedDate", topLevelParentID);                                          // 387
                    } else {                                                                                           // 388
                        BuzzyGlobal.throwError(error);                                                                 // 389
                    }                                                                                                  // 390
                });                                                                                                    // 391
            }                                                                                                          // 394
                                                                                                                       //
            return updateAllFieldsMicroAppDataOption;                                                                  // 368
        }(),                                                                                                           // 368
        updateAllFieldsMicroAppDataSortVal: function () {                                                              // 395
            function updateAllFieldsMicroAppDataSortVal(resourceID, fieldID, fieldNumber) {                            // 395
                var user = Meteor.user();                                                                              // 396
                                                                                                                       //
                var resource = Resources.findOne(resourceID);                                                          // 398
                // ensure the user is logged in                                                                        // 399
                if (!user) {                                                                                           // 400
                    BuzzyGlobal.throwError("You need to be logged complete this operation.");                          // 401
                };                                                                                                     // 403
                if (!(Resources.canEdit(Meteor.userId(), resource) || BuzzyGlobalAdmin.isBuzzyAdmin())) {              // 404
                    BuzzyGlobal.throwError("You are not allowed to perform this operation.");                          // 405
                }                                                                                                      // 406
                                                                                                                       //
                var sortedField = MicroAppFields.findOne({ _id: fieldID });                                            // 408
                                                                                                                       //
                MicroAppData.find({ parentResourceID: resourceID }).forEach(function (microAppDataItem) {              // 410
                                                                                                                       //
                    var fieldValueToSort = "";                                                                         // 414
                    switch (sortedField.fieldType) {                                                                   // 415
                        case BuzzyGlobal.gAPPFIELDTYPE.AUTHOR:                                                         // 416
                            fieldValueToSort = microAppDataItem.author;                                                // 417
                            break;                                                                                     // 418
                        case BuzzyGlobal.gAPPFIELDTYPE.SUBMITTED:                                                      // 419
                            fieldValueToSort = microAppDataItem.submitted;                                             // 420
                            break;                                                                                     // 421
                        case BuzzyGlobal.gAPPFIELDTYPE.DATETIME:                                                       // 422
                            var currField = MicroAppData.currentDataItemField(microAppDataItem, fieldID);              // 423
                            if (currField && typeof currField !== "undefined" && currField.value && sortedField.option.type === BuzzyGlobal.gAPPFIELD_DATETYPE.EVENT.type) {
                                fieldValueToSort = currField.value.start;                                              // 425
                            } else {                                                                                   // 426
                                fieldValueToSort = currField.value;                                                    // 427
                            }                                                                                          // 428
                                                                                                                       //
                            break;                                                                                     // 430
                        case BuzzyGlobal.gAPPFIELDTYPE.EVENT:                                                          // 431
                            var currField = MicroAppData.currentDataItemField(microAppDataItem, fieldID);              // 432
                            if (currField && typeof currField !== "undefined" && currField.value) {                    // 433
                                fieldValueToSort = currField.value.start;                                              // 434
                            }                                                                                          // 435
                                                                                                                       //
                            break;                                                                                     // 438
                        case BuzzyGlobal.gAPPFIELDTYPE.RATING:                                                         // 439
                            var temp = MicroAppData.currentDataItemField(microAppDataItem, fieldID).value;             // 440
                            fieldValueToSort = temp ? temp.toString() : null;                                          // 441
                                                                                                                       //
                            break;                                                                                     // 444
                        default:                                                                                       // 445
                            fieldValueToSort = MicroAppData.currentDataItemField(microAppDataItem, fieldID).value;     // 446
                    }                                                                                                  // 415
                                                                                                                       //
                    var sortUpdateQuery = { sortVal: fieldValueToSort };                                               // 449
                    switch (fieldNumber) {                                                                             // 450
                        case "2":                                                                                      // 451
                            sortUpdateQuery = { sortVal2: fieldValueToSort };                                          // 452
                            break;                                                                                     // 453
                        case "3":                                                                                      // 454
                            sortUpdateQuery = { sortVal3: fieldValueToSort };                                          // 455
                            break;                                                                                     // 456
                        default:                                                                                       // 457
                                                                                                                       //
                    }                                                                                                  // 450
                                                                                                                       //
                    MicroAppData.update({ _id: microAppDataItem._id }, { $set: sortUpdateQuery }, function (error) {   // 461
                        if (!error) {                                                                                  // 465
                            //Meteor.call("updateUpdatedDate", topLevelParentID);                                      // 466
                        } else {                                                                                       // 467
                            BuzzyGlobal.throwError(error);                                                             // 468
                        }                                                                                              // 469
                    });                                                                                                // 470
                });                                                                                                    // 472
            }                                                                                                          // 475
                                                                                                                       //
            return updateAllFieldsMicroAppDataSortVal;                                                                 // 395
        }(),                                                                                                           // 395
        removeMicroAppRow: function () {                                                                               // 476
            function removeMicroAppRow(appRowID, resourceID) {                                                         // 476
                var user = Meteor.user();                                                                              // 477
                                                                                                                       //
                var resource = Resources.findOne(resourceID);                                                          // 479
                // ensure the user is logged in                                                                        // 480
                if (!user) {                                                                                           // 481
                    BuzzyGlobal.throwError("You need to be logged complete this operation.");                          // 482
                };                                                                                                     // 484
                if (!Resources.canEdit(Meteor.userId(), resource)) {                                                   // 485
                    BuzzyGlobal.throwError("You are not allowed to perform this operation.");                          // 486
                }                                                                                                      // 487
                                                                                                                       //
                MicroAppData.remove({ "_id": appRowID }, function (error) {                                            // 489
                    if (error) {                                                                                       // 492
                        BuzzyGlobal.throwError(error);                                                                 // 493
                    }                                                                                                  // 494
                });                                                                                                    // 495
            }                                                                                                          // 498
                                                                                                                       //
            return removeMicroAppRow;                                                                                  // 476
        }(),                                                                                                           // 476
        microAppDataUpdateViewers: function () {                                                                       // 499
            function microAppDataUpdateViewers(appRowID, resourceID, val, optUserToken) {                              // 499
                var user = BuzzyGlobal.getCurrentUser(optUserToken);                                                   // 500
                                                                                                                       //
                var resource = Resources.findOne(resourceID);                                                          // 502
                // ensure the user is logged in                                                                        // 503
                if (!user) {                                                                                           // 504
                    BuzzyGlobal.throwError("You need to be logged complete this operation.");                          // 505
                };                                                                                                     // 507
                if (!Resources.canEdit(Meteor.userId(), resource)) {                                                   // 508
                    BuzzyGlobal.throwError("You are not allowed to perform this operation.");                          // 509
                }                                                                                                      // 510
                                                                                                                       //
                var originalRow = MicroAppData.findOne({ _id: appRowID });                                             // 512
                var newViewers = [];                                                                                   // 513
                if (originalRow && originalRow.viewers) {                                                              // 514
                    newViewers = _.difference(val, originalRow.viewers);                                               // 515
                }                                                                                                      // 516
                                                                                                                       //
                MicroAppData.update({ _id: appRowID }, { $set: { viewers: val } }, function (error) {                  // 519
                    if (error) {                                                                                       // 523
                        BuzzyGlobal.throwError(error);                                                                 // 524
                    } else {                                                                                           // 525
                        if (newViewers.length > 0) {                                                                   // 526
                            Meteor.call("viewerNotificationsMicroApp", resource._id, newViewers, optUserToken);        // 527
                        }                                                                                              // 528
                    }                                                                                                  // 529
                });                                                                                                    // 530
            }                                                                                                          // 533
                                                                                                                       //
            return microAppDataUpdateViewers;                                                                          // 499
        }(),                                                                                                           // 499
        microAppAddChildUpdateCollage: function () {                                                                   // 534
            function microAppAddChildUpdateCollage(Blobs, parentResourceID, topResourceID, appID, fieldID) {           // 534
                var blobImageHandleArray = [];                                                                         // 535
                for (i in meteorBabelHelpers.sanitizeForInObject(Blobs)) {                                             // 536
                                                                                                                       //
                    if (Blobs[i].mimetype.indexOf("image") >= 0) {                                                     // 538
                        blobImageHandleArray.push(BuzzyGlobal.gGetFilePickerHandle(Blobs[i].url));                     // 539
                    }                                                                                                  // 540
                }                                                                                                      // 541
                                                                                                                       //
                var oldHandleArray = MicroAppChild.find({ parentAppItemID: appID, parentAppFieldID: fieldID }).map(function (childItem) {
                    return childItem.content.url.match(/(api\/file\/)([A-Za-z0-9]+)/)[2];                              // 544
                });                                                                                                    // 545
                                                                                                                       //
                Meteor.call("filepickerSignUrlListMethod", Blobs, function (err, result) {                             // 548
                    if (err) {                                                                                         // 549
                        BuzzyGlobal.throwError(err);                                                                   // 550
                    }                                                                                                  // 551
                                                                                                                       //
                    for (k in meteorBabelHelpers.sanitizeForInObject(result)) {                                        // 553
                        Meteor.call("addMicroAppChild", parentResourceID, topResourceID, appID, fieldID, result[k]);   // 554
                    }                                                                                                  // 557
                                                                                                                       //
                    if (Blobs && Blobs.length === 1) {                                                                 // 559
                        var galleryItem = {                                                                            // 560
                            galleryURL: result[0].url,                                                                 // 561
                            signature: result[0].signature,                                                            // 562
                            policy: result[0].policy,                                                                  // 563
                            additionalImageCount: 0                                                                    // 564
                        };                                                                                             // 560
                        Meteor.call("updateMicroAppData", parentResourceID, topResourceID, appID, fieldID, galleryItem);
                    }                                                                                                  // 567
                });                                                                                                    // 568
                                                                                                                       //
                blobImageHandleArray = _.union(oldHandleArray, blobImageHandleArray);                                  // 570
                if (blobImageHandleArray.length > 1) {                                                                 // 571
                    Meteor.call('createFilepickerCollage', blobImageHandleArray, function (error, collageURL) {        // 572
                        if (error) {                                                                                   // 573
                                                                                                                       //
                            BuzzyGlobal.throwError(error.reason);                                                      // 575
                        } else {                                                                                       // 576
                            var galleryItem = {                                                                        // 577
                                galleryURL: collageURL.signedURL,                                                      // 578
                                signature: collageURL.signature,                                                       // 579
                                policy: collageURL.policy,                                                             // 580
                                additionalImageCount: collageURL.additionalImageCount                                  // 581
                            };                                                                                         // 577
                            Meteor.call("updateMicroAppData", parentResourceID, topResourceID, appID, fieldID, galleryItem);
                        }                                                                                              // 586
                    });                                                                                                // 587
                }                                                                                                      // 588
            }                                                                                                          // 589
                                                                                                                       //
            return microAppAddChildUpdateCollage;                                                                      // 534
        }(),                                                                                                           // 534
        searchMicroAppFieldQuery: function () {                                                                        // 590
            function searchMicroAppFieldQuery(parentResourceID, fieldID, optUserToken) {                               // 590
                var user = BuzzyGlobal.getCurrentUser(optUserToken);                                                   // 591
                                                                                                                       //
                var resource = Resources.findOne(parentResourceID);                                                    // 593
                // ensure the user is logged in                                                                        // 594
                if (!user) {                                                                                           // 595
                    BuzzyGlobal.throwError("You need to be logged complete this operation.");                          // 596
                };                                                                                                     // 598
                if (!Resources.canView(Meteor.userId(), resource)) {                                                   // 599
                    BuzzyGlobal.throwError("You are not allowed to perform this operation.");                          // 600
                }                                                                                                      // 601
                                                                                                                       //
                /* var items = MicroAppData.find({                                                                     // 603
                     $and:[                                                                                            //
                         {parentResourceID: parentResourceID},                                                         //
                         {"content.$._id":fieldID};                                                                    //
                     ]                                                                                                 //
                 })*/                                                                                                  //
            }                                                                                                          // 610
                                                                                                                       //
            return searchMicroAppFieldQuery;                                                                           // 590
        }()                                                                                                            // 590
                                                                                                                       //
    });                                                                                                                // 66
}                                                                                                                      // 613
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"micro_app_fields.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/buzzy-buzz_resources-core/lib/collections/micro_app_fields.js                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**                                                                                                                    // 1
 * Created by adamginsburg on 14/11/2015.                                                                              //
 */                                                                                                                    //
MicroAppFields = new Meteor.Collection('microAppFields');                                                              // 4
MicroAppFields.getHighestRank = function (resourceID) {                                                                // 5
    if (Meteor.userId() && resourceID) {                                                                               // 6
        var lastRankedItem = MicroAppFields.findOne({ parentResourceID: resourceID }, { sort: { rank: -1 } });         // 7
        if (!lastRankedItem || isNaN(lastRankedItem.rank)) {                                                           // 8
            return 0;                                                                                                  // 9
        } else {                                                                                                       // 10
            return lastRankedItem.rank;                                                                                // 11
        }                                                                                                              // 12
    }                                                                                                                  // 14
};                                                                                                                     // 15
Meteor.methods({                                                                                                       // 16
    insertMicroAppField: function () {                                                                                 // 17
        function insertMicroAppField(resourceID, fieldType) {                                                          // 17
            if (Meteor.userId() && resourceID) {                                                                       // 18
                var resource = Resources.findOne({ _id: resourceID });                                                 // 19
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 20
                    var rank = MicroAppFields.getHighestRank(resourceID) + 1;                                          // 21
                    var fieldData = {                                                                                  // 22
                        parentResourceID: resourceID,                                                                  // 23
                        fieldType: fieldType,                                                                          // 24
                        collapseBreakPoint: BuzzyGlobal.gAPPFIELD_COLLAPSE.XS,                                         // 25
                        defaultVal: null,                                                                              // 26
                        rank: rank,                                                                                    // 27
                        whoCanEdit: BuzzyGlobal.gAPPFIELD_INTERACT.OWNERS_AND_AUTHORS,                                 // 28
                        _id: new Meteor.Collection.ObjectID()._str                                                     // 29
                    };                                                                                                 // 22
                                                                                                                       //
                    if (fieldType === BuzzyGlobal.gAPPFIELDTYPE.DATETIME) {                                            // 32
                        fieldData.option = "YYYY-MMM-DD HH:mm";                                                        // 33
                    } else if (fieldType === BuzzyGlobal.gAPPFIELDTYPE.EVENT) {                                        // 34
                        fieldData.start = new Date();                                                                  // 35
                        fieldData.end = new Date();                                                                    // 36
                        fieldData.option = {                                                                           // 37
                            format: "h:mm a D MMM YYYY ZZ",                                                            // 38
                            type: "event",                                                                             // 39
                            displayAs: "selectbox"                                                                     // 40
                        };                                                                                             // 37
                    } else if (fieldType === BuzzyGlobal.gAPPFIELDTYPE.PAYMENT) {                                      // 42
                                                                                                                       //
                        fieldData.value = {                                                                            // 44
                            style: 'btn-success',                                                                      // 45
                            buttonHelp: 'custom help text',                                                            // 46
                            label: 'Please click "Edit" below',                                                        // 47
                            paymentType: BuzzyGlobal.gPAYMENT_TYPE.VARIABLE,                                           // 48
                            payment: {                                                                                 // 49
                                recipientID: "",                                                                       // 50
                                amount: 0                                                                              // 51
                                                                                                                       //
                            }                                                                                          // 49
                                                                                                                       //
                        };                                                                                             // 44
                    }                                                                                                  // 56
                    MicroAppFields.insert(fieldData, function (error) {                                                // 57
                        if (error) {                                                                                   // 58
                            BuzzyGlobal.throwError(error);                                                             // 59
                        } else {                                                                                       // 60
                            if (!fieldData.value) {                                                                    // 61
                                fieldData.value = fieldData.defaultVal;                                                // 62
                            }                                                                                          // 63
                            Meteor.call("addFieldMicroAppData", fieldData);                                            // 64
                        }                                                                                              // 65
                    });                                                                                                // 66
                }                                                                                                      // 70
            }                                                                                                          // 71
        }                                                                                                              // 72
                                                                                                                       //
        return insertMicroAppField;                                                                                    // 17
    }(),                                                                                                               // 17
                                                                                                                       //
    updateMicroAppFieldLabel: function () {                                                                            // 74
        function updateMicroAppFieldLabel(resourceID, fieldID, fieldVal) {                                             // 74
            if (Meteor.userId() && resourceID) {                                                                       // 75
                var resource = Resources.findOne({ _id: resourceID });                                                 // 76
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 77
                                                                                                                       //
                    MicroAppFields.update({ _id: fieldID }, { $set: { "label": fieldVal } }, function (error) {        // 79
                        if (error) {                                                                                   // 80
                            BuzzyGlobal.throwError(error);                                                             // 81
                        }                                                                                              // 82
                    });                                                                                                // 83
                }                                                                                                      // 85
            }                                                                                                          // 86
        }                                                                                                              // 87
                                                                                                                       //
        return updateMicroAppFieldLabel;                                                                               // 74
    }(),                                                                                                               // 74
                                                                                                                       //
    updateMicroAppFieldClass: function () {                                                                            // 89
        function updateMicroAppFieldClass(resourceID, fieldID, fieldVal) {                                             // 89
            if (Meteor.userId() && resourceID) {                                                                       // 90
                var resource = Resources.findOne({ _id: resourceID });                                                 // 91
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 92
                                                                                                                       //
                    MicroAppFields.update({ _id: fieldID }, { $set: { "fieldClass": fieldVal } }, function (error) {   // 94
                        if (error) {                                                                                   // 95
                            BuzzyGlobal.throwError(error);                                                             // 96
                        }                                                                                              // 97
                    });                                                                                                // 98
                }                                                                                                      // 100
            }                                                                                                          // 101
        }                                                                                                              // 102
                                                                                                                       //
        return updateMicroAppFieldClass;                                                                               // 89
    }(),                                                                                                               // 89
    updateMicroAppAddFieldValues: function () {                                                                        // 103
        function updateMicroAppAddFieldValues(resourceID, fieldID, fieldVal) {                                         // 103
            if (Meteor.userId() && resourceID) {                                                                       // 104
                var resource = Resources.findOne({ _id: resourceID });                                                 // 105
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 106
                                                                                                                       //
                    MicroAppFields.update({ _id: fieldID }, { $addToSet: { "option.values": fieldVal } }, function (error) {
                        if (error) {                                                                                   // 109
                            BuzzyGlobal.throwError(error);                                                             // 110
                        }                                                                                              // 111
                    });                                                                                                // 112
                }                                                                                                      // 114
            }                                                                                                          // 115
        }                                                                                                              // 116
                                                                                                                       //
        return updateMicroAppAddFieldValues;                                                                           // 103
    }(),                                                                                                               // 103
    updateMicroAppRemoveFieldValues: function () {                                                                     // 117
        function updateMicroAppRemoveFieldValues(resourceID, fieldID, fieldVal) {                                      // 117
            if (Meteor.userId() && resourceID) {                                                                       // 118
                var resource = Resources.findOne({ _id: resourceID });                                                 // 119
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 120
                                                                                                                       //
                    MicroAppFields.update({ _id: fieldID }, { $pull: { "option.values": fieldVal } }, function (error) {
                        if (error) {                                                                                   // 123
                            BuzzyGlobal.throwError(error);                                                             // 124
                        }                                                                                              // 125
                    });                                                                                                // 126
                }                                                                                                      // 128
            }                                                                                                          // 129
        }                                                                                                              // 130
                                                                                                                       //
        return updateMicroAppRemoveFieldValues;                                                                        // 117
    }(),                                                                                                               // 117
    updateMicroAppFieldOptionMultipleSelect: function () {                                                             // 131
        function updateMicroAppFieldOptionMultipleSelect(resourceID, fieldID, fieldVal) {                              // 131
            if (Meteor.userId() && resourceID) {                                                                       // 132
                var resource = Resources.findOne({ _id: resourceID });                                                 // 133
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 134
                                                                                                                       //
                    MicroAppFields.update({ _id: fieldID }, { $set: { option: { multipleSelect: fieldVal } } }, function (error) {
                        if (error) {                                                                                   // 137
                            BuzzyGlobal.throwError(error);                                                             // 138
                        }                                                                                              // 139
                    });                                                                                                // 140
                }                                                                                                      // 142
            }                                                                                                          // 143
        }                                                                                                              // 144
                                                                                                                       //
        return updateMicroAppFieldOptionMultipleSelect;                                                                // 131
    }(),                                                                                                               // 131
    updateMicroAppFieldOptionTimeFormat: function () {                                                                 // 145
        function updateMicroAppFieldOptionTimeFormat(resourceID, fieldID, fieldVal) {                                  // 145
            if (Meteor.userId() && resourceID) {                                                                       // 146
                var resource = Resources.findOne({ _id: resourceID });                                                 // 147
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 148
                                                                                                                       //
                    MicroAppFields.update({ _id: fieldID }, { $set: { option: { timeFormat: fieldVal } } }, function (error) {
                        if (error) {                                                                                   // 151
                            BuzzyGlobal.throwError(error);                                                             // 152
                        }                                                                                              // 153
                    });                                                                                                // 154
                }                                                                                                      // 156
            }                                                                                                          // 157
        }                                                                                                              // 158
                                                                                                                       //
        return updateMicroAppFieldOptionTimeFormat;                                                                    // 145
    }(),                                                                                                               // 145
    updateMicroAppFieldOptionDatetype: function () {                                                                   // 159
        function updateMicroAppFieldOptionDatetype(resourceID, fieldID, dateType) {                                    // 159
            if (Meteor.userId() && resourceID) {                                                                       // 160
                var resource = Resources.findOne({ _id: resourceID });                                                 // 161
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 162
                    var dateFormatObj = {};                                                                            // 163
                    switch (dateType) {                                                                                // 164
                        case BuzzyGlobal.gAPPFIELD_DATETYPE.DATETIME.type:                                             // 165
                            dateFormatObj = BuzzyGlobal.gAPPFIELD_DATETYPE.DATETIME;                                   // 166
                            break;                                                                                     // 167
                        case BuzzyGlobal.gAPPFIELD_DATETYPE.DATE.type:                                                 // 168
                            dateFormatObj = BuzzyGlobal.gAPPFIELD_DATETYPE.DATE;                                       // 169
                            break;                                                                                     // 170
                        case BuzzyGlobal.gAPPFIELD_DATETYPE.MONTH.type:                                                // 171
                            dateFormatObj = BuzzyGlobal.gAPPFIELD_DATETYPE.MONTH;                                      // 172
                            break;                                                                                     // 173
                        case BuzzyGlobal.gAPPFIELD_DATETYPE.YEAR.type:                                                 // 174
                            dateFormatObj = BuzzyGlobal.gAPPFIELD_DATETYPE.YEAR;                                       // 175
                            break;                                                                                     // 176
                        case BuzzyGlobal.gAPPFIELD_DATETYPE.TIME.type:                                                 // 177
                            dateFormatObj = BuzzyGlobal.gAPPFIELD_DATETYPE.TIME;                                       // 178
                            break;                                                                                     // 179
                        case BuzzyGlobal.gAPPFIELD_DATETYPE.EVENT.type:                                                // 180
                            dateFormatObj = BuzzyGlobal.gAPPFIELD_DATETYPE.EVENT;                                      // 181
                            break;                                                                                     // 182
                        default:                                                                                       // 183
                            dateFormatObj = BuzzyGlobal.gAPPFIELD_DATETYPE.DATETIME;                                   // 184
                                                                                                                       //
                    }                                                                                                  // 164
                                                                                                                       //
                    MicroAppFields.update({ _id: fieldID }, { $set: { option: dateFormatObj } }, function (error) {    // 188
                        if (error) {                                                                                   // 189
                            BuzzyGlobal.throwError(error);                                                             // 190
                        }                                                                                              // 191
                    });                                                                                                // 192
                }                                                                                                      // 194
            }                                                                                                          // 195
        }                                                                                                              // 196
                                                                                                                       //
        return updateMicroAppFieldOptionDatetype;                                                                      // 159
    }(),                                                                                                               // 159
    updateMicroAppFieldRowSelector: function () {                                                                      // 197
        function updateMicroAppFieldRowSelector(resourceID, fieldID, val) {                                            // 197
            if (Meteor.userId() && resourceID) {                                                                       // 198
                var resource = Resources.findOne({ _id: resourceID });                                                 // 199
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 200
                    var dateFormatObj = {};                                                                            // 201
                                                                                                                       //
                    MicroAppFields.update({ _id: fieldID }, { $set: { option: val } }, function (error) {              // 203
                        if (error) {                                                                                   // 204
                            BuzzyGlobal.throwError(error);                                                             // 205
                        }                                                                                              // 206
                    });                                                                                                // 207
                }                                                                                                      // 209
            }                                                                                                          // 210
        }                                                                                                              // 211
                                                                                                                       //
        return updateMicroAppFieldRowSelector;                                                                         // 197
    }(),                                                                                                               // 197
    updateMicroAppFieldOptionRating: function () {                                                                     // 212
        function updateMicroAppFieldOptionRating(resourceID, fieldID, val) {                                           // 212
            if (Meteor.userId() && resourceID) {                                                                       // 213
                var resource = Resources.findOne({ _id: resourceID });                                                 // 214
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 215
                                                                                                                       //
                    MicroAppFields.update({ _id: fieldID }, { $set: { option: val } }, function (error) {              // 217
                        if (error) {                                                                                   // 218
                            BuzzyGlobal.throwError(error);                                                             // 219
                        }                                                                                              // 220
                    });                                                                                                // 221
                }                                                                                                      // 223
            }                                                                                                          // 224
        }                                                                                                              // 225
                                                                                                                       //
        return updateMicroAppFieldOptionRating;                                                                        // 212
    }(),                                                                                                               // 212
    updateMicroAppFieldOptionAutoIncrement: function () {                                                              // 226
        function updateMicroAppFieldOptionAutoIncrement(resourceID, fieldID, val) {                                    // 226
            if (Meteor.userId() && resourceID) {                                                                       // 227
                var resource = Resources.findOne({ _id: resourceID });                                                 // 228
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 229
                                                                                                                       //
                    MicroAppFields.update({ _id: fieldID }, { $set: { "option.autoIncrement": val } }, function (error) {
                        if (error) {                                                                                   // 234
                            BuzzyGlobal.throwError(error);                                                             // 235
                        }                                                                                              // 236
                    });                                                                                                // 237
                }                                                                                                      // 239
            }                                                                                                          // 240
        }                                                                                                              // 241
                                                                                                                       //
        return updateMicroAppFieldOptionAutoIncrement;                                                                 // 226
    }(),                                                                                                               // 226
    updateMicroAppFieldOptionIsPhonenumber: function () {                                                              // 242
        function updateMicroAppFieldOptionIsPhonenumber(resourceID, fieldID, val) {                                    // 242
            if (Meteor.userId() && resourceID) {                                                                       // 243
                var resource = Resources.findOne({ _id: resourceID });                                                 // 244
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 245
                                                                                                                       //
                    MicroAppFields.update({ _id: fieldID }, { $set: { "option.isPhoneNumber": val } }, function (error) {
                        if (error) {                                                                                   // 250
                            BuzzyGlobal.throwError(error);                                                             // 251
                        }                                                                                              // 252
                    });                                                                                                // 253
                }                                                                                                      // 255
            }                                                                                                          // 256
        }                                                                                                              // 257
                                                                                                                       //
        return updateMicroAppFieldOptionIsPhonenumber;                                                                 // 242
    }(),                                                                                                               // 242
    updateMicroAppFieldOptionWatsonPersonality: function () {                                                          // 258
        function updateMicroAppFieldOptionWatsonPersonality(resourceID, fieldID, val) {                                // 258
            if (Meteor.userId() && resourceID) {                                                                       // 259
                var resource = Resources.findOne({ _id: resourceID });                                                 // 260
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 261
                                                                                                                       //
                    MicroAppFields.update({ _id: fieldID }, { $set: { "option.isWatsonPersonality": val } }, function (error) {
                        if (error) {                                                                                   // 266
                            BuzzyGlobal.throwError(error);                                                             // 267
                        }                                                                                              // 268
                    });                                                                                                // 269
                }                                                                                                      // 271
            }                                                                                                          // 272
        }                                                                                                              // 273
                                                                                                                       //
        return updateMicroAppFieldOptionWatsonPersonality;                                                             // 258
    }(),                                                                                                               // 258
    updateMicroAppFieldOptionEventIncludeRSVP: function () {                                                           // 274
        function updateMicroAppFieldOptionEventIncludeRSVP(resourceID, fieldID, value) {                               // 274
            if (Meteor.userId() && resourceID) {                                                                       // 275
                var resource = Resources.findOne({ _id: resourceID });                                                 // 276
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 277
                                                                                                                       //
                    MicroAppFields.update({ _id: fieldID }, { $set: { "option.includeRSVP": value } }, function (error) {
                        if (error) {                                                                                   // 281
                            BuzzyGlobal.throwError(error);                                                             // 282
                        }                                                                                              // 283
                    });                                                                                                // 284
                }                                                                                                      // 286
            }                                                                                                          // 287
        }                                                                                                              // 288
                                                                                                                       //
        return updateMicroAppFieldOptionEventIncludeRSVP;                                                              // 274
    }(),                                                                                                               // 274
    updateMicroAppFieldOptionEventHideAttendee: function () {                                                          // 289
        function updateMicroAppFieldOptionEventHideAttendee(resourceID, fieldID, value) {                              // 289
            if (Meteor.userId() && resourceID) {                                                                       // 290
                var resource = Resources.findOne({ _id: resourceID });                                                 // 291
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 292
                                                                                                                       //
                    MicroAppFields.update({ _id: fieldID }, { $set: { "option.hideRSVPAudience": value } }, function (error) {
                        if (error) {                                                                                   // 296
                            BuzzyGlobal.throwError(error);                                                             // 297
                        }                                                                                              // 298
                    });                                                                                                // 299
                }                                                                                                      // 301
            }                                                                                                          // 302
        }                                                                                                              // 303
                                                                                                                       //
        return updateMicroAppFieldOptionEventHideAttendee;                                                             // 289
    }(),                                                                                                               // 289
    updateMicroAppFieldOptionEventAuthorRSVP: function () {                                                            // 304
        function updateMicroAppFieldOptionEventAuthorRSVP(resourceID, fieldID, value) {                                // 304
            if (Meteor.userId() && resourceID) {                                                                       // 305
                var resource = Resources.findOne({ _id: resourceID });                                                 // 306
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 307
                                                                                                                       //
                    MicroAppFields.update({ _id: fieldID }, { $set: { "option.allowAuthorRSVP": value } }, function (error) {
                        if (error) {                                                                                   // 311
                            BuzzyGlobal.throwError(error);                                                             // 312
                        }                                                                                              // 313
                    });                                                                                                // 314
                }                                                                                                      // 316
            }                                                                                                          // 317
        }                                                                                                              // 318
                                                                                                                       //
        return updateMicroAppFieldOptionEventAuthorRSVP;                                                               // 304
    }(),                                                                                                               // 304
    updateMicroAppFieldCollapseBreakPoint: function () {                                                               // 319
        function updateMicroAppFieldCollapseBreakPoint(resourceID, fieldID, fieldVal) {                                // 319
            if (Meteor.userId() && resourceID) {                                                                       // 320
                var resource = Resources.findOne({ _id: resourceID });                                                 // 321
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 322
                                                                                                                       //
                    MicroAppFields.update({ _id: fieldID }, { $set: { "collapseBreakPoint": fieldVal } }, function (error) {
                        if (error) {                                                                                   // 325
                            BuzzyGlobal.throwError(error);                                                             // 326
                        }                                                                                              // 327
                    });                                                                                                // 328
                }                                                                                                      // 330
            }                                                                                                          // 331
        }                                                                                                              // 332
                                                                                                                       //
        return updateMicroAppFieldCollapseBreakPoint;                                                                  // 319
    }(),                                                                                                               // 319
    updateMicroAppFieldOptionDisplayAs: function () {                                                                  // 333
        function updateMicroAppFieldOptionDisplayAs(resourceID, fieldID, fieldVal) {                                   // 333
            if (Meteor.userId() && resourceID) {                                                                       // 334
                var resource = Resources.findOne({ _id: resourceID });                                                 // 335
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 336
                                                                                                                       //
                    MicroAppFields.update({ _id: fieldID }, { $set: { "option.displayAs": fieldVal } }, function (error) {
                        if (error) {                                                                                   // 339
                            BuzzyGlobal.throwError(error);                                                             // 340
                        }                                                                                              // 341
                    });                                                                                                // 342
                }                                                                                                      // 344
            }                                                                                                          // 345
        }                                                                                                              // 346
                                                                                                                       //
        return updateMicroAppFieldOptionDisplayAs;                                                                     // 333
    }(),                                                                                                               // 333
    updateMicroAppFieldOptionDisplayResultsBy: function () {                                                           // 347
        function updateMicroAppFieldOptionDisplayResultsBy(resourceID, fieldID, fieldVal) {                            // 347
            if (Meteor.userId() && resourceID) {                                                                       // 348
                var resource = Resources.findOne({ _id: resourceID });                                                 // 349
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 350
                                                                                                                       //
                    MicroAppFields.update({ _id: fieldID }, { $set: { option: { displayResultsBy: fieldVal } } }, function (error) {
                        if (error) {                                                                                   // 353
                            BuzzyGlobal.throwError(error);                                                             // 354
                        }                                                                                              // 355
                    });                                                                                                // 356
                }                                                                                                      // 358
            }                                                                                                          // 359
        }                                                                                                              // 360
                                                                                                                       //
        return updateMicroAppFieldOptionDisplayResultsBy;                                                              // 347
    }(),                                                                                                               // 347
    updateMicroAppFieldWhoCanAdd: function () {                                                                        // 361
        function updateMicroAppFieldWhoCanAdd(resourceID, fieldID, fieldVal) {                                         // 361
            if (Meteor.userId() && resourceID) {                                                                       // 362
                var resource = Resources.findOne({ _id: resourceID });                                                 // 363
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 364
                                                                                                                       //
                    MicroAppFields.update({ _id: fieldID }, { $set: { whoCanAdd: fieldVal } }, function (error) {      // 366
                        if (error) {                                                                                   // 367
                            BuzzyGlobal.throwError(error);                                                             // 368
                        }                                                                                              // 369
                    });                                                                                                // 370
                }                                                                                                      // 372
            }                                                                                                          // 373
        }                                                                                                              // 374
                                                                                                                       //
        return updateMicroAppFieldWhoCanAdd;                                                                           // 361
    }(),                                                                                                               // 361
    updateMicroAppFieldWhoCanEdit: function () {                                                                       // 375
        function updateMicroAppFieldWhoCanEdit(resourceID, fieldID, fieldVal) {                                        // 375
            if (Meteor.userId() && resourceID) {                                                                       // 376
                var resource = Resources.findOne({ _id: resourceID });                                                 // 377
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 378
                                                                                                                       //
                    MicroAppFields.update({ _id: fieldID }, { $set: { whoCanEdit: fieldVal } }, function (error) {     // 380
                        if (error) {                                                                                   // 381
                            BuzzyGlobal.throwError(error);                                                             // 382
                        }                                                                                              // 383
                    });                                                                                                // 384
                }                                                                                                      // 386
            }                                                                                                          // 387
        }                                                                                                              // 388
                                                                                                                       //
        return updateMicroAppFieldWhoCanEdit;                                                                          // 375
    }(),                                                                                                               // 375
    updateMicroAppFieldWhoCanDelete: function () {                                                                     // 389
        function updateMicroAppFieldWhoCanDelete(resourceID, fieldID, fieldVal) {                                      // 389
            if (Meteor.userId() && resourceID) {                                                                       // 390
                var resource = Resources.findOne({ _id: resourceID });                                                 // 391
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 392
                                                                                                                       //
                    MicroAppFields.update({ _id: fieldID }, { $set: { whoCanDelete: fieldVal } }, function (error) {   // 394
                        if (error) {                                                                                   // 395
                            BuzzyGlobal.throwError(error);                                                             // 396
                        }                                                                                              // 397
                    });                                                                                                // 398
                }                                                                                                      // 400
            }                                                                                                          // 401
        }                                                                                                              // 402
                                                                                                                       //
        return updateMicroAppFieldWhoCanDelete;                                                                        // 389
    }(),                                                                                                               // 389
                                                                                                                       //
    updateMicroAppFieldRank: function () {                                                                             // 404
        function updateMicroAppFieldRank(resourceID, fieldID, fieldVal) {                                              // 404
            if (Meteor.userId() && resourceID) {                                                                       // 405
                var resource = Resources.findOne({ _id: resourceID });                                                 // 406
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 407
                                                                                                                       //
                    MicroAppFields.update({ _id: fieldID }, { $set: { rank: fieldVal } }, function (error) {           // 409
                        if (error) {                                                                                   // 410
                            BuzzyGlobal.throwError(error);                                                             // 411
                        }                                                                                              // 412
                    });                                                                                                // 413
                }                                                                                                      // 415
            }                                                                                                          // 416
        }                                                                                                              // 417
                                                                                                                       //
        return updateMicroAppFieldRank;                                                                                // 404
    }(),                                                                                                               // 404
    removeMicroAppField: function () {                                                                                 // 418
        function removeMicroAppField(resourceID, fieldID) {                                                            // 418
            if (Meteor.userId() && resourceID) {                                                                       // 419
                var resource = Resources.findOne({ _id: resourceID });                                                 // 420
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 421
                    Meteor.call("removeFieldsMicroAppData", resourceID, fieldID, function (err) {                      // 422
                        if (err) {                                                                                     // 423
                            BuzzyGlobal.throwError(err);                                                               // 424
                        } else {                                                                                       // 425
                            MicroAppFields.remove({ _id: fieldID }, function (error) {                                 // 426
                                if (error) {                                                                           // 427
                                    BuzzyGlobal.throwError(error);                                                     // 428
                                }                                                                                      // 429
                            });                                                                                        // 430
                        }                                                                                              // 431
                    });                                                                                                // 432
                }                                                                                                      // 435
            }                                                                                                          // 436
        }                                                                                                              // 437
                                                                                                                       //
        return removeMicroAppField;                                                                                    // 418
    }()                                                                                                                // 418
});                                                                                                                    // 16
                                                                                                                       //
if (Meteor.isServer) {                                                                                                 // 440
    Meteor.methods({                                                                                                   // 441
        microAppEmailCalendar: function () {                                                                           // 442
            function microAppEmailCalendar(resourceID, iCalBlob, dateData) {                                           // 442
                if (Meteor.userId() && resourceID) {                                                                   // 443
                    var resource = Resources.findOne({ _id: resourceID });                                             // 444
                    if (resource && Resources.canView(Meteor.userId(), resource)) {                                    // 445
                        var email = BuzzyGlobal.gGetUserEmail(Meteor.user());                                          // 446
                        var result = Mailer.send({                                                                     // 447
                            to: email, // 'To: ' address. Required.                                                    // 448
                            subject: "Buzzy Calendar Attachment",                                                      // 449
                            template: "iCalEmail", // Required.                                                        // 450
                            replyTo: 'donotreply@buzzy.buzz', // Override global 'ReplyTo: ' option.                   // 451
                            from: "Do Not Reply" + "<donotreply@buzzy.buzz>", // Override global 'From: ' option.      // 452
                            data: dateData,                                                                            // 453
                            attachments: [{ // binary buffer as an attachment                                          // 454
                                fileName: 'calendar.ics',                                                              // 456
                                contents: iCalBlob                                                                     // 457
                            }]                                                                                         // 455
                        });                                                                                            // 447
                    }                                                                                                  // 462
                }                                                                                                      // 463
            }                                                                                                          // 464
                                                                                                                       //
            return microAppEmailCalendar;                                                                              // 442
        }(),                                                                                                           // 442
        duplicateMicroAppFields: function () {                                                                         // 465
            function duplicateMicroAppFields(existingResourceID, newResourceID, optUserToken) {                        // 465
                var user = BuzzyGlobal.getCurrentUser(optUserToken);                                                   // 466
                if (!user) {                                                                                           // 467
                    BuzzyGlobal.throwError("You do not have the permission to do that!");                              // 468
                }                                                                                                      // 469
                if (user && existingResourceID) {                                                                      // 470
                    var resource = Resources.findOne({ _id: existingResourceID });                                     // 471
                    if (resource && Resources.canView(user._id, resource)) {                                           // 472
                        var oldVsNewFieldIDs = [];                                                                     // 473
                        var oldAndNewFieldIDArray = [];                                                                // 474
                        var allFields = MicroAppFields.find({ parentResourceID: existingResourceID });                 // 475
                        if (allFields) {                                                                               // 476
                            allFields.forEach(function (aField) {                                                      // 477
                                var newFieldID = new Meteor.Collection.ObjectID()._str;                                // 478
                                oldAndNewFieldIDArray.push({ oldFieldID: aField._id, newFieldID: newFieldID });        // 479
                                aField.parentResourceID = newResourceID;                                               // 480
                                aField._id = newFieldID;                                                               // 481
                                MicroAppFields.insert(aField);                                                         // 482
                            });                                                                                        // 486
                            return oldAndNewFieldIDArray;                                                              // 487
                        }                                                                                              // 488
                    }                                                                                                  // 490
                }                                                                                                      // 491
            }                                                                                                          // 492
                                                                                                                       //
            return duplicateMicroAppFields;                                                                            // 465
        }()                                                                                                            // 465
    });                                                                                                                // 441
}                                                                                                                      // 494
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"micro_app_votes.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/buzzy-buzz_resources-core/lib/collections/micro_app_votes.js                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**                                                                                                                    // 1
 * Created by adamginsburg on 30/11/2015.                                                                              //
 */                                                                                                                    //
MicroAppVotes = new Meteor.Collection('microAppVotes');                                                                // 4
                                                                                                                       //
Meteor.methods({                                                                                                       // 6
    microAppVote: function () {                                                                                        // 7
        function microAppVote(resourceID, appItemID, fieldID, voteValue) {                                             // 7
            var user = Meteor.user();                                                                                  // 8
            console.log("vote:", user._id, resourceID, appItemID, fieldID, voteValue);                                 // 9
            if (user && resourceID && appItemID && fieldID && voteValue) {                                             // 10
                var resource = Resources.findOne(resourceID);                                                          // 11
                // ensure the user is logged in                                                                        // 12
                                                                                                                       //
                /* Take that out now - come back to it                                                                 // 14
                 if (!Resources.canEdit(Meteor.userId(),resource)){                                                    //
                     BuzzyGlobal.throwError("You are not allowed to perform this operation.")                          //
                 }                                                                                                     //
                */                                                                                                     //
                var submittedDate;                                                                                     // 19
                if (Meteor.isClient) {                                                                                 // 20
                    submittedDate = TimeSync.serverTime();                                                             // 21
                } else {                                                                                               // 22
                    submittedDate = new Date().getTime();                                                              // 23
                }                                                                                                      // 24
                                                                                                                       //
                var previousVote = MicroAppVotes.findOne({ userID: user._id, voteFieldID: fieldID, parentAppID: appItemID });
                                                                                                                       //
                if (previousVote) {                                                                                    // 28
                    MicroAppVotes.update({ _id: previousVote._id }, { $set: { submitted: submittedDate, vote: voteValue }
                    });                                                                                                // 31
                } else {                                                                                               // 33
                    MicroAppVotes.insert({                                                                             // 34
                        userID: user._id,                                                                              // 35
                        author: BuzzyGlobal.gGetUserNameByID(user._id),                                                // 36
                        submitted: submittedDate,                                                                      // 37
                        voteFieldID: fieldID,                                                                          // 38
                        vote: voteValue,                                                                               // 39
                        parentAppID: appItemID,                                                                        // 40
                        parentResourceID: resourceID,                                                                  // 41
                        _id: new Meteor.Collection.ObjectID()._str                                                     // 42
                    });                                                                                                // 34
                }                                                                                                      // 44
            } else {                                                                                                   // 47
                BuzzyGlobal.throwError("Sorry, you're not allowed to do that 123!");                                   // 48
            }                                                                                                          // 49
        }                                                                                                              // 50
                                                                                                                       //
        return microAppVote;                                                                                           // 7
    }(),                                                                                                               // 7
    microAppVoteUser: function () {                                                                                    // 51
        function microAppVoteUser(userID, resourceID, appItemID, fieldID, voteValue) {                                 // 51
            console.log("microAppVoteUser:", userID, "r:", resourceID, "a:", appItemID, "f:", fieldID, "v:", voteValue);
                                                                                                                       //
            var user = Users.findOne({ _id: userID });                                                                 // 54
            if (user && resourceID && appItemID && fieldID && voteValue) {                                             // 55
                var resource = Resources.findOne(resourceID);                                                          // 56
                // ensure the user is logged in                                                                        // 57
                                                                                                                       //
                /* Take that out now - come back to it                                                                 // 59
                 if (!Resources.canEdit(Meteor.userId(),resource)){                                                    //
                 BuzzyGlobal.throwError("You are not allowed to perform this operation.")                              //
                 }                                                                                                     //
                 */                                                                                                    //
                var submittedDate;                                                                                     // 64
                if (Meteor.isClient) {                                                                                 // 65
                    submittedDate = TimeSync.serverTime();                                                             // 66
                } else {                                                                                               // 67
                    submittedDate = new Date().getTime();                                                              // 68
                }                                                                                                      // 69
                                                                                                                       //
                var previousVote = MicroAppVotes.findOne({ userID: user._id, voteFieldID: fieldID, parentAppID: appItemID });
                                                                                                                       //
                if (previousVote) {                                                                                    // 73
                    MicroAppVotes.update({ _id: previousVote._id }, { $set: { submitted: submittedDate, vote: voteValue }
                    });                                                                                                // 76
                } else {                                                                                               // 78
                    MicroAppVotes.insert({                                                                             // 79
                        userID: user._id,                                                                              // 80
                        author: BuzzyGlobal.gGetUserNameByID(user._id),                                                // 81
                        submitted: submittedDate,                                                                      // 82
                        voteFieldID: fieldID,                                                                          // 83
                        vote: voteValue,                                                                               // 84
                        parentAppID: appItemID,                                                                        // 85
                        parentResourceID: resourceID,                                                                  // 86
                        _id: new Meteor.Collection.ObjectID()._str                                                     // 87
                    });                                                                                                // 79
                }                                                                                                      // 89
            } else {                                                                                                   // 92
                BuzzyGlobal.throwError("Sorry, you're not allowed to do that!");                                       // 93
            }                                                                                                          // 94
        }                                                                                                              // 95
                                                                                                                       //
        return microAppVoteUser;                                                                                       // 51
    }(),                                                                                                               // 51
    viewMicroAppVoteToCSV: function () {                                                                               // 96
        function viewMicroAppVoteToCSV(resourceID, appID, voteFieldID) {                                               // 96
            var viewViewerSuperSet = Resources.viewerSuperset(resourceID);                                             // 97
            var results = viewViewerSuperSet.map(function (userID) {                                                   // 98
                var vote = MicroAppVotes.findOne({ userID: userID, voteFieldID: voteFieldID });                        // 99
                if (vote) {                                                                                            // 100
                    return [BuzzyGlobal.gGetUserNameByID(userID), vote.vote, moment(vote.submitted).format()];         // 101
                } else {                                                                                               // 102
                    return [BuzzyGlobal.gGetUserNameByID(userID), "No response yet", ""];                              // 103
                }                                                                                                      // 104
            });                                                                                                        // 106
                                                                                                                       //
            return {                                                                                                   // 108
                fields: ["Person", "Vote", "Submitted"],                                                               // 109
                data: results                                                                                          // 110
            };                                                                                                         // 108
        }                                                                                                              // 113
                                                                                                                       //
        return viewMicroAppVoteToCSV;                                                                                  // 96
    }()                                                                                                                // 96
});                                                                                                                    // 6
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"micro_app_child.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/buzzy-buzz_resources-core/lib/collections/micro_app_child.js                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**                                                                                                                    // 1
 * Created by adamginsburg on 8/11/2015.                                                                               //
 */                                                                                                                    //
MicroAppChild = new Meteor.Collection('microAppChild');                                                                // 4
/*                                                                                                                     // 5
AppData.allow({                                                                                                        //
    //update: Resources.ownsDocument                                                                                   //
    //update: Resources.ownsNotification,                                                                              //
    insert: Meteor.user                                                                                                //
});                                                                                                                    //
*/                                                                                                                     //
                                                                                                                       //
Meteor.methods({                                                                                                       // 17
                                                                                                                       //
    addMicroAppChild: function () {                                                                                    // 19
        function addMicroAppChild(microAppResourceID, topLevelResourceID, appID, fieldID, content) {                   // 19
            var user = Meteor.user();                                                                                  // 20
                                                                                                                       //
            var resource = Resources.findOne(microAppResourceID);                                                      // 22
            // ensure the user is logged in                                                                            // 23
            if (!user) {                                                                                               // 24
                BuzzyGlobal.throwError("You need to be logged complete this operation.");                              // 25
            };                                                                                                         // 27
                                                                                                                       //
            var submittedDate;                                                                                         // 30
            if (Meteor.isClient) {                                                                                     // 31
                submittedDate = TimeSync.serverTime();                                                                 // 32
            } else {                                                                                                   // 33
                submittedDate = new Date().getTime();                                                                  // 34
            }                                                                                                          // 35
            var author = BuzzyGlobal.gGetUserNameByID(user._id);                                                       // 36
            var parentField = MicroAppFields.findOne({ _id: fieldID });                                                // 37
            var microAppItem = MicroAppData.findOne({ _id: appID });                                                   // 38
                                                                                                                       //
            if (parentField && microAppItem && Resources.canEditMicroAppField(user._id, resource, parentField.whoCanEdit, resource.whoCanView, microAppItem.userID)) {
                var childDataToInsert = {                                                                              // 42
                    userID: user._id,                                                                                  // 43
                    author: author,                                                                                    // 44
                    submitted: submittedDate,                                                                          // 45
                    content: content,                                                                                  // 46
                    parentResourceID: microAppResourceID,                                                              // 47
                    parentAppItemID: appID,                                                                            // 48
                    parentAppFieldID: fieldID,                                                                         // 49
                    type: parentField.fieldType,                                                                       // 50
                    _id: new Meteor.Collection.ObjectID()._str                                                         // 51
                };                                                                                                     // 42
                MicroAppChild.insert(childDataToInsert, function (error) {                                             // 53
                    if (!error) {                                                                                      // 54
                        Meteor.call("updateUpdatedDate", topLevelResourceID);                                          // 55
                    }                                                                                                  // 57
                });                                                                                                    // 58
                return childDataToInsert._id;                                                                          // 59
            }                                                                                                          // 60
        }                                                                                                              // 63
                                                                                                                       //
        return addMicroAppChild;                                                                                       // 19
    }(),                                                                                                               // 19
    removeMicroAppChild: function () {                                                                                 // 64
        function removeMicroAppChild(childID) {                                                                        // 64
            var user = Meteor.user();                                                                                  // 65
                                                                                                                       //
            if (!user) {                                                                                               // 67
                BuzzyGlobal.throwError("You need to be logged complete this operation.");                              // 68
            };                                                                                                         // 70
            var microAppChildItem = MicroAppChild.findOne({ _id: childID });                                           // 71
            if (!microAppChildItem) {                                                                                  // 72
                BuzzyGlobal.throwError("Item does not exist!");                                                        // 73
            };                                                                                                         // 74
            var resource = Resources.findOne({ _id: microAppChildItem.parentResourceID });                             // 75
                                                                                                                       //
            var parentField = MicroAppFields.findOne({ _id: microAppChildItem.parentAppFieldID });                     // 78
            var microAppItem = MicroAppData.findOne({ _id: microAppChildItem.parentAppItemID });                       // 79
                                                                                                                       //
            if (parentField && microAppItem && Resources.canEditMicroAppField(user._id, resource, parentField.whoCanEdit, resource.whoCanView, microAppItem.userID)) {
                MicroAppChild.remove({ "_id": childID }, function (error) {                                            // 83
                    if (error) {                                                                                       // 86
                        BuzzyGlobal.throwError(error);                                                                 // 87
                    }                                                                                                  // 88
                });                                                                                                    // 89
            }                                                                                                          // 91
        }                                                                                                              // 93
                                                                                                                       //
        return removeMicroAppChild;                                                                                    // 64
    }()                                                                                                                // 64
                                                                                                                       //
});                                                                                                                    // 17
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"micro_app_action_rules.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/buzzy-buzz_resources-core/lib/collections/micro_app_action_rules.js                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**                                                                                                                    // 1
 * Created by adamginsburg on 14/11/2015.                                                                              //
 */                                                                                                                    //
MicroAppActionRules = new Meteor.Collection('microAppActionRules');                                                    // 4
MicroAppActionRules.getHighestRank = function (resourceID) {                                                           // 5
    if (Meteor.userId() && resourceID) {                                                                               // 6
        var lastRankedItem = MicroAppActionRules.findOne({ parentResourceID: resourceID }, { sort: { rank: -1 } });    // 7
        if (!lastRankedItem || isNaN(lastRankedItem.rank)) {                                                           // 8
            return 0;                                                                                                  // 9
        } else {                                                                                                       // 10
            return lastRankedItem.rank;                                                                                // 11
        }                                                                                                              // 12
    }                                                                                                                  // 14
};                                                                                                                     // 15
Meteor.methods({                                                                                                       // 16
    insertMicroAppActionRule: function () {                                                                            // 17
        function insertMicroAppActionRule(resourceID, actionRule) {                                                    // 17
            if (Meteor.userId() && resourceID) {                                                                       // 18
                var resource = Resources.findOne({ _id: resourceID });                                                 // 19
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 20
                    var rank = MicroAppActionRules.getHighestRank(resourceID) + 1;                                     // 21
                    actionRule._id = new Meteor.Collection.ObjectID()._str;                                            // 22
                    actionRule.parentResourceID = resourceID;                                                          // 23
                                                                                                                       //
                    MicroAppActionRules.insert(actionRule, function (error) {                                          // 25
                        if (error) {                                                                                   // 26
                            BuzzyGlobal.throwError(error);                                                             // 27
                        }                                                                                              // 28
                    });                                                                                                // 29
                }                                                                                                      // 33
            }                                                                                                          // 34
        }                                                                                                              // 35
                                                                                                                       //
        return insertMicroAppActionRule;                                                                               // 17
    }(),                                                                                                               // 17
                                                                                                                       //
    updateMicroAppActionCondition: function () {                                                                       // 39
        function updateMicroAppActionCondition(resourceID, actionID, val) {                                            // 39
            if (Meteor.userId() && resourceID) {                                                                       // 40
                var resource = Resources.findOne({ _id: resourceID });                                                 // 41
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 42
                                                                                                                       //
                    MicroAppActionRules.update({ _id: actionID }, { $set: { "condition": val } }, function (error) {   // 44
                        if (error) {                                                                                   // 45
                            BuzzyGlobal.throwError(error);                                                             // 46
                        }                                                                                              // 47
                    });                                                                                                // 48
                }                                                                                                      // 50
            }                                                                                                          // 51
        }                                                                                                              // 52
                                                                                                                       //
        return updateMicroAppActionCondition;                                                                          // 39
    }(),                                                                                                               // 39
                                                                                                                       //
    updateMicroAppActionRuleRank: function () {                                                                        // 56
        function updateMicroAppActionRuleRank(resourceID, actionID, fieldVal) {                                        // 56
            if (Meteor.userId() && resourceID) {                                                                       // 57
                var resource = Resources.findOne({ _id: resourceID });                                                 // 58
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 59
                                                                                                                       //
                    MicroAppActionRules.update({ _id: actionID }, { $set: { rank: fieldVal } }, function (error) {     // 61
                        if (error) {                                                                                   // 62
                            BuzzyGlobal.throwError(error);                                                             // 63
                        }                                                                                              // 64
                    });                                                                                                // 65
                }                                                                                                      // 67
            }                                                                                                          // 68
        }                                                                                                              // 69
                                                                                                                       //
        return updateMicroAppActionRuleRank;                                                                           // 56
    }(),                                                                                                               // 56
    removeMicroAppActionRule: function () {                                                                            // 70
        function removeMicroAppActionRule(resourceID, actionID) {                                                      // 70
            if (Meteor.userId() && resourceID) {                                                                       // 71
                var resource = Resources.findOne({ _id: resourceID });                                                 // 72
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 73
                    MicroAppActionRules.remove({ _id: actionID }, function (error) {                                   // 74
                        if (error) {                                                                                   // 75
                            BuzzyGlobal.throwError(error);                                                             // 76
                        }                                                                                              // 77
                    });                                                                                                // 78
                }                                                                                                      // 80
            }                                                                                                          // 81
        }                                                                                                              // 82
                                                                                                                       //
        return removeMicroAppActionRule;                                                                               // 70
    }()                                                                                                                // 70
});                                                                                                                    // 16
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"collection_globals.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/buzzy-buzz_resources-core/lib/collections/collection_globals.js                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**                                                                                                                    // 1
 * Created by adamginsburg on 13/10/2015.                                                                              //
 */                                                                                                                    //
gCleanString = function gCleanString(s) {                                                                              // 4
    if (s) {                                                                                                           // 5
        var cleanString = s.replace(/[|&;$%@"<>()+,]/g, "");                                                           // 6
        if (cleanString.length == 0) {                                                                                 // 7
            return Random.id();                                                                                        // 8
        } else {                                                                                                       // 9
            return cleanString;                                                                                        // 10
        }                                                                                                              // 11
    } else {                                                                                                           // 12
        return Random.id();                                                                                            // 13
    }                                                                                                                  // 14
};                                                                                                                     // 17
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"teams.js":["babel-runtime/helpers/typeof",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/buzzy-buzz_resources-core/lib/collections/teams.js                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _typeof;module.import("babel-runtime/helpers/typeof",{"default":function(v){_typeof=v}});                          //
/**                                                                                                                    // 1
 * Created by adamginsburg on 13/07/2016.                                                                              //
 */                                                                                                                    //
Teams = new Meteor.Collection('teams');                                                                                // 4
                                                                                                                       //
Teams.isAdmin = function (userID, teamID) {                                                                            // 7
    if ((typeof userID === "undefined" ? "undefined" : _typeof(userID)) !== undefined && typeof teamID !== "undefined") {
        return TeamMembers.findOne({ teamID: teamID, userID: userID, role: BuzzyGlobal.gMEMBER_TYPE.ADMIN });          // 9
    } else {                                                                                                           // 10
        return false;                                                                                                  // 11
    }                                                                                                                  // 12
};                                                                                                                     // 14
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"team_members.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/buzzy-buzz_resources-core/lib/collections/team_members.js                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**                                                                                                                    // 1
 * Created by adamginsburg on 13/07/2016.                                                                              //
 */                                                                                                                    //
TeamMembers = new Meteor.Collection('teamMembers');                                                                    // 4
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"comments.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/buzzy-buzz_resources-core/lib/collections/comments.js                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Comments = new Meteor.Collection('comments');                                                                          // 1
Comments.allow({                                                                                                       // 2
    //update: Resources.ownsDocument                                                                                   // 3
    //update: Resources.ownsNotification,                                                                              // 4
    insert: Meteor.user                                                                                                // 5
});                                                                                                                    // 2
                                                                                                                       //
Comments.hasViewed = function (userID, commentID) {                                                                    // 9
    var viewedComment = CommentsViewed.findOne({ $and: [{ userID: userID }, { commentID: commentID }] });              // 10
    if (viewedComment) {                                                                                               // 11
        return viewedComment;                                                                                          // 12
    } else {                                                                                                           // 13
        return false;                                                                                                  // 14
    }                                                                                                                  // 15
};                                                                                                                     // 17
                                                                                                                       //
if (Meteor.isServer) {                                                                                                 // 19
    Meteor.methods({                                                                                                   // 20
        hasMoreComments: function () {                                                                                 // 21
            function hasMoreComments(resourceID, submitted) {                                                          // 21
                var userSearchCommentsExpression = new RegExp(Meteor.userId());                                        // 22
                if (Meteor.userId() && resourceID && submitted) {                                                      // 23
                    var lastComments = Comments.find({ $and: [{ $or: [{                                                // 24
                                $and: [{ resourceParentID: resourceID }, { toUsers: null }, { $or: [{ status: BuzzyGlobal.gCOMMENTSTATUS.LIVE }, { status: BuzzyGlobal.gCOMMENTSTATUS.DELETED }] }]
                            }, {                                                                                       // 29
                                $and: [{ resourceParentID: resourceID }, { toUsers: null }, { status: BuzzyGlobal.gCOMMENTSTATUS.WAITING_APPROVAL }, { userID: Meteor.userId() }]
                            }, {                                                                                       // 40
                                $and: [{ resourceParentID: resourceID }, { toUsers: userSearchCommentsExpression }]    // 47
                            }] }, { submitted: { $gte: submitted } }] }, { sort: { submitted: 1 }, limit: 2 });        // 46
                    return lastComments.count() > 1;                                                                   // 52
                }                                                                                                      // 53
            }                                                                                                          // 54
                                                                                                                       //
            return hasMoreComments;                                                                                    // 21
        }(),                                                                                                           // 21
        /*commentCountLive: function(resourceID){                                                                      // 55
            var userSearchCommentsExpression = new RegExp(Meteor.userId());                                            //
            if (Meteor.userId() && resourceID){                                                                        //
                var lastComments =                                                                                     //
                    Comments.find(                                                                                     //
                        {$and:[                                                                                        //
                            {$or: [                                                                                    //
                                 {                                                                                     //
                                    $and: [                                                                            //
                                        {resourceParentID: resourceID},                                                //
                                        {toUsers: null},                                                               //
                                        {$or:[                                                                         //
                                            {status:BuzzyGlobal.gCOMMENTSTATUS.LIVE},                                  //
                                            {$and:[                                                                    //
                                                {status:BuzzyGlobal.gCOMMENTSTATUS.WAITING_APPROVAL},                  //
                                                {userID: Meteor.userId()}                                              //
                                            ]}                                                                         //
                                         ]}                                                                            //
                                    ]                                                                                  //
                                },                                                                                     //
                                {                                                                                      //
                                    $and: [                                                                            //
                                        {resourceParentID: resourceID},                                                //
                                        {toUsers: userSearchCommentsExpression},                                       //
                                        {$or:[                                                                         //
                                            {status:BuzzyGlobal.gCOMMENTSTATUS.LIVE},                                  //
                                            {status:BuzzyGlobal.gCOMMENTSTATUS.WAITING_APPROVAL}                       //
                                        ]}                                                                             //
                                    ]                                                                                  //
                                }                                                                                      //
                            ]}                                                                                         //
                          ]});                                                                                         //
                return lastComments.count();                                                                           //
            }                                                                                                          //
        },*/                                                                                                           //
        hasPreviousComments: function () {                                                                             // 94
            function hasPreviousComments(resourceID, submitted) {                                                      // 94
                var userSearchCommentsExpression = new RegExp(Meteor.userId());                                        // 95
                if (Meteor.userId() && resourceID && submitted) {                                                      // 96
                    var previousComments = Comments.find({ $and: [{ $or: [{                                            // 97
                                $and: [{ resourceParentID: resourceID }, { toUsers: null }]                            // 103
                            }, {                                                                                       // 102
                                $and: [{ resourceParentID: resourceID }, { toUsers: userSearchCommentsExpression }]    // 106
                            }] }, { submitted: { $lte: submitted } }] }, { sort: { submitted: 1 }, limit: 2 });        // 105
                    return previousComments.count() > 1;                                                               // 111
                }                                                                                                      // 112
            }                                                                                                          // 113
                                                                                                                       //
            return hasPreviousComments;                                                                                // 94
        }(),                                                                                                           // 94
        /*commentCountLive: function(resourceID){                                                                      // 114
            var userSearchCommentsExpression = new RegExp(Meteor.userId());                                            //
            if (Meteor.userId() && resourceID){                                                                        //
                var lastComments =                                                                                     //
                    Comments.find(                                                                                     //
                        {$and:[                                                                                        //
                            {$or: [                                                                                    //
                                 {                                                                                     //
                                    $and: [                                                                            //
                                        {resourceParentID: resourceID},                                                //
                                        {toUsers: null},                                                               //
                                        {$or:[                                                                         //
                                            {status:BuzzyGlobal.gCOMMENTSTATUS.LIVE},                                  //
                                            {$and:[                                                                    //
                                                {status:BuzzyGlobal.gCOMMENTSTATUS.WAITING_APPROVAL},                  //
                                                {userID: Meteor.userId()}                                              //
                                            ]}                                                                         //
                                         ]}                                                                            //
                                    ]                                                                                  //
                                },                                                                                     //
                                {                                                                                      //
                                    $and: [                                                                            //
                                        {resourceParentID: resourceID},                                                //
                                        {toUsers: userSearchCommentsExpression},                                       //
                                        {$or:[                                                                         //
                                            {status:BuzzyGlobal.gCOMMENTSTATUS.LIVE},                                  //
                                            {status:BuzzyGlobal.gCOMMENTSTATUS.WAITING_APPROVAL}                       //
                                        ]}                                                                             //
                                    ]                                                                                  //
                                }                                                                                      //
                            ]}                                                                                         //
                          ]});                                                                                         //
                return lastComments.count();                                                                           //
            }                                                                                                          //
        },*/                                                                                                           //
        totalComments: function () {                                                                                   // 153
            function totalComments(resourceID) {                                                                       // 153
                if (!resourceID) {                                                                                     // 154
                    BuzzyGlobal.throwError("Invalid resource ID");                                                     // 155
                }                                                                                                      // 156
                var resource = Resources.findOne({ _id: resourceID });                                                 // 157
                if (Meteor.userId() && resource) {                                                                     // 158
                                                                                                                       //
                    return Comments.find({                                                                             // 160
                        $and: [{ resourceParentID: resourceID }, { $or: [{ status: BuzzyGlobal.gCOMMENTSTATUS.LIVE }, { status: BuzzyGlobal.gCOMMENTSTATUS.WAITING_APPROVAL }] }]
                    }).count();                                                                                        // 160
                }                                                                                                      // 170
            }                                                                                                          // 171
                                                                                                                       //
            return totalComments;                                                                                      // 153
        }(),                                                                                                           // 153
        viewCommentsToCSV: function () {                                                                               // 172
            function viewCommentsToCSV(resourceID, commentID) {                                                        // 172
                var viewViewerSuperSet = Resources.viewerSuperset(resourceID);                                         // 173
                var results = viewViewerSuperSet.map(function (userID) {                                               // 174
                    var hasViewed = Comments.hasViewed(userID, commentID);                                             // 175
                    var hasViewedResult = hasViewed ? moment(hasViewed.submitted).format() : "not viewed";             // 176
                                                                                                                       //
                    return [BuzzyGlobal.gGetUserNameByID(userID), hasViewedResult];                                    // 178
                });                                                                                                    // 179
                                                                                                                       //
                return {                                                                                               // 181
                    fields: ["Person", "Viewed?"],                                                                     // 182
                    data: results                                                                                      // 183
                };                                                                                                     // 181
            }                                                                                                          // 186
                                                                                                                       //
            return viewCommentsToCSV;                                                                                  // 172
        }()                                                                                                            // 172
                                                                                                                       //
    });                                                                                                                // 20
}                                                                                                                      // 190
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"commentsViewed.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/buzzy-buzz_resources-core/lib/collections/commentsViewed.js                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
CommentsViewed = new Meteor.Collection('commentsViewed');                                                              // 1
CommentsViewed.allow({                                                                                                 // 2
    //update: Resources.ownsDocument                                                                                   // 3
    //update: Resources.ownsNotification,                                                                              // 4
    insert: Meteor.user                                                                                                // 5
});                                                                                                                    // 2
                                                                                                                       //
Meteor.methods({                                                                                                       // 8
    viewedComment: function () {                                                                                       // 9
        function viewedComment(userID, resourceID, commentID) {                                                        // 9
            check(resourceID, String);                                                                                 // 10
            check(commentID, String);                                                                                  // 11
            check(userID, String);                                                                                     // 12
            // NEED TO ADD - should probably check that userID can viewResourceID                                      // 13
            if (userID) {                                                                                              // 14
                var alreadyViewed = CommentsViewed.findOne({ $and: [{ userID: userID }, { resourceID: resourceID }, { commentID: commentID }] });
                if (!alreadyViewed) {                                                                                  // 21
                    var submittedDate;                                                                                 // 22
                    if (Meteor.isClient) {                                                                             // 23
                        submittedDate = TimeSync.serverTime();                                                         // 24
                    } else {                                                                                           // 25
                        submittedDate = new Date().getTime();                                                          // 26
                    }                                                                                                  // 27
                    CommentsViewed.insert({                                                                            // 28
                        _id: new Meteor.Collection.ObjectID()._str,                                                    // 29
                        userID: userID,                                                                                // 30
                        resourceID: resourceID,                                                                        // 31
                        commentID: commentID,                                                                          // 32
                        submitted: submittedDate                                                                       // 33
                                                                                                                       //
                    });                                                                                                // 28
                }                                                                                                      // 36
            }                                                                                                          // 38
        }                                                                                                              // 39
                                                                                                                       //
        return viewedComment;                                                                                          // 9
    }(),                                                                                                               // 9
    viewedCommentsSummary: function () {                                                                               // 40
        function viewedCommentsSummary() {                                                                             // 40
            var pipeline = [{ $match: { parentResourceID: resourceID } }, { $project: { author: 1, content: 1, parentResourceID: 1, submitted: 1, userID: 1, _id: 1 } }, { $sort: { submitted: -1 } }, { $limit: 10 }
            //{$group: {_id: null, resTime: {$sum: "$resTime"}}}                                                       // 46
            ];                                                                                                         // 41
            var results = MicroAppData.aggregate(pipeline);                                                            // 48
        }                                                                                                              // 49
                                                                                                                       //
        return viewedCommentsSummary;                                                                                  // 40
    }()                                                                                                                // 40
                                                                                                                       //
});                                                                                                                    // 8
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"notifications.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/buzzy-buzz_resources-core/lib/collections/notifications.js                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**                                                                                                                    // 1
* Created by adamginsburg on 19/06/2014.                                                                               //
*/                                                                                                                     //
Notifications = new Meteor.Collection('notifications');                                                                // 4
                                                                                                                       //
Notifications.allow({                                                                                                  // 6
    //update: Resources.ownsDocument                                                                                   // 7
    update: Resources.ownsNotification,                                                                                // 8
    insert: Meteor.user                                                                                                // 9
});                                                                                                                    // 6
                                                                                                                       //
Meteor.methods({                                                                                                       // 12
    markNotificationReadForComment: function () {                                                                      // 13
        function markNotificationReadForComment(commentID) {                                                           // 13
            if (Meteor.userId()) {                                                                                     // 14
                Notifications.update({ $and: [{ commentID: commentID }, { forUserID: Meteor.userId() }, { read: false }] }, { $set: { read: true } }, { multi: true });
            }                                                                                                          // 24
        }                                                                                                              // 26
                                                                                                                       //
        return markNotificationReadForComment;                                                                         // 13
    }()                                                                                                                // 13
                                                                                                                       //
});                                                                                                                    // 12
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"resourcefollowers.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/buzzy-buzz_resources-core/lib/collections/resourcefollowers.js                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**                                                                                                                    // 1
 * Created by adamginsburg on 22/05/2014.                                                                              //
 */                                                                                                                    //
ResourceFollowers = new Meteor.Collection('resourceFollowers');                                                        // 4
                                                                                                                       //
ResourceFollowers.allow({                                                                                              // 7
    update: Resources.ownsDocument,                                                                                    // 8
    remove: Resources.ownsDocument,                                                                                    // 9
    insert: Meteor.user                                                                                                // 10
});                                                                                                                    // 7
                                                                                                                       //
ResourceFollowers.updateResourceFollowersCount = function (resourceID) {                                               // 13
                                                                                                                       //
    var numFollowers = ResourceFollowers.find({ resourceID: resourceID }).count();                                     // 15
    Resources.updateResourceField(resourceID, 'followerCount', numFollowers);                                          // 16
                                                                                                                       //
    return;                                                                                                            // 18
};                                                                                                                     // 19
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"users.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/buzzy-buzz_resources-core/lib/collections/users.js                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**                                                                                                                    // 1
 * Created by adamginsburg on 27/06/2014.                                                                              //
 */                                                                                                                    //
Users = Meteor.users;                                                                                                  // 4
Users.deny({ update: function () {                                                                                     // 5
        function update() {                                                                                            // 5
            return true;                                                                                               // 5
        }                                                                                                              // 5
                                                                                                                       //
        return update;                                                                                                 // 5
    }() });                                                                                                            // 5
Users.addToHistory = function (resourceID) {                                                                           // 6
    if (Meteor.userId()) {                                                                                             // 7
        var user = Users.findOne({ _id: Meteor.userId() });                                                            // 8
        if (typeof user.profile.buzzHistory !== "undefined") {                                                         // 9
            if (user.profile.buzzHistory.indexOf(resourceID) === -1) {                                                 // 10
                user.profile.buzzHistory.unshift(resourceID);                                                          // 11
                if (user.profile.buzzHistory.length > BuzzyGlobal.gMAX_HISTORY) {                                      // 12
                    user.profile.buzzHistory.splice(user.profile.buzzHistory.length - 1, 1);                           // 13
                }                                                                                                      // 14
                Users.update({ _id: Meteor.userId() }, { $set: { "profile.buzzHistory": user.profile.buzzHistory } });
            } else {                                                                                                   // 16
                user.profile.buzzHistory = _.without(user.profile.buzzHistory, resourceID);                            // 17
                user.profile.buzzHistory.unshift(resourceID);                                                          // 18
                Users.update({ _id: Meteor.userId() }, { $set: { "profile.buzzHistory": user.profile.buzzHistory } });
            }                                                                                                          // 21
        } else {                                                                                                       // 22
            Users.update({ _id: Meteor.userId() }, { $set: { "profile.buzzHistory": [resourceID] } });                 // 23
        }                                                                                                              // 24
    } else {                                                                                                           // 25
        BuzzyGlobal.throwError("User must be logged in to update history.");                                           // 26
    }                                                                                                                  // 27
};                                                                                                                     // 28
                                                                                                                       //
Users.addFavorite = function (resourceID) {                                                                            // 30
    if (Meteor.userId()) {                                                                                             // 31
        var user = Users.findOne({ _id: Meteor.userId() });                                                            // 32
        if (typeof user.profile.favoriteBuzz !== "undefined") {                                                        // 33
            if (user.profile.favoriteBuzz.indexOf(resourceID) === -1) {                                                // 34
                user.profile.favoriteBuzz.unshift(resourceID);                                                         // 35
                Users.update({ _id: Meteor.userId() }, { $set: { "profile.favoriteBuzz": user.profile.favoriteBuzz } });
            }                                                                                                          // 37
        } else {                                                                                                       // 38
            Users.update({ _id: Meteor.userId() }, { $set: { "profile.favoriteBuzz": [resourceID] } });                // 39
        }                                                                                                              // 40
    } else {                                                                                                           // 41
        BuzzyGlobal.throwError("User must be logged in to update history.");                                           // 42
    }                                                                                                                  // 43
};                                                                                                                     // 44
                                                                                                                       //
Users.removeFavorite = function (resourceID) {                                                                         // 46
    if (Meteor.userId()) {                                                                                             // 47
        var user = Users.findOne({ _id: Meteor.userId() });                                                            // 48
        if (typeof user.profile.favoriteBuzz !== "undefined") {                                                        // 49
            if (user.profile.favoriteBuzz.indexOf(resourceID) !== -1) {                                                // 50
                Users.update({ _id: Meteor.userId() }, { $pull: { "profile.favoriteBuzz": resourceID } });             // 51
            }                                                                                                          // 52
        }                                                                                                              // 53
    } else {                                                                                                           // 54
        BuzzyGlobal.throwError("User must be logged in to update favorites.");                                         // 55
    }                                                                                                                  // 56
};                                                                                                                     // 57
                                                                                                                       //
Users.isFavorited = function (resourceID) {                                                                            // 59
    if (Meteor.userId()) {                                                                                             // 60
        var user = Users.findOne({ _id: Meteor.userId() });                                                            // 61
        if (typeof user.profile.favoriteBuzz !== "undefined") {                                                        // 62
            return user.profile.favoriteBuzz.indexOf(resourceID) !== -1;                                               // 63
        } else {                                                                                                       // 64
            return null;                                                                                               // 65
        }                                                                                                              // 66
    }                                                                                                                  // 67
};                                                                                                                     // 68
Users.clearHistory = function () {                                                                                     // 69
    if (Meteor.userId()) {                                                                                             // 70
        Users.update({ _id: Meteor.userId() }, { $set: { "profile.buzzHistory": [] } });                               // 71
    }                                                                                                                  // 72
};                                                                                                                     // 73
                                                                                                                       //
Users.isBot = function (user) {                                                                                        // 75
    console.log("IS BOT", user);                                                                                       // 76
    if (user && user.watsonCreds && user.watsonCreds !== null && user.watsonCreds.length > 0) {                        // 77
        return true;                                                                                                   // 78
    } else {                                                                                                           // 79
        return false;                                                                                                  // 80
    }                                                                                                                  // 81
};                                                                                                                     // 82
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"resources-core.js":["babel-runtime/helpers/typeof",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/buzzy-buzz_resources-core/resources-core.js                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _typeof;module.import("babel-runtime/helpers/typeof",{"default":function(v){_typeof=v}});                          //
// Write your package code here!                                                                                       // 1
                                                                                                                       //
                                                                                                                       //
if (Meteor.isClient) {                                                                                                 // 4
    FollowedResources = new Meteor.Collection('followedResources');                                                    // 5
}                                                                                                                      // 6
                                                                                                                       //
Resources.viewerSuperset = function (resourceID) {                                                                     // 8
    var resource = Resources.findOne(resourceID);                                                                      // 9
    if (resource) {                                                                                                    // 10
        var particpants = resource.readers.concat(resource.editors, resource.owners);                                  // 11
        var followers = ResourceFollowers.find({ resourceID: resource._id }).map(function (rf) {                       // 12
            return rf.userID;                                                                                          // 13
        });                                                                                                            // 14
        return _.union(particpants, followers);                                                                        // 15
    } else {                                                                                                           // 16
        return [];                                                                                                     // 17
    }                                                                                                                  // 18
};                                                                                                                     // 20
                                                                                                                       //
Resources.ownsDocument = function (userID, doc) {                                                                      // 22
    if (doc && (typeof userID === "undefined" ? "undefined" : _typeof(userID)) !== undefined && typeof doc !== "undefined") {
                                                                                                                       //
        return _.indexOf(doc.owners, userID) !== -1;                                                                   // 25
    } else {                                                                                                           // 26
        return false;                                                                                                  // 27
    }                                                                                                                  // 28
};                                                                                                                     // 29
                                                                                                                       //
Resources.ownsNotification = function (userID, doc) {                                                                  // 31
    if (doc && (typeof userID === "undefined" ? "undefined" : _typeof(userID)) !== undefined && typeof doc !== "undefined") {
        return doc && doc.forUserID === userID;                                                                        // 33
    } else {                                                                                                           // 34
        return false;                                                                                                  // 35
    }                                                                                                                  // 36
};                                                                                                                     // 38
                                                                                                                       //
Resources.isAudienceAuthorOwner = function (userID, doc) {                                                             // 40
    if (doc && (typeof userID === "undefined" ? "undefined" : _typeof(userID)) !== undefined && typeof doc !== "undefined") {
        return doc.privacy === BuzzyGlobal.gPRIVACY.PUBLIC && doc.status === BuzzyGlobal.gRESOURCE_STATUS.PUBLISHED || doc.privacy === BuzzyGlobal.gPRIVACY.UNLISTED && doc.status === BuzzyGlobal.gRESOURCE_STATUS.PUBLISHED || _.indexOf(doc.readers, userID) != "-1" && doc.status === BuzzyGlobal.gRESOURCE_STATUS.PUBLISHED || _.indexOf(doc.editors, userID) != "-1" || _.indexOf(doc.owners, userID) != "-1";
    } else {                                                                                                           // 47
        return false;                                                                                                  // 48
    }                                                                                                                  // 49
};                                                                                                                     // 51
                                                                                                                       //
Resources.isAuthorOwner = function (userID, doc) {                                                                     // 53
                                                                                                                       //
    if (doc && (typeof userID === "undefined" ? "undefined" : _typeof(userID)) !== undefined && typeof doc !== "undefined") {
        return typeof doc.editors !== "undefined" && _.indexOf(doc.editors, userID) !== -1 || typeof doc.editors !== "undefined" && _.indexOf(doc.owners, userID) !== -1;
    } else {                                                                                                           // 57
        return false;                                                                                                  // 58
    }                                                                                                                  // 59
};                                                                                                                     // 61
                                                                                                                       //
Resources.canView = function (userID, doc) {                                                                           // 63
    if (Meteor.settings["public"].BUZZY_DEBUG_CLIENT) {                                                                // 64
        var perfStartTime = new Date().getTime();                                                                      // 65
        console.log("PERF Resources.canView START", perfStartTime);                                                    // 66
    }                                                                                                                  // 67
                                                                                                                       //
    if (doc && (typeof userID === "undefined" ? "undefined" : _typeof(userID)) === undefined && typeof doc !== "undefined") {
        var result1 = doc.privacy === BuzzyGlobal.gPRIVACY.PUBLIC && doc.status === BuzzyGlobal.gRESOURCE_STATUS.PUBLISHED || doc.privacy === BuzzyGlobal.gPRIVACY.UNLISTED && doc.status === BuzzyGlobal.gRESOURCE_STATUS.PUBLISHED;
        if (Meteor.settings["public"].BUZZY_DEBUG_CLIENT) {                                                            // 72
            var perfEndTime = new Date().getTime();                                                                    // 73
            console.log("PERF resultCanView after result2  DUR", perfEndTime - perfStartTime);                         // 74
        }                                                                                                              // 75
                                                                                                                       //
        return result1;                                                                                                // 77
    } else if (doc && (typeof userID === "undefined" ? "undefined" : _typeof(userID)) !== undefined && typeof doc !== "undefined") {
                                                                                                                       //
        var result2 = doc.privacy === BuzzyGlobal.gPRIVACY.PUBLIC && doc.status === BuzzyGlobal.gRESOURCE_STATUS.PUBLISHED || doc.privacy === BuzzyGlobal.gPRIVACY.UNLISTED && doc.status === BuzzyGlobal.gRESOURCE_STATUS.PUBLISHED || _.indexOf(doc.readers, userID) != "-1" && doc.status === BuzzyGlobal.gRESOURCE_STATUS.PUBLISHED || _.indexOf(doc.editors, userID) != "-1" || _.indexOf(doc.owners, userID) != "-1";
        if (Meteor.settings["public"].BUZZY_DEBUG_CLIENT) {                                                            // 82
            var perfEndTime = new Date().getTime();                                                                    // 83
            console.log("PERF resultCanView after result2 DUR", perfEndTime - perfStartTime);                          // 84
        }                                                                                                              // 85
        return result2;                                                                                                // 86
    } else {                                                                                                           // 87
        return false;                                                                                                  // 88
    }                                                                                                                  // 89
};                                                                                                                     // 91
                                                                                                                       //
Resources.canEdit = function (userID, doc) {                                                                           // 93
    if (doc && (typeof userID === "undefined" ? "undefined" : _typeof(userID)) !== undefined && typeof doc !== "undefined") {
        return typeof doc.editors !== "undefined" && _.indexOf(doc.editors, userID) !== -1 || typeof doc.editors !== "undefined" && _.indexOf(doc.owners, userID) !== -1;
    } else {                                                                                                           // 96
        return false;                                                                                                  // 97
    }                                                                                                                  // 98
};                                                                                                                     // 100
                                                                                                                       //
Resources.canAddRow = function (doc) {                                                                                 // 102
                                                                                                                       //
    if (Meteor.userId()) {                                                                                             // 104
        if (doc.content.whoCanAdd === BuzzyGlobal.gAPPFIELD_INTERACT.OWNERS_AND_AUTHORS && Resources.isAuthorOwner(Meteor.userId(), doc)) {
            return true;                                                                                               // 106
        } else if (doc.content.whoCanAdd === BuzzyGlobal.gAPPFIELD_INTERACT.AUDIENCE_OWNERS_AND_AUTHORS && Resources.isAudienceAuthorOwner(Meteor.userId(), doc)) {
            return true;                                                                                               // 108
        } else {                                                                                                       // 109
            return false;                                                                                              // 110
        }                                                                                                              // 111
    } else {                                                                                                           // 112
        return false;                                                                                                  // 113
    }                                                                                                                  // 114
};                                                                                                                     // 116
                                                                                                                       //
Resources.canEditMicroAppField = function (userID, doc, whoCanEdit, whoCanView, rowCreator) {                          // 118
    if (userID && doc) {                                                                                               // 119
                                                                                                                       //
        if (Resources.isAuthorOwner(userID, doc)) {                                                                    // 121
                                                                                                                       //
            return true; // deal with legacy content where items are nulluntil data is cleaned up                      // 123
        } else if (doc.content.whoCanView === BuzzyGlobal.gMICROAPP_PERMISSION_WHOCANVIEW.OWNER_AUTHOR_CREATOR) {      // 124
            if (whoCanEdit === BuzzyGlobal.gAPPFIELD_INTERACT.ANYONE || userID === rowCreator && whoCanEdit === BuzzyGlobal.gAPPFIELD_INTERACT.AUDIENCE_OWNERS_AND_AUTHORS && Resources.isAudienceAuthorOwner(userID, doc) || Resources.isAuthorOwner(userID, doc) || whoCanEdit === BuzzyGlobal.gAPPFIELD_INTERACT.OWNERSAUTHOR_AND_CREATORS && userID === rowCreator) {
                                                                                                                       //
                return true;                                                                                           // 131
            } else {                                                                                                   // 132
                                                                                                                       //
                return false;                                                                                          // 134
            }                                                                                                          // 135
        } else {                                                                                                       // 137
            if (whoCanEdit === BuzzyGlobal.gAPPFIELD_INTERACT.ANYONE) {                                                // 138
                                                                                                                       //
                return true;                                                                                           // 140
            } else if (whoCanEdit === BuzzyGlobal.gAPPFIELD_INTERACT.AUDIENCE_OWNERS_AND_AUTHORS && Resources.isAudienceAuthorOwner(userID, doc)) {
                                                                                                                       //
                return true;                                                                                           // 143
            } else if (whoCanEdit === BuzzyGlobal.gAPPFIELD_INTERACT.OWNERSAUTHOR_AND_CREATORS && userID === rowCreator && Resources.isAudienceAuthorOwner(userID, doc)) {
                                                                                                                       //
                return true;                                                                                           // 146
            } else if (whoCanEdit === BuzzyGlobal.gAPPFIELD_INTERACT.OWNERS_AND_AUTHORS && Resources.isAuthorOwner(userID, doc)) {
                                                                                                                       //
                return true;                                                                                           // 149
            } else {                                                                                                   // 150
                return false;                                                                                          // 151
            }                                                                                                          // 152
        }                                                                                                              // 153
    } else {                                                                                                           // 155
        return false;                                                                                                  // 156
    }                                                                                                                  // 157
};                                                                                                                     // 159
                                                                                                                       //
Resources.canChangeAudienceAndAuthors = function (userID, doc) {                                                       // 161
    if ((typeof userID === "undefined" ? "undefined" : _typeof(userID)) !== undefined && typeof doc !== "undefined") {
        return _.indexOf(doc.editors, userID) !== -1 || _.indexOf(doc.owners, userID) !== -1;                          // 163
    } else {                                                                                                           // 164
        return false;                                                                                                  // 165
    }                                                                                                                  // 166
};                                                                                                                     // 169
                                                                                                                       //
Resources.canChangeOwners = function (userID, doc) {                                                                   // 171
    if ((typeof userID === "undefined" ? "undefined" : _typeof(userID)) !== undefined && typeof doc !== "undefined") {
        return _.indexOf(doc.owners, userID) !== -1;                                                                   // 173
    } else {                                                                                                           // 174
        return false;                                                                                                  // 175
    }                                                                                                                  // 176
};                                                                                                                     // 177
                                                                                                                       //
Resources.canViewFile = function (userID, doc) {                                                                       // 180
    return true; // dilemma - required for email (non auth access) until work out how to generate token????            // 181
    /*console.log("Resources.canView:" + userID + " parent:" +  doc.parentResourceID);                                 // 182
     var parentResource = Resources.findOne({_id: doc.parentResourceID});                                              //
     if (parentResource){                                                                                              //
      return (parentResource && parentResource.userID === userID) || (parentResource.privacy === BuzzyGlobal.gPRIVACY.PUBLIC) || (parentResource.privacy === BuzzyGlobal.gPRIVACY.PUBLIC)|| (_.indexOf( parentResource.editors, userID ) != "-1") || (_.indexOf( parentResource.owners, userID ) != "-1")|| (_.indexOf( parentResource.readers, userID ) != "-1");
      } else {                                                                                                         //
     return false;                                                                                                     //
     }*/                                                                                                               //
};                                                                                                                     // 192
                                                                                                                       //
Resources.updateResourceField = function (currentResourceID, fieldName, fieldValue) {                                  // 194
    var obj = {};                                                                                                      // 195
    obj[fieldName] = fieldValue;                                                                                       // 196
    obj['updated'] = new Date().getTime();                                                                             // 197
                                                                                                                       //
    var updatedResourceID = Resources.update({ _id: currentResourceID }, { $set: obj }, function (error) {             // 199
        if (error) {                                                                                                   // 200
            // display the error to the user - Need to come back to fix 422 (not sure what # it should be???) as the error number
            throw new Meteor.Error(422, error.reason);                                                                 // 202
        } else {                                                                                                       // 203
                                                                                                                       //
            return updatedResourceID;                                                                                  // 205
            //Router.go('resourceList');                                                                               // 206
        }                                                                                                              // 207
    });                                                                                                                // 208
};                                                                                                                     // 210
                                                                                                                       //
Resources.resourceIsFollowed = function (userID, resourceID) {                                                         // 212
    return ResourceFollowers.find({ $and: [{ resourceID: resourceID }, { userID: userID }] }).count();                 // 213
};                                                                                                                     // 214
                                                                                                                       //
Resources.gNewPath = function (currPath, resourceID) {                                                                 // 216
    if (currPath === null) {                                                                                           // 217
        return "," + resourceID + ",";                                                                                 // 218
    } else {                                                                                                           // 220
        return currPath + resourceID + ",";                                                                            // 221
    }                                                                                                                  // 222
};                                                                                                                     // 223
                                                                                                                       //
Resources.gGetParentFromPath = function (path) {                                                                       // 225
    if (path) {                                                                                                        // 226
        //must be a better way to do with regex, anyway...                                                             // 227
        path = path.substring(0, path.length - 1); //chop last comma                                                   // 228
        var pathArray = path.split(',');                                                                               // 229
        return pathArray[pathArray.length - 1];                                                                        // 230
    } else {                                                                                                           // 233
        BuzzyGlobal.throwError("Invalid Path");                                                                        // 234
    }                                                                                                                  // 235
};                                                                                                                     // 236
                                                                                                                       //
Resources.gGetTopParentFromPath = function (path) {                                                                    // 238
    if (path) {                                                                                                        // 239
        //must be a better way to do with regex, anyway...                                                             // 240
        path = path.substring(0, path.length - 1); //chop last comma                                                   // 241
        var pathArray = path.split(',');                                                                               // 242
        return pathArray[1];                                                                                           // 243
    } else {                                                                                                           // 246
        BuzzyGlobal.throwError("Invalid Path");                                                                        // 247
    }                                                                                                                  // 248
};                                                                                                                     // 249
                                                                                                                       //
Resources.createDirectChildrenServer = function (srcResourceID, readers, editors, owners, targetPath, rank, parentStatus, optResource, callback) {
    Meteor.call("createDirectChildrenServerMethod", srcResourceID, readers, editors, owners, targetPath, rank, parentStatus, optResource, function (err, id) {
        if (err) {                                                                                                     // 253
            BuzzyGlobal.throwError(err);                                                                               // 254
        } else {                                                                                                       // 255
            callback(id);                                                                                              // 256
        }                                                                                                              // 257
    });                                                                                                                // 258
};                                                                                                                     // 259
                                                                                                                       //
Resources.createDirectChildren = function (srcResourceID, readers, editors, owners, targetPath, rank, parentStatus, optResource, optUserToken, callback) {
    var user = BuzzyGlobal.getCurrentUser(optUserToken);                                                               // 262
    if (!user) {                                                                                                       // 263
        BuzzyGlobal.throwError("Invalid User Credentials");                                                            // 264
    }                                                                                                                  // 265
    // TBD need to check if path is set that user Can Edit:   if (!Resources.canEdit(user._id,))                       // 266
    optResource = typeof optResource === "undefined" ? false : optResource;                                            // 267
    var srcResource = Resources.findOne(srcResourceID);                                                                // 268
    if (srcResource) {                                                                                                 // 269
        var tempTitle = srcResource.title;                                                                             // 270
        if (srcResource.type === BuzzyGlobal.gBASICTYPES.BUZZ) {                                                       // 271
            tempTitle = "";                                                                                            // 272
        }                                                                                                              // 273
        ; //Make title blank                                                                                           // 274
                                                                                                                       //
        if (optResource) {                                                                                             // 276
            newResource = optResource;                                                                                 // 277
                                                                                                                       //
            //console.log("about to create opt: ", newResource._id, " path:", newResource.path, " owners: ", owners );
                                                                                                                       //
            Meteor.call('createWithID', newResource, optUserToken, function (error, id) {                              // 281
                if (error) {                                                                                           // 282
                    // display the error to the user                                                                   // 283
                    BuzzyGlobal.throwError(error.reason);                                                              // 284
                } else {                                                                                               // 285
                                                                                                                       //
                    if (typeof callback !== "undefined") {                                                             // 287
                        return callback(false);                                                                        // 288
                    }                                                                                                  // 289
                }                                                                                                      // 290
            });                                                                                                        // 291
                                                                                                                       //
            // now look for children                                                                                   // 293
            //console.log("ABOUT TO LOOK FOR CHILDRED for " + srcResourceID);                                          // 294
            var searchExpression = new RegExp(',' + srcResourceID + ',$');                                             // 295
            //       console.log('search string:' + searchExpression);                                                 // 296
            //       console.log('target path:' + targetPath);                                                         // 297
            directChildrenCursor = Resources.find({                                                                    // 298
                $and: [{ path: { $regex: searchExpression } }, {                                                       // 300
                    $or: [{ status: BuzzyGlobal.gRESOURCE_STATUS.DRAFT }, { status: BuzzyGlobal.gRESOURCE_STATUS.PUBLISHED }]
                }]                                                                                                     // 302
            });                                                                                                        // 299
            //console.log('direct children:' + directChildrenCursor.count());                                          // 310
            if (directChildrenCursor) {                                                                                // 311
                                                                                                                       //
                directChildrenCursor.forEach(function (childResource) {                                                // 313
                                                                                                                       //
                    var path;                                                                                          // 315
                    if (targetPath === null) {                                                                         // 316
                        path = "," + newResource._id + ",";                                                            // 317
                    } else {                                                                                           // 318
                        path = targetPath + newResource._id + ",";                                                     // 319
                    }                                                                                                  // 320
                                                                                                                       //
                    Resources.createDirectChildren(childResource._id, readers, editors, owners, path, childResource.rank, parentStatus, null, optUserToken);
                });                                                                                                    // 324
            } else {                                                                                                   // 326
                                                                                                                       //
                return 0;                                                                                              // 328
            }                                                                                                          // 329
        } else {                                                                                                       // 331
                                                                                                                       //
            var newFileResourceID = new Meteor.Collection.ObjectID()._str;                                             // 334
            var newResource = _.extend(_.pick(srcResource, 'description', 'content', 'coverImage', 'CSSclass', 'resourceURI', 'orginalResourceID', 'type', 'showComments', 'tourStepID', 'tourCode', 'hasTour'), {
                title: tempTitle,                                                                                      // 336
                readers: readers,                                                                                      // 337
                editors: editors,                                                                                      // 338
                owners: owners,                                                                                        // 339
                mediaFile: {},                                                                                         // 340
                reusable: "no",                                                                                        // 341
                privacy: "private",                                                                                    // 342
                status: parentStatus,                                                                                  // 343
                isStarterTemplate: false,                                                                              // 344
                userID: user._id,                                                                                      // 345
                author: user.username,                                                                                 // 346
                submitted: new Date().getTime(),                                                                       // 347
                updated: new Date().getTime(),                                                                         // 348
                path: targetPath,                                                                                      // 349
                _id: newFileResourceID,                                                                                // 350
                rank: rank                                                                                             // 351
            });                                                                                                        // 335
                                                                                                                       //
            if (srcResource.type === BuzzyGlobal.gBASICTYPES.IMAGE) {                                                  // 355
                if (targetPath !== null) {                                                                             // 356
                    var pathArray = targetPath.split(",", 2);                                                          // 357
                    if (pathArray.length > 1) {                                                                        // 358
                        var topParentID = pathArray[1];                                                                // 359
                    }                                                                                                  // 360
                }                                                                                                      // 361
                Meteor.call('createWithID', newResource, optUserToken, function (error, id) {                          // 362
                    if (error) {                                                                                       // 363
                        // display the error to the user                                                               // 364
                        BuzzyGlobal.throwError(error.reason);                                                          // 365
                    } else {                                                                                           // 366
                        if (typeof callback !== "undefined") {                                                         // 367
                            return callback(false);                                                                    // 368
                        }                                                                                              // 369
                    }                                                                                                  // 370
                });                                                                                                    // 371
                                                                                                                       //
                //this did have the above in the callback below - taken out to try and get to happen in parallel       // 373
                /*                                                                                                     // 374
                 Meteor.call("collectionFSImageCopy", srcResource.content.imageID, topParentID, function(error, fileID){
                 if (!error){                                                                                          //
                  Resources.updateResourceField(newResource._id,"content.imageID",fileID);                             //
                    }                                                                                                  //
                  });*/                                                                                                //
            } else if (srcResource.type === BuzzyGlobal.gBASICTYPES.ATTACHMENT) {                                      // 385
                                                                                                                       //
                if (targetPath !== null) {                                                                             // 388
                    var pathArray = targetPath.split(",", 2);                                                          // 389
                    if (pathArray.length > 1) {                                                                        // 390
                        var topParentID = pathArray[1];                                                                // 391
                    }                                                                                                  // 392
                }                                                                                                      // 393
            } else if (srcResource.type === BuzzyGlobal.gBASICTYPES.APPLICATION) {                                     // 395
                                                                                                                       //
                if (targetPath !== null) {                                                                             // 398
                    var pathArray = targetPath.split(",", 2);                                                          // 399
                    if (pathArray.length > 1) {                                                                        // 400
                        var topParentID = pathArray[1];                                                                // 401
                    }                                                                                                  // 402
                }                                                                                                      // 403
                                                                                                                       //
                Meteor.call("duplicateMicroAppFields", srcResource._id, newResource._id, optUserToken, function (err, oldAndNewFieldIDArray) {
                    if (err) {                                                                                         // 407
                        BuzzyGlobal.throwError(err);                                                                   // 408
                    } else {                                                                                           // 409
                        Meteor.call("resourceCopyMicroApp", srcResource._id, newResource._id, topParentID, oldAndNewFieldIDArray, optUserToken, function (error) {
                            if (!error) {                                                                              // 411
                                Meteor.call('createWithID', newResource, optUserToken, function (error, id) {          // 412
                                    if (error) {                                                                       // 413
                                        // display the error to the user                                               // 414
                                        BuzzyGlobal.throwError(error.reason);                                          // 415
                                    } else {                                                                           // 416
                                        if (oldAndNewFieldIDArray) {                                                   // 417
                                                                                                                       //
                                            if (srcResource.content && srcResource.content.sortField) {                // 420
                                                                                                                       //
                                                var newSortField = oldAndNewFieldIDArray.find(function (item) {        // 422
                                                    return item.oldFieldID === srcResource.content.sortField;          // 423
                                                });                                                                    // 424
                                                                                                                       //
                                                if (newSortField && typeof newSortField.newFieldID !== "undefined") {  // 426
                                                    Meteor.call("updateResourceSortField", newResource._id, 1, newSortField.newFieldID, optUserToken);
                                                }                                                                      // 429
                                            }                                                                          // 432
                                            if (srcResource.content && srcResource.content.sortField2) {               // 433
                                                                                                                       //
                                                var newSortField2 = oldAndNewFieldIDArray.find(function (item) {       // 435
                                                    return item.oldFieldID === srcResource.content.sortField2;         // 436
                                                });                                                                    // 437
                                                                                                                       //
                                                if (newSortField2 && typeof newSortField2.newFieldID !== "undefined") {
                                                    Meteor.call("updateResourceSortField", newResource._id, 2, newSortField2.newFieldID, optUserToken);
                                                }                                                                      // 441
                                            }                                                                          // 443
                                            if (srcResource.content && srcResource.content.sortField3) {               // 444
                                                                                                                       //
                                                var newSortField3 = oldAndNewFieldIDArray.find(function (item) {       // 446
                                                    return item.oldFieldID === srcResource.content.sortField3;         // 447
                                                });                                                                    // 448
                                                                                                                       //
                                                if (newSortField3 && typeof newSortField3.newFieldID !== "undefined") {
                                                    Meteor.call("updateResourceSortField", newResource._id, 3, newSortField3.newFieldID, optUserToken);
                                                }                                                                      // 452
                                            }                                                                          // 454
                                        }                                                                              // 455
                                        if (typeof callback !== "undefined") {                                         // 456
                                            return callback(false);                                                    // 457
                                        }                                                                              // 458
                                    }                                                                                  // 459
                                });                                                                                    // 460
                            }                                                                                          // 463
                        });                                                                                            // 465
                    }                                                                                                  // 466
                });                                                                                                    // 468
            } else {                                                                                                   // 471
                Meteor.call('createWithID', newResource, optUserToken, function (error, id) {                          // 472
                    if (error) {                                                                                       // 473
                        // display the error to the user                                                               // 474
                        BuzzyGlobal.throwError(error.reason);                                                          // 475
                    } else {                                                                                           // 476
                        if (typeof callback !== "undefined") {                                                         // 477
                            return callback(false);                                                                    // 478
                        }                                                                                              // 479
                    }                                                                                                  // 480
                });                                                                                                    // 481
            }                                                                                                          // 484
                                                                                                                       //
            // now look for children                                                                                   // 486
            var searchExpression = new RegExp(',' + srcResourceID + ',$');                                             // 487
            //       console.log('search string:' + searchExpression);                                                 // 488
            //       console.log('target path:' + targetPath);                                                         // 489
            directChildrenCursor = Resources.find({                                                                    // 490
                $and: [{ path: { $regex: searchExpression } }, {                                                       // 492
                    $or: [{ status: BuzzyGlobal.gRESOURCE_STATUS.DRAFT }, { status: BuzzyGlobal.gRESOURCE_STATUS.PUBLISHED }]
                }]                                                                                                     // 494
            });                                                                                                        // 491
            //console.log('direct children:' + directChildrenCursor.count());                                          // 502
            if (directChildrenCursor) {                                                                                // 503
                directChildrenCursor.forEach(function (childResource) {                                                // 504
                                                                                                                       //
                    var path;                                                                                          // 506
                    if (targetPath === null) {                                                                         // 507
                        path = "," + newResource._id + ",";                                                            // 508
                    } else {                                                                                           // 509
                        path = targetPath + newResource._id + ",";                                                     // 510
                    }                                                                                                  // 511
                    Resources.createDirectChildren(childResource._id, readers, editors, owners, path, childResource.rank, parentStatus, null, optUserToken);
                });                                                                                                    // 514
            } else {                                                                                                   // 516
                return 0;                                                                                              // 517
            }                                                                                                          // 518
        }                                                                                                              // 521
    }                                                                                                                  // 524
};                                                                                                                     // 527
                                                                                                                       //
Resources.allow({                                                                                                      // 530
    update: Resources.canEdit,                                                                                         // 531
    remove: Resources.ownsDocument,                                                                                    // 532
    insert: BuzzyGlobal.isLoggedIn                                                                                     // 533
});                                                                                                                    // 530
Resources.deny({                                                                                                       // 535
    update: function () {                                                                                              // 536
        function update(userId, resource, fieldNames) {                                                                // 536
            // may only edit the following  fields:                                                                    // 537
            return _.without(fieldNames, 'avatar', 'description', 'title', 'content', 'CSSclass', 'resourceURI', 'reusable', 'privacy', 'readers', 'editors', 'mediaFile', 'mimeType', 'queryTags', 'rank', 'path', 'updated', 'isStarterTemplate', 'hasTour', 'tourCode', 'tourStepID', 'bHideTitle', 'bHideDescription', 'bHaveChildren', 'bHideAuthors', 'bHideAudience', 'displayField', 'showComments', 'status', 'commentsApprovalRequired', 'coverImage', 'content.galleryURL').length > 0;
        }                                                                                                              // 544
                                                                                                                       //
        return update;                                                                                                 // 536
    }()                                                                                                                // 536
});                                                                                                                    // 535
                                                                                                                       //
Meteor.methods({                                                                                                       // 548
                                                                                                                       //
    updateResourceWhoCanAdd: function () {                                                                             // 550
        function updateResourceWhoCanAdd(resourceID, fieldID, fieldVal) {                                              // 550
            if (Meteor.userId() && resourceID) {                                                                       // 551
                var resource = Resources.findOne({ _id: resourceID });                                                 // 552
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 553
                                                                                                                       //
                    Resources.update({ _id: resourceID }, { $set: { "content.whoCanAdd": fieldVal } }, function (error) {
                        if (error) {                                                                                   // 556
                            BuzzyGlobal.throwError(error);                                                             // 557
                        }                                                                                              // 558
                    });                                                                                                // 559
                }                                                                                                      // 561
            }                                                                                                          // 562
        }                                                                                                              // 563
                                                                                                                       //
        return updateResourceWhoCanAdd;                                                                                // 550
    }(),                                                                                                               // 550
    updateResourceDefaultTimezone: function () {                                                                       // 564
        function updateResourceDefaultTimezone(resourceID, fieldID, fieldVal) {                                        // 564
            if (Meteor.userId() && resourceID) {                                                                       // 565
                var resource = Resources.findOne({ _id: resourceID });                                                 // 566
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 567
                                                                                                                       //
                    Resources.update({ _id: resourceID }, { $set: { "content.timezone": fieldVal } }, function (error) {
                        if (error) {                                                                                   // 570
                            BuzzyGlobal.throwError(error);                                                             // 571
                        }                                                                                              // 572
                    });                                                                                                // 573
                }                                                                                                      // 575
            }                                                                                                          // 576
        }                                                                                                              // 577
                                                                                                                       //
        return updateResourceDefaultTimezone;                                                                          // 564
    }(),                                                                                                               // 564
    updateResourceNumberOfItems: function () {                                                                         // 578
        function updateResourceNumberOfItems(resourceID, fieldID, fieldVal) {                                          // 578
                                                                                                                       //
            if (Meteor.userId() && resourceID) {                                                                       // 580
                var resource = Resources.findOne({ _id: resourceID });                                                 // 581
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 582
                                                                                                                       //
                    Resources.update({ _id: resourceID }, { $set: { "content.numberOfItems": Number(fieldVal) } }, function (error) {
                        if (error) {                                                                                   // 585
                            BuzzyGlobal.throwError(error);                                                             // 586
                        }                                                                                              // 587
                    });                                                                                                // 588
                }                                                                                                      // 590
            }                                                                                                          // 591
        }                                                                                                              // 592
                                                                                                                       //
        return updateResourceNumberOfItems;                                                                            // 578
    }(),                                                                                                               // 578
                                                                                                                       //
    /*updateResourceSortField: function (resourceID,fieldID, fieldVal, fieldNumber) {                                  // 594
     if (Meteor.userId() && resourceID) {                                                                              //
     var resource = Resources.findOne({_id: resourceID});                                                              //
     if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                                   //
     var sortField = "content.sortField" + fieldNumber;                                                                //
     var sortObject = {$set:{"content.sortField":fieldVal}};                                                           //
     switch (fieldNumber){                                                                                             //
     case "2" :                                                                                                        //
     sortObject = {$set:{"content.sortField2":fieldVal}};                                                              //
     break;                                                                                                            //
     case "3" :                                                                                                        //
     sortObject = {$set:{"content.sortField3":fieldVal}};                                                              //
     break;                                                                                                            //
     }                                                                                                                 //
     Resources.update({_id:resourceID},sortObject, function(error){                                                    //
     if (error){                                                                                                       //
     BuzzyGlobal.throwError(error);                                                                                    //
     } else {                                                                                                          //
     Meteor.call("updateAllFieldsMicroAppDataSortVal", resourceID,fieldVal,fieldNumber);                               //
     }                                                                                                                 //
     });                                                                                                               //
      }                                                                                                                //
     }                                                                                                                 //
     },*/                                                                                                              //
                                                                                                                       //
    updateResourceGroupField: function () {                                                                            // 620
        function updateResourceGroupField(resourceID, fieldID, fieldVal) {                                             // 620
            if (Meteor.userId() && resourceID) {                                                                       // 621
                var resource = Resources.findOne({ _id: resourceID });                                                 // 622
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 623
                                                                                                                       //
                    Resources.update({ _id: resourceID }, { $set: { "content.groupField": fieldVal } }, function (error) {
                        if (error) {                                                                                   // 626
                            BuzzyGlobal.throwError(error);                                                             // 627
                        } else {                                                                                       // 628
                            //Meteor.call("updateAllFieldsMicroAppDataSortVal", resourceID,fieldVal);                  // 629
                        }                                                                                              // 630
                    });                                                                                                // 631
                }                                                                                                      // 633
            }                                                                                                          // 634
        }                                                                                                              // 635
                                                                                                                       //
        return updateResourceGroupField;                                                                               // 620
    }(),                                                                                                               // 620
    updateMicroAppType: function () {                                                                                  // 636
        function updateMicroAppType(resourceID, fieldID, fieldVal) {                                                   // 636
            if (Meteor.userId() && resourceID) {                                                                       // 637
                var resource = Resources.findOne({ _id: resourceID });                                                 // 638
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 639
                                                                                                                       //
                    Resources.update({ _id: resourceID }, { $set: { "content.microAppType": fieldVal } }, function (error) {
                        if (error) {                                                                                   // 642
                            BuzzyGlobal.throwError(error);                                                             // 643
                        } else {                                                                                       // 644
                            Meteor.call("updateAllFieldsMicroAppDataSortVal", resourceID, fieldVal, "1");              // 645
                        }                                                                                              // 646
                    });                                                                                                // 647
                }                                                                                                      // 649
            }                                                                                                          // 650
        }                                                                                                              // 651
                                                                                                                       //
        return updateMicroAppType;                                                                                     // 636
    }(),                                                                                                               // 636
    updateMicroAppSubmitType: function () {                                                                            // 652
        function updateMicroAppSubmitType(resourceID, fieldID, fieldVal) {                                             // 652
            if (Meteor.userId() && resourceID) {                                                                       // 653
                var resource = Resources.findOne({ _id: resourceID });                                                 // 654
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 655
                                                                                                                       //
                    Resources.update({ _id: resourceID }, { $set: { "content.microAppSubmitType": fieldVal } }, function (error) {
                        if (error) {                                                                                   // 658
                            BuzzyGlobal.throwError(error);                                                             // 659
                        }                                                                                              // 660
                    });                                                                                                // 661
                }                                                                                                      // 663
            }                                                                                                          // 664
        }                                                                                                              // 665
                                                                                                                       //
        return updateMicroAppSubmitType;                                                                               // 652
    }(),                                                                                                               // 652
    updateMicroAppResultsLocation: function () {                                                                       // 666
        function updateMicroAppResultsLocation(resourceID, fieldID, fieldVal) {                                        // 666
            if (Meteor.userId() && resourceID) {                                                                       // 667
                var resource = Resources.findOne({ _id: resourceID });                                                 // 668
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 669
                                                                                                                       //
                    Resources.update({ _id: resourceID }, { $set: { "content.resultsLocation": fieldVal } }, function (error) {
                        if (error) {                                                                                   // 672
                            BuzzyGlobal.throwError(error);                                                             // 673
                        }                                                                                              // 674
                    });                                                                                                // 675
                }                                                                                                      // 677
            }                                                                                                          // 678
        }                                                                                                              // 679
                                                                                                                       //
        return updateMicroAppResultsLocation;                                                                          // 666
    }(),                                                                                                               // 666
    updateMicroAppResultsDisplayStyle: function () {                                                                   // 680
        function updateMicroAppResultsDisplayStyle(resourceID, fieldID, fieldVal) {                                    // 680
            if (Meteor.userId() && resourceID) {                                                                       // 681
                var resource = Resources.findOne({ _id: resourceID });                                                 // 682
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 683
                                                                                                                       //
                    Resources.update({ _id: resourceID }, { $set: { "content.resultsDisplayStyle": fieldVal } }, function (error) {
                        if (error) {                                                                                   // 686
                            BuzzyGlobal.throwError(error);                                                             // 687
                        }                                                                                              // 688
                    });                                                                                                // 689
                }                                                                                                      // 691
            }                                                                                                          // 692
        }                                                                                                              // 693
                                                                                                                       //
        return updateMicroAppResultsDisplayStyle;                                                                      // 680
    }(),                                                                                                               // 680
    updateMicroAppResultsDisplayGantt: function () {                                                                   // 694
        function updateMicroAppResultsDisplayGantt(resourceID, fieldID, fieldVal) {                                    // 694
            if (Meteor.userId() && resourceID) {                                                                       // 695
                var resource = Resources.findOne({ _id: resourceID });                                                 // 696
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 697
                                                                                                                       //
                    Resources.update({ _id: resourceID }, { $set: { "content.resultsDisplayStyle": fieldVal } }, function (error) {
                        if (error) {                                                                                   // 700
                            BuzzyGlobal.throwError(error);                                                             // 701
                        }                                                                                              // 702
                    });                                                                                                // 703
                }                                                                                                      // 705
            }                                                                                                          // 706
        }                                                                                                              // 707
                                                                                                                       //
        return updateMicroAppResultsDisplayGantt;                                                                      // 694
    }(),                                                                                                               // 694
    updateMicroAppResultsDisplayMap: function () {                                                                     // 708
        function updateMicroAppResultsDisplayMap(resourceID, fieldID, fieldVal) {                                      // 708
            if (Meteor.userId() && resourceID) {                                                                       // 709
                var resource = Resources.findOne({ _id: resourceID });                                                 // 710
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 711
                                                                                                                       //
                    Resources.update({ _id: resourceID }, { $set: { "content.resultsDisplayMap": fieldVal } }, function (error) {
                        if (error) {                                                                                   // 714
                            BuzzyGlobal.throwError(error);                                                             // 715
                        }                                                                                              // 716
                    });                                                                                                // 717
                }                                                                                                      // 719
            }                                                                                                          // 720
        }                                                                                                              // 721
                                                                                                                       //
        return updateMicroAppResultsDisplayMap;                                                                        // 708
    }(),                                                                                                               // 708
    updateMicroAppResultsDisplayGantt: function () {                                                                   // 722
        function updateMicroAppResultsDisplayGantt(resourceID, fieldID, fieldVal) {                                    // 722
            if (Meteor.userId() && resourceID) {                                                                       // 723
                var resource = Resources.findOne({ _id: resourceID });                                                 // 724
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 725
                                                                                                                       //
                    Resources.update({ _id: resourceID }, { $set: { "content.resultsDisplayGantt": fieldVal } }, function (error) {
                        if (error) {                                                                                   // 728
                            BuzzyGlobal.throwError(error);                                                             // 729
                        }                                                                                              // 730
                    });                                                                                                // 731
                }                                                                                                      // 733
            }                                                                                                          // 734
        }                                                                                                              // 735
                                                                                                                       //
        return updateMicroAppResultsDisplayGantt;                                                                      // 722
    }(),                                                                                                               // 722
    updateMicroAppResultsDisplayModal: function () {                                                                   // 736
        function updateMicroAppResultsDisplayModal(resourceID, fieldID, fieldVal) {                                    // 736
            if (Meteor.userId() && resourceID) {                                                                       // 737
                var resource = Resources.findOne({ _id: resourceID });                                                 // 738
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 739
                                                                                                                       //
                    Resources.update({ _id: resourceID }, { $set: { "content.resultsDisplayModal": fieldVal } }, function (error) {
                        if (error) {                                                                                   // 742
                            BuzzyGlobal.throwError(error);                                                             // 743
                        }                                                                                              // 744
                    });                                                                                                // 745
                }                                                                                                      // 747
            }                                                                                                          // 748
        }                                                                                                              // 749
                                                                                                                       //
        return updateMicroAppResultsDisplayModal;                                                                      // 736
    }(),                                                                                                               // 736
    updateMicroAppResultsShowColumnHeader: function () {                                                               // 750
        function updateMicroAppResultsShowColumnHeader(resourceID, fieldID, fieldVal) {                                // 750
            if (Meteor.userId() && resourceID) {                                                                       // 751
                var resource = Resources.findOne({ _id: resourceID });                                                 // 752
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 753
                                                                                                                       //
                    Resources.update({ _id: resourceID }, { $set: { "content.resultsShowColumnHeader": fieldVal } }, function (error) {
                        if (error) {                                                                                   // 756
                            BuzzyGlobal.throwError(error);                                                             // 757
                        }                                                                                              // 758
                    });                                                                                                // 759
                }                                                                                                      // 761
            }                                                                                                          // 762
        }                                                                                                              // 763
                                                                                                                       //
        return updateMicroAppResultsShowColumnHeader;                                                                  // 750
    }(),                                                                                                               // 750
    updateResourceSortOrder: function () {                                                                             // 764
        function updateResourceSortOrder(resourceID, fieldID, fieldVal) {                                              // 764
            if (Meteor.userId() && resourceID) {                                                                       // 765
                var resource = Resources.findOne({ _id: resourceID });                                                 // 766
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 767
                                                                                                                       //
                    Resources.update({ _id: resourceID }, { $set: { "content.sortOrder": fieldVal } }, function (error) {
                        if (error) {                                                                                   // 770
                            BuzzyGlobal.throwError(error);                                                             // 771
                        }                                                                                              // 772
                    });                                                                                                // 773
                }                                                                                                      // 775
            }                                                                                                          // 776
        }                                                                                                              // 777
                                                                                                                       //
        return updateResourceSortOrder;                                                                                // 764
    }(),                                                                                                               // 764
    updateResourceAddButtonLocation: function () {                                                                     // 778
        function updateResourceAddButtonLocation(resourceID, fieldID, fieldVal) {                                      // 778
            if (Meteor.userId() && resourceID) {                                                                       // 779
                var resource = Resources.findOne({ _id: resourceID });                                                 // 780
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 781
                                                                                                                       //
                    Resources.update({ _id: resourceID }, { $set: { "content.addButtonLocation": fieldVal } }, function (error) {
                        if (error) {                                                                                   // 784
                            BuzzyGlobal.throwError(error);                                                             // 785
                        }                                                                                              // 786
                    });                                                                                                // 787
                }                                                                                                      // 789
            }                                                                                                          // 790
        }                                                                                                              // 791
                                                                                                                       //
        return updateResourceAddButtonLocation;                                                                        // 778
    }(),                                                                                                               // 778
    updateResourceButtonText: function () {                                                                            // 792
        function updateResourceButtonText(resourceID, fieldVal) {                                                      // 792
            if (Meteor.userId() && resourceID) {                                                                       // 793
                var resource = Resources.findOne({ _id: resourceID });                                                 // 794
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 795
                                                                                                                       //
                    Resources.update({ _id: resourceID }, { $set: { "content.buttonText": fieldVal } }, function (error) {
                        if (error) {                                                                                   // 798
                            BuzzyGlobal.throwError(error);                                                             // 799
                        }                                                                                              // 800
                    });                                                                                                // 801
                }                                                                                                      // 803
            }                                                                                                          // 804
        }                                                                                                              // 805
                                                                                                                       //
        return updateResourceButtonText;                                                                               // 792
    }(),                                                                                                               // 792
    updateResourceFormHelpText: function () {                                                                          // 806
        function updateResourceFormHelpText(resourceID, fieldVal) {                                                    // 806
            if (Meteor.userId() && resourceID) {                                                                       // 807
                var resource = Resources.findOne({ _id: resourceID });                                                 // 808
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 809
                                                                                                                       //
                    Resources.update({ _id: resourceID }, { $set: { "content.microAppFormHelp": fieldVal } }, function (error) {
                        if (error) {                                                                                   // 812
                            BuzzyGlobal.throwError(error);                                                             // 813
                        }                                                                                              // 814
                    });                                                                                                // 815
                }                                                                                                      // 817
            }                                                                                                          // 818
        }                                                                                                              // 819
                                                                                                                       //
        return updateResourceFormHelpText;                                                                             // 806
    }(),                                                                                                               // 806
    updateResourceButtonStyle: function () {                                                                           // 820
        function updateResourceButtonStyle(resourceID, fieldVal) {                                                     // 820
            if (Meteor.userId() && resourceID) {                                                                       // 821
                var resource = Resources.findOne({ _id: resourceID });                                                 // 822
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 823
                                                                                                                       //
                    Resources.update({ _id: resourceID }, { $set: { "content.buttonStyle": fieldVal } }, function (error) {
                        if (error) {                                                                                   // 826
                            BuzzyGlobal.throwError(error);                                                             // 827
                        }                                                                                              // 828
                    });                                                                                                // 829
                }                                                                                                      // 831
            }                                                                                                          // 832
        }                                                                                                              // 833
                                                                                                                       //
        return updateResourceButtonStyle;                                                                              // 820
    }(),                                                                                                               // 820
    updateResourceSubmitButtonText: function () {                                                                      // 834
        function updateResourceSubmitButtonText(resourceID, fieldVal) {                                                // 834
            if (Meteor.userId() && resourceID) {                                                                       // 835
                var resource = Resources.findOne({ _id: resourceID });                                                 // 836
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 837
                                                                                                                       //
                    Resources.update({ _id: resourceID }, { $set: { "content.submitButtonText": fieldVal } }, function (error) {
                        if (error) {                                                                                   // 840
                            BuzzyGlobal.throwError(error);                                                             // 841
                        }                                                                                              // 842
                    });                                                                                                // 843
                }                                                                                                      // 845
            }                                                                                                          // 846
        }                                                                                                              // 847
                                                                                                                       //
        return updateResourceSubmitButtonText;                                                                         // 834
    }(),                                                                                                               // 834
    updateResourceSubmitButtonMessage: function () {                                                                   // 848
        function updateResourceSubmitButtonMessage(resourceID, fieldVal) {                                             // 848
            if (Meteor.userId() && resourceID) {                                                                       // 849
                var resource = Resources.findOne({ _id: resourceID });                                                 // 850
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 851
                                                                                                                       //
                    Resources.update({ _id: resourceID }, { $set: { "content.submitButtonMessage": fieldVal } }, function (error) {
                        if (error) {                                                                                   // 854
                            BuzzyGlobal.throwError(error);                                                             // 855
                        }                                                                                              // 856
                    });                                                                                                // 857
                }                                                                                                      // 859
            }                                                                                                          // 860
        }                                                                                                              // 861
                                                                                                                       //
        return updateResourceSubmitButtonMessage;                                                                      // 848
    }(),                                                                                                               // 848
    updateResourceSubmitButtonStyle: function () {                                                                     // 862
        function updateResourceSubmitButtonStyle(resourceID, fieldVal) {                                               // 862
            if (Meteor.userId() && resourceID) {                                                                       // 863
                var resource = Resources.findOne({ _id: resourceID });                                                 // 864
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 865
                                                                                                                       //
                    Resources.update({ _id: resourceID }, { $set: { "content.submitButtonStyle": fieldVal } }, function (error) {
                        if (error) {                                                                                   // 868
                            BuzzyGlobal.throwError(error);                                                             // 869
                        }                                                                                              // 870
                    });                                                                                                // 871
                }                                                                                                      // 873
            }                                                                                                          // 874
        }                                                                                                              // 875
                                                                                                                       //
        return updateResourceSubmitButtonStyle;                                                                        // 862
    }(),                                                                                                               // 862
    updateResourceWhoCanDelete: function () {                                                                          // 876
        function updateResourceWhoCanDelete(resourceID, fieldID, fieldVal) {                                           // 876
            if (Meteor.userId() && resourceID) {                                                                       // 877
                var resource = Resources.findOne({ _id: resourceID });                                                 // 878
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 879
                                                                                                                       //
                    Resources.update({ _id: resourceID }, { $set: { "content.whoCanDelete": fieldVal } }, function (error) {
                        if (error) {                                                                                   // 882
                            BuzzyGlobal.throwError(error);                                                             // 883
                        }                                                                                              // 884
                    });                                                                                                // 885
                }                                                                                                      // 887
            }                                                                                                          // 888
        }                                                                                                              // 889
                                                                                                                       //
        return updateResourceWhoCanDelete;                                                                             // 876
    }(),                                                                                                               // 876
    updateResourceWhoCanView: function () {                                                                            // 890
        function updateResourceWhoCanView(resourceID, fieldID, fieldVal) {                                             // 890
            if (Meteor.userId() && resourceID) {                                                                       // 891
                var resource = Resources.findOne({ _id: resourceID });                                                 // 892
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 893
                                                                                                                       //
                    Resources.update({ _id: resourceID }, { $set: { "content.whoCanView": fieldVal } }, function (error) {
                        if (error) {                                                                                   // 896
                            BuzzyGlobal.throwError(error);                                                             // 897
                        }                                                                                              // 898
                    });                                                                                                // 899
                }                                                                                                      // 901
            }                                                                                                          // 902
        }                                                                                                              // 903
                                                                                                                       //
        return updateResourceWhoCanView;                                                                               // 890
    }()                                                                                                                // 890
                                                                                                                       //
});                                                                                                                    // 548
                                                                                                                       //
if (Meteor.isServer) {                                                                                                 // 909
    Meteor.methods({                                                                                                   // 910
                                                                                                                       //
        createWithToken: function () {                                                                                 // 912
            function createWithToken(token, resource) {                                                                // 912
                if (!token) {                                                                                          // 913
                    BuzzyGlobal.throwError("Invalid Token");                                                           // 914
                }                                                                                                      // 915
                if (!BuzzyGlobal.getCurrentUser(token)) {                                                              // 916
                    BuzzyGlobal.throwError("Invalid User");                                                            // 917
                }                                                                                                      // 918
                if (!resource) {                                                                                       // 919
                    BuzzyGlobal.throwError("Invalid Resource");                                                        // 920
                }                                                                                                      // 921
                                                                                                                       //
                if (user) {                                                                                            // 923
                                                                                                                       //
                    Resources.insert(resource, function (error) {                                                      // 925
                                                                                                                       //
                        if (error) {                                                                                   // 928
                            // display the error to the user - Need to come back to fix 422 (not sure what # it should be???) as the error number
                            throw new Meteor.Error(422, error.reason);                                                 // 930
                        } else {                                                                                       // 931
                            console.log("Inserted New resources");                                                     // 932
                        }                                                                                              // 933
                    });                                                                                                // 934
                }                                                                                                      // 935
            }                                                                                                          // 938
                                                                                                                       //
            return createWithToken;                                                                                    // 912
        }(),                                                                                                           // 912
        createWithID: function () {                                                                                    // 939
            function createWithID(resource, optUserToken) {                                                            // 939
                var user = BuzzyGlobal.getCurrentUser(optUserToken);                                                   // 940
                                                                                                                       //
                if (!user) throw new Meteor.Error(401, "You need to login to create new resources");                   // 942
                                                                                                                       //
                Resources.insert(resource, function (error) {                                                          // 945
                                                                                                                       //
                    if (error) {                                                                                       // 948
                        // display the error to the user - Need to come back to fix 422 (not sure what # it should be???) as the error number
                        throw new Meteor.Error(422, error.reason);                                                     // 950
                    } else {                                                                                           // 951
                        console.log("Inserted New resources");                                                         // 952
                    }                                                                                                  // 953
                });                                                                                                    // 954
                return true;                                                                                           // 955
            }                                                                                                          // 957
                                                                                                                       //
            return createWithID;                                                                                       // 939
        }(),                                                                                                           // 939
        updateResourceSortField: function () {                                                                         // 958
            function updateResourceSortField(resourceID, fieldNumber, fieldVal, optUserToken) {                        // 958
                var user = BuzzyGlobal.getCurrentUser(optUserToken);                                                   // 959
                var currentResource = Resources.findOne({ _id: resourceID });                                          // 960
                if (!user || !currentResource || !Resources.canEdit(user._id, currentResource)) {                      // 961
                    BuzzyGlobal.throwError("You do not have the rights to do this!");                                  // 962
                }                                                                                                      // 963
                var sortFieldObj = {};                                                                                 // 964
                switch (fieldNumber) {                                                                                 // 965
                    case 1:                                                                                            // 966
                        sortFieldObj = { "content.sortField": fieldVal };                                              // 967
                        break;                                                                                         // 968
                    case 2:                                                                                            // 969
                        sortFieldObj = { "content.sortField2": fieldVal };                                             // 970
                        break;                                                                                         // 971
                    case 3:                                                                                            // 972
                        sortFieldObj = { "content.sortField3": fieldVal };                                             // 973
                        break;                                                                                         // 974
                    default:                                                                                           // 975
                        sortFieldObj = { "content.sortField": fieldVal };                                              // 976
                                                                                                                       //
                }                                                                                                      // 965
                                                                                                                       //
                Resources.update({ _id: resourceID }, { $set: sortFieldObj }, function (error) {                       // 980
                                                                                                                       //
                    if (error) {                                                                                       // 986
                        // display the error to the user - Need to come back to fix 422 (not sure what # it should be???) as the error number
                        throw new Meteor.Error(422, error.reason);                                                     // 988
                    } else {                                                                                           // 989
                        console.log("About to update sortfields");                                                     // 990
                        Meteor.call("updateAllFieldsMicroAppDataSortVal", resourceID, fieldVal, fieldNumber.toString());
                    }                                                                                                  // 992
                });                                                                                                    // 993
                return true;                                                                                           // 994
            }                                                                                                          // 996
                                                                                                                       //
            return updateResourceSortField;                                                                            // 958
        }(),                                                                                                           // 958
        isPublicOrUnlistedResource: function () {                                                                      // 997
            function isPublicOrUnlistedResource(resourceID) {                                                          // 997
                check(resourceID, String);                                                                             // 998
                var resource = Resources.findOne({ _id: resourceID });                                                 // 999
                if (resource) {                                                                                        // 1000
                    return resource.privacy === BuzzyGlobal.gPRIVACY.PUBLIC || resource.privacy === BuzzyGlobal.gPRIVACY.UNLISTED;
                } else {                                                                                               // 1002
                    return false;                                                                                      // 1003
                }                                                                                                      // 1004
            }                                                                                                          // 1006
                                                                                                                       //
            return isPublicOrUnlistedResource;                                                                         // 997
        }(),                                                                                                           // 997
                                                                                                                       //
        addReader: function () {                                                                                       // 1009
            function addReader(resourceID, readerID, optUserToken) {                                                   // 1009
                                                                                                                       //
                var currentResource = Resources.findOne({ _id: resourceID });                                          // 1011
                var user = BuzzyGlobal.getCurrentUser(optUserToken);                                                   // 1012
                if (!user || !currentResource || !Resources.canEdit(user._id, currentResource)) {                      // 1013
                    BuzzyGlobal.throwError("You do not have the rights to do this!");                                  // 1014
                }                                                                                                      // 1015
                var searchExpression = new RegExp(',' + resourceID + ',');                                             // 1016
                Resources.update(                                                                                      // 1017
                //{$or:[{id:resourceID},{path:searchExpression}]},                                                     // 1018
                { $or: [{ _id: resourceID }, { path: searchExpression }] }, { $push: { readers: readerID } }, {        // 1019
                                                                                                                       //
                    multi: true                                                                                        // 1023
                                                                                                                       //
                }, function (error) {                                                                                  // 1021
                    if (error) {                                                                                       // 1027
                        // display the error to the user - Need to come back to fix 422 (not sure what # it should be???) as the error number
                        throw new Meteor.Error(422, error.reason);                                                     // 1029
                    } else {                                                                                           // 1030
                        if (currentResource.status === BuzzyGlobal.gRESOURCE_STATUS.PUBLISHED) {                       // 1031
                            var activity = {                                                                           // 1032
                                "actor": {                                                                             // 1033
                                    "objectType": "person",                                                            // 1034
                                    "displayName": BuzzyGlobal.gGetUserName(user)                                      // 1035
                                },                                                                                     // 1033
                                "verb": "post",                                                                        // 1037
                                "object": {                                                                            // 1038
                                    "objectType": "resource",                                                          // 1039
                                    "resourceID": currentResource._id,                                                 // 1040
                                    "displayName": currentResource.title                                               // 1041
                                },                                                                                     // 1038
                                "target": {                                                                            // 1043
                                    "objectType": "resource",                                                          // 1044
                                    "displayName": currentResource.title                                               // 1045
                                }                                                                                      // 1043
                            };                                                                                         // 1032
                                                                                                                       //
                            Meteor.call("createSingleUserResourceNotification", readerID, currentResource._id, "add", activity, optUserToken);
                        }                                                                                              // 1050
                        return;                                                                                        // 1051
                    }                                                                                                  // 1053
                });                                                                                                    // 1054
            }                                                                                                          // 1056
                                                                                                                       //
            return addReader;                                                                                          // 1009
        }(),                                                                                                           // 1009
        addEditor: function () {                                                                                       // 1057
            function addEditor(resourceID, editorID, optUserToken) {                                                   // 1057
                var currentResource = Resources.findOne({ _id: resourceID });                                          // 1058
                var user = BuzzyGlobal.getCurrentUser(optUserToken);                                                   // 1059
                if (!user || !currentResource || !Resources.canEdit(user._id, currentResource)) {                      // 1060
                    BuzzyGlobal.throwError("You do not have the rights to do this!");                                  // 1061
                }                                                                                                      // 1062
                                                                                                                       //
                var searchExpression = new RegExp(',' + resourceID + ',');                                             // 1064
                Resources.update({ $or: [{ _id: resourceID }, { path: searchExpression }] }, { $push: { editors: editorID } }, {
                                                                                                                       //
                    multi: true                                                                                        // 1070
                                                                                                                       //
                }, function (error) {                                                                                  // 1068
                    if (error) {                                                                                       // 1074
                        // display the error to the user - Need to come back to fix 422 (not sure what # it should be???) as the error number
                        throw new Meteor.Error(422, error.reason);                                                     // 1076
                    } else {                                                                                           // 1077
                        var activity = {                                                                               // 1078
                            "actor": {                                                                                 // 1079
                                "objectType": "person",                                                                // 1080
                                "displayName": BuzzyGlobal.gGetUserName(user)                                          // 1081
                            },                                                                                         // 1079
                            "verb": "post",                                                                            // 1083
                            "object": {                                                                                // 1084
                                "objectType": "resource",                                                              // 1085
                                "resourceID": currentResource._id,                                                     // 1086
                                "displayName": currentResource.title                                                   // 1087
                            },                                                                                         // 1084
                            "target": {                                                                                // 1089
                                "objectType": "resource",                                                              // 1090
                                "displayName": currentResource.title                                                   // 1091
                            }                                                                                          // 1089
                        };                                                                                             // 1078
                        Meteor.call("createSingleUserResourceNotification", editorID, resourceID, "add", activity, optUserToken);
                        return true;                                                                                   // 1095
                    }                                                                                                  // 1097
                });                                                                                                    // 1098
            }                                                                                                          // 1101
                                                                                                                       //
            return addEditor;                                                                                          // 1057
        }(),                                                                                                           // 1057
                                                                                                                       //
        addOwner: function () {                                                                                        // 1103
            function addOwner(resourceID, ownerID, optUserToken) {                                                     // 1103
                var currentResource = Resources.findOne({ _id: resourceID });                                          // 1104
                var user = BuzzyGlobal.getCurrentUser(optUserToken);                                                   // 1105
                if (!user || !currentResource || !Resources.canEdit(user._id, currentResource)) {                      // 1106
                    BuzzyGlobal.throwError("You do not have the rights to do this!");                                  // 1107
                }                                                                                                      // 1108
                var searchExpression = new RegExp(',' + resourceID + ',');                                             // 1109
                Resources.update({ $or: [{ _id: resourceID }, { path: searchExpression }] }, { $push: { owners: ownerID } }, {
                                                                                                                       //
                    multi: true                                                                                        // 1115
                                                                                                                       //
                }, function (error) {                                                                                  // 1113
                    if (error) {                                                                                       // 1119
                        // display the error to the user - Need to come back to fix 422 (not sure what # it should be???) as the error number
                        throw new Meteor.Error(422, error.reason);                                                     // 1121
                    } else {                                                                                           // 1124
                        var activity = {                                                                               // 1125
                            "actor": {                                                                                 // 1126
                                "objectType": "person",                                                                // 1127
                                "displayName": BuzzyGlobal.gGetUserName(user)                                          // 1128
                            },                                                                                         // 1126
                            "verb": "post",                                                                            // 1130
                            "object": {                                                                                // 1131
                                "objectType": "resource",                                                              // 1132
                                "resourceID": currentResource._id,                                                     // 1133
                                "displayName": currentResource.title                                                   // 1134
                            },                                                                                         // 1131
                            "target": {                                                                                // 1136
                                "objectType": "resource",                                                              // 1137
                                "displayName": currentResource.title                                                   // 1138
                            }                                                                                          // 1136
                        };                                                                                             // 1125
                        Meteor.call("createSingleUserResourceNotification", ownerID, resourceID, "add", activity, optUserToken);
                                                                                                                       //
                        return true;                                                                                   // 1143
                    }                                                                                                  // 1145
                });                                                                                                    // 1146
            }                                                                                                          // 1149
                                                                                                                       //
            return addOwner;                                                                                           // 1103
        }(),                                                                                                           // 1103
        removeReader: function () {                                                                                    // 1150
            function removeReader(resourceID, readerID) {                                                              // 1150
                console.log("addReader:" + readerID + " to resource:" + resourceID);                                   // 1151
                var currentResource = Resources.findOne({ _id: resourceID });                                          // 1152
                var user = Meteor.user();                                                                              // 1153
                if (!user || !currentResource || !Resources.canEdit(user._id, currentResource)) {                      // 1154
                    BuzzyGlobal.throwError("You do not have the rights to do this!");                                  // 1155
                }                                                                                                      // 1156
                                                                                                                       //
                var searchExpression = new RegExp(',' + resourceID + ',');                                             // 1158
                Resources.update(                                                                                      // 1159
                //{$or:[{id:resourceID},{path:searchExpression}]},                                                     // 1160
                { $or: [{ _id: resourceID }, { path: searchExpression }] }, { $pull: { readers: readerID } }, {        // 1161
                                                                                                                       //
                    multi: true                                                                                        // 1165
                                                                                                                       //
                }, function (error) {                                                                                  // 1163
                    if (error) {                                                                                       // 1169
                        // display the error to the user - Need to come back to fix 422 (not sure what # it should be???) as the error number
                        throw new Meteor.Error(422, error.reason);                                                     // 1171
                    } else {                                                                                           // 1172
                        console.log("Claims to have addedReader:" + readerID + " to resource:" + resourceID);          // 1173
                        return;                                                                                        // 1174
                    }                                                                                                  // 1176
                });                                                                                                    // 1177
            }                                                                                                          // 1179
                                                                                                                       //
            return removeReader;                                                                                       // 1150
        }(),                                                                                                           // 1150
        removeEditor: function () {                                                                                    // 1180
            function removeEditor(resourceID, editorID) {                                                              // 1180
                var currentResource = Resources.findOne({ _id: resourceID });                                          // 1181
                var user = Meteor.user();                                                                              // 1182
                if (!user || !currentResource || !Resources.canEdit(user._id, currentResource)) {                      // 1183
                    BuzzyGlobal.throwError("You do not have the rights to do this!");                                  // 1184
                }                                                                                                      // 1185
                                                                                                                       //
                var searchExpression = new RegExp(',' + resourceID + ',');                                             // 1187
                Resources.update({ $or: [{ _id: resourceID }, { path: searchExpression }] }, { $pull: { editors: editorID } }, {
                                                                                                                       //
                    multi: true                                                                                        // 1193
                                                                                                                       //
                }, function (error) {                                                                                  // 1191
                    if (error) {                                                                                       // 1197
                        // display the error to the user - Need to come back to fix 422 (not sure what # it should be???) as the error number
                        throw new Meteor.Error(422, error.reason);                                                     // 1199
                    } else {                                                                                           // 1200
                        return true;                                                                                   // 1201
                    }                                                                                                  // 1203
                });                                                                                                    // 1204
            }                                                                                                          // 1207
                                                                                                                       //
            return removeEditor;                                                                                       // 1180
        }(),                                                                                                           // 1180
                                                                                                                       //
        removeOwner: function () {                                                                                     // 1209
            function removeOwner(resourceID, ownerID) {                                                                // 1209
                var currentResource = Resources.findOne({ _id: resourceID });                                          // 1210
                var user = Meteor.user();                                                                              // 1211
                if (!user || !currentResource || !Resources.ownsDocument(user._id, currentResource)) {                 // 1212
                    BuzzyGlobal.throwError("You do not have the rights to do this!");                                  // 1213
                }                                                                                                      // 1214
                                                                                                                       //
                var searchExpression = new RegExp(',' + resourceID + ',');                                             // 1216
                Resources.update({ $or: [{ _id: resourceID }, { path: searchExpression }] }, { $pull: { owners: ownerID } }, {
                                                                                                                       //
                    multi: true                                                                                        // 1222
                                                                                                                       //
                }, function (error) {                                                                                  // 1220
                    if (error) {                                                                                       // 1226
                        // display the error to the user - Need to come back to fix 422 (not sure what # it should be???) as the error number
                        throw new Meteor.Error(422, error.reason);                                                     // 1228
                    } else {                                                                                           // 1229
                        return true;                                                                                   // 1230
                    }                                                                                                  // 1232
                });                                                                                                    // 1233
            }                                                                                                          // 1234
                                                                                                                       //
            return removeOwner;                                                                                        // 1209
        }(),                                                                                                           // 1209
                                                                                                                       //
        removeParticipant: function () {                                                                               // 1236
            function removeParticipant(resourceID, participantID) {                                                    // 1236
                var resource = Resources.findOne({ _id: resourceID });                                                 // 1237
                var userID = Meteor.userId();                                                                          // 1238
                var searchExpression = new RegExp(',' + resourceID + ',');                                             // 1239
                if (resource && Resources.canChangeAudienceAndAuthors(userID, resource)) {                             // 1240
                                                                                                                       //
                    if (resource.readers.indexOf(participantID) >= 0) {                                                // 1242
                        Resources.update({ $or: [{ _id: resourceID }, { path: searchExpression }] }, { $pull: { readers: participantID } }, {
                                                                                                                       //
                            multi: true                                                                                // 1248
                                                                                                                       //
                        }, function (error) {                                                                          // 1246
                            if (error) {                                                                               // 1252
                                // display the error to the user - Need to come back to fix 422 (not sure what # it should be???) as the error number
                                throw new Meteor.Error(422, error.reason);                                             // 1254
                            } else {                                                                                   // 1255
                                Meteor.call("removeFollower", resourceID, participantID);                              // 1256
                                return true;                                                                           // 1257
                            }                                                                                          // 1259
                        });                                                                                            // 1260
                    } else if (resource.editors.indexOf(participantID) >= 0) {                                         // 1262
                        Resources.update({ $or: [{ _id: resourceID }, { path: searchExpression }] }, { $pull: { editors: participantID } }, {
                                                                                                                       //
                            multi: true                                                                                // 1268
                                                                                                                       //
                        }, function (error) {                                                                          // 1266
                            if (error) {                                                                               // 1272
                                // display the error to the user - Need to come back to fix 422 (not sure what # it should be???) as the error number
                                throw new Meteor.Error(422, error.reason);                                             // 1274
                            } else {                                                                                   // 1275
                                                                                                                       //
                                Meteor.call("removeFollower", resourceID, participantID);                              // 1277
                                return true;                                                                           // 1278
                            }                                                                                          // 1280
                        });                                                                                            // 1281
                    }                                                                                                  // 1282
                } else if (resource.owners.indexOf(participantID) >= 0 && Resources.canChangeOwners(userID, resource)) {
                    if (resource.owners.length === 1) {                                                                // 1285
                        throw new Meteor.Error(500, "You cannot remove last owner");                                   // 1286
                    } else {                                                                                           // 1287
                        Resources.update({ $or: [{ _id: resourceID }, { path: searchExpression }] }, { $pull: { owners: participantID } }, {
                                                                                                                       //
                            multi: true                                                                                // 1293
                                                                                                                       //
                        }, function (error) {                                                                          // 1291
                            if (error) {                                                                               // 1297
                                // display the error to the user - Need to come back to fix 422 (not sure what # it should be???) as the error number
                                throw new Meteor.Error(422, error.reason);                                             // 1299
                            } else {                                                                                   // 1300
                                Meteor.call("removeFollower", resourceID, participantID);                              // 1301
                                return true;                                                                           // 1302
                            }                                                                                          // 1304
                        });                                                                                            // 1305
                    }                                                                                                  // 1306
                } else {                                                                                               // 1309
                    throw new Meteor.Error(500, "User not allowed to remove participant");                             // 1310
                }                                                                                                      // 1311
            }                                                                                                          // 1314
                                                                                                                       //
            return removeParticipant;                                                                                  // 1236
        }(),                                                                                                           // 1236
                                                                                                                       //
        updateUpdatedDate: function () {                                                                               // 1316
            function updateUpdatedDate(resourceID) {                                                                   // 1316
                Resources.update({ _id: resourceID }, { $set: { updated: new Date().getTime() } });                    // 1317
            }                                                                                                          // 1319
                                                                                                                       //
            return updateUpdatedDate;                                                                                  // 1316
        }(),                                                                                                           // 1316
        ResourceSetAllToFollow: function () {                                                                          // 1320
            function ResourceSetAllToFollow(resourceID) {                                                              // 1320
                check(resourceID, String);                                                                             // 1321
                var currentResource = Resources.findOne({ _id: resourceID });                                          // 1322
                if (currentResource) {                                                                                 // 1323
                    currentResource.readers.forEach(function (user) {                                                  // 1324
                        Meteor.call("addFollower", resourceID, user);                                                  // 1325
                    });                                                                                                // 1327
                    currentResource.editors.forEach(function (user) {                                                  // 1328
                        Meteor.call("addFollower", resourceID, user);                                                  // 1329
                    });                                                                                                // 1331
                    currentResource.owners.forEach(function (user) {                                                   // 1332
                        Meteor.call("addFollower", resourceID, user);                                                  // 1333
                    });                                                                                                // 1335
                    //createResourceNotification(resourceID,BuzzyGlobal.gACTIONS.PUBLISHED);                           // 1336
                    Meteor.call("createResourceNotification", resourceID, BuzzyGlobal.gACTIONS.PUBLISHED, function (error) {
                        if (error) {                                                                                   // 1338
                            console.log(error);                                                                        // 1339
                            BuzzyGlobal.throwError(error);                                                             // 1340
                        }                                                                                              // 1341
                    });                                                                                                // 1342
                } else {                                                                                               // 1344
                    throw new Meteor.Error(500, "cannot set followers");                                               // 1345
                }                                                                                                      // 1347
            }                                                                                                          // 1349
                                                                                                                       //
            return ResourceSetAllToFollow;                                                                             // 1320
        }(),                                                                                                           // 1320
        createDirectChildrenServerMethod: function () {                                                                // 1350
            function createDirectChildrenServerMethod(srcResourceID, readers, editors, owners, targetPath, rank, parentStatus, optResource) {
                                                                                                                       //
                var resource = Resources.findOne({ _id: srcResourceID });                                              // 1352
                console.log("createDirectChildrenServerMethod RESOURCE ID:" + resource._id + " can view:" + Resources.canView(Meteor.userId(), resource));
                var resourceParent;                                                                                    // 1354
                if (targetPath) {                                                                                      // 1355
                    var parentID = Resources.gGetParentFromPath(targetPath);                                           // 1356
                    resourceParent = Resources.findOne({ _id: parentID });                                             // 1357
                    if (resourceParent && !Resources.canEdit(Meteor.userId(), resourceParent)) {                       // 1358
                        BuzzyGlobal.throwError("Sorry you don't have access to do that!");                             // 1359
                        return;                                                                                        // 1360
                    }                                                                                                  // 1361
                }                                                                                                      // 1362
                                                                                                                       //
                if (resource && Resources.canView(Meteor.userId(), resource)) {                                        // 1365
                    Resources.createDirectChildren(srcResourceID, readers, editors, owners, targetPath, rank, parentStatus, optResource, null, function (err, id) {
                        if (err) {                                                                                     // 1367
                            throw new Meteor.Error(500, err);                                                          // 1368
                        } else {                                                                                       // 1369
                            console.log("NO ERROR CREATED DIRECT CHILDREN for " + id);                                 // 1370
                        }                                                                                              // 1371
                    });                                                                                                // 1372
                } else {                                                                                               // 1373
                    throw new Meteor.Error(500, "Cannot access resource");                                             // 1374
                }                                                                                                      // 1375
            }                                                                                                          // 1378
                                                                                                                       //
            return createDirectChildrenServerMethod;                                                                   // 1350
        }(),                                                                                                           // 1350
        duplicateWelcomeBuzz: function () {                                                                            // 1379
            function duplicateWelcomeBuzz() {                                                                          // 1379
                if (!Meteor.userId()) {                                                                                // 1380
                    throw new Meteor.Error(500, "User musy be logged in to created Welcome Buzz.");                    // 1381
                }                                                                                                      // 1382
                var welcomeBuzz = Resources.findOne({ _id: Meteor.settings.BUZZY_WELCOME });                           // 1383
                if (welcomeBuzz) {                                                                                     // 1384
                    var userName = BuzzyGlobal.gGetUserNameByID(Meteor.userId());                                      // 1385
                    var newResource = _.extend(_.pick(welcomeBuzz, 'CSSclass', 'coverImage', 'type', 'resourceURI', 'orginalResourceID', 'showComments', 'description', 'reusable', 'orginalResourceID', 'isStarterTemplate', 'tourStepID', 'tourCode', 'hasTour'), {
                                                                                                                       //
                        title: "Welcome to Buzzy, " + userName,                                                        // 1388
                        userID: Meteor.userId(),                                                                       // 1389
                        author: userName,                                                                              // 1390
                        readers: [],                                                                                   // 1391
                        editors: [],                                                                                   // 1392
                        status: BuzzyGlobal.gRESOURCE_STATUS.PUBLISHED,                                                // 1393
                        privacy: BuzzyGlobal.gPRIVACY.PRIVATE,                                                         // 1394
                                                                                                                       //
                        owners: [Meteor.userId()],                                                                     // 1397
                        followers: [],                                                                                 // 1398
                                                                                                                       //
                        submitted: new Date().getTime(),                                                               // 1400
                        updated: new Date().getTime(),                                                                 // 1401
                        path: null,                                                                                    // 1402
                        _id: new Meteor.Collection.ObjectID()._str                                                     // 1403
                                                                                                                       //
                    });                                                                                                // 1386
                                                                                                                       //
                    Resources.createDirectChildren(welcomeBuzz._id, [], [], [Meteor.userId()], null, 1, newResource.status, newResource, null, function (err) {
                                                                                                                       //
                        if (err) {                                                                                     // 1410
                            throw new Meteor.Error(500, err);                                                          // 1411
                        } else {                                                                                       // 1412
                            console.log("WELCOME BUZZ Created " + newResource._id);                                    // 1413
                        }                                                                                              // 1414
                    });                                                                                                // 1415
                }                                                                                                      // 1416
            }                                                                                                          // 1419
                                                                                                                       //
            return duplicateWelcomeBuzz;                                                                               // 1379
        }(),                                                                                                           // 1379
        changeRoleTo: function () {                                                                                    // 1420
            function changeRoleTo(resourceID, userID, targetRole) {                                                    // 1420
                                                                                                                       //
                if (resourceID) {                                                                                      // 1422
                                                                                                                       //
                    var resource = Resources.findOne({ _id: resourceID });                                             // 1424
                    if (resource) {                                                                                    // 1425
                                                                                                                       //
                        if (Resources.canChangeOwners(Meteor.userId(), resource)) {                                    // 1428
                            switch (targetRole) {                                                                      // 1429
                                case "reader":                                                                         // 1430
                                                                                                                       //
                                    if (resource.editors.indexOf(userID) >= 0) {                                       // 1432
                                        Meteor.call("addReader", resourceID, userID);                                  // 1433
                                        Meteor.call("removeEditor", resourceID, userID);                               // 1434
                                    } else if (resource.owners.indexOf(userID) >= 0 && resource.owners.length > 1) {   // 1435
                                        Meteor.call("addReader", resourceID, userID);                                  // 1436
                                        Meteor.call("removeOwner", resourceID, userID);                                // 1437
                                    }                                                                                  // 1438
                                                                                                                       //
                                    break;                                                                             // 1440
                                case "editor":                                                                         // 1441
                                                                                                                       //
                                    if (resource.readers.indexOf(userID) >= 0) {                                       // 1444
                                        Meteor.call("addEditor", resourceID, userID);                                  // 1445
                                        Meteor.call("removeReader", resourceID, userID);                               // 1446
                                    } else if (resource.owners.indexOf(userID) >= 0 && resource.owners.length > 1) {   // 1447
                                        Meteor.call("addEditor", resourceID, userID);                                  // 1448
                                        Meteor.call("removeOwner", resourceID, userID);                                // 1449
                                    }                                                                                  // 1450
                                                                                                                       //
                                    break;                                                                             // 1452
                                case "owner":                                                                          // 1453
                                                                                                                       //
                                    if (resource.readers.indexOf(userID) >= 0) {                                       // 1455
                                        Meteor.call("addOwner", resourceID, userID);                                   // 1456
                                        Meteor.call("removeReader", resourceID, userID);                               // 1457
                                    } else if (resource.editors.indexOf(userID) >= 0) {                                // 1458
                                        Meteor.call("addOwner", resourceID, userID);                                   // 1459
                                        Meteor.call("removeEditor", resourceID, userID);                               // 1460
                                    }                                                                                  // 1461
                                                                                                                       //
                                    break;                                                                             // 1463
                                                                                                                       //
                            }                                                                                          // 1429
                        } else if (Resources.canChangeAudienceAndAuthors(Meteor.userId(), resource)) {                 // 1466
                                                                                                                       //
                            switch (targetRole) {                                                                      // 1468
                                case "reader":                                                                         // 1469
                                                                                                                       //
                                    if (resource.editors.indexOf(userID) >= 0) {                                       // 1471
                                        Meteor.call("addReader", resourceID, userID);                                  // 1472
                                        Meteor.call("removeEditor", resourceID, userID);                               // 1473
                                    } else if (resource.owners.indexOf(userID) >= 0 && resource.owners.length > 1) {   // 1474
                                        Meteor.call("addReader", resourceID, userID);                                  // 1475
                                        Meteor.call("removeOwner", resourceID, userID);                                // 1476
                                    }                                                                                  // 1477
                                                                                                                       //
                                    break;                                                                             // 1479
                                case "editor":                                                                         // 1480
                                                                                                                       //
                                    if (resource.readers.indexOf(userID) >= 0) {                                       // 1483
                                        Meteor.call("addEditor", resourceID, userID);                                  // 1484
                                        Meteor.call("removeReader", resourceID, userID);                               // 1485
                                    } else if (resource.owners.indexOf(userID) >= 0 && resource.owners.length > 1) {   // 1486
                                        Meteor.call("addEditor", resourceID, userID);                                  // 1487
                                        Meteor.call("removeOwner", resourceID, userID);                                // 1488
                                    }                                                                                  // 1489
                                                                                                                       //
                                    break;                                                                             // 1491
                                                                                                                       //
                            }                                                                                          // 1468
                        } else {                                                                                       // 1495
                            throw new Meteor.Error(500, "Insufficient rights to change user role.");                   // 1496
                        }                                                                                              // 1497
                    } else {                                                                                           // 1499
                        throw new Meteor.Error(500, "Can't find resource");                                            // 1500
                    }                                                                                                  // 1501
                } else {                                                                                               // 1502
                                                                                                                       //
                    throw new Meteor.Error(500, "No resource provided");                                               // 1504
                }                                                                                                      // 1505
            }                                                                                                          // 1507
                                                                                                                       //
            return changeRoleTo;                                                                                       // 1420
        }(),                                                                                                           // 1420
        relatedBuzz: function () {                                                                                     // 1508
            function relatedBuzz(participants, currentResourceID) {                                                    // 1508
                var query = resourceQuery(Meteor.userId(), "all", "");                                                 // 1509
                var pipeline = [{ $match: query }, {                                                                   // 1510
                    $project: {                                                                                        // 1513
                        title: 1,                                                                                      // 1514
                        updated: 1,                                                                                    // 1515
                        type: 1,                                                                                       // 1516
                        status: 1,                                                                                     // 1517
                        readers: 1,                                                                                    // 1518
                        editors: 1,                                                                                    // 1519
                        owners: 1,                                                                                     // 1520
                        allValues: { $setUnion: ["$readers", "$editors", "$owners"] },                                 // 1521
                        _id: 1                                                                                         // 1522
                    }                                                                                                  // 1513
                }, {                                                                                                   // 1512
                    $match: {                                                                                          // 1526
                        $and: [{ allValues: { $all: participants } }, { _id: { $ne: currentResourceID } }]             // 1527
                    }                                                                                                  // 1526
                }, { $sort: { updated: -1 } }, { $limit: 10 }                                                          // 1525
                //{$group: {_id: null, resTime: {$sum: "$resTime"}}}                                                   // 1535
                ];                                                                                                     // 1510
                var results = Resources.aggregate(pipeline);                                                           // 1537
                                                                                                                       //
                return results;                                                                                        // 1539
            }                                                                                                          // 1542
                                                                                                                       //
            return relatedBuzz;                                                                                        // 1508
        }(),                                                                                                           // 1508
                                                                                                                       //
        resourceFollowersLimited: function () {                                                                        // 1544
            function resourceFollowersLimited(resourceID, optLimit, timeCalled) {                                      // 1544
                console.log("resourceFollowersLimited", resourceID, optLimit);                                         // 1545
                check(resourceID, String);                                                                             // 1546
                check(optLimit, Number);                                                                               // 1547
                                                                                                                       //
                var resource = Resources.findOne({ _id: resourceID });                                                 // 1549
                if (resource && Meteor.userId() && Resources.canEdit(Meteor.userId(), resource)) {                     // 1550
                    var followers = ResourceFollowers.find({ resourceID: resourceID }, { limit: optLimit }).map(function (follower) {
                                                                                                                       //
                        return follower.userID;                                                                        // 1553
                    });                                                                                                // 1554
                    console.log("resourceFollowersLimited f:", followers);                                             // 1555
                    var userArray = Users.find({ _id: { $in: followers } }, { limit: optLimit }).map(function (user) {
                        return _.pick(user, '_id', 'profile', 'username', 'emails', 'email', 'services.google.picture', 'services.google.email', 'services.google.name', 'services.facebook.email', 'services.facebook.id', 'services.facebook.link', 'services.facebook.name', 'services.google.verified_email', 'services.password.verified_email');
                    });                                                                                                // 1574
                                                                                                                       //
                    return userArray;                                                                                  // 1576
                } else {                                                                                               // 1577
                    BuzzGlobal.throwError("Sorry, can perform operation.");                                            // 1578
                }                                                                                                      // 1579
            }                                                                                                          // 1582
                                                                                                                       //
            return resourceFollowersLimited;                                                                           // 1544
        }(),                                                                                                           // 1544
        searchBuzz: function () {                                                                                      // 1583
            function searchBuzz(searchQuery) {                                                                         // 1583
                                                                                                                       //
                var searchExpression = new RegExp(searchQuery, "i");                                                   // 1586
                var contactsArray = UserContacts.find({                                                                // 1587
                    $and: [{ userID: Meteor.userId() }, { $or: [{ name: searchExpression }, { email: searchExpression }] }]
                }).map(function (contact) {                                                                            // 1588
                    return contact.contactID;                                                                          // 1595
                });                                                                                                    // 1596
                                                                                                                       //
                var query = resourceQuery(Meteor.userId(), "all", "");                                                 // 1598
                var pipeline = [{ $match: query }, {                                                                   // 1599
                    $project: {                                                                                        // 1602
                        title: 1,                                                                                      // 1603
                        updated: 1,                                                                                    // 1604
                        type: 1,                                                                                       // 1605
                        status: 1,                                                                                     // 1606
                        readers: 1,                                                                                    // 1607
                        editors: 1,                                                                                    // 1608
                        owners: 1,                                                                                     // 1609
                        allValues: { $setUnion: ["$readers", "$editors", "$owners"] },                                 // 1610
                        _id: 1,                                                                                        // 1611
                        coverImage: 1                                                                                  // 1612
                    }                                                                                                  // 1602
                }, {                                                                                                   // 1601
                    $match: {                                                                                          // 1616
                        $or: [{ allValues: { $in: contactsArray } }, { title: searchExpression }]                      // 1617
                    }                                                                                                  // 1616
                }, { $sort: { updated: -1 } }, { $limit: 50 }                                                          // 1615
                //{$group: {_id: null, resTime: {$sum: "$resTime"}}}                                                   // 1625
                ];                                                                                                     // 1599
                var results = Resources.aggregate(pipeline);                                                           // 1627
                                                                                                                       //
                return results;                                                                                        // 1629
            }                                                                                                          // 1631
                                                                                                                       //
            return searchBuzz;                                                                                         // 1583
        }(),                                                                                                           // 1583
        searchBuzzOwnerAuthor: function () {                                                                           // 1632
            function searchBuzzOwnerAuthor(searchQuery) {                                                              // 1632
                                                                                                                       //
                var searchExpression = new RegExp(searchQuery, "i");                                                   // 1635
                var contactsArray = UserContacts.find({                                                                // 1636
                    $and: [{ userID: Meteor.userId() }, { $or: [{ name: searchExpression }, { email: searchExpression }] }]
                }).map(function (contact) {                                                                            // 1637
                    return contact.contactID;                                                                          // 1644
                });                                                                                                    // 1645
                                                                                                                       //
                var generateQuery = function () {                                                                      // 1647
                    function generateQuery(searchExp) {                                                                // 1647
                        var searchUserExpression = new RegExp(Meteor.userId());                                        // 1648
                        if (searchExp) {                                                                               // 1649
                            return {                                                                                   // 1650
                                $and: [{ title: searchExp }, { path: null }, { type: "buzz" }, { isStarterTemplate: false }, {
                                    $or: [{ editors: searchUserExpression }, { owners: searchUserExpression }]         // 1657
                                }, { $or: [{ status: 'draft' }, { status: 'published' }] }]                            // 1656
                            };                                                                                         // 1650
                        } else {                                                                                       // 1666
                            return {                                                                                   // 1667
                                $and: [{ path: null }, { type: "buzz" }, { isStarterTemplate: false }, {               // 1668
                                    $or: [{ editors: searchUserExpression }, { owners: searchUserExpression }]         // 1673
                                }, { $or: [{ status: 'draft' }, { status: 'published' }] }]                            // 1672
                            };                                                                                         // 1667
                        }                                                                                              // 1683
                    }                                                                                                  // 1684
                                                                                                                       //
                    return generateQuery;                                                                              // 1647
                }();                                                                                                   // 1647
                var query = generateQuery(searchExpression);                                                           // 1685
                var pipeline = [{ $match: query }, {                                                                   // 1686
                    $project: {                                                                                        // 1689
                        title: 1,                                                                                      // 1690
                        updated: 1,                                                                                    // 1691
                        type: 1,                                                                                       // 1692
                        status: 1,                                                                                     // 1693
                        editors: 1,                                                                                    // 1694
                        owners: 1,                                                                                     // 1695
                        allValues: { $setUnion: ["$editors", "$owners"] },                                             // 1696
                        _id: 1                                                                                         // 1697
                    }                                                                                                  // 1689
                }, {                                                                                                   // 1688
                    $match: {                                                                                          // 1701
                        $or: [{ allValues: { $in: contactsArray } }, { title: searchExpression }]                      // 1702
                    }                                                                                                  // 1701
                }, { $sort: { updated: -1 } }, { $limit: 50 }                                                          // 1700
                //{$group: {_id: null, resTime: {$sum: "$resTime"}}}                                                   // 1710
                ];                                                                                                     // 1686
                var results = Resources.aggregate(pipeline);                                                           // 1712
                                                                                                                       //
                return results;                                                                                        // 1714
            }                                                                                                          // 1716
                                                                                                                       //
            return searchBuzzOwnerAuthor;                                                                              // 1632
        }(),                                                                                                           // 1632
                                                                                                                       //
        getBasicBuzzID: function () {                                                                                  // 1718
            function getBasicBuzzID() {                                                                                // 1718
                console.log("Meteor.settings.BUZZY_BASIC_BUZZ_ID", Meteor.settings.BUZZY_BASIC_BUZZ_ID);               // 1719
                if (typeof Meteor.settings.BUZZY_BASIC_BUZZ_ID === "undefined" || Meteor.settings.BUZZY_BASIC_BUZZ_ID === "" || Meteor.settings.BUZZY_BASIC_BUZZ_ID === null) {
                    throw new Meteor.Error(500, "Can't get get basic buzz ID");                                        // 1721
                } else {                                                                                               // 1722
                    return Meteor.settings.BUZZY_BASIC_BUZZ_ID;                                                        // 1723
                }                                                                                                      // 1724
            }                                                                                                          // 1726
                                                                                                                       //
            return getBasicBuzzID;                                                                                     // 1718
        }(),                                                                                                           // 1718
        updateResourceGalleryURL: function () {                                                                        // 1727
            function updateResourceGalleryURL(resourceID, updateData) {                                                // 1727
                if (Meteor.userId() && resourceID && updateData) {                                                     // 1728
                    var resource = Resources.findOne({ _id: resourceID });                                             // 1729
                    if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                    // 1730
                        var obj = {                                                                                    // 1731
                            content: {                                                                                 // 1732
                                galleryURL: updateData.signedURL,                                                      // 1733
                                signature: updateData.signature,                                                       // 1734
                                policy: updateData.policy,                                                             // 1735
                                additionalImageCount: updateData.additionalImageCount                                  // 1736
                            }                                                                                          // 1732
                        };                                                                                             // 1731
                        Resources.update({ _id: resourceID }, { $set: obj }, function (error) {                        // 1739
                            if (error) {                                                                               // 1740
                                BuzzyGlobal.throwError(error);                                                         // 1741
                            }                                                                                          // 1742
                        });                                                                                            // 1743
                    }                                                                                                  // 1745
                }                                                                                                      // 1746
            }                                                                                                          // 1747
                                                                                                                       //
            return updateResourceGalleryURL;                                                                           // 1727
        }(),                                                                                                           // 1727
        updateResourceAnalyticsOn: function () {                                                                       // 1748
            function updateResourceAnalyticsOn(resourceID, updateData) {                                               // 1748
                if (Meteor.userId() && resourceID && typeof updateData !== "undefined") {                              // 1749
                    var resource = Resources.findOne({ _id: resourceID });                                             // 1750
                    if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                    // 1751
                                                                                                                       //
                        Resources.upsert({ _id: resourceID }, { $set: { resourceAnalyticsOn: updateData } }, function (error) {
                            if (error) {                                                                               // 1754
                                BuzzyGlobal.throwError(error);                                                         // 1755
                            }                                                                                          // 1756
                        });                                                                                            // 1757
                    }                                                                                                  // 1759
                }                                                                                                      // 1760
            }                                                                                                          // 1761
                                                                                                                       //
            return updateResourceAnalyticsOn;                                                                          // 1748
        }(),                                                                                                           // 1748
        createBuzzFromTemplate: function () {                                                                          // 1762
            function createBuzzFromTemplate(templateID, optUserList, optUserToken) {                                   // 1762
                                                                                                                       //
                var user = BuzzyGlobal.getCurrentUser(optUserToken);                                                   // 1764
                if (!user) {                                                                                           // 1765
                    BuzzyGlobal.throwError("Invalid User Credentials");                                                // 1766
                }                                                                                                      // 1767
                var chosenTemplate = Resources.findOne({ _id: templateID });                                           // 1768
                                                                                                                       //
                if (chosenTemplate && Resources.canView(user._id, chosenTemplate)) {                                   // 1770
                    if (user) {                                                                                        // 1771
                        var newReaders = [],                                                                           // 1772
                            newEditors = [],                                                                           // 1772
                            newOwners = [user._id];                                                                    // 1772
                        var newResource = _.extend(_.pick(chosenTemplate, 'coverImage', 'CSSclass', 'type', 'resourceURI', 'orginalResourceID', 'showComments', 'description', 'reusable', 'orginalResourceID', 'tourStepID', 'tourCode', 'hasTour'), {
                                                                                                                       //
                            title: chosenTemplate.title + " " + moment(new Date().getTime()).format('DD MMM YYYY (h:mm a)'),
                            userID: user._id,                                                                          // 1776
                            author: BuzzyGlobal.gGetUserName(user),                                                    // 1777
                            readers: newReaders,                                                                       // 1778
                            editors: newEditors,                                                                       // 1779
                            status: BuzzyGlobal.gRESOURCE_STATUS.DRAFT,                                                // 1780
                            privacy: BuzzyGlobal.gPRIVACY.PRIVATE,                                                     // 1781
                            isStarterTemplate: false,                                                                  // 1782
                            owners: newOwners,                                                                         // 1783
                            followers: [],                                                                             // 1784
                                                                                                                       //
                            submitted: new Date().getTime(),                                                           // 1786
                            updated: new Date().getTime(),                                                             // 1787
                            path: null,                                                                                // 1788
                            _id: new Meteor.Collection.ObjectID()._str,                                                // 1789
                            hasTour: false                                                                             // 1790
                                                                                                                       //
                        });                                                                                            // 1773
                        Resources.createDirectChildren(chosenTemplate._id, newReaders, newEditors, newOwners, null, 1, newResource.status, newResource, optUserToken, function (err) {
                            if (err) {                                                                                 // 1795
                                BuzzyGlobal.throwError(err);                                                           // 1796
                            } else {                                                                                   // 1797
                                Meteor.setTimeout(function () {                                                        // 1798
                                    if (typeof optUserList !== "undefined") {                                          // 1799
                                        var i = -1,                                                                    // 1800
                                            j = -1,                                                                    // 1800
                                            k = -1;                                                                    // 1800
                                                                                                                       //
                                        for (i in meteorBabelHelpers.sanitizeForInObject(optUserList.audience)) {      // 1802
                                            Meteor.call('addNewUser', newResource._id, optUserList.audience[i], "addReader", optUserToken, function (err) {
                                                if (err) {                                                             // 1805
                                                    BuzzyGlobal.throwError(err);                                       // 1806
                                                } else {                                                               // 1807
                                                    if (Meteor.isClient) {                                             // 1808
                                                                                                                       //
                                                        BuzzyLogging.call("track", {                                   // 1810
                                                            action: "invitedUser",                                     // 1811
                                                            invitedByID: user._id,                                     // 1812
                                                            invitedUserEmail: optUserList.audience[i],                 // 1813
                                                            invitingResourceID: newResource._id                        // 1814
                                                        });                                                            // 1810
                                                        analytics.track("invitedUser", {                               // 1816
                                                            invitedByID: user._id,                                     // 1817
                                                            invitedUserEmail: optUserList.audience[i],                 // 1818
                                                            invitingResourceID: newResource._id                        // 1819
                                                        }, function () {                                               // 1816
                                                            return;                                                    // 1821
                                                        });                                                            // 1822
                                                    }                                                                  // 1823
                                                }                                                                      // 1825
                                            });                                                                        // 1826
                                        }                                                                              // 1828
                                    }                                                                                  // 1829
                                    for (j in meteorBabelHelpers.sanitizeForInObject(optUserList.authors)) {           // 1830
                                        Meteor.call('addNewUser', newResource._id, optUserList.authors[j], "addEditor", optUserToken, function (err) {
                                            if (err) {                                                                 // 1833
                                                BuzzyGlobal.throwError(err);                                           // 1834
                                            } else {                                                                   // 1835
                                                if (Meteor.isClient) {                                                 // 1836
                                                    BuzzyLogging.call("track", {                                       // 1837
                                                        action: "invitedUser",                                         // 1838
                                                        invitedByID: user._id,                                         // 1839
                                                        invitedUserEmail: optUserList.authors[j],                      // 1840
                                                        invitingResourceID: newResource._id                            // 1841
                                                    });                                                                // 1837
                                                    analytics.track("invitedUser", {                                   // 1843
                                                        invitedByID: user._id,                                         // 1844
                                                        invitedUserEmail: optUserList.authors[j],                      // 1845
                                                        invitingResourceID: newResource._id                            // 1846
                                                    }, function () {                                                   // 1843
                                                        return;                                                        // 1848
                                                    });                                                                // 1849
                                                }                                                                      // 1850
                                            }                                                                          // 1852
                                        });                                                                            // 1853
                                    }                                                                                  // 1855
                                    for (k in meteorBabelHelpers.sanitizeForInObject(optUserList.owners)) {            // 1856
                                        Meteor.call('addNewUser', newResource._id, optUserList.owners[k], "addOwner", optUserToken, function (err) {
                                            if (err) {                                                                 // 1859
                                                BuzzyGlobal.throwError(err);                                           // 1860
                                            } else {                                                                   // 1861
                                                if (Meteor.isClient) {                                                 // 1862
                                                                                                                       //
                                                    BuzzyLogging.call("track", {                                       // 1864
                                                        action: "invitedUser",                                         // 1865
                                                        invitedByID: user._id,                                         // 1866
                                                        invitedUserEmail: optUserList.owners[k],                       // 1867
                                                        invitingResourceID: newResource._id                            // 1868
                                                    });                                                                // 1864
                                                    analytics.track("invitedUser", {                                   // 1870
                                                        invitedByID: user._id,                                         // 1871
                                                        invitedUserEmail: optUserList.owners[k],                       // 1872
                                                        invitingResourceID: newResource._id                            // 1873
                                                    }, function () {                                                   // 1870
                                                        return;                                                        // 1875
                                                    });                                                                // 1876
                                                }                                                                      // 1877
                                            }                                                                          // 1879
                                        });                                                                            // 1880
                                    }                                                                                  // 1882
                                }, 5000);                                                                              // 1884
                            }                                                                                          // 1886
                        });                                                                                            // 1888
                    } else {                                                                                           // 1890
                        console.log("here 4");                                                                         // 1891
                        BuzzyGlobal.throwError("Cannot associate user with reqest.");                                  // 1892
                    }                                                                                                  // 1893
                } else {                                                                                               // 1894
                    console.log("here 5");                                                                             // 1895
                    BuzzyGlobal.throwError("Cannot find template.");                                                   // 1896
                }                                                                                                      // 1897
            }                                                                                                          // 1898
                                                                                                                       //
            return createBuzzFromTemplate;                                                                             // 1762
        }(),                                                                                                           // 1762
        makeRestCall: function () {                                                                                    // 1899
            function makeRestCall(resourceID, url) {                                                                   // 1899
                HTTP.call("POST", url, {}, function (err, result) {                                                    // 1900
                    console.log("POST RESULT:", result, " ERR:", err);                                                 // 1902
                    if (err) {                                                                                         // 1903
                        console.log({ message: 'Test failed error.' });                                                // 1904
                    } else {                                                                                           // 1905
                        console.log("TT res:", result);                                                                // 1906
                        console.log({ message: 'Test passed - got result: ' + result });                               // 1907
                    }                                                                                                  // 1908
                });                                                                                                    // 1911
            }                                                                                                          // 1912
                                                                                                                       //
            return makeRestCall;                                                                                       // 1899
        }(),                                                                                                           // 1899
        microAppCSV: function () {                                                                                     // 1913
            function microAppCSV(resourceID) {                                                                         // 1913
                var resource = Resources.findOne({ _id: resourceID });                                                 // 1914
                var fieldsCursor = {};                                                                                 // 1915
                var fieldsArray = [];                                                                                  // 1916
                var appData = [];                                                                                      // 1917
                if (Resources.canEdit(Meteor.userId(), resource)) {                                                    // 1918
                    fieldsCursor = MicroAppFields.find({ parentResourceID: resourceID }, { sort: { rank: 1 } });       // 1919
                    fieldsArray = fieldsCursor.map(function (field) {                                                  // 1920
                        return field.label;                                                                            // 1921
                    });                                                                                                // 1922
                }                                                                                                      // 1923
                ;                                                                                                      // 1924
                                                                                                                       //
                if (fieldsCursor) {                                                                                    // 1926
                    appData = MicroAppData.find({ parentResourceID: resourceID }).map(function (data) {                // 1927
                        var row = [];                                                                                  // 1928
                        fieldsCursor.forEach(function (currField) {                                                    // 1929
                            var tempEvent = "";                                                                        // 1930
                            for (j in meteorBabelHelpers.sanitizeForInObject(data.content)) {                          // 1931
                                if (data.content[j]._id === currField._id) {                                           // 1932
                                    switch (currField.fieldType) {                                                     // 1933
                                        case BuzzyGlobal.gAPPFIELDTYPE.DATETIME:                                       // 1934
                                            if (data.content[j].value && typeof data.content[j].value.start !== "undefined") {
                                                row.push("start:" + BuzzyGlobal.gFormatDate(data.content[j].value.start, currField.option.format, resource.content.timezone) + " end:" + BuzzyGlobal.gFormatDate(data.content[j].value.end, currField.option.format, resource.content.timezone));
                                            } else {                                                                   // 1937
                                                row.push(BuzzyGlobal.gFormatDate(data.content[j].value, currField.option.format, resource.content.timezone));
                                            }                                                                          // 1939
                                                                                                                       //
                                            break;                                                                     // 1942
                                        case BuzzyGlobal.gAPPFIELDTYPE.EVENT:                                          // 1943
                                            tempEvent = "";                                                            // 1944
                                            if (data.content[j].value && typeof data.content[j].value.start !== "undefined") {
                                                tempEvent = "start:" + BuzzyGlobal.gFormatDate(data.content[j].value.start, currField.option.format, resource.content.timezone) + " end:" + BuzzyGlobal.gFormatDate(data.content[j].value.end, currField.option.format, resource.content.timezone);
                                            }                                                                          // 1947
                                            if (typeof data.content[j].value.title !== "undefined") {                  // 1948
                                                tempEvent = tempEvent + "title:" + data.content[j].value.title;        // 1949
                                            }                                                                          // 1950
                                            if (typeof data.content[j].value.location !== "undefined" && typeof data.content[j].value.location.formatted_address !== "undefined") {
                                                tempEvent = tempEvent + " location:" + data.content[j].value.location.formatted_address;
                                            }                                                                          // 1953
                                            row.push(tempEvent);                                                       // 1954
                                            break;                                                                     // 1955
                                        case BuzzyGlobal.gAPPFIELDTYPE.ATTACHMENTS:                                    // 1956
                                            var attachments = "";                                                      // 1957
                                            for (k in meteorBabelHelpers.sanitizeForInObject(data.content[j].value)) {
                                                if (data.content[j].value[k].url && typeof data.content[j].value[k].url !== "undefined") {
                                                    attachments = attachments + " " + data.content[j].value[k].url;    // 1960
                                                }                                                                      // 1961
                                            }                                                                          // 1963
                                            row.push(attachments);                                                     // 1964
                                            break;                                                                     // 1965
                                        case BuzzyGlobal.gAPPFIELDTYPE.SUBMITTED:                                      // 1966
                                            row.push(moment(data.submitted).format());                                 // 1967
                                            break;                                                                     // 1968
                                        case BuzzyGlobal.gAPPFIELDTYPE.AUTHOR:                                         // 1969
                                            row.push(data.author);                                                     // 1970
                                            break;                                                                     // 1971
                                        default:                                                                       // 1972
                                            row.push(data.content[j].value);                                           // 1973
                                    }                                                                                  // 1933
                                }                                                                                      // 1976
                            }                                                                                          // 1978
                        });                                                                                            // 1979
                                                                                                                       //
                        return row;                                                                                    // 1982
                    });                                                                                                // 1984
                }                                                                                                      // 1985
                                                                                                                       //
                return {                                                                                               // 1988
                    fields: fieldsArray,                                                                               // 1989
                    data: appData                                                                                      // 1990
                };                                                                                                     // 1988
            }                                                                                                          // 1993
                                                                                                                       //
            return microAppCSV;                                                                                        // 1913
        }(),                                                                                                           // 1913
        viewedResourceSummary: function () {                                                                           // 1994
            function viewedResourceSummary(resourceID) {                                                               // 1994
                if (resourceID) {                                                                                      // 1995
                    BuzzyLogging.call("viewedResourceSummary", resourceID, function (err, result) {                    // 1996
                        if (err) {                                                                                     // 1997
                            BuzzyGlobal.throwError(err);                                                               // 1998
                        } else {                                                                                       // 1999
                            return result;                                                                             // 2000
                        }                                                                                              // 2001
                    });                                                                                                // 2002
                }                                                                                                      // 2003
            }                                                                                                          // 2004
                                                                                                                       //
            return viewedResourceSummary;                                                                              // 1994
        }(),                                                                                                           // 1994
        resourceViewedByUser: function () {                                                                            // 2005
            function resourceViewedByUser(resourceID) {                                                                // 2005
                if (resourceID) {                                                                                      // 2006
                    BuzzyLogging.call("viewedResourceByUser", resourceID, function (err, result) {                     // 2007
                        if (err) {                                                                                     // 2008
                            BuzzyGlobal.throwError(err);                                                               // 2009
                        } else {                                                                                       // 2010
                            return result;                                                                             // 2011
                        }                                                                                              // 2012
                    });                                                                                                // 2013
                }                                                                                                      // 2014
            }                                                                                                          // 2015
                                                                                                                       //
            return resourceViewedByUser;                                                                               // 2005
        }(),                                                                                                           // 2005
        resourceTrackUserView: function () {                                                                           // 2016
            function resourceTrackUserView(userID, resourceID) {                                                       // 2016
                                                                                                                       //
                /* if (typeof userID === "undefined" || !userID){                                                      // 2019
                 BuzzyGlobal.throwError("Invalid User!")                                                               //
                 }                                                                                                     //
                 if (typeof resourceID === "undefined" || !resourceID){                                                //
                 BuzzyGlobal.throwError("Invalid Resource!")                                                           //
                 }*/                                                                                                   //
                var user = Users.findOne({ _id: userID });                                                             // 2025
                var resource = Resources.findOne({ _id: resourceID });                                                 // 2026
                                                                                                                       //
                if (user && resource && resource.resourceAnalyticsOn) {                                                // 2028
                    BuzzyLogging.call("trackEmail", {                                                                  // 2029
                        action: "view",                                                                                // 2030
                        "resourceID": resource._id,                                                                    // 2031
                        "userID": user._id,                                                                            // 2032
                        "buzzTitle": resource.title,                                                                   // 2033
                        "completedSetup": user.completedSetup ? user.completedSetup : false                            // 2034
                    });                                                                                                // 2029
                }                                                                                                      // 2036
            }                                                                                                          // 2039
                                                                                                                       //
            return resourceTrackUserView;                                                                              // 2016
        }(),                                                                                                           // 2016
        updateResourcePayment: function () {                                                                           // 2040
            function updateResourcePayment(resourceID, payment) {                                                      // 2040
                var resource = Resources.findOne({ _id: resourceID });                                                 // 2041
                                                                                                                       //
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 2043
                    Resources.update({ _id: resource._id }, { $set: { "content.payment": payment } }, function (err) {
                        if (err) {                                                                                     // 2045
                            BuzzyGlobal.throwError("Error updating payment info:", err);                               // 2046
                        }                                                                                              // 2047
                    });                                                                                                // 2048
                }                                                                                                      // 2049
                ;                                                                                                      // 2050
            }                                                                                                          // 2053
                                                                                                                       //
            return updateResourcePayment;                                                                              // 2040
        }(),                                                                                                           // 2040
        updateResourceContent: function () {                                                                           // 2054
            function updateResourceContent(resourceID, content) {                                                      // 2054
                var resource = Resources.findOne({ _id: resourceID });                                                 // 2055
                                                                                                                       //
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 2057
                    Resources.update({ _id: resource._id }, { $set: { "content": content } }, function (err) {         // 2058
                        if (err) {                                                                                     // 2059
                            BuzzyGlobal.throwError("Error updating payment info:", err);                               // 2060
                        }                                                                                              // 2061
                    });                                                                                                // 2062
                }                                                                                                      // 2063
                ;                                                                                                      // 2064
            }                                                                                                          // 2067
                                                                                                                       //
            return updateResourceContent;                                                                              // 2054
        }(),                                                                                                           // 2054
        updateResourcePaymentButtonHelp: function () {                                                                 // 2068
            function updateResourcePaymentButtonHelp(resourceID, updateText) {                                         // 2068
                var resource = Resources.findOne({ _id: resourceID });                                                 // 2069
                                                                                                                       //
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 2071
                    Resources.update({ _id: resource._id }, { $set: { "content.buttonHelp": updateText } }, function (err) {
                        if (err) {                                                                                     // 2073
                            BuzzyGlobal.throwError("Error updating payment info:", err);                               // 2074
                        }                                                                                              // 2075
                    });                                                                                                // 2076
                }                                                                                                      // 2077
                ;                                                                                                      // 2078
            }                                                                                                          // 2081
                                                                                                                       //
            return updateResourcePaymentButtonHelp;                                                                    // 2068
        }(),                                                                                                           // 2068
        updateResourcePaymentButtonText: function () {                                                                 // 2082
            function updateResourcePaymentButtonText(resourceID, updateText) {                                         // 2082
                var resource = Resources.findOne({ _id: resourceID });                                                 // 2083
                                                                                                                       //
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 2085
                    Resources.update({ _id: resource._id }, { $set: { "content.label": updateText } }, function (err) {
                        if (err) {                                                                                     // 2087
                            BuzzyGlobal.throwError("Error updating payment info:", err);                               // 2088
                        }                                                                                              // 2089
                    });                                                                                                // 2090
                }                                                                                                      // 2091
                ;                                                                                                      // 2092
            }                                                                                                          // 2095
                                                                                                                       //
            return updateResourcePaymentButtonText;                                                                    // 2082
        }(),                                                                                                           // 2082
        updateResourcePaymentButtonStyle: function () {                                                                // 2096
            function updateResourcePaymentButtonStyle(resourceID, updateText) {                                        // 2096
                var resource = Resources.findOne({ _id: resourceID });                                                 // 2097
                                                                                                                       //
                if (resource && Resources.canEdit(Meteor.userId(), resource)) {                                        // 2099
                    Resources.update({ _id: resource._id }, { $set: { "content.style": updateText } }, function (err) {
                        if (err) {                                                                                     // 2101
                            BuzzyGlobal.throwError("Error updating payment info:", err);                               // 2102
                        }                                                                                              // 2103
                    });                                                                                                // 2104
                }                                                                                                      // 2105
                ;                                                                                                      // 2106
            }                                                                                                          // 2109
                                                                                                                       //
            return updateResourcePaymentButtonStyle;                                                                   // 2096
        }(),                                                                                                           // 2096
        resourceCopyMicroApp: function () {                                                                            // 2110
            function resourceCopyMicroApp(srcResourceID, newResourceID, topParentID, oldVsNewFieldIDs, optUserToken) {
                var user = BuzzyGlobal.getCurrentUser(optUserToken);                                                   // 2111
                if (!user) {                                                                                           // 2112
                    BuzzyGlobal.throwError("You do not have the permission to do that!");                              // 2113
                }                                                                                                      // 2114
                if (user && srcResourceID) {                                                                           // 2115
                    var resource = Resources.findOne({ _id: srcResourceID });                                          // 2116
                    if (resource && Resources.canView(user._id, resource)) {                                           // 2117
                        MicroAppData.duplicateMicroAppData(srcResourceID, newResourceID, oldVsNewFieldIDs, optUserToken);
                    } else {                                                                                           // 2119
                        BuzzyGlobal.throwError("You don't have permission to do that!");                               // 2120
                    }                                                                                                  // 2121
                }                                                                                                      // 2123
            }                                                                                                          // 2124
                                                                                                                       //
            return resourceCopyMicroApp;                                                                               // 2110
        }(),                                                                                                           // 2110
        getCommentToList: function () {                                                                                // 2125
            function getCommentToList(resourceID, optUserToken) {                                                      // 2125
                check(resourceID, String);                                                                             // 2126
                var user = BuzzyGlobal.getCurrentUser(optUserToken);                                                   // 2127
                                                                                                                       //
                if (user && resourceID) {                                                                              // 2129
                    var resource = Resources.findOne({ _id: resourceID });                                             // 2130
                    if (resource && Resources.canView(user._id, resource)) {                                           // 2131
                        var currentParticipants = _.without(resource.readers.concat(resource.editors, resource.owners), Meteor.userId());
                        var participantsWithNames = [];                                                                // 2133
                                                                                                                       //
                        var currentUsersArray = Users.find({ _id: { $in: currentParticipants } }).map(function (user) {
                            return { _id: user._id, name: BuzzyGlobal.gGetUserName(user) };                            // 2137
                        });                                                                                            // 2138
                                                                                                                       //
                        console.log("initialize currentParticipants", currentParticipants, "currentUsersArray:", currentUsersArray);
                        return currentUsersArray;                                                                      // 2141
                    } else {                                                                                           // 2142
                        BuzzyGlobal.throwError("You don't have permission to do that!");                               // 2143
                    }                                                                                                  // 2144
                }                                                                                                      // 2146
            }                                                                                                          // 2148
                                                                                                                       //
            return getCommentToList;                                                                                   // 2125
        }(),                                                                                                           // 2125
        checkValidLicense: function () {                                                                               // 2149
            function checkValidLicense(resourceID, optUserToken) {                                                     // 2149
                check(resourceID, String);                                                                             // 2150
                var user = BuzzyGlobal.getCurrentUser(optUserToken);                                                   // 2151
                                                                                                                       //
                if (user && resourceID) {                                                                              // 2153
                    var resource = Resources.findOne({ _id: resourceID });                                             // 2154
                    if (resource && Resources.canView(user._id, resource)) {                                           // 2155
                                                                                                                       //
                        var ownerAuthorsArray = resource.editors.concat(resource.owners);                              // 2158
                        if (ownerAuthorsArray.indexOf(user._id) !== -1 && ownerAuthorsArray.length > 1) {              // 2159
                            if (user.subscriptionID) {                                                                 // 2160
                                if (BuzzyLogging && BuzzyLogging.status().connected) {                                 // 2161
                                    BuzzyLogging.call("track", {                                                       // 2162
                                        action: "checkValidLicense",                                                   // 2163
                                        resourceID: resourceID,                                                        // 2164
                                        userID: user._id,                                                              // 2165
                                        status: true                                                                   // 2166
                                    }, Meteor.settings.BUZZY_LOGGING_TOKEN);                                           // 2162
                                }                                                                                      // 2168
                                                                                                                       //
                                return true;                                                                           // 2170
                            } else {                                                                                   // 2171
                                if (BuzzyLogging && BuzzyLogging.status().connected) {                                 // 2172
                                    BuzzyLogging.call("track", {                                                       // 2173
                                        action: "checkValidLicense",                                                   // 2174
                                        resourceID: resourceID,                                                        // 2175
                                        userID: user._id,                                                              // 2176
                                        status: false                                                                  // 2177
                                    }, Meteor.settings.BUZZY_LOGGING_TOKEN);                                           // 2173
                                }                                                                                      // 2179
                                                                                                                       //
                                return false;                                                                          // 2181
                            }                                                                                          // 2182
                        } else {                                                                                       // 2184
                            if (BuzzyLogging && BuzzyLogging.status().connected) {                                     // 2185
                                BuzzyLogging.call("track", {                                                           // 2186
                                    action: "checkValidLicense",                                                       // 2187
                                    resourceID: resourceID,                                                            // 2188
                                    userID: user._id,                                                                  // 2189
                                    status: true                                                                       // 2190
                                }, Meteor.settings.BUZZY_LOGGING_TOKEN);                                               // 2186
                            }                                                                                          // 2192
                                                                                                                       //
                            return true;                                                                               // 2194
                        }                                                                                              // 2196
                    } else {                                                                                           // 2198
                        BuzzyGlobal.throwError("You don't have permission to do that!");                               // 2199
                    }                                                                                                  // 2200
                }                                                                                                      // 2202
            }                                                                                                          // 2204
                                                                                                                       //
            return checkValidLicense;                                                                                  // 2149
        }(),                                                                                                           // 2149
        addWatsonCredential: function () {                                                                             // 2205
            function addWatsonCredential(resourceID, optUserToken) {                                                   // 2205
                check(resourceID, String);                                                                             // 2206
                var user = BuzzyGlobal.getCurrentUser(optUserToken);                                                   // 2207
                                                                                                                       //
                if (user && resourceID) {                                                                              // 2209
                    var resource = Resources.findOne({ _id: resourceID });                                             // 2210
                    if (resource && Resources.canEdit(user._id, resource)) {                                           // 2211
                        var newCred = {                                                                                // 2212
                            _id: new Meteor.Collection.ObjectID()._str,                                                // 2213
                            watsonAtID: '',                                                                            // 2214
                            watsonUserID: '',                                                                          // 2215
                            watsonPassword: '',                                                                        // 2216
                            watsonWorkspaceID: ''                                                                      // 2217
                                                                                                                       //
                        };                                                                                             // 2212
                        var watsonCreds = resource.watsonCreds;                                                        // 2220
                        if (watsonCreds) {                                                                             // 2221
                            watsonCreds.push(newCred);                                                                 // 2222
                        } else {                                                                                       // 2224
                            watsonCreds = [newCred];                                                                   // 2225
                        }                                                                                              // 2226
                        Resources.update({ _id: resourceID }, { $set: { watsonCreds: watsonCreds } }, function (error) {
                                                                                                                       //
                            if (error) {                                                                               // 2233
                                // display the error to the user - Need to come back to fix 422 (not sure what # it should be???) as the error number
                                throw new Meteor.Error(422, error.reason);                                             // 2235
                            } else {                                                                                   // 2236
                                console.log('added Watson Creds', watsonCreds);                                        // 2237
                            }                                                                                          // 2238
                        });                                                                                            // 2239
                    }                                                                                                  // 2241
                }                                                                                                      // 2243
            }                                                                                                          // 2244
                                                                                                                       //
            return addWatsonCredential;                                                                                // 2205
        }(),                                                                                                           // 2205
        updateWatsonCredentials: function () {                                                                         // 2245
            function updateWatsonCredentials(resourceID, watsonItemID, creds, optUserToken) {                          // 2245
                check(resourceID, String);                                                                             // 2246
                var user = BuzzyGlobal.getCurrentUser(optUserToken);                                                   // 2247
                                                                                                                       //
                if (user && resourceID) {                                                                              // 2249
                    var resource = Resources.findOne({ _id: resourceID });                                             // 2250
                    if (resource && Resources.canEdit(user._id, resource)) {                                           // 2251
                        /*const credential = {};                                                                       // 2252
                        credential[fieldName] = fieldVal;*/                                                            //
                        console.log('UPDATE CREDS', watsonItemID, creds);                                              // 2254
                                                                                                                       //
                        Resources.update({ _id: resourceID, "watsonCreds._id": watsonItemID }, { $set: { "watsonCreds.$": creds } }, function (error) {
                                                                                                                       //
                            if (error) {                                                                               // 2262
                                // display the error to the user - Need to come back to fix 422 (not sure what # it should be???) as the error number
                                throw new Meteor.Error(422, error.reason);                                             // 2264
                            } else {                                                                                   // 2265
                                console.log('updated Watson Creds', creds);                                            // 2266
                            }                                                                                          // 2267
                        });                                                                                            // 2268
                    }                                                                                                  // 2270
                }                                                                                                      // 2272
            }                                                                                                          // 2273
                                                                                                                       //
            return updateWatsonCredentials;                                                                            // 2245
        }()                                                                                                            // 2245
                                                                                                                       //
    });                                                                                                                // 910
}                                                                                                                      // 2278
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"server":{"notifications.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/buzzy-buzz_resources-core/server/notifications.js                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**                                                                                                                    // 1
 * Created by adamginsburg on 9/12/2014.                                                                               //
 */                                                                                                                    //
                                                                                                                       //
if (Meteor.isServer) {                                                                                                 // 5
    Notifications.createAnonymousPaymentNotification = function (recipientUserID, parentResourceID, action, activity) {
        var self = this;                                                                                               // 7
                                                                                                                       //
        if (!recipientUserID || !parentResourceID || !activity) {                                                      // 9
            throw BuzzyGlobal.throwError("Invalid Params");                                                            // 10
        }                                                                                                              // 11
        var resource = Resources.findOne({ _id: parentResourceID }); // come back to look at children notifications later, for now do for parent
        var emailRecipients = [];                                                                                      // 13
                                                                                                                       //
        if (!resource) {                                                                                               // 16
            BuzzyGlobal.throwError("Resource not found: " + parentResourceID);                                         // 17
        }                                                                                                              // 18
                                                                                                                       //
        if (recipientUserID && typeof recipientUserID !== "undefined") {                                               // 22
            Notifications.insert({                                                                                     // 23
                _id: new Meteor.Collection.ObjectID()._str,                                                            // 24
                forUserID: recipientUserID,                                                                            // 25
                byUserID: null,                                                                                        // 26
                action: action,                                                                                        // 27
                target: parentResourceID,                                                                              // 28
                activity: activity,                                                                                    // 29
                //resourceID: resource._id,                                                                            // 30
                resourceID: resource._id, // insert for parent not actual resource ID, may need to come back to this   // 31
                commentID: null,                                                                                       // 32
                commenterName: activity.actor.displayName,                                                             // 33
                read: false,                                                                                           // 34
                submitted: new Date().getTime()                                                                        // 35
            });                                                                                                        // 23
        }                                                                                                              // 38
                                                                                                                       //
        var msgText = "transfered " + activity.object.currency + " " + BuzzyGlobal.formatCurrency(activity.object.amount / 100) + " #" + activity.object.receipt_number;
                                                                                                                       //
        if (recipientUserID && typeof recipientUserID !== "undefined") {                                               // 45
            Push.send({                                                                                                // 46
                from: activity.actor.displayName,                                                                      // 47
                title: "Some title",                                                                                   // 48
                text: msgText,                                                                                         // 49
                badge: Meteor.call("gNotificationsUnreadForUserID", recipientUserID), // get notifications count for user
                sound: 'yes',                                                                                          // 51
                query: {                                                                                               // 52
                    userId: recipientUserID                                                                            // 53
                }                                                                                                      // 52
                                                                                                                       //
            });                                                                                                        // 46
                                                                                                                       //
            Notifications.sendResourceNotifications(self.connection, recipientUserID, [recipientUserID], parentResourceID, [], true, function (error, id) {
                if (error) {                                                                                           // 62
                                                                                                                       //
                    console.log("sendNotification error:", error);                                                     // 64
                    //throw new Meteor.Error(422, error.reason);                                                       // 65
                    BuzzyGlobal.throwError(error);                                                                     // 66
                }                                                                                                      // 67
            });                                                                                                        // 68
        }                                                                                                              // 69
    };                                                                                                                 // 73
    Notifications.sendNotifications = function (userID, recipients, emailMessage, topResourceID, resourceParentID, commentID, callback) {
                                                                                                                       //
        if (!commentID || typeof commentID === "undefined" || commentID === null) {                                    // 76
            BuzzyGlobal.throwError("Invalid Comment ID: " + commentID);                                                // 77
        }                                                                                                              // 78
        if (!userID) {                                                                                                 // 79
            BuzzyGlobal.throwError("Invalid User ID");                                                                 // 80
        }                                                                                                              // 81
        var user = Users.findOne(userID);                                                                              // 82
        if (!user) {                                                                                                   // 83
            BuzzyGlobal.throwError("Can't find user");                                                                 // 84
        }                                                                                                              // 85
        if (!recipients) {                                                                                             // 86
            BuzzyGlobal.throwError("Invalid recipients");                                                              // 87
        }                                                                                                              // 88
                                                                                                                       //
        var userEmail = BuzzyGlobal.gGetUserFormattedEmail(user);                                                      // 92
        var usersToEmail = [];                                                                                         // 93
        var usersToSMS = [];                                                                                           // 94
                                                                                                                       //
        var usersCursor = Meteor.users.find({ _id: { $in: recipients } });                                             // 96
                                                                                                                       //
        var usersToNotify = usersCursor.forEach(function (user) {                                                      // 98
            if (user && user._id != userID && !Users.isBot(user)) {                                                    // 99
                if (typeof user.profile.channels !== "undefined") {                                                    // 100
                    for (i in meteorBabelHelpers.sanitizeForInObject(user.profile.channels)) {                         // 101
                        switch (user.profile.channels[i].channel) {                                                    // 102
                            case BuzzyGlobal.gNOTIFICATION_CHANNEL.EMAIL:                                              // 103
                                // don't check verified if (user.profile.channels[i].enabled && BuzzyGlobal.gEmailIsVerified(user, user.profile.channels[i].address)){
                                var tempToken = null;                                                                  // 105
                                if (user.services && user.services.password && user.services.password && user.services.password.reset) {
                                    tempToken = user.services.password.reset.token;                                    // 107
                                };                                                                                     // 108
                                if (user.profile.channels[i].enabled) {                                                // 109
                                    usersToEmail.push({                                                                // 110
                                        _id: user._id,                                                                 // 111
                                        email: user.profile.channels[i].address,                                       // 112
                                        completedSetup: user.completedSetup,                                           // 113
                                        token: tempToken                                                               // 114
                                    });                                                                                // 110
                                }                                                                                      // 116
                                break;                                                                                 // 117
                            case BuzzyGlobal.gNOTIFICATION_CHANNEL.SMS:                                                // 118
                                if (user.profile.channels[i].enabled) {                                                // 119
                                    usersToSMS.push(user.profile.channels[i].address);                                 // 120
                                };                                                                                     // 121
                                break;                                                                                 // 122
                        }                                                                                              // 102
                    }                                                                                                  // 124
                }                                                                                                      // 125
            }                                                                                                          // 126
        });                                                                                                            // 128
        var resource = Resources.findOne({ _id: topResourceID });                                                      // 129
        var comment = Comments.findOne({ _id: commentID });                                                            // 130
        if (!resource || !comment) {                                                                                   // 131
            BuzzyGlobal.throwError("Invalid Resource/Comment");                                                        // 132
        }                                                                                                              // 133
                                                                                                                       //
        if (usersToEmail.length > 0) {                                                                                 // 135
            for (i in meteorBabelHelpers.sanitizeForInObject(usersToEmail)) {                                          // 136
                                                                                                                       //
                try {                                                                                                  // 139
                                                                                                                       //
                    Mailer.send({                                                                                      // 141
                        to: usersToEmail[i].email, // 'To: ' address. Required.                                        // 142
                        subject: "[Buzzy] " + resource.title, // Required.                                             // 143
                        template: 'commentNotification', // Required.                                                  // 144
                        replyTo: BuzzyGlobal.gGetUserName(user) + " " + topResourceID + "." + resourceParentID + "." + userID + "@" + Meteor.settings.MAIL_INCOMING_DOMAIN, // Override global 'ReplyTo: ' option.
                        //from: 'Buzzy <info@buzzy.buzz>',         // Override global 'From: ' option.                 // 146
                        from: BuzzyGlobal.gGetUserName(user) + " " + "notifications@buzzy.buzz", // Override global 'From: ' option.
                        data: {                                                                                        // 148
                            comment: comment,                                                                          // 149
                            toUserEmail: usersToEmail[i].email,                                                        // 150
                            completedSetup: usersToEmail[i].completedSetup,                                            // 151
                            toUserID: usersToEmail[i]._id,                                                             // 152
                            token: usersToEmail[i].token,                                                              // 153
                            fromUserID: user._id                                                                       // 154
                        }                                                                                              // 148
                    });                                                                                                // 141
                } catch (err) {                                                                                        // 157
                    BuzzyGlobal.throwError(err);                                                                       // 158
                }                                                                                                      // 159
            }                                                                                                          // 164
        }                                                                                                              // 166
                                                                                                                       //
        if (usersToSMS.length > 0) {                                                                                   // 168
                                                                                                                       //
            Meteor.call("sendSMSTwilio", usersToSMS, "New Buzz " + Meteor.absoluteUrl("go/" + topResourceID), function (error) {
                if (error) {                                                                                           // 171
                                                                                                                       //
                    throw new Meteor.Error(422, error.reason);                                                         // 173
                }                                                                                                      // 174
            });                                                                                                        // 176
        }                                                                                                              // 178
    };                                                                                                                 // 180
                                                                                                                       //
    Notifications.sendResourceNotifications = function (thisConnection, userID, recipients, resourceID, optResourceChangeList, isNew, callback) {
        var self = this;                                                                                               // 184
        if (!userID) {                                                                                                 // 185
            BuzzyGlobal.throwError("Invalid User ID");                                                                 // 186
        } else {                                                                                                       // 187
            var user = Users.findOne(userID);                                                                          // 188
            if (!user) {                                                                                               // 189
                BuzzyGlobal.throwError("Can't find user");                                                             // 190
            }                                                                                                          // 191
        }                                                                                                              // 192
        if (!recipients) {                                                                                             // 193
            BuzzyGlobal.throwError("Invalid Recipients");                                                              // 194
        }                                                                                                              // 195
        var userEmail = BuzzyGlobal.gGetUserFormattedEmail(user);                                                      // 196
        var usersToEmail = [];                                                                                         // 197
        var usersToSMS = [];                                                                                           // 198
                                                                                                                       //
        var usersCursor = Meteor.users.find({ _id: { $in: recipients } });                                             // 200
                                                                                                                       //
        var usersToNotify = usersCursor.forEach(function (user) {                                                      // 203
            if (user._id != userID && !Users.isBot(user)) {                                                            // 204
                if (typeof user.profile.channels !== "undefined") {                                                    // 205
                    for (i in meteorBabelHelpers.sanitizeForInObject(user.profile.channels)) {                         // 206
                        switch (user.profile.channels[i].channel) {                                                    // 207
                            case BuzzyGlobal.gNOTIFICATION_CHANNEL.EMAIL:                                              // 208
                                // don't check verified - if (user.profile.channels[i].enabled && BuzzyGlobal.gEmailIsVerified(user, user.profile.channels[i].address)){
                                var tempToken = null;                                                                  // 210
                                if (user.services && user.services.password && user.services.password && user.services.password.reset) {
                                    tempToken = user.services.password.reset.token;                                    // 212
                                };                                                                                     // 213
                                if (user.profile.channels[i].enabled) {                                                // 214
                                    usersToEmail.push({                                                                // 215
                                        _id: user._id,                                                                 // 216
                                        email: user.profile.channels[i].address,                                       // 217
                                        completedSetup: user.completedSetup,                                           // 218
                                        token: tempToken                                                               // 219
                                    });                                                                                // 215
                                }                                                                                      // 221
                                break;                                                                                 // 222
                            case BuzzyGlobal.gNOTIFICATION_CHANNEL.SMS:                                                // 223
                                if (user.profile.channels[i].enabled) {                                                // 224
                                    usersToSMS.push(user.profile.channels[i].address);                                 // 225
                                };                                                                                     // 226
                                break;                                                                                 // 227
                                                                                                                       //
                        }                                                                                              // 207
                    }                                                                                                  // 230
                }                                                                                                      // 232
            }                                                                                                          // 234
        });                                                                                                            // 237
                                                                                                                       //
        if (usersToEmail.length > 0) {                                                                                 // 240
                                                                                                                       //
            var resource = Resources.findOne({ _id: resourceID });                                                     // 242
            var searchExpression = new RegExp("^," + resourceID + ",");                                                // 243
            // currently trusing user can access all published content for resource                                    // 244
            var resourceList;                                                                                          // 245
            console.log("optResourceChangeList", optResourceChangeList);                                               // 246
            if (typeof optResourceChangeList === "undefined" || optResourceChangeList.length === 0) {                  // 247
                resourceList = [resourceID];                                                                           // 248
            } else {                                                                                                   // 250
                resourceList = optResourceChangeList;                                                                  // 251
            };                                                                                                         // 252
                                                                                                                       //
            for (i in meteorBabelHelpers.sanitizeForInObject(usersToEmail)) {                                          // 255
                                                                                                                       //
                try {                                                                                                  // 258
                                                                                                                       //
                    var replyTo = 'donotreply@buzzy.buzz';                                                             // 260
                    var from = "Do Not Reply" + "<donotreply@buzzy.buzz>";                                             // 261
                                                                                                                       //
                    if (resource.showComments === BuzzyGlobal.gCOMMENTSHOW.INLINE) {                                   // 263
                        replyTo = BuzzyGlobal.gGetUserName(user) + " " + resource._id + "." + resource._id + "." + Meteor.userId() + "@" + Meteor.settings.MAIL_INCOMING_DOMAIN; // Override global 'ReplyTo: ' option.
                        //from: 'Buzzy <info@buzzy.buzz>',         // Override global 'From: ' option                  // 265
                        from = BuzzyGlobal.gGetUserName(user) + " " + "notifications@buzzy.buzz";                      // 266
                    }                                                                                                  // 267
                                                                                                                       //
                    var result = Mailer.send({                                                                         // 269
                        to: usersToEmail[i].email, // 'To: ' address. Required.                                        // 270
                        subject: "[Buzzy] " + resource.title, // Required.                                             // 271
                        //template: 'templateName',               // Required.                                         // 272
                        template: 'resourceNotification', // Required.                                                 // 273
                        replyTo: replyTo, // Override global 'ReplyTo: ' option.                                       // 274
                        from: from, // Override global 'From: ' option.                                                // 275
                        data: {                                                                                        // 276
                            toUserEmail: usersToEmail[i].email,                                                        // 277
                            completedSetup: usersToEmail[i].completedSetup,                                            // 278
                            toUserID: usersToEmail[i]._id,                                                             // 279
                            token: usersToEmail[i].token,                                                              // 280
                            resource: resource,                                                                        // 281
                            resourceIDs: resourceList,                                                                 // 282
                            currentUserID: userID,                                                                     // 283
                            isNew: isNew,                                                                              // 284
                            fromUserID: user._id                                                                       // 285
                            //generatedToken: generatedToken                                                           // 286
                                                                                                                       //
                        }                                                                                              // 276
                    });                                                                                                // 269
                    console.log("MAILER RESULT:" + result);                                                            // 290
                } catch (err) {                                                                                        // 291
                    BuzzyGlobal.throwError(err);                                                                       // 292
                }                                                                                                      // 293
            }                                                                                                          // 298
        }                                                                                                              // 300
                                                                                                                       //
        if (usersToSMS.length > 0) {                                                                                   // 302
                                                                                                                       //
            Meteor.call("sendSMSTwilio", usersToSMS, "New Buzz " + Meteor.absoluteUrl("go/" + resourceID), function (error) {
                if (error) {                                                                                           // 305
                                                                                                                       //
                    throw new Meteor.Error(422, error.reason);                                                         // 307
                }                                                                                                      // 308
            });                                                                                                        // 310
        }                                                                                                              // 312
    };                                                                                                                 // 314
                                                                                                                       //
    Notifications.sendMicroAppNotifications = function (thisConnection, userID, recipients, resourceID, optResourceChangeList, isNew, customMessage, microAppRowID, callback) {
        var self = this;                                                                                               // 317
        if (!userID) {                                                                                                 // 318
            BuzzyGlobal.throwError("Invalid User ID");                                                                 // 319
        } else {                                                                                                       // 320
            var user = Users.findOne(userID);                                                                          // 321
            if (!user) {                                                                                               // 322
                BuzzyGlobal.throwError("Can't find user");                                                             // 323
            }                                                                                                          // 324
        }                                                                                                              // 325
        if (!recipients) {                                                                                             // 326
            BuzzyGlobal.throwError("Invalid Recipients");                                                              // 327
        }                                                                                                              // 328
        var userEmail = BuzzyGlobal.gGetUserFormattedEmail(user);                                                      // 329
        var usersToEmail = [];                                                                                         // 330
        var usersToSMS = [];                                                                                           // 331
                                                                                                                       //
        var usersCursor = Meteor.users.find({ _id: { $in: recipients } });                                             // 333
                                                                                                                       //
        var usersToNotify = usersCursor.forEach(function (user) {                                                      // 336
            if (user._id != userID) {                                                                                  // 337
                if (typeof user.profile.channels !== "undefined") {                                                    // 338
                    for (i in meteorBabelHelpers.sanitizeForInObject(user.profile.channels)) {                         // 339
                        switch (user.profile.channels[i].channel) {                                                    // 340
                            case BuzzyGlobal.gNOTIFICATION_CHANNEL.EMAIL:                                              // 341
                                // don't check verified - if (user.profile.channels[i].enabled && BuzzyGlobal.gEmailIsVerified(user, user.profile.channels[i].address)){
                                var tempToken = null;                                                                  // 343
                                if (user.services && user.services.password && user.services.password && user.services.password.reset) {
                                    tempToken = user.services.password.reset.token;                                    // 345
                                };                                                                                     // 346
                                if (user.profile.channels[i].enabled) {                                                // 347
                                    usersToEmail.push({                                                                // 348
                                        _id: user._id,                                                                 // 349
                                        email: user.profile.channels[i].address,                                       // 350
                                        completedSetup: user.completedSetup,                                           // 351
                                        token: tempToken                                                               // 352
                                    });                                                                                // 348
                                }                                                                                      // 354
                                break;                                                                                 // 355
                            case BuzzyGlobal.gNOTIFICATION_CHANNEL.SMS:                                                // 356
                                if (user.profile.channels[i].enabled) {                                                // 357
                                    usersToSMS.push(user.profile.channels[i].address);                                 // 358
                                };                                                                                     // 359
                                break;                                                                                 // 360
                                                                                                                       //
                        }                                                                                              // 340
                    }                                                                                                  // 363
                }                                                                                                      // 365
            }                                                                                                          // 367
        });                                                                                                            // 370
                                                                                                                       //
        if (usersToEmail.length > 0) {                                                                                 // 373
                                                                                                                       //
            var resource = Resources.findOne({ _id: resourceID });                                                     // 375
            var searchExpression = new RegExp("^," + resourceID + ",");                                                // 376
            // currently trusing user can access all published content for resource                                    // 377
            var resourceList;                                                                                          // 378
            console.log("optResourceChangeList", optResourceChangeList);                                               // 379
            if (typeof optResourceChangeList === "undefined" || optResourceChangeList.length === 0) {                  // 380
                resourceList = [resourceID];                                                                           // 381
            } else {                                                                                                   // 383
                resourceList = optResourceChangeList;                                                                  // 384
            };                                                                                                         // 385
                                                                                                                       //
            for (i in meteorBabelHelpers.sanitizeForInObject(usersToEmail)) {                                          // 388
                                                                                                                       //
                try {                                                                                                  // 391
                                                                                                                       //
                    var replyTo = 'donotreply@buzzy.buzz';                                                             // 393
                    var from = "Do Not Reply" + "<donotreply@buzzy.buzz>";                                             // 394
                                                                                                                       //
                    if (resource.showComments === BuzzyGlobal.gCOMMENTSHOW.INLINE) {                                   // 396
                        replyTo = BuzzyGlobal.gGetUserName(user) + " " + resource._id + "." + resource._id + "." + Meteor.userId() + "@" + Meteor.settings.MAIL_INCOMING_DOMAIN; // Override global 'ReplyTo: ' option.
                        //from: 'Buzzy <info@buzzy.buzz>',         // Override global 'From: ' option                  // 398
                        from = BuzzyGlobal.gGetUserName(user) + " " + "notifications@buzzy.buzz";                      // 399
                    }                                                                                                  // 400
                                                                                                                       //
                    var result = Mailer.send({                                                                         // 402
                        to: usersToEmail[i].email, // 'To: ' address. Required.                                        // 403
                        subject: customMessage, // Required.                                                           // 404
                        //template: 'templateName',               // Required.                                         // 405
                        template: 'microAppNotification', // Required.                                                 // 406
                        replyTo: replyTo, // Override global 'ReplyTo: ' option.                                       // 407
                        from: from, // Override global 'From: ' option.                                                // 408
                        data: {                                                                                        // 409
                            toUserEmail: usersToEmail[i].email,                                                        // 410
                            completedSetup: usersToEmail[i].completedSetup,                                            // 411
                            toUserID: usersToEmail[i]._id,                                                             // 412
                            token: usersToEmail[i].token,                                                              // 413
                            resource: resource,                                                                        // 414
                            resourceIDs: resourceList,                                                                 // 415
                            currentUserID: userID,                                                                     // 416
                            isNew: isNew,                                                                              // 417
                            fromUserID: user._id,                                                                      // 418
                            microAppRowID: microAppRowID                                                               // 419
                            //generatedToken: generatedToken                                                           // 420
                                                                                                                       //
                        }                                                                                              // 409
                    });                                                                                                // 402
                    console.log("MAILER RESULT:" + result);                                                            // 424
                } catch (err) {                                                                                        // 425
                    BuzzyGlobal.throwError(err);                                                                       // 426
                }                                                                                                      // 427
            }                                                                                                          // 432
        }                                                                                                              // 434
                                                                                                                       //
        if (usersToSMS.length > 0) {                                                                                   // 436
                                                                                                                       //
            Meteor.call("sendSMSTwilio", usersToSMS, "New Buzz " + Meteor.absoluteUrl("go/" + resourceID), function (error) {
                if (error) {                                                                                           // 439
                                                                                                                       //
                    throw new Meteor.Error(422, error.reason);                                                         // 441
                }                                                                                                      // 442
            });                                                                                                        // 444
        }                                                                                                              // 446
    };                                                                                                                 // 448
                                                                                                                       //
    Meteor.methods({                                                                                                   // 450
        createCommentNotification: function () {                                                                       // 451
            function createCommentNotification(comment, topResourceID, resourceParentID, truncatedText, optOldToUsers) {
                if (typeof comment === "undefined" || !comment || comment._id === null || typeof comment.userID === "undefined" || !comment.userID) {
                    BuzzyGlobal.throwError("Invalid data for Notification!");                                          // 453
                }                                                                                                      // 454
                var user = Users.findOne(comment.userID);                                                              // 455
                if (!user) {                                                                                           // 456
                    BuzzyGlobal.throwError("user must be logged in to comment");                                       // 457
                }                                                                                                      // 458
                                                                                                                       //
                var resource = Resources.findOne(topResourceID); // come back to look at children notifications later, for now do for parent
                if (!resource) {                                                                                       // 461
                    BuzzyGlobal.throwError("Resource not found!");                                                     // 462
                }                                                                                                      // 463
                                                                                                                       //
                var activity = {                                                                                       // 466
                    "actor": {                                                                                         // 467
                        "objectType": "person",                                                                        // 468
                        "displayName": BuzzyGlobal.gGetUserName(user)                                                  // 469
                    },                                                                                                 // 467
                    "verb": "post",                                                                                    // 471
                    "object": {                                                                                        // 472
                        "objectType": "comment",                                                                       // 473
                        "commentID": comment._id,                                                                      // 474
                        "content": truncate(comment.message, BuzzyGlobal.gCOMMENT_TRUNCATE)                            // 475
                    },                                                                                                 // 472
                    "target": {                                                                                        // 477
                        "objectType": "resource",                                                                      // 478
                        "displayName": resource.title                                                                  // 479
                                                                                                                       //
                    }                                                                                                  // 477
                };                                                                                                     // 466
                                                                                                                       //
                var followerList = [];                                                                                 // 485
                var tempOldToList = [];                                                                                // 486
                if (typeof optOldToUsers !== "undefined") {                                                            // 487
                    tempOldToList = optOldToUsers;                                                                     // 488
                }                                                                                                      // 489
                                                                                                                       //
                var followers;                                                                                         // 491
                if (typeof comment.toUsers !== "undefined" && comment.toUsers) {                                       // 492
                    followers = ResourceFollowers.find({                                                               // 493
                        $and: [{ resourceID: resource._id }, { userID: { $in: comment.toUsers } }]                     // 495
                    });                                                                                                // 494
                } else {                                                                                               // 501
                    followers = ResourceFollowers.find({ resourceID: resource._id });                                  // 502
                }                                                                                                      // 503
                                                                                                                       //
                if (followers) {                                                                                       // 505
                    followers.forEach(function (follower) {                                                            // 506
                                                                                                                       //
                        if (follower.userID && typeof follower.userID !== "undefined" && follower.userID !== comment.userID) {
                            var currActivity = activity;                                                               // 509
                            currActivity.verb = "post";                                                                // 510
                            var currentAction = BuzzyGlobal.gACTIONS.COMMENTED;                                        // 511
                            if (tempOldToList.indexOf(follower.userID) !== -1) {                                       // 512
                                currActivity.verb = "sent to all";                                                     // 513
                                currentAction = BuzzyGlobal.gACTIONS.SENT_TO_ALL;                                      // 514
                            }                                                                                          // 515
                            followerList.push(follower.userID);                                                        // 516
                            Notifications.insert({                                                                     // 517
                                _id: new Meteor.Collection.ObjectID()._str,                                            // 518
                                forUserID: follower.userID,                                                            // 519
                                byUserID: user._id,                                                                    // 520
                                action: currentAction,                                                                 // 521
                                target: topResourceID,                                                                 // 522
                                activity: currActivity,                                                                // 523
                                //resourceID: resource._id,                                                            // 524
                                resourceID: resourceParentID,                                                          // 525
                                commentID: comment._id,                                                                // 526
                                commenterName: comment.author,                                                         // 527
                                read: false,                                                                           // 528
                                submitted: new Date().getTime()                                                        // 529
                                                                                                                       //
                            });                                                                                        // 517
                                                                                                                       //
                            Push.send({                                                                                // 534
                                from: activity.actor.displayName,                                                      // 535
                                title: activity.target.displayName,                                                    // 536
                                text: activity.actor.displayName + ': ' + truncatedText + "...",                       // 537
                                badge: Meteor.call("gNotificationsUnreadForUserID", follower.userID), // need get notifications count for user
                                sound: 'yes',                                                                          // 539
                                query: {                                                                               // 540
                                    userId: follower.userID                                                            // 541
                                }                                                                                      // 540
                            });                                                                                        // 534
                        }                                                                                              // 544
                    });                                                                                                // 547
                }                                                                                                      // 548
                if (followerList.length > 0) {                                                                         // 549
                                                                                                                       //
                    Notifications.sendNotifications(user._id, followerList, comment.message, topResourceID, resourceParentID, comment._id, function (error, id) {
                        if (error) {                                                                                   // 552
                            throw new Meteor.Error(422, error.reason);                                                 // 553
                        }                                                                                              // 554
                    });                                                                                                // 555
                }                                                                                                      // 557
            }                                                                                                          // 559
                                                                                                                       //
            return createCommentNotification;                                                                          // 451
        }(),                                                                                                           // 451
        createCommentNotificationAuthorsAndOwners: function () {                                                       // 560
            function createCommentNotificationAuthorsAndOwners(comment, topResourceID, resourceParentID, truncatedText) {
                                                                                                                       //
                var user = Users.findOne(comment.userID);                                                              // 562
                if (!user) BuzzyGlobal.throwError("user must be logged in to comment");                                // 563
                var resource = Resources.findOne(topResourceID); // come back to look at children notifications later, for now do for parent
                if (!resource) BuzzyGlobal.throwError("Resource not found!");                                          // 566
                if (typeof comment === "undefined" || !comment || comment._id === null) {                              // 568
                    BuzzyGlobal.throwError("Invalid Date for Notification!");                                          // 569
                }                                                                                                      // 570
                                                                                                                       //
                var activity = {                                                                                       // 573
                    "actor": {                                                                                         // 574
                        "objectType": "person",                                                                        // 575
                        "displayName": BuzzyGlobal.gGetUserName(user)                                                  // 576
                    },                                                                                                 // 574
                    "verb": "post",                                                                                    // 578
                    "object": {                                                                                        // 579
                        "objectType": "comment",                                                                       // 580
                        "commentID": comment._id,                                                                      // 581
                        "content": truncate(comment.message, BuzzyGlobal.gCOMMENT_TRUNCATE)                            // 582
                    },                                                                                                 // 579
                    "target": {                                                                                        // 584
                        "objectType": "resource",                                                                      // 585
                        "displayName": resource.title                                                                  // 586
                                                                                                                       //
                    }                                                                                                  // 584
                };                                                                                                     // 573
                                                                                                                       //
                var followerList = [];                                                                                 // 591
                                                                                                                       //
                var followers;                                                                                         // 593
                if (typeof comment.toUsers !== "undefined" && comment.toUsers) {                                       // 594
                    followers = ResourceFollowers.find({                                                               // 595
                        $and: [{ resourceID: resource._id }, { userID: { $in: comment.toUsers } }]                     // 597
                    });                                                                                                // 596
                } else {                                                                                               // 603
                    followers = ResourceFollowers.find({ resourceID: resource._id });                                  // 604
                }                                                                                                      // 605
                                                                                                                       //
                if (followers) {                                                                                       // 608
                    followers.forEach(function (follower) {                                                            // 609
                        if (follower.userID && typeof follower.userID !== "undefined" && follower.userID !== comment.userID && Resources.canEdit(follower.userID, resource)) {
                            followerList.push(follower.userID);                                                        // 611
                            Notifications.insert({                                                                     // 612
                                _id: new Meteor.Collection.ObjectID()._str,                                            // 613
                                forUserID: follower.userID,                                                            // 614
                                byUserID: user._id,                                                                    // 615
                                action: BuzzyGlobal.gACTIONS.COMMENTED,                                                // 616
                                target: topResourceID,                                                                 // 617
                                activity: activity,                                                                    // 618
                                //resourceID: resource._id,                                                            // 619
                                resourceID: resourceParentID,                                                          // 620
                                commentID: comment._id,                                                                // 621
                                commenterName: comment.author,                                                         // 622
                                read: false,                                                                           // 623
                                submitted: new Date().getTime()                                                        // 624
                                                                                                                       //
                            });                                                                                        // 612
                                                                                                                       //
                            Push.send({                                                                                // 628
                                from: activity.actor.displayName,                                                      // 629
                                title: activity.target.displayName,                                                    // 630
                                text: activity.actor.displayName + ': ' + truncatedText + "...",                       // 631
                                badge: Meteor.call("gNotificationsUnreadForUserID", follower.userID), // need get notifications count for user
                                sound: 'yes',                                                                          // 633
                                query: {                                                                               // 634
                                    userId: follower.userID                                                            // 635
                                }                                                                                      // 634
                            });                                                                                        // 628
                        }                                                                                              // 638
                    });                                                                                                // 641
                }                                                                                                      // 642
                if (followerList.length > 0) {                                                                         // 643
                                                                                                                       //
                    Notifications.sendNotifications(user._id, followerList, comment.message, topResourceID, resourceParentID, comment._id, function (error, id) {
                        if (error) {                                                                                   // 646
                            throw new Meteor.Error(422, error.reason);                                                 // 647
                        }                                                                                              // 648
                    });                                                                                                // 649
                }                                                                                                      // 651
            }                                                                                                          // 653
                                                                                                                       //
            return createCommentNotificationAuthorsAndOwners;                                                          // 560
        }(),                                                                                                           // 560
        gNotificationsUnreadForUserID: function () {                                                                   // 654
            function gNotificationsUnreadForUserID(userID) {                                                           // 654
                return Notifications.find({ forUserID: userID, read: false }).count();                                 // 655
            }                                                                                                          // 656
                                                                                                                       //
            return gNotificationsUnreadForUserID;                                                                      // 654
        }(),                                                                                                           // 654
                                                                                                                       //
        markAllNotificationsRead: function () {                                                                        // 658
            function markAllNotificationsRead() {                                                                      // 658
                console.log("about to mark all notifications read for:" + this.userId);                                // 659
                if (this.userId) {                                                                                     // 660
                    Notifications.update({ read: false, forUserID: this.userId }, { $set: { read: true } }, { multi: true });
                }                                                                                                      // 663
            }                                                                                                          // 666
                                                                                                                       //
            return markAllNotificationsRead;                                                                           // 658
        }(),                                                                                                           // 658
        markAllNotificationsReadResource: function () {                                                                // 667
            function markAllNotificationsReadResource(resourceID) {                                                    // 667
                console.log("about to mark all notifications read for:" + this.userId);                                // 668
                if (this.userId) {                                                                                     // 669
                    Notifications.update({                                                                             // 670
                        $and: [{ read: false }, { forUserID: Meteor.userId() }, { resourceID: resourceID }, { "action.type": { $ne: BuzzyGlobal.gACTIONS.COMMENTED.type } }]
                    }, { $set: { read: true } }, { multi: true });                                                     // 671
                }                                                                                                      // 680
            }                                                                                                          // 681
                                                                                                                       //
            return markAllNotificationsReadResource;                                                                   // 667
        }(),                                                                                                           // 667
                                                                                                                       //
        sendSMSTwilio: function () {                                                                                   // 683
            function sendSMSTwilio(recipeints, message) {                                                              // 683
                console.log("about to send Twilio message");                                                           // 684
                var accountSid = 'ACcc929741c9fc7003bde8860e366f26f2';                                                 // 685
                var authToken = 'eaea7ac98545c992280d68aa096f9db6';                                                    // 686
                                                                                                                       //
                twilio = Twilio(accountSid, authToken);                                                                // 689
                for (i in meteorBabelHelpers.sanitizeForInObject(recipeints)) {                                        // 690
                    console.log("SMS#:" + recipeints[i]);                                                              // 691
                    twilio.sendSms({                                                                                   // 692
                        to: recipeints[i], // Any number Twilio can deliver to                                         // 693
                        //from: '+12054902732', // A number you bought from Twilio and can use for outbound communication
                        from: '+61438062451', // A number you bought from Twilio and can use for outbound communication
                        body: message, // body of the SMS message                                                      // 696
                        mediaUrl: "https://buzzy.buzz"                                                                 // 697
                    }, function (err, responseData) {                                                                  // 692
                        //this function is executed when a response is received from Twilio                            // 698
                        if (!err) {                                                                                    // 699
                            // "err" is an error received during the request, if any                                   // 699
                            // "responseData" is a JavaScript object containing data received from Twilio.             // 700
                            // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
                            // http://www.twilio.com/docs/api/rest/sending-sms#example-1                               // 702
                            console.log(responseData.from); // outputs "+14506667788"                                  // 703
                            console.log(responseData.body); // outputs "word to your mother."                          // 704
                        }                                                                                              // 705
                    });                                                                                                // 706
                }                                                                                                      // 708
            }                                                                                                          // 710
                                                                                                                       //
            return sendSMSTwilio;                                                                                      // 683
        }(),                                                                                                           // 683
        createResourceNotification: function () {                                                                      // 711
            function createResourceNotification(parentResourceID, action) {                                            // 711
                var self = this;                                                                                       // 712
                //var resource = Resources.findOne(comment.resourceParentID);                                          // 713
                var resource = Resources.findOne(parentResourceID); // come back to look at children notifications later, for now do for parent
                var emailRecipients = [];                                                                              // 715
                var user = Meteor.user();                                                                              // 716
                if (!user) {                                                                                           // 717
                    BuzzyGlobal.throwError("you need to login to create resources");                                   // 718
                }                                                                                                      // 719
                if (!resource) {                                                                                       // 720
                    BuzzyGlobal.throwError("Resource not found: " + parentResourceID);                                 // 721
                }                                                                                                      // 722
                                                                                                                       //
                var activity = {                                                                                       // 725
                    "actor": {                                                                                         // 726
                        "objectType": "person",                                                                        // 727
                        "displayName": BuzzyGlobal.gGetUserName(user)                                                  // 728
                    },                                                                                                 // 726
                    "verb": "post",                                                                                    // 730
                    "object": {                                                                                        // 731
                        "objectType": "resource",                                                                      // 732
                        "resourceID": resource._id,                                                                    // 733
                        "displayName": resource.title                                                                  // 734
                    },                                                                                                 // 731
                    "target": {                                                                                        // 736
                        "objectType": "resource",                                                                      // 737
                        "displayName": resource.title                                                                  // 738
                    }                                                                                                  // 736
                };                                                                                                     // 725
                                                                                                                       //
                var followers = ResourceFollowers.find({ resourceID: resource._id });                                  // 743
                if (followers) {                                                                                       // 744
                                                                                                                       //
                    followers.forEach(function (follower) {                                                            // 746
                                                                                                                       //
                        emailRecipients.push(follower.userID);                                                         // 748
                        if (follower.userID && follower.userID !== user._id) {                                         // 749
                            emailRecipients.push(follower.userID);                                                     // 750
                                                                                                                       //
                            Notifications.insert({                                                                     // 752
                                _id: new Meteor.Collection.ObjectID()._str,                                            // 753
                                forUserID: follower.userID,                                                            // 754
                                byUserID: user._id,                                                                    // 755
                                action: action,                                                                        // 756
                                target: parentResourceID,                                                              // 757
                                activity: activity,                                                                    // 758
                                //resourceID: resource._id,                                                            // 759
                                resourceID: resource._id, // insert for parent not actual resource ID, may need to come back to this
                                commentID: null,                                                                       // 761
                                commenterName: user.profile.name,                                                      // 762
                                read: false,                                                                           // 763
                                submitted: new Date().getTime()                                                        // 764
                            });                                                                                        // 752
                        }                                                                                              // 767
                        if (follower.userID && typeof follower.userID !== "undefined" && follower.userID !== user._id) {
                            console.log({                                                                              // 769
                                from: activity.actor.displayName,                                                      // 770
                                title: "Some title",                                                                   // 771
                                text: activity.verb + "ed " + activity.target.displayName,                             // 772
                                badge: Meteor.call("gNotificationsUnreadForUserID", follower.userID), // get notifications count for user
                                sound: 'yes',                                                                          // 774
                                query: {                                                                               // 775
                                    userId: follower.userID                                                            // 776
                                }                                                                                      // 775
                                                                                                                       //
                            });                                                                                        // 769
                            Push.send({                                                                                // 780
                                from: activity.actor.displayName,                                                      // 781
                                title: "Some title",                                                                   // 782
                                text: activity.verb + "ed " + activity.target.displayName,                             // 783
                                badge: Meteor.call("gNotificationsUnreadForUserID", follower.userID), // get notifications count for user
                                sound: 'yes',                                                                          // 785
                                query: {                                                                               // 786
                                    userId: follower.userID                                                            // 787
                                }                                                                                      // 786
                                                                                                                       //
                            });                                                                                        // 780
                        }                                                                                              // 792
                        Meteor.call("addToInvitedList", follower.userID, "testOrigin", resource.title);                // 793
                    });                                                                                                // 796
                }                                                                                                      // 798
                                                                                                                       //
                if (emailRecipients.length > 0) {                                                                      // 800
                    console.log("EMAIL RECIP:", emailRecipients);                                                      // 801
                                                                                                                       //
                    Notifications.sendResourceNotifications(self.connection, user._id, emailRecipients, parentResourceID, [], true, function (error, id) {
                        if (error) {                                                                                   // 804
                                                                                                                       //
                            console.log("sendNotification error:", error);                                             // 806
                            //throw new Meteor.Error(422, error.reason);                                               // 807
                            BuzzyGlobal.throwError(error);                                                             // 808
                        }                                                                                              // 809
                    });                                                                                                // 810
                }                                                                                                      // 812
            }                                                                                                          // 814
                                                                                                                       //
            return createResourceNotification;                                                                         // 711
        }(),                                                                                                           // 711
        createResourceChangeNotification: function () {                                                                // 815
            function createResourceChangeNotification(parentResourceID, resourceIDs, action) {                         // 815
                var self = this;                                                                                       // 816
                //var resource = Resources.findOne(comment.resourceParentID);                                          // 817
                if (!parentResourceID || !resourceIDs) {                                                               // 818
                    BuzzyGlobal.throwError("Create Change Notification invalid params!");                              // 819
                }                                                                                                      // 820
                var resource = Resources.findOne(parentResourceID); // come back to look at children notifications later, for now do for parent
                if (!resource) {                                                                                       // 822
                    BuzzyGlobal.throwError("Can't find resource!");                                                    // 823
                }                                                                                                      // 824
                var emailRecipients = [];                                                                              // 825
                var user = Meteor.user();                                                                              // 826
                if (!user) {                                                                                           // 827
                    BuzzyGlobal.throwError("you need to login to create resources");                                   // 828
                }                                                                                                      // 829
                if (!resource) {                                                                                       // 830
                    BuzzyGlobal.throwError("Resource not found: " + parentResourceID);                                 // 831
                }                                                                                                      // 832
                                                                                                                       //
                if (!Resources.canEdit(user._id, resource)) {                                                          // 834
                    BuzzyGlobal.throwError("Sorry you don't have the rights to do that!");                             // 835
                }                                                                                                      // 836
                                                                                                                       //
                // this is a hack to remove the issue of the router not re-initalizing the changelist,                 // 838
                // so just remove any resourceID that are not a child of the curent Resource                           // 839
                var searchExpression = new RegExp(',' + parentResourceID + ',');                                       // 840
                var resourceCursor = Resources.find({ path: searchExpression });                                       // 841
                var arrayChildren = [];                                                                                // 842
                if (resourceCursor) {                                                                                  // 843
                    arrayChildren = resourceCursor.map(function (aResource) {                                          // 844
                        return aResource._id;                                                                          // 845
                    });                                                                                                // 846
                }                                                                                                      // 847
                                                                                                                       //
                var validResourcesIDs = [];                                                                            // 850
                if (arrayChildren) {                                                                                   // 851
                    validResourcesIDs = _.intersection(arrayChildren, resourceIDs);                                    // 852
                }                                                                                                      // 853
                                                                                                                       //
                if (validResourcesIDs.length > 0) {                                                                    // 856
                    var activity = {                                                                                   // 857
                        "actor": {                                                                                     // 858
                            "objectType": "person",                                                                    // 859
                            "displayName": BuzzyGlobal.gGetUserName(user)                                              // 860
                        },                                                                                             // 858
                        "verb": "chang",                                                                               // 862
                        "object": {                                                                                    // 863
                            "objectType": "resource",                                                                  // 864
                            "resourceID": resource._id,                                                                // 865
                            "displayName": resource.title                                                              // 866
                        },                                                                                             // 863
                        "target": {                                                                                    // 868
                            "objectType": "resource",                                                                  // 869
                            "displayName": resource.title                                                              // 870
                        }                                                                                              // 868
                    };                                                                                                 // 857
                                                                                                                       //
                    Notifications.insert({                                                                             // 875
                        _id: new Meteor.Collection.ObjectID()._str,                                                    // 876
                        forUserID: resource.userID,                                                                    // 877
                        byUserID: user._id,                                                                            // 878
                        action: action,                                                                                // 879
                        target: parentResourceID,                                                                      // 880
                        activity: activity,                                                                            // 881
                        //resourceID: resource._id,                                                                    // 882
                        resourceID: resource._id, // insert for parent not actual resource ID, may need to come back to this
                        commentID: null,                                                                               // 884
                        commenterName: user.profile.name,                                                              // 885
                        read: true,                                                                                    // 886
                        submitted: new Date().getTime()                                                                // 887
                    });                                                                                                // 875
                                                                                                                       //
                    if (user._id !== resource.userID) {                                                                // 890
                                                                                                                       //
                        emailRecipients.push(resource.userID);                                                         // 892
                    }                                                                                                  // 893
                    ;                                                                                                  // 894
                                                                                                                       //
                    var followers = ResourceFollowers.find({ resourceID: resource._id });                              // 896
                    if (followers) {                                                                                   // 897
                                                                                                                       //
                        followers.forEach(function (follower) {                                                        // 899
                                                                                                                       //
                            emailRecipients.push(follower.userID);                                                     // 901
                            if (follower.userID !== user._id && follower.userID !== resource.userID) {                 // 902
                                emailRecipients.push(follower.userID);                                                 // 903
                                                                                                                       //
                                Notifications.insert({                                                                 // 905
                                    _id: new Meteor.Collection.ObjectID()._str,                                        // 906
                                                                                                                       //
                                    forUserID: follower.userID,                                                        // 908
                                    byUserID: user._id,                                                                // 909
                                    action: action,                                                                    // 910
                                    target: parentResourceID,                                                          // 911
                                    activity: activity,                                                                // 912
                                    //resourceID: resource._id,                                                        // 913
                                    resourceID: resource._id, // insert for parent not actual resource ID, may need to come back to this
                                    commentID: null,                                                                   // 915
                                    commenterName: user.profile.name,                                                  // 916
                                    read: false,                                                                       // 917
                                    submitted: new Date().getTime()                                                    // 918
                                });                                                                                    // 905
                                                                                                                       //
                                //console.log("about to push to " + user.profile.name + " follower: " + follower.userID);
                            }                                                                                          // 923
                            if (follower.userID && typeof follower.userID !== "undefined" && follower.userID !== user._id) {
                                console.log({                                                                          // 925
                                    from: activity.actor.displayName,                                                  // 926
                                    title: "Some title",                                                               // 927
                                    text: activity.verb + "ed " + activity.target.displayName,                         // 928
                                    badge: Meteor.call("gNotificationsUnreadForUserID", follower.userID), // get notifications count for user
                                    sound: 'yes',                                                                      // 930
                                    query: {                                                                           // 931
                                        userId: follower.userID                                                        // 932
                                    }                                                                                  // 931
                                                                                                                       //
                                });                                                                                    // 925
                                Push.send({                                                                            // 936
                                    from: activity.actor.displayName,                                                  // 937
                                    title: "Some title",                                                               // 938
                                    text: activity.verb + "ed " + activity.target.displayName,                         // 939
                                    badge: Meteor.call("gNotificationsUnreadForUserID", follower.userID), // get notifications count for user
                                    sound: 'yes',                                                                      // 941
                                    query: {                                                                           // 942
                                        userId: follower.userID                                                        // 943
                                    }                                                                                  // 942
                                                                                                                       //
                                });                                                                                    // 936
                            }                                                                                          // 949
                        });                                                                                            // 951
                    }                                                                                                  // 953
                                                                                                                       //
                    if (emailRecipients.length > 0) {                                                                  // 955
                                                                                                                       //
                        Notifications.sendResourceNotifications(self.connection, user._id, emailRecipients, parentResourceID, resourceIDs, false, function (error, id) {
                            if (error) {                                                                               // 959
                                                                                                                       //
                                console.log("sendNotification error:", error);                                         // 961
                                //throw new Meteor.Error(422, error.reason);                                           // 962
                                BuzzyGlobal.throwError(error);                                                         // 963
                            }                                                                                          // 964
                        });                                                                                            // 965
                    }                                                                                                  // 967
                }                                                                                                      // 969
            }                                                                                                          // 972
                                                                                                                       //
            return createResourceChangeNotification;                                                                   // 815
        }(),                                                                                                           // 815
        createSingleUserResourceNotification: function () {                                                            // 973
            function createSingleUserResourceNotification(recipientUserID, parentResourceID, action, activity, optUserToken) {
                var self = this;                                                                                       // 974
                                                                                                                       //
                if (!recipientUserID || !parentResourceID || !activity) {                                              // 976
                    throw BuzzyGlobal.throwError("Invalid Params");                                                    // 977
                }                                                                                                      // 978
                var resource = Resources.findOne({ _id: parentResourceID }); // come back to look at children notifications later, for now do for parent
                var emailRecipients = [];                                                                              // 980
                var user = BuzzyGlobal.getCurrentUser(optUserToken);                                                   // 981
                if (!user || !resource || action !== "transfer" && !Resources.canEdit(user._id, resource) || action === "transfer" && !Resources.canView(user._id, resource)) {
                    BuzzyGlobal.throwError("You do not have the rights to do this!");                                  // 983
                }                                                                                                      // 984
                if (!resource) {                                                                                       // 985
                    BuzzyGlobal.throwError("Resource not found: " + parentResourceID);                                 // 986
                }                                                                                                      // 987
                                                                                                                       //
                Notifications.insert({                                                                                 // 990
                    _id: new Meteor.Collection.ObjectID()._str,                                                        // 991
                    forUserID: user._id,                                                                               // 992
                    byUserID: user._id,                                                                                // 993
                    action: action,                                                                                    // 994
                    target: parentResourceID,                                                                          // 995
                    activity: activity,                                                                                // 996
                    //resourceID: resource._id,                                                                        // 997
                    resourceID: resource._id, // insert for parent not actual resource ID, may need to come back to this
                    commentID: null,                                                                                   // 999
                    commenterName: user.profile.name,                                                                  // 1000
                    read: true,                                                                                        // 1001
                    submitted: new Date().getTime()                                                                    // 1002
                });                                                                                                    // 990
                                                                                                                       //
                if (recipientUserID && typeof recipientUserID !== "undefined" && user._id !== recipientUserID) {       // 1005
                    Notifications.insert({                                                                             // 1006
                        _id: new Meteor.Collection.ObjectID()._str,                                                    // 1007
                        forUserID: recipientUserID,                                                                    // 1008
                        byUserID: user._id,                                                                            // 1009
                        action: action,                                                                                // 1010
                        target: parentResourceID,                                                                      // 1011
                        activity: activity,                                                                            // 1012
                        //resourceID: resource._id,                                                                    // 1013
                        resourceID: resource._id, // insert for parent not actual resource ID, may need to come back to this
                        commentID: null,                                                                               // 1015
                        commenterName: user.profile.name,                                                              // 1016
                        read: false,                                                                                   // 1017
                        submitted: new Date().getTime()                                                                // 1018
                    });                                                                                                // 1006
                }                                                                                                      // 1021
                                                                                                                       //
                var msgText = "";                                                                                      // 1023
                                                                                                                       //
                switch (action) {                                                                                      // 1025
                    case "transfer":                                                                                   // 1026
                        msgText = activity.verb + "ed " + activity.object.currency + " " + BuzzyGlobal.formatCurrency(activity.object.amount / 100) + " #" + activity.object.receipt_number;
                        break;                                                                                         // 1028
                    default:                                                                                           // 1029
                        msgText = activity.verb + "ed " + activity.target.displayName;                                 // 1030
                }                                                                                                      // 1025
                                                                                                                       //
                if (recipientUserID && typeof recipientUserID !== "undefined") {                                       // 1033
                    Push.send({                                                                                        // 1034
                        from: activity.actor.displayName,                                                              // 1035
                        title: "Some title",                                                                           // 1036
                        text: msgText,                                                                                 // 1037
                        badge: Meteor.call("gNotificationsUnreadForUserID", recipientUserID), // get notifications count for user
                        sound: 'yes',                                                                                  // 1039
                        query: {                                                                                       // 1040
                            userId: recipientUserID                                                                    // 1041
                        }                                                                                              // 1040
                                                                                                                       //
                    });                                                                                                // 1034
                                                                                                                       //
                    Meteor.call("addToInvitedList", recipientUserID, "testOrigin", resource.title);                    // 1046
                                                                                                                       //
                    Notifications.sendResourceNotifications(self.connection, user._id, [recipientUserID], parentResourceID, [], true, function (error, id) {
                        if (error) {                                                                                   // 1050
                                                                                                                       //
                            console.log("sendNotification error:", error);                                             // 1052
                            //throw new Meteor.Error(422, error.reason);                                               // 1053
                            BuzzyGlobal.throwError(error);                                                             // 1054
                        }                                                                                              // 1055
                    });                                                                                                // 1056
                }                                                                                                      // 1057
            }                                                                                                          // 1060
                                                                                                                       //
            return createSingleUserResourceNotification;                                                               // 973
        }(),                                                                                                           // 973
        paymentNotifications: function () {                                                                            // 1061
            function paymentNotifications(resourceID) {                                                                // 1061
                check(resourceID, String);                                                                             // 1062
                                                                                                                       //
                var resource = Resources.findOne({ _id: resourceID });                                                 // 1064
                                                                                                                       //
                if (resource && Meteor.userId() && Resources.canEdit(Meteor.userId(), resource)) {                     // 1066
                                                                                                                       //
                    var results = Notifications.find({                                                                 // 1068
                        "activity.object.resource_button_id": resourceID,                                              // 1069
                        forUserID: resource.content.payment.recipientID                                                // 1070
                    }, { sort: { submitted: -1 } }).map(function (notification) {                                      // 1068
                                                                                                                       //
                        return {                                                                                       // 1073
                            byUserID: notification.byUserID,                                                           // 1074
                            emailaddress: notification.byUserID ? BuzzyGlobal.gEmailforUserID(notification.byUserID) : notification.activity.actor.displayName,
                            currency: notification.activity.object.currency,                                           // 1076
                            amount: notification.activity.object.amount,                                               // 1077
                            charge_id: notification.activity.object.charge_id,                                         // 1078
                            submitted: notification.submitted                                                          // 1079
                        };                                                                                             // 1073
                    });                                                                                                // 1081
                    return results;                                                                                    // 1082
                } else {                                                                                               // 1083
                    BuzzyGlobal.throwError("Sorry! Invalid Params to Perform request");                                // 1084
                }                                                                                                      // 1085
            }                                                                                                          // 1086
                                                                                                                       //
            return paymentNotifications;                                                                               // 1061
        }(),                                                                                                           // 1061
        paymentNotificationsMicroApp: function () {                                                                    // 1087
            function paymentNotificationsMicroApp(appID, fieldID) {                                                    // 1087
                                                                                                                       //
                check(appID, String);                                                                                  // 1089
                check(fieldID, String);                                                                                // 1090
                                                                                                                       //
                var currentDataItem = MicroAppData.findOne({ _id: appID });                                            // 1093
                var resource = Resources.findOne({ _id: currentDataItem.parentResourceID });                           // 1094
                var currentPaymentItem = MicroAppData.currentDataItemField(currentDataItem, fieldID);                  // 1095
                                                                                                                       //
                if (currentPaymentItem && resource && Meteor.userId() && Resources.canEdit(Meteor.userId(), resource)) {
                                                                                                                       //
                    var results = Notifications.find({                                                                 // 1100
                        "activity.object.microAppField.appID": appID,                                                  // 1102
                        "activity.object.microAppField.fieldID": fieldID,                                              // 1103
                        forUserID: currentPaymentItem.value.payment.recipientID                                        // 1104
                    }, { sort: { submitted: -1 } }).map(function (notification) {                                      // 1101
                                                                                                                       //
                        return {                                                                                       // 1109
                            byUserID: notification.byUserID,                                                           // 1110
                            emailaddress: notification.byUserID ? BuzzyGlobal.gEmailforUserID(notification.byUserID) : notification.activity.actor.displayName,
                            currency: notification.activity.object.currency,                                           // 1112
                            amount: notification.activity.object.amount,                                               // 1113
                            charge_id: notification.activity.object.charge_id,                                         // 1114
                            submitted: notification.submitted                                                          // 1115
                        };                                                                                             // 1109
                    });                                                                                                // 1117
                    console.log("IN paymentNotifications:", results);                                                  // 1118
                    return results;                                                                                    // 1119
                } else {                                                                                               // 1120
                    BuzzyGlobal.throwError("Sorry! Invalid Params to Perform request");                                // 1121
                }                                                                                                      // 1122
            }                                                                                                          // 1123
                                                                                                                       //
            return paymentNotificationsMicroApp;                                                                       // 1087
        }(),                                                                                                           // 1087
                                                                                                                       //
        actionRuleNotificationsMicroApp: function () {                                                                 // 1125
            function actionRuleNotificationsMicroApp(fieldData, embeddingResourceID, optUserToken) {                   // 1125
                var self = this;                                                                                       // 1126
                                                                                                                       //
                check(fieldData, Object);                                                                              // 1128
                check(embeddingResourceID, String);                                                                    // 1129
                                                                                                                       //
                var getFieldVal = function () {                                                                        // 1132
                    function getFieldVal(contentArray, fieldID) {                                                      // 1132
                        var item = contentArray.find(function (element) {                                              // 1133
                            return element._id === fieldID;                                                            // 1134
                        });                                                                                            // 1135
                        return item && typeof item !== "undefined" && typeof item.value !== "undefined" && item.value ? item.value : null;
                    }                                                                                                  // 1137
                                                                                                                       //
                    return getFieldVal;                                                                                // 1132
                }();                                                                                                   // 1132
                                                                                                                       //
                var user = BuzzyGlobal.getCurrentUser(optUserToken);                                                   // 1140
                var microAppResource = Resources.findOne({ _id: fieldData.parentResourceID });                         // 1141
                var docParentID = Resources.gGetTopParentFromPath(microAppResource.path);                              // 1142
                var resource = Resources.findOne({ _id: docParentID });                                                // 1143
                var embeddingResource;                                                                                 // 1144
                if (docParentID !== embeddingResourceID) {                                                             // 1145
                    embeddingResource = Resources.findOne({ _id: embeddingResourceID });                               // 1146
                }                                                                                                      // 1147
                                                                                                                       //
                if (!user || !resource || !microAppResource || !Resources.canAddRow(microAppResource)) {               // 1149
                    BuzzyGlobal.throwError("You do not have the rights to do this!");                                  // 1150
                }                                                                                                      // 1151
                                                                                                                       //
                /* COME BACK TO THIS MORE COMPLEX THAN JUST ADD ... need CAN EDIT MICROAPP FIELD TOO                   // 1155
                 if (!Resources.canAddRow(resource) && Resources.can){                                                 //
                 BuzzyGlobal.throwError("Sorry you don't have the rights to do that!")                                 //
                 }*/                                                                                                   //
                                                                                                                       //
                var activity = {                                                                                       // 1161
                    "actor": {                                                                                         // 1162
                        "objectType": "person",                                                                        // 1163
                        "displayName": BuzzyGlobal.gGetUserName(user)                                                  // 1164
                    },                                                                                                 // 1162
                    "verb": "undefined",                                                                               // 1166
                    "object": {                                                                                        // 1167
                        "objectType": "resource",                                                                      // 1168
                        "resourceID": resource._id,                                                                    // 1169
                        "displayName": resource.title,                                                                 // 1170
                        "message": "undefined"                                                                         // 1171
                    },                                                                                                 // 1167
                    "target": {                                                                                        // 1173
                        "objectType": "resource",                                                                      // 1174
                        "displayName": resource.title                                                                  // 1175
                    }                                                                                                  // 1173
                };                                                                                                     // 1161
                                                                                                                       //
                var emailRecipients = [];                                                                              // 1179
                                                                                                                       //
                var fieldLabelsArray = MicroAppFields.find({ parentResourceID: fieldData.parentResourceID }).map(function (field) {
                    if (field.label) {                                                                                 // 1182
                        return field.label;                                                                            // 1183
                    }                                                                                                  // 1184
                });                                                                                                    // 1185
                                                                                                                       //
                var currentActionRules = MicroAppActionRules.find({ parentResourceID: fieldData.parentResourceID }).map(function (rule) {
                    activity.verb = rule.condition;                                                                    // 1188
                                                                                                                       //
                    for (j in meteorBabelHelpers.sanitizeForInObject(fieldLabelsArray)) {                              // 1190
                        var currentField = MicroAppFields.findOne({ parentResourceID: fieldData.parentResourceID, label: fieldLabelsArray[j] });
                        var fieldVal = "";                                                                             // 1192
                        switch (currentField.fieldType) {                                                              // 1193
                            case BuzzyGlobal.gAPPFIELDTYPE.AUTHOR:                                                     // 1194
                                fieldVal = BuzzyGlobal.gGetUserName(user);                                             // 1195
                                break;                                                                                 // 1196
                            case BuzzyGlobal.gAPPFIELDTYPE.SUBMITTED:                                                  // 1197
                                fieldVal = BuzzyGlobal.gFormatDate(fieldData.submitted);                               // 1198
                                break;                                                                                 // 1199
                            default:                                                                                   // 1200
                                fieldVal = getFieldVal(fieldData.content, currentField._id);                           // 1201
                        }                                                                                              // 1193
                                                                                                                       //
                        rule.message = rule.message.replace("[" + fieldLabelsArray[j] + "]", fieldVal);                // 1204
                    }                                                                                                  // 1205
                                                                                                                       //
                    activity.object.message = rule.message;                                                            // 1207
                                                                                                                       //
                    var targetedUsers = [];                                                                            // 1210
                                                                                                                       //
                    for (i in meteorBabelHelpers.sanitizeForInObject(rule.target)) {                                   // 1212
                                                                                                                       //
                        switch (rule.target[i]) {                                                                      // 1216
                            case BuzzyGlobal.gROLES.OWNER:                                                             // 1217
                                emailRecipients = _.without(emailRecipients.concat(resource.owners, embeddingResource ? embeddingResource.owners : []), Meteor.userId());
                                                                                                                       //
                                break;                                                                                 // 1220
                            case BuzzyGlobal.gROLES.AUTHOR:                                                            // 1221
                                emailRecipients = _.without(emailRecipients.concat(resource.editors, embeddingResource ? embeddingResource.editors : []), Meteor.userId());
                                                                                                                       //
                                break;                                                                                 // 1224
                            case BuzzyGlobal.gROLES.AUDIENCE:                                                          // 1225
                                emailRecipients = _.without(emailRecipients.concat(resource.readers, embeddingResource ? embeddingResource.readers : []), Meteor.userId());
                                                                                                                       //
                                break;                                                                                 // 1228
                            case BuzzyGlobal.gROLES.FOLLOWER:                                                          // 1229
                                var resourceFollowers = ResourceFollowers.find({ resourceID: resource._id }).map(function (follower) {
                                    return follower.userID;                                                            // 1231
                                });                                                                                    // 1231
                                var embeddingResourceFollowers = [];                                                   // 1232
                                if (embeddingResource) {                                                               // 1233
                                    embeddingResourceFollowers = ResourceFollowers.find({ resourceID: embeddingResource._id }).map(function (follower) {
                                        return follower.userID;                                                        // 1235
                                    });                                                                                // 1235
                                }                                                                                      // 1236
                                                                                                                       //
                                emailRecipients = _.without(emailRecipients.concat(resourceFollowers, embeddingResourceFollowers), Meteor.userId());
                                                                                                                       //
                                break;                                                                                 // 1243
                            default:                                                                                   // 1244
                                emailRecipients.push(rule.target[i]);                                                  // 1245
                        }                                                                                              // 1216
                    }                                                                                                  // 1248
                    for (k in meteorBabelHelpers.sanitizeForInObject(emailRecipients)) {                               // 1249
                        Notifications.insert({                                                                         // 1250
                            _id: new Meteor.Collection.ObjectID()._str,                                                // 1251
                            forUserID: emailRecipients[k],                                                             // 1252
                            byUserID: user._id,                                                                        // 1253
                            action: activity.verb,                                                                     // 1254
                            target: resource._id,                                                                      // 1255
                            activity: activity,                                                                        // 1256
                            //resourceID: resource._id,                                                                // 1257
                            resourceID: resource._id, // insert for parent not actual resource ID, may need to come back to this
                            commentID: null,                                                                           // 1259
                            commenterName: user.profile.name,                                                          // 1260
                            read: false,                                                                               // 1261
                            submitted: new Date().getTime()                                                            // 1262
                        });                                                                                            // 1250
                                                                                                                       //
                        if (emailRecipients[k] && emailRecipients[k] !== user._id) {                                   // 1265
                                                                                                                       //
                            Push.send({                                                                                // 1267
                                from: activity.actor.displayName,                                                      // 1268
                                title: resource.title,                                                                 // 1269
                                text: rule.message,                                                                    // 1270
                                badge: Meteor.call("gNotificationsUnreadForUserID", emailRecipients[k]), // get notifications count for user
                                sound: 'yes',                                                                          // 1272
                                query: {                                                                               // 1273
                                    userId: emailRecipients[k]                                                         // 1274
                                }                                                                                      // 1273
                            });                                                                                        // 1267
                        }                                                                                              // 1277
                    }                                                                                                  // 1279
                                                                                                                       //
                    if (emailRecipients && emailRecipients.length > 0) {                                               // 1284
                                                                                                                       //
                        Notifications.sendMicroAppNotifications(self.connection, user._id, emailRecipients, fieldData.parentResourceID, [], false, rule.message, fieldData._id, function (error, id) {
                            if (error) {                                                                               // 1287
                                                                                                                       //
                                console.log("sendNotification error:", error);                                         // 1289
                                //throw new Meteor.Error(422, error.reason);                                           // 1290
                                BuzzyGlobal.throwError(error);                                                         // 1291
                            }                                                                                          // 1292
                        });                                                                                            // 1293
                    }                                                                                                  // 1295
                });                                                                                                    // 1298
            }                                                                                                          // 1302
                                                                                                                       //
            return actionRuleNotificationsMicroApp;                                                                    // 1125
        }(),                                                                                                           // 1125
        viewerNotificationsMicroApp: function () {                                                                     // 1303
            function viewerNotificationsMicroApp(appResourceID, newViewers, optUserToken) {                            // 1303
                var self = this;                                                                                       // 1304
                                                                                                                       //
                check(appResourceID, String);                                                                          // 1306
                                                                                                                       //
                var user = BuzzyGlobal.getCurrentUser(optUserToken);                                                   // 1309
                var resource = Resources.findOne({ _id: appResourceID });                                              // 1310
                                                                                                                       //
                if (!user || !resource || !Resources.canAddRow(resource)) {                                            // 1312
                    BuzzyGlobal.throwError("You do not have the rights to do this!");                                  // 1313
                }                                                                                                      // 1314
                                                                                                                       //
                /* COME BACK TO THIS MORE COMPLEX THAN JUST ADD ... need CAN EDIT MICROAPP FIELD TOO                   // 1316
                 if (!Resources.canAddRow(resource) && Resources.can){                                                 //
                 BuzzyGlobal.throwError("Sorry you don't have the rights to do that!")                                 //
                 }*/                                                                                                   //
                                                                                                                       //
                var activity = {                                                                                       // 1322
                    "actor": {                                                                                         // 1323
                        "objectType": "person",                                                                        // 1324
                        "displayName": BuzzyGlobal.gGetUserName(user)                                                  // 1325
                    },                                                                                                 // 1323
                    "verb": "undefined",                                                                               // 1327
                    "object": {                                                                                        // 1328
                        "objectType": "resource",                                                                      // 1329
                        "resourceID": resource._id,                                                                    // 1330
                        "displayName": resource.title,                                                                 // 1331
                        "message": "Assigned you to resource"                                                          // 1332
                    },                                                                                                 // 1328
                    "target": {                                                                                        // 1334
                        "objectType": "resource",                                                                      // 1335
                        "displayName": resource.title                                                                  // 1336
                    }                                                                                                  // 1334
                };                                                                                                     // 1322
                                                                                                                       //
                var emailRecipients = [];                                                                              // 1340
                                                                                                                       //
                for (i in meteorBabelHelpers.sanitizeForInObject(newViewers)) {                                        // 1342
                    Notifications.insert({                                                                             // 1343
                        _id: new Meteor.Collection.ObjectID()._str,                                                    // 1344
                        forUserID: newViewers[i],                                                                      // 1345
                        byUserID: user._id,                                                                            // 1346
                        action: "assigned",                                                                            // 1347
                        target: appResourceID,                                                                         // 1348
                        activity: activity,                                                                            // 1349
                        //resourceID: resource._id,                                                                    // 1350
                        resourceID: resource._id, // insert for parent not actual resource ID, may need to come back to this
                        commentID: null,                                                                               // 1352
                        commenterName: user.profile.name,                                                              // 1353
                        read: false,                                                                                   // 1354
                        submitted: new Date().getTime()                                                                // 1355
                    });                                                                                                // 1343
                                                                                                                       //
                    if (newViewers[i] && newViewers[i] !== user._id) {                                                 // 1358
                                                                                                                       //
                        Push.send({                                                                                    // 1360
                            from: activity.actor.displayName,                                                          // 1361
                            title: resource.title,                                                                     // 1362
                            text: "Assigned you to item",                                                              // 1363
                            badge: Meteor.call("gNotificationsUnreadForUserID", newViewers[i]), // get notifications count for user
                            sound: 'yes',                                                                              // 1365
                            query: {                                                                                   // 1366
                                userId: newViewers[i]                                                                  // 1367
                            }                                                                                          // 1366
                        });                                                                                            // 1360
                    }                                                                                                  // 1370
                                                                                                                       //
                    emailRecipients.push(newViewers[i]);                                                               // 1372
                }                                                                                                      // 1373
                                                                                                                       //
                if (emailRecipients && emailRecipients.length > 0) {                                                   // 1375
                                                                                                                       //
                    Notifications.sendResourceNotifications(self.connection, user._id, emailRecipients, appResourceID, [], false, function (error, id) {
                        if (error) {                                                                                   // 1378
                                                                                                                       //
                            console.log("sendNotification error:", error);                                             // 1380
                            //throw new Meteor.Error(422, error.reason);                                               // 1381
                            BuzzyGlobal.throwError(error);                                                             // 1382
                        }                                                                                              // 1383
                    });                                                                                                // 1384
                }                                                                                                      // 1386
            }                                                                                                          // 1389
                                                                                                                       //
            return viewerNotificationsMicroApp;                                                                        // 1303
        }()                                                                                                            // 1303
    });                                                                                                                // 450
}                                                                                                                      // 1391
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"campaignmonitor.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/buzzy-buzz_resources-core/server/campaignmonitor.js                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**                                                                                                                    // 1
 * Created by adamginsburg on 27/03/2015.                                                                              //
 */                                                                                                                    //
//var createsend = Meteor.npmRequire('createsend-node');                                                               // 4
/*var createsend = Npm.require('createsend-node');                                                                     // 5
                                                                                                                       //
                                                                                                                       //
var auth = { apiKey: '75767a68d775a784aa271ae40d1e57c5' };                                                             //
var api = new createsend(auth);*/                                                                                      //
/*api.account.getClients(                                                                                              // 10
    function (err, clientList) {                                                                                       //
        console.log("clientList", clientList.subscribers);                                                             //
    }                                                                                                                  //
);*/                                                                                                                   //
                                                                                                                       //
Meteor.methods({                                                                                                       // 17
    addCMSubscriber: function () {                                                                                     // 18
        function addCMSubscriber(email, marketingOrigin) {                                                             // 18
                                                                                                                       //
            HTTP.call("POST", "https://api.createsend.com/api/v3.1/subscribers/5cf39ecefe621f50b2b327afd363ce07.json", {
                auth: '75767a68d775a784aa271ae40d1e57c5:x',                                                            // 25
                data: {                                                                                                // 26
                    "EmailAddress": email,                                                                             // 27
                    "CustomFields": [{                                                                                 // 28
                        "Key": "marketingOrigin",                                                                      // 30
                        "Value": marketingOrigin                                                                       // 31
                    }],                                                                                                // 29
                                                                                                                       //
                    /*"Name": "New Subscriber",                                                                        // 35
                    CustomFields": [                                                                                   //
                        {                                                                                              //
                            "Key": "website",                                                                          //
                            "Value": "http://example.com"                                                              //
                        },                                                                                             //
                        {                                                                                              //
                            "Key": "interests",                                                                        //
                            "Value": "magic"                                                                           //
                        },                                                                                             //
                        {                                                                                              //
                            "Key": "interests",                                                                        //
                            "Value": "romantic walks"                                                                  //
                        }                                                                                              //
                    ],*/                                                                                               //
                    "Resubscribe": true,                                                                               // 50
                    "RestartSubscriptionBasedAutoresponders": true                                                     // 51
                }                                                                                                      // 26
                                                                                                                       //
            }, function (error, result) {                                                                              // 24
                if (!error) {                                                                                          // 57
                    return;                                                                                            // 58
                    //console.log("result.uri:", result);                                                              // 59
                } else {                                                                                               // 60
                    console.log("error:", error);                                                                      // 61
                }                                                                                                      // 62
            });                                                                                                        // 63
        }                                                                                                              // 66
                                                                                                                       //
        return addCMSubscriber;                                                                                        // 18
    }(),                                                                                                               // 18
    sendWelcomeEmail: function () {                                                                                    // 67
        function sendWelcomeEmail(marketingOrigin) {                                                                   // 67
                                                                                                                       //
            if (!Meteor.userId()) {                                                                                    // 69
                BuzzyGlobal.throwError("You need to be logged in to send Welcome Email");                              // 70
            }                                                                                                          // 71
            var user = Meteor.user();                                                                                  // 72
            var email = BuzzyGlobal.gGetUserEmail(user);                                                               // 73
            var name = BuzzyGlobal.gGetUserName(user);                                                                 // 74
            HTTP.call("POST", "https://api.createsend.com/api/v3.1/subscribers/bd3da2f3fb84fb0b4f0a1fa35d3ee21d.json", {
                auth: '75767a68d775a784aa271ae40d1e57c5:x',                                                            // 77
                data: {                                                                                                // 78
                    "EmailAddress": email,                                                                             // 79
                    "Name": name,                                                                                      // 80
                    "CustomFields": [{                                                                                 // 81
                        "Key": "marketingOrigin",                                                                      // 83
                        "Value": marketingOrigin                                                                       // 84
                    }],                                                                                                // 82
                                                                                                                       //
                    /*"Name": "New Subscriber",                                                                        // 88
                     CustomFields": [                                                                                  //
                     {                                                                                                 //
                     "Key": "website",                                                                                 //
                     "Value": "http://example.com"                                                                     //
                     },                                                                                                //
                     {                                                                                                 //
                     "Key": "interests",                                                                               //
                     "Value": "magic"                                                                                  //
                     },                                                                                                //
                     {                                                                                                 //
                     "Key": "interests",                                                                               //
                     "Value": "romantic walks"                                                                         //
                     }                                                                                                 //
                     ],*/                                                                                              //
                    "Resubscribe": true,                                                                               // 103
                    "RestartSubscriptionBasedAutoresponders": true                                                     // 104
                }                                                                                                      // 78
                                                                                                                       //
            }, function (error, result) {                                                                              // 76
                if (!error) {                                                                                          // 110
                    return;                                                                                            // 111
                    //console.log("result.uri:", result);                                                              // 112
                } else {                                                                                               // 113
                    console.log("error:", error);                                                                      // 114
                }                                                                                                      // 115
            });                                                                                                        // 116
        }                                                                                                              // 119
                                                                                                                       //
        return sendWelcomeEmail;                                                                                       // 67
    }(),                                                                                                               // 67
    addToInvitedList: function () {                                                                                    // 120
        function addToInvitedList(userID, marketingOrigin, optResourceTitle) {                                         // 120
                                                                                                                       //
            /*if (!Meteor.userId()){                                                                                   // 122
                BuzzyGlobal.throwError("You need to be logged in to send Welcome Email");                              //
            }*/                                                                                                        //
            var user = Users.findOne({ _id: userID });                                                                 // 125
            if (!user) {                                                                                               // 126
                BuzzyGlobal.throwError("Can't find user");                                                             // 127
            }                                                                                                          // 128
                                                                                                                       //
            if (user.dateUserInvited === null && typeof user.services !== "undefined" && typeof user.services.password !== "undefined" && typeof user.services.password.reset !== "undefined" && typeof user.services.password.reset.token !== "undefined") {
                var inviteURL;                                                                                         // 131
                if (typeof user.invitingResourceID !== "undefined" && user.invitingResourceID) {                       // 132
                    inviteURL = Meteor.absoluteUrl('regopassword/1/?token=' + user.services.password.reset.token + "&top=" + user.invitingResourceID + "&sub=" + user.invitingResourceID + "&user=" + user._id);
                } else if (typeof user.createTemplateID !== "undefined" && user.createTemplateID) {                    // 134
                    inviteURL = Meteor.absoluteUrl('regopassword/1/?token=' + user.services.password.reset.token + "&template=" + user.createTemplateID + "&user=" + user._id);
                } else {                                                                                               // 136
                                                                                                                       //
                    inviteURL = Meteor.absoluteUrl('regopassword/1/?token=' + user.services.password.reset.token + "&user=" + user._id);
                }                                                                                                      // 140
                                                                                                                       //
                var customFields = [{                                                                                  // 143
                    "Key": "marketingOrigin",                                                                          // 145
                    "Value": marketingOrigin                                                                           // 146
                }, {                                                                                                   // 144
                    "Key": "inviteURL",                                                                                // 149
                    "Value": inviteURL                                                                                 // 150
                }];                                                                                                    // 148
                                                                                                                       //
                if (Meteor.userId() && typeof optResourceTitle !== "undefined") {                                      // 154
                    var invitingUser = Meteor.user();                                                                  // 155
                    customFields.push({                                                                                // 156
                        "Key": "invitingUserName",                                                                     // 158
                        "Value": BuzzyGlobal.gGetUserName(invitingUser)                                                // 159
                    }, {                                                                                               // 157
                        "Key": "resourceTitle",                                                                        // 162
                        "Value": optResourceTitle                                                                      // 163
                    });                                                                                                // 161
                }                                                                                                      // 165
                                                                                                                       //
                var email = BuzzyGlobal.gGetUserEmail(user);                                                           // 167
                var name = BuzzyGlobal.gGetUserName(user);                                                             // 168
                HTTP.call("POST", "https://api.createsend.com/api/v3.1/subscribers/96ffdadb00bc09a2f2c4a220aa3f0672.json", {
                    auth: '75767a68d775a784aa271ae40d1e57c5:x',                                                        // 171
                    data: {                                                                                            // 172
                        "EmailAddress": email,                                                                         // 173
                        "Name": name,                                                                                  // 174
                        "CustomFields": customFields,                                                                  // 175
                        "Resubscribe": true,                                                                           // 176
                        "RestartSubscriptionBasedAutoresponders": true                                                 // 177
                    }                                                                                                  // 172
                                                                                                                       //
                }, function (error, result) {                                                                          // 170
                    if (!error) {                                                                                      // 183
                        Users.update({ _id: user._id }, { $set: { dateUserInvited: new Date().getTime() } });          // 184
                        return;                                                                                        // 185
                        //console.log("result.uri:", result);                                                          // 186
                    } else {                                                                                           // 187
                        console.log("error:", error);                                                                  // 188
                    }                                                                                                  // 189
                });                                                                                                    // 190
            }                                                                                                          // 194
        }                                                                                                              // 198
                                                                                                                       //
        return addToInvitedList;                                                                                       // 120
    }(),                                                                                                               // 120
    removeFromInvitedList: function () {                                                                               // 199
        function removeFromInvitedList() {                                                                             // 199
                                                                                                                       //
            if (!Meteor.userId()) {                                                                                    // 201
                BuzzyGlobal.throwError("You need to be logged in to remove from Invited List");                        // 202
            }                                                                                                          // 203
            var user = Meteor.user();                                                                                  // 204
            var email = BuzzyGlobal.gGetUserEmail(user);                                                               // 205
                                                                                                                       //
            HTTP.call("POST", "https://api.createsend.com/api/v3.1/subscribers/96ffdadb00bc09a2f2c4a220aa3f0672/unsubscribe.json", {
                auth: '75767a68d775a784aa271ae40d1e57c5:x',                                                            // 210
                data: {                                                                                                // 211
                    "EmailAddress": email                                                                              // 212
                                                                                                                       //
                }                                                                                                      // 211
                                                                                                                       //
            }, function (error, result) {                                                                              // 209
                if (!error) {                                                                                          // 218
                    return;                                                                                            // 219
                    //console.log("result.uri:", result);                                                              // 220
                } else {                                                                                               // 221
                    console.log("error:", error);                                                                      // 222
                }                                                                                                      // 223
            });                                                                                                        // 224
        }                                                                                                              // 227
                                                                                                                       //
        return removeFromInvitedList;                                                                                  // 199
    }(),                                                                                                               // 199
    addToReferralList: function () {                                                                                   // 228
        function addToReferralList(email, marketingOrigin) {                                                           // 228
                                                                                                                       //
            var customFields = [{                                                                                      // 231
                "Key": "marketingOrigin",                                                                              // 233
                "Value": marketingOrigin                                                                               // 234
            }];                                                                                                        // 232
                                                                                                                       //
            if (Meteor.userId()) {                                                                                     // 238
                var invitingUser = Meteor.user();                                                                      // 239
                customFields.push({                                                                                    // 240
                    "Key": "invitingUserName",                                                                         // 242
                    "Value": BuzzyGlobal.gGetUserName(invitingUser)                                                    // 243
                }, {                                                                                                   // 241
                    "Key": "resinvitingUserEmail",                                                                     // 246
                    "Value": BuzzyGlobal.gGetUserEmail(invitingUser)                                                   // 247
                });                                                                                                    // 245
            }                                                                                                          // 249
                                                                                                                       //
            HTTP.call("POST", "https://api.createsend.com/api/v3.1/subscribers/2cdfee67b2999ec401320502b409d11f.json", {
                auth: '75767a68d775a784aa271ae40d1e57c5:x',                                                            // 253
                data: {                                                                                                // 254
                    "EmailAddress": email,                                                                             // 255
                    "CustomFields": customFields,                                                                      // 256
                    "Resubscribe": true,                                                                               // 257
                    "RestartSubscriptionBasedAutoresponders": true                                                     // 258
                }                                                                                                      // 254
                                                                                                                       //
            }, function (error, result) {                                                                              // 252
                if (!error) {                                                                                          // 264
                    return;                                                                                            // 265
                    //console.log("result.uri:", result);                                                              // 266
                } else {                                                                                               // 267
                    console.log("error:", error);                                                                      // 268
                }                                                                                                      // 269
            });                                                                                                        // 270
        }                                                                                                              // 273
                                                                                                                       //
        return addToReferralList;                                                                                      // 228
    }()                                                                                                                // 228
});                                                                                                                    // 17
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"indices.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/buzzy-buzz_resources-core/server/indices.js                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**                                                                                                                    // 1
 * Created by adamginsburg on 10/11/2014.                                                                              //
 */                                                                                                                    //
if (Meteor.isServer) {                                                                                                 // 4
    Meteor.startup(function () {                                                                                       // 5
                                                                                                                       //
        // causes crash Resources._ensureIndex({ path: 1, status:1,isStarterTemplate:1, updated:-1, readers:1, editors:1, owners:1, title:1});
        Resources._ensureIndex({ path: 1, status: 1, isStarterTemplate: 1, updated: -1, title: 1 });                   // 8
        //Resources._ensureIndex({ status:1, privacy:1, isStarterTemplate:1, reusable:-1,  userID:1});                 // 9
        Resources._ensureIndex({ status: 1, privacy: 1, isStarterTemplate: 1, isBasic: -1, userID: 1 });               // 10
        Resources._ensureIndex({ path: 1, updated: -1, title: 1 });                                                    // 11
        Resources._ensureIndex({ path: 1, status: 1 });                                                                // 12
        Resources._ensureIndex({ special: 1, status: 1 });                                                             // 13
        Comments._ensureIndex({ resourceParentID: 1, submitted: -1 });                                                 // 14
        Comments._ensureIndex({ resourceParentID: 1, submitted: 1 });                                                  // 15
        Comments._ensureIndex({ topLevelParentID: 1, submitted: -1 });                                                 // 16
        Comments._ensureIndex({ topLevelParentID: 1, toUsers: 1, submitted: -1 });                                     // 17
        Comments._ensureIndex({ topLevelParentID: 1, toUsers: 1, status: 1 });                                         // 18
        CommentsViewed._ensureIndex({ userID: 1, resourceID: 1, commentID: 1 });                                       // 19
        CommentsViewed._ensureIndex({ commentID: 1 });                                                                 // 20
                                                                                                                       //
        Notifications._ensureIndex({ forUserID: 1 });                                                                  // 22
        Notifications._ensureIndex({ forUserID: 1, submitted: -1 });                                                   // 23
                                                                                                                       //
        Notifications._ensureIndex({ forUserID: 1, "activity.object.resource_button_id": 1, submitted: -1 });          // 25
                                                                                                                       //
        ResourceFollowers._ensureIndex({ userID: 1 }, { submitted: -1 });                                              // 27
        ResourceFollowers._ensureIndex({ resourceID: 1 });                                                             // 28
        ResourceFollowers._ensureIndex({ userID: 1 });                                                                 // 29
        UserContacts._ensureIndex({ userID: 1, contactID: 1, status: 1 });                                             // 30
        UserContacts._ensureIndex({ contactID: 1, status: 1 });                                                        // 31
        UserContacts._ensureIndex({ contactID: 1 });                                                                   // 32
        Users._ensureIndex({ "profile.email": 1 }); // probably need more here for Services                            // 33
        Users._ensureIndex({ "profile.name": 1 }); // probably need more here for Services                             // 34
        ExternalData._ensureIndex({ "userID": 1 }); // probably need more here for Services                            // 35
        MicroAppFields._ensureIndex({ "parentResourceID": 1 }); // probably need more here for Services                // 36
        MicroAppData._ensureIndex({ "parentResourceID": 1 }); // probably need more here for Services                  // 37
        MicroAppData._ensureIndex({ "parentResourceID": 1, "sortVal": 1 }, { background: true }); // probably need more here for Services
        MicroAppData._ensureIndex({ "parentResourceID": 1, "sortVal": -1 }, { background: true }); // probably need more here for Services
        MicroAppData._ensureIndex({ "parentResourceID": 1, "sortVal2": 1 }, { background: true }); // probably need more here for Services
        MicroAppData._ensureIndex({ "parentResourceID": 1, "sortVal2": -1 }, { background: true }); // probably need more here for Services
        MicroAppData._ensureIndex({ "parentResourceID": 1, "sortVal3": 1 }, { background: true }); // probably need more here for Services
        MicroAppData._ensureIndex({ "parentResourceID": 1, "sortVal3": -1 }, { background: true }); // probably need more here for Services
        MicroAppData._ensureIndex({ "parentResourceID": 1, "submitted": 1 }, { background: true }); // probably need more here for Services
        MicroAppData._ensureIndex({ "parentResourceID": 1, "submitted": -1 }, { background: true }); // probably need more here for Services
                                                                                                                       //
        MicroAppVotes._ensureIndex({ "voteFieldID": 1 }); // probably need more here for Services                      // 47
        MicroAppChild._ensureIndex({ parentAppItemID: 1, parentAppFieldID: 1 }); // probably need more here for Services
        TeamMembers._ensureIndex({ teamID: 1, userID: 1, role: 1 }); // probably need more here for Services           // 49
        TeamMembers._ensureIndex({ teamID: 1 }); // probably need more here for Services                               // 50
        SamlProviders._ensureIndex({ org: 1 }); // probably need more here for Services                                // 51
                                                                                                                       //
    });                                                                                                                // 55
}                                                                                                                      // 56
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"teams.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/buzzy-buzz_resources-core/server/teams.js                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**                                                                                                                    // 1
 * Created by adamginsburg on 14/07/2016.                                                                              //
 */                                                                                                                    //
                                                                                                                       //
Meteor.methods({                                                                                                       // 5
    createTeam: function () {                                                                                          // 6
        function createTeam(teamInfo) {                                                                                // 6
            var user = Meteor.user();                                                                                  // 7
            if (!user) {                                                                                               // 8
                BuzzyGlobal.throwError("User must be logged in!");                                                     // 9
                return;                                                                                                // 10
            }                                                                                                          // 11
            if (!teamInfo) {                                                                                           // 12
                BuzzyGlobal.throwError("Invalid params");                                                              // 13
                return;                                                                                                // 14
            }                                                                                                          // 15
            var memberInfo = {                                                                                         // 16
                teamID: teamInfo._id,                                                                                  // 17
                userID: user._id,                                                                                      // 18
                role: BuzzyGlobal.gMEMBER_TYPE.ADMIN                                                                   // 19
            };                                                                                                         // 16
                                                                                                                       //
            Teams.insert(teamInfo, function (error) {                                                                  // 23
                                                                                                                       //
                if (error) {                                                                                           // 26
                    // display the error to the user - Need to come back to fix 422 (not sure what # it should be???) as the error number
                    throw new Meteor.Error(422, error.reason);                                                         // 28
                } else {                                                                                               // 29
                    TeamMembers.insert(memberInfo, function (error) {                                                  // 30
                                                                                                                       //
                        if (error) {                                                                                   // 32
                            // display the error to the user - Need to come back to fix 422 (not sure what # it should be???) as the error number
                            throw new Meteor.Error(422, error.reason);                                                 // 34
                        }                                                                                              // 35
                    });                                                                                                // 36
                }                                                                                                      // 37
            });                                                                                                        // 38
        }                                                                                                              // 41
                                                                                                                       //
        return createTeam;                                                                                             // 6
    }(),                                                                                                               // 6
    changeTeamName: function () {                                                                                      // 42
        function changeTeamName(teamID, newVal) {                                                                      // 42
            check(teamID, String);                                                                                     // 43
            check(newVal, String);                                                                                     // 44
            if (!Meteor.userId() || !Teams.isAdmin(Meteor.userId(), teamID)) {                                         // 45
                BuzzyGlobal.throwError("Ooops! Sorry you're not allowed to do that!");                                 // 46
                return;                                                                                                // 47
            }                                                                                                          // 48
                                                                                                                       //
            Teams.update({ _id: teamID }, { $set: { name: newVal } });                                                 // 50
        }                                                                                                              // 52
                                                                                                                       //
        return changeTeamName;                                                                                         // 42
    }()                                                                                                                // 42
});                                                                                                                    // 5
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"teamMembers.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/buzzy-buzz_resources-core/server/teamMembers.js                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**                                                                                                                    // 1
 * Created by adamginsburg on 14/07/2016.                                                                              //
 */                                                                                                                    //
                                                                                                                       //
Meteor.methods({                                                                                                       // 5
    /*removeTeamMember: function (memberUserID, teamID) {                                                              // 6
        if (Meteor.userId() && Teams.isAdmin(Meteor.userId(),params._id)){                                             //
            TeamMembers.remove({teamID:teamID,userID:memberUserID}, function (err) {                                   //
                if (err){                                                                                              //
                    BuzzyGlobal.throwError(err.reason);                                                                //
                } else {                                                                                               //
                    Users.update({_id:subscription.userIDs[i]},{$set:{subscriptionID:newSubscription.id}});            //
                }                                                                                                      //
            });                                                                                                        //
        } else {                                                                                                       //
            BuzzyGlobal.throwError("Sorry! you don't have the rights to do that!")                                     //
        }                                                                                                              //
     },*/                                                                                                              //
    changeMemberRole: function () {                                                                                    // 20
        function changeMemberRole(teamID, userID, newRole) {                                                           // 20
            if (!Teams.isAdmin(Meteor.userId(), teamID)) {                                                             // 21
                BuzzyGlobal.throwError("Oops!!! You're not allowed to do that!");                                      // 22
                return;                                                                                                // 23
            };                                                                                                         // 24
            var user = Users.findOne(userID);                                                                          // 25
            if (!user) {                                                                                               // 26
                BuzzyGlobal.throwError("User must be logged in!");                                                     // 27
                return;                                                                                                // 28
            }                                                                                                          // 29
            if (!newRole) {                                                                                            // 30
                BuzzyGlobal.throwError("Invalid params");                                                              // 31
                return;                                                                                                // 32
            }                                                                                                          // 33
            // need to check use is manager                                                                            // 34
            var teamMember = TeamMembers.findOne({ teamID: teamID, userID: userID });                                  // 35
            var adminCount = TeamMembers.find({ teamID: teamID, role: BuzzyGlobal.gMEMBER_TYPE.ADMIN }).count();       // 36
            if (teamMember) {                                                                                          // 37
                if (teamMember.role === BuzzyGlobal.gMEMBER_TYPE.ADMIN && adminCount === 1) {                          // 38
                    BuzzyGlobal.throwError("Ooops!!! You need to have at least one Adminstrator for a team. Change ignored.");
                    return;                                                                                            // 40
                }                                                                                                      // 41
                                                                                                                       //
                TeamMembers.update({ _id: teamMember._id }, { $set: { role: newRole } }, function (error) {            // 43
                                                                                                                       //
                    if (error) {                                                                                       // 45
                        // display the error to the user - Need to come back to fix 422 (not sure what # it should be???) as the error number
                        BuzzyGlobal.throwError(error.reason);                                                          // 47
                    } else {}                                                                                          // 48
                });                                                                                                    // 51
            }                                                                                                          // 52
        }                                                                                                              // 53
                                                                                                                       //
        return changeMemberRole;                                                                                       // 20
    }(),                                                                                                               // 20
    addTeamMember: function () {                                                                                       // 54
        function addTeamMember(memberInfo) {                                                                           // 54
            var user = Users.findOne(memberInfo.userID);                                                               // 55
            if (!user) {                                                                                               // 56
                BuzzyGlobal.throwError("User must be logged in!");                                                     // 57
                return;                                                                                                // 58
            }                                                                                                          // 59
            if (!memberInfo) {                                                                                         // 60
                BuzzyGlobal.throwError("Invalid params");                                                              // 61
                return;                                                                                                // 62
            }                                                                                                          // 63
            // need to check use is manager                                                                            // 64
            var teamMember = TeamMembers.findOne({ teamID: memberInfo.teamID, userID: memberInfo.userID });            // 65
            if (teamMember) {                                                                                          // 66
                memberInfo.role = teamMember.role;                                                                     // 67
                TeamMembers.update({ _id: teamMember._id }, { $set: memberInfo }, function (error) {                   // 68
                                                                                                                       //
                    if (error) {                                                                                       // 70
                        // display the error to the user - Need to come back to fix 422 (not sure what # it should be???) as the error number
                        BuzzyGlobal.throwError(error.reason);                                                          // 72
                    } else {}                                                                                          // 73
                });                                                                                                    // 76
            } else {                                                                                                   // 77
                TeamMembers.insert(memberInfo, function (error) {                                                      // 78
                                                                                                                       //
                    if (error) {                                                                                       // 80
                        // display the error to the user - Need to come back to fix 422 (not sure what # it should be???) as the error number
                        BuzzyGlobal.throwError(error.reason);                                                          // 82
                    }                                                                                                  // 83
                });                                                                                                    // 84
            }                                                                                                          // 85
        }                                                                                                              // 88
                                                                                                                       //
        return addTeamMember;                                                                                          // 54
    }()                                                                                                                // 54
});                                                                                                                    // 5
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"payment_history.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/buzzy-buzz_resources-core/server/payment_history.js                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**                                                                                                                    // 1
 * Created by adamginsburg on 2/05/2016.                                                                               //
 */                                                                                                                    //
if (Meteor.isServer) {                                                                                                 // 4
    PaymentHistory = new Meteor.Collection('paymentHistory');                                                          // 5
    PaymentHistory.allow({                                                                                             // 6
        //update: Resources.ownsDocument                                                                               // 7
        //update: Resources.ownsNotification,                                                                          // 8
        insert: Meteor.user                                                                                            // 9
    });                                                                                                                // 6
    Meteor.methods({                                                                                                   // 11
        trackPayment: function () {                                                                                    // 12
            function trackPayment(event) {                                                                             // 12
                //this.unblock();                                                                                      // 13
                console.log("INSIDE trackPayment", event, "userID:", Meteor.userId());                                 // 14
                if (!Meteor.userId()) {                                                                                // 15
                    console.log("trackPayment Error", Meteor.userId());                                                // 16
                    throw new Meteor.Error(401, "Unauthorized");                                                       // 17
                }                                                                                                      // 18
                var paymentData = {                                                                                    // 19
                    _id: new Meteor.Collection.ObjectID()._str,                                                        // 20
                    submitted: new Date().getTime(),                                                                   // 21
                    userID: Meteor.userId(),                                                                           // 22
                    event: event                                                                                       // 23
                };                                                                                                     // 19
                PaymentHistory.insert(paymentData);                                                                    // 25
            }                                                                                                          // 27
                                                                                                                       //
            return trackPayment;                                                                                       // 12
        }()                                                                                                            // 12
                                                                                                                       //
    });                                                                                                                // 11
}                                                                                                                      // 30
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"users.js":["babel-runtime/helpers/typeof",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/buzzy-buzz_resources-core/users.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _typeof;module.import("babel-runtime/helpers/typeof",{"default":function(v){_typeof=v}});                          //
/**                                                                                                                    // 1
 * Created by adamginsburg on 20/11/2014.                                                                              //
 */                                                                                                                    //
if (Meteor.isServer) {                                                                                                 // 4
    Meteor.methods({                                                                                                   // 5
        sendVerificationEmail: function () {                                                                           // 6
            function sendVerificationEmail(email) {                                                                    // 6
                Accounts.sendVerificationEmail(Meteor.userId(), email);                                                // 7
            }                                                                                                          // 8
                                                                                                                       //
            return sendVerificationEmail;                                                                              // 6
        }(),                                                                                                           // 6
        changeProfileImage: function () {                                                                              // 9
            function changeProfileImage(image) {                                                                       // 9
                                                                                                                       //
                if (!Meteor.userId()) {                                                                                // 11
                    throw new Meteor.Error(422, "You need to login!");                                                 // 12
                };                                                                                                     // 15
                if (!image) {                                                                                          // 16
                    throw new Meteor.Error(422, "No Image Supplied");                                                  // 17
                };                                                                                                     // 20
                                                                                                                       //
                Users.update({ _id: Meteor.userId() }, { $set: { "profile.profileImage": image } }, function (err) {   // 22
                    if (err) {                                                                                         // 23
                        BuzzyGlobal.throwError(err);                                                                   // 24
                    }                                                                                                  // 25
                });                                                                                                    // 26
            }                                                                                                          // 30
                                                                                                                       //
            return changeProfileImage;                                                                                 // 9
        }(),                                                                                                           // 9
        setPassword: function () {                                                                                     // 31
            function setPassword(newPassword) {                                                                        // 31
                                                                                                                       //
                if (!Meteor.userId()) {                                                                                // 33
                    throw new Meteor.Error(422, "You need to login!");                                                 // 34
                };                                                                                                     // 37
                if (!newPassword) {                                                                                    // 38
                    throw new Meteor.Error(422, "Password cannot be blank!");                                          // 39
                };                                                                                                     // 42
                                                                                                                       //
                var emailAddress = BuzzyGlobal.gGetUserEmail(Meteor.user());                                           // 44
                console.log("EMAIL ADDR:" + emailAddress);                                                             // 45
                var user = Meteor.user();                                                                              // 46
                if (typeof user.email === "undefined" || user.email === "") {                                          // 47
                    var emailObj = { address: emailAddress, verified: true };                                          // 48
                    Users.update({ _id: Meteor.userId() }, { $push: { emails: emailObj } });                           // 49
                }                                                                                                      // 50
                Accounts.setPassword(Meteor.userId(), newPassword, { logout: false });                                 // 51
            }                                                                                                          // 54
                                                                                                                       //
            return setPassword;                                                                                        // 31
        }(),                                                                                                           // 31
        userIAcceptLicense: function () {                                                                              // 55
            function userIAcceptLicense() {                                                                            // 55
                                                                                                                       //
                if (!Meteor.userId()) {                                                                                // 58
                    throw new Meteor.Error(422, "Issue finding user!");                                                // 59
                };                                                                                                     // 62
                                                                                                                       //
                console.log("about to update acceptedLicense for user: " + Meteor.userId());                           // 64
                                                                                                                       //
                Users.update({ _id: Meteor.userId() }, { $set: { acceptedLicense: true, dateLicenseAccepted: new Date().getTime() } }, function (err) {
                    if (err) {                                                                                         // 67
                        throw new Meteor.Error(422, err);                                                              // 68
                    }                                                                                                  // 70
                }); // should push some log too                                                                        // 71
                return;                                                                                                // 72
            }                                                                                                          // 75
                                                                                                                       //
            return userIAcceptLicense;                                                                                 // 55
        }(),                                                                                                           // 55
        userIDoNotAcceptLicense: function () {                                                                         // 76
            function userIDoNotAcceptLicense() {                                                                       // 76
                var user = Meteor.user();                                                                              // 77
                                                                                                                       //
                if (!user) {                                                                                           // 79
                    throw new Meteor.Error(422, "Issue finding user!");                                                // 80
                };                                                                                                     // 83
                                                                                                                       //
                Users.update({ _id: Meteor.userId() }, { $set: { acceptedLicense: false } }, function (err) {          // 85
                    if (err) {                                                                                         // 86
                        throw new Meteor.Error(422, err);                                                              // 87
                    }                                                                                                  // 89
                }); // should push some log too                                                                        // 90
                return;                                                                                                // 91
            }                                                                                                          // 93
                                                                                                                       //
            return userIDoNotAcceptLicense;                                                                            // 76
        }(),                                                                                                           // 76
        userHasAcceptedLicense: function () {                                                                          // 94
            function userHasAcceptedLicense() {                                                                        // 94
                var user = Meteor.user();                                                                              // 95
                                                                                                                       //
                if (!user) {                                                                                           // 97
                    throw new Meteor.Error(422, "Issue finding user!");                                                // 98
                };                                                                                                     // 101
                                                                                                                       //
                if (typeof user.acceptedLicense != "undefined") {                                                      // 103
                    return user.acceptedLicense;                                                                       // 104
                    /* if (typeof callback === "function") {                                                           // 105
                     // Call it, since we have confirmed it is callable​                                               //
                     console.log("IN userHasAcceptedLicense: " + user._id + " accepted: " + user.acceptedLicense);     //
                     callback(user.acceptedLicense);                                                                   //
                     } else {                                                                                          //
                     console.log("IN userHasAcceptedLicense NOT A FUNCTION: " + user._id + " accepted: " + user.acceptedLicense);
                     callback(user.acceptedLicense);                                                                   //
                     }*/                                                                                               //
                } else {                                                                                               // 114
                    return false;                                                                                      // 115
                    /*console.log("IN userHasAcceptedLicense UNDEFINED: " + user._id);                                 // 116
                     if (typeof callback === "function") {                                                             //
                     // Call it, since we have confirmed it is callable​                                               //
                     callback(false);                                                                                  //
                     }*/                                                                                               //
                }                                                                                                      // 121
            }                                                                                                          // 124
                                                                                                                       //
            return userHasAcceptedLicense;                                                                             // 94
        }(),                                                                                                           // 94
        userCompleteInitialSetup: function () {                                                                        // 125
            function userCompleteInitialSetup() {                                                                      // 125
                var user = Meteor.user();                                                                              // 126
                                                                                                                       //
                if (!user) {                                                                                           // 128
                    throw new Meteor.Error(422, "Issue finding user!");                                                // 129
                };                                                                                                     // 132
                                                                                                                       //
                Users.update({ _id: Meteor.userId() }, { $set: { completedSetup: true, dateInitialSetup: new Date().getTime() } }, function (err) {
                    if (err) {                                                                                         // 135
                        throw new Meteor.Error(422, err);                                                              // 136
                    }                                                                                                  // 138
                }); // should push some log too                                                                        // 139
                return;                                                                                                // 140
            }                                                                                                          // 142
                                                                                                                       //
            return userCompleteInitialSetup;                                                                           // 125
        }(),                                                                                                           // 125
                                                                                                                       //
        userHasCompletedInitialSetup: function () {                                                                    // 144
            function userHasCompletedInitialSetup(optUserID) {                                                         // 144
                var user;                                                                                              // 145
                                                                                                                       //
                if ((typeof optUserID === "undefined" ? "undefined" : _typeof(optUserID)) !== undefined && optUserID.length > 0) {
                    user = Users.findOne({ _id: optUserID });                                                          // 148
                    if (!user) {                                                                                       // 149
                        throw new Meteor.Error(422, "Issue finding user!");                                            // 150
                    };                                                                                                 // 151
                                                                                                                       //
                    if (typeof user.completedSetup != "undefined") {                                                   // 153
                        return user.completedSetup;                                                                    // 154
                    } else {                                                                                           // 157
                        return false;                                                                                  // 158
                    }                                                                                                  // 160
                } else {                                                                                               // 162
                    user = Meteor.user();                                                                              // 163
                                                                                                                       //
                    if (!user) {                                                                                       // 165
                        throw new Meteor.Error(422, "Issue finding user!");                                            // 166
                    };                                                                                                 // 169
                                                                                                                       //
                    if (typeof user.completedSetup != "undefined") {                                                   // 171
                        return user.completedSetup;                                                                    // 172
                    } else {                                                                                           // 175
                        return false;                                                                                  // 176
                    }                                                                                                  // 178
                }                                                                                                      // 179
            }                                                                                                          // 183
                                                                                                                       //
            return userHasCompletedInitialSetup;                                                                       // 144
        }(),                                                                                                           // 144
        inviteUser: function () {                                                                                      // 184
            function inviteUser(userID, email, optResourceID, optCreateTemplateID, optUserToken) {                     // 184
                console.log("inviteUser:", userID, email, optResourceID, optCreateTemplateID, optUserToken);           // 185
                var user = BuzzyGlobal.getCurrentUser(optUserToken);                                                   // 186
                                                                                                                       //
                if (!user) {                                                                                           // 188
                    BuzzyGlobal.throwError("You do not have permission to do that");                                   // 189
                }                                                                                                      // 190
                                                                                                                       //
                var resourceTitle = "";                                                                                // 192
                                                                                                                       //
                if (email && !BuzzyGlobal.gGetUserforEmail(email)) {                                                   // 194
                    email = email.toLowerCase();                                                                       // 195
                    var userData = {                                                                                   // 196
                        _id: userID,                                                                                   // 197
                        //profile:{name: 'Update Profile'},                                                            // 198
                        createdAt: new Date().getTime(),                                                               // 199
                        email: email,                                                                                  // 200
                        emails: [{ address: email, verified: false }],                                                 // 201
                        dateUserInvited: null,                                                                         // 202
                        invitingResourceID: null,                                                                      // 203
                        completedSetup: false,                                                                         // 204
                        services: {                                                                                    // 205
                            password: {                                                                                // 206
                                reset: {                                                                               // 207
                                    "token": Random.secret(),                                                          // 208
                                    "email": email,                                                                    // 209
                                    "when": new Date().getTime()                                                       // 210
                                }                                                                                      // 207
                            }                                                                                          // 206
                        },                                                                                             // 205
                        profile: {                                                                                     // 214
                            channels: [{                                                                               // 215
                                channel: "email",                                                                      // 218
                                address: email,                                                                        // 219
                                enabled: true                                                                          // 220
                            }]                                                                                         // 217
                        }                                                                                              // 214
                                                                                                                       //
                    };                                                                                                 // 196
                                                                                                                       //
                    if (typeof optResourceID !== "undefined" && optResourceID) {                                       // 229
                        userData.invitingResourceID = optResourceID;                                                   // 230
                        resourceTitle = Resources.findOne({ _id: optResourceID }).title;                               // 231
                    } else if (typeof optCreateTemplateID !== "undefined" && optCreateTemplateID) {                    // 232
                        userData.createTemplateID = optCreateTemplateID;                                               // 233
                                                                                                                       //
                        var template = Resources.findOne({ _id: optCreateTemplateID });                                // 235
                        if (template) {                                                                                // 236
                            resourceTitle = template.title;                                                            // 237
                        } else {                                                                                       // 238
                            BuzzyGlobal.throwError("Can't find template " + optCreateTemplateID);                      // 239
                        }                                                                                              // 240
                    }                                                                                                  // 241
                                                                                                                       //
                    if (Users.find({ _id: userID }).count() === 0) {                                                   // 243
                        Users.insert(userData, function (error) {                                                      // 244
                                                                                                                       //
                            if (error) {                                                                               // 249
                                // display the error to the user - Need to come back to fix 422 (not sure what # it should be???) as the error number
                                throw new Meteor.Error(422, error.reason);                                             // 251
                            } else {                                                                                   // 252
                                BuzzyLogging.call("track", {                                                           // 253
                                    action: "createUser",                                                              // 254
                                    "userID": userID,                                                                  // 255
                                    "dateCreated": new Date().getTime(),                                               // 256
                                    "source": "invited"                                                                // 257
                                }, Meteor.settings.BUZZY_LOGGING_TOKEN);                                               // 253
                                                                                                                       //
                                var inviteURL;                                                                         // 262
                                if (userData.invitingResourceID) {                                                     // 263
                                    inviteURL = Meteor.absoluteUrl('regopassword/1/?token=' + userData.services.password.reset.token + "&top=" + userData.invitingResourceID + "&sub=" + userData.invitingResourceID + "&user=" + userData._id);
                                } else if (userData.createTemplateID) {                                                // 265
                                    inviteURL = Meteor.absoluteUrl('regopassword/1/?token=' + userData.services.password.reset.token + "&template=" + userData.createTemplateID + "&user=" + userData._id);
                                } else {                                                                               // 267
                                    inviteURL = Meteor.absoluteUrl('regopassword/1/?token=' + userData.services.password.reset.token + "&user=" + userData._id);
                                }                                                                                      // 269
                                                                                                                       //
                                // MOVING to resourceNOTIFICATION Meteor.call("addToInvitedList",userID, "testOrigin", inviteURL, resourceTitle)
                                if (user) {                                                                            // 272
                                    Meteor.call("addContact", userID, BuzzyGlobal.gUSERSTATUS.ACTIVE, email, optUserToken);
                                }                                                                                      // 274
                            }                                                                                          // 275
                        });                                                                                            // 276
                        return;                                                                                        // 277
                    } else {                                                                                           // 279
                        BuzzyGlobal.throwError("Error creating user for ID: " + userID);                               // 280
                    }                                                                                                  // 281
                } else {                                                                                               // 283
                    console.log("invite user, email not valid for " + email);                                          // 284
                    BuzzyGlobal.throwError("invite user, email not valid for " + email);                               // 285
                }                                                                                                      // 286
            }                                                                                                          // 292
                                                                                                                       //
            return inviteUser;                                                                                         // 184
        }(),                                                                                                           // 184
        approveContact: function () {                                                                                  // 293
            function approveContact(contactID) {                                                                       // 293
                                                                                                                       //
                // ensure the user is logged in                                                                        // 296
                if (!Meteor.user()) throw new Meteor.Error(401, "You need to login to approve contacts");              // 297
                                                                                                                       //
                var contact = Users.findOne({ _id: contactID });                                                       // 300
                                                                                                                       //
                if (!contact) throw new Meteor.Error(401, "contact not found");                                        // 302
                //console.log(this.userId  + " inside  approve contact for: " + contactID);                            // 304
                var contactRecord = UserContacts.findOne({ $and: [{ userID: contactID }, { contactID: this.userId }] });
                                                                                                                       //
                if (contactRecord) {                                                                                   // 307
                                                                                                                       //
                    //console.log("about to update  contact:" + contactID + " status:" + contactRecord.status);        // 309
                                                                                                                       //
                    var userContact = UserContacts.update({ _id: contactRecord._id }, { $set: { status: BuzzyGlobal.gUSERSTATUS.ACTIVE } }, function (error) {
                        if (error) {                                                                                   // 312
                            throw new Meteor.Error(422, error.reason);                                                 // 313
                        } else {                                                                                       // 314
                            Meteor.call("addContact", contactID, BuzzyGlobal.gUSERSTATUS.ACTIVE, function (err) {      // 315
                                if (err) {                                                                             // 316
                                    throw new Meteor.Error(401, "Error adding contact");                               // 317
                                }                                                                                      // 318
                            });                                                                                        // 319
                        }                                                                                              // 320
                    });                                                                                                // 321
                }                                                                                                      // 324
                                                                                                                       //
                return true;                                                                                           // 327
            }                                                                                                          // 328
                                                                                                                       //
            return approveContact;                                                                                     // 293
        }(),                                                                                                           // 293
        denyContact: function () {                                                                                     // 329
            function denyContact(contactID) {                                                                          // 329
                                                                                                                       //
                // ensure the user is logged in                                                                        // 332
                if (!Meteor.user()) throw new Meteor.Error(401, "You need to login to deny contacts");                 // 333
                                                                                                                       //
                var contact = Users.findOne({ _id: contactID });                                                       // 336
                                                                                                                       //
                if (!contact) throw new Meteor.Error(401, "contact not found");                                        // 338
                //console.log(this.userId  + " inside  deny contact for: " + contactID);                               // 340
                var contactRecord = UserContacts.findOne({ $and: [{ userID: contactID }, { contactID: this.userId }] });
                                                                                                                       //
                if (contactRecord) {                                                                                   // 343
                                                                                                                       //
                    //console.log("about to deny  contact:" + contactID + " status:" + contactRecord.status);          // 345
                                                                                                                       //
                    var userContact = UserContacts.remove({ _id: contactRecord._id }, function (error) {               // 347
                        if (error) {                                                                                   // 348
                            throw new Meteor.Error(422, error.reason);                                                 // 349
                        }                                                                                              // 350
                    });                                                                                                // 351
                }                                                                                                      // 354
                                                                                                                       //
                return true;                                                                                           // 357
            }                                                                                                          // 358
                                                                                                                       //
            return denyContact;                                                                                        // 329
        }(),                                                                                                           // 329
        removeContact: function () {                                                                                   // 359
            function removeContact(userContactID) {                                                                    // 359
                                                                                                                       //
                // ensure the user is logged in                                                                        // 362
                if (!Meteor.user()) throw new Meteor.Error(401, "You need to login to approve contacts");              // 363
                                                                                                                       //
                if (userContactID) {                                                                                   // 368
                                                                                                                       //
                    var userContact = UserContacts.remove({ _id: userContactID }, function (error) {                   // 372
                        if (error) {                                                                                   // 373
                            throw new Meteor.Error(422, error.reason);                                                 // 374
                        }                                                                                              // 375
                    });                                                                                                // 376
                }                                                                                                      // 379
                                                                                                                       //
                return true;                                                                                           // 382
            }                                                                                                          // 383
                                                                                                                       //
            return removeContact;                                                                                      // 359
        }(),                                                                                                           // 359
        addContact: function () {                                                                                      // 384
            function addContact(contactID, status, email, optUserToken) {                                              // 384
                                                                                                                       //
                var user = BuzzyGlobal.getCurrentUser(optUserToken);                                                   // 386
                                                                                                                       //
                if (!user) {                                                                                           // 388
                    BuzzyGlobal.throwError("You do not have permission to do that");                                   // 389
                }                                                                                                      // 390
                                                                                                                       //
                var contact = Users.findOne({ _id: contactID });                                                       // 392
                                                                                                                       //
                if (!contact) throw new Meteor.Error(401, "contact not found");                                        // 394
                var userContact = UserContacts.findOne({ $and: [{ userID: user._id }, { contactID: contactID }] });    // 396
                                                                                                                       //
                var tempEmail = "";                                                                                    // 398
                if (typeof email !== "undefined") {                                                                    // 399
                    tempEmail = email;                                                                                 // 400
                }                                                                                                      // 401
                                                                                                                       //
                if (!userContact) {                                                                                    // 403
                                                                                                                       //
                    //console.log("about to insert new contact:" + contactID);                                         // 405
                    var userContact = {                                                                                // 406
                        userID: user._id,                                                                              // 407
                        email: tempEmail,                                                                              // 408
                        name: BuzzyGlobal.gGetUserName(contact),                                                       // 409
                        contactID: contactID,                                                                          // 410
                        status: status,                                                                                // 411
                        submitted: new Date().getTime()                                                                // 412
                    };                                                                                                 // 406
                                                                                                                       //
                    var userContact = UserContacts.insert(userContact, function (error) {                              // 415
                        if (error) {                                                                                   // 416
                            throw new Meteor.Error(422, error.reason);                                                 // 417
                        }                                                                                              // 418
                    });                                                                                                // 419
                } else {                                                                                               // 422
                    //console.log("about to update existing user contact ID:" + userContact._id);                      // 423
                    UserContacts.update({ _id: userContact._id }, { $set: { status: BuzzyGlobal.gUSERSTATUS.ACTIVE } }, function (error) {
                        if (error) {                                                                                   // 425
                            throw new Meteor.Error(422, error.reason);                                                 // 426
                        }                                                                                              // 427
                    });                                                                                                // 428
                }                                                                                                      // 430
                                                                                                                       //
                console.log("About to return");                                                                        // 432
                return;                                                                                                // 433
            }                                                                                                          // 434
                                                                                                                       //
            return addContact;                                                                                         // 384
        }(),                                                                                                           // 384
        addNewUser: function () {                                                                                      // 435
            function addNewUser(currentResourceID, addedEmail, field, optUserToken) {                                  // 435
                var resource = Resources.findOne({ _id: currentResourceID });                                          // 436
                var user = BuzzyGlobal.getCurrentUser(optUserToken);                                                   // 437
                                                                                                                       //
                if (!user) {                                                                                           // 439
                    BuzzyGlobal.throwError("You do not have permission to do that");                                   // 440
                }                                                                                                      // 441
                if (!resource || !Resources.canEdit(user._id, resource)) {                                             // 442
                    throw new Meteor.Error(422, "User does not have rights to add users");                             // 443
                }                                                                                                      // 444
                var newParticipant = BuzzyGlobal.gGetUserforEmail(addedEmail);                                         // 445
                                                                                                                       //
                if (newParticipant) {                                                                                  // 448
                    if (resource.owners.indexOf(newParticipant._id) !== -1) {                                          // 449
                        return;                                                                                        // 450
                    }                                                                                                  // 451
                                                                                                                       //
                    var participants;                                                                                  // 454
                    //var currentResource = Resources.findOne(currentResourceID);                                      // 455
                                                                                                                       //
                    switch (field) {                                                                                   // 457
                        case 'addReader':                                                                              // 458
                                                                                                                       //
                            participants = resource.readers;                                                           // 460
                            break;                                                                                     // 461
                        case 'addEditor':                                                                              // 462
                            participants = resource.editors;                                                           // 463
                            break;                                                                                     // 464
                        case 'addOwner':                                                                               // 465
                            participants = resource.owners;                                                            // 466
                            break;                                                                                     // 467
                        default:                                                                                       // 468
                            throw new Meteor.Error(500, "Invalid Field");                                              // 469
                                                                                                                       //
                    }                                                                                                  // 457
                                                                                                                       //
                    if (participants.indexOf(newParticipant._id) === -1) {                                             // 473
                        Meteor.call(field, currentResourceID, newParticipant._id, optUserToken, function (error, id) {
                            //console.log("back from " + field )                                                       // 475
                            if (error) {                                                                               // 476
                                // display the error to the user                                                       // 477
                                throw new Meteor.Error(500, error.reason);                                             // 478
                            } else {                                                                                   // 479
                                if (resource.status === BuzzyGlobal.gRESOURCE_STATUS.PUBLISHED) {                      // 480
                                    Meteor.call("addFollower", currentResourceID, newParticipant._id, optUserToken);   // 481
                                };                                                                                     // 483
                                                                                                                       //
                                Meteor.call('addContact', newParticipant._id, BuzzyGlobal.gUSERSTATUS.ACTIVE, null, optUserToken, function (err) {
                                    if (err) {                                                                         // 486
                                        throw new Meteor.Error(500, err);                                              // 487
                                    } else {                                                                           // 488
                                                                                                                       //
                                        return;                                                                        // 490
                                    }                                                                                  // 492
                                });                                                                                    // 493
                            }                                                                                          // 495
                        });                                                                                            // 497
                    }                                                                                                  // 498
                } else {                                                                                               // 499
                                                                                                                       //
                    var newID = new Meteor.Collection.ObjectID()._str;                                                 // 501
                    Meteor.call("inviteUser", newID, addedEmail, currentResourceID, null, optUserToken, function (error, id) {
                        if (error) {                                                                                   // 503
                            // display the error to the user                                                           // 504
                            //throw new Meteor.Error(422, error.reason);                                               // 505
                            console.log(error);                                                                        // 506
                            BuzzyGlobal.throwError(error);                                                             // 507
                        } else {                                                                                       // 508
                            console.log(field, currentResourceID, newID, null, optUserToken);                          // 509
                            Meteor.call(field, currentResourceID, newID, null, optUserToken, function (error, id) {    // 510
                                if (error) {                                                                           // 511
                                    // display the error to the user                                                   // 512
                                    throw new Meteor.Error(422, error.reason);                                         // 513
                                } else {                                                                               // 514
                                    Meteor.call('addContact', newID, BuzzyGlobal.gUSERSTATUS.ACTIVE, addedEmail, optUserToken, function (err) {
                                        if (err) {                                                                     // 516
                                                                                                                       //
                                            BuzzyGlobal.throwError(error);                                             // 518
                                        } else {                                                                       // 519
                                            if (resource.status === BuzzyGlobal.gRESOURCE_STATUS.PUBLISHED) {          // 520
                                                Meteor.call("addFollower", currentResourceID, newID, optUserToken);    // 521
                                            };                                                                         // 523
                                            return;                                                                    // 524
                                        }                                                                              // 525
                                    });                                                                                // 526
                                }                                                                                      // 527
                            });                                                                                        // 528
                        }                                                                                              // 530
                    });                                                                                                // 531
                }                                                                                                      // 533
            }                                                                                                          // 534
                                                                                                                       //
            return addNewUser;                                                                                         // 435
        }(),                                                                                                           // 435
        addNewFollower: function () {                                                                                  // 535
            function addNewFollower(currentResourceID, addedEmail, field, optUserToken) {                              // 535
                var resource = Resources.findOne({ _id: currentResourceID });                                          // 536
                var user = BuzzyGlobal.getCurrentUser(optUserToken);                                                   // 537
                                                                                                                       //
                if (!user) {                                                                                           // 539
                    BuzzyGlobal.throwError("You do not have permission to do that");                                   // 540
                }                                                                                                      // 541
                if (!resource || !Resources.canEdit(user._id, resource)) {                                             // 542
                    throw new Meteor.Error(422, "User does not have rights to add users");                             // 543
                }                                                                                                      // 544
                var newParticipant = BuzzyGlobal.gGetUserforEmail(addedEmail);                                         // 545
                                                                                                                       //
                if (newParticipant) {                                                                                  // 548
                    Meteor.call("addFollower", currentResourceID, newParticipant._id, optUserToken);                   // 549
                } else {                                                                                               // 551
                                                                                                                       //
                    var newID = new Meteor.Collection.ObjectID()._str;                                                 // 553
                    Meteor.call("inviteUser", newID, addedEmail, currentResourceID, null, optUserToken, function (error, id) {
                        if (error) {                                                                                   // 555
                            // display the error to the user                                                           // 556
                            //throw new Meteor.Error(422, error.reason);                                               // 557
                            console.log(error);                                                                        // 558
                            BuzzyGlobal.throwError(error);                                                             // 559
                        } else {                                                                                       // 560
                            Meteor.call("addFollower", currentResourceID, newID, optUserToken);                        // 561
                            //SHOULD send notification if published                                                    // 562
                        }                                                                                              // 564
                    });                                                                                                // 565
                }                                                                                                      // 567
            }                                                                                                          // 568
                                                                                                                       //
            return addNewFollower;                                                                                     // 535
        }(),                                                                                                           // 535
        updateProfile: function () {                                                                                   // 569
            function updateProfile(field, value) {                                                                     // 569
                                                                                                                       //
                var user = Meteor.user();                                                                              // 571
                // ensure the user is logged in                                                                        // 572
                if (!user) throw new Meteor.Error(401, "User must be logged into change profile.");                    // 573
                                                                                                                       //
                var obj = {};                                                                                          // 576
                obj["profile." + field] = value;                                                                       // 577
                                                                                                                       //
                Users.update({ _id: user._id }, { $set: obj }, function (error) {                                      // 579
                    if (error) {                                                                                       // 580
                        // display the error to the user                                                               // 581
                        throw new Meteor.Error(422, error.reason);                                                     // 582
                    }                                                                                                  // 583
                });                                                                                                    // 585
            }                                                                                                          // 587
                                                                                                                       //
            return updateProfile;                                                                                      // 569
        }(),                                                                                                           // 569
        updateUserStripe: function () {                                                                                // 588
            function updateUserStripe(field, value) {                                                                  // 588
                                                                                                                       //
                var user = Meteor.user();                                                                              // 590
                // ensure the user is logged in                                                                        // 591
                if (!user) throw new Meteor.Error(401, "User must be logged into change profile.");                    // 592
                                                                                                                       //
                var obj = {};                                                                                          // 595
                obj["stripeInfo." + field] = value;                                                                    // 596
                                                                                                                       //
                Users.update({ _id: user._id }, { $set: obj }, function (error) {                                      // 598
                    if (error) {                                                                                       // 599
                        // display the error to the user                                                               // 600
                        throw new Meteor.Error(422, error.reason);                                                     // 601
                    }                                                                                                  // 602
                });                                                                                                    // 604
            }                                                                                                          // 606
                                                                                                                       //
            return updateUserStripe;                                                                                   // 588
        }(),                                                                                                           // 588
        removeStripeAccountInfo: function () {                                                                         // 607
            function removeStripeAccountInfo() {                                                                       // 607
                                                                                                                       //
                var user = Meteor.user();                                                                              // 609
                // ensure the user is logged in                                                                        // 610
                if (!user) {                                                                                           // 611
                    throw new Meteor.Error(401, "User must be logged into change profile.");                           // 612
                } else {                                                                                               // 613
                    Users.update({ _id: user._id }, { $set: { stripeInfo: null } }, function (error) {                 // 614
                        if (error) {                                                                                   // 615
                            // display the error to the user                                                           // 616
                            throw new Meteor.Error(422, error.reason);                                                 // 617
                        }                                                                                              // 618
                    });                                                                                                // 620
                }                                                                                                      // 621
            }                                                                                                          // 627
                                                                                                                       //
            return removeStripeAccountInfo;                                                                            // 607
        }(),                                                                                                           // 607
        updateUserNotifications: function () {                                                                         // 628
            function updateUserNotifications(action, channel, address) {                                               // 628
                var user = Meteor.user();                                                                              // 629
                // ensure the user is logged in                                                                        // 630
                if (!user) throw new Meteor.Error(401, "User must be logged into change profile.");                    // 631
                                                                                                                       //
                if (action === BuzzyGlobal.gNOTIFICATION_ACTIONS.ADD) {                                                // 634
                    if (typeof user.profile.channels === "undefined") {                                                // 635
                        Users.update({ _id: user._id }, { $set: { "profile.channels": [{ channel: channel, address: address, enabled: true }] } }, function (error) {
                            if (error) {                                                                               // 637
                                // display the error to the user                                                       // 638
                                throw new Meteor.Error(422, error.reason);                                             // 639
                            }                                                                                          // 640
                        });                                                                                            // 642
                    } else {                                                                                           // 643
                        var found = false;                                                                             // 644
                        var i = 0;                                                                                     // 645
                        while (i < user.profile.channels.length && !found) {                                           // 646
                            if (user.profile.channels[i].channel === channel && user.profile.channels[i].address === address) {
                                found = true;                                                                          // 648
                                Users.update({ _id: user._id }, { $pull: { "profile.channels": { channel: channel, address: address } } }, function (error) {
                                    if (error) {                                                                       // 650
                                        // display the error to the user                                               // 651
                                        throw new Meteor.Error(422, error.reason);                                     // 652
                                    } else {                                                                           // 653
                                        Users.update({ _id: user._id }, { $push: { "profile.channels": { channel: channel, address: address, enabled: true } } }, function (error) {
                                            if (error) {                                                               // 655
                                                // display the error to the user                                       // 656
                                                throw new Meteor.Error(422, error.reason);                             // 657
                                            }                                                                          // 658
                                        });                                                                            // 660
                                    }                                                                                  // 661
                                });                                                                                    // 663
                            }                                                                                          // 665
                            i++;                                                                                       // 666
                        }                                                                                              // 667
                                                                                                                       //
                        if (!found) {                                                                                  // 669
                            Users.update({ _id: user._id }, { $push: { "profile.channels": { channel: channel, address: address, enabled: true } } }, function (error) {
                                if (error) {                                                                           // 671
                                    // display the error to the user                                                   // 672
                                    throw new Meteor.Error(422, error.reason);                                         // 673
                                }                                                                                      // 674
                            });                                                                                        // 676
                        }                                                                                              // 677
                    }                                                                                                  // 680
                } else if (action === BuzzyGlobal.gNOTIFICATION_ACTIONS.REMOVE) {                                      // 682
                                                                                                                       //
                    if (typeof user.profile.channels !== "undefined") {                                                // 684
                        Users.update({ _id: user._id }, { $pull: { "profile.channels": { channel: channel, address: address } } }, function (error) {
                            if (error) {                                                                               // 686
                                // display the error to the user                                                       // 687
                                throw new Meteor.Error(422, error.reason);                                             // 688
                            } else {                                                                                   // 689
                                Users.update({ _id: user._id }, { $push: { "profile.channels": { channel: channel, address: address, enabled: false } } }, function (error) {
                                    if (error) {                                                                       // 691
                                        // display the error to the user                                               // 692
                                        throw new Meteor.Error(422, error.reason);                                     // 693
                                    }                                                                                  // 694
                                });                                                                                    // 696
                            }                                                                                          // 697
                        });                                                                                            // 699
                    }                                                                                                  // 700
                }                                                                                                      // 701
            }                                                                                                          // 703
                                                                                                                       //
            return updateUserNotifications;                                                                            // 628
        }(),                                                                                                           // 628
        addNewUserEmail: function () {                                                                                 // 704
            function addNewUserEmail(email) {                                                                          // 704
                var user = Meteor.user();                                                                              // 705
                if (typeof user.emails !== "undefined") {                                                              // 706
                    var otherUsers = BuzzyGlobal.gGetUserforEmail(email);                                              // 707
                    if (otherUsers) {                                                                                  // 708
                        throw new Meteor.Error(422, "Email address is already used.");                                 // 709
                        //should change to callback to can let user know of error                                      // 710
                    }                                                                                                  // 711
                    Users.update({ _id: user._id }, { $push: { "emails": { address: email, verified: false } } }, function (error) {
                        if (error) {                                                                                   // 713
                            // display the error to the user                                                           // 714
                            throw new Meteor.Error(422, error.reason);                                                 // 715
                        } else {                                                                                       // 716
                            Meteor.call("updateUserNotifications", BuzzyGlobal.gNOTIFICATION_ACTIONS.ADD, BuzzyGlobal.gNOTIFICATION_CHANNEL.EMAIL, email);
                        }                                                                                              // 718
                    });                                                                                                // 720
                } else {                                                                                               // 721
                    console.log("UNDEFINED", _typeof(user.emails), user);                                              // 722
                }                                                                                                      // 723
            }                                                                                                          // 725
                                                                                                                       //
            return addNewUserEmail;                                                                                    // 704
        }(),                                                                                                           // 704
                                                                                                                       //
        /*updateProfileNotifications: function(notificationSetting){                                                   // 730
          var user = Meteor.user();                                                                                    //
         // ensure the user is logged in                                                                               //
         if (!user)                                                                                                    //
         throw new Meteor.Error(401, "User must be logged into change profile.");                                      //
          var obj = {};                                                                                                //
         if (typeof user.notification != "undefined"){                                                                 //
          if (user.notification.indexOf[notificationSetting.target] >= 0){                                             //
         //exist, so replace                                                                                           //
          var newNotification = user.notification;                                                                     //
         newNotification[notificationSetting.target] = notificationSetting;                                            //
         Users.update({_id:user._id},{$set:{"profile.notification":newNotification}},function(error){                  //
         if (error) {                                                                                                  //
         // display the error to the user                                                                              //
         throw new Meteor.Error(422, error.reason);                                                                    //
         }                                                                                                             //
          })                                                                                                           //
           } else {                                                                                                    //
         // does not exists, so push                                                                                   //
         Users.update({_id:user._id},{$push:{"profile.notification":notificationSetting}},function(error){             //
         if (error) {                                                                                                  //
         // display the error to the user                                                                              //
         throw new Meteor.Error(422, error.reason);                                                                    //
         }                                                                                                             //
          })                                                                                                           //
          }                                                                                                            //
           } else {                                                                                                    //
         // first notification, so update/create                                                                       //
         Users.update({_id:user._id},{$set:{"profile.notification":[notificationSetting]}},function(error){            //
         if (error) {                                                                                                  //
         // display the error to the user                                                                              //
         throw new Meteor.Error(422, error.reason);                                                                    //
         }                                                                                                             //
          })                                                                                                           //
          }                                                                                                            //
           },*/                                                                                                        //
        resendEnrollment: function () {                                                                                // 781
            function resendEnrollment(userID) {                                                                        // 781
                                                                                                                       //
                var user = Users.findOne({ _id: userID });                                                             // 783
                                                                                                                       //
                if (user) {                                                                                            // 785
                    var email = BuzzyGlobal.gGetUserEmail(user);                                                       // 786
                    var userData = {                                                                                   // 787
                                                                                                                       //
                        services: {                                                                                    // 789
                            password: {                                                                                // 790
                                reset: {                                                                               // 791
                                    "token": Random.secret(),                                                          // 792
                                    "email": email,                                                                    // 793
                                    "when": new Date().getTime()                                                       // 794
                                }                                                                                      // 791
                            }                                                                                          // 790
                        }                                                                                              // 789
                                                                                                                       //
                    };                                                                                                 // 787
                                                                                                                       //
                    Users.update({ _id: userID }, { $set: userData }, function (err) {                                 // 801
                        if (err) {                                                                                     // 802
                            BuzzyGlobal.throwError(err);                                                               // 803
                        } else {                                                                                       // 804
                            try {                                                                                      // 805
                                                                                                                       //
                                var createTemplateID;                                                                  // 807
                                var emailTemplate = 'activationEmail';                                                 // 808
                                if (Meteor.userId() && Meteor.userId() !== userID) {                                   // 809
                                    emailTemplate = 'inviteEmail';                                                     // 810
                                }                                                                                      // 811
                                                                                                                       //
                                var result = Mailer.send({                                                             // 815
                                    to: email, // 'To: ' address. Required.                                            // 816
                                    subject: "[Buzzy] Please activate your account.",                                  // 817
                                    //template: 'templateName',               // Required.                             // 818
                                    template: emailTemplate, // Required.                                              // 819
                                    replyTo: 'donotreply@buzzy.buzz', // Override global 'ReplyTo: ' option.           // 820
                                    from: "Do Not Reply" + "<donotreply@buzzy.buzz>", // Override global 'From: ' option.
                                    data: {                                                                            // 822
                                        token: userData.services.password.reset.token,                                 // 823
                                        fromUserID: Meteor.userId()                                                    // 824
                                                                                                                       //
                                    }                                                                                  // 822
                                });                                                                                    // 815
                            } catch (err) {                                                                            // 829
                                BuzzyGlobal.throwError(err);                                                           // 830
                            }                                                                                          // 831
                        }                                                                                              // 832
                    });                                                                                                // 833
                }                                                                                                      // 838
            }                                                                                                          // 842
                                                                                                                       //
            return resendEnrollment;                                                                                   // 781
        }(),                                                                                                           // 781
        sendEnrollmentEmail: function () {                                                                             // 843
            function sendEnrollmentEmail(userID, optCreateTemplateID, optRegoTop) {                                    // 843
                try {                                                                                                  // 844
                    var user = Users.findOne(userID);                                                                  // 845
                    if (!user) {                                                                                       // 846
                        BuzzyGlobal.throwError("User Not found - can't send enrollment email");                        // 847
                    }                                                                                                  // 848
                    var email = BuzzyGlobal.gGetUserEmail(user);                                                       // 849
                    var result = Mailer.send({                                                                         // 850
                        to: email, // 'To: ' address. Required.                                                        // 851
                        subject: "[Buzzy] Please activate your account.",                                              // 852
                        //template: 'templateName',               // Required.                                         // 853
                        template: 'activationEmail', // Required.                                                      // 854
                        replyTo: 'donotreply@buzzy.buzz', // Override global 'ReplyTo: ' option.                       // 855
                        from: "Do Not Reply" + "<donotreply@buzzy.buzz>", // Override global 'From: ' option.          // 856
                        data: {                                                                                        // 857
                            token: user.services.password.reset.token,                                                 // 858
                            createTemplateID: optCreateTemplateID,                                                     // 859
                            invitingResourceID: optRegoTop,                                                            // 860
                            fromUserID: user._id                                                                       // 861
                                                                                                                       //
                        }                                                                                              // 857
                    });                                                                                                // 850
                                                                                                                       //
                    Meteor.call("addToInvitedList", userID, "testOrigin");                                             // 866
                } catch (err) {                                                                                        // 869
                    BuzzyGlobal.throwError(err);                                                                       // 870
                }                                                                                                      // 871
            }                                                                                                          // 872
                                                                                                                       //
            return sendEnrollmentEmail;                                                                                // 843
        }(),                                                                                                           // 843
        userExists: function () {                                                                                      // 873
            function userExists(email) {                                                                               // 873
                /* if (typeof callback === "function") {                                                               // 874
                 // Call it, since we have confirmed it is callable​                                                   //
                 console.log("IN userHasAcceptedLicense: " + user._id + " accepted: " + user.acceptedLicense);         //
                 callback(user.acceptedLicense);                                                                       //
                 } else {                                                                                              //
                 console.log("IN userHasAcceptedLicense NOT A FUNCTION: " + user._id + " accepted: " + user.acceptedLicense);
                 callback(user.acceptedLicense);                                                                       //
                 }*/                                                                                                   //
                var user = Users.findOne({ $or: [{ "emails.address": email }, { email: email }] });                    // 882
                if (user) {                                                                                            // 883
                                                                                                                       //
                    return user._id;                                                                                   // 885
                } else {                                                                                               // 886
                    return false;                                                                                      // 887
                }                                                                                                      // 888
            }                                                                                                          // 892
                                                                                                                       //
            return userExists;                                                                                         // 873
        }(),                                                                                                           // 873
        addToHistory: function () {                                                                                    // 893
            function addToHistory(resourceID) {                                                                        // 893
                if (Meteor.userId()) {                                                                                 // 894
                    Users.addToHistory(resourceID);                                                                    // 895
                }                                                                                                      // 896
            }                                                                                                          // 898
                                                                                                                       //
            return addToHistory;                                                                                       // 893
        }(),                                                                                                           // 893
        addFavorite: function () {                                                                                     // 899
            function addFavorite(resourceID) {                                                                         // 899
                if (Meteor.userId()) {                                                                                 // 900
                    Users.addFavorite(resourceID);                                                                     // 901
                }                                                                                                      // 902
            }                                                                                                          // 904
                                                                                                                       //
            return addFavorite;                                                                                        // 899
        }(),                                                                                                           // 899
        removeFavorite: function () {                                                                                  // 905
            function removeFavorite(resourceID) {                                                                      // 905
                if (Meteor.userId()) {                                                                                 // 906
                    Users.removeFavorite(resourceID);                                                                  // 907
                }                                                                                                      // 908
            }                                                                                                          // 910
                                                                                                                       //
            return removeFavorite;                                                                                     // 905
        }(),                                                                                                           // 905
        clearHistory: function () {                                                                                    // 911
            function clearHistory() {                                                                                  // 911
                if (Meteor.userId()) {                                                                                 // 912
                    Users.clearHistory();                                                                              // 913
                }                                                                                                      // 914
            }                                                                                                          // 916
                                                                                                                       //
            return clearHistory;                                                                                       // 911
        }(),                                                                                                           // 911
        postRegisterEmail: function () {                                                                               // 917
            function postRegisterEmail(registeredEmail, createTemplateID) {                                            // 917
                var regex = new RegExp('^' + BuzzyGlobal.REGEX_EMAIL + '$', 'i');                                      // 918
                var match = registeredEmail.match(regex);                                                              // 919
                if (match) {                                                                                           // 920
                    //console.log("Meteor.call('userExists',registeredEmail )", Meteor.call("userExists",registeredEmail ));
                    Meteor.call("userExists", registeredEmail, function (error, result) {                              // 922
                                                                                                                       //
                        if (result) {                                                                                  // 924
                            //BuzzyGlobal.throwError("Email address is already a registered or invited user, please Sign In/Reset Password instead.");
                            Meteor.call("resendEnrollment", result);                                                   // 926
                        } else if (result === false) {                                                                 // 929
                            var newID = new Meteor.Collection.ObjectID()._str;                                         // 930
                                                                                                                       //
                            Meteor.call("inviteUser", newID, registeredEmail, null, createTemplateID, null, function (error, id) {
                                if (error) {                                                                           // 933
                                    // display the error to the user                                                   // 934
                                    throw new Meteor.Error(422, error.reason);                                         // 935
                                } else {                                                                               // 936
                                    BuzzyLogging.call("registerWithEmail", {                                           // 937
                                        userID: newID,                                                                 // 938
                                        email: registeredEmail                                                         // 939
                                    });                                                                                // 937
                                    analytics.identify(newID);                                                         // 941
                                                                                                                       //
                                    analytics.track("registerWithEmail", {                                             // 943
                                        userID: newID,                                                                 // 946
                                        email: registeredEmail                                                         // 947
                                                                                                                       //
                                    }, function () {                                                                   // 945
                                        return;                                                                        // 950
                                    });                                                                                // 951
                                    Meteor.call("sendEnrollmentEmail", newID, createTemplateID);                       // 953
                                }                                                                                      // 957
                            });                                                                                        // 958
                        }                                                                                              // 959
                    });                                                                                                // 960
                } else {                                                                                               // 963
                    BuzzyGlobal.throwError("Please enter a valid email address");                                      // 964
                };                                                                                                     // 965
            }                                                                                                          // 966
                                                                                                                       //
            return postRegisterEmail;                                                                                  // 917
        }(),                                                                                                           // 917
        "getUserByToken": function () {                                                                                // 967
            function getUserByToken(loginToken) {                                                                      // 967
                var hashedToken = loginToken && Accounts._hashLoginToken(loginToken);                                  // 968
                var selector = { 'services.resume.loginTokens.hashedToken': hashedToken };                             // 969
                var options = { fields: { _id: 1 } };                                                                  // 970
                                                                                                                       //
                var user = Meteor.users.findOne(selector, options);                                                    // 972
                return user ? user._id : null;                                                                         // 973
            }                                                                                                          // 974
                                                                                                                       //
            return getUserByToken;                                                                                     // 967
        }(),                                                                                                           // 967
        userAddWatsonCredential: function () {                                                                         // 975
            function userAddWatsonCredential(optUserToken) {                                                           // 975
                                                                                                                       //
                var user = BuzzyGlobal.getCurrentUser(optUserToken);                                                   // 977
                                                                                                                       //
                if (user) {                                                                                            // 979
                    var newCred = {                                                                                    // 980
                        _id: new Meteor.Collection.ObjectID()._str,                                                    // 981
                        watsonAtID: '',                                                                                // 982
                        watsonUserID: '',                                                                              // 983
                        watsonPassword: '',                                                                            // 984
                        watsonWorkspaceID: ''                                                                          // 985
                                                                                                                       //
                    };                                                                                                 // 980
                    var watsonCreds = user.watsonCreds;                                                                // 988
                    if (watsonCreds) {                                                                                 // 989
                        watsonCreds.push(newCred);                                                                     // 990
                    } else {                                                                                           // 992
                        watsonCreds = [newCred];                                                                       // 993
                    }                                                                                                  // 994
                    Users.update({ _id: user._id }, { $set: { watsonCreds: watsonCreds } }, function (error) {         // 995
                                                                                                                       //
                        if (error) {                                                                                   // 1001
                            // display the error to the user - Need to come back to fix 422 (not sure what # it should be???) as the error number
                            throw new Meteor.Error(422, error.reason);                                                 // 1003
                        } else {                                                                                       // 1004
                            console.log('added Watson  User Creds', watsonCreds);                                      // 1005
                        }                                                                                              // 1006
                    });                                                                                                // 1007
                }                                                                                                      // 1010
            }                                                                                                          // 1011
                                                                                                                       //
            return userAddWatsonCredential;                                                                            // 975
        }(),                                                                                                           // 975
        userUpdateWatsonCredentials: function () {                                                                     // 1012
            function userUpdateWatsonCredentials(watsonItemID, creds, optUserToken) {                                  // 1012
                check(watsonItemID, String);                                                                           // 1013
                check(creds, Object);                                                                                  // 1014
                var user = BuzzyGlobal.getCurrentUser(optUserToken);                                                   // 1015
                                                                                                                       //
                if (user) {                                                                                            // 1017
                    Users.update({ _id: user._id, "watsonCreds._id": watsonItemID }, { $set: { "watsonCreds.$": creds } }, function (error) {
                                                                                                                       //
                        if (error) {                                                                                   // 1024
                            // display the error to the user - Need to come back to fix 422 (not sure what # it should be???) as the error number
                            throw new Meteor.Error(422, error.reason);                                                 // 1026
                        } else {                                                                                       // 1027
                            console.log('updated Watson Creds', creds);                                                // 1028
                        }                                                                                              // 1029
                    });                                                                                                // 1030
                }                                                                                                      // 1032
            }                                                                                                          // 1033
                                                                                                                       //
            return userUpdateWatsonCredentials;                                                                        // 1012
        }(),                                                                                                           // 1012
        userRemoveWatsonCredentials: function () {                                                                     // 1034
            function userRemoveWatsonCredentials(watsonItemID, optUserToken) {                                         // 1034
                check(watsonItemID, String);                                                                           // 1035
                var user = BuzzyGlobal.getCurrentUser(optUserToken);                                                   // 1036
                                                                                                                       //
                if (user) {                                                                                            // 1038
                    Users.update({ _id: user._id, "watsonCreds._id": watsonItemID }, { $pull: { "watsonCreds": { _id: watsonItemID } } }, function (error) {
                                                                                                                       //
                        if (error) {                                                                                   // 1045
                            // display the error to the user - Need to come back to fix 422 (not sure what # it should be???) as the error number
                            throw new Meteor.Error(422, error.reason);                                                 // 1047
                        } else {                                                                                       // 1048
                            console.log('pull Watson Creds', watsonItemID);                                            // 1049
                        }                                                                                              // 1050
                    });                                                                                                // 1051
                }                                                                                                      // 1053
            }                                                                                                          // 1054
                                                                                                                       //
            return userRemoveWatsonCredentials;                                                                        // 1034
        }()                                                                                                            // 1034
                                                                                                                       //
    });                                                                                                                // 5
}                                                                                                                      // 1058
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]}}}},{"extensions":[".js",".json"]});
require("./node_modules/meteor/buzzy-buzz:resources-core/lib/logging.js");
require("./node_modules/meteor/buzzy-buzz:resources-core/lib/collections/resources.js");
require("./node_modules/meteor/buzzy-buzz:resources-core/resources-core.js");
require("./node_modules/meteor/buzzy-buzz:resources-core/lib/collections/usercontacts.js");
require("./node_modules/meteor/buzzy-buzz:resources-core/lib/collections/external_data.js");
require("./node_modules/meteor/buzzy-buzz:resources-core/lib/collections/external_rest_data.js");
require("./node_modules/meteor/buzzy-buzz:resources-core/lib/collections/micro_app_data.js");
require("./node_modules/meteor/buzzy-buzz:resources-core/lib/collections/micro_app_fields.js");
require("./node_modules/meteor/buzzy-buzz:resources-core/lib/collections/micro_app_votes.js");
require("./node_modules/meteor/buzzy-buzz:resources-core/lib/collections/micro_app_child.js");
require("./node_modules/meteor/buzzy-buzz:resources-core/lib/collections/micro_app_action_rules.js");
require("./node_modules/meteor/buzzy-buzz:resources-core/lib/collections/collection_globals.js");
require("./node_modules/meteor/buzzy-buzz:resources-core/lib/collections/teams.js");
require("./node_modules/meteor/buzzy-buzz:resources-core/lib/collections/team_members.js");
require("./node_modules/meteor/buzzy-buzz:resources-core/lib/collections/comments.js");
require("./node_modules/meteor/buzzy-buzz:resources-core/lib/collections/commentsViewed.js");
require("./node_modules/meteor/buzzy-buzz:resources-core/lib/collections/notifications.js");
require("./node_modules/meteor/buzzy-buzz:resources-core/server/notifications.js");
require("./node_modules/meteor/buzzy-buzz:resources-core/server/campaignmonitor.js");
require("./node_modules/meteor/buzzy-buzz:resources-core/lib/collections/resourcefollowers.js");
require("./node_modules/meteor/buzzy-buzz:resources-core/lib/collections/users.js");
require("./node_modules/meteor/buzzy-buzz:resources-core/users.js");
require("./node_modules/meteor/buzzy-buzz:resources-core/server/indices.js");
require("./node_modules/meteor/buzzy-buzz:resources-core/server/teams.js");
require("./node_modules/meteor/buzzy-buzz:resources-core/server/teamMembers.js");
require("./node_modules/meteor/buzzy-buzz:resources-core/server/payment_history.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['buzzy-buzz:resources-core'] = {}, {
  BuzzyLogging: BuzzyLogging,
  Resources: Resources,
  ResourceFollowers: ResourceFollowers,
  UserContacts: UserContacts,
  Users: Users,
  Notifications: Notifications,
  Comments: Comments,
  CommentsViewed: CommentsViewed,
  MicroAppData: MicroAppData,
  MicroAppFields: MicroAppFields,
  MicroAppVotes: MicroAppVotes,
  MicroAppChild: MicroAppChild,
  MicroAppActionRules: MicroAppActionRules,
  ExternalData: ExternalData,
  ExternalRestData: ExternalRestData,
  PaymentHistory: PaymentHistory,
  Teams: Teams,
  TeamMembers: TeamMembers
});

})();

//# sourceMappingURL=buzzy-buzz_resources-core.js.map
