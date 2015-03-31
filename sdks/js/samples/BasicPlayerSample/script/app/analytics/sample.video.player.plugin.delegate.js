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

    var VideoPlayerPluginDelegate = ADB.va.plugins.videoplayer.VideoPlayerPluginDelegate;

    $.extend(SampleVideoPlayerPluginDelegate.prototype, VideoPlayerPluginDelegate.prototype);

    function SampleVideoPlayerPluginDelegate(player) {
        this._player = player;
    }

    SampleVideoPlayerPluginDelegate.prototype.getVideoInfo = function() {
        return this._player.getVideoInfo();
    };

    SampleVideoPlayerPluginDelegate.prototype.getAdBreakInfo = function() {
        return this._player.getAdBreakInfo();
    };

    SampleVideoPlayerPluginDelegate.prototype.getAdInfo = function() {
        return this._player.getAdInfo();
    };

    SampleVideoPlayerPluginDelegate.prototype.getChapterInfo = function() {
        return this._player.getChapterInfo();
    };

    SampleVideoPlayerPluginDelegate.prototype.getQoSInfo = function() {
        return this._player.getQoSInfo();
    };

    // Export symbols.
    window.SampleVideoPlayerPluginDelegate = SampleVideoPlayerPluginDelegate;
})();
