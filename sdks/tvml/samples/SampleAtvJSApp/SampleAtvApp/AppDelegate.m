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

#import "AppDelegate.h"
#import "ADBMobile.h"
#import "ADBMediaHeartbeatJSExport.h"

@interface AppDelegate ()

@end

@implementation AppDelegate

- (void)appController:(TVApplicationController *)appController
     didFailWithError:(NSError *)error{
    
}

- (void)appController:(TVApplicationController *)appController
didFinishLaunchingWithOptions:(NSDictionary<NSString *,
                               id> *)options{
    
}

- (void)appController:(TVApplicationController *)appController
   didStopWithOptions:(NSDictionary<NSString *,
                       id> *)options {
    
}

- (void)appController:(TVApplicationController *)appController
evaluateAppJavaScriptInContext:(JSContext *)jsContext{
    
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    
//    [ADBMobile setDebugLogging:NO];
    
    // Override point for customization after application launch.
    
    NSURL *TVBaseURL = [NSURL URLWithString:@"http://localhost:8090"];
    NSURL *TVBootURL = [NSURL URLWithString:@"/js/application.js" relativeToURL:TVBaseURL];
    
    UIWindow *window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    
    TVApplicationControllerContext *appControllerContext = [[TVApplicationControllerContext alloc] init];

    NSURL *javascriptURL = TVBootURL;
    
    appControllerContext.javaScriptApplicationURL = javascriptURL;

    if (launchOptions) {
        appControllerContext.launchOptions = launchOptions;
    }
    
    self.appController = [[TVApplicationController alloc ]initWithContext:appControllerContext
                            window:window
                            delegate:self];
    [ADBMediaHeartbeatJSExport installTVMLHooks:self.appController];
    [ADBMobile installTVMLHooks :self.appController];

    return YES;
}

- (void)applicationWillResignActive:(UIApplication *)application {
    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
    // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
}

- (void)applicationDidEnterBackground:(UIApplication *)application {
    // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
    // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
}

- (void)applicationWillEnterForeground:(UIApplication *)application {
    // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
}

- (void)applicationWillTerminate:(UIApplication *)application {
    // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
}

@end
