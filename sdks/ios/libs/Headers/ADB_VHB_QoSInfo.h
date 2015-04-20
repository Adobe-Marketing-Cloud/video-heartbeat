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

@interface ADB_VHB_QoSInfo : NSObject

#pragma mark Properties

/**
 * Current QoS bitrate property, set 0L by default
 */
@property(strong, nonatomic) NSNumber *bitrate;

/**
 * Current QoS frames per second property, set 0.0 by default
 */
@property(strong, nonatomic) NSNumber *fps;

/**
 * Current QoS dropped frames property, set 0 by default
 */
@property(strong, nonatomic) NSNumber *droppedFrames;

/**
 * Current QoS startupTime property, set 0.0 by default
 */
@property(strong, nonatomic) NSNumber *startupTime;

@end
