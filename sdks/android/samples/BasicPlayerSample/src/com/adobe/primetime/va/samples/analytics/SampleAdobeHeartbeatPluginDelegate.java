/*
 * ADOBE SYSTEMS INCORPORATED
 * Copyright 2014 Adobe Systems Incorporated
 * All Rights Reserved.

 * NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
 * terms of the Adobe license agreement accompanying it.  If you have received this file from a
 * source other than Adobe, then your use, modification, or distribution of it requires the prior
 * written permission of Adobe.
 */

package com.adobe.primetime.va.samples.analytics;

import android.util.Log;
import com.adobe.primetime.va.plugins.ah.*;
import com.adobe.primetime.va.ErrorInfo;

public class SampleAdobeHeartbeatPluginDelegate extends AdobeHeartbeatPluginDelegate {
    private static final String LOG_TAG = "[HeartbeatSample]::" + SampleAdobeHeartbeatPluginDelegate.class.getSimpleName();

    @Override
    public void onError(ErrorInfo errorInfo) {
        Log.d(LOG_TAG, "ERROR: " + errorInfo.getMessage() + " | " + errorInfo.getDetails());
    }
}
