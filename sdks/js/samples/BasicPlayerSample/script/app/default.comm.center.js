/*
 * ADOBE SYSTEMS INCORPORATED
 * Copyright 2014 Adobe Systems Incorporated
 * All Rights Reserved.

 * NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
 * terms of the Adobe license agreement accompanying it.  If you have received this file from a
 * source other than Adobe, then your use, modification, or distribution of it requires the prior
 * written permission of Adobe.
 */

(function(core) {
    'use strict';

    var Channel = core.radio.Channel;

    function DefaultCommCenter() {
        // Provide a singleton CommCenter
        if (!DefaultCommCenter.prototype._instance) {
            DefaultCommCenter.prototype._instance = new Channel("sample-player");
        }

        return DefaultCommCenter.prototype._instance;
    }

    // Export symbols
    window.DefaultCommCenter = DefaultCommCenter;
})(window.ADB.core);