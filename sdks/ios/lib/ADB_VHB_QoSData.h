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

@interface ADB_VHB_QoSData : NSObject

@property(nonatomic, readonly) NSUInteger bitrate;
@property(nonatomic, readonly) double fps;
@property(nonatomic, readonly) NSUInteger droppedFrames;

- (id)initWithBitrate:(NSUInteger)bitrate
               andFps:(double)fps
     andDroppedFrames:(NSUInteger)droppedFrames;

@end

