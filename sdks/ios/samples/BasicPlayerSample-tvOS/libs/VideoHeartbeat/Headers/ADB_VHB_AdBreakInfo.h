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

@interface ADB_VHB_AdBreakInfo : NSObject

#pragma mark Properties

/**
 * Current video playerName property, set empty by default
 */
@property(copy, nonatomic) NSString *playerName;

/**
 * Current ad break's name property, set empty by default
 */
@property(copy, nonatomic) NSString *name;

/**
 * Current ad break's position property, set 0L by default
 */
@property(strong, nonatomic) NSNumber *position;

/**
 * Current ad break's startTime property, set 0 by default
 */
@property(strong, nonatomic) NSNumber *startTime;

@end
