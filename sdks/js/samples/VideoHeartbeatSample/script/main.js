jQuery( document ).ready(function($) {

    $('#pub-label').hide();

    // Set-up the VisitorAPI component.
    var visitor = new Visitor(Configuration.VISITOR_API.MARKETING_CLOUD_ORG_ID, Configuration.VISITOR_API.NAMESPACE);
    visitor.trackingServer = Configuration.VISITOR_API.TRACKING_SERVER;

    // Set-up the AppMeasurement component.
    var appMeasurement = new AppMeasurement();
    appMeasurement.visitor = visitor;
    appMeasurement.visitorNamespace = Configuration.VISITOR_API.NAMESPACE;
    appMeasurement.trackingServer = Configuration.APP_MEASUREMENT.TRACKING_SERVER;
    appMeasurement.account = Configuration.APP_MEASUREMENT.RSID;


    // Create the VideoPlayer.
    var videoPlayer = new VideoPlayer('movie');

    DefaultCommCenter().notificationCenter.addEventListener(PlayerEvent.AD_START, onEnterAd);
    DefaultCommCenter().notificationCenter.addEventListener(PlayerEvent.AD_COMPLETE, onExitAd);
    DefaultCommCenter().notificationCenter.addEventListener(PlayerEvent.SEEK_COMPLETE, onSeekComplete);
    DefaultCommCenter().notificationCenter.addEventListener(PlayerEvent.VIDEO_UNLOAD, onExitAd);

    // Create the Analytics provider
    var analyticsProvider = new VideoAnalyticsProvider(appMeasurement, videoPlayer);

    function onEnterAd() {
        $('#pub-label').show();
    }

    function onExitAd() {
        $('#pub-label').hide();
    }

    function onSeekComplete() {
        if (!videoPlayer.getAdInfo()) {
            // The user seeked outside the ad.
            onExitAd();
        }
    }
});