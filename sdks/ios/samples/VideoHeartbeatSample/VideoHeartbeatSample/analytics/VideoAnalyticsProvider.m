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
#import "ADBMobile.h"
#import "Configuration.h"


@interface VideoAnalyticsProvider()

@property(nonatomic, assign) VideoPlayer *player;
@property(nonatomic, retain) ADB_VHB_VideoHeartbeat *videoHeartbeat;
@property(nonatomic, retain) VideoPlayerDelegate *playerDelegate;

@end

@implementation VideoAnalyticsProvider

#pragma mark - Allocation/de-allocation
- (id) init {
    self = [super init];
    if (self) {
        [NSException raise:@"Illegal invocation." format:@"Use the initWithPlayer: selector."];
    }

    return self;
}

- (id)initWithPlayer:(VideoPlayer *)player {
    self = [super init];
    
    if (self) {
        if (!player) {
            [NSException raise:@"Illegal argument." format:@"Player reference cannot be NULL."];
        }

        _playerDelegate = [[VideoPlayerDelegate alloc] initWithPlayer:player];
        _videoHeartbeat = [[ADB_VHB_VideoHeartbeat alloc] initWithPlayerDelegate:_playerDelegate];

        _player = player;

        [self setupVideoHeartbeat];
        [self setupPlayerNotifications];
    }
    
    return self;
}

- (void)dealloc {
    [_videoHeartbeat destroy];

    [_playerDelegate release]; _playerDelegate = nil;
    [_videoHeartbeat release]; _videoHeartbeat = nil;

    [super dealloc];
}

#pragma mark - VideoPlayer notification handlers.
- (void)onMainVideoLoaded:(NSNotification *)notification {
    [self.videoHeartbeat trackVideoLoad];
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
    [self.videoHeartbeat trackVideoUnload];
}

#pragma mark - Private helper methods
- (void)setupVideoHeartbeat {
    // Also activate the logging features of the AppMeasurement library.
    // NOTE: remove this in production code.
    [ADBMobile setDebugLogging:NO];

    ADB_VHB_ConfigData *videoHeartbeatConfig = [[[ADB_VHB_ConfigData alloc] initWithTrackingServer:TRACKING_SERVER
                                                                                             jobId:JOB_ID
                                                                                         publisher:PUBLISHER] autorelease];

    // Set this to true to activate the debug tracing.
    // NOTE: remove this in production code.
    videoHeartbeatConfig.debugLogging = YES;

    [_videoHeartbeat configure:videoHeartbeatConfig];
}

- (void)setupPlayerNotifications {
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(onMainVideoLoaded:)
                                                 name:PLAYER_EVENT_VIDEO_LOAD
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
}

@end
