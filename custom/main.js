// The version of the REST API you wish to use in your app.
var apiVersion = "v27.0";

// If you want to prevent dragging, uncomment this section
/*
 function preventBehavior(e)
 {
 e.preventDefault();
 };
 document.addEventListener("touchmove", preventBehavior, false);
 */

/* If you are supporting your own protocol, the var invokeString will contain any arguments to the app launch.
 see http://iphonedevelopertips.com/cocoa/launching-your-own-application-via-a-custom-url-scheme.html
 for more details -jm */
/*
 function handleOpenURL(url)
 {
 // do something with the url passed in.
 }
 */

var forcetkClient;

$(function() {
  //Add event listeners and so forth here
  ITB.logToConsole("onLoad: jquery ready");
  document.addEventListener("deviceready", onDeviceReady, false);
});

// When this function is called, PhoneGap has been initialized and is ready to roll
function onDeviceReady () {
    ITB.logToConsole("onDeviceReady: PhoneGap ready");
    //Call getAuthCredentials to get the initial session credentials
    SalesforceOAuthPlugin.getAuthCredentials(ITB.salesforceSessionRefreshed, ITB.getAuthCredentialsError);
    
    //register to receive notifications when autoRefreshOnForeground refreshes the sfdc session
    document.addEventListener("salesforceSessionRefresh", ITB.salesforceSessionRefreshed,false);
    
    //initEvent
    ITB.initEvent();
}