package com.adobe.primetime.va.samples.analytics {
    
    import com.adobe.primetime.va.ConfigData;
    import com.adobe.primetime.va.adb.VideoHeartbeat;
    import com.adobe.primetime.va.samples.Configuration;
    import com.adobe.primetime.va.samples.Logger;
    import com.adobe.primetime.va.samples.player.PlayerEvent;
    import com.adobe.primetime.va.samples.player.VideoPlayer;
    import com.omniture.AppMeasurement;
    
    public class AnalyticsProvider {
        public function AnalyticsProvider(appMeasurement:AppMeasurement) {
            _appMeasurement = appMeasurement;
        }
        
        public function attachToPlayer(player:VideoPlayer):void {
            if (_player) {
                detachFromPlayer();
            }
            
            _player = player;
            _playerDelegate = new SamplePlayerDelegate(_player);
            
            var configData:ConfigData = new ConfigData(Configuration.HEARTBEAT_TRACKING_SERVER,
                                                       Configuration.HEARTBEAT_JOB_ID,
                                                       Configuration.HEARTBEAT_PUBLISHER);
            
            configData.ovp = Configuration.HEARTBEAT_OVP;
            configData.sdk = Configuration.HEARTBEAT_SDK;
            configData.channel = Configuration.HEARTBEAT_CHANNEL;
            
            // Set this to false for production apps.
            configData.debugLogging = true;
            
            _videoHeartbeat = new VideoHeartbeat(_appMeasurement, _playerDelegate);
            _videoHeartbeat.configure(configData);
            
            _player.addEventListener(PlayerEvent.VIDEO_LOAD, onVideoLoad);
            _player.addEventListener(PlayerEvent.VIDEO_UNLOAD, onVideoUnload);
            _player.addEventListener(PlayerEvent.PLAY, onPlay);
            _player.addEventListener(PlayerEvent.PAUSE, onPause);
            _player.addEventListener(PlayerEvent.SEEK_START, onSeekStart);
            _player.addEventListener(PlayerEvent.SEEK_COMPLETE, onSeekComplete);
            _player.addEventListener(PlayerEvent.BUFFER_START, onBufferStart);
            _player.addEventListener(PlayerEvent.BUFFER_COMPLETE, onBufferComplete);
            _player.addEventListener(PlayerEvent.COMPLETE, onComplete);
        }
        
        public function detachFromPlayer():void {
            if (_player) {
                _videoHeartbeat.destroy();
                _videoHeartbeat = null;
                _playerDelegate = null;
                
                _player.removeEventListener(PlayerEvent.VIDEO_LOAD, onVideoLoad);
                _player.removeEventListener(PlayerEvent.VIDEO_UNLOAD, onVideoUnload);
                _player.removeEventListener(PlayerEvent.PLAY, onPlay);
                _player.removeEventListener(PlayerEvent.PAUSE, onPause);
                _player.removeEventListener(PlayerEvent.SEEK_START, onSeekStart);
                _player.removeEventListener(PlayerEvent.SEEK_COMPLETE, onSeekComplete);
                _player.removeEventListener(PlayerEvent.BUFFER_START, onBufferStart);
                _player.removeEventListener(PlayerEvent.BUFFER_COMPLETE, onBufferComplete);
                _player.removeEventListener(PlayerEvent.COMPLETE, onComplete);
                
                _player = null;
            }
        }
        
        private function onVideoLoad(event:PlayerEvent):void {
            Logger.log(LOG_TAG, "Video loaded.");
            _videoHeartbeat.trackVideoLoad();
        }
        
        private function onVideoUnload(event:PlayerEvent):void {
            Logger.log(LOG_TAG, "Video unloaded.");
            _videoHeartbeat.trackVideoUnload();
        }
        
        private function onPlay(event:PlayerEvent):void {
            Logger.log(LOG_TAG, "Playback started.");
            _videoHeartbeat.trackPlay();
        }
        
        private function onPause(event:PlayerEvent):void {
            Logger.log(LOG_TAG, "Playback paused.");
            _videoHeartbeat.trackPause();
        }
        
        private function onSeekStart(event:PlayerEvent):void {
            Logger.log(LOG_TAG, "Seek started.");
            _videoHeartbeat.trackSeekStart();
        }
        
        private function onSeekComplete(event:PlayerEvent):void {
            Logger.log(LOG_TAG, "Seek completed.");
            _videoHeartbeat.trackSeekComplete();
        }
        
        private function onBufferStart(event:PlayerEvent):void {
            Logger.log(LOG_TAG, "Buffer started.");
            _videoHeartbeat.trackBufferStart();
        }
        
        private function onBufferComplete(event:PlayerEvent):void {
            Logger.log(LOG_TAG, "Buffer completed.");
            _videoHeartbeat.trackBufferComplete();
        }
        
        private function onComplete(event:PlayerEvent):void {
            Logger.log(LOG_TAG, "Playback completed.");
            _videoHeartbeat.trackComplete();
        }
        
        private var _appMeasurement:AppMeasurement;
        private var _player:VideoPlayer;
        private var _playerDelegate:SamplePlayerDelegate;
        private var _videoHeartbeat:VideoHeartbeat;
        
        private static const LOG_TAG:String = "[VideoHeartbeatSample]::AnalyticsProvider";
    }
}