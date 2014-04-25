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
 * video heartbeats - v1.2.0 - 2014-04-25
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
    var MINOR = "2";
    var MICRO = "0";

    /**
     * Container for library version information.
     *
     * @constructor
     */
    function Version() {}

    /**
     * The current version of the library.
     *
     * This has the following format: $major.$minor.$micro
     */
    Version.getVersion = function() {
        return PLATFORM + "-" + MAJOR + "." + MINOR + "." + MICRO;
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
        for (var i = 0; i < fnNames.length; i ++) {
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
        executeDeferred: function () {
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
        this._events[type].push({cb: listener, ctx:context});
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
        for (i = this._events[key].length - 1; i >=0 ; i --) {
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

        var key,i;
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
     * @param {Object=} target The object for which all event listeners are to be removed.
     */
    EventDispatcher.prototype.removeAllListeners = function(target) {
        if (!target) {
            this._events = {};
        } else {
            var i, key;

            for (key in this._events) {
                if (this._events.hasOwnProperty(key)) {
                    for (i = this._events[key].length - 1; i >=0 ; i --) {
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

    var EventDispatcher = core.EventDispatcher;

    function NotificationCenter() {
        // Provide a singleton event dispatcher.
        if (!NotificationCenter.prototype._instance) {
            NotificationCenter.prototype._instance = new EventDispatcher();
        }

        return NotificationCenter.prototype._instance;
    }

    // Export symbols.
    core.NotificationCenter = NotificationCenter;
})(core);

(function(core) {
    'use strict';

    var Event = core.Event;
    var EventDispatcher = core.EventDispatcher;

    URLRequestMethod.GET = "GET";
    function URLRequestMethod() {}




    function URLRequest(url, method) {
        this.url = url || null;
        this.method = method;
        this._xmlhttp = null;
    }




    URLLoader.STATUS = "status";
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
    URLLoader.prototype._createCORSRequest = function(req){
        req._xmlhttp = new window["XMLHttpRequest"]();
        if ("withCredentials" in req._xmlhttp){
            return;
        } else if (typeof window["XDomainRequest"] !== "undefined"){
            req._xmlhttp = new window["XDomainRequest"]();
        } else {
            req._xmlhttp = null;
        }

        if (req._xmlhttp) {
            var self = this;
            req._xmlhttp.onreadystatechange = function() {
                if (req._xmlhttp.readyState === 4) { // Wait for the call to complete
                    var eventData = {};
                    eventData[URLLoader.STATUS] = req._xmlhttp.status;

                    if (req._xmlhttp.status >= 200 && req._xmlhttp.status < 400) {
                        eventData[URLLoader.RESPONSE] = req._xmlhttp.responseText;
                        eventData[URLLoader.INSTANCE] = self;
                        self.dispatchEvent(new core.Event(Event.SUCCESS, eventData));

                    } else {
                        self.dispatchEvent(new core.Event(Event.ERROR, eventData));
                    }
                }
            };
        }
    };

    URLLoader.prototype._load_img = function(req) {
        if (!this._connection) {
            this._connection = new Image();
            this._connection.alt = "";
        }

        this._connection.src = req.url;

        // Image requests are always successful.
        var eventData = {};
        eventData[URLLoader.STATUS] = 200;
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
        if(!req || !req.method || !req.url) {
            return;
        }

        this._createCORSRequest(req);

        if (req._xmlhttp) {
            req._xmlhttp.open(req.method, req.url, true);
            req._xmlhttp.send();
        } else { // No CORS support : fall-back to image request.
            this._load_img(req);
        }
    };

    // Export symbols.
    core.URLRequestMethod = URLRequestMethod;
    core.URLRequest = URLRequest;
    core.URLLoader = URLLoader;
})(core);
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
    EventKeyName.STREAM_TYPE = "stream_type";
    EventKeyName.OVP = "ovp";
    EventKeyName.SDK = "sdk";
    EventKeyName.CHANNEL = "channel";
    EventKeyName.USE_SSL = "use_ssl";
    EventKeyName.QUIET_MODE = "quiet_mode";
    EventKeyName.VISITOR_ID = "visitor_id";
    EventKeyName.ANALYTICS_VISITOR_ID = "analytics_visitor_id";
    EventKeyName.MARKETING_CLOUD_VISITOR_ID = "marketing_cloud_visitor_id";
    EventKeyName.NAME = "name";
    EventKeyName.LENGTH = "length";
    EventKeyName.PLAYER_NAME = "player_name";
    EventKeyName.TIMER_INTERVAL = "timer_interval";
    EventKeyName.TRACKING_INTERVAL = "tracking_interval";
    EventKeyName.CHECK_STATUS_INTERVAL = "check_status_interval";
    EventKeyName.TRACK_EXTERNAL_ERRORS = "track_external_errors";
    EventKeyName.PARENT_NAME = "parent_name";
    EventKeyName.PARENT_POD = "parent_pod";
    EventKeyName.PARENT_POD_POSITION = "parent_pod_position";
    EventKeyName.PARENT_POD_OFFSET = "parent_pod_offset";
    EventKeyName.CPM = "parent_pod_cpm";
    EventKeyName.OFFSET = "offset";
    EventKeyName.SOURCE = "source";
    EventKeyName.ERROR_ID = "error_id";
    EventKeyName.BITRATE = "bitrate";
    EventKeyName.FPS = "fps";
    EventKeyName.DROPPED_FRAMES = "dropped_frames";

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
    ApiEvent.API_OPEN_MAIN = "api_open_main";
    ApiEvent.API_OPEN_AD = "api_open_ad";
    ApiEvent.API_CLOSE = "api_close";
    ApiEvent.API_PLAY = "api_play";
    ApiEvent.API_STOP = "api_stop";
    ApiEvent.API_CLICK = "api_click";
    ApiEvent.API_COMPLETE = "api_complete";
    ApiEvent.API_TRACK_ERROR = "api_track_error";
    ApiEvent.API_QOS_INFO = "api_qos_info";
    ApiEvent.API_BITRATE_CHANGE = "api_bitrate_change";
    ApiEvent.API_BUFFER_START = "api_buffer_start";
    ApiEvent.API_POD_OFFSET = "api_pod_offset";
    ApiEvent.API_SESSION_COMPLETE = "api_session_complete";

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

    ClockEvent["CLOCK_TRACKING_TICK"] = "CLOCK_TRACKING_TICK";
    ClockEvent["CLOCK_TRACKING_ENABLE"] = "CLOCK_TRACKING_ENABLE";
    ClockEvent["CLOCK_TRACKING_DISABLE"] = "CLOCK_TRACKING_DISABLE";

    ClockEvent["CLOCK_CHECK_STATUS_TICK"] = "CLOCK_CHECK_STATUS_TICK";
    ClockEvent["CLOCK_CHECK_STATUS_ENABLE"] = "CLOCK_CHECK_STATUS_ENABLE";
    ClockEvent["CLOCK_CHECK_STATUS_DISABLE"] = "CLOCK_CHECK_STATUS_DISABLE";

    ClockEvent["CLOCK_MONITOR_TICK"] = "CLOCK_MONITOR_TICK";
    ClockEvent["CLOCK_MONITOR_UPDATE"] = "CLOCK_MONITOR_UPDATE";
    ClockEvent["CLOCK_MONITOR_ENABLE"] = "CLOCK_MONITOR_ENABLE";
    ClockEvent["CLOCK_MONITOR_DISABLE"] = "CLOCK_MONITOR_DISABLE";

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

        this.cpm = this._createAccessor("_cpm", "cpm", null);
        this.adId = this._createAccessor("_adId", "ad_id", null);
        this.resolver = this._createAccessor("_resolver", "resolver", null);
        this.podId = this._createAccessor("_podId", "pod_id", null);
        this.podPosition = this._createAccessor("_podPosition", "pod_position", null);
        this.podSecond = this._createAccessor("_podSecond", "pod_second", null);
        this.length = this._createAccessor("_length", "length", null);

        this.cpm('');
        this.adId('');
        this.resolver('');
        this.podId('');
        this.podPosition('');
        this.podSecond(0);
        this.length(0);

        if (arguments.length && arguments[0] instanceof AdDao) {
            var other = arguments[0];

            this.cpm(other.cpm());
            this.adId(other.adId());
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
    var AdDao = heartbeat.model.AdDao;

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
        this.duration = this._createAccessor("_duration", "duration", null);

        this.type('');
        this.videoId('');
        this.publisher('');
        this.adData(null);
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
        this.prevTs(-1);
        this.ts(new Date().getTime());
    }

    //
    // -------------------[ Private helper methods ]-----------------------
    //
    EventDao.prototype._updateTsAsDate = function() {
        // Truncate the timestamp to a multiple of the trackingInterval.
        var trackingIntervalMs = this._trackingInterval * 1000;
        var truncatedMs = Math.floor(this._ts / trackingIntervalMs) * trackingIntervalMs;

        this._tsAsDate = new Date(truncatedMs);
        var dateDao = new DateDao(this.realm, this._tsAsDate);
        this.setField("ts_as_date", dateDao, null);
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

        this.reportSuiteId('');
        this.trackingServer('');
    }

    // Export symbols.
    heartbeat.model.SiteCatalystDao = SiteCatalystDao;
})(core, heartbeat);

(function(core, heartbeat) {
    'use strict';

    var Dao = heartbeat.model.Dao;

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

        this.ovp('unknown');
        this.sdk('unknown');
        this.channel('unknown');
        this.playerName('');
        this.libVersion('unknown');
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

        this.sessionId('');
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

        this.cdn('');
        this.name('');

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
        this.visitorId = this._createAccessor("_visitorId", "id", null);
        this.analyticsVisitorId = this._createAccessor("_analyticsVisitorId", "aid", null);
        this.marketingCloudVisitorId = this._createAccessor("_marketingCloudVisitorId", "mid", null);

        this.device('');
        this.country('');
        this.city('');
        this.latitude('');
        this.longitude('');
        this.visitorId('');
        this.analyticsVisitorId('');
        this.marketingCloudVisitorId('');

        if (arguments.length && arguments[0] instanceof UserDao) {
            var other = arguments[0];

            this.device(other.device());
            this.country(other.country());
            this.city(other.city());
            this.latitude(other.latitude());
            this.longitude(other.longitude());
            this.visitorId(other.visitorId());
            this.analyticsVisitorId(other.analyticsVisitorId());
            this.marketingCloudVisitorId(other.marketingCloudVisitorId());
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

        for (var i = this.reportEntries.length - 1; i >=0; i--) {
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
    var ApiEvent = heartbeat.event.ApiEvent;
    var ClockEvent = heartbeat.event.ClockEvent;
    var EventKeyName = heartbeat.event.EventKeyName;
    var NotificationCenter = core.NotificationCenter;

    function TimerDescriptor(interval) {
        this.tick = 0;
        this.interval = interval;
        this.isActive = false;
    }




    var TIMER_BASE_INTERVAL = 1;  // 1 second

    mixin(TimerManager, logger);

    function TimerManager() {
        this._currentTick = 0;
        this._timers = {};

        // Setup the base timer for the clock partition.
        var self = this;
        this._clock = setInterval(function(){ self._onTick(); }, TIMER_BASE_INTERVAL * 1000);

        // Activate logging for this class.
        this.enableLogging('[heartbeat::TimerManager] > ');
    }

    //
    //--------------------[ Notification handlers ]--------------------
    //
    TimerManager.prototype._onTick = function() {
        this.log("#_onTick() > ------------------- (" + this._currentTick + ")");
        this._currentTick ++;

        for (var name in this._timers) {
            if (this._timers.hasOwnProperty(name)) {
                var timer = this._timers[name];

                if (timer.isActive) {
                    timer.tick ++;

                    if (timer.tick % timer.interval === 0) {
                        var eventData = {};
                        eventData[EventKeyName.TIMER_INTERVAL] = timer.interval;

                        NotificationCenter().dispatchEvent(new ClockEvent(ClockEvent[name], eventData));
                    }
                }
            }
        }
    };

    //
    // -------------------[ Public methods ]-----------------------
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
                this.log('Resetting timer: ' + name);
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
                this.log('Resetting timer: ' + name);
                timer.tick = 0;
            }
        }
    };

    TimerManager.prototype.destroy = function() {
        this.log("#destroy()");

        // Stop the base timer.
        clearInterval(this._clock);
    };

    // Export symbols.
    heartbeat.clock.TimerManager = TimerManager;
})(core, heartbeat);

(function(core, heartbeat) {
    'use strict';

    var logger = core.logger;
    var mixin = core.mixin;
    var NotificationCenter = core.NotificationCenter;
    var ApiEvent = heartbeat.event.ApiEvent;
    var TimerManager = heartbeat.clock.TimerManager;
    var EventKeyName = heartbeat.event.EventKeyName;

    mixin(Timer, logger);
    function Timer(timerManager, tickEventName, enableEventName, disableEventName, interval) {
        this.enableLogging('[media-fork::Timer] > ');

        this._timerManager = timerManager;
        this._interval = interval;
        this._tickEventName = tickEventName;
        this._enableEventName = enableEventName;
        this._disableEventName = disableEventName;

        // Register with the timer manager.
        this._timerManager.createTimer(this._tickEventName, this._interval);

        // We register as observers to various heartbeat events.
        NotificationCenter().addEventListener(this._enableEventName, this._onTimerEnabled, this);
        NotificationCenter().addEventListener(this._disableEventName, this._onTimerDisabled, this);
    }

    //
    // -------------------[ Private helper methods ]-----------------------
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

    Timer.prototype.start = function(reset) {
        this.log("#start(" + this._tickEventName + ")");
        this._timerManager.startTimer(this._tickEventName, reset);
    };

    //
    // -------------------[ Public methods ]-----------------------
    //
    Timer.prototype.stop = function(reset) {
        this.log("#stop(" + this._tickEventName + ")");
        this._timerManager.stopTimer(this._tickEventName, reset);
    };

    Timer.prototype.destroy = function() {
        // Detach from the notification center.
        NotificationCenter().removeAllListeners(this);

        // Un-register from the timer manager.
        this._timerManager.destroyTimer(this._tickEventName);
    };

    Timer.prototype.setInterval = function(interval) {
        // Remember the current timer state.
        var wasActive = TimerManager().isTimerActive(this._tickEventName);

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

    // Export symbols.
    heartbeat.clock.Timer = Timer;
})(core, heartbeat);

(function(core, heartbeat) {
    'use strict';

    var mixin = core.mixin;
    var logger = core.logger;
    var NotificationCenter = core.NotificationCenter;
    var ClockEvent = heartbeat.event.ClockEvent;
    var EventKeyName = heartbeat.event.EventKeyName;
    var Timer = heartbeat.clock.Timer;

    var MONITOR_TIMER_INTERVAL = 1; // 1 second

    core.extend(MonitorTimer, Timer);
    mixin(MonitorTimer, logger);

    /**
     * @extends clock.Timer
     */
    function MonitorTimer(timerManager) {
        MonitorTimer.__super__.constructor.call(this,
            timerManager,
            ClockEvent["CLOCK_MONITOR_TICK"],
            ClockEvent["CLOCK_MONITOR_ENABLE"],
            ClockEvent["CLOCK_MONITOR_DISABLE"],
            MONITOR_TIMER_INTERVAL);

        this._offsetTable = {};
        this._activeAsset = null;

        //
        //-----------------[ Object construction ]-----------------------
        //
        // We register as observers to various heartbeat events.
        NotificationCenter().addEventListener(ClockEvent["CLOCK_MONITOR_TICK"], this._onMonitorTick, this);

        // Activate logging for this class.
        this.enableLogging('[heartbeat::MonitorTimer] > ');
    }

    //
    //--------------------[ Notification handlers ]--------------------
    //
    MonitorTimer.prototype._onMonitorTick = function(e) {
        if (!this._activeAsset) {
            this.error("_onMonitorTick() > Monitor timer expects an activeAsset value that is not NULL.");
            return;
        }

        if (!this._offsetTable.hasOwnProperty(this._activeAsset)) {
            this.error("_onMonitorTick() > Unable to find offset for asset: " + this._activeAsset);
        }

        var offset = this._offsetTable[this._activeAsset];

        // Increment the playhead value for the current active asset.
        offset ++;

        // Save the new playhead value inside the offset table.
        this._offsetTable[this._activeAsset] = offset;

        // Signal that the playhead for the currently active asset has changed.
        var eventData = {};
        eventData[EventKeyName.NAME] = this._activeAsset;
        eventData[EventKeyName.OFFSET] = offset;

        NotificationCenter().dispatchEvent(new ClockEvent(ClockEvent.CLOCK_MONITOR_UPDATE, eventData));
    };

    //
    //--------------------[ Private helper methods ]--------------------
    //
    MonitorTimer.prototype._onTimerEnabled = function(e) {
        var eventData = e.data;

        // Remember the currently active asset.
        this._activeAsset = eventData[EventKeyName.NAME];

        this.log("_onTimerEnabled() > Active asset: " + this._activeAsset);

        // Update the internal offset table.
        this._offsetTable[this._activeAsset] = eventData[EventKeyName.OFFSET];

        MonitorTimer.__super__._onTimerEnabled.call(this, e);

    };

    MonitorTimer.prototype._onTimerDisabled = function(e) {
        var eventData = e.data;

        // Remember the currently active asset.
        this._activeAsset = eventData[EventKeyName.NAME];

        this.log("_onTimerDisabled() > Active asset: " + this._activeAsset);

        // Update the internal offset table.
        this._offsetTable[this._activeAsset] = eventData[EventKeyName.OFFSET];

        MonitorTimer.__super__._onTimerDisabled.call(this, e);
    };

    // Export symbols.
    heartbeat.clock.MonitorTimer = MonitorTimer;
})(core, heartbeat);

(function(core, heartbeat) {
    'use strict';

    var mixin = core.mixin;
    var logger = core.logger;
    var NotificationCenter = core.NotificationCenter;
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
    function TrackingTimer(timerManager) {
        TrackingTimer.__super__.constructor.call(this,
            timerManager,
            ClockEvent["CLOCK_TRACKING_TICK"],
            ClockEvent["CLOCK_TRACKING_ENABLE"],
            ClockEvent["CLOCK_TRACKING_DISABLE"],
            DEFAULT_TRACKING_INTERVAL);

        // We register as observers to various heartbeat events.
        NotificationCenter().addEventListener(NetworkEvent.NETWORK_CHECK_STATUS_COMPLETE, this._onCheckStatusComplete, this);
        NotificationCenter().addEventListener(DataEvent.DATA_REQUEST, this._onDataRequest, this);

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
            if (newTimerInterval === this._interval) {
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

                NotificationCenter().dispatchEvent(new DataEvent(DataEvent.DATA_RESPONSE, eventData));
                break;
        }
    };

    // Export symbols.
    heartbeat.clock.TrackingTimer = TrackingTimer;
})(core, heartbeat);

(function(core, heartbeat) {
    'use strict';

    var MAXIMUM_CHECK_STATUS_INTERVAL = 10 * 60; //10 min
    var DEFAULT_CHECK_STATUS_INTERVAL = 60; // 1 min

    var mixin = core.mixin;
    var logger = core.logger;
    var NotificationCenter = core.NotificationCenter;
    var NetworkEvent = heartbeat.event.NetworkEvent;
    var EventKeyName = heartbeat.event.EventKeyName;
    var ClockEvent = heartbeat.event.ClockEvent;
    var Timer = heartbeat.clock.Timer;

    core.extend(CheckStatusTimer, Timer);
    mixin(CheckStatusTimer, logger);

    /**
     * @extends clock.Timer
     */
    function CheckStatusTimer(timerManager) {
        CheckStatusTimer.__super__.constructor.call(this,
            timerManager,
            ClockEvent["CLOCK_CHECK_STATUS_TICK"],
            ClockEvent["CLOCK_CHECK_STATUS_ENABLE"],
            ClockEvent["CLOCK_CHECK_STATUS_DISABLE"],
            DEFAULT_CHECK_STATUS_INTERVAL);

        // Do the initial settings request.
        var self = this;
        setTimeout(function() { self._initialCheck(); }, 200);

        // We register as observers to various heartbeat events.
        NotificationCenter().addEventListener(NetworkEvent.NETWORK_CHECK_STATUS_COMPLETE, this._onCheckStatusComplete, this);

        // Activate logging for this class.
        this.enableLogging('[heartbeat::CheckStatusTimer] > ');
    }

    //
    // -------------------[ Private helper methods ]-----------------------
    //
    CheckStatusTimer.prototype._initialCheck = function() {
        this.log("#_initialCheck()");

        var eventData = {};
        eventData[EventKeyName.TIMER_INTERVAL] = this._interval;

        NotificationCenter().dispatchEvent(new ClockEvent(ClockEvent["CLOCK_CHECK_STATUS_TICK"], eventData));
    };

    CheckStatusTimer.prototype._onCheckStatusComplete = function(e) {
        var newTimerInterval = e.data[EventKeyName.CHECK_STATUS_INTERVAL];

        this.log("#_onCheckStatusComplete(interval=" + newTimerInterval + ")");

        if (newTimerInterval) {
            if (newTimerInterval === this._interval) {
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

    // Export symbols.
    heartbeat.clock.CheckStatusTimer = CheckStatusTimer;
})(core, heartbeat);

(function(core, heartbeat) {
    'use strict';

    var TimerManager = heartbeat.clock.TimerManager;
    var CheckStatusTimer = heartbeat.clock.CheckStatusTimer;
    var TrackingTimer = heartbeat.clock.TrackingTimer;
    var MonitorTimer = heartbeat.clock.MonitorTimer;

    function Clock() {
        // Instantiate the timers.
        this._timerManager = new TimerManager();
        this._checkStatusTimer = new CheckStatusTimer(this._timerManager);
        this._trackingTimer = new TrackingTimer(this._timerManager);
        this._monitorTimer = new MonitorTimer(this._timerManager);
    }

    Clock.prototype.destroy = function() {
        this._monitorTimer.destroy();
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
    var NotificationCenter = core.NotificationCenter;
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
        temp && (trackExternalErrors = (temp === 1));

        // Tell everybody about the update in the configuration data.
        var eventData = {};
        eventData[EventKeyName.TRACKING_INTERVAL] = trackingInterval;
        eventData[EventKeyName.CHECK_STATUS_INTERVAL] = checkStatusInterval;
        eventData[EventKeyName.TRACK_EXTERNAL_ERRORS] = trackExternalErrors;

        this.log("#parse() > Obtained configuration settings: " + JSON.stringify(eventData));

        NotificationCenter().dispatchEvent(new NetworkEvent(NetworkEvent.NETWORK_CHECK_STATUS_COMPLETE, eventData));
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
    var NotificationCenter = core.NotificationCenter;
    var ApiEvent = heartbeat.event.ApiEvent;
    var URLRequestMethod = core.URLRequestMethod;
    var URLRequest = core.URLRequest;
    var URLLoader = core.URLLoader;
    var EventKeyName = heartbeat.event.EventKeyName;
    var DataEvent = heartbeat.event.DataEvent;
    var ClockEvent = heartbeat.event.ClockEvent;
    var ContextEvent = heartbeat.event.ContextEvent;
    var SettingsParser = heartbeat.network.SettingsParser;

    mixin(Network, deferrable);
    mixin(Network, logger);

    function Network(serializer) {
        this._quietMode  = false;
        this._isConfigured = false;
        this._serializer = serializer;
        this._trackingServer = null;
        this._checkStatusServer = null;
        this._jobId = null;

        // We register as observers to various heartbeat events.
        NotificationCenter().addEventListener(DataEvent.DATA_RESPONSE, this._onDataResponse, this);
        NotificationCenter().addEventListener(ApiEvent.API_CONFIG, this._onApiConfig, this);
        NotificationCenter().addEventListener(ContextEvent.CONTEXT_DATA_AVAILABLE, this._onContextDataAvailable, this);
        NotificationCenter().addEventListener(ClockEvent["CLOCK_CHECK_STATUS_TICK"], this._onClockCheckStatusTick, this);

        // Activate logging for this class.
        this.enableLogging('[heartbeat::Network] > ');
    }

    //
    //--------------------[ Public API ]--------------------
    //
    Network.prototype.destroy = function() {
        this.log("#destroy()");

        // Detach from the notification center.
        NotificationCenter().removeAllListeners(this);
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

        // Obtain the serialized payload.
        var report = e.data[EventKeyName.REPORT];
        var payloads = this._serializer.serializeReport(report);

        // We only send the request over the wire if tracking-local flag is not switched on.
        for (var i = 0; i < payloads.length; i++) {
            var payload = payloads[i];

            // Create and send the request.
            var url = this._trackingServer + "/?__job_id=" + this._jobId + "&" + payload;
            var req = new URLRequest(url, URLRequestMethod.GET);

            this.info("_onContextDataAvailable() > " + req.url);

            var loader = new URLLoader();

            (function(loader, self) {
                function onSuccess(e) {
                    loader.close();
                }

                function  onError(e) {
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
    };

    Network.prototype._onClockCheckStatusTick = function(e) {
        // If we are not configured, we do nothing.
        if (!this._isConfigured) {
            this.warn("#_onClockCheckStatusTick() > Unable to send request: not configured.");
            return;
        }

        function onSuccess(e) {
            if (e.data) {
                new SettingsParser(e.data.response).parse();
            }

            e.data[URLLoader.INSTANCE].close();
        }

        var self = this;
        function  onError(e) {
            self.warn('_onClockCheckStatusTick() > Failed to obtain the config. settings: ' + JSON.stringify(e));
            e.data[URLLoader.INSTANCE].close();
        }

        this._deferred = function(response) {
            var publisher = response[EventKeyName.PUBLISHER];

            // Fast exit.
            if (!publisher) {
                this.warn("#_onClockCheckStatusTick() > Publisher is NULL.");
                return;
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
        };

        // Issue a data request: the current value of the main-video publisher.
        var eventData = {};
        eventData[EventKeyName.WHAT] = DataEvent.keys.MAIN_VIDEO_PUBLISHER;
        NotificationCenter().dispatchEvent(new DataEvent(DataEvent.DATA_REQUEST, eventData));
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
    Counters.prototype.getTotalCount = function(eventType, assetId, assetType) {
        var key = assetId + "." + assetType + "." + eventType;

        this._totalCount[key] || (this._totalCount[key] = 0);

        this.log("#getTotalCount(key=" + key + ")");

        return this._totalCount[key];
    };

    Counters.prototype.incrementTotalCount = function(eventType, assetId, assetType) {
        var key = assetId + "." + assetType + "." + eventType;

        this._totalCount[key] || (this._totalCount[key] = 0);

        this.log("#incrementTotalCount(key=" + key + ")");

        this._totalCount[key] ++;
    };

    Counters.prototype.getTotalDuration = function(eventType, assetId, assetType) {
        var key = assetId + "." + assetType + "." + eventType;

        this._totalDuration[key] || (this._totalDuration[key] = 0);

        this.log("#getTotalDuration(key=" + key + ")");

        return this._totalDuration[key];
    };

    Counters.prototype.increaseTotalDuration = function(eventType, assetId, assetType, amount) {
        var key = assetId + "." + assetType + "." + eventType;

        this._totalDuration[key] || (this._totalDuration[key] = 0);

        this.log("#increaseTotalDuration(" +
            "key=" + key +
            ", amount=" + amount +
            ")");

        this._totalDuration[key] += amount;
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
    // -------------------[ Private helper methods ]-----------------------
    //
    History.prototype._computeItemKey = function(timelineItem) {
        var assetData = timelineItem.assetData;
        var assetId = assetData.adData() ? assetData.adData().adId()
                                         : assetData.videoId();

        return assetId + "." + assetData.type() + "." + timelineItem.eventType;
    };

    //
    // -------------------[ Public methods ]-----------------------
    //
    History.prototype.updateWith = function(timelineItem) {
        var key = this._computeItemKey(timelineItem);

        this.log("#updateWith(key=" + key + ")");

        this._items[key] = timelineItem;
    };

    History.prototype.getPreviousItemOfSameTypeWith = function(timelineItem) {
        var key = this._computeItemKey(timelineItem);

        this.log("#getPreviousItemOfSameTypeWith(key=" + key + ")");

        return this._items[key];
    };


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
        this.eventType = eventType;
        this.qosData = qosData;
        this.playhead = playhead;
        this.prevItemOfSameType = undefined;
    }

    //
    // -------------------[ Public methods ]-----------------------
    //
    TimelineItem.prototype.getAssetId = function() {
        // For ACTIVE events we always consider the asset id to be the id of the main video.
        if (this.eventType === EventDao.EVENT_TYPE_ACTIVE) {
            return this.assetData.videoId();
        }

        return (this.assetData.type() === AssetDao.TYPE_AD) ? this.assetData.adData().adId()
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

    function Timeline() {
        this._timeline = [];
    }

    //
    // -------------------[ Public methods ]-----------------------
    //
    Timeline.prototype.getTimelineItems = function() {
        return this._timeline.slice();
    };

    Timeline.prototype.addItem = function(timelineItem) {
        var pos = -1;

        // Insert the items to keep the item list sorted by their timestamp.
        for (var i = this._timeline.length - 1; i >= 0; i--) {
            if (timelineItem.timestamp >= this._timeline[i].timestamp) {
                break;
            }

            pos = i;
        }

        (pos > 0) ? this._timeline.splice(i, 0, timelineItem)
                  : this._timeline.push(timelineItem);
    };

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
    var TimelineItem = heartbeat.context.TimelineItem;

    mixin(ReporterHelper, logger);
    function ReporterHelper(context) {
        this._context = context;
        this._lastQuantTimeStamp = null;

        // Activate logging for this class.
        this.enableLogging('[heartbeat::ReporterHelper] > ');
    }

    //
    // -------------------[ Private helper methods ]-----------------------
    //
    ReporterHelper.prototype._computeQuantTimeStamp = function(startTime, endTime, trackingInterval) {
        var trackingIntervalMs = trackingInterval * 1000;
        var quantTimeStamp;

        if (startTime.getTime() === 0) {
            quantTimeStamp = endTime.getTime() - trackingIntervalMs / 2;
        } else {
            quantTimeStamp = startTime.getTime() / 2 + endTime.getTime() / 2;
        }

        quantTimeStamp = Math.floor(quantTimeStamp / trackingIntervalMs) * trackingIntervalMs;

        if (this._lastQuantTimeStamp == quantTimeStamp) {
            quantTimeStamp += trackingIntervalMs;
        }
        this._lastQuantTimeStamp = quantTimeStamp;

        return new Date(quantTimeStamp);
    };

    ReporterHelper.prototype._buildReportEntryForItem = function(timelineItem, eventDuration, trackingInterval) {
        var counters = this._context._counters,
            eventType = timelineItem.eventType,
            assetId = timelineItem.getAssetId(),
            assetType = timelineItem.assetData.type();

        var playhead = (eventType === EventDao.EVENT_TYPE_START) ? 0 : timelineItem.playhead;

        // Update the global counters.
        counters.incrementTotalCount(eventType, assetId, assetType);
        counters.increaseTotalDuration(eventType, assetId, assetType, eventDuration);

        // Set the event data.
        var eventData = new EventDao(trackingInterval);
        eventData.type(eventType);
        eventData.count(timelineItem.getEventCount());
        eventData.duration(eventDuration);
        eventData.totalCount(counters.getTotalCount(eventType, assetId, assetType));
        eventData.totalDuration(counters.getTotalDuration(eventType, assetId, assetType));
        eventData.playhead(playhead);

        // Set the timestamp values.
        eventData.ts(timelineItem.timestamp.getTime());
        var prevTs = timelineItem.prevItemOfSameType
            ? timelineItem.prevItemOfSameType.timestamp.getTime()
            : -1;
        eventData.prevTs(prevTs);

        // Build the report entry.
        return new ReportEntry(eventData,
            timelineItem.assetData,
            timelineItem.userData,
            timelineItem.streamData,
            timelineItem.qosData);
    };

    ReporterHelper.prototype._addPresenceEventToReport = function(report, trackingInterval, quantTimeStamp) {
        if (!report.reportEntries.length)
            return;

        // Create a new instance of the AssetDao.
        // Take a snapshot of the current instance maintained by the Context sub-module
        // but exclude the ad-related info.
        var noAdInfoAssetData = new AssetDao(this._context._assetData);
        noAdInfoAssetData.type(this._context._mainAssetType);
        noAdInfoAssetData.adData(null);

        var presenceItem = new TimelineItem(noAdInfoAssetData,
            this._context._userData,
            this._context._streamData,
            this._context._qosData,
            EventDao.EVENT_TYPE_ACTIVE,
            this._context._offset[this._context._assetData.videoId()]);
        presenceItem.prevItemOfSameType = this._context._history.getPreviousItemOfSameTypeWith(presenceItem);
        this._context._history.updateWith(presenceItem);

        report.addEntry(this._buildReportEntryForItem(presenceItem, trackingInterval * 1000, trackingInterval));

        // Overwrite the all event date-time values.
        if (quantTimeStamp != null) {
            for (var i = 0; i < report.reportEntries.length; i++) {
                report.reportEntries[i].eventData.tsAsDate(quantTimeStamp);
            }
        }
    };

    ReporterHelper.prototype._timeSpanMs = function(startTime, endTime) {
        return endTime.getTime() - startTime.getTime();
    };

    //
    // -------------------[ Public methods ]-----------------------
    //
    ReporterHelper.prototype.createReportForItem = function(timelineItem, trackingInterval, usePresenceEvent) {
        var report = new Report(this._context._siteCatalystData,
            this._context._serviceProviderData,
            this._context._sessionData);

        report.addEntry(this._buildReportEntryForItem(timelineItem, 0, trackingInterval));

        // AddPresence event (if required)
        if (usePresenceEvent) {
            this._addPresenceEventToReport(report, trackingInterval, null);
        }

        return report;
    };

    ReporterHelper.prototype.createReportForQuantum = function(startTime, endTime, trackingInterval) {
        var assetId;

        var reportEntry;
        var report = new Report(this._context._siteCatalystData,
            this._context._serviceProviderData,
            this._context._sessionData);

        var timelineItems = this._context._timeline.getTimelineItems();

        var selectedTimelineItems = [],
            lastTimelineItem = null,
            i = 0, j = 0;

        // Browse the timeline and search for the items that are in the current target interval.
        for(i = 0; i < timelineItems.length; i ++) {
            var timelineItem = timelineItems[i];
            if ( (timelineItem.timestamp > startTime) &&
                (timelineItem.timestamp <= endTime) ) {
                selectedTimelineItems.push(timelineItem);
            }

            // Also remember the index of the last item in the previous quantum.
            if (timelineItem.timestamp <= startTime) {
                lastTimelineItem = timelineItem;
            }
        }

        this.log('#createReportForQuantum() > -------------TRACK REPORT----------------');
        this.log('#createReportForQuantum() > Interval: [' + startTime.getTime() + ' , ' + endTime.getTime() + ']. Tracking interval: ' + trackingInterval);
        this.log('#createReportForQuantum() > -----------------------------------------');
        for (i = 0; i < timelineItems.length; i ++) {
            this.log('#createReportForQuantum() > [' + timelineItems[i].timestamp.getTime() + '] :' + timelineItems[i].eventType + ' | ' + timelineItems[i].assetData.type());
        }
        this.log('#createReportForQuantum() > -----------------------------------------');
        for (i = 0; i < selectedTimelineItems.length; i ++) {
            this.log('#createReportForQuantum() > [' + selectedTimelineItems[i].timestamp.getTime() + '] :' + selectedTimelineItems[i].eventType + ' | ' + selectedTimelineItems[i].assetData.type());
        }
        this.log('#createReportForQuantum() > -----------------------------------------');

        // Update the last time-line item.
        if (lastTimelineItem) {
            // Update the timestamps.
            if (lastTimelineItem.prevItemOfSameType) {
                lastTimelineItem.prevItemOfSameType.timestamp = lastTimelineItem.timestamp;
            }

            lastTimelineItem.timestamp = new Date(startTime.getTime() + 1);

            // Update the playhead.
            assetId = lastTimelineItem.assetData.adData() ? lastTimelineItem.assetData.adData().adId()
                : lastTimelineItem.assetData.videoId();
            lastTimelineItem.playhead = this._context._offset[assetId];
        }

        // If we could not find any event in the current quantum,
        // we are dealing with a "quiet" interval.
        if (!selectedTimelineItems.length) {
            if (lastTimelineItem) {
                report.addEntry(this._buildReportEntryForItem(lastTimelineItem,
                    this._timeSpanMs(startTime, endTime),
                    trackingInterval));
            }
        } else {
            var eventDuration = 0;

            // We need to add to the report the last part of the previous event.
            if (lastTimelineItem) {
                // Compute the event duration.
                if ((lastTimelineItem.eventType === EventDao.EVENT_TYPE_START) &&
                    (lastTimelineItem.assetData.type() !== AssetDao.TYPE_AD)) {
                    eventDuration = this._timeSpanMs(lastTimelineItem.timestamp, selectedTimelineItems[0].timestamp);
                } else {
                    eventDuration = this._timeSpanMs(startTime, selectedTimelineItems[0].timestamp);
                }

                report.addEntry(this._buildReportEntryForItem(lastTimelineItem, eventDuration, trackingInterval));
            }

            // Add to the report the events corresponding to the selected timeline items.
            for (i = 0; i < selectedTimelineItems.length; i++) {
                var currentItem = selectedTimelineItems[i];

                // Compute the event duration.
                if (i == selectedTimelineItems.length - 1) {
                    eventDuration = this._timeSpanMs(currentItem.timestamp, endTime);
                } else {
                    var nextItem = selectedTimelineItems[i + 1];
                    eventDuration = this._timeSpanMs(currentItem.timestamp, nextItem.timestamp);
                }

                // Compress all the timeline items with the same event type into a single report entry.
                var isAlreadyAdded = false;

                var reportEntries = report.reportEntries;
                for (j = 0; j < reportEntries.length; j++) {
                    reportEntry = reportEntries[j];

                    // Check if another timeline item with the same coordinates
                    // was previously added to the output report.
                    if (currentItem.assetData.type() === reportEntry.assetData.type() &&
                        currentItem.eventType === reportEntry.eventData.type()) {
                        // If we are dealing with an ad.
                        if (currentItem.assetData.type() === AssetDao.TYPE_AD) {
                            isAlreadyAdded = (reportEntry.assetData.adData().adId() === currentItem.assetData.adData().adId());
                        }
                        // If we are dealing with the main content.
                        else {
                            isAlreadyAdded = reportEntry.assetData.videoId() === currentItem.assetData.videoId();
                        }
                    }

                    // If another timeline item with the same coordinates
                    // was previously added in the output report, just update the
                    // data associated to the corresponding report entry.
                    if (isAlreadyAdded) {
                        var eventData = reportEntry.eventData,
                            assetType = reportEntry.assetData.type();

                        assetId = reportEntry.assetData.adData() ? reportEntry.assetData.adData().adId()
                            : reportEntry.assetData.videoId();

                        // Update the total counters.
                        var counters = this._context._counters;
                        counters.incrementTotalCount(eventData.type(), assetId, assetType);
                        counters.increaseTotalDuration(eventData.type(), assetId, assetType, eventDuration);

                        // Update this report entry with the latest QoS info.
                        reportEntry.qosData = currentItem.qosData;

                        // Update the event data already present in this report entry.
                        eventData.playhead(this._context._offset[assetId]);
                        eventData.duration(eventData.duration() + eventDuration);
                        eventData.totalCount(counters.getTotalCount(eventData.type(), assetId, assetType));
                        eventData.totalDuration(counters.getTotalDuration(eventData.type(), assetId, assetType));
                        eventData.ts(currentItem.timestamp.getTime());

                        // We're done - process the next selected timeline item.
                        break;
                    }
                }

                // If the timeline item was not already added in the output report, add it now.
                if (!isAlreadyAdded) {
                    this.log("#createReportForQuantum() > Adding event to report: " + currentItem.eventType);

                    assetId = currentItem.assetData.adData() ? currentItem.assetData.adData().adId()
                        : currentItem.assetData.videoId();
                    currentItem.playhead = this._context._offset[assetId];

                    report.addEntry(this._buildReportEntryForItem(currentItem, eventDuration, trackingInterval));
                }
            }
        }

        // Discard pause events.
        report.discardPauseEvents();

        // Add the presence event.
        var quantTimeStamp = this._computeQuantTimeStamp(startTime, endTime, trackingInterval);
        this._addPresenceEventToReport(report, trackingInterval, quantTimeStamp);

        this.log("#createReportForQuantum() > Final report ----- START -----");
        for (i = 0; i < report.reportEntries.length; i ++) {
            reportEntry = report.reportEntries[i];
            var _eventData = reportEntry.eventData;
            assetId = reportEntry.assetData.adData() ? reportEntry.assetData.adData().adId()
                : reportEntry.assetData.videoId();

            this.log('#createReportForQuantum() > Final report [' + _eventData.ts() + "/" + _eventData.prevTs() + '] :' + _eventData.type() + ' | type='
                + reportEntry.assetData.type() + ', name=' + assetId + ', duration=' + _eventData.duration()
                + ', playhead=' + _eventData.playhead());
        }
        this.log("#createReportForQuantum() > Final report ----- END -----");

        return report;
    };

    // Export symbols.
    heartbeat.context.ReporterHelper = ReporterHelper;
})(core, heartbeat);

(function(core, heartbeat, va) {
    'use strict';

    var mixin = core.mixin;
    var deferrable = core.deferrable;
    var logger = core.logger;
    var NotificationCenter = core.NotificationCenter;
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

    var ERROR_SOURCE_PLAYER = "player";

    mixin(Context, deferrable);
    mixin(Context, logger);

    function Context() {
        this._isViewingSessionActive = false;
        this._isVideoClosed = false;
        this._mainAssetType = null;
        this._blockExternalErrorTracking = false;
        this._podOffset = null;
        this._activeAssetName = null;

        this._config = {
            streamType: null,
            publisher: null
        };

        this._deferred = null;
        this._timestampOfLastReport = null;
        this._offset = {};

        this._reporterHelper = new ReporterHelper(this);
        this._timeline = new Timeline();
        this._history = new History();

        this._sessionData = new SessionDao();
        this._siteCatalystData = new SiteCatalystDao();
        this._serviceProviderData = new ServiceProviderDao();
        this._assetData = new AssetDao();
        this._userData = new UserDao();
        this._streamData = new StreamDao();
        this._qosData = new QoSDao();
        this._counters = new Counters();

        // We register as observers to various heartbeat events.
        NotificationCenter().addEventListener(ApiEvent.API_CONFIG, this._onApiConfig, this);
        NotificationCenter().addEventListener(ApiEvent.API_OPEN_MAIN, this._onApiOpenMain, this);
        NotificationCenter().addEventListener(ApiEvent.API_OPEN_AD, this._onApiOpenAd, this);
        NotificationCenter().addEventListener(ApiEvent.API_CLOSE, this._onApiClose, this);
        NotificationCenter().addEventListener(ApiEvent.API_PLAY, this._onApiPlay, this);
        NotificationCenter().addEventListener(ApiEvent.API_STOP, this._onApiStop, this);
        NotificationCenter().addEventListener(ApiEvent.API_CLICK, this._onApiClick, this);
        NotificationCenter().addEventListener(ApiEvent.API_COMPLETE, this._onApiComplete, this);
        NotificationCenter().addEventListener(ApiEvent.API_QOS_INFO, this._onApiQoSInfo, this);
        NotificationCenter().addEventListener(ApiEvent.API_BITRATE_CHANGE, this._onApiBitrateChange, this);
        NotificationCenter().addEventListener(ApiEvent.API_BUFFER_START, this._onApiBufferStart, this);
        NotificationCenter().addEventListener(ApiEvent.API_TRACK_ERROR, this._onApiTrackError, this);
        NotificationCenter().addEventListener(ApiEvent.API_POD_OFFSET, this._onApiPodOffset, this);
        NotificationCenter().addEventListener(ApiEvent.API_SESSION_COMPLETE, this._onApiSessionComplete, this);

        NotificationCenter().addEventListener(ClockEvent["CLOCK_MONITOR_UPDATE"], this._onClockMonitorUpdate, this);
        NotificationCenter().addEventListener(ClockEvent["CLOCK_TRACKING_TICK"], this._onClockTrackingTick, this);

        NotificationCenter().addEventListener(NetworkEvent.NETWORK_CHECK_STATUS_COMPLETE, this._onNetworkCheckStatusComplete, this);

        NotificationCenter().addEventListener(DataEvent.DATA_REQUEST, this._onDataRequest, this);
        NotificationCenter().addEventListener(DataEvent.DATA_RESPONSE, this._onDataResponse, this);

        // Activate logging for this class.
        this.enableLogging('[heartbeat::Context] > ');
    }


    //
    //--------------------[ Public API ]--------------------
    //
    Context.prototype.destroy = function() {
        this.log("#destroy()");

        this._resetInternalState();

        // Detach from the notification center.
        NotificationCenter().removeAllListeners(this);
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

        this._config.publisher = info[EventKeyName.PUBLISHER];

        this._serviceProviderData.ovp(info[EventKeyName.OVP]);
        this._serviceProviderData.sdk(info[EventKeyName.SDK]);
        this._serviceProviderData.channel(info[EventKeyName.CHANNEL]);
        this._serviceProviderData.libVersion(Version.getVersion());

        // The "check-status" timer must be activated.
        NotificationCenter().dispatchEvent(new ClockEvent(ClockEvent["CLOCK_CHECK_STATUS_ENABLE"]));
    };

    Context.prototype._onApiOpenMain = function(e) {
        var info = e.data;

        this.log("#_onApiOpenMain(" +
            "name=" + info[EventKeyName.NAME] +
            ", length=" + info[EventKeyName.LENGTH] +
            ", type=" + info[EventKeyName.STREAM_TYPE] +
            ", player_name=" + info[EventKeyName.PLAYER_NAME] +
            ", vid=" + info[EventKeyName.VISITOR_ID] +
            ", aid=" + info[EventKeyName.ANALYTICS_VISITOR_ID] +
            ", mid=" + info[EventKeyName.MARKETING_CLOUD_VISITOR_ID] +
            ")");

        this._resetInternalState();

        this._activeAssetName = info[EventKeyName.NAME];
        this._offset[this._activeAssetName] = 0;

        this._serviceProviderData.playerName(info[EventKeyName.PLAYER_NAME]);

        this._userData.visitorId(info[EventKeyName.VISITOR_ID]);
        this._userData.analyticsVisitorId(info[EventKeyName.ANALYTICS_VISITOR_ID]);
        this._userData.marketingCloudVisitorId(info[EventKeyName.MARKETING_CLOUD_VISITOR_ID]);

        this._assetData.videoId(this._activeAssetName);
        this._assetData.duration(info[EventKeyName.LENGTH]);
        this._assetData.type(info[EventKeyName.STREAM_TYPE]);

        this._mainAssetType = this._assetData.type();

        this._streamData.name(this._activeAssetName);

        // Generate a new session ID value.
        this._generateSessionId();

        // Reset the main video counters.
        this._counters.resetCounters(this._activeAssetName, this._mainAssetType);

        // The "tracking" timer must be activated.
        var eventData = {};
        eventData[EventKeyName.RESET] = true;
        NotificationCenter().dispatchEvent(new ClockEvent(ClockEvent["CLOCK_TRACKING_ENABLE"], eventData));

        // Send the first LOAD event immediately (out-of-band).
        // Defer the broadcasting of the CONTEXT_DATA_AVAILABLE event until
        // we obtain the value of the tracking-timer interval.
        this._deferred = function(response) {
            var trackingInterval = response[EventKeyName.TIMER_INTERVAL];

            var loadItem = new TimelineItem(this._assetData,
                this._userData,
                this._streamData,
                this._qosData,
                EventDao.EVENT_TYPE_LOAD, 0);
            loadItem.prevItemOfSameType = this._history.getPreviousItemOfSameTypeWith(loadItem);

            // Update the history data.
            this._history.updateWith(loadItem);

            var report = this._reporterHelper.createReportForItem(loadItem, trackingInterval, true);

            // Issue a CONTEXT_DATA_AVAILABLE event.
            var eventData = {};
            eventData[EventKeyName.REPORT] = report;
            NotificationCenter().dispatchEvent(new ContextEvent(ContextEvent.CONTEXT_DATA_AVAILABLE, eventData));
        };

        // Issue a data request: the current value of the tracking-timer interval.
        eventData = {};
        eventData[EventKeyName.WHAT] = DataEvent.keys.TRACKING_TIMER_INTERVAL;
        NotificationCenter().dispatchEvent(new DataEvent(DataEvent.DATA_REQUEST, eventData));

        // Place the START event on the timeline in order to be able to collect the start up time.
        var startItem = new TimelineItem(this._assetData,
            this._userData,
            this._streamData,
            this._qosData,
            EventDao.EVENT_TYPE_START, 0);
        startItem.prevItemOfSameType = this._history.getPreviousItemOfSameTypeWith(startItem);
        this._placeItemOnTimeline(startItem);

        this._isViewingSessionActive = true;
    };

    Context.prototype._onApiOpenAd = function(e) {
        if (!this._isViewingSessionActive) {
            this.warn("#_onApiOpenAd() > No active viewing session.");
            return;
        }

        this.info('Call detected: onApiOpenAd().');

        var info = e.data;

        this.log(this, "#_onApiOpenAd(" +
            "name=" + info[EventKeyName.NAME] +
            ", length=" + info[EventKeyName.LENGTH] +
            ", player_name=" + info[EventKeyName.PLAYER_NAME] +
            ", parent_name=" + info[EventKeyName.PARENT_NAME] +
            ", pod_pos=" + info[EventKeyName.PARENT_POD_POSITION] +
            ", pod_offset=" + info[EventKeyName.PARENT_POD_OFFSET] +
            ", cpm=" + info[EventKeyName.CPM] +
            ")");

        // Set the video ID (if not already set).
        if (!this._assetData.videoId()) {
            this._assetData.videoId(info[EventKeyName.PARENT_NAME]);
        }

        this._activeAssetName = info[EventKeyName.NAME];
        this._offset[this._activeAssetName] = 0;

        // Set-up the ad-data associated to the current ad.
        var adData = new AdDao();
        adData.adId(this._activeAssetName);
        adData.length(info[EventKeyName.LENGTH]);
        adData.resolver(info[EventKeyName.PLAYER_NAME]);
        adData.cpm(info[EventKeyName.CPM]);
        adData.podId(info[EventKeyName.PARENT_POD]);
        adData.podSecond(this._podOffset);
        adData.podPosition(info[EventKeyName.PARENT_POD_POSITION] + "");

        this._assetData.adData(adData);

        // The asset type is now AD.
        this._assetData.type(AssetDao.TYPE_AD);

        // Reset the ad counters.
        this._counters.resetCounters(this._activeAssetName, AssetDao.TYPE_AD);

        // Place the START event on the timeline.
        var startItem = new TimelineItem(this._assetData,
            this._userData,
            this._streamData,
            this._qosData,
            EventDao.EVENT_TYPE_START, 0);
        startItem.prevItemOfSameType = this._history.getPreviousItemOfSameTypeWith(startItem);
        this._placeItemOnTimeline(startItem);

        // Place the PLAY event on the timeline.
        var playItem = new TimelineItem(this._assetData,
            this._userData,
            this._streamData,
            this._qosData,
            EventDao.EVENT_TYPE_PLAY,
            this._offset[this._activeAssetName]);
        playItem.prevItemOfSameType = this._history.getPreviousItemOfSameTypeWith(playItem);
        this._placeItemOnTimeline(playItem);
    };

    Context.prototype._onApiClose = function(e) {
        if (!this._isViewingSessionActive) {
            this.warn("#_onApiClose() > No active viewing session.");
            return;
        }

        var assetId = e.data[EventKeyName.NAME];

        this.log("#_onApiClose(name="+ assetId +")");

        // Close the main video.
        if (assetId === this._assetData.videoId()) {
            this._closeMainVideo();
        }
        // Close the ad.
        else {
            this._closeAd();
        }
    };

    Context.prototype._onApiPlay = function(e) {
        if (!this._isViewingSessionActive) {
            this.warn("#_onApiPlay() > No active viewing session.");
            return;
        }

        var info = e.data;

        this.log("#_onApiPlay(" +
            "name="+ info[EventKeyName.NAME] +
            ", offset="+ info[EventKeyName.OFFSET] +
            ", vid="+ info[EventKeyName.VISITOR_ID] +
            ", aid="+ info[EventKeyName.ANALYTICS_VISITOR_ID] +
            ", mid="+ info[EventKeyName.MARKETING_CLOUD_VISITOR_ID] +
            ")");

        // Do not start playback if the main content has been previously closed.
        if (info[EventKeyName.NAME] == this._assetData.videoId && this._isVideoClosed)
            return;

        // Update the context data.
        this._userData.visitorId(info[EventKeyName.VISITOR_ID]);
        this._userData.analyticsVisitorId(info[EventKeyName.ANALYTICS_VISITOR_ID]);
        this._userData.marketingCloudVisitorId(info[EventKeyName.MARKETING_CLOUD_VISITOR_ID]);

        this._activeAssetName = info[EventKeyName.NAME];
        this._offset[this._activeAssetName] = Math.floor(info[EventKeyName.OFFSET]);

        // Tracking must be activated.
        NotificationCenter().dispatchEvent(new ClockEvent(ClockEvent["CLOCK_TRACKING_ENABLE"]));

        // Place the PLAY event on the timeline.
        var playItem = new TimelineItem(this._assetData,
            this._userData,
            this._streamData,
            this._qosData,
            EventDao.EVENT_TYPE_PLAY,
            this._offset[this._activeAssetName]);
        playItem.prevItemOfSameType = this._history.getPreviousItemOfSameTypeWith(playItem);
        this._placeItemOnTimeline(playItem);
    };

    Context.prototype._onApiStop = function(e) {
        if (!this._isViewingSessionActive) {
            this.warn("#_onApiStop() > No active viewing session.");
            return;
        }

        var info = e.data;

        this.log("#_onApiStop(" +
            "name="+ info[EventKeyName.NAME] +
            ", offset="+ info[EventKeyName.OFFSET] +
            ")");

        // Update the context data.
        this._activeAssetName = info[EventKeyName.NAME];
        this._offset[this._activeAssetName] = Math.floor(info[EventKeyName.OFFSET]);

        // Place the PAUSE event on the timeline.
        var pauseItem = new TimelineItem(this._assetData,
            this._userData,
            this._streamData,
            this._qosData,
            EventDao.EVENT_TYPE_PAUSE,
            this._offset[this._activeAssetName]);
        pauseItem.prevItemOfSameType = this._history.getPreviousItemOfSameTypeWith(pauseItem);
        this._placeItemOnTimeline(pauseItem);

        // Tracking must be deactivated.
        NotificationCenter().dispatchEvent(new ClockEvent(ClockEvent["CLOCK_TRACKING_DISABLE"]));
    };

    Context.prototype._onApiClick = function(e) {
        if (!this._isViewingSessionActive) {
            this.warn("#_onApiClick() > No active viewing session.");
            return;
        }

        var info = e.data;

        this.log("#_onApiClick(" +
            "name="+ info[EventKeyName.NAME] +
            ", offset="+ info[EventKeyName.OFFSET] +
            ")");

        // Not implemented.
    };

    Context.prototype._onApiComplete = function(e) {
        if (!this._isViewingSessionActive) {
            this.warn("#_onApiComplete() > No active viewing session.");
            return;
        }

        var info = e.data;

        this.log("#_onApiComplete(" +
            "name="+ info[EventKeyName.NAME] +
            ", offset="+ info[EventKeyName.OFFSET] +
            ")");

        // Not implemented.
    };

    Context.prototype._onApiQoSInfo = function(e) {
        if (!this._isViewingSessionActive) {
            this.warn("#_onApiQoSInfo() > No active viewing session.");
            return;
        }

        var info = e.data;

        this.log("#_onApiQoSInfo(" +
            "bitrate="+ info[EventKeyName.NAME] +
            ", fps="+ info[EventKeyName.FPS] +
            ", dropped_frames="+ info[EventKeyName.DROPPED_FRAMES] +
            ")");

        // Update the QoS data.
        this._qosData.bitrate(info[EventKeyName.BITRATE]);
        this._qosData.fps(info[EventKeyName.FPS]);
        this._qosData.droppedFrames(info[EventKeyName.DROPPED_FRAMES]);
    };

    Context.prototype._onApiBitrateChange = function(e) {
        if (!this._isViewingSessionActive) {
            this.warn("#_onApiBitrateChange() > No active viewing session.");
            return;
        }

        var info = e.data;

        this.log("#_onApiBitrateChange(bitrate="+ info[EventKeyName.NAME] + ")");

        // Update the QoS data.
        this._qosData.bitrate(info[EventKeyName.BITRATE]);

        // We need to prepare a tracking report just with the bitrate-change event.
        var bitrateChangeItem = new TimelineItem(this._assetData,
            this._userData,
            this._streamData,
            this._qosData,
            EventDao.EVENT_TYPE_BITRATE_CHANGE,
            this._offset[this._activeAssetName]);
        bitrateChangeItem.prevItemOfSameType = this._history.getPreviousItemOfSameTypeWith(bitrateChangeItem);

        // Update the history data.
        this._history.updateWith(bitrateChangeItem);

        // Send the BITRATE_CHANGE event immediately (out-of-band).
        // Defer the broadcasting of the CONTEXT_DATA_AVAILABLE event until
        // we obtain the value of the tracking-timer interval.
        this._deferred = function(response) {
            var trackingInterval = response[EventKeyName.TIMER_INTERVAL],
                report = this._reporterHelper.createReportForItem(bitrateChangeItem, trackingInterval, false);

            // Issue a CONTEXT_DATA_AVAILABLE event.
            var eventData = {};
            eventData[EventKeyName.REPORT] = report;
            NotificationCenter().dispatchEvent(new ContextEvent(ContextEvent.CONTEXT_DATA_AVAILABLE, eventData));
        };

        // Issue a data request: the current value of the tracking-timer interval.
        var eventData = {};
        eventData[EventKeyName.WHAT] = DataEvent.keys.TRACKING_TIMER_INTERVAL;
        NotificationCenter().dispatchEvent(new DataEvent(DataEvent.DATA_REQUEST, eventData));
    };

    Context.prototype._onApiBufferStart = function(e) {
        if (!this._isViewingSessionActive) {
            this.warn("#_onApiBufferStart() > No active viewing session.");
            return;
        }

        this.log("#_onApiBufferStart()");

        var bufferStartItem = new TimelineItem(this._assetData,
            this._userData,
            this._streamData,
            this._qosData,
            EventDao.EVENT_TYPE_BUFFER,
            this._offset[this._activeAssetName]);
        bufferStartItem.prevItemOfSameType = this._history.getPreviousItemOfSameTypeWith(bufferStartItem);
        this._placeItemOnTimeline(bufferStartItem);
    };

    Context.prototype._onApiTrackError = function(e) {
        if (!this._isViewingSessionActive) {
            this.warn("#_onApiTrackError() > No active viewing session.");
            return;
        }

        var info = e.data;

        this.log("#_onApiTrackError(" +
            "source="+ info[EventKeyName.SOURCE] +
            ", err_id="+ info[EventKeyName.ERROR_ID] +
            ", offset="+ info[EventKeyName.OFFSET] +
            ")");

        // If external error tracking is disabled, we must skip
        // the error reports issued by the application layer.
        if (this._blockExternalErrorTracking && info[EventKeyName.SOURCE] !== ERROR_SOURCE_PLAYER) {
            return;
        }

        // We need to prepare a tracking report just with the error event.
        var errorItem = new TimelineItem(this._assetData,
            this._userData,
            this._streamData,
            this._qosData,
            EventDao.EVENT_TYPE_ERROR,
            Math.floor(info[EventKeyName.OFFSET]));
        errorItem.prevItemOfSameType = this._history.getPreviousItemOfSameTypeWith(errorItem);

        // Update the history data.
        this._history.updateWith(errorItem);

        // Send the ERROR event immediately (out-of-band).
        // Defer the broadcasting of the CONTEXT_DATA_AVAILABLE event until
        // we obtain the value of the tracking-timer interval.
        this._deferred = function(response) {
            var trackingInterval = response[EventKeyName.TIMER_INTERVAL],
                report = this._reporterHelper.createReportForItem(errorItem, trackingInterval, false);

            // We need to set the error id and error source for the error report.
            var reportEntry = report.reportEntries[0];
            reportEntry.eventData.id(info[EventKeyName.ERROR_ID]);
            reportEntry.eventData.source(info[EventKeyName.SOURCE]);

            // Issue a CONTEXT_DATA_AVAILABLE event.
            var eventData = {};
            eventData[EventKeyName.REPORT] = report;
            NotificationCenter().dispatchEvent(new ContextEvent(ContextEvent.CONTEXT_DATA_AVAILABLE, eventData));
        };

        // Issue a data request: the current value of the tracking-timer interval.
        var eventData = {};
        eventData[EventKeyName.WHAT] = DataEvent.keys.TRACKING_TIMER_INTERVAL;
        NotificationCenter().dispatchEvent(new DataEvent(DataEvent.DATA_REQUEST, eventData));
    };

    Context.prototype._onApiPodOffset = function(e) {
        if (!this._isViewingSessionActive) {
            this.warn("#_onApiPodOffset() > No active viewing session.");
            return;
        }

        this._podOffset = Math.floor(e.data[EventKeyName.PARENT_POD_OFFSET]);

        this.log("#_onApiPodOffset(podOffset=" + this._podOffset + ")");
    };

    Context.prototype._onApiSessionComplete = function(e) {
        if (!this._isViewingSessionActive) {
            this.warn("#_onApiSessionComplete() > No active viewing session.");
            return;
        }

        this.log("#_onApiSessionComplete()");

        // Place the UNLOAD event in the timeline.
        var unloadItem = new TimelineItem(this._assetData,
            this._userData,
            this._streamData,
            this._qosData,
            EventDao.EVENT_TYPE_UNLOAD, 0);
        unloadItem.prevItemOfSameType = this._history.getPreviousItemOfSameTypeWith(unloadItem);
        this._placeItemOnTimeline(unloadItem);

        // We need to send the last batch.
        // Defer the broadcasting of the CONTEXT_DATA_AVAILABLE event until
        // we obtain the value of the tracking-timer interval.
        this._deferred = function(response) {
            var trackingInterval = response[EventKeyName.TIMER_INTERVAL],
                startTime = this._timestampOfLastReport || new Date(0),
                endTime = new Date();

            // Create the last report.
            var report = this._reporterHelper.createReportForQuantum(startTime, endTime, trackingInterval);

            // Issue a CONTEXT_DATA_AVAILABLE event.
            var eventData = {};
            eventData[EventKeyName.REPORT] = report;
            NotificationCenter().dispatchEvent(new ContextEvent(ContextEvent.CONTEXT_DATA_AVAILABLE, eventData));

            // We need to keep track of the timestamp of the last tracking report sent
            // in order to avoid duplicates.
            this._timestampOfLastReport = endTime;
        };

        // Issue a data request: the current value of the tracking-timer interval.
        var eventData = {};
        eventData[EventKeyName.WHAT] = DataEvent.keys.TRACKING_TIMER_INTERVAL;
        NotificationCenter().dispatchEvent(new DataEvent(DataEvent.DATA_REQUEST, eventData));

        // Tracking must be deactivated.
        eventData = {};
        eventData[EventKeyName.RESET] = true;
        NotificationCenter().dispatchEvent(new ClockEvent(ClockEvent["CLOCK_TRACKING_DISABLE"], eventData));

        // The playback session is now complete.
        this._isViewingSessionActive = false;
    };

    Context.prototype._onClockMonitorUpdate = function(e) {
        if (!this._isViewingSessionActive) {
            this.warn("#_onClockMonitorUpdate() > No active viewing session.");
            return;
        }

        var info = e.data;

        this.log("#_onClockMonitorUpdate(" +
            "name="+ info[EventKeyName.NAME] +
            ", offset="+ info[EventKeyName.OFFSET] +
            ")");

        this._activeAssetName = info[EventKeyName.NAME];
        this._offset[this._activeAssetName] = Math.floor(e.data[EventKeyName.OFFSET]);
    };

    Context.prototype._onClockTrackingTick = function(e) {
        if (!this._isViewingSessionActive) {
            this.warn("#_onClockTrackingTick() > No active viewing session.");
            return;
        }

        this.log("#_onClockTrackingTick(interval=" + e.data[EventKeyName.TIMER_INTERVAL] + ")");

        var trackingInterval = e.data[EventKeyName.TIMER_INTERVAL],
            endTime = new Date(),
            startTime = this._timestampOfLastReport || new Date(0);

        // Create the report for the current quantum.
        var report = this._reporterHelper.createReportForQuantum(startTime, endTime, trackingInterval);

        // Issue a CONTEXT_DATA_AVAILABLE event.
        var eventData = {};
        eventData[EventKeyName.REPORT] = report;
        NotificationCenter().dispatchEvent(new ContextEvent(ContextEvent.CONTEXT_DATA_AVAILABLE, eventData));

        // Update the timestamp of the last generated report.
        this._timestampOfLastReport = endTime;
    };

    Context.prototype._onNetworkCheckStatusComplete = function(e) {
        this.log("#_onNetworkCheckStatusComplete(track_ext_err=" + e.data[EventKeyName.TRACK_EXTERNAL_ERRORS] + ")");

        var blockExternalErrorTracking = e.data[EventKeyName.TRACK_EXTERNAL_ERRORS];
        if (blockExternalErrorTracking !== null) {
            this._blockExternalErrorTracking = blockExternalErrorTracking;
        }
    };

    Context.prototype._onDataRequest = function(e) {
        var what = e.data[EventKeyName.WHAT];

        this.log("#_onDataRequest(what=" + what + ")");

        switch (what) {
            case DataEvent.keys.MAIN_VIDEO_PUBLISHER:
                var eventData = {};
                eventData[EventKeyName.PUBLISHER] = this._config.publisher;

                NotificationCenter().dispatchEvent(new DataEvent(DataEvent.DATA_RESPONSE, eventData));
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
    Context.prototype._resetInternalState = function() {
        this.log("#_resetInternalState()");

        this._isViewingSessionActive = false;
        this._isVideoClosed = false;
        this._mainAssetType = null;
        this._blockExternalErrorTracking = false;
        this._offset = {};
        this._podOffset = null;
        this._timestampOfLastReport = null;
        this._counters = new Counters();
        this._history = new History();
        this._timeline = new Timeline();
        this._userData = new UserDao();
        this._streamData = new StreamDao();
        this._qosData = new QoSDao();
        this._sessionData = new SessionDao();
        this._assetData = new AssetDao();

        this._assetData.publisher(this._config.publisher);
        this._assetData.type(this._config.streamType);
    };

    Context.prototype._generateSessionId = function() {
        this._sessionData.sessionId("" + new Date().getTime() + Math.floor(Math.random() * 1000000000));

        this.log("#_generateSessionId() > New session id: " + this._sessionData.sessionId());
    };

    Context.prototype._placeItemOnTimeline = function(timelineItem) {
        this.log("#_placeItemOnTimeline(type=" + timelineItem.eventType + ")");

        // Place the item on the timeline.
        this._timeline.addItem(timelineItem);

        // Update the history data.
        this._history.updateWith(timelineItem);
    };

    Context.prototype._closeMainVideo = function() {
        // Do not close the main content if already closed.
        if (this._isVideoClosed) {
            this.warn("#_closeMainVideo() > The main video content was already closed.");
            return;
        }


        if (this._offset[this._assetData.videoId()] == -1) {
            this._offset[this._assetData.videoId()] = this._assetData.duration();
        }

        // Place the COMPLETE event on the timeline (for main asset).
        var completeItem = new TimelineItem(this._assetData,
            this._userData,
            this._streamData,
            this._qosData,
            EventDao.EVENT_TYPE_COMPLETE,
            this._offset[this._assetData.videoId()]);
        completeItem.prevItemOfSameType = this._history.getPreviousItemOfSameTypeWith(completeItem);
        this._placeItemOnTimeline(completeItem);

        this._isVideoClosed = true;
    };

    Context.prototype._closeAd = function() {
        // Place the COMPLETE event on the timeline (for ad asset).
        var completeItem = new TimelineItem(this._assetData,
            this._userData,
            this._streamData,
            this._qosData,
            EventDao.EVENT_TYPE_COMPLETE,
            this._offset[this._activeAssetName]);
        completeItem.prevItemOfSameType = this._history.getPreviousItemOfSameTypeWith(completeItem);
        this._placeItemOnTimeline(completeItem);

        // Revert back to the type of the main content.
        this._assetData.type(this._mainAssetType);
        this._activeAssetName = this._assetData.videoId();

        // Nullify the ad data.
        this._assetData.adData(null);
    };

    // Export symbols.
    heartbeat.context.Context = Context;
})(core, heartbeat, va);

(function(core, heartbeat) {
    'use strict';

    var PRIMETIME_OVP = 'primetime';

    var mixin = core.mixin;
    var logger = core.logger;
    var NotificationCenter = core.NotificationCenter;
    var EventKeyName = heartbeat.event.EventKeyName;
    var ApiEvent = heartbeat.event.ApiEvent;
    var ClockEvent = heartbeat.event.ClockEvent;
    var Clock = heartbeat.clock.Clock;
    var Network = heartbeat.network.Network;
    var Context = heartbeat.context.Context;
    var QuerystringSerializer = heartbeat.model.QuerystringSerializer;

    mixin(Heartbeat, logger);

    function Heartbeat(appMeasurement) {
        this._appMeasurement = appMeasurement;

        // We are not configured yet.
        this._isConfigured = false;

        // Bootstrap the Heartbeat module.
        this._bootstrap();

        // Activate logging for this class.
        this.enableLogging('[heartbeat::Heartbeat] > ');
    }

    //
    //-----------------[ Private helper methods ]-----------------------
    //
    Heartbeat.prototype._bootstrap = function() {
        // Instantiate all sub-modules.
        this._initSubmodules();
    };

    Heartbeat.prototype._initSubmodules = function() {
        this._context = new Context();
        this._network = new Network(new QuerystringSerializer());
        this._clock = new Clock();
    };

    Heartbeat.prototype._canTrack = function() {
        var result = (this._isConfigured &&
            (
                this._appMeasurement.analyticsVisitorID ||
                this._appMeasurement.marketingCloudVisitorID ||
                this._appMeasurement.visitorID
                ));

        if (!result) {
            this.warn("Unable to track!" +
                " Is configured: " + this._isConfigured +
                " analyticsVisitorID: " + this._appMeasurement.analyticsVisitorID +
                " marketingCloudVisitorID: " + this._appMeasurement.marketingCloudVisitorID +
                " visitorID: " + this._appMeasurement.visitorID);
        }

        return result;
    };

    //
    // -------------------[ Public methods ]-----------------------
    //
    Heartbeat.prototype.setup = function(configData) {
        if (!configData) {
            throw new Error("Configuration object cannot be NULL");
        }

        // If we are dealing with a primetime OVP, override the custom OVP setting.
        var ovp = (configData.__primetime) ? PRIMETIME_OVP : configData.ovp;

        // If we have a PSDK version number available, override the custom SDK setting.
        var sdk = (configData.__psdkVersion != null) ? configData.__psdkVersion : configData.sdk;

        var checkStatusServer = configData.trackingServer + "/settings/";

        this.log("#setup() > Applying configuration: {" +
            "account: "            + this._appMeasurement.account +
            ", scTrackingServer: " + this._appMeasurement.trackingServer +
            ", sbTrackingServer: " + configData.trackingServer +
            ", jobId: "            + configData.jobId +
            ", publisher: "        + configData.publisher +
            ", ovp: "              + configData.ovp +
            ", sdk: "              + configData.sdk +
            ", useSSL: "           + this._appMeasurement.ssl +
            ", channel:"           + configData.channel +
            ", quietMode:  "       + configData.quietMode +
            ", debugLogging: "     + configData.debugLogging +
            "}");

        // Let everybody know about the update of the configuration settings.
        var eventData = {};
        eventData[EventKeyName.ACCOUNT]             = this._appMeasurement.account;
        eventData[EventKeyName.SC_TRACKING_SERVER]  = this._appMeasurement.trackingServer;
        eventData[EventKeyName.TRACKING_SERVER]     = configData.trackingServer;
        eventData[EventKeyName.CHECK_STATUS_SERVER] = checkStatusServer;
        eventData[EventKeyName.JOB_ID]              = configData.jobId;
        eventData[EventKeyName.PUBLISHER]           = configData.publisher;
        eventData[EventKeyName.OVP]                 = ovp;
        eventData[EventKeyName.SDK]                 = sdk;
        eventData[EventKeyName.USE_SSL]             = this._appMeasurement.ssl;
        eventData[EventKeyName.CHANNEL]             = configData.channel;
        eventData[EventKeyName.QUIET_MODE]          = configData.quietMode;

        NotificationCenter().dispatchEvent(new ApiEvent(ApiEvent.API_CONFIG, eventData));

        // We are now configured.
        this._isConfigured = true;
    };

    Heartbeat.prototype.open = function(name, length, playerName, streamType) {
        this.log("#open(" +
              "name=" + name +
            ", length=" + length +
            ", playerName=" + playerName +
            ")");

        // Fast exit.
        if (!this._canTrack()) return;

        // Issue an API_OPEN_MAIN event.
        var eventData = {};
        eventData[EventKeyName.VISITOR_ID] = this._appMeasurement.visitorID;
        eventData[EventKeyName.ANALYTICS_VISITOR_ID] = this._appMeasurement.analyticsVisitorID;
        eventData[EventKeyName.MARKETING_CLOUD_VISITOR_ID] = this._appMeasurement.marketingCloudVisitorID;
        eventData[EventKeyName.NAME] = name;
        eventData[EventKeyName.LENGTH] = length;
        eventData[EventKeyName.STREAM_TYPE] = streamType;
        eventData[EventKeyName.PLAYER_NAME] = playerName;

        NotificationCenter().dispatchEvent(new ApiEvent(ApiEvent.API_OPEN_MAIN, eventData));
    };

    Heartbeat.prototype.openAd = function(name, length, playerName, parentName, parentPod, parentPodPosition, cpm) {
        this.log("#openAd(" +
              "name=" + name +
            ", length=" + length +
            ", playerName=" + playerName +
            ", parentName=" + parentName +
            ", parentPod=" + parentPod +
            ", parentPodPosition=" + parentPodPosition +
            ", cpm=" + cpm +
            ")");

        // Fast exit.
        if (!this._canTrack()) return;

        // Issue an API_OPEN_AD event.
        var eventData = {};
        eventData[EventKeyName.NAME] = name;
        eventData[EventKeyName.LENGTH] = length;
        eventData[EventKeyName.PLAYER_NAME] = playerName;
        eventData[EventKeyName.PARENT_NAME] = parentName;
        eventData[EventKeyName.PARENT_POD] = parentPod;
        eventData[EventKeyName.PARENT_POD_POSITION] = parentPodPosition;
        eventData[EventKeyName.CPM] = cpm;

        NotificationCenter().dispatchEvent(new ApiEvent(ApiEvent.API_OPEN_AD, eventData));
    };

    Heartbeat.prototype.close = function(name) {
        this.log("#close(name=" + name + ")");

        // Fast exit.
        if (!this._canTrack()) return;

        // Issue an API_CLOSE event.
        var eventData = {};
        eventData[EventKeyName.NAME] = name;

        NotificationCenter().dispatchEvent(new ApiEvent(ApiEvent.API_CLOSE, eventData));
    };

    Heartbeat.prototype.play = function(name, offset, segmentNum, segment, segmentLength) {
        this.log("#play(" +
              "name=" + name +
            ", offset=" + offset +
            ", segmentNum=" + segmentNum +
            ", segment=" + segment +
            ", segmentLength=" + segmentLength +
            ")");

        // Fast exit.
        if (!this._canTrack()) return;

        var eventData;
        eventData = {};
        eventData[EventKeyName.VISITOR_ID] = this._appMeasurement.visitorID;
        eventData[EventKeyName.ANALYTICS_VISITOR_ID] = this._appMeasurement.analyticsVisitorID;
        eventData[EventKeyName.MARKETING_CLOUD_VISITOR_ID] = this._appMeasurement.marketingCloudVisitorID;
        eventData[EventKeyName.NAME] = name;
        eventData[EventKeyName.OFFSET] = offset;

        // Issue a CLOCK_MONITOR_ENABLE event (start the monitor internal timer).
        NotificationCenter().dispatchEvent(new ClockEvent(ClockEvent["CLOCK_MONITOR_ENABLE"], eventData));

        // Issue an API_PLAY event.
        NotificationCenter().dispatchEvent(new ApiEvent(ApiEvent.API_PLAY, eventData));
    };

    Heartbeat.prototype.stop = function(name, offset) {
        this.log("#stop(" +
              "name=" + name +
            ", offset=" + offset +
            ")");

        // Fast exit.
        if (!this._canTrack()) return;

        var eventData;
        eventData = {};
        eventData[EventKeyName.NAME] = name;
        eventData[EventKeyName.OFFSET] = offset;

        // Issue a CLOCK_MONITOR_DISABLE event (stop the monitor internal timer).
        NotificationCenter().dispatchEvent(new ClockEvent(ClockEvent.CLOCK_MONITOR_DISABLE, eventData));

        // Issue an API_STOP event.
        NotificationCenter().dispatchEvent(new ApiEvent(ApiEvent.API_STOP, eventData));
    };

    Heartbeat.prototype.click = function(name, offset) {
        this.log("#click(" +
              "name=" + name +
            ", offset=" + offset +
            ")");

        // Fast exit.
        if (!this._canTrack()) return;

        // Issue an API_CLICK event.
        var eventData = {};
        eventData[EventKeyName.NAME] = name;
        eventData[EventKeyName.OFFSET] = offset;

        NotificationCenter().dispatchEvent(new ApiEvent(ApiEvent.API_CLICK, eventData));
    };

    Heartbeat.prototype.complete = function(name, offset) {
        this.log("#complete(" +
              "name=" + name +
            ", offset=" + offset +
            ")");

        // Fast exit.
        if (!this._canTrack()) return;

        // Issue an API_COMPLETE event.
        var eventData = {};
        eventData[EventKeyName.NAME] = name;
        eventData[EventKeyName.OFFSET] = offset;

        NotificationCenter().dispatchEvent(new ApiEvent(ApiEvent.API_COMPLETE, eventData));
    };

    Heartbeat.prototype.trackError = function(source, errorId, offset) {
        this.log("#trackError(" +
              "source=" + source +
            ", errorId=" + errorId +
            ", offset=" + offset +
            ")");

        // Fast exit.
        if (!this._canTrack()) return;

        // Issue an API_TRACK_ERROR event.
        var eventData = {};
        eventData[EventKeyName.SOURCE] = source;
        eventData[EventKeyName.ERROR_ID] = errorId;
        eventData[EventKeyName.OFFSET] = offset;

        NotificationCenter().dispatchEvent(new ApiEvent(ApiEvent.API_TRACK_ERROR, eventData));
    };

    Heartbeat.prototype.updateQoSInfo = function(bitrate, fps, droppedFrames) {
        this.log("#updateQoSInfo(" +
              "bitrate=" + bitrate +
            ", fps=" + fps +
            ", droppedFrames=" + droppedFrames +
            ")");

        // Fast exit.
        if (!this._canTrack()) return;

        // Issue an API_QOS_INFO event.
        var eventData = {};
        eventData[EventKeyName.BITRATE] = bitrate;
        eventData[EventKeyName.FPS] = fps;
        eventData[EventKeyName.DROPPED_FRAMES] = droppedFrames;

        NotificationCenter().dispatchEvent(new ApiEvent(ApiEvent.API_QOS_INFO, eventData));
    };

    Heartbeat.prototype.bitrateChange = function(bitrate) {
        this.log("#bitrateChange(bitrate=" + bitrate + ")");

        // Fast exit.
        if (!this._canTrack()) return;

        // Issue an API_BITRATE_CHANGE event.
        var eventData = {};
        eventData[EventKeyName.BITRATE] = bitrate;

        NotificationCenter().dispatchEvent(new ApiEvent(ApiEvent.API_BITRATE_CHANGE, eventData));
    };

    Heartbeat.prototype.bufferStart = function() {
        this.log("#bufferStart()");

        // Fast exit.
        if (!this._canTrack()) return;

        // Issue an API_BUFFER_START event.
        NotificationCenter().dispatchEvent(new ApiEvent(ApiEvent.API_BUFFER_START));
    };

    Heartbeat.prototype.adBreakStart = function(offset) {
        this.log("#adBreakStart(offset=" + offset + ")");

        // Fast exit.
        if (!this._canTrack()) return;

        // Issue an API_POD_OFFSET event.
        var eventData = {};
        eventData[EventKeyName.PARENT_POD_OFFSET] = offset;

        NotificationCenter().dispatchEvent(new ApiEvent(ApiEvent.API_POD_OFFSET, eventData));
    };

    Heartbeat.prototype.adBreakEnd = function() {
        this.log("#adBreakEnd()");

        // Fast exit.
        if (!this._canTrack()) return;

        // Issue an API_POD_OFFSET event.
        var eventData = {};
        eventData[EventKeyName.PARENT_POD_OFFSET] = null;

        NotificationCenter().dispatchEvent(new ApiEvent(ApiEvent.API_POD_OFFSET, eventData));
    };

    Heartbeat.prototype.sessionComplete = function() {
        this.log("#sessionComplete()");

        // Fast exit.
        if (!this._canTrack()) return;

        NotificationCenter().dispatchEvent(new ApiEvent(ApiEvent.API_SESSION_COMPLETE));
    };

    Heartbeat.prototype.destroy = function() {
        this.log("#destroy()");

        // Tear-down all sub-modules.
        this._context.destroy();
        this._clock.destroy();
        this._network.destroy();
    };

    // Export symbols.
    heartbeat.Heartbeat = Heartbeat;
})(core, heartbeat);

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
    va.ASSET_TYPE_LINEAR = "linear";
    va.ASSET_TYPE_LIVE = "live";
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
    HeartbeatProtocol.prototype.trackAdBreakStart = function() {};

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
        throw new Error("Implementation error: Method must be overridden.");
    };

    PlayerDelegate.prototype.getAdInfo = function() {
        throw new Error("Implementation error: Method must be overridden.");
    };

    PlayerDelegate.prototype.getChapterInfo = function() {
        throw new Error("Implementation error: Method must be overridden.");
    };

    PlayerDelegate.prototype.getQoSInfo = function() {
        throw new Error("Implementation error: Method must be overridden.");
    };

    PlayerDelegate.prototype.onError = function(errorInfo) {
        throw new Error("Implementation error: Method must be overridden.");
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


(function(core, va, heartbeat, utils) {
    'use strict';

    var extend = core.extend;
    var logger = core.logger;
    var mixin = core.mixin;
    var HeartbeatProtocol = va.HeartbeatProtocol;
    var VideoInfo = va.VideoInfo;
    var AdBreakInfo = va.AdBreakInfo;
    var AdInfo = va.AdInfo;
    var QoSInfo = va.QoSInfo;
    var ErrorInfo = va.ErrorInfo;
    var Heartbeat = heartbeat.Heartbeat;
    var MD5 = utils.md5;

    var ERROR_SOURCE_APPLICATION = "application";
    var ERROR_SOURCE_PLAYER = "player";

    var QOS_INFO_POLL_INTERVAL = 1000;
    var APP_MEASUREMENT_POLL_INTERVAL = 300;

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

        if (!appMeasurement) {
            throw new Error("The reference to the AppMeasurement object cannot be NULL.");
        }
        this._appMeasurement = appMeasurement;


        if (!playerDelegate) {
            throw new Error("The reference to the PlayerDelegate implementation cannot be NULL.");
        }
        this._playerDelegate = playerDelegate;

        this._heartbeat = new Heartbeat(appMeasurement);

        this._resetInternalState();

        this._isDestroyed = false;

        // Activate logging for this class.
        this.enableLogging('[video-heartbeat::VideoHeartbeat] > ');
    }

    //
    //---------------------[ Private helper methods ]-----------------------
    //
    VideoHeartbeat.prototype._startViewingSession = function() {
        // If the viewing session has already started, do nothing.
        if (this._isViewingSessionActive) {
            this.warn("#_startViewingSession() > Tracking session already in progress.");
            return;
        }

        this.log("#_startViewingSession() > Setting the stream type: " + this._videoInfo.streamType);

        // Open the main video asset.
        this._openVideo();

        // The viewing session has now started.
        this._isViewingSessionActive = true;
    };

    VideoHeartbeat.prototype._openVideo = function() {
        this.log(this, "#_openVideo(" +
              "id=" + this._videoInfo.id +
            ", length=" + this._videoInfo.length +
            ", streamType=" + this._videoInfo.streamType +
            ", playerName=" + this._videoInfo.playerName +
            ")");

        // Make sure that SiteCatalyst start call is fired over the network.

        this._resetAppMeasurementContextData();

        this._appMeasurement.contextData["a.contentType"]      = SC_CONTENT_TYPE_VIDEO;

        this._appMeasurement.contextData["a.media.name"]       = this._videoInfo.id;
        this._appMeasurement.contextData["a.media.length"]     = Math.floor(this._videoInfo.length);
        this._appMeasurement.contextData["a.media.playerName"] = this._videoInfo.playerName;
        this._appMeasurement.contextData["a.media.channel"]    = this._configData.channel;
        this._appMeasurement.contextData["a.media.view"]       = true;

        this._appMeasurement.pev3 = SC_CONTENT_TYPE_VIDEO;
        this._appMeasurement.pe   = this._configData.__primetime ? SC_START_PRIMETIME : SC_START;

        this._appMeasurement.track();

        // Do the Heartbeat-specific work.
        this._enqueueHeartbeatCall(this._heartbeat.open, [this._videoInfo.id, this._videoInfo.length,
                                                         this._videoInfo.playerName, this._videoInfo.streamType]);
    };

    VideoHeartbeat.prototype._closeVideo = function() {
        this.log("#_closeVideo(id=" + this._videoInfo.id + ")");

        // Track the closing of the main content.
        this._enqueueHeartbeatCall(this._heartbeat.close, [this._videoInfo.id]);

        // The main asset is now closed.
        this._isVideoClosed = true;
    };

    VideoHeartbeat.prototype._openAd = function() {
        this.log("#_openAd(" +
              "id=" + this._adInfo.id +
            ", length=" + this._adInfo.length +
            ", playerName=" + this._adBreakInfo.playerName +
            ", parentId=" + this._videoInfo.id +
            ", podId=" + this._adInfo.id +
            ", parentPodPosition=" + this._adInfo.position +
            ", cpm=" + this._adInfo.cpm +
            ")");

        // Make sure that SiteCatalyst start call is fired over the network.

        this._resetAppMeasurementContextData();

        this._appMeasurement.contextData["a.contentType"]          = SC_CONTENT_TYPE_AD;

        this._appMeasurement.contextData["a.media.name"]           = this._videoInfo.id;
        this._appMeasurement.contextData["a.media.channel"]        = this._configData.channel;

        this._appMeasurement.contextData["a.media.ad.name"]        = this._adInfo.id;
        this._appMeasurement.contextData["a.media.ad.length"]      = Math.floor(this._adInfo.length);
        this._appMeasurement.contextData["a.media.ad.playerName"]  = this._adBreakInfo.playerName;
        this._appMeasurement.contextData["a.media.ad.pod"]         = this._podId;
        this._appMeasurement.contextData["a.media.ad.podPosition"] = Math.floor(this._adInfo.position);
        this._appMeasurement.contextData["a.media.ad.CPM"]         = this._adInfo.cpm;
        this._appMeasurement.contextData["a.media.ad.view"]        = true;

        this._appMeasurement.pev3 = SC_CONTENT_TYPE_AD;
        this._appMeasurement.pe   = this._configData.__primetime ? SC_START_AD_PRIMETIME : SC_START_AD;

        this._appMeasurement.track();

        // Do now the Heartbeat-specific work.
        this._enqueueHeartbeatCall(this._heartbeat.openAd, [this._adInfo.id,
                                                            this._adInfo.length,
                                                            this._adBreakInfo.playerName,
                                                            this._videoInfo.id,
                                                            this._podId,
                                                            this._adInfo.position,
                                                            this._adInfo.cpm]);

        // We are now inside an ad.
        this._inAd = true;
    };

    VideoHeartbeat.prototype._closeAd = function() {
        this.log("#_closeAd(id=" + this._adInfo.id + ")");

        // Track the closing of the ad content.
        this._enqueueHeartbeatCall(this._heartbeat.close, [this._adInfo.id]);

        // We are no longer inside an ad.
        this._inAd = false;
        this._adInfo = null;
    };

    VideoHeartbeat.prototype._startPlayback = function() {
        // Resume main video or ad playback.
        (this._inAd) ? this._startAdPlayback()
                     : this._startVideoPlayback();
    };

    VideoHeartbeat.prototype._stopPlayback = function() {
        // Stop main video of or ad playback.
        (this._inAd) ? this._stopAdPlayback(false)
                     : this._stopVideoPlayback(false);
    };

    VideoHeartbeat.prototype._startAdPlayback = function() {
        if (this._inAd && !this._isAdPlaying && !this._isSeeking) {
            var playhead = this._getActiveAssetPlayhead();

            this.log("#_startAdPlayback(" +
                  "id=" + this._adInfo.id +
                ", playhead=" + playhead +
                ")");

            // Track the start of the ad content playback.
            this._enqueueHeartbeatCall(this._heartbeat.play, [this._adInfo.id, playhead]);

            // Ad content is now playing.
            this._isAdPlaying = true;
        }
    };

    VideoHeartbeat.prototype._stopAdPlayback = function(completed) {
        if (this._inAd && this._isAdPlaying) {
            if (completed) {
                // We are at the end of the ad; the playhead is now the ad's length
                this._adInfo.playhead = this._adInfo.length;
            } else {
                this._adInfo = this._playerDelegate.getAdInfo();
            }

            this.log("#_stopAdPlayback(" +
                "id=" + this._adInfo.id +
                ", playhead=" + this._adInfo.playhead +
                ")");

            // Track the stop of the ad content playback.
            this._enqueueHeartbeatCall(this._heartbeat.stop, [this._adInfo.id, this._adInfo.playhead]);

            // Ad content is no longer playing.
            this._isAdPlaying = false;
        }
    };

    VideoHeartbeat.prototype._startVideoPlayback = function() {
        if (!this._isVideoClosed && !this._isVideoPlaying && !this._isSeeking) {
            var playhead = this._getActiveAssetPlayhead();

            this.log("#_startVideoPlayback(" +
                  "id=" + this._videoInfo.id +
                ", playhead=" + playhead +
                ")");

            // Track the start of the video content playback.
            this._enqueueHeartbeatCall(this._heartbeat.play, [this._videoInfo.id, this._videoInfo.playhead]);

            // Main video is now playing.
            this._isVideoPlaying = true;
        }
    };

    VideoHeartbeat.prototype._stopVideoPlayback = function(completed) {
        if (this._isVideoPlaying) {
            if (completed) {
                // We are at the end of the content; the playhead is now the content's length
                this._videoInfo.playhead = this._videoInfo.length;
            } else {
                this._videoInfo = this._playerDelegate.getVideoInfo();
            }

            this.log("#_stopVideoPlayback(" +
                  "id=" + this._videoInfo.id +
                ", playhead=" + this._videoInfo.playhead +
                ")");

            // Track the stop of the video content playback.
            this._enqueueHeartbeatCall(this._heartbeat.stop, [this._videoInfo.id, this._videoInfo.playhead]);

            // Main video is no longer playing.
            this._isVideoPlaying = false;
        }
    };

    VideoHeartbeat.prototype._closeAllContent = function() {
        this.log("#_closeAllContent()");

        // Close the active ad (if any).
        if (this._inAd) {
            this.trackAdComplete();
            this.trackAdBreakComplete();
        }

        // Close the main video.
        this._closeVideo();
    };

    VideoHeartbeat.prototype._completeViewingSession = function() {
        this.log("#_completeViewingSession() : Closing a previously open tracking session.");

        // Stop all playback.
        this._stopAdPlayback(true);
        this._stopVideoPlayback(true);

        // Close all active content.
        this._closeAllContent();

        // Complete the current viewing session.
        this._enqueueHeartbeatCall(this._heartbeat.sessionComplete);

        // This session is no longer active.
        this._isViewingSessionActive = false;
    };

    VideoHeartbeat.prototype._resetInternalState = function() {
        this.log("#_resetInternalState() : Resetting internal state variables.");

        if (this._pollQoSInfoTimer) clearInterval(this._pollQoSInfoTimer);
        this._pollQoSInfoTimer = null;

        if (this._pollAppMeasurementTimer) clearInterval(this._pollAppMeasurementTimer);
        this._pollAppMeasurementTimer = null;

        this._workQueue = [];

        this._errorInfo = null;

        this._videoInfo = null;
        this._adBreakInfo = null;
        this._adInfo = null;
        this._qosInfo = null;

        this._isViewingSessionActive = false;
        this._isVideoPlaying = false;
        this._isVideoClosed = false;
        this._isSeeking = false;
        this._isPaused = false;
        this._isAdPlaying = false;

        this._inAd = false;
        this._inAdBreak = false;

        this._podId = null;
    };

    VideoHeartbeat.prototype._isVisitorIdAvailable = function() {
        this.log("#_isVisitorIdAvailable() > VisitorID values: " +
              "analyticsVisitorID=" + this._appMeasurement.analyticsVisitorID +
            ", marketingCloudVisitorID=" + this._appMeasurement.analyticsVisitorID +
            ", visitorID=" + this._appMeasurement.visitorID +
            ")");

        return  this._appMeasurement.analyticsVisitorID ||
                this._appMeasurement.marketingCloudVisitorID ||
                this._appMeasurement.visitorID;
    };

    VideoHeartbeat.prototype._drainWorkQueue = function() {
        for (var i = 0; i < this._workQueue.length; i++) {
            this.log("#_drainWorkQueue() > Dequeuing heartbeat operation.");

            if (this._errorInfo) {
                this.warn("#_drainWorkQueue() > Unable to track: in ERROR state.");
                return;
            }

            var workItem = this._workQueue[i];
            workItem.fn.apply(this._heartbeat, workItem.args);
        }

        // Reset the work queue.
        this._workQueue = [];
    };

    VideoHeartbeat.prototype._enqueueHeartbeatCall = function(fn, args) {
        if (this._errorInfo) {
            this.warn("#_enqueueHeartbeatCall() > Unable to track: in ERROR state.");
            return;
        }

        if (!this._isVisitorIdAvailable()) {
            if (!this._pollAppMeasurementTimer) {
                var self = this;
                this._pollAppMeasurementTimer = setInterval(function(){
                    if (self._isVisitorIdAvailable()) {
                        self._drainWorkQueue();

                        if (self._pollAppMeasurementTimer) {
                            clearInterval(self._pollAppMeasurementTimer);
                        }

                        self._pollAppMeasurementTimer = null;
                    }
                }, APP_MEASUREMENT_POLL_INTERVAL);
            }

            this.log("#_enqueueHeartbeatCall() > Enqueuing heartbeat operation.");

            this._workQueue.push({fn: fn, args: args});
        } else {
            fn.apply(this._heartbeat, args);
        }
    };

    VideoHeartbeat.prototype._getActiveAssetId = function() {
        if (this._inAd) {
            if (this._adInfo) {
                return this._adInfo.id;
            }

            // We think we are inside an ad, but we have no ad-info available. Get it.
            this._adInfo = this._playerDelegate.getAdInfo();

            if (this._adInfo) {
                return this._adInfo.id;
            } else {
                // The player says we are not inside an ad.
                this._executeErrorCallback("Inconsistent internal state", "Unable to obtain valid ad-info.");
            }
        } else {
            if (this._videoInfo) {
                return this._videoInfo.id;
            }

            // We have no video-info available. Get it.
            this._videoInfo = this._playerDelegate.getVideoInfo();

            if (this._videoInfo) {
                return this._videoInfo.id;
            } else {
                // We are unable to get the video info.
                this._executeErrorCallback("Inconsistent internal state", "Unable to obtain valid video-info.");
            }
        }

        return null;
    };

    VideoHeartbeat.prototype._getActiveAssetPlayhead = function() {
        if (this._inAd) {
            this._adInfo = this._playerDelegate.getAdInfo();

            if (this._adInfo) {
                return this._adInfo.playhead;
            } else {
                // The player says we are not inside an ad.
                this._executeErrorCallback("Inconsistent internal state", "Unable to obtain valid ad-info.");
            }
        } else {
            this._videoInfo = this._playerDelegate.getVideoInfo();

            if (this._videoInfo) {
                return this._videoInfo.playhead;
            } else {
                // We are unable to get the video info.
                this._executeErrorCallback("Inconsistent internal state", "Unable to obtain valid video-info.");
            }
        }

        return 0;
    };

    VideoHeartbeat.prototype._executeErrorCallback = function(message, details) {
        this._errorInfo = new ErrorInfo(message, details);
        this._playerDelegate.onError(this._errorInfo);
    };

    VideoHeartbeat.prototype._updateQoSInfo = function() {
        // Get the latest QoS info.
        this._qosInfo = this._playerDelegate.getQoSInfo();

        if (this._qosInfo) {
            this._enqueueHeartbeatCall(this._heartbeat.updateQoSInfo, [this._qosInfo.bitrate, this._qosInfo.fps, this._qosInfo.droppedFrames]);
        } else {
            this.log("#_updateQoSInfo() > QoS info unavailable.");
        }
    };

    VideoHeartbeat.prototype._resetAppMeasurementContextData = function() {
        delete this._appMeasurement.contextData["a.contentType"];

        delete this._appMeasurement.contextData["a.media.name"];
        delete this._appMeasurement.contextData["a.media.length"];
        delete this._appMeasurement.contextData["a.media.playerName"];
        delete this._appMeasurement.contextData["a.media.channel"];
        delete this._appMeasurement.contextData["a.media.view"];

        delete this._appMeasurement.contextData["a.media.ad.name"];
        delete this._appMeasurement.contextData["a.media.ad.length"];
        delete this._appMeasurement.contextData["a.media.ad.playerName"];
        delete this._appMeasurement.contextData["a.media.ad.pod"];
        delete this._appMeasurement.contextData["a.media.ad.podPosition"];
        delete this._appMeasurement.contextData["a.media.ad.CPM"];
        delete this._appMeasurement.contextData["a.media.ad.view"];
    };

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

        this._heartbeat.setup(configData);
    };

    VideoHeartbeat.prototype.destroy = function() {
        this._heartbeat.destroy();
        this._resetInternalState();

        // From this point on, we no longer accepts API requests.
        this._isDestroyed = true;
    };

    VideoHeartbeat.prototype.trackVideoLoad = function() {
        if (this._isDestroyed) {
            this.warn("#trackVideoLoad() > Unable to track: instance previously destroyed.");
            this._executeErrorCallback("Illegal operation.", "Instance previously destroyed.");

            return;
        }

        // Reset the internal state variables.
        this._resetInternalState();

        this.log("#trackVideoLoad() > Querying the player delegate.");

        this._videoInfo = this._playerDelegate.getVideoInfo();

        this.log(this, "#trackVideoLoad(" +
              "playerName=" + this._videoInfo.playerName +
            ", videoId=" + this._videoInfo.id +
            ", name=" + this._videoInfo.name +
            ", length=" + this._videoInfo.length +
            ", playhead=" + this._videoInfo.playhead +
            ", streamType=" + this._videoInfo.streamType +
            ")");

        if (this._isViewingSessionActive) { // There is already a main video loaded - terminate it.
            this._completeViewingSession();
        }

        // Start the viewing session
        this._startViewingSession();

        // Start the QoSInfo timer.
        var self = this;
        this._pollQoSInfoTimer = setInterval(function() { self._updateQoSInfo.call(self); }, QOS_INFO_POLL_INTERVAL);
    };

    VideoHeartbeat.prototype.trackVideoUnload = function() {
        if (this._isDestroyed) {
            this.warn("#trackVideoUnload() > Unable to track: instance previously destroyed.");
            this._executeErrorCallback("Illegal operation.", "Instance previously destroyed.");

            return;
        }

        if (!this._isViewingSessionActive) {
            this.warn("#trackVideoUnload() > Unable to track: no active tracking session.");
            return;
        }

        if (this._errorInfo) {
            this.warn("#trackVideoUnload() > Unable to track: in ERROR state.");
            return;
        }

        this.log("#trackMainVideoClose() > Tracking a VIDEO_UNLOAD event.");

        this._completeViewingSession();

        // Stop the QoSInfo timer.
        clearInterval(this._pollQoSInfoTimer);
        this._pollQoSInfoTimer = null;
    };

    VideoHeartbeat.prototype.trackPlay = function() {
        if (this._isDestroyed) {
            this.warn("#trackPlay() > Unable to track: instance previously destroyed.");
            this._executeErrorCallback("Illegal operation.", "Instance previously destroyed.");

            return;
        }

        if (!this._isViewingSessionActive) {
            this.warn("#trackPlay() > Unable to track: no active tracking session.");
            return;
        }

        if (this._errorInfo) {
            this.warn("#trackPlay() > Unable to track: in ERROR state.");
            return;
        }

        this.log("#trackPlay() > Tracking a PLAY event.");

        // Resume playback.
        this._startPlayback();

        // We are no longer in the "paused" state.
        this._isPaused = false;
    };

    VideoHeartbeat.prototype.trackPause = function() {
        if (this._isDestroyed) {
            this.warn("#trackPause() > Unable to track: instance previously destroyed.");
            this._executeErrorCallback("Illegal operation.", "Instance previously destroyed.");

            return;
        }

        if (!this._isViewingSessionActive) {
            this.warn("#trackPause() > Unable to track: no active tracking session.");
            return;
        }

        if (this._errorInfo) {
            this.warn("#trackStop() > Unable to track: in ERROR state.");
            return;
        }

        this.log("#trackPause() > Tracking a PAUSE event.");

        // Stop the playback.
        this._stopPlayback();

        // We are now in the "paused" state.
        this._isPaused = true;
    };

    VideoHeartbeat.prototype.trackBufferStart = function() {
        if (this._isDestroyed) {
            this.warn("#trackBufferStart() > Unable to track: instance previously destroyed.");
            this._executeErrorCallback("Illegal operation.", "Instance previously destroyed.");

            return;
        }

        if (!this._isViewingSessionActive) {
            this.warn("#trackBufferStart() > Unable to track: no active tracking session.");
            return;
        }

        if (this._errorInfo) {
            this.warn("#trackBufferStart() > Unable to track: in ERROR state.");
            return;
        }

        this.log("#trackBufferStart() > Tracking a BUFFER_START event.");

        // Stop the playback.
        this._stopPlayback();

        // Track the BUFFER_START event.
        this._enqueueHeartbeatCall(this._heartbeat.bufferStart);
    };

    VideoHeartbeat.prototype.trackBufferComplete = function() {
        if (this._isDestroyed) {
            this.warn(this, "#trackBufferComplete() > Unable to track: instance previously destroyed.");
            this._executeErrorCallback("Illegal operation.", "Instance previously destroyed.");

            return;
        }

        if (!this._isViewingSessionActive) {
            this.warn("#trackBufferComplete() > Unable to track: no active tracking session.");
            return;
        }

        if (this._errorInfo) {
            this.warn("#trackBufferComplete() > Unable to track: in ERROR state.");
            return;
        }

        this.log("#trackBufferComplete() > Tracking a BUFFER_COMPLETE event.");

        // Resume playback.
        this._startPlayback();
    };

    VideoHeartbeat.prototype.trackSeekStart = function() {
        if (this._isDestroyed) {
            this.warn("#trackSeekStart() > Unable to track: instance previously destroyed.");
            this._executeErrorCallback("Illegal operation.", "Instance previously destroyed.");

            return;
        }

        if (!this._isViewingSessionActive) {
            this.warn("#trackSeekStart() > Unable to track: no active tracking session.");
            return;
        }

        if (this._errorInfo) {
            this.warn("#trackSeekStart() > Unable to track: in ERROR state.");
            return;
        }

        this.log("#trackSeekStart() > Tracking a SEEK_START event.");

        // Stop the playback;
        this._stopPlayback();
    };

    VideoHeartbeat.prototype.trackSeekComplete = function() {
        if (this._isDestroyed) {
            this.warn("#trackSeekComplete() > Unable to track: instance previously destroyed.");
            this._executeErrorCallback("Illegal operation.", "Instance previously destroyed.");

            return;
        }

        if (!this._isViewingSessionActive) {
            this.warn("#trackSeekComplete() > Unable to track: no active tracking session.");
            return;
        }

        if (this._errorInfo) {
            this.warn("#trackSeekComplete() > Unable to track: in ERROR state.");
            return;
        }

        // The "seek" operation is now complete.
        this._isSeeking = false;

        // We need to determine whether we are inside an ad or not.
        //
        // To this end we re-sync with the video player by querying
        // the player delegate.
        this._videoInfo = this._playerDelegate.getVideoInfo();
        this._adInfo = this._playerDelegate.getAdInfo();

        this.log("#trackSeekComplete() > Tracking a SEEK_COMPLETE event (inAd=" + this._inAd + ").");

        // We only resume playback if the main video asset is open
        // and we are not in the "paused" state.
        if (this._isViewingSessionActive && !this._isPaused) {
            // Resume playback.
            this._startPlayback();
        }
    };

    VideoHeartbeat.prototype.trackComplete = function() {
        if (this._isDestroyed) {
            this.warn("#trackComplete() > Unable to track: instance previously destroyed.");
            this._executeErrorCallback("Illegal operation.", "Instance previously destroyed.");

            return;
        }

        if (!this._isViewingSessionActive) {
            this.warn("#trackComplete() > Unable to track: no active tracking session.");
            return;
        }

        if (this._errorInfo) {
            this.warn("#trackComplete() > Unable to track: in ERROR state.");
            return;
        }

        var id = this._videoInfo.id;
        var playhead = this._videoInfo.length;

        this.log("#trackComplete() > Tracking a COMPLETE event (asset=" + id + ", playhead=" + playhead + ").");

        // Track the COMPLETE event.
        this._enqueueHeartbeatCall(this._heartbeat.complete, [id, playhead]);
    };

    VideoHeartbeat.prototype.trackChapterStart = function() {
        throw new Error("Not implemented.");
    };

    VideoHeartbeat.prototype.trackChapterComplete = function() {
        throw new Error("Not implemented.");
    };

    VideoHeartbeat.prototype.trackAdBreakStart = function() {
        if (this._isDestroyed) {
            this.warn("#trackAdBreakStart() > Unable to track: instance previously destroyed.");
            this._executeErrorCallback("Illegal operation.", "Instance previously destroyed.");

            return;
        }

        if (!this._isViewingSessionActive) {
            this.warn("#trackAdBreakStart() > Unable to track: no active tracking session.");
            return;
        }

        if (this._errorInfo) {
            this.warn("#trackAdBreakStart() > Unable to track: in ERROR state.");
            return;
        }

        this.log("#trackAdBreakStart() > Querying the player delegate.");
        this._videoInfo = this._playerDelegate.getVideoInfo();
        this._adBreakInfo = this._playerDelegate.getAdBreakInfo();

        this.log("#trackAdBreakStart(" +
              "playerName=" + this._adBreakInfo.playerName +
            ", name=" + this._adBreakInfo.name +
            ", position=" + this._adBreakInfo.position +
            ")");

        this._podId = MD5(this._videoInfo.id) + "_" + this._adBreakInfo.position;

        // Track the AD_BREAK_START event.
        this._enqueueHeartbeatCall(this._heartbeat.adBreakStart, [this._videoInfo.playhead]);

        // Stop the playback of the main video.
        this._stopVideoPlayback(false);

        // We are now inside an ad-break.
        this._inAdBreak = true;
    };

    VideoHeartbeat.prototype.trackAdBreakComplete = function() {
        if (this._isDestroyed) {
            this.warn("#trackAdBreakComplete() > Unable to track: instance previously destroyed.");
            this._executeErrorCallback("Illegal operation.", "Instance previously destroyed.");

            return;
        }

        if (!this._isViewingSessionActive) {
            this.warn("#trackAdBreakComplete() > Unable to track: no active tracking session.");
            return;
        }

        if (this._errorInfo) {
            this.warn("#trackAdBreakComplete() > Unable to track: in ERROR state.");
            return;
        }

        this.log("#trackAdBreakComplete() > Tracking an AD_BREAK_COMPLETE event.");

        // Track the AD_BREAK_COMPLETE event.
        this._enqueueHeartbeatCall(this._heartbeat.adBreakEnd);

        // Resume the playback of the main video if we are not in the "paused" state.
        if (!this._isPaused) {
            this._startVideoPlayback();
        }

        // We are no longer inside an ad-break.
        this._inAdBreak = true;
        this._adBreakInfo = null;
    };

    VideoHeartbeat.prototype.trackAdStart = function() {
        if (this._isDestroyed) {
            this.warn("#trackAdStart() > Unable to track: instance previously destroyed.");
            this._executeErrorCallback("Illegal operation.", "Instance previously destroyed.");

            return;
        }

        if (!this._isViewingSessionActive) {
            this.warn("#trackAdStart() > Unable to track: no active tracking session.");
            return;
        }

        if (this._errorInfo) {
            this.warn("#trackAdStart() > Unable to track: in ERROR state.");
            return;
        }

        this.log("#trackAdStart() > Querying the player delegate.");
        this._adInfo = this._playerDelegate.getAdInfo();

        this.log("#trackAdStart(" +
              "adId=" + this._adInfo.id +
            ", name=" + this._adInfo.name +
            ", length=" + this._adInfo.length +
            ", playhead=" + this._adInfo.playhead +
            ", position=" + this._adInfo.position +
            ", cpm=" + this._adInfo.cpm +
            ")");

        this._openAd();

        // Start playback.
        this.trackPlay();

        // The ad is now playing.
        this._isAdPlaying = true;
    };

    VideoHeartbeat.prototype.trackAdComplete = function() {
        if (this._isDestroyed) {
            this.warn("#trackAdComplete() > Unable to track: instance previously destroyed.");
            this._executeErrorCallback("Illegal operation.", "Instance previously destroyed.");

            return;
        }

        if (!this._isViewingSessionActive) {
            this.warn('#trackAdComplete() > Call to trackAdComplete() while session not active.');
            return;
        }

        if (this._errorInfo) {
            this.warn("#trackAdComplete() > Unable to track: in ERROR state.");
            return;
        }

        this.log("#trackAdComplete() > Tracking an AD_COMPLETE event.");

        // Stop the playback for the ad content.
        this._stopAdPlayback(true);

        // Close the ad content.
        this._closeAd();
    };

    VideoHeartbeat.prototype.trackBitrateChange = function(bitrate) {
        if (this._isDestroyed) {
            this.warn("#trackBitrateChange() > Unable to track: instance previously destroyed.");
            this._executeErrorCallback("Illegal operation.", "Instance previously destroyed.");

            return;
        }

        if (!this._isViewingSessionActive) {
            this.warn("#trackBitrateChange() > Unable to track: no active tracking session.");
            return;
        }

        if (this._errorInfo) {
            this.warn("#trackBitrateChange() > Unable to track: in ERROR state.");
            return;
        }

        this.log("#trackBitrateChange() > Querying the player delegate.");
        this._qosInfo = this._playerDelegate.getQoSInfo();

        if (this._qosInfo.bitrate === undefined ||
            this._qosInfo.bitrate === null ||
            isNaN(this._qosInfo.bitrate)) {
            this.warn("#trackBitrateChange() > Bitrate is NaN, null or undefined: doing nothing.");
            return;
        }

        this.log("#trackBitrateChange() > Tracking a BITRATE_CHANGE event (bitrate=" + this._qosInfo.bitrate + ").");

        // Track the BITRATE_CHANGE event.
        this._enqueueHeartbeatCall(this._heartbeat.bitrateChange, [this._qosInfo.bitrate]);
    };

    VideoHeartbeat.prototype.trackVideoPlayerError = function(errorId) {
        if (this._isDestroyed) {
            this.warn("#trackVideoPlayerError() > Unable to track: instance previously destroyed.");
            this._executeErrorCallback("Illegal operation.", "Instance previously destroyed.");

            return;
        }

        if (!this._isViewingSessionActive) {
            this.warn("#trackVideoPlayerError() > Unable to track: no active tracking session.");
            return;
        }

        if (this._errorInfo) {
            this.warn("#trackVideoPlayerError() > Unable to track: in ERROR state.");
            return;
        }

        this.log("#trackVideoPlayerError() > Tracking an PLAYER_ERROR event (" +
              "errorId=" + errorId +
            ", playhead=" + this._videoInfo.playhead +
            ").");

        // Track the error event.
        this._enqueueHeartbeatCall(this._heartbeat.trackError, [ERROR_SOURCE_PLAYER, errorId, this._videoInfo.playhead]);
    };

    VideoHeartbeat.prototype.trackApplicationError = function(errorId) {
        if (this._isDestroyed) {
            this.warn("#trackApplicationError() > Unable to track: instance previously destroyed.");
            this._executeErrorCallback("Illegal operation.", "Instance previously destroyed.");

            return;
        }

        if (!this._isViewingSessionActive) {
            this.warn("#trackApplicationError() > Unable to track: no active tracking session.");
            return;
        }

        if (this._errorInfo) {
            this.warn("#trackApplicationError() > Unable to track: in ERROR state.");
            return;
        }

        this.log(this, "#trackApplicationError() > Tracking an APPLICATION_ERROR event (" +
              "errorId=" + errorId +
            ", playhead=" + this._videoInfo.playhead +
            ").");

        // Track the ERROR event.
        this._enqueueHeartbeatCall(this._heartbeat.trackError, [ERROR_SOURCE_APPLICATION, errorId, this._videoInfo.playhead]);
    };

    // Export symbols.
    va.VideoHeartbeat = VideoHeartbeat;
})(core, va, heartbeat, utils);




//Export symbols
global.ADB || (global.ADB = {});
global.ADB.core || (global.ADB.core = core);
global.ADB.va = va;

})(this);