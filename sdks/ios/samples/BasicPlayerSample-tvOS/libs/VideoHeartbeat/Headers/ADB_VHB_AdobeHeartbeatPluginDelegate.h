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


#import "ADB_VHB_ErrorInfo.h"

@interface ADB_VHB_AdobeHeartbeatPluginDelegate : NSObject

/**
 * Implements a callback method for Error scenario on AdobeHeartbeatPlugin.
 * Use this callback method to get error info via ErrorInfo instance
 */
- (void)onError:(ADB_VHB_ErrorInfo *)errorInfo;

@end
