# Release Notes for JavaScript VideoHeartbeat SDK


Included are notes from the latest major revision to current.

## 1.5.7 (13 June, 2016)
What’s new :
- Support for standard Video and Ad metadata.
- API Change: Constants for Standard Video and Ad metadata are available in: ADB.va.plugins.aa.VideoMetadataKeys and ADB.va.plugins.aa.AdMetadataKeys objects.
- Added video length and video name to the Ad Initiate Adobe Analytics call.

## 1.5.6 (29 April, 2016)
What’s new :
- Added pause tracking feature. Two new heartbeat events are now sent to track pause and stalling.
- Automatic detection of IDLE state. VHL will automatically create a new video tracking session when resuming after a long pause/buffer/stall (after 30 minutes).
- Added new resume heartbeat event. This event is sent to identify scenarios where the playback is a resumed video playback session (e.g.: when playback of a VOD content starts from where the user left it before).
- API Change: VideoInfo object now has a "resumed" property. Set to true to send a resume heartbeat event with the video tracking session.
- Support for Visitor API 1.5.4+ opt-out
- Fixed issues with stalling detection after a mid-roll ad.

## 1.5.4 (2 Feb, 2016)
- Fix for tracking playhead stalls before entering ad break.

## 1.5.3 (27 Jan, 2016)
- Ability to auto pause for handling open session issues / issues with players that do not have buffering events / playhead stalling for any reason.
- Ability to handle long timestamp gap for issues with content coming back to life without ever pausing the content.
- Misc. fixes for handling multiple playback sessions with same heartbeat instance.

## 1.5.2 (9 September, 2015)
- Added support for Federated Analytics classification data

## 1.5.1.3 (10 July, 2015)
- Customer declared IDs support.

## 1.5.1.1 (6 Apr, 2015)

Fixed issues
- Fixed SSL related issues.

## 1.5.1.0 (31 Mar, 2015)
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


## 1.4.0.1 (23 Oct, 2014)

Fixed issues
- while in ERROR state, the output HTTP calls issued by the VHL are suppressed.

## 1.4.0.0 (10 Sep, 2014)

_NOTE_: 1.4.0.0 breaks backward compatibility.

New features
- TV PSDK customers can now activate Primetime Player Monitoring independently of Adobe Analytics.
- ad tracking has been optimized by removing the trackAdBreakStart and trackAdBreakComplete methods. The ad break is inferred from the trackAdStart and trackAdComplete method calls.
- the “playhead” property is no longer needed when tracking ads.

## 1.3.1.1 (15 July, 2014)

Fixed issues
- the custom visitor id is now mapped on the s:user:id query param.

## 1.3.1.0 (14 July, 2014)

New features
- the chapter-tracking APIs are now available.
- API change: the AdBreakInfo now has an additional property called "startTime". This change is backwards-compatible with API v1.2.
- enhanced the PlayerDelegate interface to support graceful termination of the VideoHeartbeat library
- deprecated the trackAdBreakStart and trackAdBreakComplete methods.
- introduced the "API level" as part of the library's versioning system.
- implemented data sanitization for the information obtained via the player delegate interface.

Fixed issues
- the library now supports multiple active instances at the same time.
- trackComplete() will issue the COMPLETE event on the network while trackVideoUnload() will issue the UNLOAD event on the network.

## 1.2.0 (17 Apr, 2014)

New features
- New API changes
- Eliminate the dependency on AppMeasurement's Media Module
- Support for Marketing Cloud Visitor ID

Fixed issues
- Tracking is not enabled when the user plays a video in a new browser instance
- Only the first AD is tracked during playback
- Video length must be an integer
- Total duration parameter wasn’t being reset when playing the same ad
- Post-roll ad breaks not associated with the appropriate video

Known limitations
- No heartbeats are sent during buffering events although time spent calculation does not include buffering time
- When seeking outside the ad content, the COMPLETE event is sent for that particular ad
- COMPLETE event is sent into Adobe Analytics for the initial video asset when another video asset is loaded

## 1.1.0 (20 Feb, 2014)

- fixed issues related to the proper handling of UTF-8 character set
- fixed issues with unsupported AJAX calls on IE8/9

## 1.0.0 (20 Nov, 2013)

- Initial release to production of version 1.0
