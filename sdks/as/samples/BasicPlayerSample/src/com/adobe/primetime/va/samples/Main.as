/*
 * ADOBE SYSTEMS INCORPORATED
 * Copyright 2014 Adobe Systems Incorporated
 * All Rights Reserved.

 * NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
 * terms of the Adobe license agreement accompanying it.  If you have received this file from a
 * source other than Adobe, then your use, modification, or distribution of it requires the prior
 * written permission of Adobe.
 */

package com.adobe.primetime.va.samples {
    import flash.display.Bitmap;
    import flash.display.Sprite;

    import fl.video.VideoScaleMode;

    import com.adobe.primetime.va.samples.analytics.VideoAnalyticsProvider;
    import com.adobe.primetime.va.samples.player.PlayerEvent;
    import com.adobe.primetime.va.samples.player.VideoPlayer;


    [SWF (width=640, height=450, frameRate=24)]
    public class Main extends Sprite {
        public function Main() {
            // Setup the VideoPlayer instance.
            _videoPlayer = new VideoPlayer();
            _videoPlayer.width = 640;
            _videoPlayer.height = 450;
            addChild(_videoPlayer);
            _videoPlayer.scaleMode = VideoScaleMode.MAINTAIN_ASPECT_RATIO;
            _videoPlayer.skin = "assets/skins/SkinOverAllNoFullNoCaption.swf";
            _videoPlayer.skinAutoHide = false;
            _videoPlayer.autoRewind = false;

            // Create the AnalyticsProvider instance and attach it to the VideoPlayer instance.
            _analyticsProvider = new VideoAnalyticsProvider(_videoPlayer);

            // Load the main video content.
            _videoPlayer.play("assets/video/clickbaby.mp4");
            
            _setupAdLabel();
        }
        
        private function _setupAdLabel():void {
            var _adLabel:Bitmap = new AdLabelImage() as Bitmap;
            _adLabel.x = 20;
            _adLabel.y = 40;
            _adLabel.visible = false;
            addChild(_adLabel);

            _videoPlayer.addEventListener(PlayerEvent.AD_START, onEnterAd);
            _videoPlayer.addEventListener(PlayerEvent.AD_COMPLETE, onExitAd);
            _videoPlayer.addEventListener(PlayerEvent.SEEK_COMPLETE, onSeekComplete);
            _videoPlayer.addEventListener(PlayerEvent.VIDEO_UNLOAD, onExitAd);
            
            function onEnterAd(event:PlayerEvent):void {
                _adLabel.visible = true;
            }
            
            function onExitAd(event:PlayerEvent):void {
                _adLabel.visible = false;
            }
            
            function onSeekComplete(event:PlayerEvent):void {
                if (!_videoPlayer.adInfo) {
                    // The user seeked outside the ad.
                    _adLabel.visible = false;
                    onExitAd(null);
                }
            }
        }
        
        private var _videoPlayer:VideoPlayer;
        private var _analyticsProvider:VideoAnalyticsProvider;
        
        [Embed(source="../../../../../../html-template/assets/img/ad-label-overlay.png")]
        private static var AdLabelImage:Class;
    }
}