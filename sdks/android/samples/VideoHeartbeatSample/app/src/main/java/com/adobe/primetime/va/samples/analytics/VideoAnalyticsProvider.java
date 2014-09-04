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

import com.adobe.primetime.va.ConfigData;
import com.adobe.primetime.va.adb.VideoHeartbeat;
import com.adobe.primetime.va.samples.Configuration;
import com.adobe.primetime.va.samples.player.PlayerEvent;
import com.adobe.primetime.va.samples.player.VideoPlayer;

import java.util.Observable;
import java.util.Observer;

public class VideoAnalyticsProvider implements Observer {
    private static final String LOG_TAG = "[VideoHeartbeatSample]::" + VideoAnalyticsProvider.class.getSimpleName();

    private VideoPlayer _player;
    private VideoPlayerDelegate _playerDelegate;
    private VideoHeartbeat _videoHeartbeat;

    public VideoAnalyticsProvider(VideoPlayer player) {
        if (player == null) {
            throw new IllegalArgumentException("Player reference cannot be null.");
        }
        _player = player;
        _player.addObserver(this);

        _playerDelegate = new VideoPlayerDelegate(_player, this);
        _videoHeartbeat = new VideoHeartbeat(_playerDelegate);

        _setupVideoHeartbeat();
    }

    public void destroy() {
        if (_player != null) {
            _videoHeartbeat.destroy();
            _videoHeartbeat = null;
            _playerDelegate = null;

            _player.deleteObserver(this);
            _player = null;
        }
    }

    @Override
    public void update(Observable observable, Object data) {
        PlayerEvent playerEvent = (PlayerEvent) data;

        switch (playerEvent) {
            case VIDEO_LOAD:
                Log.d(LOG_TAG, "Video loaded.");
                _videoHeartbeat.trackVideoLoad();
                break;

            case VIDEO_UNLOAD:
                Log.d(LOG_TAG, "Video unloaded.");
                _videoHeartbeat.trackVideoUnload();
                break;

            case PLAY:
                Log.d(LOG_TAG, "Playback started.");
                _videoHeartbeat.trackPlay();
                break;

            case PAUSE:
                Log.d(LOG_TAG, "Playback paused.");
                _videoHeartbeat.trackPause();
                break;

            case SEEK_START:
                Log.d(LOG_TAG, "Seek started.");
                _videoHeartbeat.trackSeekStart();
                break;

            case SEEK_COMPLETE:
                Log.d(LOG_TAG, "Seek completed.");
                _videoHeartbeat.trackSeekComplete();
                break;

            case BUFFER_START:
                Log.d(LOG_TAG, "Buffer started.");
                _videoHeartbeat.trackBufferStart();
                break;

            case BUFFER_COMPLETE:
                Log.d(LOG_TAG, "Buffer completed.");
                _videoHeartbeat.trackBufferComplete();
                break;

            case AD_START:
                Log.d(LOG_TAG, "Ad started.");
                _videoHeartbeat.trackAdStart();
                break;

            case AD_COMPLETE:
                Log.d(LOG_TAG, "Ad completed.");
                _videoHeartbeat.trackAdComplete();
                break;

            case CHAPTER_START:
                Log.d(LOG_TAG, "Chapter started.");
                _videoHeartbeat.trackChapterStart();
                break;

            case CHAPTER_COMPLETE:
                Log.d(LOG_TAG, "Chapter completed.");
                _videoHeartbeat.trackChapterComplete();
                break;

            case COMPLETE:
                Log.d(LOG_TAG, "Playback completed.");
                _videoHeartbeat.trackComplete();
                break;

            default:
                Log.d(LOG_TAG, "Unhandled player event: " + playerEvent.toString());
                break;
        }
    }

    private void _setupVideoHeartbeat() {
        ConfigData configData = new ConfigData(Configuration.HEARTBEAT_TRACKING_SERVER,
                Configuration.HEARTBEAT_JOB_ID,
                Configuration.HEARTBEAT_PUBLISHER);

        configData.ovp = Configuration.HEARTBEAT_OVP;
        configData.sdk = Configuration.HEARTBEAT_SDK;
        configData.channel = Configuration.HEARTBEAT_CHANNEL;

        // Set this to false for production apps.
        configData.debugLogging = true;

        _videoHeartbeat.configure(configData);
    }
}
