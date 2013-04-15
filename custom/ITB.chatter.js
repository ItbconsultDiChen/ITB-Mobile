ITB.chatter = {
tell:function(obj, parent) {
    for (var i in obj) {
        if (parent) { var msg = parent + "." + i + "\n" + obj[i]; } else { var msg = i + "\n" + obj[i]; }
        if (!confirm(msg)) { return; }
        if (typeof obj[i] == "object") {
            if (parent) { dumpProps(obj[i], parent + "." + i); } else { dumpProps(obj[i], i); }
        }
    }
},
errorCallback:function (jqXHR){
    $j.mobile.hidePageLoadingMsg();
    alert(jqXHR.statusText + ": " + jqXHR.responseText);
    console.log(jqXHR);
    ITB.tell(jqXHR);
},
regPageChangeHandlers:function (){
    $( "div#chatter" ).on("pageshow", function( event, ui ) {
                          $.mobile.showPageLoadingMsg();
                          if($('#chatter_List').children('div').length == 0){
                          logToConsole("chatter start");
                          ITB.chatter.getChatters(function(){
                                                  forcetkClient.getMyProfil('listAll',false,ITB.chatter.onGetChatterListSuc,ITB.chatter.onGetChatterListFail,false);
                                                  });
                          }else{
                          $.mobile.hidePageLoadingMsg();
                          }
                          });
},
getComputedTime:function (str){
    var n_year = parseInt(str.substr(0,4),10),
    n_month = parseInt(str.substr(5,2),10),
    n_day = parseInt(str.substr(8,2),10),
    n_hour = parseInt(str.substr(11,2),10),
    n_minute = parseInt(str.substr(14,2),10),
    n_second = parseInt(str.substr(17,2),10);
    var now = new Date();
    var result = '';
    var data = [
                now.getFullYear() - n_year,
                now.getMonth() - n_month + 1,
                now.getDate() - n_day,
                now.getHours() - n_hour,
                now.getMinutes() - n_minute,
                now.getSeconds() - n_second
                ];
    var map_idx_key = {
        0:'year',
        1:'month',
        2:'day',
        3:'hour',
        4:'minute',
        5:'second'
    };
    var i = 0,j = 0;
    for(;i<6;i++){
        if(data[i] > 0 && j < 2){
            result += data[i] + map_idx_key[i];
            if(j === 1) break;
            j++;
        }
    }
    return result;
},
hideComment:function (elem){
    $(elem).hide().next().show().next().hide();
},
showComment:function (elem){
    $(elem).prev().show().next().hide().next().show();
},
getChatters:function (callback){
    forcetkClient.getMyProfil('myProfil',false,
                              function(response){
                              console.log(response.id);
                              forcetkClient.pId = response.id;
                              console.log(forcetkClient.pId);
                              $('#userPhoto').empty();
                              $('<img src="'+response.photo.smallPhotoUrl+'?oauth_token='+forcetkClient.sessionId+'"/>')
                              .hide().appendTo('#userPhoto').show();
                              if(!ITB.textAreaOnEdit){
                              $('#feedArea').css('color','#ccc');
                              }
                              if(!ITB.commentAreaOnEdit){
                              $('#commentTextArea').css('color','#ccc');
                              }
                              if (typeof callback != 'undefined' && callback != null) {
                              console.log('ab');
                              callback();
                              console.log('ac');
                              }
                              }
                              ,ITB.chatter.errorCallback);
},
onGetChatterListSuc:function (response){
    console.log('ok');
    var str = [],commentAry,likeAry,i,j,k,l;
    for(i in response.items){
        str.push('<div class="feedItemUnit"><span class="imgspan"><img src="',
                 response.items[i].actor.photo.smallPhotoUrl,
                 '?oauth_token=',
                 forcetkClient.sessionId,
                 '" class="feedImg"/></span><div class="feedItemDiv"><span class="groupName">',
                 response.items[i].parent.name,
                 '</span><span class="actorName"> - ',
                 response.items[i].actor.name,
                 '</span><br/><span class="feedItemBody">',
                 response.items[i].body.text,
                 '</span><br/><a href="',
                 (response.items[i].attachment!=null?response.items[i].attachment.url:'/'),
                 '" target="_blank">',
                 (response.items[i].attachment!=null?response.items[i].attachment.title:''),
                 '</a><br/><span class="timeinfo">',
                 ITB.chatter.getComputedTime(response.items[i].createdDate),
                 ' - </span><a href="#" onclick="ITB.chatter.toComment(\'',
                 response.items[i].id,
                 '\',this)">Comment</a>&nbsp;<a href="#" onclick="ITB.chatter.likeFeed(\'',
                 response.items[i].id,
                 '\',this)">Like</a>');
        if(response.items[i].likes && response.items[i].likes.total>0){
            str.push('<div class="temp"><span class="likeIcon">Likes: </span>');
            likeAry = response.items[i].likes.likes;
            l = likeAry.length;
            for(k in likeAry){
                if(k<l-1 && k < 3){
                    str.push(likeAry[k].user.name,',');
                }else if(k === 3 && l > 3){
                    str.push('and ',(l-k),' others');
                    break;
                }else{
                    str.push(likeAry[k].user.name);
                }
            }
            str.push('</div>');
        }
        if(response.items[i].comments.total > 0){
            str.push('<a class="hcBtn" onclick="ITB.chatter.hideComment(this);return false;" style="display:none;"  data-role="button" data-mini="true" data-theme="c">Hide Comments</a><a class="hcBtn" onclick="ITB.chatter.showComment(this);return false;" data-role="button" data-mini="true" data-theme="c">Show All ',
                     response.items[i].comments.total,
                     ' Comments</a><div style="display:none;">');
            commentAry = response.items[i].comments.comments;
            for(j in commentAry){
                str.push('<div class="commentItemDiv"><span><img src="',
                         commentAry[j].user.photo.smallPhotoUrl,
                         '?oauth_token=',
                         forcetkClient.sessionId,
                         '" alt="" class="smallImg"/></span><div><span class="commentActor">',
                         commentAry[j].user.name,
                         '</span><span class="feedItemBody">',
                         commentAry[j].body.text,
                         '</span><br/><span class="timeinfo">',
                         ITB.chatter.getComputedTime(commentAry[j].createdDate),
                         '</span><a href="#" onclick="ITB.chatter.likeComment(\'',
                         commentAry[j].id,
                         '\')">Like</a></div></div>');
            }
            str.push('</div>');
        }
        str.push('</div></div>');
    }
    if(str.length > 0)
        $('#chatter_List').empty().hide().append(str.join('')).find('.hcBtn').button().end().show();
    $.mobile.hidePageLoadingMsg();
},
onGetChatterListFail:function (err){
    $.mobile.hidePageLoadingMsg();
    ITB.chatter.tell(err);
},
toComment:function (feedid,elem){
    $('#commentDiv').insertAfter(elem).show();
    $('#currentFeedId').val(feedid);
},
checkTextLength:function (){},
checkTextNum:function (){},
checkTxtOnFocus:function (elem){
    var str = $.trim(elem.value);
    if(str === 'What are you working on?' && !ITB.textAreaOnEdit){
        ITB.textAreaOnEdit = true;
        $(elem).val('').css('color','black');
    }
    if(!str || typeof str == 'string' && str.length < 20){
        $(elem).css({'cols':18,'rows':3});
    }
},
cmtAreaOnFocus:function (elem){
    if($.trim(elem.value) === 'Comment...' && !ITB.commentAreaOnEdit){
        ITB.commentAreaOnEdit = true;
        $(elem).val('').css('color','black');
    }
},
cmtAreaOnBlur:function (elem){
    if($.trim(elem.value) === ''){
        ITB.commentAreaOnEdit = false;
        $(elem).val('Comment...').css('color','#ccc');
    }
},
cancelFeed:function(){
    ITB.textAreaOnEdit = false;
    $('#feedArea').val('What are you working on?').css('color','#ccc');
},
shareFeed:function (){
    $.mobile.showPageLoadingMsg();
    var feedData = {
        ParentId : forcetkClient.pId,
        Body : $j('#feedArea').val()
    }
    console.log(forcetkClient);
    if(!feedData.ParentId){
        $.mobile.hidePageLoadingMsg();
        showDialog(false,'User ID is not available,please login again.');
        return false;
    }
    forcetkClient.create('FeedItem', feedData, ITB.chatter.refreshFeedList,ITB.chatter.errorCallback) ;
},
cancelComment:function (){
    ITB.commentAreaOnEdit = false;
    $('#commentTextArea').val('Comment...').css('color','#ccc');
    $('#commentDiv').hide();
},
shareComment:function (){
    $.mobile.showPageLoadingMsg();
    var commentDataset = {
        postid : $('#currentFeedId').val(),
        text : $('#commentTextArea').val()
    };
    console.log(commentDataset);
    forcetkClient.addPostComment(commentDataset,ITB.chatter.refreshFeedList,ITB.chatter.errorCallback);
},
refreshFeedList:function (){
    $j('#commentDiv').insertAfter('#chatter_list').hide();
    ITB.commentAreaOnEdit = ITB.textAreaOnEdit = false;
    forcetkClient.getMyProfil('listAll',false,ITB.chatter.onGetChatterListSuc,ITB.chatter.onGetChatterListFail,false);
    $j('#commentTextArea').val('Comment...').css('color','#ccc');
    $j('#feedArea').val('What are you working on?').css('color','#ccc');
    $j.mobile.hidePageLoadingMsg();
},
likeFeed:function (feedid,elem){
    console.log(feedid);
    $.mobile.showPageLoadingMsg();
    forcetkClient.ajax(
                       '/' + forcetkClient.apiVersion + '/chatter/feed-items/'+feedid+'/likes',
                       function(){
                       forcetkClient.getMyProfil('listAll',false,ITB.chatter.onGetChatterListSuc,ITB.chatter.onGetChatterListFail,false);
                       $j.mobile.hidePageLoadingMsg();
                       },
                       ITB.chatter.errorCallback,
                       'POST',
                       null
                       );
},
likeComment:function(cmtId,elem){
    $.mobile.showPageLoadingMsg();
    console.log(forcetkClient.ajax);
    forcetkClient.ajax(
                       '/' + forcetkClient.apiVersion + '/chatter/comments/'+cmtId+'/likes',
                       function(){alert(0);
                       forcetkClient.getMyProfil('listAll',false,ITB.chatter.onGetChatterListSuc,ITB.chatter.onGetChatterListFail,false);
                       $j.mobile.hidePageLoadingMsg();
                       },
                       ITB.chatter.errorCallback,
                       'POST',
                       null
                       );
},
refresh:function(){
    $.mobile.showPageLoadingMsg();
    forcetkClient.getMyProfil('listAll',false,ITB.chatter.onGetChatterListSuc,ITB.chatter.onGetChatterListFail,false);
}
}