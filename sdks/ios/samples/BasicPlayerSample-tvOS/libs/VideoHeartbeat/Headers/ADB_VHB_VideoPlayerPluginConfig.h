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
#import "ADB_HB_PluginProtocol.h"
#import "ADB_HB_PluginConfigProtocol.h"

@interface ADB_VHB_VideoPlayerPluginConfig: NSObject<ADB_HB_PluginConfigProtocol>

/**
 * debugLogging property, must be set true to enable debug logging for VideoPlayerPlugin plugin
 * set to false by default
 */
@property (nonatomic,assign) BOOL debugLogging;

@end
