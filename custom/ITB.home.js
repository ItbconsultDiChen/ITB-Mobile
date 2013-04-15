ITB.home = {
    
onSuccessSfdcHome: function (response) {
    ITB.logToConsole("onSuccessSfdcHome: received.");
    //ITB.logToConsole(JSON.stringify(response));
    
    $("#div_sfdc_home_vacation").html("");
    var ul = $('<ul data-role="listview" data-count-theme="e"></ul>');
    $("#div_sfdc_home_vacation").append(ul);
    ul.append($('<li data-theme="a">Vacation Statistics</li>'));
    ul.append($('<li>Total Days <span class="ui-li-count">' + response.Vacation_TotalDays + '</span></li>'));
    ul.append($('<li>Used Days <span class="ui-li-count">' + response.Vacation_UsedDays + '</span></li>'));
    ul.append($('<li>Requested Days <span class="ui-li-count">' + response.Vacation_RequestedDays + '</span></li>'));
    ul.append($('<li>Available Days <span class="ui-li-count">' + response.Vacation_AvailableDays + '</span></li>'));
    
    $("#div_sfdc_home_vacation").trigger( "create" );
    
    
    $("#div_sfdc_home_task").html("");
    ul = $('<ul data-role="listview" data-divider-theme="c" data-count-theme="e"></ul>');
    $("#div_sfdc_home_task").append(ul);
    ul.append($('<li data-theme="a">Open Tasks</li>'));
        
    $.each(response.list_tasks, function(i, item) {
           ul.append($('<li data-role="list-divider">' + item.ActivityDate + '<span class="ui-li-count">' + item.list_task.length + '</span></li>'));
           
           $.each(item.list_task, function(j, jtem) {
                  ul.append($('<li><a href="#mobile_form" id="' + jtem.t.Id + '">' +
                              '<h2>' + jtem.Subject + '</h2>' +
                              '<p><strong>Related To:</strong> ' + jtem.RelatedTo + '</p>' +
                              '<p><strong>Name:</strong> ' + jtem.Name + '</p>' +
                              '<p>' + jtem.Comment + '</p>' +
                              '<p class="ui-li-aside"><strong>' + jtem.Status + '</strong><br/>' + jtem.Priority + '</p>' + 
                              '</a></li>'));
                  });
            
    });
    
    $("#div_sfdc_home_task").trigger( "create" );
    
    $("a", $("#div_sfdc_home_task")).click(function(){
                                    $("#h1_sfdc_mobile_form").html(this.id);
                                    $("#div_sfdc_mobile_form").html(this.id);
                                });
    
    $.mobile.hidePageLoadingMsg();
}
};