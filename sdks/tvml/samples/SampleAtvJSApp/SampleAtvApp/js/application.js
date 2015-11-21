/*************************************************************************
 *
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 *  Copyright 2015 Adobe Systems Incorporated
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 *
 **************************************************************************/

function playVideo() {

    //Setup Video Analytics
    var MediaHeartbeat = ADB.MediaHeartbeat;
    var MediaHeartbeatEvent = ADB.MediaHeartbeat.Event;
    var MediaHeartbeatConfig = ADB.MediaHeartbeatConfig;

    //Provide config using MediaHeartbeatConfig singleton instance
    MediaHeartbeatConfig.setDebugLogging(true);
    MediaHeartbeatConfig.trackingServer = "example.com";
    MediaHeartbeatConfig.playerName = "sample-player";
    MediaHeartbeatConfig.publisher = "sample-publisher";
    MediaHeartbeatConfig.channel = "sample-channel";
    MediaHeartbeatConfig.sdkVersion = "test-sdk";
    MediaHeartbeatConfig.ssl = false;
    MediaHeartbeatConfig.ovp = "test-ovp";

    //Set media delegate for responding with playhead and QoS updates
    var _playhead = 0;
    var _qosInfo = new MediaHeartbeat.QoSInfo();

    MediaHeartbeat.setDelegate({
        "getCurrentPlaybackTime" : function() {
            return _playhead;
        },
        "getQoSInfo" : function(){
            return _qosInfo;
        }
    });

    // create the TVJS video player instance and add event listeners
    var player = new Player();
    var playlist = new Playlist();
    var mediaItem = new MediaItem("video", "http://cdn.auditude.com/assets/video/mp4/hdh264.mp4");

    player.playlist = playlist;
    player.playlist.push(mediaItem);

    // listener for player state changes
    player.addEventListener("stateDidChange", function(event) {
        console.log("State did Change " + JSON.stringify(event));

        if (event.state == "begin") {

            //Create MediaInfo object and Video metadata required for tracking video load event
            var _videoInfo = new MediaHeartbeat.MediaInfo();
            _videoInfo.id = "video id";
            _videoInfo.name = "video name";
            _videoInfo.playerName = "AppleTV";
            _videoInfo.length = 60;
            _videoInfo.streamType = "vod";

            var _contextData = {
                isUserLoggedIn: "false",
                tvStation: "Sample TV station",
                programmer: "Sample programmer"
            };
            MediaHeartbeat.trackLoad(_videoInfo, _contextData);

        } else if (event.state == "loading") {
            MediaHeartbeat.trackEvent(MediaHeartbeatEvent.BufferStart);

        } else if (event.state == "paused") {

            if (event.oldState == "loading") {

                // returning back to playing state after loading->paused state
                MediaHeartbeat.trackEvent(MediaHeartbeatEvent.BufferComplete);
            } else if (event.oldState == "playing") {

                // enter pause state after playing state
                MediaHeartbeat.trackPause();
            }

        } else if (event.state == "playing") {

            if (event.oldState == "loading") {

                // returning back to playing state after loading state
                MediaHeartbeat.trackEvent(MediaHeartbeatEvent.BufferComplete);
            } else if (event.oldState == "paused") {

                // returning back to playing state after paused state
                MediaHeartbeat.trackPlay();
            }

        } else if (event.state == "scanning") {
            // this state is used for seeking use cases

        } else if (event.state == "end") {
            MediaHeartbeat.trackComplete();
            MediaHeartbeat.trackUnload();
        }
    }, false);

    // listener for playhead update
    player.addEventListener("timeDidChange", function (event) {
        console.log("Time Did Change " + JSON.stringify(event));

        _playhead = event.time;
    }, {interval: 1});

    // sample implementation for chapter start/end and AdBreak/Ad start/end
    player.addEventListener("timeBoundaryDidCross",function(event) {
        console.log("Time crossed boundary " + JSON.stringify(event));
        
        // AdBreak1 starts at 5 with Ad1
        if (event.boundary == 5) {
            
            // creating AdBreakInfo object and tracking event for AdBreak Start event
            var _adBreakInfo = new MediaHeartbeat.AdBreakInfo();
             _adBreakInfo.name = "AdBreak_1";
             _adBreakInfo.startTime = 5;
             _adBreakInfo.position = 1;
             _adBreakInfo.playerName = "AdBreak Player";
             MediaHeartbeat.trackEvent(MediaHeartbeatEvent.AdBreakStart, _adBreakInfo);

            // creating AdInfo object and tracking event for Ad Start event
             var _adInfo = new MediaHeartbeat.AdInfo();
             _adInfo.id = "Ad 1";
             _adInfo.name = "Ad1";
             _adInfo.length = 5;
             _adInfo.position = 1;
             MediaHeartbeat.trackEvent(MediaHeartbeatEvent.AdStart, _adInfo);
        } 
        // Ad1 and AdBreak1 ends at 10
        else if (event.boundary == 10) {
            
            // tracking Ad complete event
            MediaHeartbeat.trackEvent(MediaHeartbeatEvent.AdComplete);
                            
            // tracking AdBreak complete event
            MediaHeartbeat.trackEvent(MediaHeartbeatEvent.AdBreakComplete);
            
        } 
        // Chapter1 starts at 15
        else if (event.boundary == 15) {
                            
            // creating ChapterInfo and chapter metadata object for tracking event for Chapter Start
            var _chapterInfo = new MediaHeartbeat.ChapterInfo();
             _chapterInfo.name = "default chapter";
             _chapterInfo.length = 5;
             _chapterInfo.position = 1;
             _chapterInfo.offset = 15;

            // sample metadata for chapter
             var chapterMetadata = {
                 Chap1Key1: "Chap1Val1",
                 Chap1Key2: "Chap1Val2"
             };
             MediaHeartbeat.trackEvent(MediaHeartbeatEvent.ChapterStart, _chapterInfo, chapterMetadata);
            
        } 
        // Chapter1 ends at 20
        else if (event.boundary == 20) {
                        
            // tracking Chapter complete event
            MediaHeartbeat.trackEvent(MediaHeartbeatEvent.ChapterComplete);
        }
    },[5.0, 10.0, 15.0, 20.0]);
    
    // dismiss any previous view and present the player
    navigationDocument.dismissModal();
    player.present();
}

function pushDoc(document) {
    navigationDocument.pushDocument(document);
}

App.onLaunch = function(options) {

    // load MediaHeartbeat JS lib
    console.log("Loading MediaHeartbeat JS lib");
    var javascriptFiles = ["http://localhost:8090/js/VideoHeartbeat-tvml.min.js"];

    // evaluate the JS files and load them
    evaluateScripts(javascriptFiles, function(success) {
        if(success) {
            console.log("MediaHeartbeat JS lib loaded successfully.");
            playVideo();
        } else {
            console.log("MediaHeartbeat JS lib failed to load.");
        }
    });
};

App.onExit = function() {
    console.log('App finished');
};

App.onError = function (options) {
    console.log('App Error' + options);
};