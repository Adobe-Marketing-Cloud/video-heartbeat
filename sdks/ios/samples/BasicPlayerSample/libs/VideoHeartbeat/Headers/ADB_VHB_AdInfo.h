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

@interface ADB_VHB_AdInfo : NSObject

#pragma mark Properties

/**
 * Current ad's id, set empty by default
 */
@property(copy, nonatomic) NSString *adId;
@property(copy, nonatomic) NSString *id __deprecated_msg("Use adId instead.");

/**
 * Current ad's name, set empty by default
 */
@property(copy, nonatomic) NSString *name;

/**
 * Current ad's length, set 0.0 by default
 */
@property(strong, nonatomic) NSNumber *length;

/**
 * Current ad's position, set 0 by default
 */
@property(strong, nonatomic) NSNumber *position;

@end
