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
#import "ViewController.h"
#import "VideoPlayer.h"
#import "VideoAnalyticsProvider.h"

@interface ViewController ()
@property (strong, nonatomic) VideoPlayer *videoPlayer;
@property (strong, nonatomic) VideoAnalyticsProvider *videoAnalyticsProvider;
@end

@implementation ViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view, typically from a nib.
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];

    NSString *videoPath = [[NSBundle mainBundle] pathForResource:@"clickbaby" ofType: @"mp4"];
    if (!videoPath) {
        NSLog(@"Cannot find the video file.");
        return;
    }

    NSURL *streamUrl = [NSURL fileURLWithPath:videoPath];
    self.videoPlayer = [[VideoPlayer alloc] initWithContentURL:streamUrl];

    [self.videoPlayer prepareToPlay];
    [self.view setFrame: CGRectMake(0, 0, 192, 192)];
    [self.view addSubview:self.videoPlayer.view];
    [self.videoPlayer setFullscreen:YES animated:YES];
    self.videoPlayer.shouldAutoplay = NO;

    // Setup video-tracking.
    self.videoAnalyticsProvider = [[VideoAnalyticsProvider alloc] initWithPlayer:self.videoPlayer];
}

- (void)dealloc {
    // End the life-cycle of the VideoAnalytics provider.

    // Release all allocated resources.
    [_videoAnalyticsProvider release]; _videoAnalyticsProvider = nil;
    [_videoPlayer release]; _videoPlayer = nil;

    [super dealloc];
}

@end
