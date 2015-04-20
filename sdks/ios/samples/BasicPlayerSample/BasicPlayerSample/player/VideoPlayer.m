/*
 * ADOBE SYSTEMS INCORPORATED
 * Copyright 2015 Adobe Systems Incorporated
 * All Rights Reserved.

 * NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
 * terms of the Adobe license agreement accompanying it.  If you have received this file from a
 * source other than Adobe, then your use, modification, or distribution of it requires the prior
 * written permission of Adobe.
 */

#import "VideoPlayer.h"
#import "ADB_VHB_AdBreakInfo.h"
#import "Configuration.h"
#import "ADB_VHB_AdInfo.h"
#import "ADB_VHB_VideoInfo.h"
#import "ADB_VHB_ChapterInfo.h"
#import "ADB_VHB_QoSInfo.h"
#import "ADB_VHB_AssetType.h"

NSString *const PLAYER_EVENT_VIDEO_LOAD = @"player_video_load";
NSString *const PLAYER_EVENT_VIDEO_UNLOAD = @"player_video_unload";
NSString *const PLAYER_EVENT_PLAY = @"player_play";
NSString *const PLAYER_EVENT_PAUSE = @"player_pause";
NSString *const PLAYER_EVENT_COMPLETE = @"player_complete";
NSString *const PLAYER_EVENT_SEEK_START = @"player_seek_start";
NSString *const PLAYER_EVENT_SEEK_COMPLETE = @"player_seek_complete";
NSString *const PLAYER_EVENT_AD_START = @"player_ad_start";
NSString *const PLAYER_EVENT_AD_COMPLETE = @"player_ad_complete";
NSString *const PLAYER_EVENT_CHAPTER_START = @"player_chapter_start";
NSString *const PLAYER_EVENT_CHAPTER_COMPLETE = @"player_chapter_complete";

NSUInteger const AD_START_POS = 15;
NSUInteger const AD_END_POS = 30;
NSUInteger const AD_LENGTH = 15;

NSUInteger const CHAPTER1_START_POS = 0;
NSUInteger const CHAPTER1_END_POS = 15;
NSUInteger const CHAPTER1_LENGTH = 15;

NSUInteger const CHAPTER2_START_POS = 30;
NSUInteger const CHAPTER2_LENGTH = 30;

NSTimeInterval const MONITOR_TIMER_INTERVAL = 0.5; // 500 milliseconds

@interface VideoPlayer ()

@property(nonatomic) BOOL videoLoaded;
@property(nonatomic, getter=isSeeking) BOOL seeking;
@property(nonatomic, getter=isPaused) BOOL paused;

@property(strong, nonatomic) ADB_VHB_VideoInfo *videoInfo;
@property(strong, nonatomic) ADB_VHB_AdBreakInfo *adBreakInfo;
@property(strong, nonatomic) ADB_VHB_AdInfo *adInfo;
@property(strong, nonatomic) ADB_VHB_ChapterInfo *chapterInfo;

@property(copy, nonatomic, readonly) NSString *playerName;
@property(copy, nonatomic, readonly) NSString *videoId;
@property(copy, nonatomic, readonly) NSString *videoName;
@property(copy, nonatomic, readonly) NSString *streamType;

@property(weak, nonatomic) NSTimer *monitorTimer;

@end


@implementation VideoPlayer

#pragma mark Initializer & dealloc
- (instancetype)initWithContentURL:(NSURL *)url
{
    self = [super initWithContentURL:url];

    if (self)
    {
        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(onMediaStateChange:)
                                                     name:MPMoviePlayerPlaybackStateDidChangeNotification
                                                   object:self];

        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(onMediaFinishedPlaying:)
                                                     name:MPMoviePlayerPlaybackDidFinishNotification
                                                   object:self];

        _videoLoaded = NO;
        _seeking = NO;
        _paused = YES;
        
        _playerName = PLAYER_NAME;
        _videoId = VIDEO_ID;
        _videoName = VIDEO_NAME;
        _streamType = ASSET_TYPE_VOD;
        
        _qosInfo = [[ADB_VHB_QoSInfo alloc] init];
        _qosInfo.bitrate = [NSNumber numberWithInt:50000];
        _qosInfo.fps = [NSNumber numberWithInt:24];
        _qosInfo.droppedFrames = [NSNumber numberWithInt:10];
        _qosInfo.startupTime = [NSNumber numberWithInt:2];
    }

    return self;
}

- (void)dealloc
{
    [_monitorTimer invalidate];
}


#pragma mark Public property accessors

- (ADB_VHB_VideoInfo *)videoInfo
{
    if (self.adInfo)
    {
        // During ad-playback the main video playhead remains
                       // constant at where it was when the ad started.
        _videoInfo.playhead = @(AD_START_POS);
    }
    else
    {
        _videoInfo.playhead = (self.currentPlaybackTime < AD_START_POS)
                ? @(self.currentPlaybackTime)
                : @(self.currentPlaybackTime - AD_LENGTH);
    }

    return _videoInfo;
}


#pragma mark Native VideoPlayer control notification handlers

- (void)onMediaFinishedPlaying:(NSNotification *)notification
{
    NSDictionary *dict = [notification userInfo];
    NSNumber *result = dict[MPMoviePlayerPlaybackDidFinishReasonUserInfoKey];

    if (result.intValue == MPMovieFinishReasonPlaybackEnded) {
        [self _completeVideo];
    }
}

- (void)onMediaStateChange:(NSNotification *)notification {
    switch (self.playbackState)
    {
        case MPMoviePlaybackStatePaused:
            [NSTimer scheduledTimerWithTimeInterval:0.5
                                             target:self
                                           selector:@selector(_pauseIfSeekHasNotStarted)
                                           userInfo:nil
                                            repeats:NO];
            break;

        case MPMoviePlaybackStateStopped:
        case MPMoviePlaybackStateInterrupted:
            NSLog(@"Stopping playback.");
            
            [self _pausePlayback];
            break;

        case MPMoviePlaybackStatePlaying:
            NSLog(@"Starting playback.");
            
            if (self.isSeeking)
            {
                NSLog(@"Stop seeking.");
                self.seeking = NO;
                [self _doPostSeekComputations];
                
                [[NSNotificationCenter defaultCenter] postNotificationName:PLAYER_EVENT_SEEK_COMPLETE
                                                                    object:self
                                                                  userInfo:nil];
            } else
            {
                NSLog(@"Resume playback.");
                [self _openVideoIfNecessary];
                self.paused = NO;
                [[NSNotificationCenter defaultCenter] postNotificationName:PLAYER_EVENT_PLAY
                                                                    object:self
                                                                  userInfo:nil];
            }
            break;

        case MPMoviePlaybackStateSeekingBackward:
        case MPMoviePlaybackStateSeekingForward:
            NSLog(@"Start seeking.");

            [self _openVideoIfNecessary];
            self.seeking = YES;
            
            [[NSNotificationCenter defaultCenter] postNotificationName:PLAYER_EVENT_SEEK_START
                                                                object:self
                                                              userInfo:nil];
            break;
    }
}


#pragma mark Private helper methods

- (void)_openVideoIfNecessary
{
    if (!self.videoLoaded)
    {
        [self _resetInternalState];
        
        [self _startVideo];
        
        // Start the monitor timer.
        self.monitorTimer = [NSTimer scheduledTimerWithTimeInterval:MONITOR_TIMER_INTERVAL
                                                             target:self
                                                           selector:@selector(_onTick)
                                                           userInfo:nil
                                                            repeats:YES];
    }
}

- (void)_pauseIfSeekHasNotStarted
{
    if (!self.isSeeking)
    {
        [self _pausePlayback];
    }
    else
    {
        NSLog(@"This pause is caused by a seek operation. Skipping.");
    }
}

- (void)_pausePlayback
{
    NSLog(@"Pausing playback.");
    
    self.paused = YES;
    
    [[NSNotificationCenter defaultCenter] postNotificationName:PLAYER_EVENT_PAUSE
                                                        object:self
                                                      userInfo:nil];
}

- (void)_startVideo
{
    // Prepare the video info.
    self.videoInfo = [[ADB_VHB_VideoInfo alloc] init];
    self.videoInfo.id = self.videoId;
    self.videoInfo.name = self.videoName;
    self.videoInfo.playerName = self.playerName;
    self.videoInfo.length = @(self.duration);
    self.videoInfo.streamType = self.streamType;
    self.videoInfo.playhead = @(self.currentPlaybackTime);
    
    self.videoLoaded = YES;
    
    [[NSNotificationCenter defaultCenter] postNotificationName:PLAYER_EVENT_VIDEO_LOAD
                                                        object:self
                                                      userInfo:nil];
}

- (void)_completeVideo {
    // Complete the second chapter.
    [self _completeChapter];
    
    [[NSNotificationCenter defaultCenter] postNotificationName:PLAYER_EVENT_COMPLETE
                                                        object:self
                                                      userInfo:nil];

    [self _unloadVideo];
}

- (void)_unloadVideo {
    [[NSNotificationCenter defaultCenter] postNotificationName:PLAYER_EVENT_VIDEO_UNLOAD
                                                        object:self
                                                      userInfo:nil];
    
    [self.monitorTimer invalidate];
    
    [self _resetInternalState];
}

- (void)_resetInternalState {
    self.videoLoaded = NO;
    self.seeking = NO;
    self.paused = YES;
    self.monitorTimer = nil;
}

- (void)_startChapter1 {
    // Prepare the chapter info.
    self.chapterInfo = [[ADB_VHB_ChapterInfo alloc] init];
    self.chapterInfo.length = @(CHAPTER1_LENGTH);
    self.chapterInfo.startTime = @(CHAPTER1_START_POS);
    self.chapterInfo.position = @(1);
    self.chapterInfo.name = @"First chapter";

    [[NSNotificationCenter defaultCenter] postNotificationName:PLAYER_EVENT_CHAPTER_START
                                                        object:self
                                                      userInfo:nil];
}

- (void)_startChapter2 {
    // Prepare the chapter info.
    self.chapterInfo = [[ADB_VHB_ChapterInfo alloc] init];
    self.chapterInfo.length = @(CHAPTER2_LENGTH);
    self.chapterInfo.startTime = @(CHAPTER2_START_POS);
    self.chapterInfo.position = @(2);
    self.chapterInfo.name = @"Second chapter";

    [[NSNotificationCenter defaultCenter] postNotificationName:PLAYER_EVENT_CHAPTER_START
                                                        object:self
                                                      userInfo:nil];
}

- (void)_completeChapter {
    self.chapterInfo = nil;

    [[NSNotificationCenter defaultCenter] postNotificationName:PLAYER_EVENT_CHAPTER_COMPLETE
                                                        object:self
                                                      userInfo:nil];
}

- (void)_startAd {
    // Prepare the ad-break info.
    self.adBreakInfo = [[ADB_VHB_AdBreakInfo alloc] init];
    self.adBreakInfo.name = @"First Ad-Break";
    self.adBreakInfo.position = @1;
    self.adBreakInfo.playerName = PLAYER_NAME;
    self.adBreakInfo.startTime = @(AD_START_POS);

    // Prepare the ad info.
    self.adInfo = [[ADB_VHB_AdInfo alloc] init];
    self.adInfo.id = @"001";
    self.adInfo.name = @"Sample ad";
    self.adInfo.length = @(AD_LENGTH);
    self.adInfo.position = @1;

    // Start the ad.
    [[NSNotificationCenter defaultCenter] postNotificationName:PLAYER_EVENT_AD_START
                                                        object:self
                                                      userInfo:nil];
}

- (void)_completeAd {
    // Complete the ad.
    [[NSNotificationCenter defaultCenter] postNotificationName:PLAYER_EVENT_AD_COMPLETE
                                                        object:self
                                                      userInfo:nil];

    // Clear the ad and ad-break info.
    self.adInfo = nil;
    self.adBreakInfo = nil;
}

- (void)_doPostSeekComputations {
    NSTimeInterval vTime = self.currentPlaybackTime;
    
    // Seek inside the first chapter.
    if (vTime < CHAPTER1_END_POS) {
        // If we were not inside the first chapter before, trigger a chapter start
        if (!self.chapterInfo || ![self.chapterInfo.position isEqualToNumber:@1]) {
            [self _startChapter1];
            
            // If we were in the ad, clear the ad and ad-break info, but don't send the AD_COMPLETE event.
            if (self.adInfo) {
                self.adInfo = nil;
                self.adBreakInfo = nil;
            }
        }
    }

    // Seek inside ad.
    else if (vTime >= AD_START_POS && vTime < AD_END_POS) {
        // If we were not inside the ad before, trigger an ad-start.
        if (!self.adInfo) {
            [self _startAd];
            
            // Also, clear the chapter info, without sending the CHAPTER_COMPLETE event.
            self.chapterInfo = nil;
        }
    }

    // Seek inside the second chapter.
    else {
        // If we were not inside the 2nd chapter before, trigger a chapter start
        if (!self.chapterInfo || ![self.chapterInfo.position isEqualToNumber:@2]) {
            [self _startChapter2];
            
            // If we were in the ad, clear the ad and ad-break info, but don't send the AD_COMPLETE event.
            if (self.adInfo) {
                self.adInfo = nil;
                self.adBreakInfo = nil;
            }
        }
    }
}

- (void)_onTick {
    if (self.isSeeking || self.isPaused) return;
    
    NSTimeInterval vTime = self.currentPlaybackTime;

    // If we are inside the ad content:
    if (vTime >= AD_START_POS && vTime < AD_END_POS) {
        if (self.chapterInfo) {
            // If for some reason we were inside a chapter, close it.
            [self _completeChapter];
        }

        if (!self.adInfo) {
            // Start the ad (if not already started).
            [self _startAd];
        }
    }

    // Otherwise, we are outside the ad content:
    else {
        if (self.adInfo) {
            // Complete the ad (if needed).
            [self _completeAd];
        }

        if (vTime < CHAPTER1_END_POS) {
            if (self.chapterInfo && ![self.chapterInfo.position isEqualToNumber:@1]) {
                // If we were inside another chapter, complete it.
                [self _completeChapter];
            }

            if (!self.chapterInfo) {
                // Start the first chapter.
                [self _startChapter1];
            }
        } else {
            if (self.chapterInfo && ![self.chapterInfo.position isEqualToNumber:@2]) {
                // If we were inside another chapter, complete it.
                [self _completeChapter];
            }

            if (!self.chapterInfo) {
                // Start the second chapter.
                [self _startChapter2];
            }
        }
    }
}

@end
