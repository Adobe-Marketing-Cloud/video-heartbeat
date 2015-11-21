****************** CONFIDENTIAL ******************
ADOBE SYSTEMS INCORPORATED
Copyright 2015 Adobe Systems Incorporated 
All Rights Reserved.
NOTICE: Adobe permits you to use, modify, and distribute this file in accordance with the terms of the Adobe license agreement accompanying it.  If you have received this file from a source other than Adobe, then your use, modification, or distribution of it requires the prior written permission of Adobe.
**************************************************

----------------------------------
VideoHeartbeat-1.0.0-tvml
----------------------------------
Current Version:1.0.0

=======
SUMMARY
=======
VideoHeartbeat SDK 1.x for Marketing Cloud Solutions lets you measure video engagement through Video heartbeats on AppleTV applications written in JavaScript TVJS/TVML.

================
PACKAGE CONTENTS
================
docs/VideoHeartbeat_tvjs.pdf
docs/readme.txt
docs/ReleaseNotes.txt
libs/VideoHeartbeat-tvml.min.js
libs/libAdobeVHLTVMLBridge.a
libs/ADBMediaHeartbeatJSExport.h
samples/SampleAtvJSApp/ - Sample player app

============
Documentation
============
User guides and API documentation can be found in VideoHeartbeat_tvjs.pdf. 

============
INSTALLATION
============
Please follow the steps below for adding the VideoHeartbeat-TVJS Library to the AppleTV project:
a. Import AdobeMobile Library for tvOS and configure the ADBMobile config in your tvOS project (contact Adobe representative for config values).
b. Once Adobe Mobile is ready to use, include libAdobeVHLTVMLBridge.a and ADBMediaHeartbeatJSExport.h helper library for VideoHeartbeats-TVJS in your tvOS project.
c. Once you have Adobe Mobile and AdobeVHLTVMLBridge libraries and header files added to project, install the TVML hooks in your AppDelegate’s application:didFinishLaunchingWithOptions: method. In this method, once you create appController object, use this instance to install TVML hooks:
	
	[ADBMediaHeartbeatJSExport installTVMLHooks:self.appController];
	[ADBMobile installTVMLHooks :self.appController];

d. Now you can use Adobe Mobile and VideoHeartbeat TVML APIs in Javascript. While implementing application.js, load VideoHeartbeat-tvml.min.js using evaluateScripts() API inside App.onLaunch().
e. Once this library loads successfully, you can configure MediaHeartbeat and start using MediaHeartbeat APIs.

=======
SAMPLE
=======
The sample player project for this version of AppleTV release is included under samples/SampleAtvJSApp/ directory.
To use this sample application, you need to host ‘js/*’ files on localhost:8090 so that these JS files are accessible on following UR: “http://localhost:8090/js/…”.
You can choose to host these JS files anywhere else, but make sure to update the JS urls in AppDelegate.m and application.js files.
Once the JS files are hosted correctly, build and run the Xcode project. Once video starts playing VideoHeartbeat calls can be viewed using proxy tools like Charles Proxy.

