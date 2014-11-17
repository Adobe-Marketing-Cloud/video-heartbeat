/*
 * ADOBE SYSTEMS INCORPORATED
 * Copyright 2014 Adobe Systems Incorporated
 * All Rights Reserved.

 * NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
 * terms of the Adobe license agreement accompanying it.  If you have received this file from a
 * source other than Adobe, then your use, modification, or distribution of it requires the prior
 * written permission of Adobe.
 */

#import <Foundation/Foundation.h>
#import <MediaPlayer/MediaPlayer.h>

@class ADB_VHB_AdBreakInfo;
@class ADB_VHB_AdInfo;
@class ADB_VHB_VideoInfo;
@class ADB_VHB_ChapterInfo;

FOUNDATION_EXPORT NSString *const PLAYER_EVENT_VIDEO_LOAD;
FOUNDATION_EXPORT NSString *const PLAYER_EVENT_VIDEO_UNLOAD;
FOUNDATION_EXPORT NSString *const PLAYER_EVENT_PLAY;
FOUNDATION_EXPORT NSString *const PLAYER_EVENT_PAUSE;
FOUNDATION_EXPORT NSString *const PLAYER_EVENT_COMPLETE;
FOUNDATION_EXPORT NSString *const PLAYER_EVENT_SEEK_START;
FOUNDATION_EXPORT NSString *const PLAYER_EVENT_SEEK_COMPLETE;
FOUNDATION_EXPORT NSString *const PLAYER_EVENT_AD_START;
FOUNDATION_EXPORT NSString *const PLAYER_EVENT_AD_COMPLETE;
FOUNDATION_EXPORT NSString *const PLAYER_EVENT_CHAPTER_START;
FOUNDATION_EXPORT NSString *const PLAYER_EVENT_CHAPTER_COMPLETE;


@interface VideoPlayer : MPMoviePlayerController

#pragma mark Properties
@property(strong, nonatomic, readonly) ADB_VHB_VideoInfo *videoInfo;
@property(strong, nonatomic, readonly) ADB_VHB_AdBreakInfo *adBreakInfo;
@property(strong, nonatomic, readonly) ADB_VHB_AdInfo *adInfo;
@property(strong, nonatomic, readonly) ADB_VHB_ChapterInfo *chapterInfo;

#pragma mark Initializer
- (instancetype)init NS_UNAVAILABLE;
- (instancetype)initWithContentURL:(NSURL *)url NS_DESIGNATED_INITIALIZER;

@end
