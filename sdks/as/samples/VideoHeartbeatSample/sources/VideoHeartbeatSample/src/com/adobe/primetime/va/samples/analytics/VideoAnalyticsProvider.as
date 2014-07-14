package com.adobe.primetime.va.samples.analytics {
    
    import com.adobe.primetime.va.ConfigData;
    import com.adobe.primetime.va.adb.VideoHeartbeat;
    import com.adobe.primetime.va.samples.Configuration;
    import com.adobe.primetime.va.samples.Logger;
import com.adobe.primetime.va.samples.player.DefaultCommCenter;
import com.adobe.primetime.va.samples.player.PlayerEvent;
    import com.adobe.primetime.va.samples.player.VideoPlayer;
    import com.omniture.AppMeasurement;
    
    public class VideoAnalyticsProvider {
        public function VideoAnalyticsProvider(appMeasurement:AppMeasurement, player:VideoPlayer) {
            if (!appMeasurement) {
                throw new Error("Illegal argument. AppMeasurement reference cannot be null.")
            }

            if (!player) {
                throw new Error("Illegal argument. Player reference cannot be null.")
            }
            _player = player;

            _playerDelegate = new VideoPlayerDelegate(_player, this);
            _videoHeartbeat = new VideoHeartbeat(appMeasurement, _playerDelegate);

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
                _playerDelegate = null;

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
            DefaultCommCenter.sharedInstance.notificationCenter.addEventListener(PlayerEvent.VIDEO_LOAD, _onLoad);
            DefaultCommCenter.sharedInstance.notificationCenter.addEventListener(PlayerEvent.VIDEO_UNLOAD, _onUnload);
            DefaultCommCenter.sharedInstance.notificationCenter.addEventListener(PlayerEvent.PLAY, _onPlay);
            DefaultCommCenter.sharedInstance.notificationCenter.addEventListener(PlayerEvent.PAUSE, _onPause);
            DefaultCommCenter.sharedInstance.notificationCenter.addEventListener(PlayerEvent.SEEK_START, _onSeekStart);
            DefaultCommCenter.sharedInstance.notificationCenter.addEventListener(PlayerEvent.SEEK_COMPLETE, _onSeekComplete);
            DefaultCommCenter.sharedInstance.notificationCenter.addEventListener(PlayerEvent.BUFFER_START, _onBufferStart);
            DefaultCommCenter.sharedInstance.notificationCenter.addEventListener(PlayerEvent.BUFFER_COMPLETE, _onBufferComplete);
            DefaultCommCenter.sharedInstance.notificationCenter.addEventListener(PlayerEvent.AD_START, _onAdStart);
            DefaultCommCenter.sharedInstance.notificationCenter.addEventListener(PlayerEvent.AD_COMPLETE, _onAdComplete);
            DefaultCommCenter.sharedInstance.notificationCenter.addEventListener(PlayerEvent.CHAPTER_START, _onChapterStart);
            DefaultCommCenter.sharedInstance.notificationCenter.addEventListener(PlayerEvent.CHAPTER_COMPLETE, _onChapterComplete);
            DefaultCommCenter.sharedInstance.notificationCenter.addEventListener(PlayerEvent.COMPLETE, _onComplete);
        }

        private function _uninstallEventListeners():void {
            DefaultCommCenter.sharedInstance.notificationCenter.removeEventListener(PlayerEvent.VIDEO_LOAD, _onLoad);
            DefaultCommCenter.sharedInstance.notificationCenter.removeEventListener(PlayerEvent.VIDEO_UNLOAD, _onUnload);
            DefaultCommCenter.sharedInstance.notificationCenter.removeEventListener(PlayerEvent.PLAY, _onPlay);
            DefaultCommCenter.sharedInstance.notificationCenter.removeEventListener(PlayerEvent.PAUSE, _onPause);
            DefaultCommCenter.sharedInstance.notificationCenter.removeEventListener(PlayerEvent.SEEK_START, _onSeekStart);
            DefaultCommCenter.sharedInstance.notificationCenter.removeEventListener(PlayerEvent.SEEK_COMPLETE, _onSeekComplete);
            DefaultCommCenter.sharedInstance.notificationCenter.removeEventListener(PlayerEvent.BUFFER_START, _onBufferStart);
            DefaultCommCenter.sharedInstance.notificationCenter.removeEventListener(PlayerEvent.BUFFER_COMPLETE, _onBufferComplete);
            DefaultCommCenter.sharedInstance.notificationCenter.removeEventListener(PlayerEvent.AD_START, _onAdStart);
            DefaultCommCenter.sharedInstance.notificationCenter.removeEventListener(PlayerEvent.AD_COMPLETE, _onAdComplete);
            DefaultCommCenter.sharedInstance.notificationCenter.removeEventListener(PlayerEvent.CHAPTER_START, _onChapterStart);
            DefaultCommCenter.sharedInstance.notificationCenter.removeEventListener(PlayerEvent.CHAPTER_COMPLETE, _onChapterComplete);
            DefaultCommCenter.sharedInstance.notificationCenter.removeEventListener(PlayerEvent.COMPLETE, _onComplete);
        }

        private var _player:VideoPlayer;
        private var _playerDelegate:VideoPlayerDelegate;
        private var _videoHeartbeat:VideoHeartbeat;
        
        private static const LOG_TAG:String = "[VideoHeartbeatSample]::AnalyticsProvider";
    }
}