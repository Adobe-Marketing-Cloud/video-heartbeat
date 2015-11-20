//
//  SampleHeartbeatPluginDelegate.m
//  BasicPlayerSample
//
//  Created by Prerna Vij on 3/30/15.
//  Copyright (c) 2015 Adobe. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "SampleHeartbeatPluginDelegate.h"

static NSString *const LOG_TAG = @"[HeartbeatSample]::SampleAdobeHeartbeatPluginDelegate";

@implementation SampleHeartbeatPluginDelegate

- (void)onError:(ADB_VHB_ErrorInfo *)errorInfo
{
    NSString *msg = [NSString stringWithFormat:@"%@ ERROR:%@ | %@", LOG_TAG, errorInfo.message, errorInfo.details];
    NSLog (@"%@",msg);
}

@end