/*************************************************************************
 *
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 *  Copyright 2015 Adobe Systems Incorporated
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

/*
* Application layer has to extend this class and override these methods.
* This class serves as a delegate between Application player and VHL VideoPlayerPlugin
*/

@interface ADB_VHB_VideoPlayerPluginDelegate : NSObject

/**
 * Returns the VideoInfo instance containing current video playback information
 */
- (ADB_VHB_VideoInfo *) getVideoInfo;

/**
 * Returns the AdBreakInfo instance containing current AdBreak information
 */
- (ADB_VHB_AdBreakInfo *) getAdBreakInfo;

/**
 * Returns the AdInfo instance containing current Ad information
 */
- (ADB_VHB_AdInfo *) getAdInfo;

/**
 * Returns the ChapterInfo instance containing current Chapter information
 */
- (ADB_VHB_ChapterInfo *) getChapterInfo;

/**
 * Returns the QoSInfo instance containing current QoS information
 */
- (ADB_VHB_QoSInfo *) getQoSInfo;

@end
