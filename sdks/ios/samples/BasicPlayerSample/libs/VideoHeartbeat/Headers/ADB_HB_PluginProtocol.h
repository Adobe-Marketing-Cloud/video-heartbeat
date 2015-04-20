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

#import "ADB_HB_PluginConfigProtocol.h"
@class ADB_HB_PluginManager;
@class ADB_HB_Logger;

@protocol ADB_HB_PluginProtocol <NSObject>
#pragma mark Properties

@property(copy, nonatomic, readonly) NSString *name;
@property(nonatomic,readonly) ADB_HB_Logger *logger;
@property(nonatomic, readonly, getter=isInitialized) BOOL initialized;

#pragma mark Methods

- (void)configure:(id<ADB_HB_PluginConfigProtocol>)configData;

- (void)bootstrap:(ADB_HB_PluginManager *)pluginManager;

- (void)setup;

- (void)destroy;

- (void)enable;

- (void)disable;

- (id)resolveData:(NSArray *)keys;

@optional

- (void)_teardown;

@end
