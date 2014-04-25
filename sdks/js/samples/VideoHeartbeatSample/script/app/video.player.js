(function($, ADB, Configuration) {
    'use strict';

    var Event = ADB.core.Event;
    var extend = ADB.core.extend;
    var NotificationCenter = ADB.core.NotificationCenter;

    extend(PlayerEvent, Event);

    function PlayerEvent(type, data) {
        PlayerEvent.__super__.constructor.call(this, type, data);
    }

    PlayerEvent.VIDEO_LOAD = 'video_load';
    PlayerEvent.VIDEO_UNLOAD = 'video_unload';
    PlayerEvent.PLAY = 'play';
    PlayerEvent.PAUSE = 'pause';
    PlayerEvent.COMPLETE = 'COMPLETE';
    PlayerEvent.BUFFER_START = 'buffer_start';
    PlayerEvent.BUFFER_COMPLETE = 'buffer_complete';
    PlayerEvent.SEEK_START = 'seek_start';
    PlayerEvent.SEEK_COMPLETE = 'seek_complete';



    function VideoPlayer(id) {
        this.playerName = Configuration.PLAYER.NAME;
        this.videoId = Configuration.PLAYER.VIDEO_ID;
        this.streamType = ADB.va.ASSET_TYPE_VOD;

        this._isLoaded = false;

        this.$el = $('#' + id);

        if (this.$el) {
            this.$el.on('loadstart', this._onLoad);
            this.$el.on('play', this._onPlay);
            this.$el.on('seeking', this._onSeekStart);
            this.$el.on('seeked', this._onSeekComplete);
            this.$el.on('pause', this._onPause);
            this.$el.on('ended', this._onComplete);
        }
    }

    VideoPlayer.prototype.getDuration = function () {
        return this.$el.get(0).duration;
    };

    VideoPlayer.prototype.getPlayhead = function () {
        return this.$el.get(0).currentTime;
    };

    VideoPlayer.prototype._onPlay = function(e) {
        if (!this._isLoaded) {
            NotificationCenter().dispatchEvent(new PlayerEvent(PlayerEvent.VIDEO_LOAD));
            this._isLoaded = true;
        }

        NotificationCenter().dispatchEvent(new PlayerEvent(PlayerEvent.PLAY));
    };

    VideoPlayer.prototype._onPause = function(e) {
        NotificationCenter().dispatchEvent(new PlayerEvent(PlayerEvent.PAUSE));
    };

    VideoPlayer.prototype._onSeekStart = function(e) {
        NotificationCenter().dispatchEvent(new PlayerEvent(PlayerEvent.SEEK_START));
    };

    VideoPlayer.prototype._onSeekComplete = function(e) {
        NotificationCenter().dispatchEvent(new PlayerEvent(PlayerEvent.SEEK_COMPLETE));
    };

    VideoPlayer.prototype._onComplete = function(e) {
        NotificationCenter().dispatchEvent(new PlayerEvent(PlayerEvent.COMPLETE));
        NotificationCenter().dispatchEvent(new PlayerEvent(PlayerEvent.VIDEO_UNLOAD));

        this._isLoaded = false;
    };

    // Export symbols.
    window.VideoPlayer = VideoPlayer;
    window.PlayerEvent = PlayerEvent;
})(jQuery, window.ADB, window.Configuration);
