/*
 * ADOBE SYSTEMS INCORPORATED
 * Copyright 2014 Adobe Systems Incorporated
 * All Rights Reserved.

 * NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
 * terms of the Adobe license agreement accompanying it.  If you have received this file from a
 * source other than Adobe, then your use, modification, or distribution of it requires the prior
 * written permission of Adobe.
 */

package com.adobe.primetime.va.samples
{
    import com.adobe.primetime.va.core.radio.Channel;

    public class CommCenter {
        private static var _channel:Channel;

        public static function get sharedChannel():Channel {
            if (!_channel) {
                _channel = new Channel("application:shared");
            }

            return _channel;
        }
    }
}
