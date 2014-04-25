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
import com.adobe.primetime.va.*;
import com.adobe.primetime.va.samples.player.VideoPlayer;

public class SamplePlayerDelegate extends PlayerDelegate{
    private static final String LOG_TAG = "[VideoHeartbeatSample]::" + SamplePlayerDelegate.class.getSimpleName();

    private VideoPlayer _player;

    SamplePlayerDelegate(VideoPlayer player) {
        _player = player;
    }

    @Override
    public VideoInfo getVideoInfo() {
        VideoInfo videoInfo = new VideoInfo();

        videoInfo.id = _player.getVideoId();
        videoInfo.playerName = _player.getPlayerName();
        videoInfo.length = _player.getVideoDuration();
        videoInfo.streamType = _player.getStreamType();
        videoInfo.playhead = _player.getPlayhead();

        return videoInfo;
    }

    @Override
    public AdBreakInfo getAdBreakInfo() {
        // This sample app. does not support ad-tracking workflows.
        return null;
    }

    @Override
    public AdInfo getAdInfo() {
        // This sample app. does not support ad-tracking workflows.
        return null;
    }

    @Override
    public ChapterInfo getChapterInfo() {
        // This sample app. does not support chapter-tracking workflows.
        return null;
    }

    @Override
    public QoSInfo getQoSInfo() {
        // This sample app. does not support QoS-tracking workflows.
        return null;
    }

    @Override
    public void onError(ErrorInfo errorInfo) {
        Log.e(LOG_TAG, "VideoAnalytics error. Message: "+ errorInfo.getMessage() +
                       ". Details: " + errorInfo.getDetails() + ".");
    }
}
