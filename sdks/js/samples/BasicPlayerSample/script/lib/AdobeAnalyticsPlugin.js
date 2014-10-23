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
(function(core, plugins, utils) {
    'use strict';

    var CommandQueue = core.radio.CommandQueue;
    var Command = core.radio.Command;
    var InputDataSanitizer = core.InputDataSanitizer;
    var MD5 = utils.md5;

    var BasePlugin = core.plugin.BasePlugin;
    core.extend(AdobeAnalyticsPlugin, BasePlugin);

    // private constants
    var NAME = "adobe-analytics";

    var PLAYER_PLUGIN = "player";
    var CONFIG_PLUGIN = "config";

    var VIDEO_START = "video_start";
    var AD_START = "ad_start";

    var VIDEO_INFO = "video_info";
    var AD_BREAK_INFO = "ad_break_info";
    var AD_INFO = "ad_info";

    var CHANNEL = "channel";
    var IS_PRIMETIME = "is_primetime";

    var RSID = "rsid";
    var TRACKING_SERVER = "tracking_server";
    var USE_SSL = "use_ssl";
    var VISITOR_ID = "visitor_id";
    var ANALYTICS_VISITOR_ID = "analytics_visitor_id";
    var MARKETING_CLOUD_VISITOR_ID = "marketing_cloud_visitor_id";

    var COMMAND_DELAY = 2000;

    var AA_CONTENT_TYPE_VIDEO = "video";
    var AA_CONTENT_TYPE_AD = "videoAd";
    var AA_START = "ms_s";
    var AA_START_PRIMETIME = "msp_s";
    var AA_START_AD = "msa_s";
    var AA_START_AD_PRIMETIME = "mspa_s";


    /**
     * @extends {BasePlugin}
     * @constructor
     */
    function AdobeAnalyticsPlugin(appMeasurement) {
        AdobeAnalyticsPlugin.__super__.constructor.call(this, NAME);

        if (!appMeasurement) {
            var errorMsg = "The reference to the player delegate implementation cannot be NULL.";
            this.error(this + " " + errorMsg);
        }
        this._appMeasurement = appMeasurement;

        this._workQueue = new CommandQueue(true, COMMAND_DELAY);
        this._inputDataSanitizer = new InputDataSanitizer(this._onInvalidInputData, this);
    }

    //
    //---------------------[ Public API ]---------------------
    //
    AdobeAnalyticsPlugin.prototype.bootstrap = function(pluginManager) {
        // Do the plugin core bootstrapping.
        AdobeAnalyticsPlugin.__super__.bootstrap.call(this, pluginManager);

        // We need to hook into the video/ad START events
        // to send the corresponding calls into the AdobeAnalytics back-end.
        this._pluginManager.on(PLAYER_PLUGIN, VIDEO_START, this._onPlayerVideoStart, this);
        this._pluginManager.on(PLAYER_PLUGIN, AD_START, this._onPlayerAdStart, this);

        // Set handlers for the requests we are able to handle.
        var appMap = {};
        appMap[RSID]                       = "account";
        appMap[TRACKING_SERVER]            = "trackingServer";
        appMap[USE_SSL]                    = "ssl";
        appMap[VISITOR_ID]                 = "visitorID";
        appMap[ANALYTICS_VISITOR_ID]       = "analyticsVisitorID";
        appMap[MARKETING_CLOUD_VISITOR_ID] = "marketingCloudVisitorID";

        this._dataResolver = function(key) {
            return (this._isEnabled) ? this._appMeasurement[appMap[key]] : null;
        };

        // Prepare the plugin for tracking (grab the Visitor ID values)
        this._prepareAppMeasurement();
    };

    AdobeAnalyticsPlugin.prototype.setup = function() {
        // Do nothing.
    };

    //
    //---------------------[ Protected API ]---------------------
    //
    AdobeAnalyticsPlugin.prototype._teardown = function() {
        this._pluginManager.off(PLAYER_PLUGIN, VIDEO_START, this._onPlayerVideoStart, this);
        this._pluginManager.off(PLAYER_PLUGIN, AD_START, this._onPlayerAdStart, this);
    };

    //
    // -------------------[ Event handlers ]-----------------------
    //
    AdobeAnalyticsPlugin.prototype._onPlayerVideoStart = function() {
        this._enqueueCall("aa.open", this._executeAdobeAnalyticsOpen);
    };

    AdobeAnalyticsPlugin.prototype._onPlayerAdStart = function() {
        this._enqueueCall("aa.openAd", this._executeAdobeAnalyticsOpenAd);
    };

    //
    // -------------------[ Private helper methods ]-----------------------
    //
    // TODO: can we find a different way to do this?
    AdobeAnalyticsPlugin.prototype._resetAppMeasurementContextData = function() {
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

    AdobeAnalyticsPlugin.prototype._enqueueCall = function(name, fn, args) {
        if (!this._isInitialized) {
            this.log("#_enqueueCall() : " + name);
            this._workQueue.addCommand(new Command(fn, this, args));
        } else {
            // TODO: this optimization should be removed or pushed down to CommandQueue.addCommand
            if (!this._workQueue.isEmpty()) { // even if we are ready
                // if there is pending work, we need to enqueue
                this.log("#_enqueueCall() : " + name);
                this._workQueue.addCommand(new Command(fn, this, args));
            } else {
                fn.apply(this, args);
            }
        }
    };

    AdobeAnalyticsPlugin.prototype._executeAdobeAnalyticsOpen = function() {
        // Fast exit.
        if (!this._canProcess()) return;

        // Query the player delegate to for the video info.
        var videoInfo = this._pluginManager.request(PLAYER_PLUGIN, VIDEO_INFO);
        // Sanitize the input data
        if (!this._inputDataSanitizer.sanitizeVideoInfo(videoInfo)) return;

        this.log("#_executeAdobeAnalyticsOpen(" +
            "id=" + videoInfo.id +
            ", length=" + videoInfo.length +
            ", streamType=" + videoInfo.streamType +
            ", playerName=" + videoInfo.playerName +
            ")");

        // Make sure that AdobeAnalytics start call is fired over the network.

        this._resetAppMeasurementContextData();

        this._appMeasurement.contextData["a.contentType"]           = AA_CONTENT_TYPE_VIDEO;

        this._appMeasurement.contextData["a.media.name"]            = videoInfo.id;
        this._appMeasurement.contextData["a.media.friendlyName"]    = videoInfo.name || "";
        this._appMeasurement.contextData["a.media.length"]          = Math.floor(videoInfo.length) || "0.0";
        this._appMeasurement.contextData["a.media.playerName"]      = videoInfo.playerName;
        this._appMeasurement.contextData["a.media.channel"]         = this._pluginManager.request(CONFIG_PLUGIN, CHANNEL);
        this._appMeasurement.contextData["a.media.view"]            = true;

        this._appMeasurement.pev3 = AA_CONTENT_TYPE_VIDEO;
        this._appMeasurement.pe   = this._pluginManager.request(CONFIG_PLUGIN, IS_PRIMETIME)
                                    ? AA_START_PRIMETIME : AA_START;

        this._appMeasurement.track();
    };


    AdobeAnalyticsPlugin.prototype._executeAdobeAnalyticsOpenAd = function() {
        // Fast exit.
        if (!this._canProcess()) return;

        // Query the player delegate to for the video info.
        var videoInfo = this._pluginManager.request(PLAYER_PLUGIN, VIDEO_INFO);
        // Sanitize the input data
        if (!this._inputDataSanitizer.sanitizeVideoInfo(videoInfo)) return;

        // Query the player delegate to for the video info.
        var adBreakInfo = this._pluginManager.request(PLAYER_PLUGIN, AD_BREAK_INFO);
        // Sanitize the input data
        if (!this._inputDataSanitizer.sanitizeAdBreakInfo(adBreakInfo)) return;

        // Query the player delegate to for the video info.
        var adInfo = this._pluginManager.request(PLAYER_PLUGIN, AD_INFO);
        // Sanitize the input data
        if (!this._inputDataSanitizer.sanitizeAdInfo(adInfo)) return;

        var podId = MD5(videoInfo.id) + "_" + adBreakInfo.position;

        this.log("#_executeAdobeAnalyticsOpenAd(" +
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

        this._appMeasurement.contextData["a.contentType"]               = AA_CONTENT_TYPE_AD;

        this._appMeasurement.contextData["a.media.name"]                = videoInfo.id;
        this._appMeasurement.contextData["a.media.channel"]             = this._pluginManager.request(CONFIG_PLUGIN, CHANNEL);

        this._appMeasurement.contextData["a.media.ad.name"]             = adInfo.id;
        this._appMeasurement.contextData["a.media.ad.friendlyName"]     = adInfo.name || "";
        this._appMeasurement.contextData["a.media.ad.podFriendlyName"]  = adBreakInfo.name || "";
        this._appMeasurement.contextData["a.media.ad.length"]           = Math.floor(adInfo.length) || "0.0";
        this._appMeasurement.contextData["a.media.ad.playerName"]       = adBreakInfo.playerName;
        this._appMeasurement.contextData["a.media.ad.pod"]              = podId;
        this._appMeasurement.contextData["a.media.ad.podPosition"]      = Math.floor(adInfo.position) || "0.0";
        this._appMeasurement.contextData["a.media.ad.podSecond"]        = Math.floor(adBreakInfo.startTime) || "0.0";
        this._appMeasurement.contextData["a.media.ad.CPM"]              = adInfo.cpm;
        this._appMeasurement.contextData["a.media.ad.view"]             = true;

        this._appMeasurement.pev3 = AA_CONTENT_TYPE_AD;
        this._appMeasurement.pe   = this._pluginManager.request(CONFIG_PLUGIN, IS_PRIMETIME)
                                    ? AA_START_AD_PRIMETIME : AA_START_AD;

        this._appMeasurement.track();
    };

    AdobeAnalyticsPlugin.prototype._prepareAppMeasurement = function() {
        if (this._appMeasurement.isReadyToTrack()) {
            this._onAppMeasurementReady();
        } else {
            this._appMeasurement.callbackWhenReadyToTrack(this, this._onAppMeasurementReady);
        }
    };

    AdobeAnalyticsPlugin.prototype._onAppMeasurementReady = function() {
        // If we have an error, we just clear the work-queues and exit.
        if (this._pluginManager.request(BasePlugin.STATE_PLUGIN, BasePlugin.ERROR_INFO)) {
            this.log("#_onAppMeasurementReady() > Unable to track: in ERROR state.");

            this._workQueue.cancelAllCommands();
            return;
        }

        // Drain the work queue.
        this._workQueue.resume();
        AdobeAnalyticsPlugin.__super__.setup.call(this);
    };

    // Export symbols.
    plugins.AdobeAnalyticsPlugin = AdobeAnalyticsPlugin;
})(global.ADB.core, global.ADB.va.plugins, global.ADB.va.utils);

//Export symbols

})(this);