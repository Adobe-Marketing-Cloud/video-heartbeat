/*
 * ADOBE SYSTEMS INCORPORATED
 * Copyright 2015 Adobe Systems Incorporated
 * All Rights Reserved.

 * NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
 * terms of the Adobe license agreement accompanying it.  If you have received this file from a
 * source other than Adobe, then your use, modification, or distribution of it requires the prior
 * written permission of Adobe.
 */

#import <MediaPlayer/MediaPlayer.h>

#import "VideoAnalyticsProvider.h"
#import "VideoPlayer.h"
#import "VideoPlayerDelegate.h"
#import "Configuration.h"
#import "ADB_VHB_VideoPlayerPlugin.h"
#import "SampleAnalyticsPluginDelegate.h"
#import "ADB_VHB_VideoPlayerPluginConfig.h"
#import "SampleHeartbeatDelegate.h"
#import "SampleHeartbeatPluginDelegate.h"
#import "ADB_VHB_HeartbeatConfig.h"
#import "ADB_VHB_AdobeAnalyticsPluginConfig.h"
#import "ADB_VHB_AdobeHeartbeatPluginConfig.h"
#import "ADB_VHB_AdobeAnalyticsPlugin.h"
#import "ADB_VHB_AdobeHeartbeatPlugin.h"
#import "ADB_VHB_Heartbeat.h"
#import "ADB_VHB_AdobeHeartbeatPluginConfig.h"


@interface VideoAnalyticsProvider ()

@property(weak, nonatomic) VideoPlayer *player;
@property(strong, nonatomic) ADB_VHB_Heartbeat *videoHeartbeat;
@property(strong, nonatomic) ADB_VHB_VideoPlayerPluginDelegate *playerDelegate;
@property(strong,nonatomic) ADB_VHB_VideoPlayerPlugin *playerPlugin;
@property(strong,nonatomic) ADB_VHB_AdobeAnalyticsPlugin *analyticsPlugin;
@property(strong,nonatomic) ADB_VHB_AdobeHeartbeatPlugin *hbPlugin;

@end


@implementation VideoAnalyticsProvider

#pragma mark Initializer & dealloc
- (instancetype)initWithPlayer:(VideoPlayer *)player {
    self = [super init];

    if (self)
    {
        if (!player)
        {
            [NSException raise:@"Illegal argument." format:@"Player reference cannot be nil."];
        }
        
        _player = player;
        
        // VIDEO PLAYER PLUGIN
        _playerDelegate = [[VideoPlayerDelegate alloc] initWithPlayer:player];
        _playerPlugin = [[ADB_VHB_VideoPlayerPlugin alloc] initWithDelegate:_playerDelegate];
        ADB_VHB_VideoPlayerPluginConfig *playerConfig = [[ADB_VHB_VideoPlayerPluginConfig alloc] init];
        playerConfig.debugLogging = YES;
        [_playerPlugin configure:playerConfig];

        // ANALYTICS-PLUGIN
        ADB_VHB_AdobeAnalyticsPluginConfig *analyticsPluginConfig = [[ADB_VHB_AdobeAnalyticsPluginConfig alloc] init];
        analyticsPluginConfig.channel = HEARTBEAT_CHANNEL;
        analyticsPluginConfig.debugLogging = YES;
        SampleAnalyticsPluginDelegate *analyticsDelegate = [[SampleAnalyticsPluginDelegate alloc] init];
        _analyticsPlugin = [[ADB_VHB_AdobeAnalyticsPlugin alloc] initWithDelegate:analyticsDelegate];
        [_analyticsPlugin configure:analyticsPluginConfig];
        
        // HEARTBEAT-PLUGIN
        SampleHeartbeatPluginDelegate *hbPluginDelegate = [[SampleHeartbeatPluginDelegate alloc] init];
        _hbPlugin = [[ADB_VHB_AdobeHeartbeatPlugin alloc] initWithDelegate:hbPluginDelegate];
        ADB_VHB_AdobeHeartbeatPluginConfig *hbConfig = [[ADB_VHB_AdobeHeartbeatPluginConfig alloc]
                                                       initWithTrackingServer:HEARTBEAT_TRACKING_SERVER
                                                       publisher:HEARTBEAT_PUBLISHER];
        hbConfig.ovp = HEARTBEAT_OVP;
        hbConfig.sdk = HEARTBEAT_SDK;
        hbConfig.ssl = NO;
        hbConfig.debugLogging = YES;
        hbConfig.quietMode = NO;
        [_hbPlugin configure:hbConfig];
        
        // PLUGINS
        NSArray *plugins = [NSArray arrayWithObjects:_playerPlugin,_analyticsPlugin,_hbPlugin,nil];
        
        // HB CORE
        SampleHeartbeatDelegate *hbDelegate = [[SampleHeartbeatDelegate alloc] init];
        _videoHeartbeat = [[ADB_VHB_Heartbeat alloc] initWithDelegate:hbDelegate plugins:plugins];
        ADB_VHB_HeartbeatConfig *hbCoreConfig = [[ADB_VHB_HeartbeatConfig alloc] init];
        hbCoreConfig.debugLogging = YES;
        [_videoHeartbeat configure:hbCoreConfig];
        
        [self setupPlayerNotifications];
        
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

- (void)onMainVideoLoaded:(NSNotification *)notification
{
    NSLog (@"Player Event: VIDEO_LOAD");
    
    NSMutableDictionary *videoMetadata = [[NSMutableDictionary alloc] init];
    [videoMetadata setObject:@"false" forKey:@"isUserLoggedIn"];
    [videoMetadata setObject:@"Sample TV station" forKey:@"tvStation"];
    [videoMetadata setObject:@"Sample programmer" forKey:@"programmer"];
    
    _analyticsPlugin.videoMetadata = videoMetadata;
    [_playerPlugin trackVideoLoad];
    
}

- (void)onMainVideoUnloaded:(NSNotification *)notification
{
    NSLog (@"Player Event: VIDEO_UNLOAD");
    [_playerPlugin trackVideoUnload];
}

- (void)onPlay:(NSNotification *)notification
{
    NSLog (@"Player Event: VIDEO_PLAY");
    [_playerPlugin trackPlay];
}

- (void)onStop:(NSNotification *)notification
{
    NSLog (@"Player Event: VIDEO_PAUSE");
    [_playerPlugin trackPause];
}

- (void)onSeekStart:(NSNotification *)notification
{
    NSLog (@"Player Event: onSeekStart");
    [_playerPlugin trackSeekStart];
}

- (void)onSeekComplete:(NSNotification *)notification
{
    NSLog (@"Player Event: onSeekComplete");
    [_playerPlugin trackSeekComplete];
}

- (void)onComplete:(NSNotification *)notification
{
    NSLog (@"Player Event: onComplete");
    
    void (^trackCompleteHandler)(void) = ^ {
        NSLog (@"The completion of the content has been tracked.");
    };
    
    [_playerPlugin trackComplete:trackCompleteHandler];
}

- (void)onChapterStart:(NSNotification *)notification
{
    NSLog (@"Player Event: onChapterStart");

    NSMutableDictionary *chapterDictionary = [[NSMutableDictionary alloc] init];
    [chapterDictionary setObject:@"Sample segment type" forKey:@"segmentType"];
    
    _analyticsPlugin.chapterMetadata = chapterDictionary;
    [_playerPlugin trackChapterStart];
}

- (void)onChapterComplete:(NSNotification *)notification
{
    NSLog (@"Player Event: onChapterComplete");
    [_playerPlugin trackChapterComplete];
}

- (void)onAdStart:(NSNotification *)notification
{
    NSLog (@"Player Event: onAdStart");
    NSMutableDictionary *adDictionary = [[NSMutableDictionary alloc] init];
    [adDictionary setObject:@"Sample affiliate" forKey:@"affiliate"];
    [adDictionary setObject:@"campaign" forKey:@"campaign"];
    [_analyticsPlugin setAdMetadata:adDictionary];
    
    [_playerPlugin trackAdStart];
}

- (void)onAdComplete:(NSNotification *)notification
{
    NSLog (@"Player Event: onAdComplete");
    [_playerPlugin trackAdComplete];
}

#pragma mark - Private helper methods

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
                                             selector:@selector(onChapterComplete:)
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
