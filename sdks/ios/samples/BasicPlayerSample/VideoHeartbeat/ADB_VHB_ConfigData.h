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

@interface ADB_VHB_ConfigData : NSObject

#pragma mark Properties
@property(copy, nonatomic, readonly) NSString *trackingServer;
@property(copy, nonatomic, readonly) NSString *jobId;
@property(copy, nonatomic, readonly) NSString *publisher;

@property(copy, nonatomic) NSString *ovp;
@property(copy, nonatomic) NSString *sdk;
@property(copy, nonatomic) NSString *channel;

@property(nonatomic) BOOL debugLogging;
@property(nonatomic) BOOL quietMode;

@property(nonatomic) BOOL __primetime;
@property(copy, nonatomic) NSString *__psdkVersion;

#pragma mark Initializer
+ (instancetype)new NS_UNAVAILABLE;
- (instancetype)init NS_UNAVAILABLE;

- (instancetype)initWithTrackingServer:(NSString *)trackingServer
                       jobId:(NSString *)jobId
                   publisher:(NSString *)publisher NS_DESIGNATED_INITIALIZER;
@end
