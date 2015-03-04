Release Notes for Android VideoHeartbeat SDK
=============================================


Included are notes from the latest major revision to current.

## 1.4.1.1 (6 March, 2015)

Fixed issues
- Fixed multithreading issues
- Enhanced input data validation


## 1.4.1.0 (17 December, 2014)

New features
- Added support for the Marketing Cloud Visitor ID
- Added support for the latest SDK for Marketing Cloud Solutions (version 4.3.0)

## 1.4.0.0 (7 October, 2014)

_NOTE_: 1.4.0.0 breaks backward compatibility.

New features
- TV PSDK customers can now activate Primetime Player Monitoring independently of Adobe Analytics.
- ad tracking has been optimized by removing the trackAdBreakStart and trackAdBreakComplete methods. The ad break is inferred from the trackAdStart and trackAdComplete method calls.
- the “playhead” property is no longer needed when tracking ads.

## 1.3.1.0 (4 September, 2014)
 
New features
- the chapter-tracking APIs are now available.
- API change: the AdBreakInfo now has an additional property called "startTime". This change is backwards-compatible with API v1.2.
- enhanced the PlayerDelegate interface to support graceful termination of the VideoHeartbeat library
- deprecated the trackAdBreakStart and trackAdBreakComplete methods.
- introduced the "API level" as part of the library's versioning system.
- implemented data sanitization for the information obtained via the player delegate interface.
- the podSecond parameter was added on the SiteCatalyst ad-start calls.
 
Fixed issues
- fixed crashes during tear-down operations.
- the library now supports multiple active instances at the same time.
- trackComplete() will issue the COMPLETE event on the network while trackVideoUnload() will issue only the UNLOAD event on the network.

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

## 1.1.1 (25 Feb, 2014)
- fixed the issue where the SC start call for ads was not actually sent over the wire.
- Works with version 4.0.4-AN of AppMeasurement Android library.

## 1.1.0 (20 Feb, 2014)
- major re-factoring: the data-collection core logic is no longer part of the AppMeasurement lib. It is now inside the VideoHeartbeat lib.
- all the Heartbeat configuration params that were previously inside the ADBMobileConfig.json config file are now available to be set at run-time via the video-heartbeat configuration object.
- a new destroy() method is now part of the VideoHeartbeat public interface. Since the data-collection core logic is no longer implemented as a singleton tear-down operations are now possible. 
- a new getVersion() method is now part of the VideoHeartbeat public interface.
- Works with version 4.0.2-AN of AppMeasurement Android library.

## 1.0.0 (12 Feb, 2014)
- Initial release to production of version 1.0 
- Works with version 4.0.2-AN of AppMeasurement Android library.