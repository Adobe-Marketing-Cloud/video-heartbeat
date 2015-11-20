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

#import "ViewController.h"
#import "VideoPlayer.h"
#import "VideoAnalyticsProvider.h"
#import "ADBMobile.h"
#import "Configuration.h"

@interface ViewController ()

@property(strong, nonatomic) IBOutlet UILabel *pubLabel;
@property(strong, nonatomic) VideoPlayer *videoPlayer;
@property(strong, nonatomic) VideoAnalyticsProvider *videoAnalyticsProvider;

@end


@implementation ViewController

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];

    [ADBMobile setDebugLogging:YES];
    
    _pubLabel.hidden = YES;
    
    // Setup the video player
    NSURL *streamUrl = [NSURL URLWithString:VIDEO_URL];
    if (!self.videoPlayer)
    {
        self.videoPlayer = [[VideoPlayer alloc] init];
		[self.videoPlayer loadContentURL:streamUrl];
        
        [self.videoPlayer.view setFrame:CGRectMake(0, 0, self.view.bounds.size.width, self.view.bounds.size.height)];
        [self.view addSubview:self.videoPlayer.view];
        [self.view bringSubviewToFront:_pubLabel];
        
        [self _installNotificationHandlers];
    }
    
    // Create the VideoAnalyticsProvider instance and attach it to the VideoPlayer instance.
    if (!self.videoAnalyticsProvider)
	{
        // Setup video-tracking.
        self.videoAnalyticsProvider = [[VideoAnalyticsProvider alloc] initWithPlayer:self.videoPlayer];
    }
}

- (void)viewWillDisappear:(BOOL)animated
{
    // End the life-cycle of the VideoAnalytics provider. (or full screen)
    [super viewWillDisappear:animated];
}

- (void)_installNotificationHandlers
{
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(onAdStart:)
                                                 name:PLAYER_EVENT_AD_START
                                               object:nil];

    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(onAdComplete:)
                                                 name:PLAYER_EVENT_AD_COMPLETE
                                               object:nil];
}

- (void)onAdStart:(NSNotification *)notification
{
    _pubLabel.hidden = NO;
}

- (void)onAdComplete:(NSNotification *)notification
{
    _pubLabel.hidden = YES;
}

@end
