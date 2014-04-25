package com.adobe.primetime.va.samples.player {
    import com.adobe.primetime.va.AssetType;
    import com.adobe.primetime.va.samples.Configuration;
    import com.adobe.primetime.va.samples.Logger;

    import fl.video.FLVPlayback;
    import fl.video.VideoEvent;
    import fl.video.VideoState;
    
    public class VideoPlayer extends FLVPlayback {
        public function VideoPlayer() {
            super();
            this.addEventListener(VideoEvent.READY, onReady);
            this.addEventListener(VideoEvent.STATE_CHANGE, onStateChange);
            this.addEventListener(VideoEvent.COMPLETE, onComplete);
        }
        
        public function get playerName():String {
            return Configuration.PLAYER_NAME;
        }
        
        public function get videoId():String {
            return Configuration.VIDEO_ID;
        }
        
        public function get streamType():String {
            return AssetType.ASSET_TYPE_VOD;
        }
        
        public function get videoDuration():Number {
            return totalTime;
        }
        
        public function get playhead():Number {
            return playheadTime;
        }
        
        private function onReady(event:VideoEvent):void {
            openVideoIfNecessary();
        }
        
        private function onComplete(event:VideoEvent):void {
            closeVideo();
        }
        
        private function onStateChange(event:VideoEvent):void {
            if (_buffering) {
                _buffering = false;
                dispatchEvent(new PlayerEvent(PlayerEvent.BUFFER_COMPLETE));
            }

            if (_seeking) {
                _seeking = false;
                dispatchEvent(new PlayerEvent(PlayerEvent.SEEK_COMPLETE));
            }

            switch (event.state) {
                case VideoState.LOADING:
                    closeVideo();
                    break;
                case VideoState.PLAYING:
                    openVideoIfNecessary();
                    dispatchEvent(new PlayerEvent(PlayerEvent.PLAY));
                    break;
                case VideoState.BUFFERING:
                    _buffering = true;
                    dispatchEvent(new PlayerEvent(PlayerEvent.BUFFER_START));
                    break;
                case VideoState.SEEKING:
                    openVideoIfNecessary();
                    _seeking = true;
                    dispatchEvent(new PlayerEvent(PlayerEvent.SEEK_START));
                    break;
                case VideoState.PAUSED:
                    openVideoIfNecessary();
                    dispatchEvent(new PlayerEvent(PlayerEvent.PAUSE));
                    break;
            }
        }

        private function openVideoIfNecessary():void {
            if (!_open) {
                resetInternals();
                _open = true;
                dispatchEvent(new PlayerEvent(PlayerEvent.VIDEO_LOAD));
            }
        }

        private function closeVideo():void {
            if (_open) {
                resetInternals();

                dispatchEvent(new PlayerEvent(PlayerEvent.COMPLETE));
                dispatchEvent(new PlayerEvent(PlayerEvent.VIDEO_UNLOAD));
            }
        }

        private function resetInternals():void {
            _open = false;
            _seeking = false;
            _buffering = false;
        }

        private var _open:Boolean;
        private var _seeking:Boolean;
        private var _buffering:Boolean;
    }
}