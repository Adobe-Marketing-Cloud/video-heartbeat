/*
 * ADOBE SYSTEMS INCORPORATED
 * Copyright 2014 Adobe Systems Incorporated
 * All Rights Reserved.

 * NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
 * terms of the Adobe license agreement accompanying it.  If you have received this file from a
 * source other than Adobe, then your use, modification, or distribution of it requires the prior
 * written permission of Adobe.
 */

(function($, ADB, Configuration) {
    'use strict';

    var Event = ADB.core.radio.Event;
    var extend = ADB.core.extend;

    var VideoInfo = ADB.va.VideoInfo;
    var AdBreakInfo = ADB.va.AdBreakInfo;
    var AdInfo = ADB.va.AdInfo;
    var ChapterInfo = ADB.va.ChapterInfo;

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
    PlayerEvent.AD_START = "ad_start";
    PlayerEvent.AD_COMPLETE = "ad_complete";
    PlayerEvent.CHAPTER_START = "chapter_start";
    PlayerEvent.CHAPTER_COMPLETE = "chapter_complete";


    // This sample VideoPlayer simulates a mid-roll ad at time 15:
    var AD_START_POS = 15;
    var AD_END_POS = 30;
    var AD_LENGTH = 15;

    var CHAPTER1_START_POS = 0;
    var CHAPTER1_END_POS = 15;
    var CHAPTER1_LENGTH = 15;

    var CHAPTER2_START_POS = 30;
    var CHAPTER2_LENGTH = 30;

    var MONITOR_TIMER_INTERVAL = 500;

    function VideoPlayer(id) {
        this.playerName = Configuration.PLAYER.NAME;
        this.videoId = Configuration.PLAYER.VIDEO_ID;
        this.streamType = ADB.va.ASSET_TYPE_VOD;

        this._videoLoaded = false;
        this._videoInfo = null;
        this._adBreakInfo = null;
        this._adInfo = null;
        this._chapterInfo = null;

        this._clock = null;

        this.$el = $('#' + id);

        var self = this;
        if (this.$el) {
            this.$el.on('play', function() { self._onPlay(); });
            this.$el.on('seeking', function() { self._onSeekStart(); });
            this.$el.on('seeked', function() { self._onSeekComplete(); });
            this.$el.on('pause', function() { self._onPause(); });
            this.$el.on('ended', function() { self._onComplete(); });
        }
    }

    VideoPlayer.prototype.getVideoInfo = function() {
        if (this._adInfo) { // During ad playback the main video playhead remains
                            // constant at where it was when the ad started
            this._videoInfo.playhead = AD_START_POS;
        } else {
            var vTime = this.getPlayhead();
            this._videoInfo.playhead = (vTime < AD_START_POS) ? vTime : vTime - AD_LENGTH;
        }

        return this._videoInfo;
    };

    VideoPlayer.prototype.getAdBreakInfo = function() {
        return this._adBreakInfo;
    };

    VideoPlayer.prototype.getAdInfo = function() {
        return this._adInfo;
    };

    VideoPlayer.prototype.getChapterInfo = function() {
        return this._chapterInfo;
    };

    VideoPlayer.prototype.getDuration = function () {
        return this.$el.get(0).duration;
    };

    VideoPlayer.prototype.getPlayhead = function () {
        return this.$el.get(0).currentTime;
    };

    VideoPlayer.prototype._onPlay = function(e) {
        if (!this._videoLoaded) {
            this._startVideo();
            this._startChapter1();

            // Start the monitor timer.
            var self = this;
            this._clock = setInterval(function() { self._onTick(); }, MONITOR_TIMER_INTERVAL);
        }

        DefaultCommCenter().trigger(new PlayerEvent(PlayerEvent.PLAY));
    };

    VideoPlayer.prototype._onPause = function(e) {
        DefaultCommCenter().trigger(new PlayerEvent(PlayerEvent.PAUSE));
    };

    VideoPlayer.prototype._onSeekStart = function(e) {
        DefaultCommCenter().trigger(new PlayerEvent(PlayerEvent.SEEK_START));
    };

    VideoPlayer.prototype._onSeekComplete = function(e) {
        this._doPostSeekComputations();
        DefaultCommCenter().trigger(new PlayerEvent(PlayerEvent.SEEK_COMPLETE));
    };

    VideoPlayer.prototype._onComplete = function(e) {
        // Complete the second chapter
        this._completeChapter();

        DefaultCommCenter().trigger(new PlayerEvent(PlayerEvent.COMPLETE));

        DefaultCommCenter().trigger(new PlayerEvent(PlayerEvent.VIDEO_UNLOAD));

        clearInterval(this._clock);

        this._videoLoaded = false;
    };

    VideoPlayer.prototype._startVideo = function() {
        this._videoInfo = new VideoInfo();
        this._videoInfo.id = this.videoId;
        this._videoInfo.playerName = this.playerName;
        this._videoInfo.length = this.getDuration();
        this._videoInfo.streamType = this.streamType;
        this._videoInfo.playhead = this.getPlayhead();

        this._videoLoaded = true;

        DefaultCommCenter().trigger(new PlayerEvent(PlayerEvent.VIDEO_LOAD));
    };

    VideoPlayer.prototype._startChapter1 = function() {
        // Prepare the chapter info.
        this._chapterInfo = new ChapterInfo();
        this._chapterInfo.length = CHAPTER1_LENGTH;
        this._chapterInfo.startTime = CHAPTER1_START_POS;
        this._chapterInfo.position = 1;
        this._chapterInfo.name = "First chapter";

        DefaultCommCenter().trigger(new PlayerEvent(PlayerEvent.CHAPTER_START));
    };

    VideoPlayer.prototype._startChapter2 = function() {
        // Prepare the chapter info.
        this._chapterInfo = new ChapterInfo();
        this._chapterInfo.length = CHAPTER2_LENGTH;
        this._chapterInfo.startTime = CHAPTER2_START_POS;
        this._chapterInfo.position = 2;
        this._chapterInfo.name = "Second chapter";

        DefaultCommCenter().trigger(new PlayerEvent(PlayerEvent.CHAPTER_START));
    };

    VideoPlayer.prototype._completeChapter = function() {
        // Reset the chapter info.
        this._chapterInfo = null;

        DefaultCommCenter().trigger(new PlayerEvent(PlayerEvent.CHAPTER_COMPLETE));
    };

    VideoPlayer.prototype._startAd = function() {
        // Prepare the ad break info.
        this._adBreakInfo = new AdBreakInfo();
        this._adBreakInfo.name = "First Ad-Break";
        this._adBreakInfo.position = 1;
        this._adBreakInfo.playerName = this.playerName;
        this._adBreakInfo.startTime = AD_START_POS;

        // Prepare the ad info.
        this._adInfo = new AdInfo();
        this._adInfo.id = "001";
        this._adInfo.name = "Sample ad";
        this._adInfo.length = AD_LENGTH;
        this._adInfo.position = 1;
        this._adInfo.cpm = "49750702676yfh075757";

        // Start the ad.
        DefaultCommCenter().trigger(new PlayerEvent(PlayerEvent.AD_START));
    };

    VideoPlayer.prototype._completeAd = function() {
        // Complete the ad.
        DefaultCommCenter().trigger(new PlayerEvent(PlayerEvent.AD_COMPLETE));

        // Clear the ad and ad-break info.
        this._adInfo = null;
        this._adBreakInfo = null;
    };

    VideoPlayer.prototype._doPostSeekComputations = function() {
        var vTime = this.getPlayhead();

        // Seek inside the first chapter.
        if (vTime < CHAPTER1_START_POS) {
            // If we were not inside the first chapter before, trigger a chapter start
            if (!this._chapterInfo || this._chapterInfo.position != 1) {
                this._startChapter1();

                // If we were in the ad, clear the ad and ad-break info, but don't send the AD_COMPLETE event.
                if (this._adInfo) {
                    this._adInfo = null;
                    this._adBreakInfo = null;
                }
            }
        }

        // Seek inside the ad.
        else if (vTime >= AD_START_POS && vTime < AD_END_POS) {
            // If we were not inside the ad before, trigger an ad-start
            if (!this._adInfo) {
                this._startAd();

                // Also, clear the chapter info, without sending the CHAPTER_COMPLETE event.
                this._chapterInfo = null;
            }
        }

        // Seek inside the second chapter.
        else {
            // If we were not inside the 2nd chapter before, trigger a chapter start
            if (!this._chapterInfo || this._chapterInfo.position != 2) {
                this._startChapter2();

                // If we were in the ad, clear the ad and ad-break info, but don't send the AD_COMPLETE event.
                if (this._adInfo) {
                    this._adInfo = null;
                    this._adBreakInfo = null;
                }
            }
        }
    };

    VideoPlayer.prototype._onTick = function() {
        if (this.$el.get(0).seeking || this.$el.get(0).paused) {
            return;
        }

        var vTime = this.getPlayhead();

        // If we're inside the ad content:
        if (vTime >= AD_START_POS && vTime < AD_END_POS) {
            if (this._chapterInfo) {
                // If we were inside a chapter, complete it.
                this._completeChapter();
            }

            if (!this._adInfo) {
                // Start the ad (if not already started).
                this._startAd();
            }
        }

        // Otherwise, we're outside the ad content:
        else {
            if (this._adInfo) {
                // Complete the ad (if needed).
                this._completeAd();
            }

            if (vTime < CHAPTER1_END_POS) {
                if (this._chapterInfo && this._chapterInfo.position != 1) {
                    // If we were inside another chapter, complete it.
                    this._completeChapter();
                }

                if (!this._chapterInfo) {
                    // Start the first chapter.
                    this._startChapter1();
                }
            } else {
                if (this._chapterInfo && this._chapterInfo.position != 2) {
                    // If we were inside another chapter, complete it.
                    this._completeChapter();
                }

                if (!this._chapterInfo) {
                    // Start the second chapter.
                    this._startChapter2();
                }
            }
        }
    };

    // Export symbols.
    window.VideoPlayer = VideoPlayer;
    window.PlayerEvent = PlayerEvent;
})(jQuery, window.ADB, window.Configuration);
