/*
 * ADOBE SYSTEMS INCORPORATED
 * Copyright 2014 Adobe Systems Incorporated
 * All Rights Reserved.

 * NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
 * terms of the Adobe license agreement accompanying it.  If you have received this file from a
 * source other than Adobe, then your use, modification, or distribution of it requires the prior
 * written permission of Adobe.
 */

package com.adobe.primetime.va.samples;

import android.app.Activity;
import android.net.Uri;
import android.os.Bundle;
import com.adobe.mobile.Config;
import com.adobe.primetime.va.samples.analytics.AnalyticsProvider;
import com.adobe.primetime.va.samples.player.VideoPlayer;

public class MainActivity extends Activity {
    private VideoPlayer _player;
    private AnalyticsProvider _analyticsProvider;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);

        // Bootstrap the AppMeasurement library.
        Config.setContext(this.getApplicationContext());

        // Create the VideoPlayer instance.
        _player = new VideoPlayer(this);

        // Create the AnalyticsProvider instance and
        // attach it to the VideoPlayer instance.
        _analyticsProvider = new AnalyticsProvider();
        _analyticsProvider.attachToPlayer(_player);

        // Load the main video content.
        Uri uri = Uri.parse("android.resource://"+getPackageName()+"/"+R.raw.clickbaby);
        _player.loadContent(uri);
    }

    @Override
    protected void onDestroy() {
        // Detach the AnalyticsProvider instance from the VideoPlayer instance.
        // This will complete the lifecycle of the VideoHeartbeat lib.
        _analyticsProvider.detachFromPlayer();

        _analyticsProvider = null;
        _player = null;

        super.onDestroy();
    }

}
