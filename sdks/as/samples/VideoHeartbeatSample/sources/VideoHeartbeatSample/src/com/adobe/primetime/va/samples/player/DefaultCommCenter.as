/*******************************************************************************
 * ADOBE CONFIDENTIAL
 *  ___________________
 *
 *   Copyright 2014 Adobe Systems Incorporated
 *   All Rights Reserved.
 *
 *  NOTICE:  All information contained herein is, and remains
 *  the property of Adobe Systems Incorporated and its suppliers,
 *  if any.  The intellectual and technical concepts contained
 *  herein are proprietary to Adobe Systems Incorporated and its
 *  suppliers and are protected by all applicable intellectual property
 *  laws, including trade secret and copyright laws.
 *  Dissemination of this information or reproduction of this material
 *  is strictly forbidden unless prior written permission is obtained
 *  from Adobe Systems Incorporated.
 ******************************************************************************/

package com.adobe.primetime.va.samples.player {
    import com.adobe.primetime.va.adb.core.CommCenter;

    public class DefaultCommCenter extends CommCenter {
        private static var _instance:DefaultCommCenter;

        public static function get sharedInstance():DefaultCommCenter {
            if (!_instance) {
                _instance = new DefaultCommCenter();
            }

            return _instance;
        }
    }
}
