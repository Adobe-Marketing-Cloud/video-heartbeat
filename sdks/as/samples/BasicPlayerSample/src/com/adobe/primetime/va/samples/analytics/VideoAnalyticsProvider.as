/*
 * ADOBE SYSTEMS INCORPORATED
 * Copyright 2014 Adobe Systems Incorporated
 * All Rights Reserved.

 * NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
 * terms of the Adobe license agreement accompanying it.  If you have received this file from a
 * source other than Adobe, then your use, modification, or distribution of it requires the prior
 * written permission of Adobe.
 */

package com.adobe.primetime.va.samples.analytics {
import com.adobe.mc.Visitor;
import com.adobe.primetime.va.Heartbeat;
import com.adobe.primetime.va.HeartbeatConfig;
import com.adobe.primetime.va.core.plugin.IPlugin;
import com.adobe.primetime.va.plugins.aa.AdobeAnalyticsPlugin;
import com.adobe.primetime.va.plugins.aa.AdobeAnalyticsPluginConfig;
import com.adobe.primetime.va.plugins.ah.AdobeHeartbeatPlugin;
import com.adobe.primetime.va.plugins.ah.AdobeHeartbeatPluginConfig;
import com.adobe.primetime.va.plugins.videoplayer.VideoPlayerPlugin;
import com.adobe.primetime.va.plugins.videoplayer.VideoPlayerPluginConfig;
import com.adobe.primetime.va.samples.Configuration;
import com.adobe.primetime.va.samples.Logger;
import com.adobe.primetime.va.samples.player.PlayerEvent;
import com.adobe.primetime.va.samples.player.VideoPlayer;
import com.omniture.AppMeasurement;

public class VideoAnalyticsProvider {
    public function VideoAnalyticsProvider(player:VideoPlayer) {
        if (!player) {
            throw new Error("Illegal argument. Player reference cannot be null.")
        }
        _player = player;

        // Setup the Visitor and AppMeasurement instances.
        var visitor:Visitor = new Visitor(Configuration.VISITOR_MARKETING_CLOUD_ORG_ID);
        visitor.trackingServer = Configuration.VISITOR_TRACKING_SERVER;
        visitor.setCustomerIDs({
            "userId": {
                "id": Configuration.DPID
            },
            "puuid": {
                "id": Configuration.DPUUID
            }
         });

        var appMeasurement:AppMeasurement = new AppMeasurement();
        appMeasurement.visitor = visitor;
        appMeasurement.account = Configuration.APP_MEASUREMENT_ACCOUNT;
        appMeasurement.trackingServer = Configuration.APP_MEASUREMENT_TRACKING_SERVER;
        appMeasurement.pageName = Configuration.APP_MEASUREMENT_PAGE_NAME;
        appMeasurement.charSet = "UTF-8";
        appMeasurement.visitorID = "test-vid";

        // Setup the video-player plugin
        _playerPlugin = new VideoPlayerPlugin(new SampleVideoPlayerPluginDelegate(_player));
        var playerPluginConfig:VideoPlayerPluginConfig = new VideoPlayerPluginConfig();
        playerPluginConfig.debugLogging = true; // set this to false for production apps.
        _playerPlugin.configure(playerPluginConfig);

        // Setup the AppMeasurement plugin.
        _aaPlugin = new AdobeAnalyticsPlugin(appMeasurement, new SampleAdobeAnalyticsPluginDelegate());
        var aaPluginConfig:AdobeAnalyticsPluginConfig = new AdobeAnalyticsPluginConfig();
        aaPluginConfig.channel = Configuration.HEARTBEAT_CHANNEL;
        aaPluginConfig.debugLogging = true; // set this to false for production apps.
        _aaPlugin.configure(aaPluginConfig);

        // Setup the AdobeHeartbeat plugin.
        var ahPlugin:AdobeHeartbeatPlugin = new AdobeHeartbeatPlugin(new SampleAdobeHeartbeatPluginDelegate());
        var ahPluginConfig:AdobeHeartbeatPluginConfig = new AdobeHeartbeatPluginConfig(
                Configuration.HEARTBEAT_TRACKING_SERVER,
                Configuration.HEARTBEAT_PUBLISHER);
        ahPluginConfig.ovp = Configuration.HEARTBEAT_OVP;
        ahPluginConfig.sdk = Configuration.HEARTBEAT_SDK;
        ahPluginConfig.debugLogging = true; // set this to false for production apps.
        ahPlugin.configure(ahPluginConfig);

        var plugins:Vector.<IPlugin> = new <IPlugin>[_playerPlugin, _aaPlugin, ahPlugin];

        // Setup and configure the Heartbeat lib.
        _heartbeat = new Heartbeat(new SampleHeartbeatDelegate(), plugins);
        var configData:HeartbeatConfig = new HeartbeatConfig();
        configData.debugLogging = true; // set this to false for production apps.
        _heartbeat.configure(configData);

        _installEventListeners();
    }

    //
    // ----------------[ Public API ]----------------
    //
    public function destroy():void {
        if (_player) {
            _heartbeat.destroy();
            _heartbeat = null;

            _uninstallEventListeners();
            _player = null;
        }
    }

    //
    // ----------------[ Event handlers ]----------------
    //
    private function _onLoad(event:PlayerEvent):void {
        Logger.log(LOG_TAG, "Player event: VIDEO_LOAD");
        _aaPlugin.videoMetadata = {
            isUserLoggedIn: "false",
            tvStation: "Sample TV station",
            programmer: "Sample programmer"
        };
        _playerPlugin.trackVideoLoad();
    }

    private function _onUnload(event:PlayerEvent):void {
        Logger.log(LOG_TAG, "Player event: VIDEO_UNLOAD");
        _playerPlugin.trackVideoUnload();
    }

    private function _onPlay(event:PlayerEvent):void {
        Logger.log(LOG_TAG, "Player event: PLAY");
        _playerPlugin.trackPlay();
    }

    private function _onPause(event:PlayerEvent):void {
        Logger.log(LOG_TAG, "Player event: PAUSE");
        _playerPlugin.trackPause();
    }

    private function _onSeekStart(event:PlayerEvent):void {
        Logger.log(LOG_TAG, "Player event: SEEK_START");
        _playerPlugin.trackSeekStart();
    }

    private function _onSeekComplete(event:PlayerEvent):void {
        Logger.log(LOG_TAG, "Player event: SEEK_COMPLETE");
        _playerPlugin.trackSeekComplete();
    }

    private function _onBufferStart(event:PlayerEvent):void {
        Logger.log(LOG_TAG, "Player event: BUFFER_START");
        _playerPlugin.trackBufferStart();
    }

    private function _onBufferComplete(event:PlayerEvent):void {
        Logger.log(LOG_TAG, "Player event: BUFFER_COMPLETE");
        _playerPlugin.trackBufferComplete();
    }

    private function _onAdStart(event:PlayerEvent):void {
        Logger.log(LOG_TAG, "Player event: AD_START");
        _aaPlugin.adMetadata = {
            affiliate: "Sample affiliate",
            campaign: "Sample ad campaign"
        };
        _playerPlugin.trackAdStart();
    }

    private function _onAdComplete(event:PlayerEvent):void {
        Logger.log(LOG_TAG, "Player event: AD_COMPLETE");
        _playerPlugin.trackAdComplete();
    }

    private function _onChapterStart(event:PlayerEvent):void {
        Logger.log(LOG_TAG, "Player event: CHAPTER_START");
        _aaPlugin.chapterMetadata = {
            segmentType: "Sample segment type"
        };
        _playerPlugin.trackChapterStart();
    }

    private function _onChapterComplete(event:PlayerEvent):void {
        Logger.log(LOG_TAG, "Player event: CHAPTER_COMPLETE");
        _playerPlugin.trackChapterComplete();
    }

    private function _onComplete(event:PlayerEvent):void {
        Logger.log(LOG_TAG, "Player event: COMPLETE");
        _playerPlugin.trackComplete(function():void {
            Logger.log(LOG_TAG, "The completion of the content has been tracked.");
        });
    }

    //
    // ----------------[ Private helper methods ]----------------
    //
    private function _installEventListeners():void {
        _player.addEventListener(PlayerEvent.VIDEO_LOAD, _onLoad);
        _player.addEventListener(PlayerEvent.VIDEO_UNLOAD, _onUnload);
        _player.addEventListener(PlayerEvent.PLAY, _onPlay);
        _player.addEventListener(PlayerEvent.PAUSE, _onPause);
        _player.addEventListener(PlayerEvent.SEEK_START, _onSeekStart);
        _player.addEventListener(PlayerEvent.SEEK_COMPLETE, _onSeekComplete);
        _player.addEventListener(PlayerEvent.BUFFER_START, _onBufferStart);
        _player.addEventListener(PlayerEvent.BUFFER_COMPLETE, _onBufferComplete);
        _player.addEventListener(PlayerEvent.AD_START, _onAdStart);
        _player.addEventListener(PlayerEvent.AD_COMPLETE, _onAdComplete);
        _player.addEventListener(PlayerEvent.CHAPTER_START, _onChapterStart);
        _player.addEventListener(PlayerEvent.CHAPTER_COMPLETE, _onChapterComplete);
        _player.addEventListener(PlayerEvent.COMPLETE, _onComplete);
    }

    private function _uninstallEventListeners():void {
        _player.removeEventListener(PlayerEvent.VIDEO_LOAD, _onLoad);
        _player.removeEventListener(PlayerEvent.VIDEO_UNLOAD, _onUnload);
        _player.removeEventListener(PlayerEvent.PLAY, _onPlay);
        _player.removeEventListener(PlayerEvent.PAUSE, _onPause);
        _player.removeEventListener(PlayerEvent.SEEK_START, _onSeekStart);
        _player.removeEventListener(PlayerEvent.SEEK_COMPLETE, _onSeekComplete);
        _player.removeEventListener(PlayerEvent.BUFFER_START, _onBufferStart);
        _player.removeEventListener(PlayerEvent.BUFFER_COMPLETE, _onBufferComplete);
        _player.removeEventListener(PlayerEvent.AD_START, _onAdStart);
        _player.removeEventListener(PlayerEvent.AD_COMPLETE, _onAdComplete);
        _player.removeEventListener(PlayerEvent.CHAPTER_START, _onChapterStart);
        _player.removeEventListener(PlayerEvent.CHAPTER_COMPLETE, _onChapterComplete);
        _player.removeEventListener(PlayerEvent.COMPLETE, _onComplete);
    }

    private var _player:VideoPlayer;
    private var _playerPlugin:VideoPlayerPlugin;
    private var _aaPlugin:AdobeAnalyticsPlugin;
    private var _heartbeat:Heartbeat;

    private static const LOG_TAG:String = "[VideoHeartbeatSample]::VideoAnalyticsProvider";
}
}