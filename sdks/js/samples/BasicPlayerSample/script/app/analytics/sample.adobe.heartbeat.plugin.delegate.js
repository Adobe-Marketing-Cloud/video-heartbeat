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

    var AdobeHeartbeatPluginDelegate = ADB.va.plugins.ah.AdobeHeartbeatPluginDelegate;

    $.extend(SampleAdobeHeartbeatPluginDelegate.prototype, AdobeHeartbeatPluginDelegate.prototype);

    function SampleAdobeHeartbeatPluginDelegate() {
    }

    SampleAdobeHeartbeatPluginDelegate.prototype.onError = function(errorInfo) {
        console.log("AdobeHeartbeatPlugin error: " + errorInfo.getMessage() + " | " + errorInfo.getDetails());
    };

    // Export symbols.
    window.SampleAdobeHeartbeatPluginDelegate = SampleAdobeHeartbeatPluginDelegate;
})();
