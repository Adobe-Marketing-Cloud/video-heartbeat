****************** CONFIDENTIAL ******************
ADOBE SYSTEMS INCORPORATED
Copyright 2015 Adobe Systems Incorporated 
All Rights Reserved.
NOTICE: Adobe permits you to use, modify, and distribute this file in accordance with the terms of the Adobe license agreement accompanying it.  If you have received this file from a source other than Adobe, then your use, modification, or distribution of it requires the prior written permission of Adobe.
**************************************************

----------------------------------
VideoHeartbeat Library (iOS/tvOS)
----------------------------------
Current Version:1.5.3

=======
SUMMARY
=======
VideoHeartbeat SDK 1.5.x for Marketing Cloud Solutions lets you measure video engagement through Video heartbeats on iOS or tvOS native applications

================
PACKAGE CONTENTS
================
VideoHeartbeatLibrary-ios-tvos-v1.5.3/readme.md                         - Instructions to get you started
VideoHeartbeatLibrary-ios-tvos-v1.5.3/ReleaseNotes.md                   - What's new
VideoHeartbeatLibrary-ios-tvos-v1.5.3/license.txt
VideoHeartbeatLibrary-ios-tvos-v1.5.3/docs/video_heartbeat_ios.pdf      - Documentation for VideoHeartbeats
VideoHeartbeatLibrary-ios-tvos-v1.5.3/libs/VideoHeartbeat.a             - Native iOS heartbeats framework
VideoHeartbeatLibrary-ios-tvos-v1.5.3/libs/VideoHeartbeat-tvOS.a        - Native tvOS heartbeats framework
VideoHeartbeatLibrary-ios-tvos-v1.5.3/libs/Headers/                     - Common header files for both platforms
VideoHeartbeatLibrary-ios-tvos-v1.5.3/samples/BasicPlayerSample         - Sample player for native iOS implementation
VideoHeartbeatLibrary-ios-tvos-v1.5.3/samples/BasicPlayerSample-tvOS    - Sample player for native tvOS implementation

============
Documentation
============
User guides and API documentation can be found in video_heartbeat_ios.pdf

==========================
INSTALLATION GUIDE for iOS
==========================
Please follow the steps below for adding the VideoHeartbeat Library to your iOS xcode project:
a. Grab the latest Adobe Mobile library, extract and add "AdobeMobileLibrary.a" framework and "ADBMobile.h" header file into your project. Configure AdobeMobile library using ADBMobileConfig.json from the release package and fill it in with the appropriate values (contact Adobe representative).
b. Once Adobe Mobile library is configiured and ready to use, add "VideoHeartbeat.a" framework file located under libs directory to your project. Also add all the header files located under "libs/Headers" directory.
c. Once both these libraries and added to iOS xcode project, you can start configuring Heartbeat plugins. Invoke VideoPlayerPlugin APIs on respective event notifications. 
d. Refer to the analytics group of BasicSamplePlayer provided with the package for further implementation details.

======================
SAMPLE iOS application
======================
BasicPlayerSample under samples directory can be referred for sample implementation on iOS applications.

===========================
INSTALLATION GUIDE for tvOS
===========================
Please follow the steps below for adding the VideoHeartbeat Library to your tvOS xcode project:
a. Grab the latest Adobe Mobile library, extract and add "AdobeMobileLibrary_TV.a" framework and "ADBMobile.h" header file into your project. Configure AdobeMobile library using ADBMobileConfig.json from the release package and fill it in with the appropriate values (contact Adobe representative).
b. Once Adobe Mobile library is configiured and ready to use, add "VideoHeartbeat-tvOS.a" framework file located under libs directory to your project. Also add all the header files located under "libs/Headers" directory.
c. Once both these libraries and added to tvOS xcode project, you can start configuring Heartbeat plugins. Invoke VideoPlayerPlugin APIs on respective event notifications. 
d. Refer to the analytics group of BasicPlayerSample-tvOS provided with the package for further implementation details.

=======================
SAMPLE tvOS application
=======================
BasicPlayerSample-tvOS under samples directory can be referred for sample implementation on tvOS applications.
