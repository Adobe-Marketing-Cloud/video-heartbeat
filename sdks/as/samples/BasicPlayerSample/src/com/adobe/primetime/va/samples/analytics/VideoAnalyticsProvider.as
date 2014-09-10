/*
 * ADOBE SYSTEMS INCORPORATED
 * Copyright 2014 Adobe Systems Incorporated
 * All Rights Reserved.

 * NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
 * terms of the Adobe license agreement accompanying it.  If you have received this file from a
 * source other than Adobe, then your use, modification, or distribution of it requires the prior
 * written permission of Adobe.
 */

package com.adobe.primetime.va.samples.analytics
{
    import com.adobe.mc.Visitor;
    import com.omniture.AppMeasurement;

    import com.adobe.primetime.va.ConfigData;
    import com.adobe.primetime.va.VideoHeartbeat;
    import com.adobe.primetime.va.samples.Configuration;
    import com.adobe.primetime.va.samples.Logger;
    import com.adobe.primetime.va.samples.player.PlayerEvent;
    import com.adobe.primetime.va.samples.player.VideoPlayer;
    import com.adobe.primetime.va.core.plugin.IPlugin;
    import com.adobe.primetime.va.plugins.aa.AdobeAnalyticsPlugin;
    import com.adobe.primetime.va.samples.CommCenter;


    public class VideoAnalyticsProvider {
        public function VideoAnalyticsProvider(player:VideoPlayer) {
            if (!player) {
                throw new Error("Illegal argument. Player reference cannot be null.")
            }
            _player = player;

            // Setup the Visitor and AppMeasurement instances.
            var visitor:Visitor = new Visitor(Configuration.VISITOR_MARKETING_CLOUD_ORG_ID,
                    Configuration.VISITOR_NAMESPACE);
            visitor.trackingServer = Configuration.VISITOR_TRACKING_SERVER;

            var appMeasurement:AppMeasurement = new AppMeasurement();
            appMeasurement.visitor = visitor;
            appMeasurement.account = Configuration.APPMEASUREMENT_ACCOUNT;
            appMeasurement.trackingServer = Configuration.APPMEASUREMENT_TRACKING_SERVER;
            appMeasurement.pageName = Configuration.APPMEASUREMENT_PAGE_NAME;
            appMeasurement.charSet = "UTF-8";
            appMeasurement.visitorID = "test-vid";

            // Setup the AppMeasurement plugin.
            var aaPlugin:AdobeAnalyticsPlugin = new AdobeAnalyticsPlugin(appMeasurement);
            var plugins:Vector.<IPlugin> = new <IPlugin>[aaPlugin];

            var playerDelegate:VideoPlayerDelegate = new VideoPlayerDelegate(_player, this);
            _videoHeartbeat = new VideoHeartbeat(playerDelegate, plugins);

            _setupVideoHeartbeat();
            _installEventListeners();
        }

        //
        // ----------------[ Public API ]----------------
        //
        public function destroy():void {
            if (_player) {
                _videoHeartbeat.destroy();
                _videoHeartbeat = null;

                _uninstallEventListeners();
                _player = null;
            }
        }

        //
        // ----------------[ Event handlers ]----------------
        //
        private function _onLoad(event:PlayerEvent):void {
            Logger.log(LOG_TAG, "Player event: VIDEO_LOAD");
            _videoHeartbeat.trackVideoLoad();
        }
        
        private function _onUnload(event:PlayerEvent):void {
            Logger.log(LOG_TAG, "VPlayer event: VIDEO_UNLOAD");
            _videoHeartbeat.trackVideoUnload();
        }
        
        private function _onPlay(event:PlayerEvent):void {
            Logger.log(LOG_TAG, "Player event: PLAY");
            _videoHeartbeat.trackPlay();
        }
        
        private function _onPause(event:PlayerEvent):void {
            Logger.log(LOG_TAG, "Player event: PAUSE");
            _videoHeartbeat.trackPause();
        }
        
        private function _onSeekStart(event:PlayerEvent):void {
            Logger.log(LOG_TAG, "Player event: SEEK_START");
            _videoHeartbeat.trackSeekStart();
        }
        
        private function _onSeekComplete(event:PlayerEvent):void {
            Logger.log(LOG_TAG, "Player event: SEEK_COMPLETE");
            _videoHeartbeat.trackSeekComplete();
        }
        
        private function _onBufferStart(event:PlayerEvent):void {
            Logger.log(LOG_TAG, "Player event: BUFFER_START");
            _videoHeartbeat.trackBufferStart();
        }
        
        private function _onBufferComplete(event:PlayerEvent):void {
            Logger.log(LOG_TAG, "Player event: BUFFER_COMPLETE");
            _videoHeartbeat.trackBufferComplete();
        }

        private function _onAdStart(event:PlayerEvent):void {
            Logger.log(LOG_TAG, "Player event: AD_START");
            _videoHeartbeat.trackAdStart();
        }
        
        private function _onAdComplete(event:PlayerEvent):void {
            Logger.log(LOG_TAG, "Player event: AD_COMPLETE");
            _videoHeartbeat.trackAdComplete();
        }

        private function _onChapterStart(event:PlayerEvent):void {
            Logger.log(LOG_TAG, "Player event: CHAPTER_START");
            _videoHeartbeat.trackChapterStart();
        }

        private function _onChapterComplete(event:PlayerEvent):void {
            Logger.log(LOG_TAG, "Player event: CHAPTER_COMPLETE");
            _videoHeartbeat.trackChapterComplete();
        }

        private function _onComplete(event:PlayerEvent):void {
            Logger.log(LOG_TAG, "Player event: COMPLETE");
            _videoHeartbeat.trackComplete();
        }

        //
        // ----------------[ Private helper methods ]----------------
        //
        private function _setupVideoHeartbeat():void {
            var configData:ConfigData = new ConfigData(Configuration.HEARTBEAT_TRACKING_SERVER,
                    Configuration.HEARTBEAT_JOB_ID,
                    Configuration.HEARTBEAT_PUBLISHER);

            configData.ovp = Configuration.HEARTBEAT_OVP;
            configData.sdk = Configuration.HEARTBEAT_SDK;
            configData.channel = Configuration.HEARTBEAT_CHANNEL;

            // Set this to false for production apps.
            configData.debugLogging = true;

            _videoHeartbeat.configure(configData);
        }

        private function _installEventListeners():void {
            CommCenter.sharedChannel.on(PlayerEvent.VIDEO_LOAD, _onLoad, this);
            CommCenter.sharedChannel.on(PlayerEvent.VIDEO_UNLOAD, _onUnload, this);
            CommCenter.sharedChannel.on(PlayerEvent.PLAY, _onPlay, this);
            CommCenter.sharedChannel.on(PlayerEvent.PAUSE, _onPause, this);
            CommCenter.sharedChannel.on(PlayerEvent.SEEK_START, _onSeekStart, this);
            CommCenter.sharedChannel.on(PlayerEvent.SEEK_COMPLETE, _onSeekComplete, this);
            CommCenter.sharedChannel.on(PlayerEvent.BUFFER_START, _onBufferStart, this);
            CommCenter.sharedChannel.on(PlayerEvent.BUFFER_COMPLETE, _onBufferComplete, this);
            CommCenter.sharedChannel.on(PlayerEvent.AD_START, _onAdStart, this);
            CommCenter.sharedChannel.on(PlayerEvent.AD_COMPLETE, _onAdComplete, this);
            CommCenter.sharedChannel.on(PlayerEvent.CHAPTER_START, _onChapterStart, this);
            CommCenter.sharedChannel.on(PlayerEvent.CHAPTER_COMPLETE, _onChapterComplete, this);
            CommCenter.sharedChannel.on(PlayerEvent.COMPLETE, _onComplete, this);
        }

        private function _uninstallEventListeners():void {
            CommCenter.sharedChannel.off(null, null, this);
        }

        private var _player:VideoPlayer;
        private var _videoHeartbeat:VideoHeartbeat;
        
        private static const LOG_TAG:String = "[VideoHeartbeatSample]::AnalyticsProvider";
    }
}