/*
 * ADOBE SYSTEMS INCORPORATED
 * Copyright 2015 Adobe Systems Incorporated
 * All Rights Reserved.

 * NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
 * terms of the Adobe license agreement accompanying it.  If you have received this file from a
 * source other than Adobe, then your use, modification, or distribution of it requires the prior
 * written permission of Adobe.
 */

(function() {
    'use strict';

    var HeartbeatDelegate = ADB.va.HeartbeatDelegate;

    $.extend(SampleHeartbeatDelegate.prototype, HeartbeatDelegate.prototype);

    function SampleHeartbeatDelegate() {
    }

    SampleHeartbeatDelegate.prototype.onError = function(errorInfo) {
        console.log("Heartbeat error: " + errorInfo.getMessage() + " | " + errorInfo.getDetails());
    };

    // Export symbols.
    window.SampleHeartbeatDelegate = SampleHeartbeatDelegate;
})();
