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

NSString *const PLAYER_EVENT_VIDEO_LOAD = @"video_load";
NSString *const PLAYER_EVENT_PLAY = @"play";
NSString *const PLAYER_EVENT_PAUSE = @"pause";
NSString *const PLAYER_EVENT_COMPLETE = @"complete";
NSString *const PLAYER_EVENT_SEEK_START = @"seek_start";
NSString *const PLAYER_EVENT_SEEK_COMPLETE = @"seek_complete";

@interface VideoPlayer()

@property(nonatomic, assign) BOOL videoLoaded;
@property(nonatomic, assign) BOOL isSeeking;
@property(nonatomic, assign) NSTimer *pauseTimer;
@property(nonatomic, retain) NSString *videoId;
@property(nonatomic, retain) NSNumber *videoDuration;
@property(nonatomic, retain) NSString *streamType;

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

        _pauseTimer = nil;
        _videoLoaded = NO;
        _isSeeking = NO;
    }

    return self;
}

- (void)dealloc {
    [_pauseTimer invalidate]; _pauseTimer = nil;

    [super dealloc];
}

- (NSNumber *)playhead {
    return [NSNumber numberWithDouble:self.currentPlaybackTime];
}

#pragma mark - Native VideoPlayer control notification handlers.
- (void)onMediaFinishedPlaying:(NSNotification *)notification {
    NSDictionary *dict = [notification userInfo];
    NSNumber *result = [dict objectForKey:MPMoviePlayerPlaybackDidFinishReasonUserInfoKey];

    if([result intValue] == MPMovieFinishReasonPlaybackEnded) {
        [[NSNotificationCenter defaultCenter] postNotificationName:PLAYER_EVENT_COMPLETE
                                                            object:self
                                                          userInfo:nil];
    }

    _videoLoaded = NO;
    _isSeeking = NO;
}

- (void)onMediaStateChange:(NSNotification *)notification {
    switch (self.playbackState) {
        case MPMoviePlaybackStatePaused:
            [self.pauseTimer invalidate];
            self.pauseTimer = [[NSTimer scheduledTimerWithTimeInterval:0.5
                                                            target:self
                                                          selector:@selector(_pauseIfSeekHasNotStarted)
                                                          userInfo:nil
                                                           repeats:NO] retain];
            break;

        case MPMoviePlaybackStateStopped:
        case MPMoviePlaybackStateInterrupted:
            NSLog(@"Stopping playback.");

            [[NSNotificationCenter defaultCenter] postNotificationName:PLAYER_EVENT_PAUSE
                                                                object:self
                                                              userInfo:nil];
            break;

        case MPMoviePlaybackStatePlaying:
            NSLog(@"Starting playback.");

            if (!self.videoLoaded) {
                NSArray *chunks = [[self.contentURL absoluteString] componentsSeparatedByString: @"/"];
                self.videoId = [NSString stringWithString:chunks[chunks.count-1]];
                self.videoDuration = [NSNumber numberWithDouble:self.duration];
                self.streamType = ADB_VHB_ASSET_TYPE_VOD;

                [[NSNotificationCenter defaultCenter] postNotificationName:PLAYER_EVENT_VIDEO_LOAD
                                                                    object:self
                                                                  userInfo:nil];

                self.videoLoaded = YES;
                self.isSeeking = NO;
            }

            if (self.isSeeking) {
                NSLog(@"Stop seeking.");
                [[NSNotificationCenter defaultCenter] postNotificationName:PLAYER_EVENT_SEEK_COMPLETE
                                                                    object:self
                                                                  userInfo:nil];

                self.isSeeking = NO;
            } else {
                NSLog(@"Resume playback.");
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


- (void)_pauseIfSeekHasNotStarted {
    if (!_isSeeking) {
        NSLog(@"Pausing playback.");

        [[NSNotificationCenter defaultCenter] postNotificationName:PLAYER_EVENT_PAUSE
                                                            object:self
                                                          userInfo:nil];
    } else {
        NSLog(@"This pause is caused by a seek operation. Skipping.");
    }
}
@end