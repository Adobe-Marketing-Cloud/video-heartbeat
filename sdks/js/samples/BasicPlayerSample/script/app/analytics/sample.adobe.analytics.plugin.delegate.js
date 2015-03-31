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

    var AdobeAnalyticsPluginDelegate = ADB.va.plugins.aa.AdobeAnalyticsPluginDelegate;

    $.extend(SampleAdobeAnalyticsPluginDelegate.prototype, AdobeAnalyticsPluginDelegate.prototype);

    function SampleAdobeAnalyticsPluginDelegate() {
    }

    SampleAdobeAnalyticsPluginDelegate.prototype.onError = function(errorInfo) {
        console.log("AdobeAnalyticsPlugin error: " + errorInfo.getMessage() + " | " + errorInfo.getDetails());
    };

    // Export symbols.
    window.SampleAdobeAnalyticsPluginDelegate = SampleAdobeAnalyticsPluginDelegate;
})();
