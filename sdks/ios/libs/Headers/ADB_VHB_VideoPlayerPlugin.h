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
#import "ADB_HB_BasePlugin.h"
#import "ADB_VHB_VideoPlayerPluginDelegate.h"
#import "ADB_HB_PluginProtocol.h"
#import "ADB_HB_PluginConfigProtocol.h"

@class ADB_VHB_VideoPlayerPluginConfig;


@interface ADB_VHB_VideoPlayerPlugin : ADB_HB_BasePlugin


/**
 * Instantiates, creates and initializes the VideoPlayerPlugin.
 * Register any error callback methods using the VideoPlayerPluginDelegate instance
 */
- (instancetype)initWithDelegate:(ADB_VHB_VideoPlayerPluginDelegate *)delegate;

/**
 * Method to set configData on ADB_VHB_VideoPlayerPlugin.
 * Expected ADB_VHB_VideoPlayerPluginConfig instance for configData.
 */
- (void)configure:(id<ADB_HB_PluginConfigProtocol>)configData;

/**
 * Video playback tracking method to track Session Start
 * triggers VIDEO_START event
 */
- (void)trackSessionStart;

/**
 * Video playback tracking method to track Video Load, and set the current session active
 * triggers VIDEO_LOAD event
 */
- (void)trackVideoLoad;

/**
 * Video playback tracking method to track Video Unload and deactivate current session
 * triggers VIDEO_UNLOAD event
 */
- (void)trackVideoUnload;

/**
 * Video playback tracking method to track Video Play
 * triggers VIDEO_PLAY event
 */
- (void)trackPlay;

/**
 * Video playback tracking method to track Video Pause
 * triggers VIDEO_PAUSE event
 */
- (void)trackPause;

/**
 * Video playback tracking method to track Buffer Start
 * triggers BUFFER_START event
 */
- (void)trackBufferStart;

/**
 * Video playback tracking method to track Buffer Complete
 * triggers BUFFER_COMPLETE event
 */
- (void)trackBufferComplete;

/**
 * Video playback tracking method to track Seek Start
 * triggers SEEK_START event
 */
- (void)trackSeekStart;

/**
 * Video playback tracking method to track Seek Complete
 * triggers SEEK_COMPLETE event
 */
- (void)trackSeekComplete;

/**
 * Video playback tracking method to track Video Complete
 * triggers VIDEO_COMPLETE event
 */
- (void)trackComplete;

/**
 * Video playback tracking method to track Video Complete
 * triggers VIDEO_COMPLETE event and calls back the callback method.
 */
- (void)trackComplete:(void (^)(void))callback;

/**
 * Chapter playback tracking method to track Chapter Start
 * triggers CHAPTER_START event
 */
- (void)trackChapterStart;

/**
 * Chapter playback tracking method to track Chapter Complete
 * triggers CHAPTER_COMPLETE event
 */
- (void)trackChapterComplete;

/**
 * Ad playback tracking method to track Ad Start
 * triggers AD_START event
 */
- (void)trackAdStart;

/**
 * Ad playback tracking method to track Ad Complete
 * triggers AD_COMPLETE event
 */
- (void)trackAdComplete;

/**
 * QoS tracking method to track Bitrate Change
 * triggers BITRATE_CHANGE event
 */
- (void)trackBitrateChange;

/**
 * Error tracking method to track Player Error
 * triggers TRACK_ERROR event
 */
- (void)trackVideoPlayerError:(NSString *)errorId;

/**
 * Error tracking method to track Application Error
 * triggers TRACK_ERROR event
 */
- (void)trackApplicationError:(NSString *)errorId;

@end
