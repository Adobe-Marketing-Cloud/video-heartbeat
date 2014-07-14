(function(core) {
    'use strict';

    var CommCenter = core.CommCenter;

    function DefaultCommCenter() {
        // Provide a singleton CommCenter
        if (!DefaultCommCenter.prototype._instance) {
            DefaultCommCenter.prototype._instance = new CommCenter();
        }

        return DefaultCommCenter.prototype._instance;
    }

    // Export symbols
    window.DefaultCommCenter = DefaultCommCenter;
})(window.ADB.core);