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

@interface ADB_VHB_Version : NSObject

#pragma mark Disable instantiation
+ (instancetype)alloc NS_UNAVAILABLE;
+ (instancetype)allocWithZone:(struct _NSZone *)zone NS_UNAVAILABLE;
+ (instancetype)new NS_UNAVAILABLE;

#pragma mark Class methods
/**
 * The current version of the library.
 * This has the following format: $platform-$major.$minor.$micro.$patch-$build
 */
+ (NSString *)getVersion;

/**
 * The major version.
 */
+ (NSString *)getMajor;

/**
 * The minor version.
 */
+ (NSString *)getMinor;

/**
 * The micro version.
 */
+ (NSString *)getMicro;

/**
 * The patch version.
 */
+ (NSString *)getPatch;

/**
 * The build number.
 */
+ (NSString *)getBuild;

/**
 * The API level.
 */
+ (NSNumber *)getApiLevel;

@end