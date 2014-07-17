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
 * video heartbeats - v1.2.0 - 2014-07-17
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

if (typeof heartbeat === 'undefined') {
    var heartbeat = {};
}

heartbeat.event || (heartbeat.event = {});

heartbeat.model || (heartbeat.model = {});

heartbeat.context || (heartbeat.context = {});

heartbeat.network || (heartbeat.network = {});

heartbeat.clock || (heartbeat.clock = {});

/*
 * JavaScript MD5 1.0.1
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 * 
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/*jslint bitwise: true */
/*global unescape, define */

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
    var MINOR = "3";
    var MICRO = "1";
    var PATCH = "1";
    var BUILD = "845cc96";
    var API_LEVEL = 1;

    /**
     * Container for library version information.
     *
     * @constructor
     */
    function Version() {}

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

    core.deferrable = {
        executeDeferred: function() {
            if (this._deferred) {
                this._deferred.apply(this, arguments);
            }

            this._deferred = null;
        }
    };
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
            if (!core.LOGGING_ENABLED || !this._logEnabled) return;

            if (window["console"] && window["console"]["error"]) {
                msg = this._logTag + msg;
                window["console"]["error"](msg);
                throw new Error(msg);
            }
        }
    };
})(core);

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
    core.Event = Event;
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
     * @param {core.Event} event Event instance.
     */
    EventDispatcher.prototype.dispatchEvent = function(event) {
        if (!event.type) return;

        var key, i;
        for (key in this._events) {
            if (this._events.hasOwnProperty(key) && (event.type === key)) {
                var listeners = this._events[key];
                for (i = 0; i < listeners.length; i++) {
                    listeners[i].cb.call(listeners[i].ctx, event);
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

    function WorkQueue(delay) {
        this._workQueue = [];
        this._delay = (typeof delay !== "undefined") ? delay : 0;
        this._drainInProgress = false;
    }

    WorkQueue.prototype.clear = function() {
        this._workQueue = [];
    };

    WorkQueue.prototype.isEmpty = function() {
        return (this._workQueue.length === 0);
    };

    WorkQueue.prototype.drain = function() {
        if (this._drainInProgress) return;
        this._drainInProgress = true;

        var self = this;
        (function _drain() {
            var currentJob = self._workQueue.shift();

            if (currentJob) {
                self._runJob(currentJob, function() {
                    _drain();
                });
            } else {
                self._drainInProgress = false;
            }
        })();
    };

    WorkQueue.prototype.flush = function() {
        for (var i = 0; i < this._workQueue.length; i++) {
            var job = this._workQueue[i];
            job.fn.apply(job.ctx, job.args);
        }

        // Reset the work queue.
        this._workQueue = [];
    };

    WorkQueue.prototype.addJob = function(name, fn, args, ctx) {
        args = (typeof args !== "undefined") ? args : null;
        ctx = (typeof ctx !== "undefined") ? ctx : null;
        this._workQueue.push({name: name, fn: fn, args: args, ctx: ctx});
    };

    WorkQueue.prototype._runJob = function(job, done) {
        var self = this;
        setTimeout(function() {
            job.fn.apply(job.ctx, job.args);

            if (done != null) {
                done.call(self);
            }
        }, this._delay);
    };

    // Export symbols
    core.WorkQueue = WorkQueue;
})(core);
(function(core) {
    'use strict';

    var Event = core.Event;
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
                self.dispatchEvent(new core.Event(Event.ERROR, eventData));
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

        this.dispatchEvent(new core.Event(Event.SUCCESS, eventData));
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
(function(core) {
    'use strict';

    function Operation(fn, ctx, params) {
        this.fn = fn;
        this.ctx = ctx;
        this.params = params;
    }

    Operation.prototype.run = function() {
        this.fn.apply(this.ctx, this.params);
    };

    // Export symbols.
    core.Operation = Operation;
})(core);
(function(core) {
    'use strict';

    function OperationQueue() {
        this._queue = [];
    }

    OperationQueue.prototype.addOperation = function(operation) {
        this._queue.push(operation);
        this._processQueue();
    };

    OperationQueue.prototype.cancelAllOperations = function() {
        this._queue = [];
    };

    OperationQueue.prototype._processQueue = function() {
        if (this._queue.length) {
            var operation = this._queue.shift();
            var self = this;
            setTimeout(function() {
                operation.run();
                self._processQueue();
            }, 0);
        }
    };

    // Export symbols.
    core.OperationQueue = OperationQueue;
})(core);
(function(core) {
    'use strict';

    var EventDispatcher = core.EventDispatcher;
    var OperationQueue = core.OperationQueue;

    function CommCenter() {
        this.notificationCenter = new EventDispatcher();
        this.workQueue = new OperationQueue();
    }

    // Export symbols.
    core.CommCenter = CommCenter;
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
        this.playhead = null;
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
     * Definition of Adobe's video-tracking DSL.
     *
     * @interface
     */
    function HeartbeatProtocol() {}

    // -----------------[ Configuration & life-cycle management ]---------------------
    HeartbeatProtocol.prototype.configure = function(configData) {};

    HeartbeatProtocol.prototype.destroy = function() {};

    // -----------------[ Video playback tracking ]---------------------
    HeartbeatProtocol.prototype.trackVideoLoad = function() {};

    HeartbeatProtocol.prototype.trackVideoUnload = function() {};

    HeartbeatProtocol.prototype.trackPlay = function() {};

    HeartbeatProtocol.prototype.trackPause = function() {};

    HeartbeatProtocol.prototype.trackBufferStart = function() {};

    HeartbeatProtocol.prototype.trackBufferComplete = function() {};

    HeartbeatProtocol.prototype.trackSeekStart = function() {};

    HeartbeatProtocol.prototype.trackSeekComplete = function() {};

    HeartbeatProtocol.prototype.trackComplete = function() {};

    // -----------------[ Chapter tracking ]---------------------
    HeartbeatProtocol.prototype.trackChapterStart = function() {};

    HeartbeatProtocol.prototype.trackChapterComplete = function() {};

    // -----------------[ Ad tracking ]---------------------
    /**
     * @Deprecated
     */
    HeartbeatProtocol.prototype.trackAdBreakStart = function() {};

    /**
     * @Deprecated
     */
    HeartbeatProtocol.prototype.trackAdBreakComplete = function() {};

    HeartbeatProtocol.prototype.trackAdStart = function() {};

    HeartbeatProtocol.prototype.trackAdComplete = function() {};

    // -----------------[ QoS tracking ]---------------------
    HeartbeatProtocol.prototype.trackBitrateChange = function(bitrate) {};


    // -----------------[ Error tracking ]---------------------
    HeartbeatProtocol.prototype.trackVideoPlayerError = function(errorId) {};

    HeartbeatProtocol.prototype.trackApplicationError = function(errorId) {};

    // Export symbols.
    va.HeartbeatProtocol = HeartbeatProtocol;
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


(function(core, va) {
    'use strict';

    function InputDataSanitizer(invalidDataOperation) {
        this._invalidDataOperation = invalidDataOperation;
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
        this._invalidDataOperation.params = ["Invalid input data", errorString];
        this._invalidDataOperation.run();
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
                return "Video ID must be one of " +
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

            if (adInfo.playhead == null || isNaN(adInfo.playhead)) {
                return "Ad playhead cannot be null or NaN";
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
(function(core, heartbeat) {
    'use strict';

    function EventKeyName() {}

    EventKeyName.REPORT = "report";
    EventKeyName.WHAT = "what";
    EventKeyName.RESET = "reset";
    EventKeyName.ACCOUNT = "account";
    EventKeyName.SC_TRACKING_SERVER = "sc_tracking_server";
    EventKeyName.TRACKING_SERVER = "tracking_server";
    EventKeyName.CHECK_STATUS_SERVER = "check_status_server";
    EventKeyName.JOB_ID = "job_id";
    EventKeyName.PUBLISHER = "publisher";
    EventKeyName.OVP = "ovp";
    EventKeyName.SDK = "sdk";
    EventKeyName.CHANNEL = "channel";
    EventKeyName.USE_SSL = "use_ssl";
    EventKeyName.QUIET_MODE = "quiet_mode";
    EventKeyName.ANALYTICS_VISITOR_ID = "analytics_visitor_id";
    EventKeyName.MARKETING_CLOUD_VISITOR_ID = "marketing_cloud_visitor_id";
    EventKeyName.VISITOR_ID = "visitor_id";
    EventKeyName.VIDEO_INFO = "video_info";
    EventKeyName.AD_INFO = "ad_info";
    EventKeyName.AD_BREAK_INFO = "ad_break_info";
    EventKeyName.CHAPTER_INFO = "chapter_info";
    EventKeyName.MESSAGE = "message";
    EventKeyName.DETAILS = "details";

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

    var Event = core.Event;

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
    ApiEvent.API_BITRATE_CHANGE = "api_bitrate_change";

    // Export symbols.
    heartbeat.event.ApiEvent = ApiEvent;
})(core, heartbeat);

(function(core, heartbeat) {
    'use strict';

    var Event = core.Event;

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

    var Event = core.Event;

    core.extend(DataEvent, Event);

    /**
     * Event providing message-passing interface between partitions.
     *
     * @extends {Event}
     *
     * @constructor
     */
    function DataEvent(type, data) {
        DataEvent.__super__.constructor.call(this, type, data);
    }

    DataEvent.DATA_REQUEST = "data_request";
    DataEvent.DATA_RESPONSE = "data_response";

    DataEvent.keys = {
        TRACKING_TIMER_INTERVAL: "tracking_timer_interval",
        MAIN_VIDEO_PUBLISHER: "main_video_publisher"
    };

    // Export symbols.
    heartbeat.event.DataEvent = DataEvent;
})(core, heartbeat);

(function(core, heartbeat) {
    'use strict';

    var Event = core.Event;

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

    var Event = core.Event;

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

    var Event = core.Event;

    core.extend(ErrorEvent, Event);

    /**
     * Event dispatched when an error occurs.
     *
     * @extends {Event}
     *
     * @constructor
     */
    function ErrorEvent(type, data) {
        ErrorEvent.__super__.constructor.call(this, type, data);
    }

    ErrorEvent.ERROR = "error";

    // Export symbols.
    heartbeat.event.ErrorEvent = ErrorEvent;
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

        this.cpm = this._createAccessor("_cpm", "cpm", null);
        this.adId = this._createAccessor("_adId", "ad_id", null);
        this.sid = this._createAccessor("_sid", "ad_sid", null);
        this.resolver = this._createAccessor("_resolver", "resolver", null);
        this.podId = this._createAccessor("_podId", "pod_id", null);
        this.podPosition = this._createAccessor("_podPosition", "pod_position", null);
        this.podSecond = this._createAccessor("_podSecond", "pod_second", null);
        this.length = this._createAccessor("_length", "length", null);

        this.cpm('');
        this.adId('');
        this.sid('');
        this.resolver('');
        this.podId('');
        this.podPosition('');
        this.podSecond(0);
        this.length(0);

        if (arguments.length && arguments[0] instanceof AdDao) {
            var other = arguments[0];

            this.cpm(other.cpm());
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

    core.extend(SiteCatalystDao, Dao);

    /**
     * DAO describing SiteCatalyst config data.
     *
     * @extends {Dao}
     *
     * @constructor
     */
    function SiteCatalystDao() {
        SiteCatalystDao.__super__.constructor.call(this, "sc");

        this.reportSuiteId = this._createAccessor("_reportSuiteId", "rsid", null);
        this.trackingServer = this._createAccessor("_trackingServer", "tracking_server", null);
        this.ssl = this._createAccessor("_ssl", "ssl", DaoField.HINT_SHORT);

        this.reportSuiteId('');
        this.trackingServer('');
        this.ssl(0);
    }

    // Export symbols.
    heartbeat.model.SiteCatalystDao = SiteCatalystDao;
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

        this.device = this._createAccessor("_device", "device", null);
        this.country = this._createAccessor("_country", "country", null);
        this.city = this._createAccessor("_city", "city", null);
        this.latitude = this._createAccessor("_latitude", "latitude", null);
        this.longitude = this._createAccessor("_longitude", "longitude", null);
        this.analyticsVisitorId = this._createAccessor("_analyticsVisitorId", "aid", null);
        this.marketingCloudVisitorId = this._createAccessor("_marketingCloudVisitorId", "mid", null);
        this.visitorId = this._createAccessor("_visitorId", "id", null);

        this.device(null);
        this.country(null);
        this.city(null);
        this.latitude(null);
        this.longitude(null);
        this.analyticsVisitorId(null);
        this.marketingCloudVisitorId(null);
        this.visitorId(null);

        if (arguments.length && arguments[0] instanceof UserDao) {
            var other = arguments[0];

            this.device(other.device());
            this.country(other.country());
            this.city(other.city());
            this.latitude(other.latitude());
            this.longitude(other.longitude());
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

    function ReportEntry(eventData, assetData, userData, streamData, qosData) {
        this.eventData = eventData;
        this.assetData = assetData;
        this.userData = userData;
        this.streamData = streamData;
        this.qosData = qosData;
    }

    // Export symbols.
    heartbeat.model.ReportEntry = ReportEntry;
})(core, heartbeat);

(function(core, heartbeat) {
    'use strict';

    var EventDao = heartbeat.model.EventDao;

    function Report(siteCatalystData, serviceProviderData, sessionData) {
        this.siteCatalystData = siteCatalystData;
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

            // Append the SC data.
            out += this._appendSerializedData(this.serializeDao(report.siteCatalystData));

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

        // Serialize the user data.
        out += this._appendSerializedData(this.serializeDao(reportEntry.userData));

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
    var Operation = core.Operation;
    var ClockEvent = heartbeat.event.ClockEvent;
    var EventKeyName = heartbeat.event.EventKeyName;

    function TimerDescriptor(interval) {
        this.tick = 0;
        this.interval = interval;
        this.isActive = false;
    }



    var TIMER_BASE_INTERVAL = 1;  // 1 second

    mixin(TimerManager, logger);

    function TimerManager(commCenter) {
        this._isDestroyed = false;
        this._currentTick = 0;
        this._timers = {};
        this._commCenter = commCenter;

        // Setup the base timer for the clock partition.
        var self = this;
        this._clock = setInterval(function() { self._onTick(); }, TIMER_BASE_INTERVAL * 1000);

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
        clearInterval(this._clock);
    };

    //
    //--------------------[ Notification handlers ]--------------------
    //

    TimerManager.prototype._onTick = function() {
        var operation = new Operation(function() {
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

                            this._commCenter.notificationCenter.dispatchEvent(new ClockEvent(ClockEvent[name], eventData));
                        }
                    }
                }
            }
        }, this);

        this._commCenter.workQueue.addOperation(operation);
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
    function Timer(commCenter, timerManager, tickEventName, enableEventName, disableEventName, interval) {
        this.enableLogging('[media-fork::Timer] > ');

        this._isDestroyed = false;

        this._commCenter = commCenter;
        this._timerManager = timerManager;
        this._interval = interval;
        this._tickEventName = tickEventName;
        this._enableEventName = enableEventName;
        this._disableEventName = disableEventName;

        // Register with the timer manager.
        this._timerManager.createTimer(this._tickEventName, this._interval);

        // We register as observers to various heartbeat events.
        this._commCenter.notificationCenter.addEventListener(this._enableEventName, this._onTimerEnabled, this);
        this._commCenter.notificationCenter.addEventListener(this._disableEventName, this._onTimerDisabled, this);
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

        // Detach from the notification center.
        this._commCenter.notificationCenter.removeAllListeners(this);

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


    // Export symbols.
    heartbeat.clock.Timer = Timer;
})(core, heartbeat);

(function(core, heartbeat) {
    'use strict';

    var mixin = core.mixin;
    var logger = core.logger;
    var DataEvent = heartbeat.event.DataEvent;
    var NetworkEvent = heartbeat.event.NetworkEvent;
    var ClockEvent = heartbeat.event.ClockEvent;
    var EventKeyName = heartbeat.event.EventKeyName;
    var Timer = heartbeat.clock.Timer;

    var DEFAULT_TRACKING_INTERVAL = 10; // 10 seconds

    core.extend(TrackingTimer, Timer);
    mixin(TrackingTimer, logger);

    /**
     * @extends clock.Timer
     */
    function TrackingTimer(commCenter, timerManager) {
        TrackingTimer.__super__.constructor.call(this,
            commCenter,
            timerManager,
            ClockEvent.CLOCK_TRACKING_TICK,
            ClockEvent.CLOCK_TRACKING_ENABLE,
            ClockEvent.CLOCK_TRACKING_DISABLE,
            DEFAULT_TRACKING_INTERVAL);

        // We register as observers to various heartbeat events.
        this._commCenter.notificationCenter.addEventListener(NetworkEvent.NETWORK_CHECK_STATUS_COMPLETE, this._onCheckStatusComplete, this);
        this._commCenter.notificationCenter.addEventListener(DataEvent.DATA_REQUEST, this._onDataRequest, this);

        // Activate logging for this class.
        this.enableLogging('[heartbeat::TrackingTimer] > ');
    }


    //
    //--------------------[ Public API ]--------------------
    //

    TrackingTimer.prototype.destroy = function() {
        if (this._isDestroyed) return;

        // Remove all listeners from the notification center.
        this._commCenter.notificationCenter.removeEventListener(NetworkEvent.NETWORK_CHECK_STATUS_COMPLETE, this._onCheckStatusComplete, this);
        this._commCenter.notificationCenter.removeEventListener(DataEvent.DATA_REQUEST, this._onDataRequest, this);

        TrackingTimer.__super__.destroy.call(this);
    };


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

    TrackingTimer.prototype._onDataRequest = function(e) {
        var what = e.data[EventKeyName.WHAT];

        this.log("#_onDataRequest(what=" + what + ")");

        switch (what) {
            case DataEvent.keys.TRACKING_TIMER_INTERVAL:
                var eventData = {};
                eventData[EventKeyName.TIMER_INTERVAL] = this._interval;

                this._commCenter.notificationCenter.dispatchEvent(new DataEvent(DataEvent.DATA_RESPONSE, eventData));
                break;
        }
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
    var Operation = core.Operation;
    var NetworkEvent = heartbeat.event.NetworkEvent;
    var EventKeyName = heartbeat.event.EventKeyName;
    var ClockEvent = heartbeat.event.ClockEvent;
    var Timer = heartbeat.clock.Timer;

    core.extend(CheckStatusTimer, Timer);
    mixin(CheckStatusTimer, logger);

    /**
     * @extends clock.Timer
     */
    function CheckStatusTimer(commCenter, timerManager) {
        CheckStatusTimer.__super__.constructor.call(this,
            commCenter,
            timerManager,
            ClockEvent.CLOCK_CHECK_STATUS_TICK,
            ClockEvent.CLOCK_CHECK_STATUS_ENABLE,
            ClockEvent.CLOCK_CHECK_STATUS_DISABLE,
            DEFAULT_CHECK_STATUS_INTERVAL);

        // We register as observers to various heartbeat events.
        this._commCenter.notificationCenter.addEventListener(NetworkEvent.NETWORK_CHECK_STATUS_COMPLETE, this._onCheckStatusComplete, this);

        // Activate logging for this class.
        this.enableLogging('[heartbeat::CheckStatusTimer] > ');
        this.log("#CheckStatusTimer()");

        // Do the initial settings request.
        var self = this;
        setTimeout(function() { self._initialCheck(); }, 200);
    }

    //
    //--------------------[ Public API ]--------------------
    //

    CheckStatusTimer.prototype.destroy = function() {
        if (this._isDestroyed) return;

        // Remove all listeners from the notification center.
        this._commCenter.notificationCenter.removeEventListener(NetworkEvent.NETWORK_CHECK_STATUS_COMPLETE, this._onCheckStatusComplete, this);

        CheckStatusTimer.__super__.destroy.call(this);
    };


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

    CheckStatusTimer.prototype._initialCheck = function() {
        var operation = new Operation(function() {
            this.log("#_initialCheck()");

            var eventData = {};
            eventData[EventKeyName.TIMER_INTERVAL] = this._interval;

            this._commCenter.notificationCenter.dispatchEvent(new ClockEvent(ClockEvent["CLOCK_CHECK_STATUS_TICK"], eventData));
        }, this);

        this._commCenter.workQueue.addOperation(operation);
    };


    // Export symbols.
    heartbeat.clock.CheckStatusTimer = CheckStatusTimer;
})(core, heartbeat);

(function(core, heartbeat) {
    'use strict';

    var TimerManager = heartbeat.clock.TimerManager;
    var CheckStatusTimer = heartbeat.clock.CheckStatusTimer;
    var TrackingTimer = heartbeat.clock.TrackingTimer;

    function Clock(commCenter) {
        this._isDestroyed = false;

        // Instantiate the timers.
        this._timerManager = new TimerManager(commCenter);
        this._checkStatusTimer = new CheckStatusTimer(commCenter, this._timerManager);
        this._trackingTimer = new TrackingTimer(commCenter, this._timerManager);
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
    var deferrable = core.deferrable;
    var logger = core.logger;
    var Event = core.Event;
    var Operation = core.Operation;
    var OperationQueue = core.OperationQueue;
    var ApiEvent = heartbeat.event.ApiEvent;
    var URLRequestMethod = core.URLRequestMethod;
    var URLRequest = core.URLRequest;
    var URLLoader = core.URLLoader;
    var EventKeyName = heartbeat.event.EventKeyName;
    var DataEvent = heartbeat.event.DataEvent;
    var ClockEvent = heartbeat.event.ClockEvent;
    var ContextEvent = heartbeat.event.ContextEvent;
    var NetworkEvent = heartbeat.event.NetworkEvent;
    var SettingsParser = heartbeat.network.SettingsParser;
    var EventDao = heartbeat.model.EventDao;

    mixin(Network, deferrable);
    mixin(Network, logger);

    function Network(commCenter, serializer, playerDelegate) {
        this._jobId = null;
        this._trackingServer = null;
        this._checkStatusServer = null;

        this._quietMode  = false;
        this._isConfigured = false;
        this._isDestroyed = false;

        this._commCenter = commCenter;
        this._serializer = serializer;
        this._playerDelegate = playerDelegate;

        this._netQueue = new OperationQueue();

        // We register as observers to various heartbeat events.
        this._commCenter.notificationCenter.addEventListener(DataEvent.DATA_RESPONSE, this._onDataResponse, this);
        this._commCenter.notificationCenter.addEventListener(ApiEvent.API_CONFIG, this._onApiConfig, this);
        this._commCenter.notificationCenter.addEventListener(ContextEvent.CONTEXT_DATA_AVAILABLE, this._onContextDataAvailable, this);
        this._commCenter.notificationCenter.addEventListener(ClockEvent.CLOCK_CHECK_STATUS_TICK, this._onClockCheckStatusTick, this);

        // Activate logging for this class.
        this.enableLogging('[heartbeat::Network] > ');
        this.log("#Network()");
    }

    //
    //--------------------[ Public API ]--------------------
    //
    Network.prototype.destroy = function() {
        if (this._isDestroyed) return;
        this._isDestroyed = true;

        this.log("#destroy()");

        // Cancel all async operations.
        this._netQueue.cancelAllOperations();

        // Detach from the notification center.
        this._commCenter.notificationCenter.removeAllListeners(this);
    };

    //
    //--------------------[ Notification handlers ]--------------------
    //
    Network.prototype._onApiConfig = function(e) {
        var info = e.data;

        this.log("#_onApiConfig(" +
              "sb_server=" + info[EventKeyName.TRACKING_SERVER] +
            ", check_status_server=" + info[EventKeyName.CHECK_STATUS_SERVER] +
            ", job_id=" + info[EventKeyName.JOB_ID] +
            ", use_ssl=" + info[EventKeyName.USE_SSL] +
            ", quiet_mode=" + info[EventKeyName.QUIET_MODE] +
            ")");

        this._jobId = info[EventKeyName.JOB_ID];

        this._trackingServer = this._updateRequestProtocol(info[EventKeyName.TRACKING_SERVER], info[EventKeyName.USE_SSL]);
        this._checkStatusServer = this._updateRequestProtocol(info[EventKeyName.CHECK_STATUS_SERVER], info[EventKeyName.USE_SSL]);

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

        var operation = new Operation(function() {
            // Obtain the serialized payload.
            var report = e.data[EventKeyName.REPORT];
            var payloads = this._serializer.serializeReport(report);

            for (var i = 0; i < payloads.length; i++) {
                var payload = payloads[i];
                var error = null;

                // Create and send the request.
                var url = this._trackingServer + "/?__job_id=" + this._jobId + "&" + payload;
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
                this._playerDelegate.onVideoUnloaded();
            }
        }, this);

        this._netQueue.addOperation(operation);
    };

    Network.prototype._onClockCheckStatusTick = function(e) {
        // If we are not configured, we do nothing.
        if (!this._isConfigured) {
            this.warn("#_onClockCheckStatusTick() > Unable to send request: not configured.");
            return;
        }

        var self = this;
        this._deferred = function(response) {
            var publisher = response[EventKeyName.PUBLISHER];

            // Fast exit.
            if (!publisher) {
                this.warn("#_onClockCheckStatusTick() > Publisher is NULL.");
                return;
            }

            var operation = new Operation(function() {
                var self = this;
                function onSuccess(e) {
                    if (e.data) {
                        // Parse the settings document
                        var parser = new SettingsParser(e.data.response);
                        var parseResult = parser.parse();

                        if (parseResult) {
                            self._commCenter.notificationCenter.dispatchEvent(new NetworkEvent(NetworkEvent.NETWORK_CHECK_STATUS_COMPLETE, parseResult));
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
            }, self);

            self._netQueue.addOperation(operation);
        };

        // Issue a data request: the current value of the main-video publisher.
        var eventData = {};
        eventData[EventKeyName.WHAT] = DataEvent.keys.MAIN_VIDEO_PUBLISHER;
        this._commCenter.notificationCenter.dispatchEvent(new DataEvent(DataEvent.DATA_REQUEST, eventData));
    };

    Network.prototype._onDataResponse = function(e) {
        this.executeDeferred(e.data);
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
    var UserDao = heartbeat.model.UserDao;
    var StreamDao = heartbeat.model.StreamDao;

    function TimelineItem(assetData, userData, streamData, qosData, eventType, playhead) {
        this.timestamp = new Date();
        this.assetData = new AssetDao(assetData);
        this.userData = new UserDao(userData);
        this.streamData = new StreamDao(streamData);
        this.qosData = qosData;
        this.eventType = eventType;
        this.playhead = playhead;

        this.duration = NaN;
        this.prevItemOfSameType = null;
    }

    TimelineItem.clone = function(other) {
        var clonedItem = new TimelineItem(other.assetData,
                                          other.userData,
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

    Timeline.prototype.addItem = function(timelineItem, playhead) {
        var counters = this._context._counters;
        var lastItem = this.getLast();

        if (lastItem) {
            if (lastItem.eventType == EventDao.EVENT_TYPE_ACTIVE) {
                var activeItem = lastItem;
                var cumulatedDuration = 0;

                // For the ACTIVE item the duration is the sum of all
                // the durations of the previous non-ACTIVE items going back
                // to the previous ACTIVE event.
                for (var i = this._timeline.length - 2; i >= 0; i--) {
                    var currentItem = this._timeline[i];

                    if (currentItem.eventType == EventDao.EVENT_TYPE_ACTIVE) {
                        // We found the previous ACTIVE item: break-out.
                        break;
                    }

                    cumulatedDuration += currentItem.duration;
                }

                activeItem.duration = cumulatedDuration;
            } else {
                // Update the duration of the last item on the timeline.
                lastItem.duration = _timeSpanMs(lastItem.timestamp, timelineItem.timestamp);
            }

            // Update the total counters.
            counters.incrementTotalCount(lastItem);
            counters.increaseTotalDuration(lastItem);

            this.log("#addItem() > "
                + " | " + timelineItem.assetData.type()
                + " | " + timelineItem.eventType
                + " | " + timelineItem.playhead
                + " | " + (timelineItem.prevItemOfSameType ? timelineItem.prevItemOfSameType.timestamp.getTime() : "-1")
                + " | " + timelineItem.timestamp.getTime());
        }

        // Add the item to the timeline.
        this._timeline.push(timelineItem);

        if (timelineItem.eventType == EventDao.EVENT_TYPE_ACTIVE) {
            // For the ACTIVE item we also need to create a new pseudo-item
            // based on the last item on the timeline.
            var pseudoItem = TimelineItem.clone(lastItem);
            pseudoItem.prevItemOfSameType = lastItem;

            // Adjust various data for the pseudo-item.
            pseudoItem.timestamp = timelineItem.timestamp;
            pseudoItem.playhead = playhead;
            pseudoItem.duration = NaN;

            this.addItem(pseudoItem, playhead);
        }
    };

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
        var report = new Report(this._context._siteCatalystData,
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

    ReporterHelper.prototype.createReportForQuantum = function(trackingInterval) {
        var i;
        var currentItem;

        // First we select the timeline items that are part of the current quantum
        var selectedItems = this._selectTimelineItemsForCurrentQuantum();

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
        var report = this._createReport(selectedItems, trackingInterval);

        return report;
    };


    //
    // -------------------[ Private helper methods ]-----------------------
    //

    ReporterHelper.prototype._selectTimelineItemsForCurrentQuantum = function() {
        var timelineItems = this._context._timeline.getTimelineItems();
        var selectedItems = [];
        var currentItem;
        var i;

        // We expect that the second-to-last item on the timeline to be the ACTIVE event.
        // NOTE: the last item is the continuation pseudo-event and we are not interested in that.
        var lastItem = timelineItems[timelineItems.length - 2];
        if (lastItem.eventType != EventDao.EVENT_TYPE_ACTIVE) {
            throw new Error("Expecting an ACTIVE event as the last item on the timeline.");
        } else {
            // ... put this ACTIVE item in the selected-items list.
            selectedItems.unshift(lastItem);
        }

        // Start scanning the timeline from the third-last item backwards.
        // NOTE: we know that the second-last item injected is the ACTIVE event.
        for (i = timelineItems.length - 3; i >= 0; i--) {
            currentItem = timelineItems[i];

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

    ReporterHelper.prototype._createReport = function(items, trackingInterval) {
        var i;
        var report = new Report(this._context._siteCatalystData,
                                this._context._serviceProviderData,
                                this._context._sessionData);

        for (i = 0; i < items.length; i++) {
            report.addEntry(this._buildReportEntryForItem(items[i], trackingInterval));
        }

        // We need to attribute all the report entries inside this report to the same quantum
        // as represented by the last ACTIVE event.
        var lastReportEntry = report.reportEntries[report.reportEntries.length - 1];
        if (lastReportEntry.eventData.type() != EventDao.EVENT_TYPE_ACTIVE) {
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
            timelineItem.userData,
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
    var Operation = core.Operation;
    var InputDataSanitizer = core.InputDataSanitizer;
    var ReporterHelper = heartbeat.context.ReporterHelper;
    var Timeline = heartbeat.context.Timeline;
    var TimelineItem = heartbeat.context.TimelineItem;
    var History = heartbeat.context.History;
    var SessionDao = heartbeat.model.SessionDao;
    var SiteCatalystDao = heartbeat.model.SiteCatalystDao;
    var AssetDao = heartbeat.model.AssetDao;
    var ServiceProviderDao = heartbeat.model.ServiceProviderDao;
    var UserDao = heartbeat.model.UserDao;
    var StreamDao = heartbeat.model.StreamDao;
    var QoSDao = heartbeat.model.QoSDao;
    var ChapterDao = heartbeat.model.ChapterDao;
    var Counters = heartbeat.context.Counters;
    var ClockEvent = heartbeat.event.ClockEvent;
    var NetworkEvent = heartbeat.event.NetworkEvent;
    var DataEvent = heartbeat.event.DataEvent;
    var ApiEvent = heartbeat.event.ApiEvent;
    var ContextEvent = heartbeat.event.ContextEvent;
    var EventKeyName = heartbeat.event.EventKeyName;
    var EventDao = heartbeat.model.EventDao;
    var AdDao = heartbeat.model.AdDao;
    var Version = va.Version;
    var MD5 = utils.md5;

    var ERROR_SOURCE_PLAYER = "sourceErrorSDK";

    mixin(Context, deferrable);
    mixin(Context, logger);

    function Context(commCenter, playerDelegate) {
        this._userData = null;
        this._assetData = null;
        this._streamData = null;
        this._qosData = null;
        this._siteCatalystData = new SiteCatalystDao();
        this._serviceProviderData = new ServiceProviderDao();
        this._sessionData = null;

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

        this._configData = {
            publisher: null
        };

        this._isTrackingSessionActive = false;
        this._isVideoComplete = false;
        this._activeAssetId = null;
        this._isDestroyed = false;

        // Instantiate the helper class for building tracking reports.
        this._reporterHelper = new ReporterHelper(this);

        this._commCenter = commCenter;

        // Reference to the player-delegate object.
        this._playerDelegate = playerDelegate;

        this._stashedChapterData = null;
        this._stashedAdData = null;

        // Boolean flag that enables/disables support for external error tracking
        // (a.k.a. custom application error tracking).
        this._trackExternalErrors = true;

        var errorOperation = new Operation(this._executeErrorCallback, this);
        this._inputDataSanitizer = new InputDataSanitizer(errorOperation);

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
    //--------------------[ Notification handlers ]--------------------
    //

    Context.prototype._onApiConfig = function(e) {
        var info = e.data;

        this.log(this, "#_onApiConfig(" +
              "account=" + info[EventKeyName.ACCOUNT] +
            ", sc_server=" + info[EventKeyName.SC_TRACKING_SERVER] +
            ", sb_server=" + info[EventKeyName.TRACKING_SERVER] +
            ", check_status_server=" + info[EventKeyName.CHECK_STATUS_SERVER] +
            ", job_id=" + info[EventKeyName.JOB_ID] +
            ", publisher=" + info[EventKeyName.PUBLISHER] +
            ", ovp=" + info[EventKeyName.OVP] +
            ", sdk=" + info[EventKeyName.SDK] +
            ", useSSL=" + info[EventKeyName.USE_SSL] +
            ", quietMode: " + info[EventKeyName.QUIET_MODE] +
            ", channel: " + info[EventKeyName.CHANNEL] +
            ")");

        this._siteCatalystData.reportSuiteId(info[EventKeyName.ACCOUNT]);
        this._siteCatalystData.trackingServer(info[EventKeyName.SC_TRACKING_SERVER]);
        this._siteCatalystData.ssl(info[EventKeyName.USE_SSL] ? 1 : 0);

        this._configData.publisher = info[EventKeyName.PUBLISHER];

        this._serviceProviderData.ovp(info[EventKeyName.OVP]);
        this._serviceProviderData.sdk(info[EventKeyName.SDK]);
        this._serviceProviderData.channel(info[EventKeyName.CHANNEL]);
        this._serviceProviderData.libVersion(Version.getVersion());
        this._serviceProviderData.apiLevel(Version.getApiLevel());

        // The "check-status" timer must be activated.
        this._commCenter.notificationCenter.dispatchEvent(new ClockEvent(ClockEvent["CLOCK_CHECK_STATUS_ENABLE"]));
    };

    Context.prototype._onApiVideoLoad = function(e) {
        var info = e.data;

        var videoInfo = info[EventKeyName.VIDEO_INFO];

        this.log("#_onApiVideoLoad(" +
              "id=" + videoInfo.id +
            ", length=" + videoInfo.length +
            ", type=" + videoInfo.streamType +
            ", player_name=" + videoInfo.playerName +
            ", aid=" + info[EventKeyName.ANALYTICS_VISITOR_ID] +
            ", mid=" + info[EventKeyName.MARKETING_CLOUD_VISITOR_ID] +
            ", vid=" + info[EventKeyName.VISITOR_ID] +
            ")");

        this._resetInternalState();

        this._activeAssetId = videoInfo.id;

        this._serviceProviderData.playerName(videoInfo.playerName);

        this._userData.analyticsVisitorId(info[EventKeyName.ANALYTICS_VISITOR_ID]);
        this._userData.marketingCloudVisitorId(info[EventKeyName.MARKETING_CLOUD_VISITOR_ID]);
        this._userData.visitorId(info[EventKeyName.VISITOR_ID]);

        this._assetData.videoId(this._activeAssetId);
        this._assetData.duration(videoInfo.length);
        this._assetData.type(videoInfo.streamType);

        this._videoAssetType = this._assetData.type();

        this._streamData.name(videoInfo.name || this._activeAssetId);

        // Generate a new session ID value.
        this._sessionData.sessionId(_generateSessionId());

        // Reset the main video counters.
        this._counters.resetCounters(this._activeAssetId, this._videoAssetType);

        // Send the LOAD event immediately (out-of-band).
        // Defer the broadcasting of the CONTEXT_DATA_AVAILABLE event until
        // we obtain the value of the tracking-timer interval.
        var self = this;
        this._deferred = function(response) {
            var trackingInterval = response[EventKeyName.TIMER_INTERVAL];

            self._updateQoSInfo();
            var loadItem = new TimelineItem(self._assetData,
                                            self._userData,
                                            self._streamData,
                                            self._qosData,
                                            EventDao.EVENT_TYPE_LOAD, 0);
            loadItem.prevItemOfSameType = self._history.getPreviousItemOfSameTypeWith(loadItem);

            // Update the history data
            self._history.updateWith(loadItem);

            var report = self._reporterHelper.createReportForItem(loadItem, trackingInterval);

            // Issue a CONTEXT_DATA_AVAILABLE event.
            var eventData = {};
            eventData[EventKeyName.REPORT] = report;
            this._commCenter.notificationCenter.dispatchEvent(new ContextEvent(ContextEvent.CONTEXT_DATA_AVAILABLE, eventData));
        };

        // Issue a data request: the current value of the tracking-timer interval.
        var eventData = {};
        eventData[EventKeyName.WHAT] = DataEvent.keys.TRACKING_TIMER_INTERVAL;
        this._commCenter.notificationCenter.dispatchEvent(new DataEvent(DataEvent.DATA_REQUEST, eventData));

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
        // Defer the broadcasting of the CONTEXT_DATA_AVAILABLE event until
        // we obtain the value of the tracking-timer interval.
        var self = this;
        this._deferred = function(response) {
            var trackingInterval = response[EventKeyName.TIMER_INTERVAL];

            var unloadItem = new TimelineItem(self._assetData,
                                              self._userData,
                                              self._streamData,
                                              self._qosData,
                                              EventDao.EVENT_TYPE_UNLOAD, 0);
            unloadItem.prevItemOfSameType = self._history.getPreviousItemOfSameTypeWith(unloadItem);

            // Update the history data
            self._history.updateWith(unloadItem);

            var report = self._reporterHelper.createReportForItem(unloadItem, trackingInterval);

            // Issue a CONTEXT_DATA_AVAILABLE event.
            var eventData = {};
            eventData[EventKeyName.REPORT] = report;
            this._commCenter.notificationCenter.dispatchEvent(new ContextEvent(ContextEvent.CONTEXT_DATA_AVAILABLE, eventData));
        };

        // Issue a data request: the current value of the tracking-timer interval.
        var eventData = {};
        eventData[EventKeyName.WHAT] = DataEvent.keys.TRACKING_TIMER_INTERVAL;
        this._commCenter.notificationCenter.dispatchEvent(new DataEvent(DataEvent.DATA_REQUEST, eventData));

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
        this._commCenter.notificationCenter.dispatchEvent(new ClockEvent(ClockEvent.CLOCK_TRACKING_ENABLE, eventData));

        // Place the START event on the timeline.
        this._updateQoSInfo();
        var startItem = new TimelineItem(this._assetData,
                                         this._userData,
                                         this._streamData,
                                         this._qosData,
                                         EventDao.EVENT_TYPE_START,
                                         playhead);
        startItem.prevItemOfSameType = this._history.getPreviousItemOfSameTypeWith(startItem);
        this._placeItemOnTimeline(startItem, playhead);
    };

    Context.prototype._onApiVideoComplete = function(e) {
        if (!this._checkCall("_onApiVideoComplete")) return;

        this.log("#_onApiVideoComplete()");

        // Place the COMPLETE event on the timeline (for main asset).
        this._updateQoSInfo();
        var completeItem = new TimelineItem(this._assetData,
                                            this._userData,
                                            this._streamData,
                                            this._qosData,
                                            EventDao.EVENT_TYPE_COMPLETE,
                                            this._assetData.duration());
        completeItem.prevItemOfSameType = this._history.getPreviousItemOfSameTypeWith(completeItem);
        this._placeItemOnTimeline(completeItem, this._assetData.duration());

        // We need to send the last batch.
        // Defer the broadcasting of the CONTEXT_DATA_AVAILABLE event until
        // we obtain the value of the tracking-timer interval.
        var self = this;
        this._deferred = function(response) {
            var trackingInterval = response[EventKeyName.TIMER_INTERVAL];

            // Inject the ACTIVE event on the timeline.
            // Take a snapshot of the AssetDao instance
            var noAdInfoAssetData = new AssetDao(self._assetData);
            // ...but exclude the ad-related info.
            noAdInfoAssetData.adData(null);
            // ... and make sure that the asset type coincides with the type of the main asset.
            noAdInfoAssetData.type(self._videoAssetType);

            var activeItem = new TimelineItem(noAdInfoAssetData,
                                              self._userData,
                                              self._streamData,
                                              self._qosData,
                                              EventDao.EVENT_TYPE_ACTIVE,
                                              noAdInfoAssetData.duration());
            activeItem.prevItemOfSameType = self._history.getPreviousItemOfSameTypeWith(activeItem);
            self._placeItemOnTimeline(activeItem, noAdInfoAssetData.duration());

            // Create the last report.
            var report = self._reporterHelper.createReportForQuantum(trackingInterval);

            // Issue a CONTEXT_DATA_AVAILABLE event.
            var eventData  = {};
            eventData[EventKeyName.REPORT] = report;
            this._commCenter.notificationCenter.dispatchEvent(new ContextEvent(ContextEvent.CONTEXT_DATA_AVAILABLE, eventData));
        };

        // Issue a data request: the current value of the tracking-timer interval.
        var eventData = {};
        eventData[EventKeyName.WHAT] = DataEvent.keys.TRACKING_TIMER_INTERVAL;
        this._commCenter.notificationCenter.dispatchEvent(new DataEvent(DataEvent.DATA_REQUEST, eventData));

        // The "tracking" timer must be deactivated.
        eventData = {};
        eventData[EventKeyName.RESET] = true;
        this._commCenter.notificationCenter.dispatchEvent(new ClockEvent(ClockEvent.CLOCK_TRACKING_DISABLE, eventData));

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
        this._commCenter.notificationCenter.dispatchEvent(new ClockEvent(ClockEvent.CLOCK_TRACKING_ENABLE));

        // Place the PLAY event on the timeline.
        this._updateQoSInfo();
        var playItem = new TimelineItem(this._assetData,
                                        this._userData,
                                        this._streamData,
                                        this._qosData,
                                        EventDao.EVENT_TYPE_PLAY,
                                        playhead);
        playItem.prevItemOfSameType = this._history.getPreviousItemOfSameTypeWith(playItem);
        this._placeItemOnTimeline(playItem, playhead);
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
                                         this._userData,
                                         this._streamData,
                                         this._qosData,
                                         EventDao.EVENT_TYPE_PAUSE,
                                         playhead);
        pauseItem.prevItemOfSameType = this._history.getPreviousItemOfSameTypeWith(pauseItem);
        this._placeItemOnTimeline(pauseItem, playhead);

        // The "tracking" timer must be deactivated.
        this._commCenter.notificationCenter.dispatchEvent(new ClockEvent(ClockEvent.CLOCK_TRACKING_DISABLE));
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
                                               this._userData,
                                               this._streamData,
                                               this._qosData,
                                               EventDao.EVENT_TYPE_BUFFER,
                                               playhead);
        bufferStartItem.prevItemOfSameType = this._history.getPreviousItemOfSameTypeWith(bufferStartItem);
        this._placeItemOnTimeline(bufferStartItem, playhead);
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
        var adBreakInfo = this._playerDelegate.getAdBreakInfo();
        if (!this._inputDataSanitizer.sanitizeAdBreakInfo(adBreakInfo, true)) {
            return;
        }

        var adInfo = this._playerDelegate.getAdInfo();
        if (!this._inputDataSanitizer.sanitizeAdInfo(adInfo, true)) {
            return;
        }

        var chapterInfo = this._playerDelegate.getChapterInfo();
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
                adData.cpm(adInfo.cpm);
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

    Context.prototype._onApiAdStart = function(e) {
        if (!this._checkCall("_onApiAdStart")) return;

        var adBreakInfo = e.data[EventKeyName.AD_BREAK_INFO];
        var adInfo = e.data[EventKeyName.AD_INFO];

        this.log("#_onApiAdStart(" +
              "id=" + adInfo.id +
            ", length=" + adInfo.length +
            ", player_name=" + adBreakInfo.playerName +
            ", parent_name=" + this._assetData.videoId() +
            ", pod_pos=" + adInfo.position +
            ", pod_offset=" + adBreakInfo.startTime +
            ", cpm=" + adInfo.cpm +
            ")");

        this._activeAssetId = adInfo.id;

        // Set-up the ad-data associated to the current ad.
        var adData = new AdDao();
        adData.adId(this._activeAssetId);
        adData.length(adInfo.length);
        adData.resolver(adBreakInfo.playerName);
        adData.cpm(adInfo.cpm);
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
                                         this._userData,
                                         this._streamData,
                                         this._qosData,
                                         EventDao.EVENT_TYPE_START,
                                         adInfo.playhead);
        startItem.prevItemOfSameType = this._history.getPreviousItemOfSameTypeWith(startItem);
        this._placeItemOnTimeline(startItem, adInfo.playhead);
    };

    Context.prototype._onApiAdComplete = function(e) {
        if (!this._checkCall("_onApiAdComplete")) return;

        this.log("#_onApiAdComplete()");

        if (this._assetData.type() != AssetDao.TYPE_AD) {
            this.warn("#_onApiAdComplete() > Ignoring the ad complete event, because we are no longer in an ad.");
            return;
        }

        this._updateQoSInfo();

        // Place the PLAY event on the timeline (for ad asset).
        var playItem = new TimelineItem(this._assetData,
                                        this._userData,
                                        this._streamData,
                                        this._qosData,
                                        EventDao.EVENT_TYPE_PLAY,
                                        this._assetData.adData().length());
        playItem.prevItemOfSameType = this._history.getPreviousItemOfSameTypeWith(playItem);
        this._placeItemOnTimeline(playItem, this._assetData.adData().length());

        // Place the COMPLETE event on the timeline (for ad asset).
        var completeItem = new TimelineItem(this._assetData,
                                            this._userData,
                                            this._streamData,
                                            this._qosData,
                                            EventDao.EVENT_TYPE_COMPLETE,
                                            this._assetData.adData().length());
        completeItem.prevItemOfSameType = this._history.getPreviousItemOfSameTypeWith(completeItem);
        this._placeItemOnTimeline(completeItem, this._assetData.adData().length());

        // Nullify the ad data.
        this._assetData.adData(null);

        // Revert back to the type of the main content.
        this._assetData.type(this._videoAssetType);
        this._activeAssetId = this._assetData.videoId();
    };

    Context.prototype._onApiChapterStart = function(e) {
        if (!this._checkCall("_onApiChapterStart")) return;

        var chapterInfo = e.data[EventKeyName.CHAPTER_INFO];

        this.log("#_onApiChapterStart(" +
              "name=" + chapterInfo.name +
            ", length=" + chapterInfo.length +
            ", position=" + chapterInfo.position +
            ", chapter_offset=" + chapterInfo.startTime +
            ")");

        var mainVideoPlayhead = this._getMainVideoPlayhead();
        if (mainVideoPlayhead == null || isNaN(mainVideoPlayhead)) {
            return;
        }
        
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
                                        this._userData,
                                        this._streamData,
                                        this._qosData,
                                        this._timeline.getLast().eventType,
                                        playhead);
            item.prevItemOfSameType = this._history.getPreviousItemOfSameTypeWith(item);
            this._placeItemOnTimeline(item, playhead);
        }

        // Send the CHAPTER_START event immediately (out-of-band).
        // Defer the broadcasting of the CONTEXT_DATA_AVAILABLE event until
        // we obtain the value of the tracking-timer interval.
        var self = this;
        this._deferred = function(response) {
            var trackingInterval = response[EventKeyName.TIMER_INTERVAL];

            // The CHAPTER_START event must always be in the context of the main video asset.
            // Take a snapshot of the AssetDao instance.
            var noAdInfoAssetData = new AssetDao(self._assetData);
            // ...but exclude the ad-related info.
            noAdInfoAssetData.adData(null);
            // ... and make sure that the asset type coincides with the type of the main asset.
            noAdInfoAssetData.type(self._videoAssetType);

            var startChapterItem = new TimelineItem(noAdInfoAssetData,
                                                    self._userData,
                                                    self._streamData,
                                                    self._qosData,
                                                    EventDao.EVENT_TYPE_CHAPTER_START,
                                                    mainVideoPlayhead);
            startChapterItem.prevItemOfSameType = self._history.getPreviousItemOfSameTypeWith(startChapterItem);

            // Update the history data.
            self._history.updateWith(startChapterItem);

            var report = self._reporterHelper.createReportForItem(startChapterItem, trackingInterval);

            // Issue a CONTEXT_DATA_AVAILABLE event.
            var eventData = {};
            eventData[EventKeyName.REPORT] = report;
            self._commCenter.notificationCenter.dispatchEvent(new ContextEvent(ContextEvent.CONTEXT_DATA_AVAILABLE, eventData));
        };

        // Issue a data request: the current value of the tracking-timer interval.
        var eventData = {};
        eventData[EventKeyName.WHAT] = DataEvent.keys.TRACKING_TIMER_INTERVAL;
        this._commCenter.notificationCenter.dispatchEvent(new DataEvent(DataEvent.DATA_REQUEST, eventData));
    };

    Context.prototype._onApiChapterComplete = function(e) {
        if (!this._checkCall("_onApiChapterComplete")) return;

        this.log("#_onApiChapterComplete()");

        if (!this._assetData.chapterData()) {
            this.warn("#_onApiChapterComplete() > Ignoring the chapter complete event, because we are no longer in a chapter.");
            return;
        }

        var mainVideoPlayhead = this._getMainVideoPlayhead();
        if (mainVideoPlayhead == null || isNaN(mainVideoPlayhead)) {
            return;
        }

        var playhead = this._getPlayhead();
        if (playhead == null || isNaN(playhead)) {
            return;
        }

        // Send the CHAPTER_COMPLETE event immediately (out-of-band).
        // Defer the broadcasting of the CONTEXT_DATA_AVAILABLE event until
        // we obtain the value of the tracking-timer interval.
        var self = this;
        this._deferred = function(response) {
            var trackingInterval = response[EventKeyName.TIMER_INTERVAL];

            // The CHAPTER_COMPLETE event must always be in the context of the main video asset.
            // Take a snapshot of the AssetDao instance.
            var noAdInfoAssetData = new AssetDao(self._assetData);
            // ...but exclude the ad-related info.
            noAdInfoAssetData.adData(null);
            // ... and make sure that the asset type coincides with the type of the main asset.
            noAdInfoAssetData.type(self._videoAssetType);

            self._updateQoSInfo();
            var completeChapterItem = new TimelineItem(noAdInfoAssetData,
                                                       self._userData,
                                                       self._streamData,
                                                       self._qosData,
                                                       EventDao.EVENT_TYPE_CHAPTER_COMPLETE,
                                                       mainVideoPlayhead);
            completeChapterItem.prevItemOfSameType = self._history.getPreviousItemOfSameTypeWith(completeChapterItem);

            // Update the history data.
            self._history.updateWith(completeChapterItem);

            var report = self._reporterHelper.createReportForItem(completeChapterItem, trackingInterval);

            // Issue a CONTEXT_DATA_AVAILABLE event.
            var eventData = {};
            eventData[EventKeyName.REPORT] = report;
            self._commCenter.notificationCenter.dispatchEvent(new ContextEvent(ContextEvent.CONTEXT_DATA_AVAILABLE, eventData));

            // We are no longer inside a chapter.
            self._assetData.chapterData(null);

            // If the last item is a PLAY event, we must segment it in 2 parts:
            // one inside and one outside the chapter.
            if (self._timeline.getLast().eventType == EventDao.EVENT_TYPE_PLAY) {
                var item = new TimelineItem(self._assetData,
                                            self._userData,
                                            self._streamData,
                                            self._qosData,
                                            self._timeline.getLast().eventType,
                                            playhead);

                item.prevItemOfSameType = self._history.getPreviousItemOfSameTypeWith(item);
                self._placeItemOnTimeline(item, playhead);
            }
        };

        // Issue a data request: the current value of the tracking-timer interval.
        var eventData = {};
        eventData[EventKeyName.WHAT] = DataEvent.keys.TRACKING_TIMER_INTERVAL;
        this._commCenter.notificationCenter.dispatchEvent(new DataEvent(DataEvent.DATA_REQUEST, eventData));
    };

    Context.prototype._onApiBitrateChange = function(e) {
        if (!this._checkCall("_onApiBitrateChange")) return;

        this.log("#_onApiBitrateChange()");

        var playhead = this._getPlayhead();
        if (playhead == null || isNaN(playhead)) {
            return;
        }

        // Send the BITRATE_CHANGE event immediately (out-of-band).
        // Defer the broadcasting of the CONTEXT_DATA_AVAILABLE event until
        // we obtain the value of the tracking-timer interval.
        var self = this;
        this._deferred = function(response) {
            var trackingInterval = response[EventKeyName.TIMER_INTERVAL];

            self._updateQoSInfo();
            var bitrateChangeItem = new TimelineItem(self._assetData,
                                                     self._userData,
                                                     self._streamData,
                                                     self._qosData,
                                                     EventDao.EVENT_TYPE_BITRATE_CHANGE,
                                                     playhead);
            bitrateChangeItem.prevItemOfSameType = self._history.getPreviousItemOfSameTypeWith(bitrateChangeItem);

            // Update the history data.
            self._history.updateWith(bitrateChangeItem);

            var report = self._reporterHelper.createReportForItem(bitrateChangeItem, trackingInterval);

            // Issue a CONTEXT_DATA_AVAILABLE event.
            var eventData = {};
            eventData[EventKeyName.REPORT] = report;
            self._commCenter.notificationCenter.dispatchEvent(new ContextEvent(ContextEvent.CONTEXT_DATA_AVAILABLE, eventData));
        };

        // Issue a data request: the current value of the tracking-timer interval.
        var eventData = {};
        eventData[EventKeyName.WHAT] = DataEvent.keys.TRACKING_TIMER_INTERVAL;
        this._commCenter.notificationCenter.dispatchEvent(new DataEvent(DataEvent.DATA_REQUEST, eventData));
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

        // Send the ERROR event immediately (out-of-band).
        // Defer the broadcasting of the CONTEXT_DATA_AVAILABLE event until
        // we obtain the value of the tracking-timer interval.
        var self = this;
        this._deferred = function(response) {
            var trackingInterval = response[EventKeyName.TIMER_INTERVAL];

            self._updateQoSInfo();
            var errorItem = new TimelineItem(self._assetData,
                                             self._userData,
                                             self._streamData,
                                             self._qosData,
                                             EventDao.EVENT_TYPE_ERROR,
                                             playhead);
            errorItem.prevItemOfSameType = self._history.getPreviousItemOfSameTypeWith(errorItem);

            // Update the history data.
            self._history.updateWith(errorItem);

            var report = self._reporterHelper.createReportForItem(errorItem, trackingInterval);

            // We need to set the error id and error source for the error report.
            var reportEntry = report.reportEntries[0];
            reportEntry.eventData.id(info[EventKeyName.ERROR_ID]);
            reportEntry.eventData.source(info[EventKeyName.SOURCE]);

            // Issue a CONTEXT_DATA_AVAILABLE event.
            var eventData = {};
            eventData[EventKeyName.REPORT] = report;
            self._commCenter.notificationCenter.dispatchEvent(new ContextEvent(ContextEvent.CONTEXT_DATA_AVAILABLE, eventData));
        };

        // Issue a data request: the current value of the tracking-timer interval.
        var eventData = {};
        eventData[EventKeyName.WHAT] = DataEvent.keys.TRACKING_TIMER_INTERVAL;
        this._commCenter.notificationCenter.dispatchEvent(new DataEvent(DataEvent.DATA_REQUEST, eventData));
    };

    Context.prototype._onClockTrackingTick = function(e) {
        if (!this._checkCall("_onClockTrackingTick")) return;

        var trackingInterval = e.data[EventKeyName.TIMER_INTERVAL];

        this.log("#_onClockTrackingTick(interval=" + trackingInterval + ")");

        var mainVideoPlayhead = this._getMainVideoPlayhead();
        if (mainVideoPlayhead == null || isNaN(mainVideoPlayhead)) {
            return;
        }

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
                                          this._userData,
                                          this._streamData,
                                          this._qosData,
                                          EventDao.EVENT_TYPE_ACTIVE,
                                          mainVideoPlayhead);
        activeItem.prevItemOfSameType = this._history.getPreviousItemOfSameTypeWith(activeItem);
        this._placeItemOnTimeline(activeItem, playhead);

        // Create the report for the current quantum.
        var report = this._reporterHelper.createReportForQuantum(trackingInterval);

        // Issue a CONTEXT_DATA_AVAILABLE event.
        var eventData = {};
        eventData[EventKeyName.REPORT] = report;
        this._commCenter.notificationCenter.dispatchEvent(new ContextEvent(ContextEvent.CONTEXT_DATA_AVAILABLE, eventData));
    };

    Context.prototype._onNetworkCheckStatusComplete = function(e) {
        this._trackExternalErrors = e.data[EventKeyName.TRACK_EXTERNAL_ERRORS];

        this.log("#_onNetworkCheckStatusComplete(track_ext_err=" + this._trackExternalErrors + ")");
    };

    Context.prototype._onDataRequest = function(e) {
        var what = e.data[EventKeyName.WHAT];

        this.log("#_onDataRequest(what=" + what + ")");

        switch (what) {
            case DataEvent.keys.MAIN_VIDEO_PUBLISHER:
                var eventData = {};
                eventData[EventKeyName.PUBLISHER] = this._configData.publisher;

                this._commCenter.notificationCenter.dispatchEvent(new DataEvent(DataEvent.DATA_RESPONSE, eventData));
                break;
        }
    };

    Context.prototype._onDataResponse = function(e) {
        this.log("#_onDataResponse()");

        this.executeDeferred(e.data);
    };

    //
    // -------------------[ Private helper methods ]-----------------------
    //

    Context.prototype._installEventListeners = function() {
        this._commCenter.notificationCenter.addEventListener(ApiEvent.API_CONFIG, this._onApiConfig, this);
        this._commCenter.notificationCenter.addEventListener(ApiEvent.API_VIDEO_LOAD, this._onApiVideoLoad, this);
        this._commCenter.notificationCenter.addEventListener(ApiEvent.API_VIDEO_UNLOAD, this._onApiVideoUnload, this);
        this._commCenter.notificationCenter.addEventListener(ApiEvent.API_VIDEO_START, this._onApiVideoStart, this);
        this._commCenter.notificationCenter.addEventListener(ApiEvent.API_VIDEO_COMPLETE, this._onApiVideoComplete, this);
        this._commCenter.notificationCenter.addEventListener(ApiEvent.API_AD_START, this._onApiAdStart, this);
        this._commCenter.notificationCenter.addEventListener(ApiEvent.API_AD_COMPLETE, this._onApiAdComplete, this);
        this._commCenter.notificationCenter.addEventListener(ApiEvent.API_PLAY, this._onApiPlay, this);
        this._commCenter.notificationCenter.addEventListener(ApiEvent.API_PAUSE, this._onApiPause, this);
        this._commCenter.notificationCenter.addEventListener(ApiEvent.API_BUFFER_START, this._onApiBufferStart, this);
        this._commCenter.notificationCenter.addEventListener(ApiEvent.API_SEEK_START, this._onApiSeekStart, this);
        this._commCenter.notificationCenter.addEventListener(ApiEvent.API_SEEK_COMPLETE, this._onApiSeekComplete, this);
        this._commCenter.notificationCenter.addEventListener(ApiEvent.API_CHAPTER_START, this._onApiChapterStart, this);
        this._commCenter.notificationCenter.addEventListener(ApiEvent.API_CHAPTER_COMPLETE, this._onApiChapterComplete, this);
        this._commCenter.notificationCenter.addEventListener(ApiEvent.API_BITRATE_CHANGE, this._onApiBitrateChange, this);
        this._commCenter.notificationCenter.addEventListener(ApiEvent.API_TRACK_ERROR, this._onApiTrackError, this);

        this._commCenter.notificationCenter.addEventListener(ClockEvent.CLOCK_TRACKING_TICK, this._onClockTrackingTick, this);

        this._commCenter.notificationCenter.addEventListener(NetworkEvent.NETWORK_CHECK_STATUS_COMPLETE, this._onNetworkCheckStatusComplete, this);

        this._commCenter.notificationCenter.addEventListener(DataEvent.DATA_REQUEST, this._onDataRequest, this);
        this._commCenter.notificationCenter.addEventListener(DataEvent.DATA_RESPONSE, this._onDataResponse, this);
    };

    Context.prototype._uninstallEventListeners = function() {
        this._commCenter.notificationCenter.removeAllListeners(this);
    };

    Context.prototype._resetInternalState = function() {
        this.log("#_resetInternalState()");

        this._isTrackingSessionActive = false;
        this._isVideoComplete = false;

        this._videoAssetType = null;

        this._counters = new Counters();
        this._history = new History();
        this._timeline = new Timeline(this);
        this._userData = new UserDao();
        this._streamData = new StreamDao();
        this._qosData = new QoSDao();
        this._sessionData = new SessionDao();
        this._assetData = new AssetDao();

        this._assetData.publisher(this._configData.publisher);

        this._stashedAdData = null;
        this._stashedChapterData = null;
    };

    function _generateSessionId() {
        return "" + new Date().getTime() + Math.floor(Math.random() * 1000000000);
    }

    Context.prototype._placeItemOnTimeline = function(timelineItem, playhead) {
        this.log("#_placeItemOnTimeline(type=" + timelineItem.eventType + ")");

        // Place the item on the timeline.
        this._timeline.addItem(timelineItem, playhead);

        // Update the history data.
        this._history.updateWith(timelineItem);
    };

    Context.prototype._getPlayhead = function() {
        var playhead = null;

        if (this._assetData.adData()) { // we are inside ad content.
            var adInfo = this._playerDelegate.getAdInfo();
            if (adInfo && this._inputDataSanitizer.sanitizeAdInfo(adInfo, false)) {
                playhead = adInfo.playhead;
            }
        } else { // we are inside main content.
            var videoInfo = this._playerDelegate.getVideoInfo();
            if (this._inputDataSanitizer.sanitizeVideoInfo(videoInfo)) {
                playhead = videoInfo.playhead;
            }
        }

        return playhead;
    };

    Context.prototype._getMainVideoPlayhead = function() {
        var playhead = null;

        var videoInfo = this._playerDelegate.getVideoInfo();
        if (this._inputDataSanitizer.sanitizeVideoInfo(videoInfo)) {
            playhead = videoInfo.playhead;
        }

        return playhead;
    };

    Context.prototype._updateQoSInfo = function() {
        // Query the player delegate for the QoS info.
        var qosInfo = this._playerDelegate.getQoSInfo();

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

    Context.prototype._executeErrorCallback = function(message, details) {
        var eventData = {};
        eventData[EventKeyName.MESSAGE] = message;
        eventData[EventKeyName.DETAILS] = details;
        this._commCenter.notificationCenter.dispatchEvent(new ErrorEvent(ErrorEvent.ERROR, eventData));
    };

    // Export symbols.
    heartbeat.context.Context = Context;
})(core, heartbeat, va, utils);

(function(heartbeat) {
    function AppMeasurementInfo() {
        'use strict';

        this.account = null;
        this.trackingServer = null;
        this.ssl = false;
    }

    // Export symbols.
    heartbeat.AppMeasurementInfo = AppMeasurementInfo;
})(heartbeat);
(function(core, heartbeat) {
    'use strict';

    var PRIMETIME_OVP = 'primetime';

    var mixin = core.mixin;
    var logger = core.logger;
    var Operation = core.Operation;
    var CommCenter = core.CommCenter;
    var EventKeyName = heartbeat.event.EventKeyName;
    var ApiEvent = heartbeat.event.ApiEvent;
    var Clock = heartbeat.clock.Clock;
    var Network = heartbeat.network.Network;
    var Context = heartbeat.context.Context;
    var QuerystringSerializer = heartbeat.model.QuerystringSerializer;

    mixin(Heartbeat, logger);

    function Heartbeat(playerDelegate, errorOperation) {
        this._visitorApiInfo = null;
        this._clock = null;
        this._context = null;
        this._network = null;
        this._isDestroyed = false;

        this._commCenter = new CommCenter();
        this._playerDelegate = playerDelegate;
        this._errorOperation = errorOperation;

        // We are not configured yet.
        this._isConfigured = false;

        // Bootstrap the Heartbeat module.
        this._bootstrap();

        // Activate logging for this class.
        this.enableLogging('[heartbeat::Heartbeat] > ');
    }

    //
    // -------------------[ Public methods ]-----------------------
    //
    Heartbeat.prototype.configure = function(appMeasurementInfo, visitorApiInfo, configData) {
        if (!appMeasurementInfo) {
            throw new Error("AppMeasurement info object cannot be NULL");
        }

        if (!visitorApiInfo) {
            throw new Error("VisitorAPI info object cannot be NULL");
        }
        this._visitorApiInfo = visitorApiInfo;

        if (!configData) {
            throw new Error("Configuration object cannot be NULL");
        }

        // If we are dealing with a primetime OVP, override the custom OVP setting.
        var ovp = (configData.__primetime) ? PRIMETIME_OVP : configData.ovp;

        // If we have a PSDK version number available, override the custom SDK setting.
        var sdk = configData.__psdkVersion || configData.sdk;

        var checkStatusServer = configData.trackingServer + "/settings/";

        this.log("#setup() > Applying configuration: {" +
            "account: "            + appMeasurementInfo.account +
            ", scTrackingServer: " + appMeasurementInfo.trackingServer +
            ", sbTrackingServer: " + configData.trackingServer +
            ", jobId: "            + configData.jobId +
            ", publisher: "        + configData.publisher +
            ", ovp: "              + configData.ovp +
            ", sdk: "              + configData.sdk +
            ", useSSL: "           + appMeasurementInfo.ssl +
            ", quietMode:  "       + configData.quietMode +
            ", channel:"           + configData.channel +
            ", debugLogging: "     + configData.debugLogging +
            "}");

        // Let everybody know about the update of the configuration settings.
        var eventData = {};
        eventData[EventKeyName.ACCOUNT]             = appMeasurementInfo.account;
        eventData[EventKeyName.SC_TRACKING_SERVER]  = appMeasurementInfo.trackingServer;
        eventData[EventKeyName.TRACKING_SERVER]     = configData.trackingServer;
        eventData[EventKeyName.CHECK_STATUS_SERVER] = checkStatusServer;
        eventData[EventKeyName.JOB_ID]              = configData.jobId;
        eventData[EventKeyName.PUBLISHER]           = configData.publisher;
        eventData[EventKeyName.OVP]                 = ovp;
        eventData[EventKeyName.SDK]                 = sdk;
        eventData[EventKeyName.USE_SSL]             = appMeasurementInfo.ssl;
        eventData[EventKeyName.CHANNEL]             = configData.channel;
        eventData[EventKeyName.QUIET_MODE]          = configData.quietMode;

        this._commCenter.notificationCenter.dispatchEvent(new ApiEvent(ApiEvent.API_CONFIG, eventData));

        // We are now configured.
        this._isConfigured = true;
    };

    Heartbeat.prototype.destroy = function() {
        if (this._isDestroyed) return;

        this._isDestroyed = true;
        this.log("#destroy()");

        // Cancel all async operations.
        this._commCenter.workQueue.cancelAllOperations();

        // Detach from the notification center.
        this._commCenter.notificationCenter.removeAllListeners(this);

        // Tear-down all sub-modules.
        this._network.destroy();
        this._context.destroy();
        this._clock.destroy();
    };

    Heartbeat.prototype.videoLoad = function(videoInfo) {
        this.log("#videoLoad(" +
            "playerName=" + videoInfo.playerName +
            ", id=" + videoInfo.id +
            ", name=" + videoInfo.name +
            ", length=" + videoInfo.length +
            ", playhead=" + videoInfo.playhead +
            ", streamType=" + videoInfo.streamType +
            ")");

        // Fast exit.
        if (!this._canTrack()) return;

        var operation = new Operation(function() {
            // Issue an API_VIDEO_LOAD event.
            var eventData = {};
            eventData[EventKeyName.ANALYTICS_VISITOR_ID] = this._visitorApiInfo.analyticsVisitorID;
            eventData[EventKeyName.MARKETING_CLOUD_VISITOR_ID] = this._visitorApiInfo.marketingCloudVisitorID;
            eventData[EventKeyName.VISITOR_ID] = this._visitorApiInfo.visitorID;
            eventData[EventKeyName.VIDEO_INFO] = videoInfo;

            this._commCenter.notificationCenter.dispatchEvent(new ApiEvent(ApiEvent.API_VIDEO_LOAD, eventData));
        }, this);

        this._commCenter.workQueue.addOperation(operation);
    };

    Heartbeat.prototype.videoUnload = function() {
        this.log("#videounload()");

        // Fast exit.
        if (!this._canTrack()) return;

        var operation = new Operation(function() {
            // Issue an API_VIDEO_UNLOAD event.
            this._commCenter.notificationCenter.dispatchEvent(new ApiEvent(ApiEvent.API_VIDEO_UNLOAD));
        }, this);

        this._commCenter.workQueue.addOperation(operation);
    };

    Heartbeat.prototype.videoStart = function() {
        this.log("#videoStart()");

        // Fast exit.
        if (!this._canTrack()) return;

        var operation = new Operation(function() {
            // Issue an API_VIDEO_START event.
            this._commCenter.notificationCenter.dispatchEvent(new ApiEvent(ApiEvent.API_VIDEO_START));
        }, this);

        this._commCenter.workQueue.addOperation(operation);
    };

    Heartbeat.prototype.videoComplete = function () {
        this.log("#videoComplete()");

        // Fast exit.
        if (!this._canTrack()) return;

        var operation = new Operation(function() {
            // Issue an API_VIDEO_COMPLETE event.
            this._commCenter.notificationCenter.dispatchEvent(new ApiEvent(ApiEvent.API_VIDEO_COMPLETE));
        }, this);

        this._commCenter.workQueue.addOperation(operation);
    };

    Heartbeat.prototype.play = function() {
        this.log("#play()");

        // Fast exit.
        if (!this._canTrack()) return;

        var operation = new Operation(function() {
            // Issue an API_PLAY event.
            this._commCenter.notificationCenter.dispatchEvent(new ApiEvent(ApiEvent.API_PLAY));
        }, this);

        this._commCenter.workQueue.addOperation(operation);
    };

    Heartbeat.prototype.pause = function() {
        this.log("#pause()");

        // Fast exit.
        if (!this._canTrack()) return;

        var operation = new Operation(function() {
            // Issue an API_PAUSE event.
            this._commCenter.notificationCenter.dispatchEvent(new ApiEvent(ApiEvent.API_PAUSE));
        }, this);

        this._commCenter.workQueue.addOperation(operation);
    };

    Heartbeat.prototype.bufferStart = function() {
        this.log("#bufferStart()");

        // Fast exit.
        if (!this._canTrack()) return;

        var operation = new Operation(function() {
            // Issue an API_BUFFER_START event.
            this._commCenter.notificationCenter.dispatchEvent(new ApiEvent(ApiEvent.API_BUFFER_START));
        }, this);

        this._commCenter.workQueue.addOperation(operation);
    };

    Heartbeat.prototype.seekStart = function() {
        this.log("#seekStart()");

        // Fast exit.
        if (!this._canTrack()) return;

        var operation = new Operation(function() {
            // Issue an API_SEEK_START event.
            this._commCenter.notificationCenter.dispatchEvent(new ApiEvent(ApiEvent.API_SEEK_START));
        }, this);

        this._commCenter.workQueue.addOperation(operation);
    };

    Heartbeat.prototype.seekComplete = function() {
        this.log("#seekComplete()");

        // Fast exit.
        if (!this._canTrack()) return;

        var operation = new Operation(function() {
            // Issue an API_SEEK_COMPLETE event.
            this._commCenter.notificationCenter.dispatchEvent(new ApiEvent(ApiEvent.API_SEEK_COMPLETE));
        }, this);

        this._commCenter.workQueue.addOperation(operation);
    };

    Heartbeat.prototype.adStart = function(adInfo, adBreakInfo) {
        this.log("#adStart(" +
            "id=" + adInfo.id +
            ", name=" + adInfo.name +
            ", length=" + adInfo.length +
            ", playhead=" + adInfo.playhead +
            ", position=" + adInfo.position +
            ", cpm=" + adInfo.cpm +
            ", podPlayerName=" + adBreakInfo.playerName +
            ", podName=" + adBreakInfo.name +
            ", podIndex=" + adBreakInfo.position +
            ", podOffset=" + adBreakInfo.startTime +
            ")");

        // Fast exit.
        if (!this._canTrack()) return;

        var operation = new Operation(function() {
            // Issue an API_AD_START event.
            var eventData = {};
            eventData[EventKeyName.AD_INFO] = adInfo;
            eventData[EventKeyName.AD_BREAK_INFO] = adBreakInfo;

            this._commCenter.notificationCenter.dispatchEvent(new ApiEvent(ApiEvent.API_AD_START, eventData));
        }, this);

        this._commCenter.workQueue.addOperation(operation);
    };

    Heartbeat.prototype.adComplete = function() {
        this.log("#adComplete()");

        // Fast exit.
        if (!this._canTrack()) return;

        var operation = new Operation(function() {
            // Issue an API_AD_COMPLETE event.
            this._commCenter.notificationCenter.dispatchEvent(new ApiEvent(ApiEvent.API_AD_COMPLETE));
        }, this);

        this._commCenter.workQueue.addOperation(operation);
    };

    Heartbeat.prototype.chapterStart = function(chapterInfo) {
        this.log("#chapterStart()");

        // Fast exit.
        if (!this._canTrack()) return;

        var operation = new Operation(function() {
            // Issue an API_CHAPTER_START event.
            var eventData = {};
            eventData[EventKeyName.CHAPTER_INFO] = chapterInfo;
            this._commCenter.notificationCenter.dispatchEvent(new ApiEvent(ApiEvent.API_CHAPTER_START, eventData));
        }, this);

        this._commCenter.workQueue.addOperation(operation);
    };

    Heartbeat.prototype.chapterComplete = function() {
        this.log("#chapterComplete()");

        // Fast exit.
        if (!this._canTrack()) return;

        var operation = new Operation(function() {
            this._commCenter.notificationCenter.dispatchEvent(new ApiEvent(ApiEvent.API_CHAPTER_COMPLETE));
        }, this);

        this._commCenter.workQueue.addOperation(operation);
    };

    Heartbeat.prototype.bitrateChange = function(bitrate) {
        this.log("#bitrateChange()");

        // Fast exit.
        if (!this._canTrack()) return;

        var operation = new Operation(function() {
            // Issue an API_BITRATE_CHANGE event.
            this._commCenter.notificationCenter.dispatchEvent(new ApiEvent(ApiEvent.API_BITRATE_CHANGE));
        }, this);

        this._commCenter.workQueue.addOperation(operation);
    };

    Heartbeat.prototype.trackError = function(source, errorId) {
        this.log("#trackError(" +
              "source=" + source +
            ", errorId=" + errorId +
            ")");

        // Fast exit.
        if (!this._canTrack()) return;

        var operation = new Operation(function() {
            // Issue an API_TRACK_ERROR event.
            var eventData = {};
            eventData[EventKeyName.SOURCE] = source;
            eventData[EventKeyName.ERROR_ID] = errorId;

            this._commCenter.notificationCenter.dispatchEvent(new ApiEvent(ApiEvent.API_TRACK_ERROR, eventData));
        }, this);

        this._commCenter.workQueue.addOperation(operation);
    };

    //
    //-----------------[ Notification handlers ]-----------------------
    //
    Heartbeat.prototype._onHeartbeatError = function(e) {
        this._errorOperation.params = [e.data[EventKeyName.MESSAGE], e.data[EventKeyName.DETAILS]];
        this._errorOperation.run();
    };

    //
    //-----------------[ Private helper methods ]-----------------------
    //
    Heartbeat.prototype._bootstrap = function() {
        // Instantiate all sub-modules.
        this._initSubmodules();

        // We register as observers to various heartbeat events.
        this._commCenter.notificationCenter.addEventListener(ErrorEvent.ERROR, this._onHeartbeatError, this);
    };

    Heartbeat.prototype._initSubmodules = function() {
        this._context = new Context(this._commCenter, this._playerDelegate);
        this._clock = new Clock(this._commCenter);
        this._network = new Network(this._commCenter, new QuerystringSerializer(), this._playerDelegate);
    };

    Heartbeat.prototype._canTrack = function() {
        var analyticsVisitorID = this._visitorApiInfo.analyticsVisitorID;
        var marketingCloudVisitorID = this._visitorApiInfo.marketingCloudVisitorID;

        var result = (this._isConfigured &&
                     (
                         analyticsVisitorID ||
                         marketingCloudVisitorID
                     ));

        if (!result) {
            this.warn("_canTrack() > Unable to track!" +
                " Is configured: " + this._isConfigured +
                ", analyticsVisitorID: " + analyticsVisitorID +
                ", marketingCloudVisitorID: " + marketingCloudVisitorID);
        }

        return result;
    };

    // Export symbols.
    heartbeat.Heartbeat = Heartbeat;
})(core, heartbeat);

(function(heartbeat) {
    'use strict';

    function VisitorApiInfo() {
        this.analyticsVisitorID = null;
        this.marketingCloudVisitorID = null;
        this.visitorID = null;
    }

    // Export symbols.
    heartbeat.VisitorApiInfo = VisitorApiInfo;
})(heartbeat);
(function(core, va, heartbeat, utils) {
    'use strict';

    var extend = core.extend;
    var logger = core.logger;
    var mixin = core.mixin;
    var WorkQueue = core.WorkQueue;
    var Operation = core.Operation;
    var InputDataSanitizer = core.InputDataSanitizer;
    var HeartbeatProtocol = va.HeartbeatProtocol;
    var ErrorInfo = va.ErrorInfo;
    var AppMeasurementInfo = heartbeat.AppMeasurementInfo;
    var VisitorApiInfo = heartbeat.VisitorApiInfo;
    var Heartbeat = heartbeat.Heartbeat;
    var MD5 = utils.md5;

    var ERROR_SOURCE_APPLICATION = "application";
    var ERROR_SOURCE_PLAYER = "player";

    var SC_CONTENT_TYPE_VIDEO = "video";
    var SC_CONTENT_TYPE_AD  = "videoAd";
    var SC_START = "ms_s";
    var SC_START_PRIMETIME = "msp_s";
    var SC_START_AD = "msa_s";
    var SC_START_AD_PRIMETIME = "mspa_s";

    extend(VideoHeartbeat, HeartbeatProtocol);
    mixin(VideoHeartbeat, logger);


    /**
     * @implements {HeartbeatProtocol}
     *
     * @constructor
     */
    function VideoHeartbeat(appMeasurement, playerDelegate) {
        VideoHeartbeat.__super__.constructor.call(this);

        this._configData = null;
        this._isTrackingSessionActive = false;
        this._isPaused = false;
        this._isSeeking = false;
        this._isBuffering = false;
        this._errorInfo = null;
        this._readyToTrack = false;

        if (!appMeasurement) {
            throw new Error("The reference to the AppMeasurement object cannot be NULL.");
        }
        this._appMeasurement = appMeasurement;

        this._appMeasurementInfo = new AppMeasurementInfo();
        this._appMeasurementInfo.account = this._appMeasurement.account;
        this._appMeasurementInfo.ssl = this._appMeasurement.ssl;
        this._appMeasurementInfo.trackingServer = (this._appMeasurement.ssl && this._appMeasurement.trackingServerSecure)
                                                ?  this._appMeasurement.trackingServerSecure
                                                :  this._appMeasurement.trackingServer;


        this._visitorApiInfo = new VisitorApiInfo();

        if (!playerDelegate) {
            throw new Error("The reference to the PlayerDelegate implementation cannot be NULL.");
        }
        this._playerDelegate = playerDelegate;

        var errorOperation = new Operation(this._executeErrorCallback, this);
        this._inputDataSanitizer = new InputDataSanitizer(errorOperation);
        this._heartbeat = new Heartbeat(this._playerDelegate, errorOperation);

        this._resetInternalState();

        this._isDestroyed = false;

        // Activate logging for this class.
        this.enableLogging('[video-heartbeat::VideoHeartbeat] > ');

        // Setup the Heartbeat and SiteCatalyst work queues
        this._hbWorkQueue = new WorkQueue();
        this._scWorkQueue = new WorkQueue(2000);

        // Prepare AppMeasurement for tracking (fetch the Visitor IDs)
        this._prepareAppMeasurement();
    }


    //
    // -------------------[ HeartbeatProtocol interface implementation ]-----------------------
    //
    VideoHeartbeat.prototype.configure = function(configData) {
        if (!configData) {
            throw new Error("Configuration object cannot be NULL");
        }

        this._configData = configData;

        // Configure the logging sub-system.
        core.LOGGING_ENABLED = !!configData.debugLogging;

        this.log("#config({" +
            ", trackingServer=" + configData.trackingServer +
            ", jobId="          + configData.jobId +
            ", publisher="      + configData.publisher +
            ", ovp="            + configData.ovp +
            ", sdk="            + configData.sdk +
            ", __primetime="    + configData.__primetime +
            ", __psdkVersion="  + configData.__psdkVersion +
            ", useSSL="         + this._appMeasurement.ssl +
            ", quietMode="      + configData.quietMode +
            ", channel="        + configData.channel +
            ", debugLogging="   + configData.debugLogging +
            "})");

        this._enqueueCall(this._hbWorkQueue, "heartbeat.configure", this._heartbeat.configure, [this._appMeasurementInfo, this._visitorApiInfo, configData]);
    };

    VideoHeartbeat.prototype.destroy = function() {
        if (this._isDestroyed) return;

        this._heartbeat.destroy();

        // From this point on, we no longer accepts API requests.
        this._isDestroyed = true;
    };

    VideoHeartbeat.prototype.trackVideoLoad = function() {
        if (this._isDestroyed) {
            this.warn("#trackVideoLoad() > Unable to track: instance previously destroyed.");
            this._executeErrorCallback("Illegal operation.", "Instance previously destroyed.");

            return;
        }

        // If there is already another tracking session in progress, terminate it.
        if (this._isTrackingSessionActive) {
            this._enqueueCall(this._hbWorkQueue, "heartbeat.videoUnload", this._heartbeat.videoUnload);
        }

        // Reset the internal state variables.
        this._resetInternalState();

        this.log("#trackVideoLoad() > Querying the player delegate.");
        var videoInfo = this._playerDelegate.getVideoInfo();

        // Sanitize the input data
        if (!this._inputDataSanitizer.sanitizeVideoInfo(videoInfo)) {
            return;
        }

        this.log("#trackVideoLoad(" +
            "playerName=" + videoInfo.playerName +
            ", videoId=" + videoInfo.id +
            ", name=" + videoInfo.name +
            ", length=" + videoInfo.length +
            ", playhead=" + videoInfo.playhead +
            ", streamType=" + videoInfo.streamType +
            ")");

        // Start the tracking session.
        this._enqueueCall(this._scWorkQueue, "sc.open", this._executeSiteCatalystOpen, [videoInfo]);

        this._enqueueCall(this._hbWorkQueue, "heartbeat.videoLoad", this._heartbeat.videoLoad, [videoInfo]);
        this._enqueueCall(this._hbWorkQueue, "heartbeat.videoStart", this._heartbeat.videoStart);

        // The tracking session is now started.
        this._isTrackingSessionActive = true;
    };

    VideoHeartbeat.prototype.trackVideoUnload = function() {
        if (!this._checkCall("trackVideoUnload")) return;

        this.log("#trackVideoUnload() > Tracking a VIDEO_UNLOAD event.");

        // Complete the tracking session.
        this._enqueueCall(this._hbWorkQueue, "heartbeat.videoUnload", this._heartbeat.videoUnload);

        // The tracking session is now complete.
        this._isTrackingSessionActive = false;
    };

    VideoHeartbeat.prototype.trackPlay = function() {
        if (!this._checkCall("trackPlay")) return;

        this.log("#trackPlay() > Tracking a PLAY event.");

        // This was an explicit PLAY command: we are no longer in the "paused" state.
        this._isPaused = false;

        this._resumePlaybackIfPossible();
    };

    VideoHeartbeat.prototype.trackPause = function() {
        if (!this._checkCall("trackPause")) return;

        this.log("#trackPause() > Tracking a PAUSE event.");

        // Pause the playback.
        this._enqueueCall(this._hbWorkQueue, "heartbeat.pause", this._heartbeat.pause);

        // This was an explicit PAUSE command: we are now in the "paused" state.
        this._isPaused = true;
    };

    VideoHeartbeat.prototype.trackBufferStart = function() {
        if (!this._checkCall("trackBufferStart")) return;

        this.log("#trackBufferStart() > Tracking a BUFFER_START event.");

        // Track the BUFFER_START event.
        this._enqueueCall(this._hbWorkQueue, "heartbeat.bufferStart", this._heartbeat.bufferStart);

        this._isBuffering = true;
    };

    VideoHeartbeat.prototype.trackBufferComplete = function() {
        if (!this._checkCall("trackBufferComplete")) return;

        this.log("#trackBufferComplete() > Tracking a BUFFER_COMPLETE event.");

        this._isBuffering = false;

        this._resumePlaybackIfPossible();
    };

    VideoHeartbeat.prototype.trackSeekStart = function() {
        if (!this._checkCall("trackSeekStart")) return;

        this.log("#trackSeekStart() > Tracking a SEEK_START event.");
        this._enqueueCall(this._hbWorkQueue, "heartbeat.seekStart", this._heartbeat.seekStart);

        // Seek operations are async. Pause the playback until the seek completes.
        this._enqueueCall(this._hbWorkQueue, "heartbeat.pause", this._heartbeat.pause);

        this._isSeeking = true;
    };

    VideoHeartbeat.prototype.trackSeekComplete = function() {
        if (!this._checkCall("trackSeekComplete")) return;

        this.log("#trackSeekComplete() > Tracking a SEEK_COMPLETE event.");

        this._enqueueCall(this._hbWorkQueue, "heartbeat.seekComplete", this._heartbeat.seekComplete);

        this._isSeeking = false;

        this._resumePlaybackIfPossible();
    };

    VideoHeartbeat.prototype.trackComplete = function() {
        if (!this._checkCall("trackComplete")) return;

        this.log("#trackComplete() > Tracking a COMPLETE event.");

        this._enqueueCall(this._hbWorkQueue, "heartbeat.videoComplete", this._heartbeat.videoComplete);
    };

    /**
     * @Deprecated
     */
    VideoHeartbeat.prototype.trackAdBreakStart = function() {
        this.warn("#trackAdBreakStart() > Deprecated.");
    };

    /**
     * @Deprecated
     */
    VideoHeartbeat.prototype.trackAdBreakComplete = function() {
        this.warn("#trackAdBreakComplete() > Deprecated.");
    };

    VideoHeartbeat.prototype.trackAdStart = function() {
        if (!this._checkCall("trackAdStart")) return;

        this.log("#trackAdStart() > Querying the player delegate.");

        // Query the player delegate to for the video info.
        var videoInfo = this._playerDelegate.getVideoInfo();
        // Sanitize the input data
        if (!this._inputDataSanitizer.sanitizeVideoInfo(videoInfo)) {
            return;
        }

        // Query the player delegate for teh ad-break info.
        var adBreakInfo = this._playerDelegate.getAdBreakInfo();
        // Sanitize the input data
        if (!this._inputDataSanitizer.sanitizeAdBreakInfo(adBreakInfo, false)) {
            return;
        }

        // The user of this API did not provide the start-time for this pod.
        // We assume that the start-time is equal with the current playhead
        // value inside the main content.
        if (adBreakInfo.startTime == null || isNaN(adBreakInfo.startTime)) {
            adBreakInfo.startTime = videoInfo.playhead;
        }


        // Query the player delegate to for the ad info.
        var adInfo = this._playerDelegate.getAdInfo();
        // Sanitize the input data
        if (!this._inputDataSanitizer.sanitizeAdInfo(adInfo, false)) {
            return;
        }

        this.log("#trackAdStart(" +
            "adId=" + adInfo.id +
            ", name=" + adInfo.name +
            ", length=" + adInfo.length +
            ", playhead=" + adInfo.playhead +
            ", position=" + adInfo.position +
            ", cpm=" + adInfo.cpm +
            ")");

        // Start tracking the ad content.
        this._enqueueCall(this._scWorkQueue, "sc.openAd", this._executeSiteCatalystOpenAd, [videoInfo, adBreakInfo, adInfo]);
        this._enqueueCall(this._hbWorkQueue, "heartbeat.adStart", this._heartbeat.adStart, [adInfo, adBreakInfo]);

        // Automatically start playback (we implement auto-playback for ad content).
        this._resumePlaybackIfPossible();
    };

    VideoHeartbeat.prototype.trackAdComplete = function() {
        if (!this._checkCall("trackAdComplete")) return;

        this.log("#trackAdComplete() > Tracking an AD_COMPLETE event.");

        // Track the completion of the ad content.
        this._enqueueCall(this._hbWorkQueue, "heartbeat.adComplete", this._heartbeat.adComplete);

        // If we are not in "paused" / "seeking" / "buffering" state, we inject a play event
        this._resumePlaybackIfPossible();
    };

    VideoHeartbeat.prototype.trackChapterStart = function() {
        if (!this._checkCall("trackChapterStart")) return;

        this.log("#trackChapterStart() > Querying the player delegate.");

        // Query the player delegate to for the chapter info.
        var chapterInfo = this._playerDelegate.getChapterInfo();
        // Sanitize the input data
        if (!this._inputDataSanitizer.sanitizeChapterInfo(chapterInfo, false)) {
            return;
        }

        this.log("#trackChapterStart(" +
            "name=" + chapterInfo.name +
            ", length=" + chapterInfo.length +
            ", position=" + chapterInfo.position +
            ", startTime=" + chapterInfo.startTime +
            ")");

        // Track the CHAPTER_START event.
        this._enqueueCall(this._hbWorkQueue, "heartbeat.chapterStart", this._heartbeat.chapterStart, [chapterInfo]);

        // If we are not in "paused" / "seeking" / "buffering" state, we inject a play event
        this._resumePlaybackIfPossible();
    };

    VideoHeartbeat.prototype.trackChapterComplete = function() {
        if (!this._checkCall("trackChapterComplete")) return;

        this.log("#trackChapterComplete() > Tracking a CHAPTER_COMPLETE event.");

        // Track the completion of the chapter.
        this._enqueueCall(this._hbWorkQueue, "heartbeat.chapterComplete", this._heartbeat.chapterComplete);

        // If we are not in "paused" / "seeking" / "buffering" state, we inject a play event
        this._resumePlaybackIfPossible();
    };

    VideoHeartbeat.prototype.trackBitrateChange = function(bitrate) {
        if (!this._checkCall("trackBitrateChange")) return;

        // Track the BITRATE_CHANGE event.
        this._enqueueCall(this._hbWorkQueue, "heartbeat.bitrateChange", this._heartbeat.bitrateChange);
    };

    VideoHeartbeat.prototype.trackVideoPlayerError = function(errorId) {
        if (!this._checkCall("trackVideoPlayerError")) return;

        this.log("#trackVideoPlayerError(errorId=" + errorId + ").");

        // Track the ERROR event.
        this._enqueueCall(this._hbWorkQueue, "heartbeat.trackError", this._heartbeat.trackError, [ERROR_SOURCE_PLAYER, errorId]);
    };

    VideoHeartbeat.prototype.trackApplicationError = function(errorId) {
        if (!this._checkCall("trackApplicationError")) return;

        this.log("#trackApplicationError(errorId=" + errorId + ").");

        // Track the ERROR event.
        this._enqueueCall(this._hbWorkQueue, "heartbeat.trackError", this._heartbeat.trackError, [ERROR_SOURCE_APPLICATION, errorId]);
    };


    //
    //---------------------[ Private helper methods ]-----------------------
    //
    VideoHeartbeat.prototype._checkCall = function(methodName) {
        if (this._errorInfo) {
            this.warn("#" + methodName + "() > Unable to track: in ERROR state. " +
                "Message: " + this._errorInfo.message +
                " | Details: " + this._errorInfo.details);

            return false;
        }

        if (this._isDestroyed) {
            this.warn("#" + methodName + "() > Unable to track: instance previously destroyed.");
            this._executeErrorCallback("Illegal operation.", "Instance previously destroyed.");

            return false;
        }

        if (!this._isTrackingSessionActive) {
            this.warn("#" + methodName + "() > Unable to track: no active tracking session.");
            return false;
        }

        return true;
    };

    VideoHeartbeat.prototype._resumePlaybackIfPossible = function() {
        // Only resume playback if we're neither "paused", "seeking" nor "buffering"
        if (!this._isPaused && !this._isSeeking && !this._isBuffering) {
            this._enqueueCall(this._hbWorkQueue, "heartbeat.play", this._heartbeat.play);
        }
    };

    VideoHeartbeat.prototype._executeSiteCatalystOpen = function(videoInfo) {
        this.log(this, "#_executeSiteCatalystOpen(" +
              "id=" + videoInfo.id +
            ", length=" + videoInfo.length +
            ", streamType=" + videoInfo.streamType +
            ", playerName=" + videoInfo.playerName +
            ")");

        // Make sure that SiteCatalyst start call is fired over the network.

        this._resetAppMeasurementContextData();

        this._appMeasurement.contextData["a.contentType"]           = SC_CONTENT_TYPE_VIDEO;

        this._appMeasurement.contextData["a.media.name"]            = videoInfo.id;
        this._appMeasurement.contextData["a.media.friendlyName"]    = videoInfo.name || "";
        this._appMeasurement.contextData["a.media.length"]          = Math.floor(videoInfo.length);
        this._appMeasurement.contextData["a.media.playerName"]      = videoInfo.playerName;
        this._appMeasurement.contextData["a.media.channel"]         = this._configData.channel;
        this._appMeasurement.contextData["a.media.view"]            = true;

        this._appMeasurement.pev3 = SC_CONTENT_TYPE_VIDEO;
        this._appMeasurement.pe   = this._configData.__primetime ? SC_START_PRIMETIME : SC_START;

        this._appMeasurement.track();
    };

    VideoHeartbeat.prototype._executeSiteCatalystOpenAd = function(videoInfo, adBreakInfo, adInfo) {
        var podId = MD5(videoInfo.id) + "_" + adBreakInfo.position;

        this.log("#_executeSiteCatalystOpenAd(" +
              "id=" + adInfo.id +
            ", length=" + adInfo.length +
            ", playerName=" + adBreakInfo.playerName +
            ", parentId=" + videoInfo.id +
            ", podId=" + podId +
            ", parentPodPosition=" + adInfo.position +
            ", podSecond=" + adBreakInfo.startTime +
            ", cpm=" + adInfo.cpm +
            ")");

        this._resetAppMeasurementContextData();

        this._appMeasurement.contextData["a.contentType"]               = SC_CONTENT_TYPE_AD;

        this._appMeasurement.contextData["a.media.name"]                = videoInfo.id;
        this._appMeasurement.contextData["a.media.channel"]             = this._configData.channel;

        this._appMeasurement.contextData["a.media.ad.name"]             = adInfo.id;
        this._appMeasurement.contextData["a.media.ad.friendlyName"]     = adInfo.name || "";
        this._appMeasurement.contextData["a.media.ad.podFriendlyName"]  = adBreakInfo.name || "";
        this._appMeasurement.contextData["a.media.ad.length"]           = Math.floor(adInfo.length);
        this._appMeasurement.contextData["a.media.ad.playerName"]       = adBreakInfo.playerName;
        this._appMeasurement.contextData["a.media.ad.pod"]              = podId;
        this._appMeasurement.contextData["a.media.ad.podPosition"]      = Math.floor(adInfo.position);
        this._appMeasurement.contextData["a.media.ad.podSecond"]        = Math.floor(adBreakInfo.startTime);
        this._appMeasurement.contextData["a.media.ad.CPM"]              = adInfo.cpm;
        this._appMeasurement.contextData["a.media.ad.view"]             = true;

        this._appMeasurement.pev3 = SC_CONTENT_TYPE_AD;
        this._appMeasurement.pe   = this._configData.__primetime ? SC_START_AD_PRIMETIME : SC_START_AD;

        this._appMeasurement.track();
    };

    VideoHeartbeat.prototype._resetInternalState = function() {
        this.log("#_resetInternalState() : Resetting internal state variables.");

        this._errorInfo = null;

        this._isTrackingSessionActive = false;
        this._isPaused = false;
        this._isSeeking = false;
        this._isBuffering = false;
    };

    VideoHeartbeat.prototype._enqueueCall = function(queue, name, fn, args) {
        if (this._errorInfo) {
            this.warn("#_enqueueHeartbeatCall() > Unable to track: in ERROR state.");
            return;
        }

        args = (typeof args !== "undefined") ? args : null;

        var ctx = queue == this._hbWorkQueue ? this._heartbeat : this;

        if (!this._readyToTrack) {
            this.log("#_enqueueCall() : " + name);
            queue.addJob(name, fn, args, ctx);
        } else {
            if (!queue.isEmpty()) { // even if we have the visitor ID value(s),
                                    // if there is pending work, we need to enqueue
                this.log("#_enqueueCall() : " + name);
                queue.addJob(name, fn, args, ctx);
            } else {
                if (queue == this._hbWorkQueue ) { // we can execute HB jobs immediately and bypass the work queue.
                    fn.apply(ctx, args);
                } else { // ...but we always need to defer the SC jobs.
                    this._scWorkQueue.addJob(name, fn, args, this);
                    this._scWorkQueue.drain();
                }
            }
        }
    };

    VideoHeartbeat.prototype._prepareAppMeasurement = function() {
        if (this._appMeasurement.isReadyToTrack()) {
            this._onAppMeasurementReady();
        } else {
            this._appMeasurement.callbackWhenReadyToTrack(this, this._onAppMeasurementReady);
        }
    };

    VideoHeartbeat.prototype._onAppMeasurementReady = function() {
        // If we have an error, we just clear the work-queues and exit.
        if (this._errorInfo) {
            this.log("#_onAppMeasurementReady() > Unable to track: in ERROR state.");
            this._scWorkQueue.clear();
            this._hbWorkQueue.clear();

            return;
        }

        this._visitorApiInfo.analyticsVisitorID = this._appMeasurement.analyticsVisitorID;
        this._visitorApiInfo.marketingCloudVisitorID = this._appMeasurement.marketingCloudVisitorID;
        this._visitorApiInfo.visitorID = this._appMeasurement.visitorID;

        this._readyToTrack = true;

        // Drain/flush all queues.
        this._scWorkQueue.drain();
        this._hbWorkQueue.flush();
    };

    VideoHeartbeat.prototype._executeErrorCallback = function(message, details) {
        this.error("#_executeErrorCallback() > " + message + " - " + details);
        this._errorInfo = new ErrorInfo(message, details);
        this._playerDelegate.onError(this._errorInfo);
    };

    VideoHeartbeat.prototype._resetAppMeasurementContextData = function() {
        delete this._appMeasurement.contextData["a.contentType"];

        delete this._appMeasurement.contextData["a.media.name"];
        delete this._appMeasurement.contextData["a.media.friendlyName"];
        delete this._appMeasurement.contextData["a.media.length"];
        delete this._appMeasurement.contextData["a.media.playerName"];
        delete this._appMeasurement.contextData["a.media.channel"];
        delete this._appMeasurement.contextData["a.media.view"];

        delete this._appMeasurement.contextData["a.media.ad.name"];
        delete this._appMeasurement.contextData["a.media.ad.friendlyName"];
        delete this._appMeasurement.contextData["a.media.ad.podFriendlyName"];
        delete this._appMeasurement.contextData["a.media.ad.length"];
        delete this._appMeasurement.contextData["a.media.ad.playerName"];
        delete this._appMeasurement.contextData["a.media.ad.pod"];
        delete this._appMeasurement.contextData["a.media.ad.podPosition"];
        delete this._appMeasurement.contextData["a.media.ad.podSecond"];
        delete this._appMeasurement.contextData["a.media.ad.CPM"];
        delete this._appMeasurement.contextData["a.media.ad.view"];
    };


    // Export symbols.
    va.VideoHeartbeat = VideoHeartbeat;
})(core, va, heartbeat, utils);




//Export symbols
global.ADB || (global.ADB = {});
global.ADB.core || (global.ADB.core = core);
global.ADB.va = va;

})(this);