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
import flash.events.Event;

public class PlayerEvent extends Event {
    public static const VIDEO_LOAD:String = "videoLoad";
    public static const VIDEO_UNLOAD:String = "videoUnload";
    public static const PLAY:String = "playerPlay";
    public static const PAUSE:String = "playerPause";
    public static const SEEK_START:String = "playerSeekStart";
    public static const SEEK_COMPLETE:String = "playerSeekComplete";
    public static const BUFFER_START:String = "playerBufferStart";
    public static const BUFFER_COMPLETE:String = "playerBufferComplete";
    public static const AD_START:String = "playerAdStart";
    public static const AD_COMPLETE:String = "playerAdComplete";
    public static const CHAPTER_START:String = "playerChapterStart";
    public static const CHAPTER_COMPLETE:String = "playerChapterComplete";
    public static const COMPLETE:String = "playerComplete";

    //noinspection ReservedWordAsName
    public function PlayerEvent(type:String) {
        super(type);
    }
}

}