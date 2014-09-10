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
    import com.adobe.primetime.va.AdBreakInfo;
    import com.adobe.primetime.va.AdInfo;
    import com.adobe.primetime.va.ChapterInfo;
    import com.adobe.primetime.va.ErrorInfo;
    import com.adobe.primetime.va.PlayerDelegate;
    import com.adobe.primetime.va.QoSInfo;
    import com.adobe.primetime.va.VideoInfo;
    import com.adobe.primetime.va.samples.Logger;
    import com.adobe.primetime.va.samples.player.VideoPlayer;

    public class VideoPlayerDelegate extends PlayerDelegate {
        public function VideoPlayerDelegate(player:VideoPlayer, provider:VideoAnalyticsProvider) {
            _player = player;
            _provider = provider;
        }
        
        override public function get videoInfo():VideoInfo {
            return _player.videoInfo;
        }

        override public function get adBreakInfo():AdBreakInfo {
            return _player.adBreakInfo;
        }

        override public function get adInfo():AdInfo {
            return _player.adInfo;
        }

        override public function get chapterInfo():ChapterInfo {
            return _player.chapterInfo;
        }
        
        override public function get qosInfo():QoSInfo {
            // This sample player does not provide QoS information.
            return null;
        }
        
        override public function onError(errorInfo:ErrorInfo):void {
            Logger.log(LOG_TAG, "VideoAnalytics error. Message: "+ errorInfo.message +
                                ". Details: " + errorInfo.details + ".");
        }

        override public function onVideoUnloaded():void {
            // The VideoHeartbeat engine is done with tracking this video playback session.
            // If we no longer need to track further playback from this player, we can now
            // safely destroy the VideoAnalyticsProvider and with it, the VideoHeartbeat instance.
            _provider.destroy();
        }

        private var _player:VideoPlayer;
        private var _provider:VideoAnalyticsProvider;

        private static const LOG_TAG:String = "[VideoHeartbeatSample]::SamplePlayerDelegate";
    }
}