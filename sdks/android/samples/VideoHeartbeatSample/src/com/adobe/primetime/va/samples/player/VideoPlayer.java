/*
 * ADOBE SYSTEMS INCORPORATED
 * Copyright 2014 Adobe Systems Incorporated
 * All Rights Reserved.

 * NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
 * terms of the Adobe license agreement accompanying it.  If you have received this file from a
 * source other than Adobe, then your use, modification, or distribution of it requires the prior
 * written permission of Adobe.
 */

package com.adobe.primetime.va.samples.player;

import android.app.Activity;
import android.media.MediaPlayer;
import android.net.Uri;
import android.util.Log;
import android.widget.MediaController;
import com.adobe.primetime.va.AssetType;
import com.adobe.primetime.va.samples.Configuration;
import com.adobe.primetime.va.samples.R;

import java.util.Observable;

public class VideoPlayer extends Observable {
    private static final String LOG_TAG = "[VideoHeartbeatSample]::" + VideoPlayer.class.getSimpleName();

    private MediaController _mediaController;
    private ObservableVideoView _videoView;
    private Activity _parentActivity;
    private Boolean _loaded;

    public VideoPlayer(Activity parentActivity) {
        _parentActivity = parentActivity;

        _videoView = (ObservableVideoView)_parentActivity.findViewById(R.id.videoView);
        _videoView.setVideoPlayer(this);

        _mediaController = new MediaController(_parentActivity);
        _mediaController.setMediaPlayer(_videoView);

        _videoView.setMediaController(_mediaController);
        _videoView.requestFocus();

        _videoView.setOnPreparedListener(_onPreparedListener);
        _videoView.setOnInfoListener(_onInfoListener);
        _videoView.setOnCompletionListener(_onCompletionListener);

        _loaded = false;
    }

    public void loadContent(Uri uri) {
        _videoView.setVideoURI(uri);
    }

    public Double getVideoDuration() {
        return (double) (_videoView.getDuration() / 1000);
    }

    public Double getPlayhead() {
        return (double) (_videoView.getCurrentPosition() / 1000);
    }

    public String getStreamType() {
        return AssetType.ASSET_TYPE_VOD;
    }

    public String getPlayerName() {
        return Configuration.PLAYER_NAME;
    }

    public String getVideoId() {
        return Configuration.VIDEO_ID;
    }

    void resumePlayback() {
        Log.d(LOG_TAG, "Resuming playback.");

        _loadVideoIfNotLoaded();

        setChanged();
        notifyObservers(PlayerEvent.PLAY);
    }

    void pausePlayback() {
        Log.d(LOG_TAG, "Pausing playback.");

        setChanged();
        notifyObservers(PlayerEvent.PAUSE);
    }

    void seekStart() {
        Log.d(LOG_TAG, "Starting seek.");

        setChanged();
        notifyObservers(PlayerEvent.SEEK_START);
    }

    private MediaPlayer.OnInfoListener _onInfoListener = new MediaPlayer.OnInfoListener() {
        @Override
        public boolean onInfo(MediaPlayer mediaPlayer, int what, int extra) {
            switch (what) {
                case MediaPlayer.MEDIA_INFO_BUFFERING_START:
                    Log.d(LOG_TAG, "#onInfo(what=MEDIA_INFO_BUFFERING_START, extra=" + extra + ")");

                    setChanged();
                    notifyObservers(PlayerEvent.BUFFER_START);

                    break;

                case MediaPlayer.MEDIA_INFO_BUFFERING_END:
                    Log.d(LOG_TAG, "#onInfo(what=MEDIA_INFO_BUFFERING_END, extra=" + extra + ")");

                    setChanged();
                    notifyObservers(PlayerEvent.BUFFER_COMPLETE);

                    break;

                default:
                    Log.d(LOG_TAG, "#onInfo(what=" + what + ") - extra: " + extra);
                    break;
            }
            return true;
        }
    };

    private MediaPlayer.OnPreparedListener _onPreparedListener = new MediaPlayer.OnPreparedListener() {
        @Override
        public void onPrepared(MediaPlayer mediaPlayer) {
            Log.d(LOG_TAG, "#onPrepared()");

            _mediaController.show(0);

            mediaPlayer.setOnSeekCompleteListener(new MediaPlayer.OnSeekCompleteListener() {
                @Override
                public void onSeekComplete(MediaPlayer mediaPlayer) {
                    Log.d(LOG_TAG, "#onSeekComplete()");

                    setChanged();
                    notifyObservers(PlayerEvent.SEEK_COMPLETE);
                }
            });
        }
    };

    private MediaPlayer.OnCompletionListener _onCompletionListener= new MediaPlayer.OnCompletionListener() {
        @Override
        public void onCompletion(MediaPlayer mediaPlayer) {
            Log.d(LOG_TAG, "#onCompletion()");

            _mediaController.show(0);

            setChanged();
            notifyObservers(PlayerEvent.COMPLETE);

            _unloadVideo();
        }
    };

    private void _loadVideoIfNotLoaded() {
        if (!_loaded) {
            setChanged();
            notifyObservers(PlayerEvent.VIDEO_LOAD);

            _loaded = true;
        }
    }
    
    private void _unloadVideo() {
        _loaded = false;

        setChanged();
        notifyObservers(PlayerEvent.VIDEO_UNLOAD);
    }
}
