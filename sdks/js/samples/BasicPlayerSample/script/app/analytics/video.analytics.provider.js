/*
 * ADOBE SYSTEMS INCORPORATED
 * Copyright 2014 Adobe Systems Incorporated
 * All Rights Reserved.

 * NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
 * terms of the Adobe license agreement accompanying it.  If you have received this file from a
 * source other than Adobe, then your use, modification, or distribution of it requires the prior
 * written permission of Adobe.
 */

(function(ADB, Configuration, VideoPlayerDelegate) {
    'use strict';

    var VideoHeartbeat = ADB.va.VideoHeartbeat;
    var AdobeAnalyticsPlugin = ADB.va.plugins.AdobeAnalyticsPlugin;
    var ConfigData = ADB.va.ConfigData;

    function VideoAnalyticsProvider(appMeasurement, player) {
        if (!appMeasurement) {
            throw new Error("Illegal argument. AppMeasurement reference cannot be null.")
        }

        if (!player) {
            throw new Error("Illegal argument. Player reference cannot be null.")
        }
        this._player = player;

        this._playerDelegate  = new VideoPlayerDelegate(this._player, this);
        this._appMeasurement = appMeasurement;

        var aaPlugin = new AdobeAnalyticsPlugin(appMeasurement);
        this._videoHeartbeat = new VideoHeartbeat(this._playerDelegate, [aaPlugin]);

        this._setupVideoHeartbeat();
        this._installEventListeners();
    }

    VideoAnalyticsProvider.prototype.destroy = function() {
        if (this._player) {
            this._videoHeartbeat.destroy();
            this._videoHeartbeat = null;
            this._playerDelegate = null;

            this._uninstallEventListeners();
            this._player = null;
        }
    };


    /////////
    // Notification handlers
    /////////

    VideoAnalyticsProvider.prototype._onLoad = function(e) {
        console.log('Player event: VIDEO_LOAD');
        this._videoHeartbeat.trackVideoLoad();
    };

    VideoAnalyticsProvider.prototype._onUnload = function(e) {
        console.log('Player event: VIDEO_UNLOAD');
        this._videoHeartbeat.trackVideoUnload();
    };

    VideoAnalyticsProvider.prototype._onPlay = function(e) {
        console.log('Player event: PLAY');
        this._videoHeartbeat.trackPlay();
    };

    VideoAnalyticsProvider.prototype._onPause = function(e) {
        console.log('Player event: PAUSE');
        this._videoHeartbeat.trackPause();
    };

    VideoAnalyticsProvider.prototype._onSeekStart = function(e) {
        console.log('Player event: SEEK_START');
        this._videoHeartbeat.trackSeekStart();
    };

    VideoAnalyticsProvider.prototype._onSeekComplete = function(e) {
        console.log('Player event: SEEK_COMPLETE');
        this._videoHeartbeat.trackSeekComplete();
    };

    VideoAnalyticsProvider.prototype._onBufferStart = function(e) {
        console.log('Player event: BUFFER_START');
        this._videoHeartbeat.trackBufferStart();
    };

    VideoAnalyticsProvider.prototype._onBufferComplete = function(e) {
        console.log('Player event: BUFFER_COMPLETE');
        this._videoHeartbeat.trackBufferComplete();
    };

    VideoAnalyticsProvider.prototype._onAdStart = function(e) {
        console.log('Player event: AD_START');
        this._videoHeartbeat.trackAdStart();
    };

    VideoAnalyticsProvider.prototype._onAdComplete = function(e) {
        console.log('Player event: AD_COMPLETE');
        this._videoHeartbeat.trackAdComplete();
    };

    VideoAnalyticsProvider.prototype._onChapterStart = function(e) {
        console.log('Player event: CHAPTER_START');
        this._videoHeartbeat.trackChapterStart();
    };

    VideoAnalyticsProvider.prototype._onChapterComplete = function(e) {
        console.log('Player event: CHAPTER_COMPLETE');
        this._videoHeartbeat.trackChapterComplete();
    };

    VideoAnalyticsProvider.prototype._onComplete = function(e) {
        console.log('Player event: COMPLETE');
        this._videoHeartbeat.trackComplete();
    };


    /////////
    // Private helper functions
    /////////

    VideoAnalyticsProvider.prototype._setupVideoHeartbeat = function() {
        var configData = new ConfigData(Configuration.HEARTBEAT.TRACKING_SERVER,
            Configuration.HEARTBEAT.JOB_ID,
            Configuration.HEARTBEAT.PUBLISHER);

        configData.ovp = Configuration.HEARTBEAT.OVP;
        configData.sdk = Configuration.HEARTBEAT.SDK;
        configData.channel = Configuration.HEARTBEAT.CHANNEL;

        // Comment or explicitly set this to false for production sites.
        configData.debugLogging = true;


        this._videoHeartbeat.configure(configData);
    };

    VideoAnalyticsProvider.prototype._installEventListeners = function() {
        // We register as observers to various VideoPlayer events.
        DefaultCommCenter().on(PlayerEvent.VIDEO_LOAD, this._onLoad, this);
        DefaultCommCenter().on(PlayerEvent.VIDEO_UNLOAD, this._onUnload, this);
        DefaultCommCenter().on(PlayerEvent.PLAY, this._onPlay, this);
        DefaultCommCenter().on(PlayerEvent.PAUSE, this._onPause, this);
        DefaultCommCenter().on(PlayerEvent.SEEK_START, this._onSeekStart, this);
        DefaultCommCenter().on(PlayerEvent.SEEK_COMPLETE, this._onSeekComplete, this);
        DefaultCommCenter().on(PlayerEvent.BUFFER_START, this._onBufferStart, this);
        DefaultCommCenter().on(PlayerEvent.BUFFER_COMPLETE, this._onBufferComplete, this);
        DefaultCommCenter().on(PlayerEvent.AD_START, this._onAdStart, this);
        DefaultCommCenter().on(PlayerEvent.AD_COMPLETE, this._onAdComplete, this);
        DefaultCommCenter().on(PlayerEvent.CHAPTER_START, this._onChapterStart, this);
        DefaultCommCenter().on(PlayerEvent.CHAPTER_COMPLETE, this._onChapterComplete, this);
        DefaultCommCenter().on(PlayerEvent.COMPLETE, this._onComplete, this);
    };

    VideoAnalyticsProvider.prototype._uninstallEventListeners = function() {
        // We register as observers to various VideoPlayer events.
        DefaultCommCenter().off(PlayerEvent.VIDEO_LOAD, this._onLoad, this);
        DefaultCommCenter().off(PlayerEvent.VIDEO_UNLOAD, this._onUnload, this);
        DefaultCommCenter().off(PlayerEvent.PLAY, this._onPlay, this);
        DefaultCommCenter().off(PlayerEvent.PAUSE, this._onPause, this);
        DefaultCommCenter().off(PlayerEvent.SEEK_START, this._onSeekStart, this);
        DefaultCommCenter().off(PlayerEvent.SEEK_COMPLETE, this._onSeekComplete, this);
        DefaultCommCenter().off(PlayerEvent.BUFFER_START, this._onBufferStart, this);
        DefaultCommCenter().off(PlayerEvent.BUFFER_COMPLETE, this._onBufferComplete, this);
        DefaultCommCenter().off(PlayerEvent.AD_START, this._onAdStart, this);
        DefaultCommCenter().off(PlayerEvent.AD_COMPLETE, this._onAdComplete, this);
        DefaultCommCenter().off(PlayerEvent.CHAPTER_START, this._onChapterStart, this);
        DefaultCommCenter().off(PlayerEvent.CHAPTER_COMPLETE, this._onChapterComplete, this);
        DefaultCommCenter().off(PlayerEvent.COMPLETE, this._onComplete, this);
    };


    // Export symbols.
    window.VideoAnalyticsProvider = VideoAnalyticsProvider;
})(window.ADB, window.Configuration, window.VideoPlayerDelegate);
