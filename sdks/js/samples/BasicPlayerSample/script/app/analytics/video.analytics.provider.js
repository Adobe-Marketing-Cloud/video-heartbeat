/*
 * ADOBE SYSTEMS INCORPORATED
 * Copyright 2014 Adobe Systems Incorporated
 * All Rights Reserved.

 * NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
 * terms of the Adobe license agreement accompanying it.  If you have received this file from a
 * source other than Adobe, then your use, modification, or distribution of it requires the prior
 * written permission of Adobe.
 */

(function() {
    'use strict';

    var Heartbeat = ADB.va.Heartbeat;
    var HeartbeatConfig = ADB.va.HeartbeatConfig;

    var VideoPlayerPlugin = ADB.va.plugins.videoplayer.VideoPlayerPlugin;
    var VideoPlayerPluginConfig = ADB.va.plugins.videoplayer.VideoPlayerPluginConfig;

    var AdobeAnalyticsPlugin = ADB.va.plugins.aa.AdobeAnalyticsPlugin;
    var AdobeAnalyticsPluginConfig = ADB.va.plugins.aa.AdobeAnalyticsPluginConfig;
    var VideoMetadataKeys = ADB.va.plugins.aa.VideoMetadataKeys;
    var AdMetadataKeys = ADB.va.plugins.aa.AdMetadataKeys;

    var AdobeHeartbeatPlugin = ADB.va.plugins.ah.AdobeHeartbeatPlugin;
    var AdobeHeartbeatPluginConfig = ADB.va.plugins.ah.AdobeHeartbeatPluginConfig;


    function VideoAnalyticsProvider(player) {
        if (!player) {
            throw new Error("Illegal argument. Player reference cannot be null.")
        }
        this._player = player;

        // Set-up the Visitor and AppMeasurement instances.
        var visitor = new Visitor(Configuration.VISITOR.MARKETING_CLOUD_ORG_ID);
        visitor.trackingServer = Configuration.VISITOR.TRACKING_SERVER;
        visitor.setCustomerIDs({
            "userId": {
                "id": Configuration.VISITOR.DPID
            },
            "puuid": {
                "id": Configuration.VISITOR.DPUUID
            }
        });

        // Set-up the AppMeasurement component.
        var appMeasurement = new AppMeasurement();
        appMeasurement.visitor = visitor;
        appMeasurement.trackingServer = Configuration.APP_MEASUREMENT.TRACKING_SERVER;
        appMeasurement.account = Configuration.APP_MEASUREMENT.RSID;
        appMeasurement.pageName = Configuration.APP_MEASUREMENT.PAGE_NAME;
        appMeasurement.charSet = "UTF-8";
        appMeasurement.visitorID = "test-vid";
        appMeasurement.callback = 1;

        // Setup the video-player plugin
        this._playerPlugin = new VideoPlayerPlugin(new SampleVideoPlayerPluginDelegate(this._player));
        var playerPluginConfig = new VideoPlayerPluginConfig();
        playerPluginConfig.debugLogging = true; // set this to false for production apps.
        this._playerPlugin.configure(playerPluginConfig);

        // Setup the AppMeasurement plugin.
        this._aaPlugin = new AdobeAnalyticsPlugin(appMeasurement, new SampleAdobeAnalyticsPluginDelegate());
        var aaPluginConfig = new AdobeAnalyticsPluginConfig();
        aaPluginConfig.channel = Configuration.HEARTBEAT.CHANNEL;
        aaPluginConfig.debugLogging = true; // set this to false for production apps.
        this._aaPlugin.configure(aaPluginConfig);

        // Setup the AdobeHeartbeat plugin.
        var ahPlugin = new AdobeHeartbeatPlugin(new SampleAdobeHeartbeatPluginDelegate());
        var ahPluginConfig = new AdobeHeartbeatPluginConfig(
            Configuration.HEARTBEAT.TRACKING_SERVER,
            Configuration.HEARTBEAT.PUBLISHER);
        ahPluginConfig.ovp = Configuration.HEARTBEAT.OVP;
        ahPluginConfig.sdk = Configuration.HEARTBEAT.SDK;
        ahPluginConfig.debugLogging = true; // set this to false for production apps.
        ahPlugin.configure(ahPluginConfig);

        var plugins = [this._playerPlugin, this._aaPlugin, ahPlugin];

        // Setup and configure the Heartbeat lib.
        this._heartbeat = new Heartbeat(new SampleHeartbeatDelegate(), plugins);
        var configData = new HeartbeatConfig();
        configData.debugLogging = true; // set this to false for production apps.
        this._heartbeat.configure(configData);

        this._installEventListeners();
    }

    VideoAnalyticsProvider.prototype.destroy = function() {
        if (this._player) {
            this._heartbeat.destroy();
            this._heartbeat = null;

            this._uninstallEventListeners();
            this._player = null;
        }
    };


    /////////
    // Notification handlers
    /////////

    VideoAnalyticsProvider.prototype._onLoad = function() {
        console.log('Player event: VIDEO_LOAD');

        var contextData = {};
        // setting Standard Video Metadata
        contextData[VideoMetadataKeys.SEASON] = "sample season";
        contextData[VideoMetadataKeys.SHOW] = "sample show";
        contextData[VideoMetadataKeys.EPISODE] = "sample episode";
        contextData[VideoMetadataKeys.ASSET_ID] = "sample asset id";
        contextData[VideoMetadataKeys.GENRE] = "sample genre";
        contextData[VideoMetadataKeys.FIRST_AIR_DATE] = "sample air date";
        contextData[VideoMetadataKeys.FIRST_DIGITAL_DATE] = "sample digital date";
        contextData[VideoMetadataKeys.RATING] = "sample rating";
        contextData[VideoMetadataKeys.ORIGINATOR] = "sample originator";
        contextData[VideoMetadataKeys.NETWORK] = "sample network";
        contextData[VideoMetadataKeys.SHOW_TYPE] = "sample show type";
        contextData[VideoMetadataKeys.AD_LOAD] = "sample ad load";
        contextData[VideoMetadataKeys.MVPD] = "sample mvpd";
        contextData[VideoMetadataKeys.AUTHORIZED] = "true";
        contextData[VideoMetadataKeys.DAY_PART] = "sample day part";
        contextData[VideoMetadataKeys.FEED] = "sample feed";
        contextData[VideoMetadataKeys.STREAM_FORMAT] = "sample format";

        this._aaPlugin.setVideoMetadata(contextData);
        this._playerPlugin.trackVideoLoad();
    };

    VideoAnalyticsProvider.prototype._onUnload = function() {
        console.log('Player event: VIDEO_UNLOAD');
        this._playerPlugin.trackVideoUnload();
    };

    VideoAnalyticsProvider.prototype._onPlay = function() {
        console.log('Player event: PLAY');
        this._playerPlugin.trackPlay();
    };

    VideoAnalyticsProvider.prototype._onPause = function() {
        console.log('Player event: PAUSE');
        this._playerPlugin.trackPause();
    };

    VideoAnalyticsProvider.prototype._onSeekStart = function() {
        console.log('Player event: SEEK_START');
        this._playerPlugin.trackSeekStart();
    };

    VideoAnalyticsProvider.prototype._onSeekComplete = function() {
        console.log('Player event: SEEK_COMPLETE');
        this._playerPlugin.trackSeekComplete();
    };

    VideoAnalyticsProvider.prototype._onBufferStart = function() {
        console.log('Player event: BUFFER_START');
        this._playerPlugin.trackBufferStart();
    };

    VideoAnalyticsProvider.prototype._onBufferComplete = function() {
        console.log('Player event: BUFFER_COMPLETE');
        this._playerPlugin.trackBufferComplete();
    };

    VideoAnalyticsProvider.prototype._onAdStart = function() {
        console.log('Player event: AD_START');

        var contextData = {};
        // setting Standard Ad Metadata
        contextData[AdMetadataKeys.ADVERTISER] = "sample advertiser";
        contextData[AdMetadataKeys.CAMPAIGN_ID] = "sample campaign";
        contextData[AdMetadataKeys.CREATIVE_ID] = "sample creative";
        contextData[AdMetadataKeys.CREATIVE_URL] = "sample url";
        contextData[AdMetadataKeys.SITE_ID] = "sample site";
        contextData[AdMetadataKeys.PLACEMENT_ID] = "sample placement";

        this._aaPlugin.setAdMetadata(contextData);
        this._playerPlugin.trackAdStart();
    };

    VideoAnalyticsProvider.prototype._onAdComplete = function() {
        console.log('Player event: AD_COMPLETE');
        this._playerPlugin.trackAdComplete();
    };

    VideoAnalyticsProvider.prototype._onChapterStart = function() {
        console.log('Player event: CHAPTER_START');
        this._aaPlugin.setChapterMetadata({
            segmentType: "Sample segment type"
        });
        this._playerPlugin.trackChapterStart();
    };

    VideoAnalyticsProvider.prototype._onChapterComplete = function() {
        console.log('Player event: CHAPTER_COMPLETE');
        this._playerPlugin.trackChapterComplete();
    };

    VideoAnalyticsProvider.prototype._onComplete = function() {
        console.log('Player event: COMPLETE');
        this._playerPlugin.trackComplete(function() {
            console.log("The completion of the content has been tracked.");
        });
    };


    /////////
    // Private helper functions
    /////////

    VideoAnalyticsProvider.prototype._installEventListeners = function() {
        // We register as observers to various VideoPlayer events.
        NotificationCenter().addEventListener(PlayerEvent.VIDEO_LOAD, this._onLoad, this);
        NotificationCenter().addEventListener(PlayerEvent.VIDEO_UNLOAD, this._onUnload, this);
        NotificationCenter().addEventListener(PlayerEvent.PLAY, this._onPlay, this);
        NotificationCenter().addEventListener(PlayerEvent.PAUSE, this._onPause, this);
        NotificationCenter().addEventListener(PlayerEvent.SEEK_START, this._onSeekStart, this);
        NotificationCenter().addEventListener(PlayerEvent.SEEK_COMPLETE, this._onSeekComplete, this);
        NotificationCenter().addEventListener(PlayerEvent.BUFFER_START, this._onBufferStart, this);
        NotificationCenter().addEventListener(PlayerEvent.BUFFER_COMPLETE, this._onBufferComplete, this);
        NotificationCenter().addEventListener(PlayerEvent.AD_START, this._onAdStart, this);
        NotificationCenter().addEventListener(PlayerEvent.AD_COMPLETE, this._onAdComplete, this);
        NotificationCenter().addEventListener(PlayerEvent.CHAPTER_START, this._onChapterStart, this);
        NotificationCenter().addEventListener(PlayerEvent.CHAPTER_COMPLETE, this._onChapterComplete, this);
        NotificationCenter().addEventListener(PlayerEvent.COMPLETE, this._onComplete, this);
    };

    VideoAnalyticsProvider.prototype._uninstallEventListeners = function() {
        // We register as observers to various VideoPlayer events.
        NotificationCenter().removeEventListener(PlayerEvent.VIDEO_LOAD, this._onLoad, this);
        NotificationCenter().removeEventListener(PlayerEvent.VIDEO_UNLOAD, this._onUnload, this);
        NotificationCenter().removeEventListener(PlayerEvent.PLAY, this._onPlay, this);
        NotificationCenter().removeEventListener(PlayerEvent.PAUSE, this._onPause, this);
        NotificationCenter().removeEventListener(PlayerEvent.SEEK_START, this._onSeekStart, this);
        NotificationCenter().removeEventListener(PlayerEvent.SEEK_COMPLETE, this._onSeekComplete, this);
        NotificationCenter().removeEventListener(PlayerEvent.BUFFER_START, this._onBufferStart, this);
        NotificationCenter().removeEventListener(PlayerEvent.BUFFER_COMPLETE, this._onBufferComplete, this);
        NotificationCenter().removeEventListener(PlayerEvent.AD_START, this._onAdStart, this);
        NotificationCenter().removeEventListener(PlayerEvent.AD_COMPLETE, this._onAdComplete, this);
        NotificationCenter().removeEventListener(PlayerEvent.CHAPTER_START, this._onChapterStart, this);
        NotificationCenter().removeEventListener(PlayerEvent.CHAPTER_COMPLETE, this._onChapterComplete, this);
        NotificationCenter().removeEventListener(PlayerEvent.COMPLETE, this._onComplete, this);
    };

    // Export symbols.
    window.VideoAnalyticsProvider = VideoAnalyticsProvider;
})();
