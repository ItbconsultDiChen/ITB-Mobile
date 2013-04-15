ITB = {
    
    logToConsole: function (txt) {
        var now = new Date();
        $('#console').append("<br><i> * " + now.toLocaleString() + ":</i> " + txt);
        //this utilizes the PhoneGap console object to log
        console.log("jslog:" + txt);
    },
        
        
    salesforceSessionRefreshed: function (creds) {
        ITB.logToConsole("salesforceSessionRefreshed");
        
        forcetkClient = new forcetk.Client(creds.clientId, creds.loginUrl);
        forcetkClient.setSessionToken(creds.accessToken, apiVersion, creds.instanceUrl);
        forcetkClient.setRefreshToken(creds.refreshToken);
        forcetkClient.setUserAgentString(creds.userAgent);
        
        //init data on open
        ITB.initData();
    },
        
        
    getAuthCredentialsError: function (error) {
        ITB.logToConsole("getAuthCredentialsError: " + error);
    },
        
    onErrorSfdc: function (error) {
        ITB.logToConsole("onErrorSfdc: " + JSON.stringify(error));
        $.mobile.hidePageLoadingMsg();
    },
    
    initEvent: function () {
        ITB.logToConsole("initEvent");
    
        $('#link_home_refresh').click(function() {
                                      $.mobile.showPageLoadingMsg();
                                      ITB.logToConsole("link_home_refresh clicked");
                                      forcetkClient.mobile_home(ITB.home.onSuccessSfdcHome, ITB.onErrorSfdc);
                                      
        });
        
        $('#link_home_logout').click(function() {
                                ITB.logToConsole("link_home_logout clicked");
                                SalesforceOAuthPlugin.logout();
        });
        ITB.chatter.regPageChangeHandlers(); 
    },
    
    initData: function () {
        ITB.logToConsole("initData");        
        $.mobile.showPageLoadingMsg();
        forcetkClient.mobile_home(ITB.home.onSuccessSfdcHome, ITB.onErrorSfdc);
    }
};