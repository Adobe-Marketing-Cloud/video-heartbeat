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

@class ADB_VHB_HeartbeatDelegate;
@class ADB_VHB_HeartbeatConfig;

@interface ADB_VHB_Heartbeat : NSObject

#pragma mark Initializers
+ (instancetype)new NS_UNAVAILABLE;
- (instancetype)init NS_UNAVAILABLE;

/**
 * Instantiates and creates the Heartbeat object.
 * Convenience method to initialize Heartbeat instance without any plugins.
 * Using this method to instantiate Heartbeat will not register any plugin hence no pings would be sent.
 */
- (instancetype)initWithDelegate:(ADB_VHB_HeartbeatDelegate *)delegate;


/**
 * Instantiates and creates the Heartbeat object.
 * Use this method to initialize all the plugins.
 */
- (instancetype)initWithDelegate:(ADB_VHB_HeartbeatDelegate *)delegate
                               plugins:(NSArray *)plugins NS_DESIGNATED_INITIALIZER;


#pragma mark Methods

/**
 * Configures the Heartbeat class with HeartbeatConfig object.
 * Use this method to set logging true or false.
 */
- (void)configure:(ADB_VHB_HeartbeatConfig *)configData;

/**
 * Destroys the Heartbeat module.
 * Use this method to release the resources consumed by Heartbeat class
 * whenever playback session finishes or stops.
 */
- (void)destroy;

@end
