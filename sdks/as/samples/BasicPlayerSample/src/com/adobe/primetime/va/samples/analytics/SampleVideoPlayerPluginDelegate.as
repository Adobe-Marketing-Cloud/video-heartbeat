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
import com.adobe.primetime.va.plugins.videoplayer.AdBreakInfo;
import com.adobe.primetime.va.plugins.videoplayer.AdInfo;
import com.adobe.primetime.va.plugins.videoplayer.ChapterInfo;
import com.adobe.primetime.va.plugins.videoplayer.QoSInfo;
import com.adobe.primetime.va.plugins.videoplayer.VideoInfo;
import com.adobe.primetime.va.samples.player.VideoPlayer;
import com.adobe.primetime.va.plugins.videoplayer.VideoPlayerPluginDelegate;


public class SampleVideoPlayerPluginDelegate extends VideoPlayerPluginDelegate {
    public function SampleVideoPlayerPluginDelegate(player:VideoPlayer) {
        _player = player;
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
        return _player.qosInfo;
    }

    private var _player:VideoPlayer;
}
}