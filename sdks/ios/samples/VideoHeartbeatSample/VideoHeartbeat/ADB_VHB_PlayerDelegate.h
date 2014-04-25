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

@class ADB_VHB_VideoInfo;
@class ADB_VHB_AdBreakInfo;
@class ADB_VHB_AdInfo;
@class ADB_VHB_ChapterInfo;
@class ADB_VHB_QoSInfo;
@class ADB_VHB_ErrorInfo;

@interface ADB_VHB_PlayerDelegate : NSObject

- (ADB_VHB_VideoInfo *) getVideoInfo;
- (ADB_VHB_AdBreakInfo *) getAdBreakInfo;
- (ADB_VHB_AdInfo *) getAdInfo;
- (ADB_VHB_ChapterInfo *) getChapterInfo;
- (ADB_VHB_QoSInfo *) getQoSInfo;
- (void) onError:(ADB_VHB_ErrorInfo *)errorInfo;

@end
