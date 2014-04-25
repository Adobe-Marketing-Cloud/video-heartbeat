(function(ADB, Configuration, SamplePlayerDelegate) {
    'use strict';

    var NotificationCenter = ADB.core.NotificationCenter;
    var VideoHeartbeat = ADB.va.VideoHeartbeat;
    var ConfigData = ADB.va.ConfigData;

    function AnalyticsProvider(appMeasurement) {
        this._appMeasurement = appMeasurement;

        this._player = null;
        this._videoHeartbeat = null;
        this._playerDelegate = null;
    }

    AnalyticsProvider.prototype.attachToPlayer = function(player) {
        if (this._player) {
            this.detachFromPlayer();
        }

        this._player = player;

        // We register as observers to various VideoPlayer events.
        NotificationCenter().addEventListener(PlayerEvent.VIDEO_LOAD, this._onLoad, this);
        NotificationCenter().addEventListener(PlayerEvent.VIDEO_UNLOAD, this._onUnload, this);
        NotificationCenter().addEventListener(PlayerEvent.PLAY, this._onPlay, this);
        NotificationCenter().addEventListener(PlayerEvent.PAUSE, this._onPause, this);
        NotificationCenter().addEventListener(PlayerEvent.SEEK_START, this._onSeekStart, this);
        NotificationCenter().addEventListener(PlayerEvent.SEEK_COMPLETE, this._onSeekComplete, this);
        NotificationCenter().addEventListener(PlayerEvent.COMPLETE, this._onComplete, this);

        this._playerDelegate  = new SamplePlayerDelegate(this._player);

        var configData = new ConfigData(Configuration.HEARTBEAT.TRACKING_SERVER,
            Configuration.HEARTBEAT.JOB_ID,
            Configuration.HEARTBEAT.PUBLISHER);

        configData.ovp = Configuration.HEARTBEAT.OVP;
        configData.sdk = Configuration.HEARTBEAT.SDK;
        configData.channel = Configuration.HEARTBEAT.CHANNEL;

        // Comment or explicitly set this to false for production sites.
        configData.debugLogging = true;

        this._videoHeartbeat = new VideoHeartbeat(this._appMeasurement, this._playerDelegate);
        this._videoHeartbeat.configure(configData);
    };

    AnalyticsProvider.prototype.detachFromPlayer = function() {
        if (this._player) {
            this._videoHeartbeat.destroy();
            this._videoHeartbeat = null;
            this._playerDelegate = null;

            NotificationCenter().removeAllListeners(this);
            this._player = null;
        }
    };

    AnalyticsProvider.prototype._onLoad = function(e) {
        console.log('Player event: VIDEO_LOAD');
        this._videoHeartbeat.trackVideoLoad();
    };

    AnalyticsProvider.prototype._onUnload = function(e) {
        console.log('Player event: VIDEO_UNLOAD');
        this._videoHeartbeat.trackVideoUnload();
    };

    AnalyticsProvider.prototype._onPlay = function(e) {
        console.log('Player event: PLAY');
        this._videoHeartbeat.trackPlay();
    };

    AnalyticsProvider.prototype._onPause = function(e) {
        console.log('Player event: PAUSE');
        this._videoHeartbeat.trackPause();
    };

    AnalyticsProvider.prototype._onSeekStart = function(e) {
        console.log('Player event: SEEK_START');
        this._videoHeartbeat.trackSeekStart();
    };

    AnalyticsProvider.prototype._onSeekComplete = function(e) {
        console.log('Player event: SEEK_COMPLETE');
        this._videoHeartbeat.trackSeekComplete();
    };

    AnalyticsProvider.prototype._onComplete = function(e) {
        console.log('Player event: COMPLETE');
        this._videoHeartbeat.trackComplete();
    };

    // Export symbols.
    window.AnalyticsProvider = AnalyticsProvider;
})(window.ADB, window.Configuration, window.SamplePlayerDelegate);
