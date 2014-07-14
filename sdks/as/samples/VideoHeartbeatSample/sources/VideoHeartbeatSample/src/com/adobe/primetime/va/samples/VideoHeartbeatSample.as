package com.adobe.primetime.va.samples {
    import com.adobe.mc.Visitor;
    import com.adobe.primetime.va.samples.analytics.VideoAnalyticsProvider;
    import com.adobe.primetime.va.samples.player.DefaultCommCenter;
    import com.adobe.primetime.va.samples.player.PlayerEvent;
    import com.adobe.primetime.va.samples.player.VideoPlayer;
    import com.omniture.AppMeasurement;
    
    import fl.video.VideoScaleMode;
    
    import flash.display.Bitmap;
    import flash.display.Sprite;

    [SWF (width=640, height=450, frameRate=24)]
    public class VideoHeartbeatSample extends Sprite {
        public function VideoHeartbeatSample() {
            // Setup the VideoPlayer instance.
            _videoPlayer = new VideoPlayer();
            _videoPlayer.width = 640;
            _videoPlayer.height = 450;
            addChild(_videoPlayer);
            _videoPlayer.scaleMode = VideoScaleMode.MAINTAIN_ASPECT_RATIO;
            _videoPlayer.skin = "assets/skins/SkinOverAllNoFullNoCaption.swf";
            _videoPlayer.skinAutoHide = false;
            _videoPlayer.autoRewind = false;
            
            // Setup the Visitor and AppMeasurement instances.
            _visitor = new Visitor(Configuration.VISITOR_MARKETING_CLOUD_ORG_ID,
                                   Configuration.VISITOR_NAMESPACE);
            _visitor.trackingServer = Configuration.VISITOR_TRACKING_SERVER;

            _appMeasurement = new AppMeasurement();
            _appMeasurement.visitor        = _visitor;
            _appMeasurement.account        = Configuration.APPMEASUREMENT_ACCOUNT;
            _appMeasurement.trackingServer = Configuration.APPMEASUREMENT_TRACKING_SERVER;
            _appMeasurement.pageName       = Configuration.APPMEASUREMENT_PAGE_NAME;
            _appMeasurement.charSet        = "UTF-8";

            // Create the AnalyticsProvider instance and attach it to the VideoPlayer instance.
            _analyticsProvider = new VideoAnalyticsProvider(_appMeasurement, _videoPlayer);

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
            
            DefaultCommCenter.sharedInstance.notificationCenter.addEventListener(PlayerEvent.AD_START, onEnterAd);
            DefaultCommCenter.sharedInstance.notificationCenter.addEventListener(PlayerEvent.AD_COMPLETE, onExitAd);
            DefaultCommCenter.sharedInstance.notificationCenter.addEventListener(PlayerEvent.SEEK_COMPLETE, onSeekComplete);
            DefaultCommCenter.sharedInstance.notificationCenter.addEventListener(PlayerEvent.VIDEO_UNLOAD, onExitAd);
            
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
        private var _visitor:Visitor;
        private var _appMeasurement:AppMeasurement;
        private var _analyticsProvider:VideoAnalyticsProvider;
        
        [Embed(source="../../../../../../html-template/assets/img/ad-label-overlay.png")]
        private static var AdLabelImage:Class;
    }
}