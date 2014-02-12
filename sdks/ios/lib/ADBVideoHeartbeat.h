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
#import "ADBMobile.h"

@protocol ADBVideoHeartbeatPlayerDelegate <NSObject>

- (NSTimeInterval)getCurrentMainAssetPlayhead;
- (NSTimeInterval)getCurrentAdPlayhead;

@end

@interface ADBVideoHeartbeatConfigData : NSObject

@property(nonatomic, readonly) NSString *playerName;
@property(nonatomic, readonly) NSString *channel;
@property(nonatomic) BOOL debugTracking;
@property(nonatomic) BOOL trackLocal;
@property(nonatomic) BOOL debugLogging;

- (id)initWithPlayerName:(NSString *)playerName
              andChannel:(NSString *)channel;
@end

@interface ADBVideoHeartbeatQoSData : NSObject

@property(nonatomic, readonly) NSUInteger bitrate;
@property(nonatomic, readonly) NSUInteger fps;
@property(nonatomic, readonly) NSUInteger droppedFrames;

@end

@protocol ADBVideoHeartbeatProtocol <NSObject>

- (void)config:(ADBVideoHeartbeatConfigData *)configData;

- (void)trackMainVideoLoad:(NSString *)videoId length:(NSTimeInterval)length type:(NSString *)type;
- (void)trackMainVideoClose;
- (void)trackPlay;
- (void)trackStop;
- (void)trackComplete;
- (void)trackBufferStart;
- (void)trackBufferComplete;
- (void)trackSeekStart;
- (void)trackSeekComplete;

- (void)trackBitrateChange:(NSUInteger)bitrate;
- (void)trackQoSUpdate:(ADBVideoHeartbeatQoSData *)qosData;

- (void)trackAdBreakStart:(NSString *)podId;
- (void)trackAdBreakComplete;
- (void)trackAdStart:(NSString *)adId length:(NSTimeInterval)length parentPodPosition:(NSUInteger)parentPodPosition cpm:(NSString *)cpm;
- (void)trackAdComplete;

- (void)trackVideoPlayerError:(NSString *)errorId;
- (void)trackApplicationError:(NSString *)errorId;

@end

@interface ADBVideoHeartbeat : NSObject <ADBVideoHeartbeatProtocol>

- (id)initWithPlayerDelegate:(id<ADBVideoHeartbeatPlayerDelegate>)playerDelegate;

@end