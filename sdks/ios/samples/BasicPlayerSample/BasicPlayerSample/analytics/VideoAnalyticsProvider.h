/*
 * ADOBE SYSTEMS INCORPORATED
 * Copyright 2015 Adobe Systems Incorporated
 * All Rights Reserved.

 * NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
 * terms of the Adobe license agreement accompanying it.  If you have received this file from a
 * source other than Adobe, then your use, modification, or distribution of it requires the prior
 * written permission of Adobe.
 */

#import <Foundation/Foundation.h>

@class VideoPlayer;
@class ADB_VHB_Heartbeat;
@class ADB_VHB_VideoPlayerPlugin;

@interface VideoAnalyticsProvider : NSObject

#pragma mark Initializer
- (instancetype)init NS_UNAVAILABLE;
- (instancetype)initWithPlayer:(VideoPlayer *)player NS_DESIGNATED_INITIALIZER;

#pragma mark Public methods
- (void)destroy;

@end
