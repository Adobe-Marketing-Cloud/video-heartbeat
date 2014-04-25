package com.adobe.primetime.va.samples.analytics {
    import com.adobe.primetime.va.AdBreakInfo;
    import com.adobe.primetime.va.AdInfo;
    import com.adobe.primetime.va.ChapterInfo;
    import com.adobe.primetime.va.ErrorInfo;
    import com.adobe.primetime.va.PlayerDelegate;
    import com.adobe.primetime.va.QoSInfo;
    import com.adobe.primetime.va.VideoInfo;
    import com.adobe.primetime.va.samples.Logger;
    import com.adobe.primetime.va.samples.player.VideoPlayer;

    public class SamplePlayerDelegate extends PlayerDelegate {
        public function SamplePlayerDelegate(player:VideoPlayer) {
            _player = player;
        }
        
        override public function get videoInfo():VideoInfo {
            var info:VideoInfo = new VideoInfo();
            
            info.id         = _player.videoId;
            info.playerName = _player.playerName;
            info.length     = _player.videoDuration;
            info.streamType = _player.streamType;
            info.playhead   = _player.playhead;
            
            return info;
        }

        override public function get adBreakInfo():AdBreakInfo {
            // This sample player does not support ad insertion.
            return null;
        }

        override public function get adInfo():AdInfo {
            // This sample player does not support ad insertion.
            return null;
        }

        override public function get chapterInfo():ChapterInfo {
            // This sample player does not have chapter support.
            return null;
        }
        
        override public function get qosInfo():QoSInfo {
            // This sample player does not provide QoS information.
            return null;
        }
        
        override public function onError(errorInfo:ErrorInfo):void {
            Logger.log(LOG_TAG, "VideoAnalytics error. Message: "+ errorInfo.message +
                                ". Details: " + errorInfo.details + ".");
        }
        
        private var _player:VideoPlayer;
        
        private static const LOG_TAG:String = "[VideoHeartbeatSample]::SamplePlayerDelegate";
    }
}