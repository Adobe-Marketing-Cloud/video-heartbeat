/*
 * ADOBE SYSTEMS INCORPORATED
 * Copyright 2014 Adobe Systems Incorporated
 * All Rights Reserved.

 * NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
 * terms of the Adobe license agreement accompanying it.  If you have received this file from a
 * source other than Adobe, then your use, modification, or distribution of it requires the prior
 * written permission of Adobe.
 */

#import "VideoPlayer.h"
#import "ADB_VHB_AssetType.h"
#import "ADB_VHB_AdBreakInfo.h"
#import "Configuration.h"
#import "ADB_VHB_AdInfo.h"
#import "ADB_VHB_VideoInfo.h"
#import "ADB_VHB_ChapterInfo.h"

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

NSUInteger const kAdStartPos = 15;
NSUInteger const kAdEndPos = 30;
NSUInteger const kAdLength = 15;

NSUInteger const k1stChapterStartPos = 0;
NSUInteger const k1stChapterEndPos = 15;
NSUInteger const k1stChapterLength = 15;

NSUInteger const k2ndChapterStartPos = 30;
NSUInteger const k2ndChapterEndPos = 60;
NSUInteger const k2ndChapterLength = 30;

@interface VideoPlayer ()

@property(nonatomic, assign) BOOL videoLoaded;
@property(nonatomic, assign) BOOL isSeeking;
@property(nonatomic, assign) BOOL isPaused;
@property(nonatomic, assign) NSTimer *monitorTimer;
@property(nonatomic, retain) ADB_VHB_VideoInfo *videoInfo;
@property(nonatomic, retain) ADB_VHB_AdBreakInfo *adBreakInfo;
@property(nonatomic, retain) ADB_VHB_AdInfo *adInfo;
@property(nonatomic, retain) ADB_VHB_ChapterInfo *chapterInfo;

@end

@implementation VideoPlayer
- (id)init {
    self = [super init];

    if (self) {
        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(onMediaStateChange:)
                                                     name:MPMoviePlayerPlaybackStateDidChangeNotification
                                                   object:self];

        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(onMediaFinishedPlaying:)
                                                     name:MPMoviePlayerPlaybackDidFinishNotification
                                                   object:self];

        _videoLoaded = NO;
        _isSeeking = NO;
        _isPaused = NO;
    }

    return self;
}

- (void)dealloc {
    [_monitorTimer invalidate];
    _monitorTimer = nil;
    [_videoInfo release];
    _videoInfo = nil;
    [_adBreakInfo release];
    _adBreakInfo = nil;
    [_adInfo release];
    _adInfo = nil;
    [_chapterInfo release];
    _chapterInfo = nil;

    [super dealloc];
}

- (ADB_VHB_VideoInfo *)videoInfo {
    // Update the playhead value.
    if (_adInfo) { // During ad-playback the main video playhead remains
        // constant at where it was when the ad started.
        _videoInfo.playhead = @(kAdStartPos);
    } else {
        _videoInfo.playhead = (self.currentPlaybackTime < kAdStartPos)
                ? @(self.currentPlaybackTime)
                : @(self.currentPlaybackTime - kAdLength);
    }

    return _videoInfo;
}

- (ADB_VHB_AdInfo *)adInfo {
    if (_adInfo) {
        // Update the playhead value.
        _adInfo.playhead = @(self.currentPlaybackTime - kAdStartPos);
    }

    return _adInfo;
}

#pragma mark -
#pragma mark - Native VideoPlayer control notification handlers.

- (void)onMediaFinishedPlaying:(NSNotification *)notification {
    NSDictionary *dict = [notification userInfo];
    NSNumber *result = [dict objectForKey:MPMoviePlayerPlaybackDidFinishReasonUserInfoKey];

    if ([result intValue] == MPMovieFinishReasonPlaybackEnded) {
        // Complete the 2nd chapter.
        [self _completeChapter];

        [[NSNotificationCenter defaultCenter] postNotificationName:PLAYER_EVENT_COMPLETE
                                                            object:self
                                                          userInfo:nil];

        [[NSNotificationCenter defaultCenter] postNotificationName:PLAYER_EVENT_VIDEO_UNLOAD
                                                            object:self
                                                          userInfo:nil];

        [self.monitorTimer invalidate];
    }

    // Reset all the state vars.
    self.videoLoaded = NO;
    self.isSeeking = NO;
    self.isPaused = NO;
}

- (void)onMediaStateChange:(NSNotification *)notification {
    switch (self.playbackState) {
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

            self.isPaused = YES;
            [[NSNotificationCenter defaultCenter] postNotificationName:PLAYER_EVENT_PAUSE
                                                                object:self
                                                              userInfo:nil];
            break;

        case MPMoviePlaybackStatePlaying:
            NSLog(@"Starting playback.");

            if (!self.videoLoaded) {
                [self _startVideo];
                [self _start1stChapter];

                // Start the monitor timer.
                self.monitorTimer = [NSTimer scheduledTimerWithTimeInterval:0.5
                                                                     target:self
                                                                   selector:@selector(_onTick)
                                                                   userInfo:nil
                                                                    repeats:YES];
            }

            if (self.isSeeking) {
                NSLog(@"Stop seeking.");

                [self _doPostSeekComputations];

                [[NSNotificationCenter defaultCenter] postNotificationName:PLAYER_EVENT_SEEK_COMPLETE
                                                                    object:self
                                                                  userInfo:nil];

                self.isSeeking = NO;
            } else {
                NSLog(@"Resume playback.");

                self.isPaused = NO;

                [[NSNotificationCenter defaultCenter] postNotificationName:PLAYER_EVENT_PLAY
                                                                    object:self
                                                                  userInfo:nil];
            }
            break;

        case MPMoviePlaybackStateSeekingBackward:
        case MPMoviePlaybackStateSeekingForward:
            NSLog(@"Start seeking.");

            [[NSNotificationCenter defaultCenter] postNotificationName:PLAYER_EVENT_SEEK_START
                                                                object:self
                                                              userInfo:nil];
            self.isSeeking = YES;
            break;
    }
}


#pragma mark -
#pragma mark - Private helper methods.

- (void)_pauseIfSeekHasNotStarted {
    if (!self.isSeeking) {
        NSLog(@"Pausing playback.");

        self.isPaused = YES;

        [[NSNotificationCenter defaultCenter] postNotificationName:PLAYER_EVENT_PAUSE
                                                            object:self
                                                          userInfo:nil];
    } else {
        NSLog(@"This pause is caused by a seek operation. Skipping.");
    }
}

- (void)_startVideo {
    NSArray *chunks = [[self.contentURL absoluteString] componentsSeparatedByString:@"/"];

    // Prepare the video info.
    ADB_VHB_VideoInfo *videoInfo = [[ADB_VHB_VideoInfo new] autorelease];
    videoInfo.id = [NSString stringWithString:chunks[chunks.count - 1]];
    videoInfo.playerName = PLAYER_NAME;
    videoInfo.length = @(self.duration);
    videoInfo.streamType = ADB_VHB_ASSET_TYPE_VOD;
    videoInfo.playhead = @(self.currentPlaybackTime);
    videoInfo.name = @"Test video - Click baby";

    self.videoInfo = videoInfo;

    [[NSNotificationCenter defaultCenter] postNotificationName:PLAYER_EVENT_VIDEO_LOAD
                                                        object:self
                                                      userInfo:nil];

    self.videoLoaded = YES;
    self.isSeeking = NO;
}

- (void)_start1stChapter {
    // Prepare the chapter info.
    ADB_VHB_ChapterInfo *chapterInfo = [[ADB_VHB_ChapterInfo new] autorelease];
    chapterInfo.length = @(k1stChapterLength);
    chapterInfo.startTime = @(k1stChapterStartPos);
    chapterInfo.position = @(1);
    chapterInfo.name = @"First chapter";

    self.chapterInfo = chapterInfo;

    [[NSNotificationCenter defaultCenter] postNotificationName:PLAYER_EVENT_CHAPTER_START
                                                        object:self
                                                      userInfo:nil];

}

- (void)_start2ndChapter {
    // Prepare the chapter info.
    ADB_VHB_ChapterInfo *chapterInfo = [[ADB_VHB_ChapterInfo new] autorelease];
    chapterInfo.length = @(k2ndChapterLength);
    chapterInfo.startTime = @(k2ndChapterStartPos);
    chapterInfo.position = @(2);
    chapterInfo.name = @"Second chapter";

    self.chapterInfo = chapterInfo;

    [[NSNotificationCenter defaultCenter] postNotificationName:PLAYER_EVENT_CHAPTER_START
                                                        object:self
                                                      userInfo:nil];

}

- (void)_completeChapter {
    if (self.chapterInfo) {
        self.chapterInfo = nil;

        [[NSNotificationCenter defaultCenter] postNotificationName:PLAYER_EVENT_CHAPTER_COMPLETE
                                                            object:self
                                                          userInfo:nil];
    }
}

- (void)_startAd {
    // Prepare the ad-break info.
    ADB_VHB_AdBreakInfo *adBreakInfo = [[ADB_VHB_AdBreakInfo new] autorelease];
    adBreakInfo.name = @"First Ad-Break";
    adBreakInfo.position = @1;
    adBreakInfo.playerName = PLAYER_NAME;
    adBreakInfo.startTime = @(kAdStartPos);

    self.adBreakInfo = adBreakInfo;

    // Prepare the ad info.
    ADB_VHB_AdInfo *adInfo = [[ADB_VHB_AdInfo new] autorelease];
    adInfo.id = @"001";
    adInfo.name = @"Sample ad";
    adInfo.length = @(kAdLength);
    adInfo.position = @1;
    adInfo.cpm = @"49750702676yfh075757";
    adInfo.playhead = @(self.currentPlaybackTime - kAdStartPos);

    self.adInfo = adInfo;

    // Start the ad.
    [[NSNotificationCenter defaultCenter] postNotificationName:PLAYER_EVENT_AD_START
                                                        object:self
                                                      userInfo:nil];
}

- (void)_stopAd {
    // Complete the ad.
    [[NSNotificationCenter defaultCenter] postNotificationName:PLAYER_EVENT_AD_COMPLETE
                                                        object:self
                                                      userInfo:nil];

    // Clear the ad-break info.
    self.adBreakInfo = nil;

    // Clear the ad-info.
    self.adInfo = nil;
}

- (void)_doPostSeekComputations {
    // Seek inside the first chapter.
    if (self.currentPlaybackTime < k1stChapterEndPos) {
        // If we were not inside the first chapter before, trigger a chapter start
        if (!self.chapterInfo || ![self.chapterInfo.position isEqualToNumber:@1]) {
            [self _start1stChapter];
        }
    }

        // Seek inside ad.
    else if (self.currentPlaybackTime >= kAdStartPos && self.currentPlaybackTime < kAdEndPos) {
        // If we were not inside the ad before, trigger an ad-start.
        if (!self.adInfo) {
            [self _startAd];
        }
    }

        // Seek inside the second chapter.
    else {
        // If we were not inside the 2nd chapter before, trigger a chapter start
        if (!self.chapterInfo || ![self.chapterInfo.position isEqualToNumber:@2]) {
            [self _start2ndChapter];
        }
    }
}

- (void)_onTick {
    if (self.isSeeking || self.isPaused) return;

    // We are inside the ad content.
    if (self.currentPlaybackTime >= kAdStartPos && self.currentPlaybackTime < kAdEndPos) {
        if (self.chapterInfo) {
            // If for some reason we were inside a chapter, close it.
            [self _completeChapter];
        }

        if (!self.adInfo) {
            // Start the ad (if not already started).
            [self _startAd];
        }
    }

        // We are outside the ad content.
    else {
        if (self.adInfo) {
            // Complete the ad (if needed).
            [self _stopAd];
        }

        if (self.currentPlaybackTime < k1stChapterEndPos) {
            if (!self.chapterInfo) { // If no chapter is currently started.
                // Start the 1st chapter.
                [self _start1stChapter];
            }

            if (![self.chapterInfo.position isEqualToNumber:@1]) { // If another chapter is currently in progress.
                // Close the chapter that is currently in progress.
                [self _completeChapter];

                // Start the 1st chapter.
                [self _start1stChapter];
            }
        } else {
            if (!self.chapterInfo) { // If no chapter is currently started.
                // Start the 2nd chapter.
                [self _start2ndChapter];
            }

            if (![self.chapterInfo.position isEqualToNumber:@2]) { // If another chapter is currently in progress.
                // Close the chapter that is currently in progress.
                [self _completeChapter];

                // Start the 2nd chapter.
                [self _start2ndChapter];
            }
        }
    }
}

@end