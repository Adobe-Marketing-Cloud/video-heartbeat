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

#import <JavaScriptCore/JavaScriptCore.h>

/**
 * Interface for bridging between Native and JS.
 */
@interface ADBMediaHeartbeatJSExport : NSObject

/**
 * Static method for registering the TVML bridging hooks. This method must be called as early as possible
 * in the app lifecyle and the application must pass the TVApplicationController
 * instance.
 */
+ (void)installTVMLHooks:(TVApplicationController *)appController;

@end