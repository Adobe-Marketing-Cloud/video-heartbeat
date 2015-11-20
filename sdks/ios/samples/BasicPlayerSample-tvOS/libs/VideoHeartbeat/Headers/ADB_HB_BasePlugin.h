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

@interface ADB_HB_BasePlugin : NSObject <ADB_HB_PluginProtocol>

@property (nonatomic,strong) ADB_HB_PluginManager *pluginManager;

#pragma mark Initializers
+ (instancetype)new NS_UNAVAILABLE;

- (instancetype)initWithName:(NSString *)name NS_DESIGNATED_INITIALIZER;
- (void)_trigger:(NSString *)eventType;
- (void)_trigger:(NSString *)eventType info:(id)info;
- (NSDictionary *)resolveData:(NSArray *)keys;

@end
