/*
 * ************************************************************************
 *
 *  ADOBE CONFIDENTIAL
 *  ___________________
 *
 *   (c) Copyright 2014 Adobe Systems Incorporated
 *   All Rights Reserved.
 *
 *  NOTICE:  All information contained herein is, and remains
 *  the property of Adobe Systems Incorporated and its suppliers,
 *  if any.  The intellectual and technical concepts contained
 *  herein are proprietary to Adobe Systems Incorporated and its
 *  suppliers and may be covered by U.S. and Foreign Patents,
 *  patents in process, and are protected by trade secret or copyright law.
 *  Dissemination of this information or reproduction of this material
 *  is strictly forbidden unless prior written permission is obtained
 *  from Adobe Systems Incorporated.
 * ************************************************************************
 */

/*
 * video heartbeats - v1.4.0 - 2014-10-23
 * Copyright (c) 2014 Adobe Systems, Inc. All Rights Reserved.
 */
(function(global) {
if (typeof utils === 'undefined') {
    var utils = {};
}

if (typeof va === 'undefined') {
    var va = {};
}

if (typeof core === 'undefined') {
    var core = {};
}

core.radio || (core.radio = {});
core.plugin || (core.plugin = {});
if (typeof plugins === 'undefined') {
    var plugins = {};
}
if (typeof heartbeat === 'undefined') {
    var heartbeat = {};
}

heartbeat.event || (heartbeat.event = {});

heartbeat.model || (heartbeat.model = {});

heartbeat.context || (heartbeat.context = {});

heartbeat.network || (heartbeat.network = {});

heartbeat.clock || (heartbeat.clock = {});

/*jslint bitwise: true */
/*global unescape, define, utils */

(function (utils) {
    'use strict';

    /*
     * Add integers, wrapping at 2^32. This uses 16-bit operations internally
     * to work around bugs in some JS interpreters.
     */
    function safe_add(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF),
            msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }

    /*
     * Bitwise rotate a 32-bit number to the left.
     */
    function bit_rol(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    }

    /*
     * These functions implement the four basic operations the algorithm uses.
     */
    function md5_cmn(q, a, b, x, s, t) {
        return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
    }
    function md5_ff(a, b, c, d, x, s, t) {
        return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }
    function md5_gg(a, b, c, d, x, s, t) {
        return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }
    function md5_hh(a, b, c, d, x, s, t) {
        return md5_cmn(b ^ c ^ d, a, b, x, s, t);
    }
    function md5_ii(a, b, c, d, x, s, t) {
        return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
    }

    /*
     * Calculate the MD5 of an array of little-endian words, and a bit length.
     */
    function binl_md5(x, len) {
        /* append padding */
        x[len >> 5] |= 0x80 << (len % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;

        var i, olda, oldb, oldc, oldd,
            a =  1732584193,
            b = -271733879,
            c = -1732584194,
            d =  271733878;

        for (i = 0; i < x.length; i += 16) {
            olda = a;
            oldb = b;
            oldc = c;
            oldd = d;

            a = md5_ff(a, b, c, d, x[i],       7, -680876936);
            d = md5_ff(d, a, b, c, x[i +  1], 12, -389564586);
            c = md5_ff(c, d, a, b, x[i +  2], 17,  606105819);
            b = md5_ff(b, c, d, a, x[i +  3], 22, -1044525330);
            a = md5_ff(a, b, c, d, x[i +  4],  7, -176418897);
            d = md5_ff(d, a, b, c, x[i +  5], 12,  1200080426);
            c = md5_ff(c, d, a, b, x[i +  6], 17, -1473231341);
            b = md5_ff(b, c, d, a, x[i +  7], 22, -45705983);
            a = md5_ff(a, b, c, d, x[i +  8],  7,  1770035416);
            d = md5_ff(d, a, b, c, x[i +  9], 12, -1958414417);
            c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
            b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = md5_ff(a, b, c, d, x[i + 12],  7,  1804603682);
            d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = md5_ff(b, c, d, a, x[i + 15], 22,  1236535329);

            a = md5_gg(a, b, c, d, x[i +  1],  5, -165796510);
            d = md5_gg(d, a, b, c, x[i +  6],  9, -1069501632);
            c = md5_gg(c, d, a, b, x[i + 11], 14,  643717713);
            b = md5_gg(b, c, d, a, x[i],      20, -373897302);
            a = md5_gg(a, b, c, d, x[i +  5],  5, -701558691);
            d = md5_gg(d, a, b, c, x[i + 10],  9,  38016083);
            c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = md5_gg(b, c, d, a, x[i +  4], 20, -405537848);
            a = md5_gg(a, b, c, d, x[i +  9],  5,  568446438);
            d = md5_gg(d, a, b, c, x[i + 14],  9, -1019803690);
            c = md5_gg(c, d, a, b, x[i +  3], 14, -187363961);
            b = md5_gg(b, c, d, a, x[i +  8], 20,  1163531501);
            a = md5_gg(a, b, c, d, x[i + 13],  5, -1444681467);
            d = md5_gg(d, a, b, c, x[i +  2],  9, -51403784);
            c = md5_gg(c, d, a, b, x[i +  7], 14,  1735328473);
            b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

            a = md5_hh(a, b, c, d, x[i +  5],  4, -378558);
            d = md5_hh(d, a, b, c, x[i +  8], 11, -2022574463);
            c = md5_hh(c, d, a, b, x[i + 11], 16,  1839030562);
            b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = md5_hh(a, b, c, d, x[i +  1],  4, -1530992060);
            d = md5_hh(d, a, b, c, x[i +  4], 11,  1272893353);
            c = md5_hh(c, d, a, b, x[i +  7], 16, -155497632);
            b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = md5_hh(a, b, c, d, x[i + 13],  4,  681279174);
            d = md5_hh(d, a, b, c, x[i],      11, -358537222);
            c = md5_hh(c, d, a, b, x[i +  3], 16, -722521979);
            b = md5_hh(b, c, d, a, x[i +  6], 23,  76029189);
            a = md5_hh(a, b, c, d, x[i +  9],  4, -640364487);
            d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = md5_hh(c, d, a, b, x[i + 15], 16,  530742520);
            b = md5_hh(b, c, d, a, x[i +  2], 23, -995338651);

            a = md5_ii(a, b, c, d, x[i],       6, -198630844);
            d = md5_ii(d, a, b, c, x[i +  7], 10,  1126891415);
            c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = md5_ii(b, c, d, a, x[i +  5], 21, -57434055);
            a = md5_ii(a, b, c, d, x[i + 12],  6,  1700485571);
            d = md5_ii(d, a, b, c, x[i +  3], 10, -1894986606);
            c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = md5_ii(b, c, d, a, x[i +  1], 21, -2054922799);
            a = md5_ii(a, b, c, d, x[i +  8],  6,  1873313359);
            d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = md5_ii(c, d, a, b, x[i +  6], 15, -1560198380);
            b = md5_ii(b, c, d, a, x[i + 13], 21,  1309151649);
            a = md5_ii(a, b, c, d, x[i +  4],  6, -145523070);
            d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = md5_ii(c, d, a, b, x[i +  2], 15,  718787259);
            b = md5_ii(b, c, d, a, x[i +  9], 21, -343485551);

            a = safe_add(a, olda);
            b = safe_add(b, oldb);
            c = safe_add(c, oldc);
            d = safe_add(d, oldd);
        }
        return [a, b, c, d];
    }

    /*
     * Convert an array of little-endian words to a string
     */
    function binl2rstr(input) {
        var i,
            output = '';
        for (i = 0; i < input.length * 32; i += 8) {
            output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
        }
        return output;
    }

    /*
     * Convert a raw string to an array of little-endian words
     * Characters >255 have their high-byte silently ignored.
     */
    function rstr2binl(input) {
        var i,
            output = [];
        output[(input.length >> 2) - 1] = undefined;
        for (i = 0; i < output.length; i += 1) {
            output[i] = 0;
        }
        for (i = 0; i < input.length * 8; i += 8) {
            output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
        }
        return output;
    }

    /*
     * Calculate the MD5 of a raw string
     */
    function rstr_md5(s) {
        return binl2rstr(binl_md5(rstr2binl(s), s.length * 8));
    }

    /*
     * Calculate the HMAC-MD5, of a key and some data (raw strings)
     */
    function rstr_hmac_md5(key, data) {
        var i,
            bkey = rstr2binl(key),
            ipad = [],
            opad = [],
            hash;
        ipad[15] = opad[15] = undefined;
        if (bkey.length > 16) {
            bkey = binl_md5(bkey, key.length * 8);
        }
        for (i = 0; i < 16; i += 1) {
            ipad[i] = bkey[i] ^ 0x36363636;
            opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }
        hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
        return binl2rstr(binl_md5(opad.concat(hash), 512 + 128));
    }

    /*
     * Convert a raw string to a hex string
     */
    function rstr2hex(input) {
        var hex_tab = '0123456789abcdef',
            output = '',
            x,
            i;
        for (i = 0; i < input.length; i += 1) {
            x = input.charCodeAt(i);
            output += hex_tab.charAt((x >>> 4) & 0x0F) +
                hex_tab.charAt(x & 0x0F);
        }
        return output;
    }

    /*
     * Encode a string as utf-8
     */
    function str2rstr_utf8(input) {
        return unescape(encodeURIComponent(input));
    }

    /*
     * Take string arguments and return either raw or hex encoded strings
     */
    function raw_md5(s) {
        return rstr_md5(str2rstr_utf8(s));
    }
    function hex_md5(s) {
        return rstr2hex(raw_md5(s));
    }
    function raw_hmac_md5(k, d) {
        return rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d));
    }
    function hex_hmac_md5(k, d) {
        return rstr2hex(raw_hmac_md5(k, d));
    }

    function md5(string, key, raw) {
        if (!key) {
            if (!raw) {
                return hex_md5(string);
            }
            return raw_md5(string);
        }
        if (!raw) {
            return hex_hmac_md5(key, string);
        }
        return raw_hmac_md5(key, string);
    }

    if (typeof define === 'function' && define.amd) {
        define(function () {
            return md5;
        });
    } else {
        utils.md5 = md5;
    }
}(utils));

(function(va) {
    'use strict';

    var PLATFORM = "js";

    var MAJOR = "1";
    var MINOR = "4";
    var MICRO = "0";
    var PATCH = "1";
    var BUILD = "6995d33";
    var API_LEVEL = 2;

    /**
     * Container for library version information.
     *
     * @constructor
     */
    var Version = {};

    /**
     * The current version of the library.
     *
     * This has the following format: $platform-$major.$minor.$micro.$patch-$build
     */
    Version.getVersion = function() {
        return PLATFORM + "-" + MAJOR + "." + MINOR + "." + MICRO + "." + PATCH + "-" + BUILD;
    };

    /**
     * The major version.
     */
    Version.getMajor = function() {
        return MAJOR;
    };

    /**
     * The minor version.
     */
    Version.getMinor = function() {
        return MINOR;
    };

    /**
     * The micro version.
     */
    Version.getMicro = function() {
        return MICRO;
    };

    /**
     * The patch number.
     */
    Version.getPatch = function() {
        return PATCH;
    };

    /**
     * The build identifier.
     */
    Version.getBuild = function() {
        return BUILD;
    };

    /**
     * The API level.
     */
    Version.getApiLevel = function() {
        return API_LEVEL;
    };

    // Export symbols.
    va.Version = Version;
})(va);


(function(core) {
    'use strict';

    /**
     * Implements the "inheritance"-like functionality. Inspired by
     * by CoffeeScript-generated code.
     *
     * @param {Function} child Constructor function for the "child" class.
     *
     * @param {Function} parent Constructor function for the "parent" class.
     *
     * @returns {Function} Constructor function for the newly enhanced "child" class.
     */
    function extend(child, parent) {
        // Transfer all properties from the "parent" to the "child".
        for (var key in parent) {
            if (parent.hasOwnProperty(key)) child[key] = parent[key];
        }

        // Wrapper constructor function for the "child" class.
        function Constructor() {
            this.constructor = child;
        }

        // Make the proper connections.
        Constructor.prototype = parent.prototype;
        child.prototype = new Constructor();
        child.__super__ = parent.prototype;

        return child;
    }

    // Export symbols.
    core.extend = extend;
})(core);

(function(core) {
    'use strict';

    /**
     * Implements the "mixin"-like functionality (similar with Ruby's mixin).
     * Inspired by underscore.js implementation.
     *
     * @param {Object} to Destination object (where to mixin the methods).
     *
     * @param {Object} from Source object (where to take the mixin methods from).
     */
    function mixin(to, from) {
        // Scrape all functions
        var fnNames = [];
        for (var key in from) {
            if (from.hasOwnProperty(key) && (typeof from[key] === "function")) {
                fnNames.push(key);
            }
        }

        // Bind all scraped functions to the destination constructor function.
        for (var i = 0; i < fnNames.length; i++) {
            var fnName = fnNames[i];
            to.prototype[fnName] = from[fnName];
        }
    }

    // Export symbols.
    core.mixin = mixin;
})(core);

(function(core) {
    'use strict';

    core.LOGGING_ENABLED = false;

    core.logger = {
        enableLogging: function(label) {
            this._logEnabled = true;
            this._logTag = label;
        },

        disableLogging: function() {
            this._logEnabled = false;
        },

        log: function(msg) {
            if (!core.LOGGING_ENABLED || !this._logEnabled) return;

            if (window["console"] && window["console"]["log"]) {
                window["console"]["log"](this._logTag + msg);
            }
        },

        info: function(msg) {
            if (!core.LOGGING_ENABLED || !this._logEnabled) return;

            if (window["console"] && window["console"]["info"]) {
                window["console"]["info"](this._logTag + msg);
            }
        },

        warn: function(msg) {
            if (!core.LOGGING_ENABLED || !this._logEnabled) return;

            if (window["console"] && window["console"]["warn"]) {
                window["console"]["warn"](this._logTag + msg);
            }
        },

        error: function(msg) {
            // We always display the error messages.

            if (window["console"] && window["console"]["error"]) {
                msg = this._logTag + msg;
                window["console"]["error"](msg);
                throw new Error(msg);
            }
        }
    };
})(core);

(function(core, va) {
    'use strict';

    function InputDataSanitizer(onFail, ctx) {
        this._onFail = {
            fn: onFail,
            ctx: ctx
        };
    }

    InputDataSanitizer.prototype.sanitizeVideoInfo = function(videoInfo) {
        if (!videoInfo) {
            return this._fail("VideoInfo cannot be null");
        }

        var errorString = getVideoInfoErrorString(videoInfo);
        if (errorString) {
            return this._fail(errorString);
        }

        return true;
    };

    InputDataSanitizer.prototype.sanitizeAdBreakInfo = function(adBreakInfo, allowNull) {
        if (!allowNull && !adBreakInfo) {
            return this._fail("AdBreakInfo cannot be null");
        }

        var errorString = getAdBreakInfoErrorString(adBreakInfo);
        if (errorString) {
            return this._fail(errorString);
        }

        return true;
    };

    InputDataSanitizer.prototype.sanitizeAdInfo = function(adInfo, allowNull) {
        if (!allowNull && !adInfo) {
            return this._fail("AdInfo cannot be null");
        }

        var errorString = getAdInfoErrorString(adInfo);
        if (errorString) {
            return this._fail(errorString);
        }

        return true;
    };

    InputDataSanitizer.prototype.sanitizeChapterInfo = function(chapterInfo, allowNull) {
        if (!allowNull && !chapterInfo) {
            return this._fail("ChapterInfo cannot be null");
        }

        var errorString = getChapterInfoErrorString(chapterInfo);
        if (errorString) {
            return this._fail(errorString);
        }

        return true;
    };


    //
    //---------------------[ Private helper functions ]-----------------------
    //

    InputDataSanitizer.prototype._fail = function(errorString) {
        var errorInfo = new va.ErrorInfo("Invalid input data", errorString);

        if (this._onFail.fn) {
            this._onFail.fn.call(this._onFail.ctx, errorInfo);
        }

        return false;
    };


    //
    //---------------------[ Static helper functions ]-----------------------
    //

    function getVideoInfoErrorString(videoInfo) {
        if (videoInfo) {
            if (videoInfo.id == null || videoInfo.id === "") {
                return "Video ID cannot be null or empty string";
            }

            if (videoInfo.streamType != va.ASSET_TYPE_VOD &&
                videoInfo.streamType != va.ASSET_TYPE_LIVE &&
                videoInfo.streamType != va.ASSET_TYPE_LINEAR) {
                return "Stream type must be one of " +
                    va.ASSET_TYPE_VOD + ", " +
                    va.ASSET_TYPE_LIVE + ", " +
                    va.ASSET_TYPE_LINEAR;
            }

            if (videoInfo.length == null || isNaN(videoInfo.length)) {
                return "Video length cannot be null or NaN";
            }

            if (videoInfo.playhead == null || isNaN(videoInfo.playhead)) {
                return "Video playhead cannot be null or NaN";
            }

            if (videoInfo.playerName == null || videoInfo.playerName === "") {
                return "Video player-name cannot be null or empty string.";
            }
        }
        return null;
    }

    function getAdBreakInfoErrorString(adBreakInfo) {
        if (adBreakInfo) {
            if (adBreakInfo.playerName == null || adBreakInfo.playerName === "") {
                return "Ad-break player-name cannot be null or empty string";
            }

            if (adBreakInfo.position == null || isNaN(adBreakInfo.position)) {
                return "Ad-break position cannot be null or NaN";
            }
        }

        return null;
    }

    function getAdInfoErrorString(adInfo) {
        if (adInfo) {
            if (adInfo.id == null || adInfo.id === "") {
                return "Ad ID cannot be null or empty string";
            }

            if (adInfo.position == null || isNaN(adInfo.position)) {
                return "Ad position cannot be null or NaN";
            }

            if (adInfo.length == null || isNaN(adInfo.length)) {
                return "Ad length cannot be null or NaN";
            }
        }

        return null;
    }

    function getChapterInfoErrorString(chapterInfo) {
        if (chapterInfo) {
            if (chapterInfo.position == null || isNaN(chapterInfo.position)) {
                return "Chapter position cannot be null or NaN";
            }

            if (chapterInfo.startTime == null || isNaN(chapterInfo.startTime)) {
                return "Chapter offset (start-time) cannot be null or NaN";
            }

            if (chapterInfo.length == null || isNaN(chapterInfo.length)) {
                return "Chapter length cannot be null or NaN";
            }
        }

        return null;
    }

    // Export symbols.
    core.InputDataSanitizer = InputDataSanitizer;

})(core, va);
(function(core) {
    'use strict';

    /**
     * Generic event class. Each event is uniquely identified by
     * a "type" (a string value). An arbitrary object is attached to the event as a means
     * to pass data around between the event producer and the event consumer.
     *
     * @constructor
     *
     * @param {string} type Unique string value identifying the event.
     * @param {Object} data Arbitrary object attached to the event.
     */
    function Event(type, data) {
        this.type = type;
        this.data = data;
    }

    /**
     * Triggered when an async. operation completes successfully.
     *
     * @const
     */
    Event.SUCCESS = "success";

    /**
     * Triggered when an async. operation fails.
     *
     * @const
     */
    Event.ERROR = "error";

    // Export symbols.
    core.radio.Event = Event;
})(core);

(function(core) {
    'use strict';

    function Command(fn, ctx, params) {
        this.fn = fn;
        this.ctx = ctx;
        this.params = params;
    }

    Command.prototype.run = function() {
        this.fn.apply(this.ctx, this.params);
    };

    // Export symbols.
    core.radio.Command = Command;
})(core);
(function(core) {
    'use strict';

    function CommandQueue(suspended, delay) {
        this._queue = [];
        this._drainInProgress = false;

        this._isSuspended = (typeof suspended !== "undefined") ? suspended : false;
        this._delay = (typeof delay !== "undefined") ? delay : 0;
    }

    //
    //---------------------[ Public API ]---------------------
    //
    CommandQueue.prototype.addCommand = function(command) {
        this._queue.push(command);
        this._drain();
    };

    // TODO: re-init drainInProgress, isSuspended?
    CommandQueue.prototype.cancelAllCommands = function() {
        this._queue = [];
    };

    CommandQueue.prototype.isEmpty = function() {
        return (this._queue.length === 0);
    };

    CommandQueue.prototype.suspend = function() {
        this._isSuspended = true;
    };

    CommandQueue.prototype.resume = function() {
        this._isSuspended = false;
        this._drain();
    };

    // TODO: clear after running?
    // TODO: race condition with drain?
    CommandQueue.prototype.flush = function() {
        this._isSuspended = false;

        for (var i = 0; i < this._queue.length; i++) {
           this._queue[i].run();
        }

        // Reset the queue
        this._queue = [];
    };

    //
    // -------------------[ Private helper methods ]-----------------------
    //

    // Executes sequentially all the commands in the current queue
    // Guarantees commands to be executed in the order they've been inserted
    CommandQueue.prototype._drain = function() {
        if (this._isSuspended || this._drainInProgress) return;

        this._drainInProgress = true;

        var self = this;
        (function _drain() {
            var command = self._queue.shift();

            if (command) {
                self._runCommand(command, function() {
                    if (self._isSuspended) return;
                    _drain();
                });
            } else {
                self._drainInProgress = false;
            }
        })();
    };

    // Executes command after the queue delay, then executes callback
    // TODO: split into delay(fn, delay) and runWithCallback(fn, callback)
    CommandQueue.prototype._runCommand = function(command, done) {
        var self = this;
        window.setTimeout(function() {
            command.run();

            if (done != null) {
                done.call(self);
            }
        }, this._delay);
    };

    // Export symbols.
    core.radio.CommandQueue = CommandQueue;
})(core);
(function(core) {
    'use strict';

    var mixin = core.mixin;
    var logger = core.logger;

    mixin(Channel, logger);

    Channel.WILDCARD  = "*";
    Channel.SEPARATOR = ":";

    function Channel(name) {
        this._name = name;
        this._listeners = {}; // a cache of event listeners
        this._requests = {};
        this._commands = {};

        this.enableLogging('[radio::Channel] > ');
    }

    //
    //---------------------[ Public API ]---------------------
    //
    Channel.prototype.toString = function() {
        return '<channel: ' + this._name + '>';
    };

    Channel.prototype.shutdown = function() {
        this.log('#shutdown > Shutting down');

        // Unregister all event handlers.
        this.off();

        // Unregister all request and command handlers.
        this._requests = {};
        this._commands = {};
    };

    // Event emitter APIs
    Channel.prototype.on = function(eventType, listener, ctx) {
        // We need to keep track of all added listener functions
        if (!this._listeners[eventType]) {
            this._listeners[eventType] = [];
        }
        this._listeners[eventType].push({fn: listener, ctx: ctx});
    };

    Channel.prototype.off = function(eventType, listener, ctx) {
        listener = (typeof listener === "function") ? listener : null;

        // Fast exit: removing ALL listeners
        if (!eventType && listener === null && !ctx) {
            this._listeners = {};
            return;
        }

        if (!eventType) { // we remove all registered listeners.
            for (eventType in this._listeners) {
                if (this._listeners.hasOwnProperty(eventType)) {
                    this._removeListener(eventType, listener, ctx);
                }
            }
        } else {
            this._removeListener(eventType, listener, ctx);
        }
    };

    Channel.prototype.trigger = function(event) {
        for (var eventType in this._listeners) {
            if (this._listeners.hasOwnProperty(eventType)) {
                if (this._matchWildcard(eventType, event.type)) {
                    var cbs = this._listeners[eventType];
                    var copyOnWrite = cbs.slice(0);
                    var length = copyOnWrite.length;

                    for (var i = 0; i < length; i++) {
                        var cb = copyOnWrite[i];
                        cb.fn.call(cb.ctx, event);
                    }
                }
            }
        }
    };

    // Commands APIs

    // registers a command handler
    Channel.prototype.comply = function(name, cmd, ctx) {
        this._commands[name] = {
            cmd: cmd,
            ctx: ctx
        };
    };

    Channel.prototype.command = function(name) {
        var func = this._commands[name];
        if (!func) {
            this.warn("#command > No command handler for: " + name);
            return;
        }

        // pass all the args after name to the command handler
        // TODO: change to explicit args param if slice/arguments is not portable
        var args = Array.prototype.slice.call(arguments, 1);
        func.cmd.apply(func.ctx, args);
    };

    // Request Response APIs

    // registers a response to a request for "what"
    Channel.prototype.reply = function(what, response, ctx) {
        // TODO: rename response to func
        this._requests[what] = {
            response: response,
            ctx: ctx
        };
    };

    // TODO: Add support for args similar to #command
    Channel.prototype.request = function(what) {
        var reply = this._requests[what];
        if (!reply) {
            this.warn("#request > No request handler for: " + what);
            return null;
        }

        return reply.response.call(reply.ctx);
    };

    //
    // -------------------[ Private helper methods ]-----------------------
    //

    // eventType is mandatory, Channel#off will always provide it
    // both fn and ctx are optional
    Channel.prototype._removeListener = function(eventType, fn, ctx) {
        fn = (typeof fn === "function") ? fn : null;

        var cbs = this._listeners[eventType];

        // fast exit
        if (!cbs) return;

        // if both fn ctx are missing, remove all listeners for specified eventType
        if ((!cbs.length) || (fn == null && !ctx)) {
            delete this._listeners[eventType];
            return;
        }

        for (var i = 0; i < cbs.length; i++) {
            var cb = cbs[i];

            // at least one param is a match
            if ((fn === null || fn === cb.fn) && (!ctx || ctx === cb.ctx)) {
                this._listeners[eventType].splice(i,1);
            }
        }
    };

    // examples: plugin:* ~= plugin:initialized, *:init ~= adobe-analytics:init, * ~= anything ...
    Channel.prototype._matchWildcard = function(wildcard, test) {
        // Fast exit
        if (wildcard === test) return true;

        // break the 2 inputs into parts then match each part
        var parts = (wildcard || '').split(Channel.SEPARATOR),
            testParts = (test || '').split(Channel.SEPARATOR),
            match = true;

        for (var i = 0; i < parts.length; i++) {
            match = match && (parts[i] === Channel.WILDCARD || parts[i] === testParts[i]);
        }

        return match;
    };

    // Export symbols.
    core.radio.Channel = Channel;
})(core);
(function(core) {
    'use strict';

    var Channel = core.radio.Channel;

    function Radio() {
        // Start with an empty channel list.
        this._channels = {};
    }

    //
    //---------------------[ Public API ]---------------------
    //
    Radio.prototype.channel = function(name) {
        if (!this._channels[name]) {
            this._channels[name] = new Channel(name);
        }

        return this._channels[name];
    };

    Radio.prototype.shutdown = function() {
        for (var name in this._channels) {
            if (this._channels.hasOwnProperty(name)) {
                this._channels[name].shutdown();
            }
        }
    };

    // Export symbols.
    core.radio.Radio = Radio;
})(core);
(function(core) {
    'use strict';

    /**
     * A generic event dispatcher. It emulates the functionality (and public API)
     * of the EventDispatcher class exposed by the Flash run-time.
     *
     * @constructor
     */
    function EventDispatcher() {
        this._events = {};
    }

    /**
     * Register an event-listener method to the event dispatcher.
     *
     * @param {string} type Unique string value identifying the event.
     *
     * @param {Function} listener Function that will be called when the event is dispatched.
     *
     * @param {Object} context Context in which the listener method is called.
     *
     */
    EventDispatcher.prototype.addEventListener = function(type, listener, context) {
        if (!type || !listener) return;
        context = context || window;

        this._events[type] = (this._events[type] || []);
        this._events[type].push({cb: listener, ctx: context});
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Un-register an event-listener method to the event dispatcher.
     *
     * NOTE: for an event listener to be removed all the three coordinates must match
     * (type, method and context) with the values provided during registration.
     *
     * @param {string} type Unique string value identifying the event.
     *
     * @param {Function} listener Function that will be called when the event is dispatched.
     *
     * @param {Object} context Context in which the listener method is called.
     */
    EventDispatcher.prototype.removeEventListener = function(type, listener, context) {
        if (!type || !listener) return;
        context = context || window;

        // Check to see if the event type was registered with us.
        var i, key, isTypeRegistered = false;
        for (key in this._events) {
            if (type === key) {
                isTypeRegistered = true;
                break;
            }
        }

        // This event type was not registered with us. Just exit.
        if (!isTypeRegistered) return;

        // Search for the target event listener
        for (i = this._events[key].length - 1; i >= 0; i--) {
            var _listener = this._events[key][i];
            if (listener === _listener.cb && context === _listener.ctx) {
                this._events[key].splice(i, 1);
            }
        }

        // If we are left with an empty list of listeners for a particular
        // event type, we delete it.
        if (!this._events[key].length) delete this._events[key];
    };

    /**
     * Dispatch en event. It goes through the entire list of listener methods that are registered
     * for the target event and calls that function in the specified context.
     *
     * @param {core.radio.Event} event Event instance.
     */
    EventDispatcher.prototype.dispatchEvent = function(event) {
        if (!event.type) return;

        var key, i;
        for (key in this._events) {
            if (this._events.hasOwnProperty(key) && (event.type === key)) {
                var listeners = this._events[key],
                    copyOnWrite = listeners.slice(0),
                    length = copyOnWrite.length;

                for (i = 0; i < length; i++) {
                    copyOnWrite[i].cb.call(copyOnWrite[i].ctx, event);
                }
                break;
            }
        }
    };

    /**
     * Un-registers all listener methods.
     *
     * @param {Object} target The object for which all event listeners are to be removed.
     */
    EventDispatcher.prototype.removeAllListeners = function(target) {
        if (!target) {
            this._events = {};
        } else {
            var i, key;

            for (key in this._events) {
                if (this._events.hasOwnProperty(key)) {
                    for (i = this._events[key].length - 1; i >= 0; i--) {
                        var _listener = this._events[key][i];
                        if (_listener.ctx === target) {
                            this._events[key].splice(i, 1);
                        }
                    }

                    // If we are left with an empty list of listeners for a particular
                    // event type, we delete it.
                    if (!this._events[key].length) delete this._events[key];
                }
            }
        }
    };

    // Export symbols.
    core.EventDispatcher = EventDispatcher;
})(core);

(function(core) {
    'use strict';

    var Event = core.radio.Event;
    var EventDispatcher = core.EventDispatcher;

    URLRequestMethod.GET = "GET";
    function URLRequestMethod() {
    }


    function URLRequest(url, method) {
        this.url = url || null;
        this.method = method;
        this._xmlhttp = null;
    }


    URLLoader.RESPONSE = "response";
    URLLoader.INSTANCE = "instance";

    core.extend(URLLoader, EventDispatcher);

    /**
     * Emulates the URLLoader exposed by Flash run-time.
     *
     * @extends {EventDispatcher}
     */
    function URLLoader() {
        URLLoader.__super__.constructor.call(this);

        this._connection = null;
    }

    //
    // -------------------[ Private helper methods ]-----------------------
    //

    URLLoader.prototype._createCORSRequest = function(req) {
        var xhr = null;

        // First, try to use XMLHTTPRequest2, which has CORS support
        if (typeof window["XMLHttpRequest"] !== "undefined") {
            var candidateXHR = new window["XMLHttpRequest"]();

            if ("withCredentials" in candidateXHR) {
                // The presence of this property indicates XMLHTTPRequest2,
                // (supported by most browsers and IE10+)
                xhr = candidateXHR;
                xhr.open(req.method, req.url, true);
            }
        }

        // If that didn't work, try to use XDomainRequest (IE8 and IE9)
        if (xhr == null) {
            if (typeof window["XDomainRequest"] !== "undefined") {
                xhr = new window["XDomainRequest"]();
                xhr.open(req.method, req.url);
            }
        }

        if (xhr) {
            // If CORS is supported, register the success & error callbacks
            var eventData = {};
            eventData[URLLoader.INSTANCE] = this;
            var self = this;

            xhr.onload = function() {
                if (xhr.status && parseInt(xhr.status, 10) >= 400) {
                    // This extra-check is needed because some browsers
                    // will call the 'onload' callback even if
                    // the request was unsuccessful.
                    return this.onerror();
                }
                eventData[URLLoader.RESPONSE] = xhr.responseText;
                self.dispatchEvent(new Event(Event.SUCCESS, eventData));
            };

            xhr.onerror = function() {
                self.dispatchEvent(new Event(Event.ERROR, eventData));
            };
        }

        return xhr;
    };

    URLLoader.prototype._loadImage = function(req) {
        if (!this._connection) {
            this._connection = new Image();
            this._connection.alt = "";
        }

        this._connection.src = req.url;

        // Image requests are assumed to be successful.
        var eventData = {};
        eventData[URLLoader.RESPONSE] = "";
        eventData[URLLoader.INSTANCE] = this;

        this.dispatchEvent(new Event(Event.SUCCESS, eventData));
    };

    //
    // -------------------[ Public methods ]-----------------------
    //
    URLLoader.prototype.close = function() {
        this.removeAllListeners();
    };

    URLLoader.prototype.load = function(req) {
        if (!req || !req.method || !req.url) {
            return;
        }

        req._xmlhttp = this._createCORSRequest(req);

        if (req._xmlhttp) {
            req._xmlhttp.send();
        } else {
            // No CORS support: fall-back to image request.
            this._loadImage(req);
        }
    };

    // Export symbols.
    core.URLRequestMethod = URLRequestMethod;
    core.URLRequest = URLRequest;
    core.URLLoader = URLLoader;
})(core);
(function(va) {
    'use strict';

    /**
     * Container for ad-break related information.
     *
     * @constructor
     */
    function AdBreakInfo() {
        this.playerName = null;
        this.name = null;
        this.position = null;
        this.startTime = null;
    }

    // Export symbols.
    va.AdBreakInfo = AdBreakInfo;
})(va);


(function(va) {
    'use strict';

    /**
     * Container for ad related information.
     *
     * @constructor
     */
    function AdInfo() {
        this.id = null;
        this.name = null;
        this.length = null;
        this.position = null;
        this.cpm = null;
    }

    // Export symbols.
    va.AdInfo = AdInfo;
})(va);


(function(va) {
    'use strict';

    // Export symbols.
    va.ASSET_TYPE_VOD = "vod";
    va.ASSET_TYPE_LIVE = "live";
    va.ASSET_TYPE_LINEAR = "linear";
})(va);


(function(va) {
    'use strict';

    /**
     * Information about chapters.
     *
     * @constructor
     */
    function ChapterInfo() {
        this.name = null;
        this.length = null;
        this.position = null;
        this.startTime = null;
    }

    // Export symbols.
    va.ChapterInfo = ChapterInfo;
})(va);


(function(va) {
    'use strict';

    var DEFAULT_UNKNOWN = "unknown";
    var DEFAULT_EMPTY_STRING = "";

    /**
     * Configuration data for video heartbeat.
     *
     * @constructor
     */
    function ConfigData(trackingServer, jobId, publisher) {
        this.trackingServer = trackingServer;
        this.jobId = jobId;
        this.publisher = publisher;

        this.channel = DEFAULT_EMPTY_STRING;

        this.ovp = DEFAULT_UNKNOWN;
        this.sdk = DEFAULT_UNKNOWN;

        this.debugLogging = false;

        this.quietMode = false;

        this.__primetime = false;
        this.__psdkVersion = null;
    }

    // Export symbols.
    va.ConfigData = ConfigData;
})(va);


(function(va) {
    'use strict';

    /**
     * Container for error related information.
     *
     * @constructor
     */
    function ErrorInfo(message, details) {
        this.message = message;
        this.details = details;
    }

    // Export symbols.
    va.ErrorInfo = ErrorInfo;
})(va);


(function(va) {
    'use strict';

    /**
     * Delegate object for player-specific computations.
     *
     * NOTE: this is an abstract base class designed to be extended.
     *       Not to be instantiated directly.
     */
    function PlayerDelegate() {}

    PlayerDelegate.prototype.getVideoInfo = function() {
        throw new Error("Implementation error: Method must be overridden.");
    };

    PlayerDelegate.prototype.getAdBreakInfo = function() {
        return null;
    };

    PlayerDelegate.prototype.getAdInfo = function() {
        return null;
    };

    PlayerDelegate.prototype.getChapterInfo = function() {
        return null;
    };

    PlayerDelegate.prototype.getQoSInfo = function() {
        return null;
    };

    PlayerDelegate.prototype.onError = function(errorInfo) {
    };

    PlayerDelegate.prototype.onVideoUnloaded = function() {
    };

    // Export symbols.
    va.PlayerDelegate = PlayerDelegate;
})(va);


(function(va) {
    'use strict';

    /**
     * Container for QoS related information.
     *
     * @constructor
     */
    function QoSInfo() {
        this.bitrate = null;
        this.fps = null;
        this.droppedFrames = null;
    }

    // Export symbols.
    va.QoSInfo = QoSInfo;
})(va);


(function(va) {
    'use strict';

    /**
     * Container for video related information.
     *
     * @constructor
     */
    function VideoInfo() {
        this.playerName = null;
        this.id = null;
        this.name = null;
        this.length = null;
        this.playhead = null;
        this.streamType = null;
    }

    // Export symbols.
    va.VideoInfo = VideoInfo;
})(va);


(function(core) {
    'use strict';

    /**
     * Interface to be respected by all plugins.
     *
     * @interface
     *
     */
    function IPlugin() {}

    IPlugin.prototype.bootstrap = function(pluginManager) {
        throw new Error("Implementation error: Method must be overridden.");
    };
    IPlugin.prototype.setup = function() {
        throw new Error("Implementation error: Method must be overridden.");
    };

    IPlugin.prototype.destroy = function() {
        throw new Error("Implementation error: Method must be overridden.");
    };
    IPlugin.prototype.enable = function() {
        throw new Error("Implementation error: Method must be overridden.");
    };

    IPlugin.prototype.disable = function() {
        throw new Error("Implementation error: Method must be overridden.");
    };
    IPlugin.prototype.getName = function() {
        throw new Error("Implementation error: Method must be overridden.");
    };

    IPlugin.prototype.isInitialized = function() {
        throw new Error("Implementation error: Method must be overridden.");
    };

    IPlugin.prototype.getProperty = function(key) {
        throw new Error("Implementation error: Method must be overridden.");
    };

    // Export symbols.
    core.plugin.IPlugin = IPlugin;
})(core);


(function(core, va) {
    'use strict';

    var mixin = core.mixin;
    var logger = core.logger;

    var ErrorInfo = va.ErrorInfo;
    var Event = core.radio.Event;
    var Radio = core.radio.Radio;
    var Channel = core.radio.Channel;

    mixin(PluginManager, logger);

    PluginManager.ALL_PLUGINS    = Channel.WILDCARD;
    PluginManager.ERROR          = "error";
    PluginManager.CHANNEL_GLOBAL = "plugin_manager:global";

    /**
     * Plugin manager, manages lifecycle and mediates communication of all plugins
     * Mainly a facade over a Radio (Channel and Request) + plugin management operations (add/remove).
     */

    // TODO: rename to something else, like PluginManager or PluginMediator
    function PluginManager() {
        // We start with an empty plugin list.
        this._plugins = {};

        // Instantiate the radio station (the comm. bus primitive).
        this._radio = new Radio();
        this._channel = this._radio.channel(PluginManager.CHANNEL_GLOBAL);

        // Activate logging for this class
        this.enableLogging("[plugin::PluginManager] > ");
    }

    PluginManager.prototype.addPlugin = function(plugin) {
        var pluginName = plugin.getName();
        if (this._plugins[pluginName]) {
            this.warn("#addPlugin > Replacing plugin: " + pluginName);
        }

        // Register the plugin.
        this._plugins[pluginName] = plugin;

        // Initialize the plugin.
        plugin.bootstrap(this);
    };

    PluginManager.prototype.setupPlugins = function() {
        for (var pluginName in this._plugins) {
            if (this._plugins.hasOwnProperty(pluginName)) {
                this._plugins[pluginName].setup();
            }
        }
    };

    PluginManager.prototype.removePlugin = function(plugin) {
        var pluginName = plugin.getName();
        if (!this._plugins[pluginName]) {
            this.warn("#removePlugin > Unregistered plugin: " + pluginName);
        }

        delete this._plugins[pluginName];
    };

    PluginManager.prototype.pluginExists = function(pluginName) {
        return (!!this._plugins[pluginName]);
    };

    PluginManager.prototype.isPluginInitialized = function(pluginName) {
        return (this._plugins[pluginName] && this._plugins[pluginName].isInitialized());
    };

    PluginManager.prototype.on = function(pluginName, eventType, fn, ctx) {
        this._channel.on(pluginName + Channel.SEPARATOR + eventType, fn, ctx);
    };

    PluginManager.prototype.off = function(pluginName, eventType, fn, ctx) {
        this._channel.off(pluginName + Channel.SEPARATOR + eventType, fn, ctx);
    };

    PluginManager.prototype.trigger = function(plugin, event) {
        var eventMeta = event.type.split(Channel.SEPARATOR),
            eventNamespace = eventMeta[0];

        // Validate the event namespace against the plugin name.
        var pluginName = plugin.getName();
        if (pluginName != eventNamespace) {
            var errMsg = "Invalid event namespace. (event: " + event.type + ", plugin: " + pluginName + ")";

            // Trigger an ERROR event on the "global" channel.
            this._channel.trigger(new Event(PluginManager.ERROR, new ErrorInfo("Internal error", errMsg)));
            return;
        }
        this._channel.trigger(event);
    };

    PluginManager.prototype.request = function(pluginName, what) {
        // Find the target plugin.
        var targetPlugin = this._plugins[pluginName];

        // Fast exit.
        if (!targetPlugin) return null;

        return targetPlugin.getProperty(what);
    };

    PluginManager.prototype.destroy = function() {
        // Shutdown the radio station.
        this._radio.shutdown();

        // Destroy all registered plugins.
        for (var pluginName in this._plugins) {
            if (this._plugins.hasOwnProperty(pluginName)) {
                this._plugins[pluginName].destroy();
            }
        }
    };

    // Export symbols.
    core.plugin.PluginManager = PluginManager;
})(core, va);
(function(core, va) {
    'use strict';

    var ErrorInfo = va.ErrorInfo;
    var Event = core.radio.Event;
    var PluginManager = core.plugin.PluginManager;

    core.mixin(BasePlugin, core.logger);

    /**
     * Base plugin class, to be extended by all plugins.
     *
     * NOTE: this is an abstract base class designed to be extended.
     *       Not to be instantiated directly.
     */

    BasePlugin.INITIALIZED = "initialized";

    BasePlugin.STATE_PLUGIN      = "state";
    BasePlugin.ERROR_INFO = "error_info";

    /**
     * @implements {IPlugin}
     * @mixes {core.logger}
     *
     * @constructor
     */
    function BasePlugin(name) {
        this._name = name;

        this._isInitialized = false;
        this._isDestroyed = false;
        this._isEnabled = true;
        this._dataResolver = {};

        // Activate logging for this class
        this.enableLogging("[plugin::" + this.getName() + "] > ");
    }

    //
    //---------------------[ Public API ]---------------------
    //
    BasePlugin.prototype.bootstrap = function(pluginManager) {
        this._pluginManager = pluginManager;

        if (this._isDestroyed) {
            this._trigger(PluginManager.ERROR, new ErrorInfo("Invalid state.", "Plugin already destroyed."));
        }
    };

    BasePlugin.prototype.setup = function() {
        // Plugin initialization is now complete. Trigger the INITIALIZED event.
        this._trigger(BasePlugin.INITIALIZED);
        this._isInitialized = true;
    };

    BasePlugin.prototype.destroy = function() {
        if (this._isDestroyed) return;

        // The plugin is now destroyed. All public APIs are disabled.
        this._isDestroyed = true;

        // Execute the custom tear-down logic.
        this._teardown();
    };
    BasePlugin.prototype.enable = function() {
        this._isEnabled = true;
        this._enabled();
    };

    BasePlugin.prototype.disable = function() {
        this._isEnabled = false;
        this._disabled();
    };
    BasePlugin.prototype.getName = function() {
        return this._name;
    };

    BasePlugin.prototype.isInitialized = function() {
        return this._isInitialized;
    };

    BasePlugin.prototype.getProperty = function(key) {
        // top level resolver is a function -- call it
        if (typeof this._dataResolver === "function") {
            return this._dataResolver.call(this, key);
        }

        // resolver is a hash
        if (this._dataResolver.hasOwnProperty(key)) {
            var resolver = this._dataResolver[key];

            if (typeof resolver === "function") { // field is a function -- call it
                return resolver.call(this);
            } else { // field is a simple value
                return resolver;
            }
        }
    };

    BasePlugin.prototype.toString = function() {
        return "<plugin: "  + this._name + ">";
    };

    //
    //---------------------[ Protected API ]---------------------
    //
    // Life-cycle management APIs.

    // TODO: change name to something more like "onBeforeEnable", etc
    BasePlugin.prototype._enabled = function() {
        // All plugins can override this.
    };

    BasePlugin.prototype._disabled = function() {
        // All plugins can override this.
    };

    BasePlugin.prototype._teardown = function() {
        // All plugins can override this.
    };

    // Helper methods

    // should be called before any public API method exposed by the child plugins
    // TODO: can we avoid repetition, maybe rely on wrapping or annotations?
    BasePlugin.prototype._canProcess = function() {
        // query for error state
        var errorInfo = this._pluginManager.request(BasePlugin.STATE_PLUGIN, BasePlugin.ERROR_INFO);
        if (errorInfo) {
            this.warn("#_canProcess() > Unable to track: in ERROR state.");
            return false;
        }

        if (!this._isEnabled) {
            this.warn("Plugin disabled.");
            return false;
        }

        if (this._isDestroyed) {
            this.warn("Plugin destroyed.");
            return false;
        }

        return true;
    };

    BasePlugin.prototype._trigger = function(eventType, info) {
        this._pluginManager.trigger(this, new Event(this.getName() + ":" + eventType, info));
    };

    BasePlugin.prototype._onInvalidInputData = function(errorInfo) {
        this._trigger(PluginManager.ERROR, errorInfo);
    };

    // Export symbols.
    core.plugin.BasePlugin = BasePlugin;
})(core, va);


(function(core, heartbeat) {
    'use strict';

    function EventKeyName() {}

    EventKeyName.REPORT = "report";
    EventKeyName.RESET = "reset";
    EventKeyName.TRACKING_SERVER = "tracking_server";
    EventKeyName.CHECK_STATUS_SERVER = "check_status_server";
    EventKeyName.JOB_ID = "job_id";
    EventKeyName.QUIET_MODE = "quiet_mode";
    EventKeyName.VIDEO_INFO = "video_info";
    EventKeyName.AD_INFO = "ad_info";
    EventKeyName.AD_BREAK_INFO = "ad_break_info";
    EventKeyName.CHAPTER_INFO = "chapter_info";

    EventKeyName.TIMER_INTERVAL = "timer_interval";
    EventKeyName.TRACKING_INTERVAL = "tracking_interval";
    EventKeyName.CHECK_STATUS_INTERVAL = "check_status_interval";
    EventKeyName.TRACK_EXTERNAL_ERRORS = "track_external_errors";
    EventKeyName.SOURCE = "source";
    EventKeyName.ERROR_ID = "error_id";

    // Export symbols.
    heartbeat.event.EventKeyName = EventKeyName;
})(core, heartbeat);

(function(core, heartbeat) {
    'use strict';

    var Event = core.radio.Event;

    core.extend(ApiEvent, Event);

    /**
     * Event dispatched by the API-layer partition.
     *
     * @extends {Event}
     *
     * @constructor
     */
    function ApiEvent(type, data) {
        ApiEvent.__super__.constructor.call(this, type, data);
    }

    ApiEvent.API_CONFIG = "api_config";
    ApiEvent.API_VIDEO_LOAD  = "api_video_load";
    ApiEvent.API_VIDEO_UNLOAD  = "api_video_unload";
    ApiEvent.API_VIDEO_START = "api_video_start";
    ApiEvent.API_VIDEO_COMPLETE = "api_video_complete";
    ApiEvent.API_AD_START = "api_ad_start";
    ApiEvent.API_AD_COMPLETE = "api_ad_complete";
    ApiEvent.API_PLAY = "api_play";
    ApiEvent.API_PAUSE = "api_pause";
    ApiEvent.API_BUFFER_START = "api_buffer_start";
    ApiEvent.API_SEEK_START = "api_seek_start";
    ApiEvent.API_SEEK_COMPLETE = "api_seek_complete";
    ApiEvent.API_CHAPTER_START = "api_chapter_start";
    ApiEvent.API_CHAPTER_COMPLETE = "api_chapter_complete";

    ApiEvent.API_TRACK_ERROR = "api_track_error";
    ApiEvent.API_TRACK_INTERNAL_ERROR = "api_track_internal_error";
    ApiEvent.API_BITRATE_CHANGE = "api_bitrate_change";

    // Export symbols.
    heartbeat.event.ApiEvent = ApiEvent;
})(core, heartbeat);

(function(core, heartbeat) {
    'use strict';

    var Event = core.radio.Event;

    core.extend(ContextEvent, Event);

    /**
     * Event dispatched by the context partition.
     *
     * @extends {Event}
     *
     * @constructor
     */
    function ContextEvent(type, data) {
        ContextEvent.__super__.constructor.call(this, type, data);
    }

    ContextEvent.CONTEXT_DATA_AVAILABLE = "context_data_available";

    // Export symbols.
    heartbeat.event.ContextEvent = ContextEvent;
})(core, heartbeat);

(function(core, heartbeat) {
    'use strict';

    var Event = core.radio.Event;

    core.extend(NetworkEvent, Event);

    /**
     * Event dispatched by the network partition.
     *
     * @extends {Event}
     *
     * @constructor
     */
    function NetworkEvent(type, data) {
        NetworkEvent.__super__.constructor.call(this, type, data);
    }

    NetworkEvent.NETWORK_CHECK_STATUS_COMPLETE = "network_check_status_complete";

    // Export symbols.
    heartbeat.event.NetworkEvent = NetworkEvent;
})(core, heartbeat);

(function(core, heartbeat) {
    'use strict';

    var Event = core.radio.Event;

    core.extend(ClockEvent, Event);

    /**
     * Event dispatched by the clock partition.
     *
     * @extends {Event}
     *
     * @constructor
     */
    function ClockEvent(type, data) {
        ClockEvent.__super__.constructor.call(this, type, data);
    }

    ClockEvent.CLOCK_TRACKING_TICK = "CLOCK_TRACKING_TICK";
    ClockEvent.CLOCK_CHECK_STATUS_GET_SETTINGS = "CLOCK_CHECK_STATUS_GET_SETTINGS";
    ClockEvent.CLOCK_TRACKING_ENABLE = "CLOCK_TRACKING_ENABLE";
    ClockEvent.CLOCK_TRACKING_DISABLE = "CLOCK_TRACKING_DISABLE";

    ClockEvent.CLOCK_CHECK_STATUS_TICK = "CLOCK_CHECK_STATUS_TICK";
    ClockEvent.CLOCK_CHECK_STATUS_ENABLE = "CLOCK_CHECK_STATUS_ENABLE";
    ClockEvent.CLOCK_CHECK_STATUS_DISABLE = "CLOCK_CHECK_STATUS_DISABLE";

    // Export symbols.
    heartbeat.event.ClockEvent = ClockEvent;
})(core, heartbeat);

(function(core, heartbeat) {
    'use strict';

    function DaoField(value, hint) {
        this.value = value;
        this.hint = hint;
    }

    DaoField.HINT_SHORT = "short";


    function Dao(realm) {
        this.realm = realm;
        this.data = {};
    }

    //
    // -------------------[ Private helper methods ]-----------------------
    //
    Dao.prototype._createAccessor = function(ivar, field, hint) {
        var self = this;
        return function() {
            if (arguments.length) {
                self[ivar] = arguments[0];
                self.setField(field, arguments[0], hint);
            }

            return self[ivar];
        };
    };

    //
    // -------------------[ Public methods ]-----------------------
    //
    Dao.prototype.setField = function(field, value, hint) {
        this.data[field] = new DaoField(value, hint);
    };


    // Export symbols.
    heartbeat.model.Dao = Dao;
    heartbeat.model.DaoField = DaoField;
})(core, heartbeat);

(function(core, heartbeat) {
    'use strict';

    var Dao = heartbeat.model.Dao;
    var DaoField = heartbeat.model.DaoField;

    core.extend(DateDao, Dao);

    /**
     * DAO describing date info.
     *
     * @param {string} realm The realm for this DAO.
     *
     * @param {Date} date The date value to be stored by this DAO.
     *
     * @extends {Dao}
     *
     * @constructor
     */
    function DateDao(realm, date) {
        DateDao.__super__.constructor.call(this, realm);

        this.year = this._createAccessor("_year", "year", DaoField.HINT_SHORT);
        this.month = this._createAccessor("_month", "month", DaoField.HINT_SHORT);
        this.day = this._createAccessor("_day", "day", DaoField.HINT_SHORT);
        this.hour = this._createAccessor("_hour", "hour", DaoField.HINT_SHORT);
        this.minute = this._createAccessor("_minute", "minute", DaoField.HINT_SHORT);
        this.second = this._createAccessor("_second", "second", DaoField.HINT_SHORT);

        this.year(date.getUTCFullYear());
        this.month(date.getUTCMonth() + 1);
        this.day(date.getUTCDate());
        this.hour(date.getUTCHours());
        this.minute(date.getUTCMinutes());
        this.second(date.getUTCSeconds());
    }

    // Export symbols.
    heartbeat.model.DateDao = DateDao;
})(core, heartbeat);

(function(core, heartbeat) {
    'use strict';

    var Dao = heartbeat.model.Dao;

    core.extend(AdDao, Dao);

    /**
     * DAO describing ad data.
     *
     * @extends {Dao}
     *
     * @constructor
     */
    function AdDao() {
        AdDao.__super__.constructor.call(this, "asset");

        this.adId = this._createAccessor("_adId", "ad_id", null);
        this.sid = this._createAccessor("_sid", "ad_sid", null);
        this.resolver = this._createAccessor("_resolver", "resolver", null);
        this.podId = this._createAccessor("_podId", "pod_id", null);
        this.podPosition = this._createAccessor("_podPosition", "pod_position", null);
        this.podSecond = this._createAccessor("_podSecond", "pod_second", null);
        this.length = this._createAccessor("_length", "length", null);

        this.adId('');
        this.sid('');
        this.resolver('');
        this.podId('');
        this.podPosition('');
        this.podSecond(0);
        this.length(0);

        if (arguments.length && arguments[0] instanceof AdDao) {
            var other = arguments[0];

            this.adId(other.adId());
            this.sid(other.sid());
            this.resolver(other.resolver());
            this.podId(other.podId());
            this.podPosition(other.podPosition());
            this.podSecond(other.podSecond());
            this.length(other.length());
        }
    }

    // Export symbols.
    heartbeat.model.AdDao = AdDao;
})(core, heartbeat);

(function(core, heartbeat) {
    'use strict';

    var Dao = heartbeat.model.Dao;

    core.extend(ChapterDao, Dao);

    /**
     * DAO describing chapter data.
     *
     * @extends {Dao}
     *
     * @constructor
     */
    function ChapterDao() {
        ChapterDao.__super__.constructor.call(this, "stream");

        this.id = this._createAccessor("_id", "chapter_id", null);
        this.sid = this._createAccessor("_sid", "chapter_sid", null);
        this.name = this._createAccessor("_name", "chapter_name", null);
        this.position = this._createAccessor("_position", "chapter_pos", null);
        this.length = this._createAccessor("_length", "chapter_length", null);
        this.offset = this._createAccessor("_offset", "chapter_offset", null);

        this.id('');
        this.sid('');
        this.name('');
        this.position(0);
        this.length(0);
        this.offset(0);

        if (arguments.length && arguments[0] instanceof ChapterDao) {
            var other = arguments[0];

            this.id(other.id());
            this.sid(other.sid());
            this.name(other.name());
            this.position(other.position());
            this.length(other.length());
            this.offset(other.offset());
        }
    }

    // Export symbols.
    heartbeat.model.ChapterDao = ChapterDao;
})(core, heartbeat);

(function(core, heartbeat) {
    'use strict';

    var Dao = heartbeat.model.Dao;
    var AdDao = heartbeat.model.AdDao;
    var ChapterDao = heartbeat.model.ChapterDao;

    core.extend(AssetDao, Dao);

    /**
     * DAO describing asset data.
     *
     * @extends {Dao}
     *
     * @constructor
     */
    function AssetDao() {
        AssetDao.__super__.constructor.call(this, "asset");

        this.type = this._createAccessor("_type", "type", null);
        this.videoId = this._createAccessor("_videoId", "video_id", null);
        this.publisher = this._createAccessor("_publisher", "publisher", null);
        this.adData = this._createAccessor("_adData", "ad_data", null);
        this.chapterData = this._createAccessor("_chapterData", "chapter_data", null);
        this.duration = this._createAccessor("_duration", "duration", null);

        this.type('');
        this.videoId('');
        this.publisher('');
        this.adData(null);
        this.chapterData(null);
        this.duration(0);

        if (arguments.length && arguments[0] instanceof AssetDao) {
            var other = arguments[0];

            this.type(other.type());
            this.videoId(other.videoId());
            this.publisher(other.publisher());
            this.duration(other.duration());

            var otherAdData = other.adData();
            if (otherAdData) {
                this.adData(new AdDao(otherAdData));
            }

            var otherChapterData = other.chapterData();
            if (otherChapterData) {
                this.chapterData(new ChapterDao(otherChapterData));
            }
        }
    }

    AssetDao.TYPE_VOD = "vod";
    AssetDao.TYPE_LIVE = "live";
    AssetDao.TYPE_LINEAR = "linear";
    AssetDao.TYPE_AD = "ad";

    // Export symbols.
    heartbeat.model.AssetDao = AssetDao;
})(core, heartbeat);

(function(core, heartbeat) {
    'use strict';

    var Dao = heartbeat.model.Dao;
    var DateDao = heartbeat.model.DateDao;

    core.extend(EventDao, Dao);

    /**
     * DAO describing event data.
     *
     * @extends {Dao}
     *
     * @constructor
     */
    function EventDao(trackingInterval) {
        EventDao.__super__.constructor.call(this, "event");

        this._trackingInterval = trackingInterval;

        this.type = this._createAccessor("_type", "type", null);
        this.count = this._createAccessor("_count", "count", null);
        this.totalCount = this._createAccessor("_totalCount", "total_count", null);
        this.duration = this._createAccessor("_duration", "duration", null);
        this.totalDuration = this._createAccessor("_totalDuration", "total_duration", null);
        this.playhead = this._createAccessor("_playhead", "playhead", null);
        this.id = this._createAccessor("_id", "id", null);
        this.source = this._createAccessor("_source", "source", null);
        this.prevTs = this._createAccessor("_prevTs", "prev_ts", null);

        this.type('');
        this.count(0);
        this.totalCount(0);
        this.duration(0);
        this.totalDuration(0);
        this.playhead(0);
        this.id('');
        this.source('');
        this.ts(new Date().getTime());
        this._updateTsAsDate();
        this.prevTs(-1);
    }

    //
    // -------------------[ Private helper methods ]-----------------------
    //
    EventDao.prototype._updateTsAsDate = function() {
        // Truncate the timestamp to a multiple of the trackingInterval.
        var trackingIntervalMs = this._trackingInterval * 1000;
        var truncatedMs = Math.floor(this._ts / trackingIntervalMs) * trackingIntervalMs;

        this.tsAsDate(new Date(truncatedMs));
    };

    //
    // -------------------[ Public methods ]-----------------------
    //
    EventDao.prototype.ts = function() {
        if (arguments.length) {
            this._ts = arguments[0];
            this.setField("ts", this._ts, null);

            this._updateTsAsDate();
        }

        return this._ts;
    };

    EventDao.prototype.tsAsDate = function() {
        if (arguments.length) {
            this._tsAsDate = arguments[0];
            var dateDao = new DateDao(this.realm, this._tsAsDate);
            this.setField("ts_as_date", dateDao, null);
        }

        return this._tsAsDate;
    };

    EventDao.EVENT_TYPE_LOAD = "load";
    EventDao.EVENT_TYPE_UNLOAD = "unload";
    EventDao.EVENT_TYPE_START = "start";
    EventDao.EVENT_TYPE_CHAPTER_START = "chapter_start";
    EventDao.EVENT_TYPE_CHAPTER_COMPLETE = "chapter_complete";
    EventDao.EVENT_TYPE_PLAY = "play";
    EventDao.EVENT_TYPE_PAUSE = "pause";
    EventDao.EVENT_TYPE_BUFFER = "buffer";
    EventDao.EVENT_TYPE_BITRATE_CHANGE = "bitrate_change";
    EventDao.EVENT_TYPE_ERROR = "error";
    EventDao.EVENT_TYPE_ACTIVE = "active";
    EventDao.EVENT_TYPE_COMPLETE = "complete";

    // Export symbols.
    heartbeat.model.EventDao = EventDao;
})(core, heartbeat);

(function(core, heartbeat) {
    'use strict';

    var Dao = heartbeat.model.Dao;

    core.extend(QoSDao, Dao);

    /**
     * DAO describing QoS data.
     *
     * @extends {Dao}
     *
     * @constructor
     */
    function QoSDao() {
        QoSDao.__super__.constructor.call(this, "stream");

        this.bitrate = this._createAccessor("_bitrate", "bitrate", null);
        this.fps = this._createAccessor("_fps", "fps", null);
        this.droppedFrames = this._createAccessor("_droppedFrames", "dropped_frames", null);

        this.bitrate(0);
        this.fps(0);
        this.droppedFrames(0);
    }

    // Export symbols.
    heartbeat.model.QoSDao = QoSDao;
})(core, heartbeat);

(function(core, heartbeat) {
    'use strict';

    var Dao = heartbeat.model.Dao;
    var DaoField = heartbeat.model.DaoField;

    core.extend(AdobeAnalyticsDao, Dao);

    /**
     * DAO describing AdobeAnalytics config data.
     *
     * @extends {Dao}
     *
     * @constructor
     */
    function AdobeAnalyticsDao() {
        AdobeAnalyticsDao.__super__.constructor.call(this, "sc");

        this.reportSuiteId = this._createAccessor("_reportSuiteId", "rsid", null);
        this.trackingServer = this._createAccessor("_trackingServer", "tracking_server", null);
        this.ssl = this._createAccessor("_ssl", "ssl", DaoField.HINT_SHORT);

        this.reportSuiteId('');
        this.trackingServer('');
        this.ssl(0);
    }

    // Export symbols.
    heartbeat.model.AdobeAnalyticsDao = AdobeAnalyticsDao;
})(core, heartbeat);

(function(core, heartbeat) {
    'use strict';

    var Dao = heartbeat.model.Dao;

    var UNKNOWN = 'unknown';

    core.extend(ServiceProviderDao, Dao);

    /**
     * DAO describing service-provider data.
     *
     * @extends {Dao}
     *
     * @constructor
     */
    function ServiceProviderDao() {
        ServiceProviderDao.__super__.constructor.call(this, "sp");

        this.ovp = this._createAccessor("_ovp", "ovp", null);
        this.sdk = this._createAccessor("_sdk", "sdk", null);
        this.channel = this._createAccessor("_channel", "channel", null);
        this.playerName = this._createAccessor("_playerName", "player_name", null);
        this.libVersion = this._createAccessor("_libVersion", "hb_version", null);
        this.apiLevel = this._createAccessor("_apiLevel", "hb_api_lvl", null);

        this.ovp(UNKNOWN);
        this.sdk(UNKNOWN);
        this.channel(UNKNOWN);
        this.playerName('');
        this.libVersion('');
        this.apiLevel(0);
    }

    // Export symbols.
    heartbeat.model.ServiceProviderDao = ServiceProviderDao;
})(core, heartbeat);

(function(core, heartbeat) {
    'use strict';

    var Dao = heartbeat.model.Dao;

    core.extend(SessionDao, Dao);

    /**
     * DAO describing session data.
     *
     * @extends {Dao}
     *
     * @constructor
     */
    function SessionDao() {
        SessionDao.__super__.constructor.call(this, "event");

        this.sessionId = this._createAccessor("_sessionId", "sid", null);

        this.sessionId(null);
    }

    // Export symbols.
    heartbeat.model.SessionDao = SessionDao;
})(core, heartbeat);

(function(core, heartbeat) {
    'use strict';

    var Dao = heartbeat.model.Dao;

    core.extend(StreamDao, Dao);

    /**
     * DAO describing stream data.
     *
     * @extends {Dao}
     *
     * @constructor
     */
    function StreamDao() {
        StreamDao.__super__.constructor.call(this, "stream");

        this.cdn = this._createAccessor("_cdn", "cdn", null);
        this.name = this._createAccessor("_name", "name", null);

        this.cdn(null);
        this.name(null);

        if (arguments.length && arguments[0] instanceof StreamDao) {
            var other = arguments[0];

            this.cdn(other.cdn());
            this.name(other.name());
        }
    }

    // Export symbols.
    heartbeat.model.StreamDao = StreamDao;
})(core, heartbeat);

(function(core, heartbeat) {
    'use strict';

    var Dao = heartbeat.model.Dao;

    core.extend(UserDao, Dao);

    /**
     * DAO describing user data.
     *
     * @extends {Dao}
     *
     * @constructor
     */
    function UserDao(realm) {
        UserDao.__super__.constructor.call(this, "user");

        this.analyticsVisitorId = this._createAccessor("_analyticsVisitorId", "aid", null);
        this.marketingCloudVisitorId = this._createAccessor("_marketingCloudVisitorId", "mid", null);
        this.visitorId = this._createAccessor("_visitorId", "id", null);

        this.analyticsVisitorId(null);
        this.marketingCloudVisitorId(null);
        this.visitorId(null);

        // why not use realm -> other??
        if (arguments.length && arguments[0] instanceof UserDao) {
            var other = arguments[0];

            this.analyticsVisitorId(other.analyticsVisitorId());
            this.marketingCloudVisitorId(other.marketingCloudVisitorId());
            this.visitorId(other.visitorId());
        }
    }

    // Export symbols.
    heartbeat.model.UserDao = UserDao;
})(core, heartbeat);

(function(core, heartbeat) {
    'use strict';

    function ReportEntry(eventData, assetData, streamData, qosData) {
        this.eventData = eventData;
        this.assetData = assetData;
        this.streamData = streamData;
        this.qosData = qosData;
    }

    // Export symbols.
    heartbeat.model.ReportEntry = ReportEntry;
})(core, heartbeat);

(function(core, heartbeat) {
    'use strict';

    var EventDao = heartbeat.model.EventDao;

    function Report(adobeAnalyticsData, userData, serviceProviderData, sessionData) {
        this.adobeAnalyticsData = adobeAnalyticsData;
        this.userData = userData;
        this.serviceProviderData = serviceProviderData;
        this.sessionData = sessionData;

        this.reportEntries = [];
    }

    //
    // -------------------[ Public methods ]-----------------------
    //
    Report.prototype.addEntry = function(reportEntry) {
        this.reportEntries.push(reportEntry);
    };

    Report.prototype.discardPauseEvents = function() {
        if (!this.reportEntries.length) {
            return;
        }

        for (var i = this.reportEntries.length - 1; i >= 0; i--) {
            if (this.reportEntries[i].eventData.type() ===  EventDao.EVENT_TYPE_PAUSE) {
                this.reportEntries.splice(i, 1);
            }
        }
    };

    // Export symbols.
    heartbeat.model.Report = Report;
})(core, heartbeat);

(function(core, heartbeat) {
    'use strict';

    /**
     * Defines the data serialization protocol
     *
     * @interface
     */
    function SerializerProtocol() {}

    SerializerProtocol.prototype.serializeReport = function(report) {};

    SerializerProtocol.prototype.serializeReportEntry = function(reportEntry) {};

    SerializerProtocol.prototype.serializeDao = function(dao) {};

    SerializerProtocol.prototype.serializeNumber = function(key, number, realm, hint) {};

    SerializerProtocol.prototype.serializeString = function(key, string, realm, hint) {};

    // Export symbols.
    heartbeat.model.SerializerProtocol = SerializerProtocol;
})(core, heartbeat);

(function(core, heartbeat) {
    'use strict';

    var mixin = core.mixin;
    var logger = core.logger;
    var Dao = heartbeat.model.Dao;
    var DaoField = heartbeat.model.DaoField;
    var SerializerProtocol = heartbeat.model.SerializerProtocol;

    var DATA_TYPE_LONG = "l";
    var DATA_TYPE_SHORT = "h";
    var DATA_TYPE_STRING = "s";

    core.extend(QuerystringSerializer, SerializerProtocol);

    mixin(QuerystringSerializer, logger);
    /**
     * Serializes DAO into URL query strings.
     *
     * @implements {SerializerProtocol}
     *
     * @constructor
     */
    function QuerystringSerializer() {
        // Activate logging for this class.
        this.enableLogging('[heartbeat::QuerystringSerializer] > ');
    }

    //
    // -------------------[ Private helper methods ]-----------------------
    //
    QuerystringSerializer.prototype._appendSerializedData = function(serializedData) {
        return ((serializedData) ? (serializedData + "&") : "");
    };

    QuerystringSerializer.prototype._removeLastCharacter = function(string) {
        if (string && string.length > 0) {
            string = string.substring(0, string.length - 1);
        }

        return string;
    };

    QuerystringSerializer.prototype._processDao = function(dao) {
        var result = [];

        for (var key in dao.data) {
            if (dao.data.hasOwnProperty(key)) {
                var field = dao.data[key];

                var value = field.value;
                var hint = field.hint;
                var serializedValue = null;
                var realm = dao.realm;

                if (value === null || typeof value === 'undefined')
                    continue;

                if (typeof value === 'number') {
                    serializedValue = this.serializeNumber(key, value, realm, hint);
                } else if (typeof value === 'string') {
                    serializedValue = this.serializeString(key, value, realm, hint);
                } else if (value instanceof Dao) {
                    serializedValue = this.serializeDao(value);
                } else {
                    this.warn('#_processDao() > Unable to serialize DAO. Field: ' + key + '. Value: ' + value + '.');
                }

                if (serializedValue) {
                    result.push(serializedValue);
                }
            }
        }

        return result;
    };

    //
    // -------------------[ Public methods ]-----------------------
    //
    QuerystringSerializer.prototype.serializeReport = function(report) {
        var result = [];
        var reportEntries = report.reportEntries;

        for (var i = 0; i < reportEntries.length; i++) {
            var out = this.serializeReportEntry(reportEntries[i]) + "&";

            // Append the AA data.
            out += this._appendSerializedData(this.serializeDao(report.adobeAnalyticsData));

            // Serialize the user data.
            out += this._appendSerializedData(this.serializeDao(report.userData));

            // Append the SP data.
            out += this._appendSerializedData(this.serializeDao(report.serviceProviderData));

            // Append the session data.
            out += this._appendSerializedData(this.serializeDao(report.sessionData));

            out = this._removeLastCharacter(out);

            result.push(out);
        }

        return result;
    };

    QuerystringSerializer.prototype.serializeReportEntry = function(reportEntry) {
        // Serialize the event data.
        var out = this._appendSerializedData(this.serializeDao(reportEntry.eventData));

        // Serialize the asset data.
        out += this._appendSerializedData(this.serializeDao(reportEntry.assetData));

        // Serialize the stream data.
        out += this._appendSerializedData(this.serializeDao(reportEntry.streamData));

        // Serialize the QoS data.
        out += this._appendSerializedData(this.serializeDao(reportEntry.qosData));

        out = this._removeLastCharacter(out);

        return out;
    };

    QuerystringSerializer.prototype.serializeDao = function(dao) {
        var result = this._processDao(dao);
        var out = "";

        // Serialize into a query string.
        for (var i = 0; i < result.length; i++) {
            if (i == result.length -1) {
                out += result[i];
            } else {
                out += (result[i] + "&");
            }
        }

        return out;
    };

    QuerystringSerializer.prototype.serializeNumber = function(key, number, realm, hint) {
        var type = DATA_TYPE_LONG;

        if (number != null && number !== undefined && !isNaN(number)) {
            if (hint && (typeof hint === 'string') && hint === DaoField.HINT_SHORT) {
                type = DATA_TYPE_SHORT;
            }

            return type + ":" + realm + ":" + key + "=" + Math.floor(number);
        }

        return null;
    };

    QuerystringSerializer.prototype.serializeString = function(key, string, realm, hint) {
        if (string) {
            return DATA_TYPE_STRING + ":" + realm + ":" + key + "=" + window["encodeURIComponent"](string);
        }

        return null;
    };

    // Export symbols.
    heartbeat.model.QuerystringSerializer = QuerystringSerializer;
})(core, heartbeat);

(function(core, heartbeat) {
    'use strict';

    var logger = core.logger;
    var mixin = core.mixin;
    var Command = core.radio.Command;
    var ClockEvent = heartbeat.event.ClockEvent;
    var EventKeyName = heartbeat.event.EventKeyName;

    function TimerDescriptor(interval) {
        this.tick = 0;
        this.interval = interval;
        this.isActive = false;
    }



    var TIMER_BASE_INTERVAL = 1;  // 1 second

    mixin(TimerManager, logger);

    function TimerManager(channel) {
        this._isDestroyed = false;
        this._currentTick = 0;
        this._timers = {};
        this._channel = channel;

        // Setup the base timer for the clock partition.
        var self = this;
        this._clock = window.setInterval(function() { self._onTick(); }, TIMER_BASE_INTERVAL * 1000);

        // Activate logging for this class.
        this.enableLogging('[heartbeat::TimerManager] > ');
    }


    //
    // -------------------[ Public API ]-----------------------
    //

    TimerManager.prototype.isTimerActive = function(name) {
        var timer = this._timers[name];

        return (timer && timer.isActive);
    };

    TimerManager.prototype.createTimer = function(name, interval) {
        this._timers[name] = new TimerDescriptor(interval);
    };

    TimerManager.prototype.destroyTimer = function(name) {
        delete this._timers[name];
    };

    TimerManager.prototype.startTimer = function(name, reset) {
        this.log("#startTimer(" +
            "name=" + name +
            ", reset=" + reset +
            ")");

        var timer = this._timers[name];

        if (timer) {
            timer.isActive = true;

            if (reset) {
                timer.tick = 0;
            }
        }
    };

    TimerManager.prototype.stopTimer = function(name, reset) {
        this.log("#stopTimer(" +
            "name=" + name +
            ", reset=" + reset +
            ")");

        var timer = this._timers[name];

        if (timer) {
            timer.isActive = false;

            if (reset) {
                timer.tick = 0;
            }
        }
    };

    TimerManager.prototype.destroy = function() {
        if (this._isDestroyed) return;
        this._isDestroyed = true;

        // Stop the base timer.
        window.clearInterval(this._clock);
    };

    //
    //--------------------[ Notification handlers ]--------------------
    //

    TimerManager.prototype._onTick = function() {
        this.log("#_onTick() > ------------------- (" + this._currentTick + ")");
        this._currentTick++;

        for (var name in this._timers) {
            if (this._timers.hasOwnProperty(name)) {
                var timer = this._timers[name];

                if (timer.isActive) {
                    timer.tick++;

                    if (timer.tick % timer.interval === 0) {
                        var eventData = {};
                        eventData[EventKeyName.TIMER_INTERVAL] = timer.interval;

                        this._channel.trigger(new ClockEvent(ClockEvent[name], eventData));
                    }
                }
            }
        }
    };


    // Export symbols.
    heartbeat.clock.TimerManager = TimerManager;
})(core, heartbeat);

(function(core, heartbeat) {
    'use strict';

    var logger = core.logger;
    var mixin = core.mixin;
    var EventKeyName = heartbeat.event.EventKeyName;

    mixin(Timer, logger);
    function Timer(channel, timerManager, tickEventName, enableEventName, disableEventName, interval) {
        this.enableLogging('[heartbeat::Timer] > ');

        this._isDestroyed = false;

        this._channel = channel;
        this._timerManager = timerManager;
        this._interval = interval;
        this._tickEventName = tickEventName;
        this._enableEventName = enableEventName;
        this._disableEventName = disableEventName;

        // Register with the timer manager.
        this._timerManager.createTimer(this._tickEventName, this._interval);

        this._installEventListeners();
    }

    //
    // -------------------[ Public methods ]-----------------------
    //

    Timer.prototype.start = function(reset) {
        this.log("Starting timer: " + this._tickEventName);
        this._timerManager.startTimer(this._tickEventName, reset);
    };

    Timer.prototype.stop = function(reset) {
        this.log("Stopping timer: " + this._tickEventName + ")");
        this._timerManager.stopTimer(this._tickEventName, reset);
    };

    Timer.prototype.destroy = function() {
        if (this._isDestroyed) return;
        this._isDestroyed = true;

        this._uninstallEventListeners();

        // Un-register from the timer manager.
        this._timerManager.destroyTimer(this._tickEventName);
    };

    Timer.prototype.setInterval = function(interval) {
        // Remember the current timer state.
        var wasActive = this._timerManager.isTimerActive(this._tickEventName);

        // Stop the timer.
        this.stop(true);

        // Create a new timer (it will replace the old one if it exists).
        this._interval = interval;
        this._timerManager.createTimer(this._tickEventName, this._interval);

        // Restart the timer if it was active prior to the update of the timer interval.
        if (wasActive) {
            this.start(true);
        }
    };


    //
    // -------------------[ Notification handlers ]-----------------------
    //

    Timer.prototype._onTimerEnabled = function(e) {
        var eventData = e.data;
        var reset = false;

        if (eventData && eventData.hasOwnProperty(EventKeyName.RESET)) {
            reset = eventData[EventKeyName.RESET];
        }

        this.start(reset);
    };

    Timer.prototype._onTimerDisabled = function(e) {
        var eventData = e.data;
        var reset = false;

        if (eventData && eventData.hasOwnProperty(EventKeyName.RESET)) {
            reset = eventData[EventKeyName.RESET];
        }

        this.stop(reset);
    };

    //
    // -------------------[ Private helper methods ]-----------------------
    //
    Timer.prototype._installEventListeners = function() {
        // We register as observers to various heartbeat events.
        this._channel.on(this._enableEventName, this._onTimerEnabled, this);
        this._channel.on(this._disableEventName, this._onTimerDisabled, this);
    };

    Timer.prototype._uninstallEventListeners = function() {
        // Detach from the notification center.
        this._channel.off(null, null, this);
    };

    // Export symbols.
    heartbeat.clock.Timer = Timer;
})(core, heartbeat);

(function(core, heartbeat) {
    'use strict';

    var mixin = core.mixin;
    var logger = core.logger;
    var NetworkEvent = heartbeat.event.NetworkEvent;
    var ClockEvent = heartbeat.event.ClockEvent;
    var EventKeyName = heartbeat.event.EventKeyName;
    var Timer = heartbeat.clock.Timer;

    var DEFAULT_TRACKING_INTERVAL = 10; // 10 seconds
    TrackingTimer.TRACKING_TIMER_INTERVAL = "tracking_timer_interval";

    core.extend(TrackingTimer, Timer);
    mixin(TrackingTimer, logger);

    /**
     * @extends clock.Timer
     */
    function TrackingTimer(channel, timerManager) {
        TrackingTimer.__super__.constructor.call(this,
            channel,
            timerManager,
            ClockEvent.CLOCK_TRACKING_TICK,
            ClockEvent.CLOCK_TRACKING_ENABLE,
            ClockEvent.CLOCK_TRACKING_DISABLE,
            DEFAULT_TRACKING_INTERVAL);

        this._installEventListeners();

        // Activate logging for this class.
        this.enableLogging('[heartbeat::TrackingTimer] > ');
    }

    //
    //--------------------[ Notification handlers ]--------------------
    //

    TrackingTimer.prototype._onCheckStatusComplete = function(e) {
        var newTimerInterval = e.data[EventKeyName.TRACKING_INTERVAL];

        this.log("#_onCheckStatusComplete(interval=" + newTimerInterval + ")");

        if (newTimerInterval) {
            if (newTimerInterval == this._interval) {
                this.log("#_onCheckStatusComplete() > Interval value not changed.");

                // Interval has not changed. Just exit.
                return;
            }

            this.log("#_onCheckStatusComplete() > Interval changed to: " + newTimerInterval);
            this.setInterval(newTimerInterval);
        } else {
            // When dealing with an invalid value for the timer interval, use the default value for the timer interval.
            this.warn("#_onCheckStatusComplete() > Invalid interval value.");
            this.setInterval(DEFAULT_TRACKING_INTERVAL);
        }
    };

    //
    //--------------------[ Private helper methods ]--------------------
    //

    TrackingTimer.prototype._installEventListeners = function() {
        // We register as observers to various heartbeat events.
        this._channel.on(NetworkEvent.NETWORK_CHECK_STATUS_COMPLETE, this._onCheckStatusComplete, this);

        // We are able to provide the tracking clock timer interval.
        this._channel.reply(TrackingTimer.TRACKING_TIMER_INTERVAL, function() { return this._interval; }, this);

        TrackingTimer.__super__._installEventListeners.call(this);
    };

    // Export symbols.
    heartbeat.clock.TrackingTimer = TrackingTimer;
})(core, heartbeat);

(function(core, heartbeat) {
    'use strict';

    var MAXIMUM_CHECK_STATUS_INTERVAL = 10 * 60; // 10 minutes
    var DEFAULT_CHECK_STATUS_INTERVAL = 60; // 1 minute

    var mixin = core.mixin;
    var logger = core.logger;
    var Command = core.radio.Command;
    var NetworkEvent = heartbeat.event.NetworkEvent;
    var EventKeyName = heartbeat.event.EventKeyName;
    var ClockEvent = heartbeat.event.ClockEvent;
    var Timer = heartbeat.clock.Timer;

    core.extend(CheckStatusTimer, Timer);
    mixin(CheckStatusTimer, logger);

    /**
     * @extends clock.Timer
     */
    function CheckStatusTimer(channel, timerManager) {
        CheckStatusTimer.__super__.constructor.call(this,
            channel,
            timerManager,
            ClockEvent.CLOCK_CHECK_STATUS_TICK,
            ClockEvent.CLOCK_CHECK_STATUS_ENABLE,
            ClockEvent.CLOCK_CHECK_STATUS_DISABLE,
            DEFAULT_CHECK_STATUS_INTERVAL);

        this._installEventListeners();

        // Activate logging for this class.
        this.enableLogging('[heartbeat::CheckStatusTimer] > ');
        this.log("#CheckStatusTimer()");

        this._channel.on(ClockEvent.CLOCK_CHECK_STATUS_GET_SETTINGS, this._getSettings, this);
    }

    //
    //--------------------[ Notification handlers ]--------------------
    //

    CheckStatusTimer.prototype._onCheckStatusComplete = function(e) {
        var newTimerInterval = e.data[EventKeyName.CHECK_STATUS_INTERVAL];

        this.log("#_onCheckStatusComplete(interval=" + newTimerInterval + ")");

        if (newTimerInterval) {
            if (newTimerInterval == this._interval) {
                this.log("#_onCheckStatusComplete() > Interval value not changed.");

                // Interval has not changed. Just exit.
                return;
            }

            // Place a max cap on the check-status timer interval.
            if (newTimerInterval > MAXIMUM_CHECK_STATUS_INTERVAL) {
                this.warn("#_onCheckStatusComplete() > Interval value too large: " + newTimerInterval);
                this.setInterval(MAXIMUM_CHECK_STATUS_INTERVAL);
            } else {
                this.log("#_onCheckStatusComplete() > Interval changed to: " + newTimerInterval);
                this.setInterval(newTimerInterval);
            }
        } else {
            // When dealing with an invalid value for the timer interval, use the default value for the timer interval.
            this.warn("#_onCheckStatusComplete() > Invalid interval value.");
            this.setInterval(DEFAULT_CHECK_STATUS_INTERVAL);
        }
    };


    //
    // -------------------[ Private helper methods ]-----------------------
    //

    CheckStatusTimer.prototype._getSettings = function() {
        this.log("#_getSettings()");

        var eventData = {};
        eventData[EventKeyName.TIMER_INTERVAL] = this._interval;

        this._channel.trigger(new ClockEvent(ClockEvent.CLOCK_CHECK_STATUS_TICK, eventData));
    };

    CheckStatusTimer.prototype._installEventListeners = function() {
        this._channel.on(NetworkEvent.NETWORK_CHECK_STATUS_COMPLETE, this._onCheckStatusComplete, this);
        CheckStatusTimer.__super__._installEventListeners.call(this);
    };

    // Export symbols.
    heartbeat.clock.CheckStatusTimer = CheckStatusTimer;
})(core, heartbeat);

(function(core, heartbeat) {
    'use strict';

    var TimerManager = heartbeat.clock.TimerManager;
    var CheckStatusTimer = heartbeat.clock.CheckStatusTimer;
    var TrackingTimer = heartbeat.clock.TrackingTimer;

    function Clock(channel) {
        this._isDestroyed = false;

        // Instantiate the timers.
        this._timerManager = new TimerManager(channel);
        this._checkStatusTimer = new CheckStatusTimer(channel, this._timerManager);
        this._trackingTimer = new TrackingTimer(channel, this._timerManager);
    }

    Clock.prototype.destroy = function() {
        if (this._isDestroyed) return;
        this._isDestroyed = true;

        this._trackingTimer.destroy();
        this._checkStatusTimer.destroy();
        this._timerManager.destroy();
    };

    // Export symbols.
    heartbeat.clock.Clock = Clock;
})(core, heartbeat);

(function(core, heartbeat) {
    'use strict';

    var mixin = core.mixin;
    var logger = core.logger;
    var EventKeyName = heartbeat.event.EventKeyName;
    var NetworkEvent = heartbeat.event.NetworkEvent;


    mixin(SettingsParser, logger);

    function SettingsParser(data) {
        this._data = data;

        // Activate logging for this class.
        this.enableLogging('[heartbeat::SettingsParser] > ');

        this.log("#SettingsParser(data=" + data + ")");
    }

    //
    // -------------------[ Public methods ]-----------------------
    //
    SettingsParser.prototype.parse = function() {
        var trackingInterval, checkStatusInterval, trackExternalErrors;
        var xmlDoc;

        if (!this._data) {
            this.warn("#SettingsParser() > No data available for parsing.");
            return;
        }


        if (window["DOMParser"]) {
            var parser=new window["DOMParser"]();
            xmlDoc=parser.parseFromString(this._data,"text/xml");
        }
        // Internet Explorer
        else  {
            xmlDoc=new window["ActiveXObject"]("Microsoft.XMLDOM");
            xmlDoc.async=false;
            xmlDoc.loadXML(this.data);
        }

        var temp;
        temp = parseInt(xmlDoc.getElementsByTagName("trackingInterval")[0].childNodes[0].nodeValue, 10);
        temp && (trackingInterval = temp);

        temp = parseInt(xmlDoc.getElementsByTagName("setupCheckInterval")[0].childNodes[0].nodeValue, 10);
        temp && (checkStatusInterval = temp);

        temp = parseInt(xmlDoc.getElementsByTagName("trackExternalErrors")[0].childNodes[0].nodeValue, 10);
        temp && (trackExternalErrors = (temp == 1));

        // Tell everybody about the update in the configuration data.
        var eventData = {};
        eventData[EventKeyName.TRACKING_INTERVAL] = trackingInterval;
        eventData[EventKeyName.CHECK_STATUS_INTERVAL] = checkStatusInterval;
        eventData[EventKeyName.TRACK_EXTERNAL_ERRORS] = trackExternalErrors;

        this.log("#parse() > Obtained configuration settings: " + JSON.stringify(eventData));
        return eventData;
    };

    // Export symbols.
    heartbeat.network.SettingsParser = SettingsParser;
})(core, heartbeat);

(function(core, heartbeat) {
    'use strict';

    var mixin = core.mixin;
    var logger = core.logger;
    var Event = core.radio.Event;
    var Command = core.radio.Command;
    var CommandQueue = core.radio.CommandQueue;
    var ApiEvent = heartbeat.event.ApiEvent;
    var URLRequestMethod = core.URLRequestMethod;
    var URLRequest = core.URLRequest;
    var URLLoader = core.URLLoader;
    var EventKeyName = heartbeat.event.EventKeyName;
    var ClockEvent = heartbeat.event.ClockEvent;
    var ContextEvent = heartbeat.event.ContextEvent;
    var NetworkEvent = heartbeat.event.NetworkEvent;
    var SettingsParser = heartbeat.network.SettingsParser;
    var EventDao = heartbeat.model.EventDao;

    var HeartbeatPlugin = heartbeat.HeartbeatPlugin;

    mixin(Network, logger);

    function Network(channel, serializer) {
        // TODO: hack, circular reference
        HeartbeatPlugin = heartbeat.HeartbeatPlugin;

        this._jobId = null;
        this._trackingServer = null;
        this._checkStatusServer = null;

        this._quietMode  = false;
        this._isConfigured = false;
        this._isDestroyed = false;

        this._channel = channel;
        this._serializer = serializer;

        this._netQueue = new CommandQueue();

        this._installEventListeners();

        // Activate logging for this class.
        this.enableLogging('[heartbeat::Network] > ');
    }

    //
    //--------------------[ Public API ]--------------------
    //
    Network.prototype.destroy = function() {
        if (this._isDestroyed) return;
        this._isDestroyed = true;

        this.log("#destroy()");

        // Cancel all async operations.
        this._netQueue.cancelAllCommands();

        this._uninstallEventListeners();
    };

    //
    //--------------------[ Event handlers ]--------------------
    //
    Network.prototype._onApiConfig = function(e) {
        var info = e.data;

        this.log("#_onApiConfig(" +
              "sb_server=" + info[EventKeyName.TRACKING_SERVER] +
            ", check_status_server=" + info[EventKeyName.CHECK_STATUS_SERVER] +
            ", job_id=" + info[EventKeyName.JOB_ID] +
            ", quiet_mode=" + info[EventKeyName.QUIET_MODE] +
            ")");

        this._jobId = info[EventKeyName.JOB_ID];

        var useSSL = this._channel.request(HeartbeatPlugin.USE_SSL);

        this._trackingServer = this._updateRequestProtocol(info[EventKeyName.TRACKING_SERVER], useSSL);
        this._checkStatusServer = this._updateRequestProtocol(info[EventKeyName.CHECK_STATUS_SERVER], useSSL);

        this._quietMode = info[EventKeyName.QUIET_MODE];

        // We are now configured.
        this._isConfigured = true;
    };

    Network.prototype._onContextDataAvailable = function(e) {
        // If we are not configured, we do nothing.
        if (!this._isConfigured) {
            this.warn("#_onContextDataAvailable() > Unable to send request: not configured.");
            return;
        }

        var command = new Command(function() {
            // Obtain the serialized payload.
            var report = e.data[EventKeyName.REPORT];
            var payloads = this._serializer.serializeReport(report);

            for (var i = 0; i < payloads.length; i++) {
                var payload = payloads[i];
                var error = null;

                // Create and send the request.
                var url = this._trackingServer + "/?__job_id=" + window["encodeURIComponent"](this._jobId) + "&" + payload;
                var req = new URLRequest(url, URLRequestMethod.GET);

                this.info("_onContextDataAvailable() > Sending request: " + req.url);

                var loader = new URLLoader();

                (function(loader, self) {
                    function onSuccess(e) {
                        loader.close();
                    }

                    function onError(e) {
                        self.warn("#_onContextDataAvailable() > Failed to send heartbeat report: " + JSON.stringify(e));
                        loader.close();
                    }

                    // We only send the request over the wire if the quiet-mode flag is not switched on.
                    if (!self._quietMode) {
                        loader.addEventListener(Event.SUCCESS, onSuccess, this);
                        loader.addEventListener(Event.ERROR, onError, this);
                        loader.load(req);
                    }
                })(loader, this);
            }

            // If we are dealing with a report for the UNLOAD event,
            // we also notify the integration code though the delegate.
            if (report.reportEntries[0].eventData.type() == EventDao.EVENT_TYPE_UNLOAD) {
                this._channel.trigger(new core.radio.Event(HeartbeatPlugin.VIDEO_UNLOADED));
            }
        }, this);

        this._netQueue.addCommand(command);
    };

    Network.prototype._onClockCheckStatusTick = function(e) {
        // If we are not configured, we do nothing.
        if (!this._isConfigured) {
            this.warn("#_onClockCheckStatusTick() > Unable to send request: not configured.");
            return;
        }

        var publisher = this._channel.request(HeartbeatPlugin.PUBLISHER);

        // Fast exit.
        if (!publisher) {
            this.warn("#_onClockCheckStatusTick() > Publisher is NULL.");
            return;
        }

        var command = new Command(function() {
            var self = this;
            function onSuccess(e) {
                if (e.data) {
                    // Parse the settings document
                    var parser = new SettingsParser(e.data.response);
                    var parseResult = parser.parse();

                    if (parseResult) {
                        self._channel.trigger(new NetworkEvent(NetworkEvent.NETWORK_CHECK_STATUS_COMPLETE, parseResult));
                    } else {
                        self.warn("#_onClockCheckStatusTick() > Failed to parse the config. settings.");
                    }
                }

                loader.close();
            }

            function onError(e) {
                self.warn('#_onClockCheckStatusTick() > Failed to obtain the config. settings: ' + JSON.stringify(e));
                loader.close();
            }

            // Sanitize input.
            publisher = publisher.replace(/[^a-zA-Z0-9]+/, "-").toLocaleLowerCase();
            var url = this._checkStatusServer + publisher + ".xml?r=" + new Date().getTime();
            var req = new URLRequest(url, URLRequestMethod.GET);

            var loader = new URLLoader();
            loader.addEventListener(Event.SUCCESS, onSuccess, this);
            loader.addEventListener(Event.ERROR, onError, this);

            this.log("#_onClockCheckStatusTick() > Get new settings from: " + url);
            loader.load(req);
        }, this);

        this._netQueue.addCommand(command);
    };

    //
    //--------------------[ Private helper methods ]--------------------
    //
    Network.prototype._updateRequestProtocol = function(url, useSSL) {
        var stripped = url;

        // Strip away the protocol (if exists).
        if (stripped.indexOf("http://") === 0) {
            stripped = stripped.slice(7);
        } else if (stripped.indexOf("https://") === 0) {
            stripped = stripped.slice(8);
        }

        return useSSL ? "https://" + stripped
                      : "http://" + stripped;
    };

    Network.prototype._installEventListeners = function () {
        // We register as observers to various heartbeat events.
        this._channel.on(ApiEvent.API_CONFIG, this._onApiConfig, this);
        this._channel.on(ContextEvent.CONTEXT_DATA_AVAILABLE, this._onContextDataAvailable, this);
        this._channel.on(ClockEvent.CLOCK_CHECK_STATUS_TICK, this._onClockCheckStatusTick, this);
    };

    Network.prototype._uninstallEventListeners = function () {
        // Detach from the notification center.
        this._channel.off(null, null, this);
    };

    // Export symbols.
    heartbeat.network.Network = Network;
})(core, heartbeat);

(function(core, heartbeat) {
    'use strict';

    var mixin = core.mixin;
    var logger = core.logger;

    mixin(Counters, logger);

    function Counters() {
        this._totalCount = {};
        this._totalDuration = {};

        // Activate logging for this class.
        this.enableLogging('[heartbeat::Counters] > ');
    }

    //
    // -------------------[ Public methods ]-----------------------
    //

    Counters.prototype.getTotalCount = function(item) {
        var key = _computeKey(item);

        this._totalCount[key] || (this._totalCount[key] = 0);

        this.log("#getTotalCount(key=" + key + ")");

        return this._totalCount[key];
    };

    Counters.prototype.incrementTotalCount = function(item) {
        var key = _computeKey(item);

        this._totalCount[key] || (this._totalCount[key] = 0);

        this.log("#incrementTotalCount(key=" + key + ")");

        this._totalCount[key]++;
    };

    Counters.prototype.getTotalDuration = function(item) {
        var key = _computeKey(item);

        this._totalDuration[key] || (this._totalDuration[key] = 0);

        this.log("#getTotalDuration(key=" + key + ")");

        return this._totalDuration[key];
    };

    Counters.prototype.increaseTotalDuration = function(item) {
        var key = _computeKey(item);

        this._totalDuration[key] || (this._totalDuration[key] = 0);

        this.log("#increaseTotalDuration(" +
              "key=" + key +
            ", amount=" + item.duration +
            ")");

        this._totalDuration[key] += item.duration;
    };

    Counters.prototype.resetCounters = function(assetId, assetType) {
        var key = assetId + "." + assetType;

        this.log("#resetCounters(key=" + key + ")");

        var entryKey;
        for (entryKey in this._totalCount) {
            if (this._totalCount.hasOwnProperty(entryKey) && entryKey.indexOf(key) != -1) {
                this._totalCount[entryKey] = 0;
            }
        }

        for (entryKey in this._totalDuration) {
            if (this._totalDuration.hasOwnProperty(entryKey) && entryKey.indexOf(key) != -1) {
                this._totalDuration[entryKey] = 0;
            }
        }
    };

    function _computeKey(item) {
        var key = item.getAssetId() + "." + item.assetData.type() + "." + item.eventType;

        return key;
    }


    // Export symbols.
    heartbeat.context.Counters = Counters;
})(core, heartbeat);

(function(core, heartbeat) {
    'use strict';

    var mixin = core.mixin;
    var logger = core.logger;

    mixin(History, logger);

    function History() {
        this._items = {};

        // Activate logging for this class.
        this.enableLogging('[heartbeat::History] > ');
    }

    //
    // -------------------[ Public methods ]-----------------------
    //

    History.prototype.updateWith = function(timelineItem) {
        var key = _computeItemKey(timelineItem);

        this.log("#updateWith(key=" + key + ")");

        this._items[key] = timelineItem;
    };

    History.prototype.getPreviousItemOfSameTypeWith = function(timelineItem) {
        var key = _computeItemKey(timelineItem);

        this.log("#getPreviousItemOfSameTypeWith(key=" + key + ")");

        return this._items[key];
    };


    function _computeItemKey(timelineItem) {
        var assetData = timelineItem.assetData;
        var assetId = assetData.adData()
            ? assetData.adData().adId()
            : assetData.videoId();

        return assetId + "." + assetData.type() + "." + timelineItem.eventType;
    }


    // Export symbols.
    heartbeat.context.History = History;
})(core, heartbeat);

(function(core, heartbeat) {
    'use strict';

    var EventDao = heartbeat.model.EventDao;
    var AssetDao = heartbeat.model.AssetDao;
    var StreamDao = heartbeat.model.StreamDao;

    function TimelineItem(assetData, streamData, qosData, eventType, playhead) {
        this.timestamp = new Date();
        this.assetData = new AssetDao(assetData);
        this.streamData = new StreamDao(streamData);
        this.qosData = qosData;
        this.eventType = eventType;
        this.playhead = playhead;

        this.duration = 0;
        this.prevItemOfSameType = null;
    }

    TimelineItem.clone = function(other) {
        var clonedItem = new TimelineItem(other.assetData,
                                          other.streamData,
                                          other.qosData,
                                          other.eventType,
                                          other.playhead);
        clonedItem.timestamp = other.timestamp;

        return clonedItem;
    };

    TimelineItem.prototype.getAssetId = function() {
        // For ACTIVE events we always consider the asset id to be the id of the main video.
        if (this.eventType === EventDao.EVENT_TYPE_ACTIVE) {
            return this.assetData.videoId();
        }

        return (this.assetData.adData()) ? this.assetData.adData().adId()
                                         : this.assetData.videoId();
    };

    TimelineItem.prototype.getEventCount = function() {
        return 1;
    };

    // Export symbols.
    heartbeat.context.TimelineItem = TimelineItem;
})(core, heartbeat);

(function(core, heartbeat) {
    'use strict';

    var mixin = core.mixin;
    var logger = core.logger;
    var TimelineItem = heartbeat.context.TimelineItem;
    var EventDao = heartbeat.model.EventDao;
    var AssetDao = heartbeat.model.AssetDao;

    mixin(Timeline, logger);

    function Timeline(context) {
        this._timeline = [];
        this._context = context;

        this.enableLogging('[heartbeat::Timeline] > ');
    }

    Timeline.prototype.getTimelineItems = function() {
        return this._timeline.slice();
    };

    Timeline.prototype.getLast = function() {
        if (this._timeline.length > 0)
            return this._timeline[this._timeline.length - 1];

        return null;
    };

    // Adds an item to the timeline and computes stats for the one before it
    Timeline.prototype.addItem = function(timelineItem) {
        var lastItem = this.getLast();

        // Stats for events before ACTIVE have already been computed.
        if (lastItem && lastItem.eventType !== EventDao.EVENT_TYPE_ACTIVE) {
            lastItem.duration = _timeSpanMs(lastItem.timestamp, timelineItem.timestamp);
            this._updateItemStats(lastItem);
        }

        this.log("#addItem() > "
            + " | " + timelineItem.assetData.type()
            + " | " + timelineItem.eventType
            + " | " + timelineItem.playhead
            + " | " + (timelineItem.prevItemOfSameType ? timelineItem.prevItemOfSameType.timestamp.getTime() : "-1")
            + " | " + timelineItem.timestamp.getTime());

        // Add the item to the timeline.
        this._timeline.push(timelineItem);
    };

    Timeline.prototype.addActiveItem = function(activeItem) {
        var lastItem = this.getLast();

        // First, we add it to the timeline
        // This forces the duration for last item to be computed
        this.addItem(activeItem);

        // For the ACTIVE item the duration is the sum of all
        // the durations of the previous non-ACTIVE items going back
        // to the previous ACTIVE event.
        activeItem.duration = 0;
        for (var i = this._timeline.length - 2; i >= 0; i--) {
            var currentItem = this._timeline[i];

            if (currentItem.eventType == EventDao.EVENT_TYPE_ACTIVE) {
                // We found the previous ACTIVE item: break-out.
                break;
            }

            activeItem.duration += currentItem.duration;
        }

        // Compute the stats for the item before ACTIVE so that they are captured in the duration
        this._updateItemStats(activeItem);

        if (activeItem.eventType === EventDao.EVENT_TYPE_ACTIVE && _shouldBeCloned(lastItem)) {
            // For the ACTIVE item we also need to create a new pseudo-item
            // based on the last item on the timeline.
            var pseudoItem = TimelineItem.clone(lastItem);
            pseudoItem.prevItemOfSameType = lastItem;

            // Adjust various data for the pseudo-item.
            pseudoItem.timestamp = activeItem.timestamp;
            pseudoItem.playhead = activeItem.playhead;
            pseudoItem.duration = 0;

            this.addItem(pseudoItem);
        }
    };

    // Update the total counters.
    Timeline.prototype._updateItemStats = function(timelineItem) {
        var counters = this._context._counters;
        counters.incrementTotalCount(timelineItem);
        counters.increaseTotalDuration(timelineItem);
    };

    // returns true if the item needs to be repeated in the next quant (e.g. play state continues)
    function _shouldBeCloned(item) {
        var et = item.eventType,
            at = item.assetData.type();

        return et === EventDao.EVENT_TYPE_PLAY || et === EventDao.EVENT_TYPE_BUFFER ||
              (et === EventDao.EVENT_TYPE_START && at !== AssetDao.TYPE_AD );
    }

    function _timeSpanMs(startTime, endTime) {
        return endTime.getTime() - startTime.getTime();
    }

    // Export symbols.
    heartbeat.context.Timeline = Timeline;
})(core, heartbeat);

(function(core, heartbeat) {
    'use strict';

    var mixin = core.mixin;
    var logger = core.logger;
    var Report = heartbeat.model.Report;
    var EventDao = heartbeat.model.EventDao;
    var AssetDao = heartbeat.model.AssetDao;
    var ReportEntry = heartbeat.model.ReportEntry;

    mixin(ReporterHelper, logger);
    function ReporterHelper(context) {
        this._context = context;

        // Activate logging for this class.
        this.enableLogging('[heartbeat::ReporterHelper] > ');
    }

    //
    // ------------[ Public API ]---------------
    //

    ReporterHelper.prototype.createReportForItem = function(timelineItem, trackingInterval) {
        var counters = this._context._counters;
        var report = new Report(this._context._adobeAnalyticsData,
                                this._context._userData,
                                this._context._serviceProviderData,
                                this._context._sessionData);

        // Out-of-band events have a duration of 0.
        timelineItem.duration = 0;

        // Update the global counters.
        counters.incrementTotalCount(timelineItem);
        counters.increaseTotalDuration(timelineItem);

        report.addEntry(this._buildReportEntryForItem(timelineItem, trackingInterval));

        return report;
    };

    ReporterHelper.prototype.createReportForQuantum = function(trackingInterval, isFinalReport) {
        var i;
        var currentItem;

        // First we select the timeline items that are part of the current quantum
        var selectedItems = this._selectTimelineItemsForCurrentQuantum(isFinalReport);

        this.log("#createReportForQuantum() > -------------[ SUMMARY REPORT ]----------------");
        for (i = 0; i < selectedItems.length; i++) {
            currentItem = selectedItems[i];

            this.log("#createReportForQuantum() > "
                    + " | " + currentItem.assetData.type()
                    + " | " + currentItem.eventType
                    + " | " + currentItem.playhead
                    + " | " + currentItem.duration);
        }

        // ... and then we compact that list to make sure that there are no duplicates.
        selectedItems = this._compactTimelineItems(selectedItems);

        this.log("#createReportForQuantum() > -----------------------------------------");
        for (i = 0; i < selectedItems.length; i++) {
            currentItem = selectedItems[i];

            this.log("#createReportForQuantum() > "
                    + " | " + currentItem.assetData.type()
                    + " | " + currentItem.eventType
                    + " | " + currentItem.playhead
                    + " | " + currentItem.duration);
        }

        this.log("#createReportForQuantum() > -----------------------------------------");

        // Finally we turn the compacted list into a report.
        var report = this._createReport(selectedItems, trackingInterval, isFinalReport);

        return report;
    };


    //
    // -------------------[ Private helper methods ]-----------------------
    //

    ReporterHelper.prototype._selectTimelineItemsForCurrentQuantum = function(isFinalReport) {
        var timelineItems = this._context._timeline.getTimelineItems(),
            selectedItems = [],
            lastItemPos, i;

        if (isFinalReport) {
            // the last report won't have an ACTIVE event
            lastItemPos = timelineItems.length;
        } else {
            // Find the position of the last ACTIVE item in the array.
            // We expect it to be last or second-to-last (if there is a continuation pseudo-event).
            for (i = timelineItems.length - 2; i < timelineItems.length; i++) {
                var lastItem = timelineItems[i];
                if (lastItem.eventType === EventDao.EVENT_TYPE_ACTIVE) {
                    // ... put this ACTIVE item in the selected-items list then break out
                    lastItemPos = i;
                    selectedItems.unshift(lastItem);
                    break;
                }
            }

            if (!lastItemPos) {
                throw new Error("Expecting an ACTIVE event in the last 2 on the timeline.");
            }
        }

        // Scan the timeline backwards, use previous ACTIVE as a marker to stop
        for (i = lastItemPos - 1; i >= 0; i--) {
            var currentItem = timelineItems[i];

            // Select all the items until the previous ACTIVE event is encountered,
            // or until we reach the beginning of the timeline.
            if (currentItem.eventType != EventDao.EVENT_TYPE_ACTIVE) {
                selectedItems.unshift(currentItem);
            } else {
                // We found the previous ACTIVE event: break-out.
                break;
            }
        }

        return selectedItems;
    };

    ReporterHelper.prototype._compactTimelineItems = function(items) {
        var compactedList = [];
        var i;

        var findInCompactedItemsList = function(item) {
            var i;
            for (i = 0; i < compactedList.length; i++) {
                var currentItem = compactedList[i];
                var matched = false;

                // Let's see of the event and asset types match.
                if (item.eventType == currentItem.eventType &&
                    item.assetData.type() == currentItem.assetData.type()) {
                    // If we are dealing with an ad, we need to see if the ad-ids match.
                    if (item.assetData.type() == AssetDao.TYPE_AD) {
                        matched = ((item.assetData.adData().adId() == currentItem.assetData.adData().adId()) &&
                                   (item.assetData.adData().podPosition() == currentItem.assetData.adData().podPosition()));
                    }
                    // If we are dealing with the main asset, we need to match the video-ids.
                    else {
                        matched = (item.assetData.videoId() == currentItem.assetData.videoId());

                        // TODO: at this point, if "matched" is false something really bad happened (switch to ERROR).
                    }

                    // If we don't have a match so far, just move on.
                    if (!matched) continue;

                    // If the assets coincide, we also need to check
                    // if we have a match on the chapter info.
                    if (item.assetData.chapterData()) {
                        matched = (currentItem.assetData.chapterData() &&
                            (item.assetData.chapterData().id() == currentItem.assetData.chapterData().id()) &&
                            (item.assetData.chapterData().position() == currentItem.assetData.chapterData().position()));
                    } else {
                        matched = (currentItem.assetData.chapterData() == null);
                    }
                }

                if (matched) { // We found what we are looking for.
                    return currentItem;
                }
            }

            return null;
        };

        for (i = 0; i < items.length; i++) {
            var currentItem = items[i];

            var compactedItem = findInCompactedItemsList(currentItem);

            if (!compactedItem) {
                // The item is not in the compacted items list: add it now.
                compactedList.push(currentItem);
            } else {
                // The item is already in the compacted item list: update it.
                compactedItem.playhead = currentItem.playhead;
                compactedItem.timestamp = currentItem.timestamp;
                compactedItem.duration += currentItem.duration;
            }
        }

        return compactedList;
    };

    ReporterHelper.prototype._createReport = function(items, trackingInterval, isFinalReport) {
        var i;
        var report = new Report(this._context._adobeAnalyticsData,
                                this._context._userData,
                                this._context._serviceProviderData,
                                this._context._sessionData);

        for (i = 0; i < items.length; i++) {
            report.addEntry(this._buildReportEntryForItem(items[i], trackingInterval));
        }

        // We need to attribute all the report entries inside this report to the same quantum
        // as represented by the last ACTIVE event. The final report will end with a PAUSE.
        var lastReportEntry = report.reportEntries[report.reportEntries.length - 1];
        if (!isFinalReport && lastReportEntry.eventData.type() != EventDao.EVENT_TYPE_ACTIVE) {
            throw new Error("Expecting the last report entry to represent an ACTIVE event.");
        }

        for (i = 0; i < report.reportEntries.length - 1; i++) {
            var currentReportEntry = report.reportEntries[i];
            currentReportEntry.eventData.tsAsDate(lastReportEntry.eventData.tsAsDate());
        }

        // We don't want to send the PAUSE events over the network.
        report.discardPauseEvents();

        return report;
    };

    ReporterHelper.prototype._buildReportEntryForItem = function(timelineItem, trackingInterval) {
        var counters = this._context._counters;

        // Set the event data.
        var eventData = new EventDao(trackingInterval);
        eventData.type(timelineItem.eventType);
        eventData.count(timelineItem.getEventCount());
        eventData.duration(timelineItem.duration);
        eventData.totalCount(counters.getTotalCount(timelineItem));
        eventData.totalDuration(counters.getTotalDuration(timelineItem));
        eventData.playhead(timelineItem.playhead);

        // Set the timestamp values.
        eventData.ts(timelineItem.timestamp.getTime());
        eventData.prevTs(timelineItem.prevItemOfSameType
            ? timelineItem.prevItemOfSameType.timestamp.getTime()
            : -1);

        // Build the report entry.
        return new ReportEntry(eventData,
            timelineItem.assetData,
            timelineItem.streamData,
            timelineItem.qosData);
    };


    // Export symbols.
    heartbeat.context.ReporterHelper = ReporterHelper;
})(core, heartbeat);

(function(core, heartbeat, va, utils) {
    'use strict';

    var mixin = core.mixin;
    var deferrable = core.deferrable;
    var logger = core.logger;
    var Event = core.radio.Event;
    var InputDataSanitizer = core.InputDataSanitizer;
    var ReporterHelper = heartbeat.context.ReporterHelper;
    var TrackingTimer = heartbeat.clock.TrackingTimer;
    var Timeline = heartbeat.context.Timeline;
    var TimelineItem = heartbeat.context.TimelineItem;
    var History = heartbeat.context.History;
    var SessionDao = heartbeat.model.SessionDao;
    var AdobeAnalyticsDao = heartbeat.model.AdobeAnalyticsDao;
    var AssetDao = heartbeat.model.AssetDao;
    var ServiceProviderDao = heartbeat.model.ServiceProviderDao;
    var UserDao = heartbeat.model.UserDao;
    var StreamDao = heartbeat.model.StreamDao;
    var QoSDao = heartbeat.model.QoSDao;
    var ChapterDao = heartbeat.model.ChapterDao;
    var Counters = heartbeat.context.Counters;
    var ClockEvent = heartbeat.event.ClockEvent;
    var NetworkEvent = heartbeat.event.NetworkEvent;
    var ApiEvent = heartbeat.event.ApiEvent;
    var ContextEvent = heartbeat.event.ContextEvent;
    var EventKeyName = heartbeat.event.EventKeyName;
    var EventDao = heartbeat.model.EventDao;
    var AdDao = heartbeat.model.AdDao;
    var Version = va.Version;
    var MD5 = utils.md5;

    var HeartbeatPlugin;

    var ERROR_SOURCE_PLAYER = "sourceErrorSDK";
    var ERROR = "error";

    mixin(Context, deferrable);
    mixin(Context, logger);

    function Context(channel) {
        // TODO: hack, circular reference
        HeartbeatPlugin = heartbeat.HeartbeatPlugin;

        this._assetData = null;
        this._streamData = null;
        this._qosData = null;
        this._sessionData = null;

        this._adobeAnalyticsData = new AdobeAnalyticsDao();
        this._serviceProviderData = new ServiceProviderDao();
        this._userData = new UserDao();

        this._videoAssetType = null;

        // Maintains a map of accumulated metrics (i.e. counters/duration)
        // for each type of event that is placed on the timeline.
        this._counters = new Counters();

        // A map where we store for each event on the timeline a reference to the last
        // event of the same type that occurred. It helps greatly with creating the
        // reporting data that is required by the SaaSBase backend.
        this._history = null;

        // A vector which maintains a "timeline" view of the video-tracking events that are
        // triggered by the API layer.
        this._timeline = null;

        this._isTrackingSessionActive = false;
        this._isVideoComplete = false;
        this._activeAssetId = null;
        this._isDestroyed = false;

        // Instantiate the helper class for building tracking reports.
        this._reporterHelper = new ReporterHelper(this);

        this._channel = channel;

        this._stashedChapterData = null;
        this._stashedAdData = null;

        // Boolean flag that enables/disables support for external error tracking
        // (a.k.a. custom application error tracking).
        this._trackExternalErrors = true;

        this._inputDataSanitizer = new InputDataSanitizer(this._onInvalidInputData, this);

        // We register as observers to various heartbeat events.
        this._installEventListeners();

        // Activate logging for this class.
        this.enableLogging('[heartbeat::Context] > ');
    }


    //
    //--------------------[ Public API ]--------------------
    //
    Context.prototype.destroy = function() {
        if (this._isDestroyed) return;
        this._isDestroyed = true;

        this.log("#destroy()");

        // Detach from the notification center.
        this._uninstallEventListeners();
    };


    //
    //--------------------[ Event handlers ]--------------------
    //

    Context.prototype._onApiConfig = function(e) {
        var info = e.data;

        this.log("#_onApiConfig(" +
            ", tracking_server=" + info[EventKeyName.TRACKING_SERVER] +
            ", check_status_server=" + info[EventKeyName.CHECK_STATUS_SERVER] +
            ", job_id=" + info[EventKeyName.JOB_ID] +
            ", quietMode: " + info[EventKeyName.QUIET_MODE] +
            ")");

        this._adobeAnalyticsData.reportSuiteId(this._channel.request(HeartbeatPlugin.RSID));
        this._adobeAnalyticsData.trackingServer(this._channel.request(HeartbeatPlugin.TRACKING_SERVER));
        this._adobeAnalyticsData.ssl(this._channel.request(HeartbeatPlugin.USE_SSL) ? 1 : 0);

        this._userData.visitorId(this._channel.request(HeartbeatPlugin.VISITOR_ID));
        this._userData.analyticsVisitorId(this._channel.request(HeartbeatPlugin.ANALYTICS_VISITOR_ID));
        this._userData.marketingCloudVisitorId(this._channel.request(HeartbeatPlugin.MARKETING_CLOUD_VISITOR_ID));

        this._serviceProviderData.ovp(this._channel.request(HeartbeatPlugin.OVP));
        this._serviceProviderData.sdk(this._channel.request(HeartbeatPlugin.SDK));
        this._serviceProviderData.channel(this._channel.request(HeartbeatPlugin.CHANNEL));
        this._serviceProviderData.libVersion(Version.getVersion());
        this._serviceProviderData.apiLevel(Version.getApiLevel());

        // The "check-status" timer must be activated.
        this._channel.trigger(new ClockEvent(ClockEvent.CLOCK_CHECK_STATUS_ENABLE));
    };

    Context.prototype._onApiVideoLoad = function() {
        this._resetInternalState();

        var videoInfo = this._channel.request(HeartbeatPlugin.VIDEO_INFO);
        // Sanitize the input data
        if (!this._inputDataSanitizer.sanitizeVideoInfo(videoInfo)) return;

        this.log("#_onApiVideoLoad(" +
              "id=" + videoInfo.id +
            ", length=" + videoInfo.length +
            ", type=" + videoInfo.streamType +
            ", player_name=" + videoInfo.playerName +
            ")");

        this._activeAssetId = videoInfo.id;

        this._serviceProviderData.playerName(videoInfo.playerName);

        this._assetData.videoId(this._activeAssetId);
        this._assetData.duration(videoInfo.length);
        this._assetData.type(videoInfo.streamType);
        this._assetData.publisher(this._channel.request(HeartbeatPlugin.PUBLISHER));

        this._videoAssetType = this._assetData.type();

        this._streamData.name(videoInfo.name || this._activeAssetId);

        // Generate a new session ID value.
        this._sessionData.sessionId(_generateSessionId());

        // Reset the main video counters.
        this._counters.resetCounters(this._activeAssetId, this._videoAssetType);

        // Send the LOAD event immediately (out-of-band).
        this._updateQoSInfo();
        var loadItem = new TimelineItem(this._assetData,
//                                        this._userData,
                                        this._streamData,
                                        this._qosData,
                                        EventDao.EVENT_TYPE_LOAD, 0);
        loadItem.prevItemOfSameType = this._history.getPreviousItemOfSameTypeWith(loadItem);

        // Update the history data
        this._history.updateWith(loadItem);

        var trackingInterval = this._channel.request(TrackingTimer.TRACKING_TIMER_INTERVAL);
        var report = this._reporterHelper.createReportForItem(loadItem, trackingInterval);

        // Issue a CONTEXT_DATA_AVAILABLE event.
        var eventData = {};
        eventData[EventKeyName.REPORT] = report;
        this._channel.trigger(new ContextEvent(ContextEvent.CONTEXT_DATA_AVAILABLE, eventData));

        // The tracking session has started.
        this._isTrackingSessionActive = true;
    };

    Context.prototype._onApiVideoUnload = function(e) {
        if (!this._isTrackingSessionActive) {
            this.warn("#_onApiVideoUnload() > No active tracking session.");
            return;
        }

        this.log("#_onApiVideoUnload()");

        // Send the UNLOAD event immediately (out-of-band).
        var trackingInterval = this._channel.request(TrackingTimer.TRACKING_TIMER_INTERVAL);

        var unloadItem = new TimelineItem(this._assetData,
                                          this._streamData,
                                          this._qosData,
                                          EventDao.EVENT_TYPE_UNLOAD, 0);
        unloadItem.prevItemOfSameType = this._history.getPreviousItemOfSameTypeWith(unloadItem);

        // Update the history data
        this._history.updateWith(unloadItem);

        var report = this._reporterHelper.createReportForItem(unloadItem, trackingInterval);

        // Issue a CONTEXT_DATA_AVAILABLE event.
        var eventData = {};
        eventData[EventKeyName.REPORT] = report;
        this._channel.trigger(new ContextEvent(ContextEvent.CONTEXT_DATA_AVAILABLE, eventData));

        // The playback session is now complete.
        this._isTrackingSessionActive = false;
    };

    Context.prototype._onApiVideoStart = function(e) {
        if (!this._checkCall("_onApiVideoStart")) return;

        this.log("#_onApiVideoStart()");

        var playhead = this._getPlayhead();
        if (playhead == null || isNaN(playhead)) {
            return;
        }

        // The tracking timer must be activated.
        var eventData = {};
        eventData[EventKeyName.RESET] = true;
        this._channel.trigger(new ClockEvent(ClockEvent.CLOCK_TRACKING_ENABLE, eventData));

        // Place the START event on the timeline.
        this._updateQoSInfo();
        var startItem = new TimelineItem(this._assetData,
                                         this._streamData,
                                         this._qosData,
                                         EventDao.EVENT_TYPE_START,
                                         playhead);
        startItem.prevItemOfSameType = this._history.getPreviousItemOfSameTypeWith(startItem);
        this._placeItemOnTimeline(startItem);
    };

    Context.prototype._onApiVideoComplete = function(e) {
        if (!this._checkCall("_onApiVideoComplete")) return;

        this.log("#_onApiVideoComplete()");

        // Place the COMPLETE event on the timeline (for main asset).
        this._updateQoSInfo();
        var completeItem = new TimelineItem(this._assetData,
                                            this._streamData,
                                            this._qosData,
                                            EventDao.EVENT_TYPE_COMPLETE,
                                            this._assetData.duration());
        completeItem.prevItemOfSameType = this._history.getPreviousItemOfSameTypeWith(completeItem);
        this._placeItemOnTimeline(completeItem);

        var trackingInterval = this._channel.request(TrackingTimer.TRACKING_TIMER_INTERVAL);

        // Inject a fake PAUSE event on the timeline. Forces counters to be computed for the completeItem
        var pauseItem = new TimelineItem(this._assetData,
                                         this._streamData,
                                         this._qosData,
                                         EventDao.EVENT_TYPE_PAUSE, 0);
        pauseItem.prevItemOfSameType = this._history.getPreviousItemOfSameTypeWith(pauseItem);
        this._placeItemOnTimeline(pauseItem);

        // Create the last report.
        var report = this._reporterHelper.createReportForQuantum(trackingInterval, true);

        // Issue a CONTEXT_DATA_AVAILABLE event.
        var eventData  = {};
        eventData[EventKeyName.REPORT] = report;
        this._channel.trigger(new ContextEvent(ContextEvent.CONTEXT_DATA_AVAILABLE, eventData));

        // The "tracking" timer must be deactivated.
        eventData = {};
        eventData[EventKeyName.RESET] = true;
        this._channel.trigger(new ClockEvent(ClockEvent.CLOCK_TRACKING_DISABLE, eventData));

        // Mark the main asset as being complete.
        this._isVideoComplete = true;
    };

    Context.prototype._onApiPlay = function(e) {
        if (!this._checkCall("_onApiPlay")) return;

        this.log("#_onApiPlay()");

        var playhead = this._getPlayhead();
        if (playhead == null || isNaN(playhead)) {
            return;
        }

        // The "tracking" timer must be activated.
        this._channel.trigger(new ClockEvent(ClockEvent.CLOCK_TRACKING_ENABLE));

        // Place the PLAY event on the timeline.
        this._updateQoSInfo();
        var playItem = new TimelineItem(this._assetData,
                                        this._streamData,
                                        this._qosData,
                                        EventDao.EVENT_TYPE_PLAY,
                                        playhead);
        playItem.prevItemOfSameType = this._history.getPreviousItemOfSameTypeWith(playItem);
        this._placeItemOnTimeline(playItem);
    };

    Context.prototype._onApiPause = function(e) {
        if (!this._checkCall("_onApiPause")) return;

        this.log("#_onApiPause()");

        var playhead = this._getPlayhead();
        if (playhead == null || isNaN(playhead)) {
            return;
        }

        // Place the PAUSE event on the timeline.
        this._updateQoSInfo();
        var pauseItem = new TimelineItem(this._assetData,
                                         this._streamData,
                                         this._qosData,
                                         EventDao.EVENT_TYPE_PAUSE,
                                         playhead);
        pauseItem.prevItemOfSameType = this._history.getPreviousItemOfSameTypeWith(pauseItem);
        this._placeItemOnTimeline(pauseItem);

        // The "tracking" timer must be deactivated.
        this._channel.trigger(new ClockEvent(ClockEvent.CLOCK_TRACKING_DISABLE));
    };

    Context.prototype._onApiBufferStart = function(e) {
        if (!this._checkCall("_onApiBufferStart")) return;

        this.log("#_onApiBufferStart()");

        var playhead = this._getPlayhead();
        if (playhead == null || isNaN(playhead)) {
            return;
        }

        // Place the BUFFER_START event on the timeline.
        this._updateQoSInfo();
        var bufferStartItem = new TimelineItem(this._assetData,
                                               this._streamData,
                                               this._qosData,
                                               EventDao.EVENT_TYPE_BUFFER,
                                               playhead);
        bufferStartItem.prevItemOfSameType = this._history.getPreviousItemOfSameTypeWith(bufferStartItem);
        this._placeItemOnTimeline(bufferStartItem);
    };

    Context.prototype._onApiSeekStart = function(e) {
        if (!this._checkCall("_onApiSeekStart")) return;

        this.log("#_onApiSeekStart()");

        // We need to stash the ad/chapter data in order to be able
        // to reuse it when seek completes (if needed).
        this._stashedAdData = this._assetData.adData();
        this._stashedChapterData = this._assetData.chapterData();

        // Nullify & reset the ad/chapter information (we don't know where we will end-up).
        this._assetData.adData(null);
        this._assetData.type(this._videoAssetType);
        this._activeAssetId = this._assetData.videoId();

        this._assetData.chapterData(null);
    };

    Context.prototype._onApiSeekComplete = function(e) {
        if (!this._checkCall("_onApiSeekComplete")) return;

        // Do a full-sync with the video player.
        var adBreakInfo = this._channel.request(HeartbeatPlugin.AD_BREAK_INFO);
        if (!this._inputDataSanitizer.sanitizeAdBreakInfo(adBreakInfo, true)) {
            return;
        }

        var adInfo = this._channel.request(HeartbeatPlugin.AD_INFO);
        if (!this._inputDataSanitizer.sanitizeAdInfo(adInfo, true)) {
            return;
        }

        var chapterInfo = this._channel.request(HeartbeatPlugin.CHAPTER_INFO);
        if (!this._inputDataSanitizer.sanitizeChapterInfo(chapterInfo, true)) {
            return;
        }

        if (adBreakInfo && adInfo) {
            var podId = MD5(this._assetData.videoId()) + "_" + adBreakInfo.position;

            // If the ad did not change, reuse the stashed chapter data.
            if (this._stashedAdData &&
                this._stashedAdData.podId() == podId &&
                parseInt(this._stashedAdData.podPosition(), 10) == adInfo.position) {

                this._assetData.adData(this._stashedAdData);
                this._activeAssetId = this._stashedAdData.adId();
            } else if (!this._assetData.adData()) {
                this._activeAssetId = adInfo.id;

                // Set-up the ad-data associated to the current ad.
                var adData = new AdDao();
                adData.adId(this._activeAssetId);
                adData.length(adInfo.length);
                adData.resolver(adBreakInfo.playerName);
                adData.podId(podId);
                adData.podSecond(adBreakInfo.startTime);
                adData.podPosition(adInfo.position + "");
                adData.sid(_generateSessionId());

                this._assetData.adData(adData);
            }

            // The asset type is now AD.
            this._assetData.type(AssetDao.TYPE_AD);
        } else {
            this._assetData.adData(null);
            this._assetData.type(this._videoAssetType);

            this._activeAssetId = this._assetData.videoId();
        }

        if (chapterInfo) {
            // If the chapter did not change, reuse the stashed chapter data.
            if (this._stashedChapterData &&
                chapterInfo.position == this._stashedChapterData.position()) {

                this._assetData.chapterData(this._stashedChapterData);
            } else if (!this._assetData.chapterData()) {
                // Set-up the chapter DAO.
                var chapterData = new ChapterDao();
                chapterData.id(MD5(this._assetData.videoId()) + "_" + chapterInfo.position);
                chapterData.name(chapterInfo.name);
                chapterData.length(chapterInfo.length);
                chapterData.position(chapterInfo.position);
                chapterData.offset(chapterInfo.startTime);
                chapterData.sid(_generateSessionId());

                this._assetData.chapterData(chapterData);
            }
        } else {
            this._assetData.chapterData(null);
        }

        // We are done with all the stashed data
        this._stashedAdData = null;
        this._stashedChapterData = null;
    };

    Context.prototype._onApiAdStart = function() {
        if (!this._checkCall("_onApiAdStart")) return;

        var adBreakInfo = this._channel.request(HeartbeatPlugin.AD_BREAK_INFO);
        if (!this._inputDataSanitizer.sanitizeAdBreakInfo(adBreakInfo, false)) return;

        var videoInfo = this._channel.request(HeartbeatPlugin.VIDEO_INFO);
        if (!this._inputDataSanitizer.sanitizeVideoInfo(videoInfo)) return;

        // The user of this API did not provide the start-time for this pod.
        // We assume that the start-time is equal with the current playhead
        // value inside the main content.
        if (adBreakInfo.startTime == null || isNaN(adBreakInfo.startTime)) {

            adBreakInfo.startTime = videoInfo.playhead;
        }

        var adInfo = this._channel.request(HeartbeatPlugin.AD_INFO);
        if (!this._inputDataSanitizer.sanitizeAdInfo(adInfo, false)) return;

        this.log("#_onApiAdStart(" +
              "id=" + adInfo.id +
            ", length=" + adInfo.length +
            ", player_name=" + adBreakInfo.playerName +
            ", parent_name=" + this._assetData.videoId() +
            ", pod_pos=" + adInfo.position +
            ", pod_offset=" + adBreakInfo.startTime +
            ")");

        this._activeAssetId = adInfo.id;

        // Set-up the ad-data associated to the current ad.
        var adData = new AdDao();
        adData.adId(this._activeAssetId);
        adData.length(adInfo.length);
        adData.resolver(adBreakInfo.playerName);
        adData.podId(MD5(this._assetData.videoId()) + "_" + adBreakInfo.position);
        adData.podSecond(adBreakInfo.startTime);
        adData.podPosition(adInfo.position + "");
        adData.sid(_generateSessionId());

        this._assetData.adData(adData);

        // The asset type is now AD.
        this._assetData.type(AssetDao.TYPE_AD);

        // Reset the ad counters.
        this._counters.resetCounters(this._activeAssetId, AssetDao.TYPE_AD);

        // Place the START event on the timeline.
        this._updateQoSInfo();
        var startItem = new TimelineItem(this._assetData,
                                         this._streamData,
                                         this._qosData,
                                         EventDao.EVENT_TYPE_START,
                                         videoInfo.playhead);
        startItem.prevItemOfSameType = this._history.getPreviousItemOfSameTypeWith(startItem);
        this._placeItemOnTimeline(startItem);
    };

    Context.prototype._onApiAdComplete = function(e) {
        if (!this._checkCall("_onApiAdComplete")) return;

        this.log("#_onApiAdComplete()");

        if (this._assetData.type() != AssetDao.TYPE_AD) {
            this.warn("#_onApiAdComplete() > Ignoring the ad complete event, because we are no longer in an ad.");
            return;
        }

        var playhead = this._getPlayhead();
        if (playhead == null || isNaN(playhead)) {
            return;
        }

        this._updateQoSInfo();

        // Place the PLAY event on the timeline (for ad asset).
        var playItem = new TimelineItem(this._assetData,
                                        this._streamData,
                                        this._qosData,
                                        EventDao.EVENT_TYPE_PLAY,
                                        playhead);
        playItem.prevItemOfSameType = this._history.getPreviousItemOfSameTypeWith(playItem);
        this._placeItemOnTimeline(playItem);

        // Place the COMPLETE event on the timeline (for ad asset).
        var completeItem = new TimelineItem(this._assetData,
                                            this._streamData,
                                            this._qosData,
                                            EventDao.EVENT_TYPE_COMPLETE,
                                            playhead);
        completeItem.prevItemOfSameType = this._history.getPreviousItemOfSameTypeWith(completeItem);
        this._placeItemOnTimeline(completeItem);

        // Nullify the ad data.
        this._assetData.adData(null);

        // Revert back to the type of the main content.
        this._assetData.type(this._videoAssetType);
        this._activeAssetId = this._assetData.videoId();
    };

    Context.prototype._onApiChapterStart = function(e) {
        if (!this._checkCall("_onApiChapterStart")) return;

        var chapterInfo = this._channel.request(HeartbeatPlugin.CHAPTER_INFO);
        if (!this._inputDataSanitizer.sanitizeChapterInfo(chapterInfo, false)) return;

        this.log("#_onApiChapterStart(" +
              "name=" + chapterInfo.name +
            ", length=" + chapterInfo.length +
            ", position=" + chapterInfo.position +
            ", chapter_offset=" + chapterInfo.startTime +
            ")");

        var playhead = this._getPlayhead();
        if (playhead == null || isNaN(playhead)) {
            return;
        }

        // Set-up the chapter DAO.
        var chapterData = new ChapterDao();
        chapterData.id(MD5(this._assetData.videoId()) + "_" + chapterInfo.position);
        chapterData.name(chapterInfo.name);
        chapterData.length(chapterInfo.length);
        chapterData.position(chapterInfo.position);
        chapterData.offset(chapterInfo.startTime);
        chapterData.sid(_generateSessionId());

        this._assetData.chapterData(chapterData);

        this._updateQoSInfo();

        // If the last item is a PLAY event, we must segment it into 2 parts:
        // one inside and one outside the chapter.
        if (this._timeline.getLast().eventType == EventDao.EVENT_TYPE_PLAY) {
            var item = new TimelineItem(this._assetData,
                                        this._streamData,
                                        this._qosData,
                                        this._timeline.getLast().eventType,
                                        playhead);
            item.prevItemOfSameType = this._history.getPreviousItemOfSameTypeWith(item);
            this._placeItemOnTimeline(item);
        }

        var trackingInterval = this._channel.request(TrackingTimer.TRACKING_TIMER_INTERVAL);

        // Send the CHAPTER_START event immediately (out-of-band).
        // The CHAPTER_START event must always be in the context of the main video asset.
        // Take a snapshot of the AssetDao instance.
        var noAdInfoAssetData = new AssetDao(this._assetData);
        // ...but exclude the ad-related info.
        noAdInfoAssetData.adData(null);
        // ... and make sure that the asset type coincides with the type of the main asset.
        noAdInfoAssetData.type(this._videoAssetType);

        var startChapterItem = new TimelineItem(noAdInfoAssetData,
                                                this._streamData,
                                                this._qosData,
                                                EventDao.EVENT_TYPE_CHAPTER_START,
                                                playhead);
        startChapterItem.prevItemOfSameType = this._history.getPreviousItemOfSameTypeWith(startChapterItem);

        // Update the history data.
        this._history.updateWith(startChapterItem);

        var report = this._reporterHelper.createReportForItem(startChapterItem, trackingInterval);

        // Issue a CONTEXT_DATA_AVAILABLE event.
        var eventData = {};
        eventData[EventKeyName.REPORT] = report;
        this._channel.trigger(new ContextEvent(ContextEvent.CONTEXT_DATA_AVAILABLE, eventData));
    };

    Context.prototype._onApiChapterComplete = function(e) {
        if (!this._checkCall("_onApiChapterComplete")) return;

        this.log("#_onApiChapterComplete()");

        if (!this._assetData.chapterData()) {
            this.warn("#_onApiChapterComplete() > Ignoring the chapter complete event, because we are no longer in a chapter.");
            return;
        }

        var playhead = this._getPlayhead();
        if (playhead == null || isNaN(playhead)) {
            return;
        }

        var trackingInterval = this._channel.request(TrackingTimer.TRACKING_TIMER_INTERVAL);

        // Send the CHAPTER_COMPLETE event immediately (out-of-band).
        // The CHAPTER_COMPLETE event must always be in the context of the main video asset.
        // Take a snapshot of the AssetDao instance.
        var noAdInfoAssetData = new AssetDao(this._assetData);
        // ...but exclude the ad-related info.
        noAdInfoAssetData.adData(null);
        // ... and make sure that the asset type coincides with the type of the main asset.
        noAdInfoAssetData.type(this._videoAssetType);

        this._updateQoSInfo();
        var completeChapterItem = new TimelineItem(noAdInfoAssetData,
                                                   this._streamData,
                                                   this._qosData,
                                                   EventDao.EVENT_TYPE_CHAPTER_COMPLETE,
                                                   playhead);
        completeChapterItem.prevItemOfSameType = this._history.getPreviousItemOfSameTypeWith(completeChapterItem);

        // Update the history data.
        this._history.updateWith(completeChapterItem);

        var report = this._reporterHelper.createReportForItem(completeChapterItem, trackingInterval);

        // Issue a CONTEXT_DATA_AVAILABLE event.
        var eventData = {};
        eventData[EventKeyName.REPORT] = report;
        this._channel.trigger(new ContextEvent(ContextEvent.CONTEXT_DATA_AVAILABLE, eventData));

        // We are no longer inside a chapter.
        this._assetData.chapterData(null);

        // If the last item is a PLAY event, we must segment it in 2 parts:
        // one inside and one outside the chapter.
        if (this._timeline.getLast().eventType == EventDao.EVENT_TYPE_PLAY) {
            var item = new TimelineItem(this._assetData,
                                        this._streamData,
                                        this._qosData,
                                        this._timeline.getLast().eventType,
                                        playhead);

            item.prevItemOfSameType = this._history.getPreviousItemOfSameTypeWith(item);
            this._placeItemOnTimeline(item);
        }
    };

    Context.prototype._onApiBitrateChange = function(e) {
        if (!this._checkCall("_onApiBitrateChange")) return;

        this.log("#_onApiBitrateChange()");

        var playhead = this._getPlayhead();
        if (playhead == null || isNaN(playhead)) {
            return;
        }

        var trackingInterval = this._channel.request(TrackingTimer.TRACKING_TIMER_INTERVAL);

        // Send the BITRATE_CHANGE event immediately (out-of-band).
        this._updateQoSInfo();
        var bitrateChangeItem = new TimelineItem(this._assetData,
                                                 this._streamData,
                                                 this._qosData,
                                                 EventDao.EVENT_TYPE_BITRATE_CHANGE,
                                                 playhead);
        bitrateChangeItem.prevItemOfSameType = this._history.getPreviousItemOfSameTypeWith(bitrateChangeItem);

        // Update the history data.
        this._history.updateWith(bitrateChangeItem);

        var report = this._reporterHelper.createReportForItem(bitrateChangeItem, trackingInterval);

        // Issue a CONTEXT_DATA_AVAILABLE event.
        var eventData = {};
        eventData[EventKeyName.REPORT] = report;
        this._channel.trigger(new ContextEvent(ContextEvent.CONTEXT_DATA_AVAILABLE, eventData));
    };

    Context.prototype._onApiTrackError = function(e) {
        if (!this._checkCall("_onApiTrackError")) return;

        var playhead = this._getPlayhead();
        if (playhead == null || isNaN(playhead)) {
            return;
        }

        var info = e.data;

        this.log("#_onApiTrackError(" +
            "source="+ info[EventKeyName.SOURCE] +
            ", err_id="+ info[EventKeyName.ERROR_ID] +
            ")");

        // If external error tracking is disabled, we must skip
        // the error reports issued by the application layer.
        if (!this._trackExternalErrors && info[EventKeyName.SOURCE] !== ERROR_SOURCE_PLAYER) {
            return;
        }

        var trackingInterval = this._channel.request(TrackingTimer.TRACKING_TIMER_INTERVAL);

        // Send the ERROR event immediately (out-of-band).
        this._updateQoSInfo();
        var errorItem = new TimelineItem(this._assetData,
                                         this._streamData,
                                         this._qosData,
                                         EventDao.EVENT_TYPE_ERROR,
                                         playhead);
        errorItem.prevItemOfSameType = this._history.getPreviousItemOfSameTypeWith(errorItem);

        // Update the history data.
        this._history.updateWith(errorItem);

        var report = this._reporterHelper.createReportForItem(errorItem, trackingInterval);

        // We need to set the error id and error source for the error report.
        var reportEntry = report.reportEntries[0];
        reportEntry.eventData.id(info[EventKeyName.ERROR_ID]);
        reportEntry.eventData.source(info[EventKeyName.SOURCE]);

        // Issue a CONTEXT_DATA_AVAILABLE event.
        var eventData = {};
        eventData[EventKeyName.REPORT] = report;
        this._channel.trigger(new ContextEvent(ContextEvent.CONTEXT_DATA_AVAILABLE, eventData));
    };

    Context.prototype._onApiTrackInternalError = function(e) {

        var info = e.data;

        this.log("#_onApiTrackInternalError(" +
            "source="+ info[EventKeyName.SOURCE] +
            ", err_id="+ info[EventKeyName.ERROR_ID] +
            ")");

        // Send the ERROR event immediately (out-of-band).
        this._updateQoSInfo();
        var errorItem = new TimelineItem(this._assetData,
                                         this._streamData,
                                         this._qosData,
                                         EventDao.EVENT_TYPE_ERROR,
                                         0);

        var trackingInterval = this._channel.request(TrackingTimer.TRACKING_TIMER_INTERVAL);
        var report = this._reporterHelper.createReportForItem(errorItem, trackingInterval);

        // We need to set the error id and error source for the error report.
        var reportEntry = report.reportEntries[0];
        reportEntry.eventData.id(info[EventKeyName.ERROR_ID]);
        reportEntry.eventData.source(info[EventKeyName.SOURCE]);

        // Issue a CONTEXT_DATA_AVAILABLE event.
        var eventData = {};
        eventData[EventKeyName.REPORT] = report;
        this._channel.trigger(new ContextEvent(ContextEvent.CONTEXT_DATA_AVAILABLE, eventData));
    };

    Context.prototype._onClockTrackingTick = function(e) {
        if (!this._checkCall("_onClockTrackingTick")) return;

        var trackingInterval = e.data[EventKeyName.TIMER_INTERVAL];

        this.log("#_onClockTrackingTick(interval=" + trackingInterval + ")");

        var playhead = this._getPlayhead();
        if (playhead == null || isNaN(playhead)) {
            return;
        }

        // Inject the ACTIVE event on the timeline.
        // Take a snapshot of the AssetDao instance
        var noAdInfoAssetData = new AssetDao(this._assetData);
        // ...but exclude the ad-related info.
        noAdInfoAssetData.adData(null);
        // ... and make sure that the asset type coincides with the type of the main asset.
        noAdInfoAssetData.type(this._videoAssetType);

        this._updateQoSInfo();
        var activeItem = new TimelineItem(noAdInfoAssetData,
                                          this._streamData,
                                          this._qosData,
                                          EventDao.EVENT_TYPE_ACTIVE,
                                          playhead);
        activeItem.prevItemOfSameType = this._history.getPreviousItemOfSameTypeWith(activeItem);

        // Place the item on the timeline.
        this.log("#_onClockTrackingTick() > Adding the ACTIVE event on the time-line.");
        this._timeline.addActiveItem(activeItem);
        // Update the history data.
        this._history.updateWith(activeItem);


        // Create the report for the current quantum.
        var report = this._reporterHelper.createReportForQuantum(trackingInterval, false);

        // Issue a CONTEXT_DATA_AVAILABLE event.
        var eventData = {};
        eventData[EventKeyName.REPORT] = report;
        this._channel.trigger(new ContextEvent(ContextEvent.CONTEXT_DATA_AVAILABLE, eventData));
    };

    Context.prototype._onNetworkCheckStatusComplete = function(e) {
        this._trackExternalErrors = e.data[EventKeyName.TRACK_EXTERNAL_ERRORS];

        this.log("#_onNetworkCheckStatusComplete(track_ext_err=" + this._trackExternalErrors + ")");
    };

    //
    // -------------------[ Private helper methods ]-----------------------
    //

    Context.prototype._installEventListeners = function() {
        this._channel.on(ApiEvent.API_CONFIG, this._onApiConfig, this);
        this._channel.on(ApiEvent.API_VIDEO_LOAD, this._onApiVideoLoad, this);
        this._channel.on(ApiEvent.API_VIDEO_UNLOAD, this._onApiVideoUnload, this);
        this._channel.on(ApiEvent.API_VIDEO_START, this._onApiVideoStart, this);
        this._channel.on(ApiEvent.API_VIDEO_COMPLETE, this._onApiVideoComplete, this);
        this._channel.on(ApiEvent.API_AD_START, this._onApiAdStart, this);
        this._channel.on(ApiEvent.API_AD_COMPLETE, this._onApiAdComplete, this);
        this._channel.on(ApiEvent.API_PLAY, this._onApiPlay, this);
        this._channel.on(ApiEvent.API_PAUSE, this._onApiPause, this);
        this._channel.on(ApiEvent.API_BUFFER_START, this._onApiBufferStart, this);
        this._channel.on(ApiEvent.API_SEEK_START, this._onApiSeekStart, this);
        this._channel.on(ApiEvent.API_SEEK_COMPLETE, this._onApiSeekComplete, this);
        this._channel.on(ApiEvent.API_CHAPTER_START, this._onApiChapterStart, this);
        this._channel.on(ApiEvent.API_CHAPTER_COMPLETE, this._onApiChapterComplete, this);
        this._channel.on(ApiEvent.API_BITRATE_CHANGE, this._onApiBitrateChange, this);
        this._channel.on(ApiEvent.API_TRACK_ERROR, this._onApiTrackError, this);
        this._channel.on(ApiEvent.API_TRACK_INTERNAL_ERROR, this._onApiTrackInternalError, this);

        this._channel.on(ClockEvent.CLOCK_TRACKING_TICK, this._onClockTrackingTick, this);

        this._channel.on(NetworkEvent.NETWORK_CHECK_STATUS_COMPLETE, this._onNetworkCheckStatusComplete, this);
    };

    Context.prototype._uninstallEventListeners = function() {
        this._channel.off(null, null, this);
    };

    Context.prototype._resetInternalState = function() {
        this.log("#_resetInternalState()");

        this._isTrackingSessionActive = false;
        this._isVideoComplete = false;

        this._videoAssetType = null;

        this._counters = new Counters();
        this._history = new History();
        this._timeline = new Timeline(this);
        this._streamData = new StreamDao();
        this._qosData = new QoSDao();
        this._sessionData = new SessionDao();
        this._assetData = new AssetDao();

        this._stashedAdData = null;
        this._stashedChapterData = null;
    };

    function _generateSessionId() {
        return "" + new Date().getTime() + Math.floor(Math.random() * 1000000000);
    }

    Context.prototype._placeItemOnTimeline = function(timelineItem) {
        this.log("#_placeItemOnTimeline(type=" + timelineItem.eventType + ")");

        // Place the item on the timeline.
        this._timeline.addItem(timelineItem);

        // Update the history data.
        this._history.updateWith(timelineItem);
    };

    Context.prototype._getPlayhead = function() {
        var playhead = null;

        var videoInfo = this._channel.request(HeartbeatPlugin.VIDEO_INFO);
        if (this._inputDataSanitizer.sanitizeVideoInfo(videoInfo)) {
            playhead = videoInfo.playhead;
        }

        return playhead;
    };

    Context.prototype._updateQoSInfo = function() {
        // Query the player delegate for the QoS info.
        var qosInfo = this._channel.request(HeartbeatPlugin.QOS_INFO);

        // Sanitize the data obtained from the player delegate.
        this._qosData.bitrate((qosInfo && !isNaN(qosInfo.bitrate)) ? qosInfo.bitrate : 0);
        this._qosData.fps((qosInfo && !isNaN(qosInfo.fps)) ? qosInfo.fps: 0);
        this._qosData.droppedFrames((qosInfo && !isNaN(qosInfo.droppedFrames)) ? qosInfo.droppedFrames : 0);
    };

    Context.prototype._checkCall = function(methodName) {
        if (!this._isTrackingSessionActive) {
            this.warn("#" + methodName + "() > No active tracking session.");
            return false;
        }

        if (this._isVideoComplete) {
            this.warn("#" + methodName + "() > The video content already completed.");
            return false;
        }

        return true;
    };

    Context.prototype._onInvalidInputData = function(errorInfo) {
        this._channel.trigger(new Event(ERROR, errorInfo));
    };

    // Export symbols.
    heartbeat.context.Context = Context;
})(core, heartbeat, va, utils);

(function(heartbeat) {
    'use strict';

    function HeartbeatPluginConfig(trackingServer, jobId) {
        this.quietMode = false;
        this.trackingServer = trackingServer;
        this.jobId = jobId;
    }

    heartbeat.HeartbeatPluginConfig = HeartbeatPluginConfig;

})(heartbeat);

(function(heartbeat, core) {
    'use strict';

    var EventKeyName = heartbeat.event.EventKeyName;

    var Radio = core.radio.Radio;
    var Channel = core.radio.Channel;
    var CommandQueue = core.radio.CommandQueue;
    var Command = core.radio.Command;

    var ApiEvent = heartbeat.event.ApiEvent;
    var ClockEvent = heartbeat.event.ClockEvent;

    var Clock = heartbeat.clock.Clock;
    var Network = heartbeat.network.Network;
    var Context = heartbeat.context.Context;
    var QuerystringSerializer = heartbeat.model.QuerystringSerializer;

    var PluginManager = core.plugin.PluginManager;

    var BasePlugin = core.plugin.BasePlugin;
    core.extend(HeartbeatPlugin, BasePlugin);

    // private constants
    var NAME = "heartbeat";
    var ERROR_SOURCE_HEARTBEAT = "sourceErrorHeartbeat";
    var CHANNEL_HEARTBEAT = "heartbeat";
    var PLAYER_PLUGIN = "player";
    var CONFIG_PLUGIN = "config";
    var AA_PLUGIN = "adobe-analytics";
    var STATE_PLUGIN = BasePlugin.STATE_PLUGIN;

    HeartbeatPlugin.VIDEO_LOAD = "video_load";
    HeartbeatPlugin.VIDEO_UNLOAD = "video_unload";
    HeartbeatPlugin.VIDEO_UNLOADED = "video_unloaded";
    HeartbeatPlugin.VIDEO_START = "video_start";
    HeartbeatPlugin.VIDEO_COMPLETE = "video_complete";
    HeartbeatPlugin.PLAY = "play";
    HeartbeatPlugin.PAUSE = "pause";
    HeartbeatPlugin.AD_START = "ad_start";
    HeartbeatPlugin.AD_COMPLETE = "ad_complete";
    HeartbeatPlugin.BUFFER_START = "buffer_start";
    HeartbeatPlugin.BUFFER_COMPLETE = "buffer_complete";
    HeartbeatPlugin.SEEK_START = "seek_start";
    HeartbeatPlugin.SEEK_COMPLETE = "seek_complete";
    HeartbeatPlugin.CHAPTER_START = "chapter_start";
    HeartbeatPlugin.CHAPTER_COMPLETE = "chapter_complete";
    HeartbeatPlugin.BITRATE_CHANGE = "bitrate_change";
    HeartbeatPlugin.TRACK_ERROR = "track_error";

    HeartbeatPlugin.VIDEO_INFO = "video_info";
    HeartbeatPlugin.AD_BREAK_INFO = "ad_break_info";
    HeartbeatPlugin.AD_INFO = "ad_info";
    HeartbeatPlugin.CHAPTER_INFO = "chapter_info";
    HeartbeatPlugin.QOS_INFO = "qos_info";

    HeartbeatPlugin.RSID = "rsid";
    HeartbeatPlugin.TRACKING_SERVER = "tracking_server";
    HeartbeatPlugin.USE_SSL = "use_ssl";
    HeartbeatPlugin.VISITOR_ID = "visitor_id";
    HeartbeatPlugin.ANALYTICS_VISITOR_ID = "analytics_visitor_id";
    HeartbeatPlugin.MARKETING_CLOUD_VISITOR_ID = "marketing_cloud_visitor_id";

    HeartbeatPlugin.OVP = "ovp";
    HeartbeatPlugin.SDK = "sdk";
    HeartbeatPlugin.CHANNEL = "channel";
    HeartbeatPlugin.PUBLISHER = "publisher";
    /**
     * @extends {BasePlugin}
     * @constructor
     */
    function HeartbeatPlugin() {
        HeartbeatPlugin.__super__.constructor.call(this, NAME);

        this._radio = new Radio();
        var channel = this._channel = this._radio.channel(CHANNEL_HEARTBEAT);

        this._workQueue = new CommandQueue(true);

        this._clock = null;
        this._context = null;
        this._network = null;

        // We are not configured yet.
        this._isConfigured = false;

        // Bootstrap the collection engine module.
        this._initSubmodules();

        // We are interested in the ERROR event triggered by the collection engine.
        channel.on(PluginManager.ERROR, this._onError, this);
        channel.on(HeartbeatPlugin.VIDEO_UNLOADED, this._onVideoUnloaded, this);

        // We are can also resolve all the data requests formulated by the
        // collection engine by forwarding the request via the plugin delegate.
        // TODO: fix code repetition with helper / delegate method
        channel.reply(HeartbeatPlugin.RSID, function() { return this._pluginManager.request(AA_PLUGIN, HeartbeatPlugin.RSID); }, this);
        channel.reply(HeartbeatPlugin.TRACKING_SERVER, function() { return this._pluginManager.request(AA_PLUGIN, HeartbeatPlugin.TRACKING_SERVER); }, this);
        channel.reply(HeartbeatPlugin.USE_SSL, function() { return this._pluginManager.request(AA_PLUGIN, HeartbeatPlugin.USE_SSL); }, this);
        channel.reply(HeartbeatPlugin.VISITOR_ID, function() { return this._pluginManager.request(AA_PLUGIN, HeartbeatPlugin.VISITOR_ID); }, this);
        channel.reply(HeartbeatPlugin.ANALYTICS_VISITOR_ID, function() { return this._pluginManager.request(AA_PLUGIN, HeartbeatPlugin.ANALYTICS_VISITOR_ID); }, this);
        channel.reply(HeartbeatPlugin.MARKETING_CLOUD_VISITOR_ID, function() { return this._pluginManager.request(AA_PLUGIN, HeartbeatPlugin.MARKETING_CLOUD_VISITOR_ID); }, this);

        channel.reply(HeartbeatPlugin.ERROR_INFO, function() { return this._pluginManager.request(STATE_PLUGIN, HeartbeatPlugin.ERROR_INFO); }, this);
        channel.reply(HeartbeatPlugin.OVP, function() { return this._pluginManager.request(CONFIG_PLUGIN, HeartbeatPlugin.OVP); }, this);
        channel.reply(HeartbeatPlugin.SDK, function() { return this._pluginManager.request(CONFIG_PLUGIN, HeartbeatPlugin.SDK); }, this);
        channel.reply(HeartbeatPlugin.CHANNEL, function() { return this._pluginManager.request(CONFIG_PLUGIN, HeartbeatPlugin.CHANNEL); }, this);
        channel.reply(HeartbeatPlugin.PUBLISHER, function() { return this._pluginManager.request(CONFIG_PLUGIN, HeartbeatPlugin.PUBLISHER); }, this);

        channel.reply(HeartbeatPlugin.VIDEO_INFO, function() { return this._pluginManager.request(PLAYER_PLUGIN, HeartbeatPlugin.VIDEO_INFO); }, this);
        channel.reply(HeartbeatPlugin.AD_BREAK_INFO, function() { return this._pluginManager.request(PLAYER_PLUGIN, HeartbeatPlugin.AD_BREAK_INFO); }, this);
        channel.reply(HeartbeatPlugin.AD_INFO, function() { return this._pluginManager.request(PLAYER_PLUGIN, HeartbeatPlugin.AD_INFO); }, this);
        channel.reply(HeartbeatPlugin.CHAPTER_INFO, function() { return this._pluginManager.request(PLAYER_PLUGIN, HeartbeatPlugin.CHAPTER_INFO); }, this);
        channel.reply(HeartbeatPlugin.QOS_INFO, function() { return this._pluginManager.request(PLAYER_PLUGIN, HeartbeatPlugin.QOS_INFO); }, this);
    }

    //
    //---------------------[ Public API ]---------------------
    //

    HeartbeatPlugin.prototype.configure = function(config) {
        this.log("#configure({" +
            ", trackingServer=" + config.trackingServer +
            ", jobId="          + config.jobId +
            ", quietMode="      + config.quietMode +
            "})");

        var checkStatusServer = config.trackingServer + "/settings/";

        // Let everybody know about the update of the configuration settings.
        var eventData = {};
        eventData[EventKeyName.TRACKING_SERVER]     = config.trackingServer;
        eventData[EventKeyName.CHECK_STATUS_SERVER] = checkStatusServer;
        eventData[EventKeyName.JOB_ID]              = config.jobId;
        eventData[EventKeyName.QUIET_MODE]          = config.quietMode;

        this._enqueueEvent(new ApiEvent(ApiEvent.API_CONFIG, eventData));
        this._enqueueEvent(new ClockEvent(ClockEvent.CLOCK_CHECK_STATUS_GET_SETTINGS));

        // We are now configured.
        this._isConfigured = true;
    };

    HeartbeatPlugin.prototype.bootstrap = function(pluginManager) {
        // Do the plugin core bootstrapping.
        HeartbeatPlugin.__super__.bootstrap.call(this, pluginManager);

        // Player to Api events mapping
        var map = this._eventMap = {};
        map[HeartbeatPlugin.VIDEO_LOAD] = ApiEvent.API_VIDEO_LOAD;
        map[HeartbeatPlugin.VIDEO_UNLOAD] = ApiEvent.API_VIDEO_UNLOAD;
        
        map[HeartbeatPlugin.VIDEO_START] = ApiEvent.API_VIDEO_START;
        map[HeartbeatPlugin.VIDEO_COMPLETE] = ApiEvent.API_VIDEO_COMPLETE;
        
        map[HeartbeatPlugin.PLAY] = ApiEvent.API_PLAY;
        map[HeartbeatPlugin.PAUSE] = ApiEvent.API_PAUSE;
        map[HeartbeatPlugin.AD_START] = ApiEvent.API_AD_START;
        map[HeartbeatPlugin.AD_COMPLETE] = ApiEvent.API_AD_COMPLETE;
        map[HeartbeatPlugin.BUFFER_START] = ApiEvent.API_BUFFER_START;
        map[HeartbeatPlugin.SEEK_START] = ApiEvent.API_SEEK_START;
        map[HeartbeatPlugin.SEEK_COMPLETE] = ApiEvent.API_SEEK_COMPLETE;
        map[HeartbeatPlugin.CHAPTER_START] = ApiEvent.API_CHAPTER_START;
        map[HeartbeatPlugin.CHAPTER_COMPLETE] = ApiEvent.API_CHAPTER_COMPLETE;
        map[HeartbeatPlugin.BITRATE_CHANGE] = ApiEvent.API_BITRATE_CHANGE;
        map[HeartbeatPlugin.TRACK_ERROR] = ApiEvent.API_TRACK_ERROR;

        // custom actions can "wrap" the default action by doing some logic before or after sending the API event
        var actions = this._customActions = {};
        actions[HeartbeatPlugin.VIDEO_LOAD] = this._onVideoLoad;
        actions[HeartbeatPlugin.VIDEO_UNLOAD] = this._onVideoUnload;
        actions[HeartbeatPlugin.PLAY] = this._onPlay;
        actions[HeartbeatPlugin.PAUSE] = this._onPause;
        actions[HeartbeatPlugin.AD_START] = this._onAdStart;
        actions[HeartbeatPlugin.AD_COMPLETE] = this._onAdComplete;
        actions[HeartbeatPlugin.BUFFER_START] = this._onBufferStart;
        actions[HeartbeatPlugin.BUFFER_COMPLETE] = this._onBufferComplete;
        actions[HeartbeatPlugin.SEEK_START] = this._onSeekStart;
        actions[HeartbeatPlugin.SEEK_COMPLETE] = this._onSeekComplete;
        actions[HeartbeatPlugin.TRACK_ERROR] = this._onTrackError;

        // We are interested in all the player events.
        this._pluginManager.on(PLAYER_PLUGIN, Channel.WILDCARD, this._onPlayerEvent, this);

        // Clear the state variables.
        this._resetInternalState();
    };

    HeartbeatPlugin.prototype.setup = function() {
        // If there is a AA_PLUGIN plugin present, we can make use of its data.
        if (this._pluginManager.pluginExists(AA_PLUGIN)) {
            if (this._pluginManager.isPluginInitialized(AA_PLUGIN)) { // if the AA_PLUGIN is already initialized...
                this._completeInitialization();
            } else { // ... if not, just listen on its INITIALIZED event.
                this._pluginManager.on(AA_PLUGIN, BasePlugin.INITIALIZED, this._completeInitialization, this);
            }
        } else {
            this._completeInitialization();
        }
    };

    //
    //---------------------[ Protected API ]---------------------
    //
    HeartbeatPlugin.prototype._teardown = function() {
        this.log("#_teardown()");

        // Shutdown the private radio channel.
        this._radio.shutdown();

        // Tear-down all sub-modules.
        this._context.destroy();
        this._clock.destroy();
        this._network.destroy();

        // stop command handlers
        this._workQueue.cancelAllCommands();
    };

    //
    //---------------------[ Event Handlers API ]---------------------
    //

    // This is the "main" callback for ALL Player events
    HeartbeatPlugin.prototype._onPlayerEvent = function(e) {
        // Fast exit.
        if (!this._canProcess()) return;

        // extract player event type and data
        var meta        = e.type.split(":"),
            playerEvent = meta[1],
            playerData  = e.data;

        this.log("#_onPlayerEvent() > Tracking event: " + playerEvent.toUpperCase());

        this._retriggerEvent(playerEvent, playerData);
    };

    // enqueue api calls to be executed async
    // - maps them on the ApiEvent nomenclature
    // - allows for particular events to be handled differently by wrapping the core logic
    HeartbeatPlugin.prototype._retriggerEvent = function(playerEvent, playerData) {
        var apiEvent = this._eventMap[playerEvent],
            customAction = this._customActions[playerEvent];

        // can't handle incoming player event
        if (!apiEvent && (typeof customAction !== "function")) {
            return;
        }

        var self = this;
        // partial application that enqueues the API event
        var defaultAction = function (data) {
            return self._enqueueEvent(new ApiEvent(apiEvent, data));
        };

        if (typeof customAction === "function") {
            // delegate to custom action if there is one
            customAction.call(this, defaultAction, playerData);
        } else {
            // otherwise fall back to default action
            defaultAction(playerData);
        }
    };

    //
    //---------------------[ Custom actions per event type ]---------------------
    //
    HeartbeatPlugin.prototype._onVideoLoad = function(defaultAction) {
        // If there is already another tracking session in progress, terminate it.
        if (this._isTrackingSessionActive) {
            this._enqueueEvent(new ApiEvent(ApiEvent.API_VIDEO_UNLOAD));
        }

        // Reset the internal state variables.
        this._resetInternalState();

        // Start the tracking session.
        defaultAction();

        // The tracking session is now started.
        this._isTrackingSessionActive = true;
    };

    HeartbeatPlugin.prototype._onVideoUnload = function(defaultAction) {
        // Complete the tracking session.
        defaultAction();

        // The tracking session is now complete.
        this._isTrackingSessionActive = false;
    };

    HeartbeatPlugin.prototype._onPlay = function(defaultAction) {
        // This was an explicit PLAY command: we are no longer in the "paused" state.
        this._isPaused = false;

        // Resume playback.
        this._resumePlaybackIfPossible();
    };

    HeartbeatPlugin.prototype._onPause = function(defaultAction) {
        // Pause the playback.
        defaultAction();

        // This was an explicit PAUSE command: we are now in the "paused" state.
        this._isPaused = true;
    };

    HeartbeatPlugin.prototype._onAdStart = function(defaultAction) {
        // Start tracking the ad content.
        defaultAction();

        // Automatically start playback (we implement auto-playback for ad content).
        this._resumePlaybackIfPossible();

    };

    HeartbeatPlugin.prototype._onAdComplete = function(defaultAction) {
        defaultAction();

        // If we are not in "paused" / "seeking" / "buffering" state, we inject a play event.
        this._resumePlaybackIfPossible();
    };

    HeartbeatPlugin.prototype._onBufferStart = function(defaultAction) {
        defaultAction();

        this._isBuffering = true;
    };

    HeartbeatPlugin.prototype._onBufferComplete = function() {
        this._isBuffering = false;

        this._resumePlaybackIfPossible();
    };

    HeartbeatPlugin.prototype._onSeekStart = function(defaultAction) {
        defaultAction();

        // Seek operations are async. Pause the playback until the seek completes.
        this._enqueueEvent(new ApiEvent(ApiEvent.API_PAUSE));

        this._isSeeking = true;
    };

    HeartbeatPlugin.prototype._onSeekComplete = function(defaultAction) {
        defaultAction();

        this._isSeeking = false;

        this._resumePlaybackIfPossible();
    };

    HeartbeatPlugin.prototype._onTrackError = function(defaultAction, info) {
        this.log("#_onTrackError(source=" + info[EventKeyName.SOURCE]
            + ", errorId=" + info[EventKeyName.ERROR_ID] + ").");

        // Track the ERROR event.
        defaultAction(info);
    };

    HeartbeatPlugin.prototype._onError = function(e) {
        var errorInfo = e.data;

        var eventData = {};
        eventData[EventKeyName.SOURCE] = ERROR_SOURCE_HEARTBEAT;
        eventData[EventKeyName.ERROR_ID] = errorInfo.message + "|" + errorInfo.details;
        this._channel.trigger(new ApiEvent(ApiEvent.API_TRACK_INTERNAL_ERROR, eventData));

        eventData = {};
        eventData[EventKeyName.RESET] = true;
        this._channel.trigger(new ClockEvent(ClockEvent.CLOCK_TRACKING_DISABLE, eventData));

        this._workQueue.cancelAllCommands();

        this._trigger(PluginManager.ERROR, e.data);
    };

    HeartbeatPlugin.prototype._onVideoUnloaded = function() {
        this._trigger(HeartbeatPlugin.VIDEO_UNLOADED);
    };

    //
    // -------------------[ Private helper methods ]-----------------------
    //
    HeartbeatPlugin.prototype._initSubmodules = function() {
        this._context = new Context(this._channel);
        this._clock = new Clock(this._channel);
        this._network = new Network(this._channel, new QuerystringSerializer());
    };

    HeartbeatPlugin.prototype._canTrack = function() {
        if (!this._isConfigured) {
            this.warn("_canTrack() > Unable to track!" +
                " Is configured: " + this._isConfigured);
        }

        return this._isConfigured;
    };

    HeartbeatPlugin.prototype._enqueueEvent = function(e) {
        this.log("#_enqueueEvent() : " + e.type);
        this._workQueue.addCommand(new Command(function() {
            // Fast exit.
            if (!this._canTrack()) return;
            this._channel.trigger(e);
        }, this));
    };

    HeartbeatPlugin.prototype._resetInternalState = function() {
        this._isTrackingSessionActive = false;
        this._isPaused = false;
        this._isSeeking = false;
        this._isBuffering = false;
    };

    HeartbeatPlugin.prototype._resumePlaybackIfPossible = function() {
        // Only resume playback if we're neither "paused", "seeking" nor "buffering"
        if (!this._isPaused && !this._isSeeking && !this._isBuffering) {
            this._enqueueEvent(new ApiEvent(ApiEvent.API_PLAY));
        }
    };

    HeartbeatPlugin.prototype._completeInitialization = function() {
        // If we have an error, we just clear the work-queue and exit.
        var errorInfo = this._pluginManager.request(STATE_PLUGIN, BasePlugin.ERROR_INFO);
        if (errorInfo) {
            this.warn("#_completeInitialization() > Unable to track: in ERROR state.");

            this._workQueue.cancelAllCommands();
            return;
        }

        // Flush the work queue.
        this._workQueue.flush();

        HeartbeatPlugin.__super__.setup.call(this);
    };

    // Export symbols.
    heartbeat.HeartbeatPlugin = HeartbeatPlugin;
})(heartbeat, core);
(function(plugins, core) {
    'use strict';

    var BasePlugin = core.plugin.BasePlugin;
    core.extend(ConfigPlugin, BasePlugin);

    // private constants
    var NAME = "config";

    /**
     * @extends {BasePlugin}
     * @constructor
     */
    function ConfigPlugin() {
        ConfigPlugin.__super__.constructor.call(this, NAME);
        
        this._config = null;

        // Set handlers for the requests we are able to handle.
        var cfgMap = {};
        cfgMap["publisher"]    = "publisher";
        cfgMap["channel"]      = "channel";
        cfgMap["ovp"]          = "ovp";
        cfgMap["sdk"]          = "sdk";
        cfgMap["is_primetime"] = "__primetime";

        this._dataResolver = function(key) {
            return (this._config) ? this._config[cfgMap[key]] : null;
        };
    }

    ConfigPlugin.prototype.configure = function(configData) {
        this._config = configData;
        ConfigPlugin.__super__.setup.call(this);
    };

    ConfigPlugin.prototype.setup = function() {
        // Do nothing.
    };

    // Export symbols.
    plugins.ConfigPlugin = ConfigPlugin;
})(plugins, core);
(function(plugins, core) {
    'use strict';

    var BasePlugin = core.plugin.BasePlugin;
    var PluginManager = core.plugin.PluginManager;

    core.extend(StatePlugin, BasePlugin);

    // private constants
    var NAME = "state";

    /**
     * @extends {BasePlugin}
     * @constructor
     */
    function StatePlugin() {
        StatePlugin.__super__.constructor.call(this, NAME);
    }

    //
    //---------------------[ Public API ]---------------------
    //
    StatePlugin.prototype.bootstrap = function(pluginManager) {
        // Do the plugin core bootstrapping.
        StatePlugin.__super__.bootstrap.call(this, pluginManager);

        // We need to hook into the ERROR event:
        this._pluginManager.on(PluginManager.ALL_PLUGINS, PluginManager.ERROR, this._onError, this);

        // Set handlers for the requests we are able to handle.
        this._dataResolver[BasePlugin.ERROR_INFO] = function() {
            return (this._isEnabled) ? this._errorInfo : null;
        };
    };

    //
    //---------------------[ Event handlers ]---------------------
    //
    StatePlugin.prototype._onError = function(e) {
        this._errorInfo = e.data;
        this.warn("#_onError() > " + this._errorInfo.message + ": " + this._errorInfo.details);
    };

    // Export symbols.
    plugins.StatePlugin = StatePlugin;
})(plugins, core);
(function(plugins, core, heartbeat) {
    'use strict';

    var EventKeyName = heartbeat.event.EventKeyName;

    var BasePlugin = core.plugin.BasePlugin;
    var PluginManager = core.plugin.PluginManager;

    core.extend(PlayerPlugin, BasePlugin);

    // private constants
    var NAME = "player";

    var ERROR_SOURCE_APPLICATION = "sourceErrorExternal";
    var ERROR_SOURCE_PLAYER = "sourceErrorSDK";

    var HEARTBEAT_PLUGIN = "heartbeat";

    PlayerPlugin.VIDEO_LOAD = "video_load";
    PlayerPlugin.VIDEO_UNLOAD = "video_unload";
    PlayerPlugin.VIDEO_UNLOADED = "video_unloaded";
    PlayerPlugin.VIDEO_START = "video_start";
    PlayerPlugin.VIDEO_COMPLETE = "video_complete";
    PlayerPlugin.PLAY = "play";
    PlayerPlugin.PAUSE = "pause";
    PlayerPlugin.AD_START = "ad_start";
    PlayerPlugin.AD_COMPLETE = "ad_complete";
    PlayerPlugin.BUFFER_START = "buffer_start";
    PlayerPlugin.BUFFER_COMPLETE = "buffer_complete";
    PlayerPlugin.SEEK_START = "seek_start";
    PlayerPlugin.SEEK_COMPLETE = "seek_complete";
    PlayerPlugin.CHAPTER_START = "chapter_start";
    PlayerPlugin.CHAPTER_COMPLETE = "chapter_complete";
    PlayerPlugin.BITRATE_CHANGE = "bitrate_change";
    PlayerPlugin.TRACK_ERROR = "track_error";

    var VIDEO_INFO = "video_info";
    var AD_BREAK_INFO = "ad_break_info";
    var AD_INFO = "ad_info";
    var CHAPTER_INFO = "chapter_info";
    var QOS_INFO = "qos_info";

    /**
     * @extends {BasePlugin}
     * @constructor
     */
    function PlayerPlugin(playerDelegate) {
        PlayerPlugin.__super__.constructor.call(this, NAME);

        this._playerDelegate = playerDelegate;
    }

    //
    //---------------------[ Public API ]---------------------
    //
    PlayerPlugin.prototype.setup = function() {
        this._pluginManager.on(HEARTBEAT_PLUGIN, PlayerPlugin.VIDEO_UNLOADED, this._onVideoUnloaded, this);
        this._pluginManager.on(PluginManager.ALL_PLUGINS, PluginManager.ERROR, this._onError, this);

        this._checkPlayerDelegate();

        // Set handlers for the requests we are able to handle.
        var fnMap = {};
        fnMap[VIDEO_INFO]    = this._playerDelegate.getVideoInfo;
        fnMap[AD_INFO]       = this._playerDelegate.getAdInfo;
        fnMap[AD_BREAK_INFO] = this._playerDelegate.getAdBreakInfo;
        fnMap[CHAPTER_INFO]  = this._playerDelegate.getChapterInfo;
        fnMap[QOS_INFO]      = this._playerDelegate.getQoSInfo;

        this._dataResolver = function (key) {
            return (this._isEnabled) ? fnMap[key].call(this._playerDelegate) : null;
        };

        PlayerPlugin.__super__.setup.call(this);
    };

    // -----------------[ Video playback tracking ]---------------------

    PlayerPlugin.prototype.trackVideoLoad = function() {
        if (!this._canProcess()) return;

        this._trigger(PlayerPlugin.VIDEO_LOAD);
        this._trigger(PlayerPlugin.VIDEO_START);
    };

    PlayerPlugin.prototype.trackVideoUnload = function() {
        if (!this._canProcess()) return;

        this._trigger(PlayerPlugin.VIDEO_UNLOAD);
    };

    PlayerPlugin.prototype.trackPlay = function() {
        if (!this._canProcess()) return;

        this._trigger(PlayerPlugin.PLAY);
    };

    PlayerPlugin.prototype.trackPause = function() {
        if (!this._canProcess()) return;

        this._trigger(PlayerPlugin.PAUSE);
    };

    PlayerPlugin.prototype.trackBufferStart = function() {
        if (!this._canProcess()) return;

        this._trigger(PlayerPlugin.BUFFER_START);
    };

    PlayerPlugin.prototype.trackBufferComplete = function() {
        if (!this._canProcess()) return;

        this._trigger(PlayerPlugin.BUFFER_COMPLETE);
    };

    PlayerPlugin.prototype.trackSeekStart = function() {
        if (!this._canProcess()) return;

        this._trigger(PlayerPlugin.SEEK_START);
    };

    PlayerPlugin.prototype.trackSeekComplete = function() {
        if (!this._canProcess()) return;

        this._trigger(PlayerPlugin.SEEK_COMPLETE);
    };

    PlayerPlugin.prototype.trackComplete = function() {
        if (!this._canProcess()) return;

        this._trigger(PlayerPlugin.VIDEO_COMPLETE);
    };

    // -----------------[ Chapter tracking ]---------------------

    PlayerPlugin.prototype.trackChapterStart = function() {
        if (!this._canProcess()) return;

        this._trigger(PlayerPlugin.CHAPTER_START);
    };

    PlayerPlugin.prototype.trackChapterComplete = function() {
        if (!this._canProcess()) return;

        this._trigger(PlayerPlugin.CHAPTER_COMPLETE);
    };

    // -----------------[ Ad tracking ]---------------------
    PlayerPlugin.prototype.trackAdStart = function() {
        if (!this._canProcess()) return;

        this._trigger(PlayerPlugin.AD_START);
    };

    PlayerPlugin.prototype.trackAdComplete = function() {
        if (!this._canProcess()) return;

        this._trigger(PlayerPlugin.AD_COMPLETE);
    };

    // -----------------[ QoS tracking ]---------------------
    PlayerPlugin.prototype.trackBitrateChange = function() {
        if (!this._canProcess()) return;

        this._trigger(PlayerPlugin.BITRATE_CHANGE);
    };

    // -----------------[ Error tracking ]---------------------
    PlayerPlugin.prototype.trackVideoPlayerError = function(errorId) {
        var eventData = {};
        eventData[EventKeyName.SOURCE] = ERROR_SOURCE_PLAYER;
        eventData[EventKeyName.ERROR_ID] = errorId;

        this._trigger(PlayerPlugin.TRACK_ERROR, eventData);
    };

    PlayerPlugin.prototype.trackApplicationError = function(errorId) {
        var eventData = {};
        eventData[EventKeyName.SOURCE] = ERROR_SOURCE_APPLICATION;
        eventData[EventKeyName.ERROR_ID] = errorId;

        this._trigger(PlayerPlugin.TRACK_ERROR, eventData);
    };

    //
    //---------------------[ Event Handlers API ]---------------------
    //
    PlayerPlugin.prototype._onVideoUnloaded = function(e) {
        if (!this._canProcess()) return;

        this._playerDelegate.onVideoUnloaded();
    };

    PlayerPlugin.prototype._onError = function(e) {
        if (!this._canProcess()) return;

        var self = this;
        window.setTimeout(function () {
            self._playerDelegate.onError(e.data);
        }, 100);
    };

    //
    //---------------------[ Private helper methods ]---------------------
    //
    PlayerPlugin.prototype._checkPlayerDelegate = function() {
        if (!this._playerDelegate) {
            this.error("PlayerDelegate cannot be null.")
        }

        if (typeof this._playerDelegate.getVideoInfo !== "function") {
            this.error("PlayerDelegate must define the getVideoInfo method.")
        }

        if (typeof this._playerDelegate.getAdBreakInfo !== "function") {
            this.error("PlayerDelegate must define the getAdBreakInfo method.")
        }

        if (typeof this._playerDelegate.getAdInfo !== "function") {
            this.error("PlayerDelegate must define the getAdInfo method.")
        }

        if (typeof this._playerDelegate.getChapterInfo !== "function") {
            this.error("PlayerDelegate must define the getChapterInfo method.")
        }

        if (typeof this._playerDelegate.getQoSInfo !== "function") {
            this.error("PlayerDelegate must define the getQoSInfo method.")
        }
    };



    // Export symbols.
    plugins.PlayerPlugin = PlayerPlugin;
})(plugins, core, heartbeat);
(function(core, va, heartbeat, utils, plugins) {
    'use strict';

    var PluginManager = core.plugin.PluginManager;
    var StatePlugin = plugins.StatePlugin;
    var ConfigPlugin = plugins.ConfigPlugin;
    var PlayerPlugin = plugins.PlayerPlugin;
    var HeartbeatPlugin = heartbeat.HeartbeatPlugin;
    var HeartbeatPluginConfig = heartbeat.HeartbeatPluginConfig;

    var PRIMETIME_OVP = "primetime";

    var STATE_PLUGIN = "state";
    var ERROR_INFO = "error_info";

    core.mixin(VideoHeartbeat, core.logger);

    /**
     * @mixes {core.logger}
     *
     * @constructor
     */
    function VideoHeartbeat(playerDelegate, plugins) {
        // Activate logging for this class.
        this.enableLogging('[video-heartbeat::VideoHeartbeat] > ');

        // Setup the communication backbone.
        this._pluginManager = new PluginManager();

        // Register the state plugin.
        this._statePlugin = new StatePlugin();
        this._pluginManager.addPlugin(this._statePlugin);

        // Register the config plugin.
        this._configPlugin = new ConfigPlugin();
        this._pluginManager.addPlugin(this._configPlugin);

        // Register the player plugin.
        this._playerPlugin = new PlayerPlugin(playerDelegate);
        this._pluginManager.addPlugin(this._playerPlugin);

        // Register the heartbeat plugin.
        this._heartbeatPlugin = new HeartbeatPlugin();
        this._pluginManager.addPlugin(this._heartbeatPlugin);

        // Register the custom plugins.
        plugins = plugins || [];
        for (var i = 0; i < plugins.length; i++) {
            this._pluginManager.addPlugin(plugins[i]);
        }

        // Now that all plugins have been registered with the PluginManager
        // we can move to the setup phase.
        this._pluginManager.setupPlugins();

        this._isDestroyed = false;

        // We are not configured yet.
        this._isConfigured = false;
    }


    //
    // -------------------[ HeartbeatProtocol interface implementation ]-----------------------
    //
    VideoHeartbeat.prototype.configure = function(configData) {
        if (!configData) {
            this.error("Configuration object cannot be NULL");
            return;
        }

        // Configure the logging sub-system.
        core.LOGGING_ENABLED = !!configData.debugLogging;

        // If we are dealing with a primetime OVP, override the custom OVP setting.
        if (configData.__primetime)
            configData.ovp = PRIMETIME_OVP;

        // If we have a PSDK version number available, override the custom SDK setting.
        if (configData.__psdkVersion)
            configData.sdk = configData.__psdkVersion;

        // Configure the config plugin.
        this._configPlugin.configure(configData);

        // Configure to the heartbeat plugin.
        var heartbeatPluginConfig = new HeartbeatPluginConfig(configData.trackingServer, configData.jobId);
        heartbeatPluginConfig.quietMode = configData.quietMode;
        this._heartbeatPlugin.configure(heartbeatPluginConfig);

        this._isConfigured = true;
    };

    VideoHeartbeat.prototype.destroy = function() {
        if (this._isDestroyed) return;

        this._pluginManager.destroy();

        // From this point on, we no longer accepts API requests.
        this._isDestroyed = true;
    };

    VideoHeartbeat.prototype.trackVideoLoad = function() {
        if (!this._isConfigured) {
            this.warn("#trackVideoLoad() > Unable to track: not configured.");
            return;
        }

        if (this._isDestroyed) {
            this.warn("#trackVideoLoad() > Unable to track: instance previously destroyed.");
            return;
        }

        this.log("#trackVideoLoad() > Tracking a VIDEO_LOAD event.");

        // Delegate to the player plugin.
        this._playerPlugin.trackVideoLoad();
    };

    VideoHeartbeat.prototype.trackVideoUnload = function() {
        if (!this._checkCall("trackVideoUnload")) return;

        this.log("#trackVideoUnload() > Tracking a VIDEO_UNLOAD event.");

        // Delegate to the player plugin.
        this._playerPlugin.trackVideoUnload();
    };

    VideoHeartbeat.prototype.trackPlay = function() {
        if (!this._checkCall("trackPlay")) return;

        this.log("#trackPlay() > Tracking a PLAY event.");

        // Delegate to the player plugin.
        this._playerPlugin.trackPlay();
    };

    VideoHeartbeat.prototype.trackPause = function() {
        if (!this._checkCall("trackPause")) return;

        this.log("#trackPause() > Tracking a PAUSE event.");

        this._playerPlugin.trackPause();
    };

    VideoHeartbeat.prototype.trackBufferStart = function() {
        if (!this._checkCall("trackBufferStart")) return;

        this.log("#trackBufferStart() > Tracking a BUFFER_START event.");

        this._playerPlugin.trackBufferStart();
    };

    VideoHeartbeat.prototype.trackBufferComplete = function() {
        if (!this._checkCall("trackBufferComplete")) return;

        this.log("#trackBufferComplete() > Tracking a BUFFER_COMPLETE event.");

        this._playerPlugin.trackBufferComplete();
    };

    VideoHeartbeat.prototype.trackSeekStart = function() {
        if (!this._checkCall("trackSeekStart")) return;

        this.log("#trackSeekStart() > Tracking a SEEK_START event.");

        this._playerPlugin.trackSeekStart();
    };

    VideoHeartbeat.prototype.trackSeekComplete = function() {
        if (!this._checkCall("trackSeekComplete")) return;

        this.log("#trackSeekComplete() > Tracking a SEEK_COMPLETE event.");

        this._playerPlugin.trackSeekComplete();
    };

    VideoHeartbeat.prototype.trackComplete = function() {
        if (!this._checkCall("trackComplete")) return;

        this.log("#trackComplete() > Tracking a COMPLETE event.");

        this._playerPlugin.trackComplete();
    };

    VideoHeartbeat.prototype.trackAdStart = function() {
        if (!this._checkCall("trackAdStart")) return;

        this.log("#trackAdStart() > Tracking an AD_START event.");

        this._playerPlugin.trackAdStart();
    };

    VideoHeartbeat.prototype.trackAdComplete = function() {
        if (!this._checkCall("trackAdComplete")) return;

        this.log("#trackAdComplete() > Tracking an AD_COMPLETE event.");

        this._playerPlugin.trackAdComplete();
    };

    VideoHeartbeat.prototype.trackChapterStart = function() {
        if (!this._checkCall("trackChapterStart")) return;

        this.log("#trackChapterStart() > Tracking a CHAPTER_START event.");

        this._playerPlugin.trackChapterStart();
    };

    VideoHeartbeat.prototype.trackChapterComplete = function() {
        if (!this._checkCall("trackChapterComplete")) return;

        this.log("#trackChapterComplete() > Tracking a CHAPTER_COMPLETE event.");

        this._playerPlugin.trackChapterComplete();
    };

    VideoHeartbeat.prototype.trackBitrateChange = function() {
        if (!this._checkCall("trackBitrateChange")) return;

        this._playerPlugin.trackBitrateChange();
    };

    VideoHeartbeat.prototype.trackVideoPlayerError = function(errorId) {
        if (!this._checkCall("trackVideoPlayerError")) return;

        this.log("#trackVideoPlayerError(errorId=" + errorId + ").");

        // Track the ERROR event.
        this._playerPlugin.trackVideoPlayerError(errorId);
    };

    VideoHeartbeat.prototype.trackApplicationError = function(errorId) {
        if (!this._checkCall("trackApplicationError")) return;

        this.log("#trackApplicationError(errorId=" + errorId + ").");

        // Track the ERROR event.
        this._playerPlugin.trackApplicationError(errorId);
    };


    //
    //---------------------[ Private helper methods ]-----------------------
    //
    VideoHeartbeat.prototype._checkCall = function(methodName) {
        var errorInfo = this._pluginManager.request(STATE_PLUGIN, ERROR_INFO);
        if (errorInfo) {
            this.warn("#" + methodName + "() > Unable to track: in ERROR state. " +
                "Message: " + errorInfo.message +
                " | Details: " + errorInfo.details);

            return false;
        }

        if (!this._isConfigured) {
            this.warn("#" + methodName + "() > Unable to track: not configured.");

            return false;
        }
        if (this._isDestroyed) {
            this.warn("#" + methodName + "() > Unable to track: instance previously destroyed.");

            return false;
        }

        return true;
    };


    VideoHeartbeat.prototype._resetInternalState = function() {
        this.log("#_resetInternalState() : Resetting internal state variables.");

        this._isTrackingSessionActive = false;
        this._isPaused = false;
        this._isSeeking = false;
        this._isBuffering = false;
    };

    // Export symbols.
    va.VideoHeartbeat = VideoHeartbeat;
})(core, va, heartbeat, utils, plugins);




//Export symbols
global.ADB || (global.ADB = {});
global.ADB.core || (global.ADB.core = core);
global.ADB.va = va;
global.ADB.va.plugins = plugins;
global.ADB.va.utils = utils;

})(this);