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

@interface ADB_VHB_VideoInfo : NSObject

#pragma mark Properties

/**
 * Video playerName property, set empty by default
 */
@property(copy, nonatomic) NSString *playerName;

/**
 * Video id property, set empty by default
 */
@property(copy, nonatomic) NSString *videoId;
@property(copy, nonatomic) NSString *id __deprecated_msg("Use videoId instead.");

/**
 * Video name property, set empty by default
 */
@property(copy, nonatomic) NSString *name;

/**
 * Video length property, set 0.0 by default
 */
@property(strong, nonatomic) NSNumber *length;

/**
 * Video playhead property, set 0.0 by default
 */
@property(strong, nonatomic) NSNumber *playhead;

/**
 * Video streamType property, set empty by default
 */
@property(copy, nonatomic) NSString *streamType;

@end
