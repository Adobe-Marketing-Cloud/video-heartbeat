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

@class ADB_VHB_PlayerDelegate;
@class ADB_VHB_ConfigData;

@interface ADB_VHB_VideoHeartbeat : NSObject

#pragma mark Initializers
+ (instancetype)new NS_UNAVAILABLE;
- (instancetype)init NS_UNAVAILABLE;

- (instancetype)initWithPlayerDelegate:(ADB_VHB_PlayerDelegate *)playerDelegate;

- (instancetype)initWithPlayerDelegate:(ADB_VHB_PlayerDelegate *)playerDelegate
                               plugins:(NSArray *)plugins NS_DESIGNATED_INITIALIZER;


#pragma mark Methods

// Configuration and life-cycle management
- (void)configure:(ADB_VHB_ConfigData *)configData;
- (void)destroy;

// Video tracking
- (void)trackVideoLoad;
- (void)trackVideoUnload;
- (void)trackPlay;
- (void)trackPause;
- (void)trackBufferStart;
- (void)trackBufferComplete;
- (void)trackSeekStart;
- (void)trackSeekComplete;
- (void)trackComplete;

// Ad tracking
- (void)trackAdStart;
- (void)trackAdComplete;

// Chapter tracking
- (void)trackChapterStart;
- (void)trackChapterComplete;

// QoS tracking
- (void)trackBitrateChange;

// Error tracking
- (void)trackVideoPlayerError:(NSString *)errorId;
- (void)trackApplicationError:(NSString *)errorId;

@end
