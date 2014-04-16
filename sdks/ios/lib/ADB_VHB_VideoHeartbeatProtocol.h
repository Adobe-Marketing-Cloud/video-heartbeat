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

@protocol ADB_VHB_VideoHeartbeatProtocol <NSObject>

// -----------------[ Configuration & life-cycle management ]---------------------
- (void)configure:(ADB_VHB_ConfigData *)configData;
- (void)destroy;

// -----------------[ Video playback tracking ]---------------------
- (void)trackVideoLoad;
- (void)trackVideoUnload;
- (void)trackPlay;
- (void)trackPause;
- (void)trackBufferStart;
- (void)trackBufferComplete;
- (void)trackSeekStart;
- (void)trackSeekComplete;
- (void)trackComplete;

// -----------------[ Chapter tracking ]---------------------
- (void)trackChapterStart;
- (void)trackChapterComplete;

// -----------------[ Ad tracking ]---------------------
- (void)trackAdBreakStart;
- (void)trackAdBreakComplete;
- (void)trackAdStart;
- (void)trackAdComplete;

// -----------------[ QoS tracking ]---------------------
- (void)trackBitrateChange;


// -----------------[ Error tracking ]---------------------
- (void)trackVideoPlayerError:(NSString *)errorId;
- (void)trackApplicationError:(NSString *)errorId;

@end