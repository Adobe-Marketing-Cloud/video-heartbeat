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

@interface ADB_VHB_AssetType : NSObject

/**
 * String util to be used if the asset type is "vod"
 */
extern NSString *const ASSET_TYPE_VOD;

/**
 * String util to be used if the asset type is "live"
 */
extern NSString *const ASSET_TYPE_LIVE;

/**
 * String util to be used if the asset type is "linear"
 */
extern NSString *const ASSET_TYPE_LINEAR;

@end
