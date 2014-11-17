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

@class ADB_HB_PluginManager;

@protocol ADB_HB_PluginProtocol <NSObject>

#pragma mark Properties

@property(copy, nonatomic, readonly) NSString *name;
@property(nonatomic, readonly, getter=isInitialized) BOOL initialized;

#pragma mark Methods

- (void)bootstrap:(ADB_HB_PluginManager *)pluginManager;

- (void)setup;

- (void)destroy;

- (void)enable;

- (void)disable;

- (id)propertyForKey:(NSString *)key;

@end
