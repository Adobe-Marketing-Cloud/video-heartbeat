/*
 * ADOBE SYSTEMS INCORPORATED
 * Copyright 2014 Adobe Systems Incorporated
 * All Rights Reserved.

 * NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
 * terms of the Adobe license agreement accompanying it.  If you have received this file from a
 * source other than Adobe, then your use, modification, or distribution of it requires the prior
 * written permission of Adobe.
 */

#import <MediaPlayer/MediaPlayer.h>

#import "VideoAnalyticsProvider.h"
#import "ADB_VHB_VideoHeartbeat.h"
#import "VideoPlayer.h"
#import "VideoPlayerDelegate.h"
#import "Configuration.h"

#import "ADB_VHB_AdobeAnalyticsPlugin.h"
#import "ADB_VHB_ConfigData.h"

@interface VideoAnalyticsProvider ()

@property(weak, nonatomic) VideoPlayer *player;
@property(strong, nonatomic) ADB_VHB_VideoHeartbeat *videoHeartbeat;
@property(strong, nonatomic) VideoPlayerDelegate *playerDelegate;

@end


@implementation VideoAnalyticsProvider

#pragma mark Initializer & dealloc
- (instancetype)initWithPlayer:(VideoPlayer *)player {
    self = [super init];

    if (self) {
        if (!player) {
            [NSException raise:@"Illegal argument." format:@"Player reference cannot be nil."];
        }
        
        _player = player;
        [self setupPlayerNotifications];
        
        // Set the plugin list.
        NSArray *plugins = @[[[ADB_VHB_AdobeAnalyticsPlugin alloc] init]];
        
        _playerDelegate = [[VideoPlayerDelegate alloc] initWithPlayer:player provider:self];
        _videoHeartbeat = [[ADB_VHB_VideoHeartbeat alloc] initWithPlayerDelegate:_playerDelegate plugins:plugins];

        

        [self setupVideoHeartbeat];
        
    }

    return self;
}

- (void)dealloc {
    [self destroy];
}


#pragma mark Public methods
- (void)destroy {
    // Detach from the notification center.
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    
    _videoHeartbeat = nil;
    _playerDelegate = nil;
}


#pragma mark VideoPlayer notification handlers

- (void)onMainVideoLoaded:(NSNotification *)notification {
    [self.videoHeartbeat trackVideoLoad];
}

- (void)onMainVideoUnloaded:(NSNotification *)notification {
    [self.videoHeartbeat trackVideoUnload];
}

- (void)onPlay:(NSNotification *)notification {
    [self.videoHeartbeat trackPlay];
}

- (void)onStop:(NSNotification *)notification {
    [self.videoHeartbeat trackPause];
}

- (void)onSeekStart:(NSNotification *)notification {
    [self.videoHeartbeat trackSeekStart];
}

- (void)onSeekComplete:(NSNotification *)notification {
    [self.videoHeartbeat trackSeekComplete];
}

- (void)onComplete:(NSNotification *)notification {
    [self.videoHeartbeat trackComplete];
}

- (void)onChapterStart:(NSNotification *)notification {
    [self.videoHeartbeat trackChapterStart];
}

- (void)onAdChapterComplete:(NSNotification *)notification {
    [self.videoHeartbeat trackChapterComplete];
}

- (void)onAdStart:(NSNotification *)notification {
    [self.videoHeartbeat trackAdStart];
}

- (void)onAdComplete:(NSNotification *)notification {
    [self.videoHeartbeat trackAdComplete];
}

#pragma mark - Private helper methods

- (void)setupVideoHeartbeat {
    ADB_VHB_ConfigData *configData = [[ADB_VHB_ConfigData alloc] initWithTrackingServer:HEARTBEAT_TRACKING_SERVER
                                                                                  jobId:HEARTBEAT_JOB_ID
                                                                              publisher:HEARTBEAT_PUBLISHER];
    
    configData.ovp = HEARTBEAT_OVP;
    configData.sdk = HEARTBEAT_SDK;
    configData.channel = HEARTBEAT_CHANNEL;

    // Set this to NO for production apps.
    configData.debugLogging = YES;

    [_videoHeartbeat configure:configData];
}

- (void)setupPlayerNotifications {
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(onMainVideoLoaded:)
                                                 name:PLAYER_EVENT_VIDEO_LOAD
                                               object:self.player];

    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(onMainVideoUnloaded:)
                                                 name:PLAYER_EVENT_VIDEO_UNLOAD
                                               object:self.player];

    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(onPlay:)
                                                 name:PLAYER_EVENT_PLAY
                                               object:self.player];

    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(onStop:)
                                                 name:PLAYER_EVENT_PAUSE
                                               object:self.player];

    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(onSeekStart:)
                                                 name:PLAYER_EVENT_SEEK_START
                                               object:self.player];

    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(onSeekComplete:)
                                                 name:PLAYER_EVENT_SEEK_COMPLETE
                                               object:self.player];

    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(onComplete:)
                                                 name:PLAYER_EVENT_COMPLETE
                                               object:self.player];

    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(onChapterStart:)
                                                 name:PLAYER_EVENT_CHAPTER_START
                                               object:self.player];

    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(onAdChapterComplete:)
                                                 name:PLAYER_EVENT_CHAPTER_COMPLETE
                                               object:self.player];

    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(onAdStart:)
                                                 name:PLAYER_EVENT_AD_START
                                               object:self.player];

    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(onAdComplete:)
                                                 name:PLAYER_EVENT_AD_COMPLETE
                                               object:self.player];
}

@end
