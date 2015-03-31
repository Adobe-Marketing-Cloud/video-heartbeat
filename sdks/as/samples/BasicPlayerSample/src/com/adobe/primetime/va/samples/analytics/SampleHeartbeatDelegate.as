/*
 * ADOBE SYSTEMS INCORPORATED
 * Copyright 2014 Adobe Systems Incorporated
 * All Rights Reserved.

 * NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
 * terms of the Adobe license agreement accompanying it.  If you have received this file from a
 * source other than Adobe, then your use, modification, or distribution of it requires the prior
 * written permission of Adobe.
 */

package com.adobe.primetime.va.samples.analytics {
import com.adobe.primetime.va.ErrorInfo;
import com.adobe.primetime.va.HeartbeatDelegate;
import com.adobe.primetime.va.samples.Logger;

public class SampleHeartbeatDelegate extends HeartbeatDelegate{
    override public function onError(errorInfo:ErrorInfo):void {
        Logger.log(LOG_TAG, "ERROR: " + errorInfo.message + " | " + errorInfo.details);
    }

    private static const LOG_TAG:String = "[HeartbeatSample]::SampleHeartbeatDelegate";
}
}
