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

#import "ADB_HB_BasePlugin.h"
#import "ADB_VHB_AdobeHeartbeatPluginDelegate.h"
#import "ADB_HB_PluginProtocol.h"
#import "ADB_HB_PluginConfigProtocol.h"

@class ADB_HB_HeartbeatPluginConfig;

@interface ADB_VHB_AdobeHeartbeatPlugin : ADB_HB_BasePlugin

#pragma mark Initializer

- (instancetype)initWithName:(NSString *)name NS_UNAVAILABLE;

/**
 * Instantiates, creates and initializes the AdobeHeartbeatPlugin.
 * Register any error callback methods using the AdobeHeartbeatPluginDelegate instance
 */
- (instancetype)initWithDelegate:(ADB_VHB_AdobeHeartbeatPluginDelegate *)delegate NS_DESIGNATED_INITIALIZER;

#pragma mark Methods

/**
 * Method to set configData on ADB_VHB_AdobeHeartbeatPlugin.
 * Expected AdobeHeartbeatPluginConfig instance for configData.
 */
- (void)configure:(id <ADB_HB_PluginConfigProtocol>)configData;

@end
