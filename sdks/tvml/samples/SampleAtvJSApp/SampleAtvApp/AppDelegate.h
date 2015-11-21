/*! ************************************************************************
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
 * ************************************************************************* */

#import <UIKit/UIKit.h>
@import TVMLKit;

@interface AppDelegate : UIResponder <UIApplicationDelegate, TVApplicationControllerDelegate>
//The class bridges the UI, navigation stack, storage, and event handling from JavaScript.
@property (strong, nonatomic) TVApplicationController *appController;

//The navigation controller that is bridged from JavaScript.
//@property(nonatomic, readonly) UINavigationController *navigationController;
@end


