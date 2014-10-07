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

import android.util.Log;

import com.adobe.primetime.va.AdBreakInfo;
import com.adobe.primetime.va.AdInfo;
import com.adobe.primetime.va.ChapterInfo;
import com.adobe.primetime.va.ErrorInfo;
import com.adobe.primetime.va.PlayerDelegate;
import com.adobe.primetime.va.QoSInfo;
import com.adobe.primetime.va.VideoInfo;
import com.adobe.primetime.va.samples.player.VideoPlayer;

class VideoPlayerDelegate extends PlayerDelegate {
    private static final String LOG_TAG = "[VideoHeartbeatSample]::" + VideoPlayerDelegate.class.getSimpleName();

    private final VideoPlayer _player;

    private final VideoAnalyticsProvider _provider;

    VideoPlayerDelegate(VideoPlayer player, VideoAnalyticsProvider provider) {
        _player = player;
        _provider = provider;
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
        return null;
    }

    @Override
    public void onError(ErrorInfo errorInfo) {
        Log.e(LOG_TAG, "VideoAnalytics error. Message: " + errorInfo.getMessage() +
                ". Details: " + errorInfo.getDetails() + ".");
    }

    @Override
    public void onVideoUnloaded() {
        // The VideoHeartbeat engine is done with tracking this video playback session.
        // If we no longer need to track further playback from this player, we can now
        // safely destroy the VideoAnalyticsProvider and with it, the VideoHeartbeat instance.

        // Uncomment the following line to destroy the video analytics provider.
//        _provider.destroy();
    }
}
