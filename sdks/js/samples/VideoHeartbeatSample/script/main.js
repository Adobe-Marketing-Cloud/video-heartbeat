jQuery( document ).ready(function($) {

    // Set-up the VisitorAPI component.
    var visitor = new Visitor(Configuration.VISITOR_API.MARKETING_CLOUD_ORG_ID, Configuration.VISITOR_API.NAMESPACE);
    visitor.trackingServer = Configuration.VISITOR_API.TRACKING_SERVER;

    // Set-up the AppMeasurement component.
    var appMeasurement = AppMeasurement.getInstance(Configuration.APP_MEASUREMENT.RSID);
    appMeasurement.visitor = visitor;
    appMeasurement.visitorNamespace = Configuration.VISITOR_API.NAMESPACE;
    appMeasurement.trackingServer = Configuration.APP_MEASUREMENT.TRACKING_SERVER;
    appMeasurement.account = Configuration.APP_MEASUREMENT.RSID;


    // Create the VideoPlayer.
    var videoPlayer = new VideoPlayer('movie');

    // Create the Analytics provider
    var analyticsProvider = new AnalyticsProvider(appMeasurement);

    // ...and hook it up to the player.
    analyticsProvider.attachToPlayer(videoPlayer);
});