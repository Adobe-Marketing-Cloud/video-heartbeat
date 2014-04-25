package com.adobe.primetime.va.samples {
    public class Logger {
        public static function log(tag:String, message:String):void {
            var date:Date = new Date();
            trace("[" + date + "] " + tag + " > " + message);
        }
    }
}