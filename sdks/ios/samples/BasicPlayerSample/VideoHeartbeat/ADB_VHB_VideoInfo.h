/*************************************************************************
 *
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 *  Copyright 2014 Adobe Systems Incorporated
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
@property(copy, nonatomic) NSString *playerName;
@property(copy, nonatomic) NSString *id;
@property(copy, nonatomic) NSString *name;
@property(strong, nonatomic) NSNumber *length;
@property(strong, nonatomic) NSNumber *playhead;
@property(copy, nonatomic) NSString *streamType;

@end
