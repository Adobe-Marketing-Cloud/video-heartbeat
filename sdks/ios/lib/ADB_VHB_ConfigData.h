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

@property(nonatomic, readonly) NSString *playerName;
@property(nonatomic, readonly) NSString *trackingServer;
@property(nonatomic, readonly) NSString *jobId;
@property(nonatomic, readonly) NSString *publisher;

@property(nonatomic, retain) NSString *channel;
@property(nonatomic, retain) NSString *ovp;
@property(nonatomic, retain) NSString *sdk;

@property(nonatomic) BOOL debugTracking;
@property(nonatomic) BOOL trackLocal;
@property(nonatomic) BOOL debugLogging;
@property(nonatomic) BOOL enableHeartbeat;

@property(nonatomic) BOOL __isPrimetime;
@property(nonatomic, retain) NSString *__psdkVersion;

- (id)initWithPlayerName:(NSString *)playerName
       andTrackingServer:(NSString *)trackingServer
                andJobId:(NSString *)jobId
              andPublisher:(NSString *)publisher;
@end
