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
 **************************************************************************/

#import <Foundation/Foundation.h>
#import "ADB_HB_BasePlugin.h"
#import "ADB_VHB_AdobeAnalyticsPluginDelegate.h"
#import "ADB_HB_PluginConfigProtocol.h"


@interface ADB_VHB_AdobeAnalyticsPlugin : ADB_HB_BasePlugin

/* Use this property to set custom metadata for Video, which would be sent out on video start pings */
@property(nonatomic, copy) NSDictionary *videoMetadata;

/* Use this property to set custom metadata for Ad, which would be sent out on ad start pings */
@property(nonatomic, copy) NSDictionary *adMetadata;

/* Use this property to set custom metadata for Chapter, which would be sent out on chapter start pings */
@property(nonatomic, copy) NSDictionary *chapterMetadata;

#pragma mark Initializer

- (instancetype)initWithName:(NSString *)name NS_UNAVAILABLE;

/**
 * Designated initializer for AdobeAnalyticsPlugin.
 * Register any error callback methods using the AdobeAnalyticsPluginDelegate instance.
 */
- (instancetype)initWithDelegate:(ADB_VHB_AdobeAnalyticsPluginDelegate *)delegate NS_DESIGNATED_INITIALIZER;

/**
 * Method to set configData on ADB_VHB_AdobeAnalyticsPlugin.
 * Expected AdobeAnalyticsPluginConfig instance for configData.
 */
- (void)configure:(id<ADB_HB_PluginConfigProtocol>)configData;

@end
