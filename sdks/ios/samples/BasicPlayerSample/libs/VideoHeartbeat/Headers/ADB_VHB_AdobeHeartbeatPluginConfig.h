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
#import "ADB_HB_PluginProtocol.h"
#import "ADB_HB_PluginConfigProtocol.h"

@interface ADB_VHB_AdobeHeartbeatPluginConfig : NSObject<ADB_HB_PluginConfigProtocol>


#pragma mark Properties

/* Property to read the server to which all the heartbeat calls are sent. Use the value provided by your Adobe consultant. */
@property(copy, nonatomic, readonly) NSString *trackingServer;

/* Property to read the publisher. Use the value provided by your Adobe consultant. */
@property(copy, nonatomic, readonly) NSString *publisher;

/* Property that indicates whether the heartbeat calls should be made over HTTPS. Default value is NO. */
@property(nonatomic) BOOL ssl;

/* Name of the online video platform through which content gets distributed. Default value is "unknown". */
@property(copy, nonatomic) NSString *ovp;

/* Version of the video player app/SDK. Default value is "unknown". */
@property(copy, nonatomic) NSString *sdk;

/* Property set to YES if the video player in use is a TVSDK player. Default value is NO. */
@property(nonatomic) BOOL __primetime;

/* Property set to the TVSDK player version if the video player in use is a TVSDK player. */
@property(copy, nonatomic) NSString *__psdkVersion;

/* Property that activates the "quiet" mode of operation, in which all output HTTP calls are suppressed. Default value is NO. */
@property(nonatomic) BOOL quietMode;

/* Property to enable debug logs from AdobeHeartbeatPlugin. Default value is NO. */
@property(nonatomic,assign) BOOL debugLogging;

#pragma mark Initializer
+ (instancetype)new NS_UNAVAILABLE;
- (instancetype)init NS_UNAVAILABLE;

/**
 * Creates an instance of AdobeHeartbeatPluginConfig class with provided tracking server URL and publisher
 */
- (instancetype)initWithTrackingServer:(NSString *)trackingServer
                             publisher:(NSString *)publisher NS_DESIGNATED_INITIALIZER;

@end
