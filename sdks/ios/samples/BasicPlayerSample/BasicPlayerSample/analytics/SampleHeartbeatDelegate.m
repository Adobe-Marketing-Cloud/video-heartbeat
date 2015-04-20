//
//  SampleHeartbeatDelegate.m
//  BasicPlayerSample
//
//  Created by Prerna Vij on 3/30/15.
//  Copyright (c) 2015 Adobe. All rights reserved.
//

#import "SampleHeartbeatDelegate.h"
#import "ADB_VHB_ErrorInfo.h"

static NSString *const LOG_TAG = @"[HeartbeatSample]::SampleHeartbeatDelegate";

@implementation SampleHeartbeatDelegate

- (void)onError:(ADB_VHB_ErrorInfo *)errorInfo
{
    NSString *msg = [NSString stringWithFormat:@"%@ ERROR:%@ | %@", LOG_TAG, errorInfo.message, errorInfo.details];
    NSLog (@"%@",msg);
}

@end