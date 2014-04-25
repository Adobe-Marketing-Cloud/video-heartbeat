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
#import "Configuration.h"

@interface VideoPlayerDelegate()
@property(nonatomic, assign) VideoPlayer *player;
@end

@implementation VideoPlayerDelegate

#pragma mark - Allocation/de-allocation
- (id) init {
    self = [super init];
    if (self) {
        [NSException raise:@"Illegal invocation." format:@"Use the initWithPlayer: selector."];
    }

    return self;
}

- (id) initWithPlayer:(VideoPlayer *)player {
    self = [super init];
    if (self) {
        _player = player;
    }

    return self;
}

#pragma mark - Player delegate implementation
- (ADB_VHB_VideoInfo *) getVideoInfo {
    ADB_VHB_VideoInfo *videoInfo = [[[ADB_VHB_VideoInfo alloc] init] autorelease];

    videoInfo.id = self.player.videoId;
    videoInfo.playerName = PLAYER_NAME;
    videoInfo.length = self.player.videoDuration;
    videoInfo.streamType = self.player.streamType;
    videoInfo.playhead = self.player.playhead;

    return videoInfo;
}

- (ADB_VHB_AdBreakInfo *) getAdBreakInfo {
    // This sample app. does not support ad-tracking workflows.
    return nil;
}

- (ADB_VHB_AdInfo *) getAdInfo {
    // This sample app. does not support ad-tracking workflows.
    return nil;
}

- (ADB_VHB_ChapterInfo *) getChapterInfo {
    // This sample app. does not support chapter-tracking workflows.
    return nil;
}

- (ADB_VHB_QoSInfo *) getQoSInfo {
    // This sample app. does not support QoS-tracking workflows.
    return nil;
}

- (void) onError:(ADB_VHB_ErrorInfo *)errorInfo {
    NSLog(@"VideoAnalytics error. Message: %@. Details: %@", errorInfo.message, errorInfo.details);
}

@end