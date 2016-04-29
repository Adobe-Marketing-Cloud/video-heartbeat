Release Notes for iOS VideoHeartbeat SDK
==========================================

Included are notes from the latest major revision to current.

## 1.5.6 (29 April, 2016)
What’s new :
- Added pause tracking feature. Two new heartbeat events are now sent to track pause and stalling.
- Automatic detection of IDLE state. VHL will automatically create a new video tracking session when resuming after a long pause/buffer/stall (after 30 minutes).
- Added new resume heartbeat event. This event is sent to identify scenarios where the playback is a resumed video playback session (e.g.: when playback of a VOD content starts from where the user left it before).
- API Change: VideoInfo object now has a "resumed" property. Set to true to send a resume heartbeat event with the video tracking session.
- Fixed issues with stalling detection after a mid-roll ad.

## 1.5.5 (2 February, 2016)
- Fix for tracking playhead stalls before entering ad break.

## 1.5.4 (27 January, 2016)
What's new
- Fixed memory leak issues
- Ability to auto pause for handling open session issues / issues with players that do not have buffering events / playhead stalling for any reason.
- Ability to handle long timestamp gap for issues with content coming back to life without ever pausing the content.
- Misc. fixes for handling multiple playback sessions with same heartbeat instance. 

## 1.5.3 (17 November, 2015)
What's new
- New Feature: TvOS compatibility
- Bug fixes

## 1.5.2 (8 September, 2015)
What's new
- Added support for Federated Analytics classification data
- Enabled bitcode for iOS 9

## 1.5.1.3 (10 July, 2015)
What’s new
- Customer declared IDs support
- VideoHeartbeat now respects user opt-out privacy status in Adobe mobile library

Fixed issues
- BasicPlayerSample bugs

## 1.5.1.0 (20 Apr, 2015)
What’s new :
- Ability to send metadata with video start and/or video/ad/chapter start as context data. It is possible to correlate that data with all other video and non-video AA variables
  * Metadata sent via Context Data key value pairs
  * Customer will need to use processing rules to copy metadata into a variable (default video reports won’t show metadata)
  * Metadata is sent same way regardless of platform (desktop & mobile)
- Less network traffic; Heartbeats are fewer on average and smaller in size
- Enabling/disabling logging per heartbeat plugin
 
API changes :
- the VHL plugins must now be instantiated & registered explicitly at the application level
- the VideoPlayer plugin provides the trackSessionStart() API to allow for better tracking of the startup time
- the integration code is now able to explicitly set the startup time value via the QoSInfo.startupTime property.
- 1.5.x is not a drop-in replacement for v1.4 due to the various plugins that are now visible at the level of the public API. For more information about upgrading from a previous implementation see the upgrade section in the documentation file.
- 1.5.x heartbeat data will not be available in the Primetime Player Monitoring (PPM) dashboard. Customers using PPM must not upgrade yet.
- Some APIs were deprecated (onVideoUnloaded() & onError() on Player Delegate)


## 1.4.1.2 (27 January, 2015)

- Fixed multithreading issues
- Enhanced input data validation

## 1.4.1.1 (12 January, 2015)

Fixed issues
- Removed VideoHeartbeat and AdobeMobile symbols from the AdobeAnalyticsPlugin library (linkage issue)

## 1.4.1.0 (17 December, 2014)

New features
- Added support for the Marketing Cloud Visitor ID
- Added support for the latest SDK for Marketing Cloud Solutions (version 4.3.0)

## 1.4.0.0 (17 November, 2014)

_NOTE_: This version introduces a couple of backwards-incompatible changes to the API. 
A few modifications will be required to the integration code when upgrading from previous versions.
Please refer to the "Transitioning from Version 1.3.x" section in the documentation for specific details.

New features
- Added the ability to bundle different other analytics use cases, from other SDKs or players, with the Adobe Analytics Video Essentials.
- Ad tracking has been optimized by removing the trackAdBreakStart and trackAdBreakComplete methods. The ad break is inferred from the trackAdStart and trackAdComplete method calls.
- The "playhead" property is no longer needed when tracking ads.

## 1.3.1.2 (15 July, 2014)
Fixed issues
    - the custom visitor id is now mapped on the s:user:id query param.

## 1.3.1.1 (14 July, 2014)
 
New features
    - updated the documentation to reflect the latest API changes.
    - the podSecond parameter is also added on SiteCatalyst ad-start calls.

## 1.3.1.0 (1 July, 2014)
 
New features
    - the chapter-tracking APIs are now available.
    - API change: the AdBreakInfo now has an additional property called "startTime". This change is backwards-compatible with API v1.2.
    - enhanced the PlayerDelegate interface to support graceful termination of the VideoHeartbeat library
    - deprecated the trackAdBreakStart and trackAdBreakComplete methods.
    - introduced the "API level" as part of the library's versioning system.
    - implemented data sanitization for the information obtained via the player delegate interface.
 
Fixed issues
    - fixed memory leak issues
    - fixed crashes during tear-down operations
    - the library now supports multiple active instances at the same time.
    - trackComplete() will issue the COMPLETE event on the network while trackVideoUnload() will issue only the UNLOAD event on the network.

Known limitations
    - Documentation is not yet updated. The API described for v1.2.0 is also available in v1.3.1. The difference is that chapter tracking APIs are now fully functional.

## 1.2.0 (17 Apr, 2014)

New features
    - New API changes
    - Eliminate the dependency on AppMeasurement's Media Module

Fixed issues
    - Video length must be an integer
    - Total duration parameter wasn’t being reset when playing the same ad
    - Post-roll ad breaks not associated with the appropriate video

Known limitations
    - No heartbeats are sent during buffering events although time spent calculation does not include buffering time
    - When seeking outside the ad content, the COMPLETE event is sent for that particular ad
    - COMPLETE event is sent into Adobe Analytics for the initial video asset when another video asset is loaded

## 1.1.1 (27 Feb, 2014)
 - fixed issue where the values in the settings.xml are not parsed correctly if the XML file is indented (VA-749).

## 1.1.0 (20 Feb, 2014)
 - major re-factoring: the data-collection core logic is no longer part of the AppMeasurement lib. It is now inside the VideoHeartbeat lib.
 - all the Heartbeat configuration params that were previously inside the ADBMobileConfig.json config file are now available to be set at run-time via the video-heartbeat configuration object.
 - a new destroy selector is now part of the ADBVideoHeartbeat public interface. Since the data-collection core logic is no longer implemented as a singleton tear-down operations are now possible. 
 - a new version static selector is now part of the ADBVideoHeartbeat public interface.
 - Works with version 4.0.2 of AppMeasurement iOS library.

## 1.0.0 (12 Feb, 2014)
 - Initial release to production of version 1.0
 - Works with version 4.0.1 of AppMeasurement iOS library.