package com.adobe.primetime.va.samples.analytics;

import android.util.Log;
import com.adobe.primetime.va.ConfigData;
import com.adobe.primetime.va.adb.VideoHeartbeat;
import com.adobe.primetime.va.samples.Configuration;
import com.adobe.primetime.va.samples.player.PlayerEvent;
import com.adobe.primetime.va.samples.player.VideoPlayer;

import java.util.Observable;
import java.util.Observer;

public class AnalyticsProvider implements Observer {
    private static final String LOG_TAG = "[VideoHeartbeatSample]::" + AnalyticsProvider.class.getSimpleName();

    private VideoPlayer _player;
    private SamplePlayerDelegate _playerDelegate;
    private VideoHeartbeat _videoHeartbeat;

    public void attachToPlayer(VideoPlayer player) {
        if (_player != null) {
            detachFromPlayer();
        }

        _player = player;
        _player.addObserver(this);

        _playerDelegate = new SamplePlayerDelegate(_player);

        ConfigData configData = new ConfigData(Configuration.HEARTBEAT_TRACKING_SERVER,
                                               Configuration.HEARTBEAT_JOB_ID,
                                               Configuration.HEARTBEAT_PUBLISHER);

        configData.ovp = Configuration.HEARTBEAT_OVP;
        configData.sdk = Configuration.HEARTBEAT_SDK;
        configData.channel = Configuration.HEARTBEAT_CHANNEL;

        // Set this to false for production apps.
        configData.debugLogging = true;

        _videoHeartbeat = new VideoHeartbeat(_playerDelegate);
        _videoHeartbeat.configure(configData);
    }

    public void detachFromPlayer() {
        if (_player != null) {
            _videoHeartbeat.destroy();
            _videoHeartbeat = null;
            _playerDelegate = null;

            _player.deleteObserver(this);
            _player = null;
        }
    }

    @Override
    public void update(Observable observable, Object data) {
        PlayerEvent playerEvent = (PlayerEvent)data;

        switch (playerEvent) {
            case VIDEO_LOAD:
                Log.d(LOG_TAG, "Video loaded.");
                _videoHeartbeat.trackVideoLoad();
                break;

            case VIDEO_UNLOAD:
                Log.d(LOG_TAG, "Video unloaded.");
                _videoHeartbeat.trackVideoUnload();
                break;

            case PLAY:
                Log.d(LOG_TAG, "Playback started.");
                _videoHeartbeat.trackPlay();
                break;

            case PAUSE:
                Log.d(LOG_TAG, "Playback paused.");
                _videoHeartbeat.trackPause();
                break;

            case SEEK_START:
                Log.d(LOG_TAG, "Seek started.");
                _videoHeartbeat.trackSeekStart();
                break;

            case SEEK_COMPLETE:
                Log.d(LOG_TAG, "Seek completed.");
                _videoHeartbeat.trackSeekComplete();
                break;

            case BUFFER_START:
                Log.d(LOG_TAG, "Buffer started.");
                _videoHeartbeat.trackBufferStart();
                break;

            case BUFFER_COMPLETE:
                Log.d(LOG_TAG, "Buffer completed.");
                _videoHeartbeat.trackBufferComplete();
                break;

            case COMPLETE:
                Log.d(LOG_TAG, "Playback completed.");
                _videoHeartbeat.trackComplete();
                break;

            default:
                Log.d(LOG_TAG, "Unhandled player event: " + playerEvent.toString());
                break;
        }
    }
}
