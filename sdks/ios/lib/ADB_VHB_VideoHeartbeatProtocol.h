/*************************************************************************
 *
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 *  Copyright 2013 Adobe Systems Incorporated
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 *
 **************************************************************************/

#import <Foundation/Foundation.h>
#import "ADB_VHB_ConfigData.h"
#import "ADB_VHB_QoSData.h"

@protocol ADB_VHB_VideoHeartbeatProtocol <NSObject>
+ (NSString *)version;

- (void)config:(ADB_VHB_ConfigData *)configData;
- (void)destroy;

- (void)trackMainVideoLoad:(NSString *)videoId length:(NSTimeInterval)length type:(NSString *)type;
- (void)trackMainVideoClose;
- (void)trackPlay;
- (void)trackStop;
- (void)trackComplete;
- (void)trackBufferStart;
- (void)trackBufferComplete;
- (void)trackSeekStart;
- (void)trackSeekComplete;

- (void)trackBitrateChange:(NSUInteger)bitrate;
- (void)trackQoSUpdate:(ADB_VHB_QoSData *)qosData;

- (void)trackAdBreakStart:(NSString *)podId;
- (void)trackAdBreakComplete;
- (void)trackAdStart:(NSString *)adId length:(NSTimeInterval)length parentPodPosition:(NSUInteger)parentPodPosition cpm:(NSString *)cpm;
- (void)trackAdComplete;

- (void)trackVideoPlayerError:(NSString *)errorId;
- (void)trackApplicationError:(NSString *)errorId;

@end