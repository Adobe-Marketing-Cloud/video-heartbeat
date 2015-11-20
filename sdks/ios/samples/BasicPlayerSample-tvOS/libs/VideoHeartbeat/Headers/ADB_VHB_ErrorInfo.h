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

@interface ADB_VHB_ErrorInfo : NSObject

#pragma mark Properties
/**
 * Read only property to retrieve the error message string.
 */
@property(copy, nonatomic, readonly) NSString *message;

/**
 * Read only property to retrieve the detailed error message string.
 */
@property(copy, nonatomic, readonly) NSString *details;

#pragma mark Initializer
+ (instancetype)new NS_UNAVAILABLE;
- (instancetype)init NS_UNAVAILABLE;

/**
 * Creates a ErrorInfo object to hold error information.
 * Usually created by library to notify application about the error details.
 */
- (instancetype)initWithMessage:(NSString *)message details:(NSString *)details NS_DESIGNATED_INITIALIZER;

@end
