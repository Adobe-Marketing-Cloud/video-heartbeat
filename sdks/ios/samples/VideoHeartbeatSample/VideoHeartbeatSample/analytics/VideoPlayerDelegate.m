/*
 * ADOBE SYSTEMS INCORPORATED
 * Copyright 2014 Adobe Systems Incorporated
 * All Rights Reserved.

 * NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
 * terms of the Adobe license agreement accompanying it.  If you have received this file from a
 * source other than Adobe, then your use, modification, or distribution of it requires the prior
 * written permission of Adobe.
 */

#import "VideoPlayerDelegate.h"
#import "VideoPlayer.h"
#import "ADB_VHB_ErrorInfo.h"
#import "ADB_VHB_VideoInfo.h"
#import "ADB_VHB_AdBreakInfo.h"
#import "ADB_VHB_AdInfo.h"
#import "ADB_VHB_VideoHeartbeat.h"
#import "VideoAnalyticsProvider.h"

@interface VideoPlayerDelegate ()
@property(nonatomic, assign) VideoPlayer *player;
@property(nonatomic, assign) VideoAnalyticsProvider *provider;
@end

@implementation VideoPlayerDelegate

#pragma mark - Allocation/de-allocation

- (id)init {
    self = [super init];
    if (self) {
        [NSException raise:@"Illegal invocation." format:@"Use the initWithPlayer: selector."];
    }

    return self;
}

- (id)initWithPlayer:(VideoPlayer *)player provider:(VideoAnalyticsProvider *)provider {
    self = [super init];
    if (self) {
        _player = player;
        _provider = provider;
    }

    return self;
}

#pragma mark - Player delegate implementation

- (ADB_VHB_VideoInfo *)getVideoInfo {
    return self.player.videoInfo;
}

- (ADB_VHB_AdBreakInfo *)getAdBreakInfo {
    return self.player.adBreakInfo;
}

- (ADB_VHB_AdInfo *)getAdInfo {
    return self.player.adInfo;
}

- (ADB_VHB_ChapterInfo *)getChapterInfo {
    return self.player.chapterInfo;
}

- (ADB_VHB_QoSInfo *)getQoSInfo {
    // This sample app. does not support QoS-tracking workflows.
    return nil;
}

- (void)onError:(ADB_VHB_ErrorInfo *)errorInfo {
    NSLog(@"VideoAnalytics error. Message: %@. Details: %@", errorInfo.message, errorInfo.details);
}

- (void)onVideoUnloaded {
    [self.provider.videoHeartbeat destroy];
}

@end