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

import com.adobe.mobile.Config;
import com.adobe.primetime.core.ICallback;
import com.adobe.primetime.core.plugin.IPlugin;
import com.adobe.primetime.va.Heartbeat;
import com.adobe.primetime.va.plugins.aa.AdMetadataKeys;
import com.adobe.primetime.va.plugins.aa.AdobeAnalyticsPlugin;
import com.adobe.primetime.va.plugins.aa.AdobeAnalyticsPluginConfig;
import com.adobe.primetime.va.plugins.aa.VideoMetadataKeys;
import com.adobe.primetime.va.plugins.ah.AdobeHeartbeatPluginConfig;
import com.adobe.primetime.va.plugins.videoplayer.VideoPlayerPlugin;
import com.adobe.primetime.va.plugins.ah.AdobeHeartbeatPlugin;
import com.adobe.primetime.va.plugins.videoplayer.VideoPlayerPluginConfig;
import com.adobe.primetime.va.samples.Configuration;
import com.adobe.primetime.va.samples.player.PlayerEvent;
import com.adobe.primetime.va.samples.player.VideoPlayer;

import java.util.*;

public class VideoAnalyticsProvider implements Observer {
    private static final String LOG_TAG = "[VideoHeartbeatSample]::" + VideoAnalyticsProvider.class.getSimpleName();

    private VideoPlayer _player;
    private VideoPlayerPlugin _playerPlugin;
    private AdobeAnalyticsPlugin _aaPlugin;
    private AdobeHeartbeatPlugin _ahPlugin;
    private Heartbeat _heartbeat;

    public VideoAnalyticsProvider(VideoPlayer player) {
        if (player == null) {
            throw new IllegalArgumentException("Player reference cannot be null.");
        }
        _player = player;
        _player.addObserver(this);

        // Set the plugin list.
        List<IPlugin> plugins = new ArrayList<IPlugin>();

        // Setup VideoPlayer plugin
        _playerPlugin = new VideoPlayerPlugin(new SampleVideoPlayerPluginDelegate(_player));
        VideoPlayerPluginConfig playerPluginConfig = new VideoPlayerPluginConfig();
        playerPluginConfig.debugLogging = true; // set this to false for production apps.
        _playerPlugin.configure(playerPluginConfig);
        plugins.add(_playerPlugin);

        // Setup the visitor id - optional parameter to be set by the player.
        Config.setUserIdentifier("test-vid");

        // Setup AdobeAnalytics plugin
        _aaPlugin = new AdobeAnalyticsPlugin(new SampleAdobeAnalyticsPluginDelegate());
        AdobeAnalyticsPluginConfig aaPluginConfig = new AdobeAnalyticsPluginConfig();
        aaPluginConfig.channel = Configuration.HEARTBEAT_CHANNEL;
        aaPluginConfig.debugLogging = true; // set this to false for production apps.
        _aaPlugin.configure(aaPluginConfig);
        plugins.add(_aaPlugin);

        // Setup AdobeHeartbeat plugin
        _ahPlugin = new AdobeHeartbeatPlugin(new SampleAdobeHeartbeatPluginDelegate());
        AdobeHeartbeatPluginConfig ahPluginConfig = new AdobeHeartbeatPluginConfig(
                Configuration.HEARTBEAT_TRACKING_SERVER,
                Configuration.HEARTBEAT_PUBLISHER
        );
        ahPluginConfig.ovp = Configuration.HEARTBEAT_OVP;
        ahPluginConfig.sdk = Configuration.HEARTBEAT_SDK;
        ahPluginConfig.debugLogging = true; // set this to false for production apps.
        _ahPlugin.configure(ahPluginConfig);
        plugins.add(_ahPlugin);

        // Setup and configure Heartbeat lib
        _heartbeat = new Heartbeat(new SampleHeartbeatDelegate(), plugins);
    }

    public void destroy() {
        if (_player != null) {
            _heartbeat.destroy();
            _heartbeat = null;
            _aaPlugin = null;
            _playerPlugin = null;
            _ahPlugin = null;

            _player.destroy();
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
                HashMap<String, String> videoMetadata = new HashMap<String, String>();
                videoMetadata.put(VideoMetadataKeys.EPISODE, "Sample Episode");
                videoMetadata.put(VideoMetadataKeys.SEASON, "Sample Season");
                videoMetadata.put(VideoMetadataKeys.SHOW, "Sample Show");
                videoMetadata.put(VideoMetadataKeys.ASSET_ID, "Sample Asset ID");
                videoMetadata.put(VideoMetadataKeys.GENRE, "Sample Genre");
                videoMetadata.put(VideoMetadataKeys.FIRST_AIR_DATE, "Sample air date");
                videoMetadata.put(VideoMetadataKeys.FIRST_DIGITAL_DATE, "Sample digital date");
                videoMetadata.put(VideoMetadataKeys.RATING, "Sample Rating");
                videoMetadata.put(VideoMetadataKeys.ORIGINATOR, "Sample Originator");
                videoMetadata.put(VideoMetadataKeys.SHOW_TYPE, "Sample Show Type");
                videoMetadata.put(VideoMetadataKeys.AD_LOAD, "ad load");
                videoMetadata.put(VideoMetadataKeys.MVPD, "sample mvpd");
                videoMetadata.put(VideoMetadataKeys.AUTHORIZED, "false");
                videoMetadata.put(VideoMetadataKeys.NETWORK, "Sample TV Network");
                videoMetadata.put(VideoMetadataKeys.DAY_PART, "sample day part");
                videoMetadata.put(VideoMetadataKeys.FEED, "sample feed type");
                videoMetadata.put(VideoMetadataKeys.STREAM_FORMAT, "sample stream format");
                _aaPlugin.setVideoMetadata(videoMetadata);

                _playerPlugin.trackVideoLoad();
                break;

            case VIDEO_UNLOAD:
                Log.d(LOG_TAG, "Video unloaded.");
                _playerPlugin.trackVideoUnload();
                break;

            case PLAY:
                Log.d(LOG_TAG, "Playback started.");
                _playerPlugin.trackPlay();
                break;

            case PAUSE:
                Log.d(LOG_TAG, "Playback paused.");
                _playerPlugin.trackPause();
                break;

            case SEEK_START:
                Log.d(LOG_TAG, "Seek started.");
                _playerPlugin.trackSeekStart();
                break;

            case SEEK_COMPLETE:
                Log.d(LOG_TAG, "Seek completed.");
                _playerPlugin.trackSeekComplete();
                break;

            case BUFFER_START:
                Log.d(LOG_TAG, "Buffer started.");
                _playerPlugin.trackBufferStart();
                break;

            case BUFFER_COMPLETE:
                Log.d(LOG_TAG, "Buffer completed.");
                _playerPlugin.trackBufferComplete();
                break;

            case AD_START:
                Log.d(LOG_TAG, "Ad started.");
                HashMap<String, String> adMetadata = new HashMap<String, String>();
                adMetadata.put(AdMetadataKeys.CREATIVE_ID, "Sample creative id");
                adMetadata.put(AdMetadataKeys.CAMPAIGN_ID, "Sample ad campaign");
                adMetadata.put(AdMetadataKeys.ADVERTISER, "Sample advertiser");
                adMetadata.put(AdMetadataKeys.CREATIVE_URL, "Sample creative url");
                adMetadata.put(AdMetadataKeys.PLACEMENT_ID, "Sample placement");
                adMetadata.put(AdMetadataKeys.SITE_ID, "Sample site");
                _aaPlugin.setAdMetadata(adMetadata);

                _playerPlugin.trackAdStart();
                break;

            case AD_COMPLETE:
                Log.d(LOG_TAG, "Ad completed.");
                _playerPlugin.trackAdComplete();
                break;

            case CHAPTER_START:
                Log.d(LOG_TAG, "Chapter started.");
                HashMap<String, String> chapterMetadata = new HashMap<String, String>();
                chapterMetadata.put("segmentType", "Sample Segment Type");
                _aaPlugin.setChapterMetadata(chapterMetadata);

                _playerPlugin.trackChapterStart();
                break;

            case CHAPTER_COMPLETE:
                Log.d(LOG_TAG, "Chapter completed.");
                _playerPlugin.trackChapterComplete();
                break;

            case COMPLETE:
                Log.d(LOG_TAG, "Playback completed.");

                ICallback completeCallback = new ICallback() {
                    @Override
                    public Object call(Object param) {
                        Log.d(LOG_TAG, "The completion of the content has been tracked.");
                        return null;
                    }
                };

                _playerPlugin.trackComplete(completeCallback);
                break;

            default:
                Log.d(LOG_TAG, "Unhandled player event: " + playerEvent.toString());
                break;
        }
    }
}
