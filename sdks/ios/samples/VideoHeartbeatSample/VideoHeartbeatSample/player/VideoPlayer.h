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

FOUNDATION_EXPORT NSString *const PLAYER_EVENT_VIDEO_LOAD;
FOUNDATION_EXPORT NSString *const PLAYER_EVENT_PLAY;
FOUNDATION_EXPORT NSString *const PLAYER_EVENT_PAUSE;
FOUNDATION_EXPORT NSString *const PLAYER_EVENT_COMPLETE;
FOUNDATION_EXPORT NSString *const PLAYER_EVENT_SEEK_START;
FOUNDATION_EXPORT NSString *const PLAYER_EVENT_SEEK_COMPLETE;

@interface VideoPlayer : MPMoviePlayerController

@property(nonatomic, readonly, retain) NSString *videoId;
@property(nonatomic, readonly, retain) NSNumber *videoDuration;
@property(nonatomic, readonly, retain) NSString *streamType;
@property(nonatomic, readonly) NSNumber *playhead;

@end