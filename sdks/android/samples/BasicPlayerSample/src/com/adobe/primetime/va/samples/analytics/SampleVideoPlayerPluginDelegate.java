/*
 * ADOBE SYSTEMS INCORPORATED
 * Copyright 2014 Adobe Systems Incorporated
 * All Rights Reserved.

 * NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
 * terms of the Adobe license agreement accompanying it.  If you have received this file from a
 * source other than Adobe, then your use, modification, or distribution of it requires the prior
 * written permission of Adobe.
 */

package com.adobe.primetime.va.samples.analytics;

import com.adobe.primetime.va.plugins.videoplayer.*;
import com.adobe.primetime.va.samples.player.VideoPlayer;

class SampleVideoPlayerPluginDelegate extends VideoPlayerPluginDelegate {
    private static final String LOG_TAG = "[VideoHeartbeatSample]::" + SampleVideoPlayerPluginDelegate.class.getSimpleName();

    private final VideoPlayer _player;

    SampleVideoPlayerPluginDelegate(VideoPlayer player) {
        _player = player;
    }

    @Override
    public VideoInfo getVideoInfo() {
        return _player.getVideoInfo();
    }

    @Override
    public AdBreakInfo getAdBreakInfo() {
        return _player.getAdBreakInfo();
    }

    @Override
    public AdInfo getAdInfo() {
        return _player.getAdInfo();
    }

    @Override
    public ChapterInfo getChapterInfo() {
        return _player.getChapterInfo();
    }

    @Override
    public QoSInfo getQoSInfo() {
        // This sample app. does not support QoS-tracking workflows.
        return _player.getQosInfo();
    }
}
