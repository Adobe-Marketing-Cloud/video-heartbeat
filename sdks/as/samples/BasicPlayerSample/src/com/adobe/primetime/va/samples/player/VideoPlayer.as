/*
 * ADOBE SYSTEMS INCORPORATED
 * Copyright 2014 Adobe Systems Incorporated
 * All Rights Reserved.

 * NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
 * terms of the Adobe license agreement accompanying it.  If you have received this file from a
 * source other than Adobe, then your use, modification, or distribution of it requires the prior
 * written permission of Adobe.
 */

package com.adobe.primetime.va.samples.player {

import com.adobe.primetime.va.plugins.videoplayer.QoSInfo;

import flash.utils.clearInterval;
import flash.utils.setInterval;

import fl.video.FLVPlayback;
import fl.video.VideoEvent;
import fl.video.VideoState;

import com.adobe.primetime.va.plugins.videoplayer.AdBreakInfo;
import com.adobe.primetime.va.plugins.videoplayer.AdInfo;
import com.adobe.primetime.va.plugins.videoplayer.AssetType;
import com.adobe.primetime.va.plugins.videoplayer.ChapterInfo;
import com.adobe.primetime.va.plugins.videoplayer.VideoInfo;
import com.adobe.primetime.va.samples.Configuration;


public class VideoPlayer extends FLVPlayback {
    // This sample VideoPlayer simulates a mid-roll ad at time 15:
    private static const AD_START_POS:Number = 15;
    private static const AD_END_POS:Number = 30;
    private static const AD_LENGTH:Number = 15;

    private static const CHAPTER1_START_POS:Number = 0;
    private static const CHAPTER1_END_POS:Number = 15;
    private static const CHAPTER1_LENGTH:Number = 15;

    private static const CHAPTER2_START_POS:Number = 30;
    private static const CHAPTER2_LENGTH:Number = 30;

    private static const MONITOR_TIMER_INTERVAL:Number = 500;

    public function VideoPlayer() {
        super();

        _playerName = Configuration.PLAYER_NAME;
        _videoId = Configuration.VIDEO_ID;
        _videoName = Configuration.VIDEO_NAME;
        _streamType =  AssetType.ASSET_TYPE_VOD;

        _videoInfo = null;
        _adBreakInfo = null;
        _adInfo = null;
        _chapterInfo = null;

        // Build a static/hard-coded QoS info here.
        _qosInfo = new QoSInfo();
        _qosInfo.bitrate = 50000;
        _qosInfo.fps = 24;
        _qosInfo.droppedFrames = 10;

        _clock = NaN;

        this.addEventListener(VideoEvent.READY, _onReady);
        this.addEventListener(VideoEvent.STATE_CHANGE, _onStateChange);
        this.addEventListener(VideoEvent.COMPLETE, _onComplete);
    }

    public function get videoInfo():VideoInfo {
        if (_adInfo) { // During ad playback the main video playhead remains
                       // constant at where it was when the ad started
            _videoInfo.playhead = AD_START_POS;
        } else {
            var vTime:Number = playhead;
            _videoInfo.playhead = (vTime < AD_START_POS) ? vTime : vTime - AD_LENGTH;
        }

        return this._videoInfo;
    }

    public function get adBreakInfo():AdBreakInfo {
        return _adBreakInfo;
    }

    public function get adInfo():AdInfo {
        return _adInfo;
    }

    public function get chapterInfo():ChapterInfo {
        return _chapterInfo;
    }

    public function get qosInfo():QoSInfo {
        return _qosInfo;
    }


    public function get duration():Number {
        return totalTime - AD_LENGTH;
    }

    public function get playhead():Number {
        return playheadTime;
    }

    //
    // ----------------[ Event handlers ]----------------
    //
    private function _onReady(event:VideoEvent):void {
        _openVideoIfNecessary();
    }

    private function _onComplete(event:VideoEvent):void {
        _completeVideo();
    }

    private function _onStateChange(event:VideoEvent):void {
        if (_buffering) {
            _buffering = false;
            dispatchEvent(new PlayerEvent(PlayerEvent.BUFFER_COMPLETE));
        }

        if (_seeking) {
            _seeking = false;

            _doPostSeekComputations();

            dispatchEvent(new PlayerEvent(PlayerEvent.SEEK_COMPLETE));
        }

        switch (event.state) {
            case VideoState.LOADING:
                if (_videoLoaded) {
                    _unloadVideo();
                }
                break;
            case VideoState.PLAYING:
                _openVideoIfNecessary();
                dispatchEvent(new PlayerEvent(PlayerEvent.PLAY));
                break;
            case VideoState.BUFFERING:
                _buffering = true;
                dispatchEvent(new PlayerEvent(PlayerEvent.BUFFER_START));
                break;
            case VideoState.SEEKING:
                _openVideoIfNecessary();
                _seeking = true;
                dispatchEvent(new PlayerEvent(PlayerEvent.SEEK_START));
                break;
            case VideoState.PAUSED:
                dispatchEvent(new PlayerEvent(PlayerEvent.PAUSE));
                break;
        }
    }

    //
    // ----------------[ Private helper methods ]----------------
    //
    private function _openVideoIfNecessary():void {
        if (!_videoLoaded) {
            _resetInternalState();

            _startVideo();

            // Start the monitor timer.
            var self:VideoPlayer = this;
            _clock =  setInterval(function():void { self._onTick() }, MONITOR_TIMER_INTERVAL);
        }
    }

    private function _completeVideo():void {
        if (_videoLoaded) {
            // Complete the second chapter
            _completeChapter();

            dispatchEvent(new PlayerEvent(PlayerEvent.COMPLETE));

            _unloadVideo();
        }
    }

    private function _unloadVideo():void {
        dispatchEvent(new PlayerEvent(PlayerEvent.VIDEO_UNLOAD));

        clearInterval(_clock);

        _resetInternalState();
    }

    private function _resetInternalState():void {
        _videoLoaded = false;
        _seeking = false;
        _buffering = false;
        _clock = NaN;
    }

    private function _startVideo():void {
        // Prepare the main video info.
        _videoInfo = new VideoInfo();
        _videoInfo.id = _videoId;
        _videoInfo.name = _videoName;
        _videoInfo.playerName = _playerName;
        _videoInfo.length = duration;
        _videoInfo.streamType = _streamType;
        _videoInfo.playhead = playhead;

        _videoLoaded = true;

        dispatchEvent(new PlayerEvent(PlayerEvent.VIDEO_LOAD));
    }

    private function _startChapter1():void {
        // Prepare the chapter info.
        _chapterInfo = new ChapterInfo();
        _chapterInfo.length = CHAPTER1_LENGTH;
        _chapterInfo.startTime = CHAPTER1_START_POS;
        _chapterInfo.position = 1;
        _chapterInfo.name = "First chapter";

        dispatchEvent(new PlayerEvent(PlayerEvent.CHAPTER_START));
    }

    private function _startChapter2():void {
        // Prepare the chapter info.
        _chapterInfo = new ChapterInfo();
        _chapterInfo.length = CHAPTER2_LENGTH;
        _chapterInfo.startTime = CHAPTER2_START_POS;
        _chapterInfo.position = 2;
        _chapterInfo.name = "Second chapter";

        dispatchEvent(new PlayerEvent(PlayerEvent.CHAPTER_START));
    }

    private function _completeChapter():void {
        // Reset the chapter info.
        _chapterInfo = null;

        dispatchEvent(new PlayerEvent(PlayerEvent.CHAPTER_COMPLETE));
    }

    private function _startAd():void {
        // Prepare the ad break info.
        _adBreakInfo = new AdBreakInfo();
        _adBreakInfo.name = "First Ad-Break";
        _adBreakInfo.position = 1;
        _adBreakInfo.playerName = _playerName;
        _adBreakInfo.startTime = AD_START_POS;

        // Prepare the ad info.
        _adInfo = new AdInfo();
        _adInfo.id = "001";
        _adInfo.name = "Sample ad";
        _adInfo.position = 1;
        _adInfo.length = AD_LENGTH;

        // Start the ad.
        dispatchEvent(new PlayerEvent(PlayerEvent.AD_START));
    }

    private function _completeAd():void {
        // Complete the ad.
        dispatchEvent(new PlayerEvent(PlayerEvent.AD_COMPLETE));

        // Clear the ad and ad-break info.
        _adInfo = null;
        _adBreakInfo = null;
    }

    private function _doPostSeekComputations():void {
        var vTime:Number = playhead;

        // Seek inside the first chapter.
        if (vTime < CHAPTER1_END_POS) {
            // If we were not inside the first chapter before, trigger a chapter start.
            if (_chapterInfo == null || _chapterInfo.position != 1) {
                _startChapter1();

                // If we were in the ad, clear the ad and ad-break info, but don't send the AD_COMPLETE event.
                if (_adInfo != null) {
                    _adInfo = null;
                    _adBreakInfo = null;
                }
            }
        }

        // Seek inside the ad.
        else if (vTime >= AD_START_POS && vTime < AD_END_POS) {
            // If we were not inside the ad before, trigger an ad-start.
            if (_adInfo == null) {
                _startAd();

                // Also, clear the chapter info, without sending the CHAPTER_COMPLETE event.
                _chapterInfo = null;
            }
        }

        // Seek inside the second chapter.
        else {
            // If we were not inside the 2nd chapter before, trigger a chapter start.
            if (_chapterInfo == null || _chapterInfo.position != 2) {
                _startChapter2();

                // If we were in the ad, clear the ad and ad-break info, but don't send the AD_COMPLETE event.
                if (_adInfo != null) {
                    _adInfo = null;
                    _adBreakInfo = null;
                }
            }
        }
    }

    private function _onTick():void {
        if (_seeking || _buffering || paused) {
            return;
        }

        var vTime:Number = playhead;

        // If we're inside the ad content:
        if (vTime >= AD_START_POS && vTime < AD_END_POS) {
            if (_chapterInfo) {
                // If we were inside a chapter, complete it.
                _completeChapter();
            }

            if (!_adInfo) {
                // Start the ad (if not already started).
                _startAd();
            }
        }

        // Otherwise, we're outside the ad content:
        else {
            if (_adInfo) {
                // Complete the ad (if needed).
                _completeAd();
            }

            if (vTime < CHAPTER1_END_POS) {
                if (_chapterInfo && _chapterInfo.position != 1) {
                    // If we were inside another chapter, complete it.
                    _completeChapter();
                }

                if (!_chapterInfo) {
                    // Start the first chapter.
                    _startChapter1();
                }
            } else {
                if (_chapterInfo && _chapterInfo.position != 2) {
                    // If we were inside another chapter, complete it.
                    _completeChapter();
                }

                if (!_chapterInfo) {
                    // Start the second chapter.
                    _startChapter2();
                }
            }
        }
    }

    private var _videoLoaded:Boolean;
    private var _seeking:Boolean;
    private var _buffering:Boolean;

    public var _playerName:String;
    public var _videoId:String;
    public var _videoName:String;
    public var _streamType:String;

    private var _videoInfo:VideoInfo;
    private var _adBreakInfo:AdBreakInfo;
    private var _adInfo:AdInfo;
    private var _chapterInfo:ChapterInfo;
    private var _qosInfo:QoSInfo;

    private var _clock:Number;
}
}