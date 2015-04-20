/*
 * ADOBE SYSTEMS INCORPORATED
 * Copyright 2015 Adobe Systems Incorporated
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
#import "ADB_VHB_Heartbeat.h"
#import "VideoAnalyticsProvider.h"

@interface VideoPlayerDelegate ()
@property(strong, nonatomic) VideoPlayer *player;
@end

@implementation VideoPlayerDelegate

#pragma mark Initializer
- (instancetype)initWithPlayer:(VideoPlayer *)player
{
    self = [super init];

    if (self)
    {
        _player = player;
    }

    return self;
}

#pragma mark Overridden public methods

- (ADB_VHB_VideoInfo *)getVideoInfo
{
    return self.player.videoInfo;
}

- (ADB_VHB_AdBreakInfo *)getAdBreakInfo
{
    return self.player.adBreakInfo;
}

- (ADB_VHB_AdInfo *)getAdInfo
{
    return self.player.adInfo;
}

- (ADB_VHB_ChapterInfo *)getChapterInfo
{
    return self.player.chapterInfo;
}

- (ADB_VHB_QoSInfo *)getQoSInfo
{
    return self.player.qosInfo;
}

@end
