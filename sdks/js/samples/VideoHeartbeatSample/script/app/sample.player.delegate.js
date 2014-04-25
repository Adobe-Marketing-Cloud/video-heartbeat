(function(ADB) {
    'use strict';

    var extend = ADB.core.extend;
    var PlayerDelegate = ADB.va.PlayerDelegate;
    var VideoInfo = ADB.va.VideoInfo;

    extend(SamplePlayerDelegate, PlayerDelegate);

    function SamplePlayerDelegate(player) {
        SamplePlayerDelegate.__super__.constructor.call(this);

        this._player = player;
    }

    SamplePlayerDelegate.prototype.getVideoInfo = function() {
        var videoInfo = new VideoInfo();

        videoInfo.id = this._player.videoId;
        videoInfo.playerName = this._player.playerName;
        videoInfo.length = this._player.getDuration();
        videoInfo.streamType = this._player.streamType;
        videoInfo.playhead = this._player.getPlayhead();

        return videoInfo;
    };

    SamplePlayerDelegate.prototype.getAdBreakInfo = function() {
        // This sample app. does not support ad-tracking workflows.
        return null;
    };

    SamplePlayerDelegate.prototype.getAdInfo = function() {
        // This sample app. does not support ad-tracking workflows.
        return null;
    };

    SamplePlayerDelegate.prototype.getChapterInfo = function() {
        // This sample app. does not support chapter-tracking workflows.
        return null;
    };

    SamplePlayerDelegate.prototype.getQoSInfo = function() {
        // This sample app. does not support QoS-tracking workflows.
        return null;
    };

    SamplePlayerDelegate.prototype.onError = function(errorInfo) {
        console.log("VideoAnalytics error. Message: "+ errorInfo.message +
                    ". Details: " + errorInfo.details + ".")
    };

    // Export symbols.
    window.SamplePlayerDelegate = SamplePlayerDelegate;
})(window.ADB);
