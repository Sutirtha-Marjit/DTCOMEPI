var AppEngine = function(){

    var progressStatus = {msg:null,percentage:null};
    var dataFeedActionButtons = $('a[data-feed-action]');
    var devBranchLocationInput = $('input[name="dev-branch-location"]');
    var updateBaseLocationButton = $('#updateLocation');
    var progressBarElement = $('[data-progress]').eq(0);
    var feedUrls = {
        "freshPage":"/feed/service/fresh-page/",
        "removeUIFolder":"/feed/service/remove-ui-folder/",
        "freshFolder":"/feed/service/fresh-folder/",
        "fetchUIFolder":"/feed/service/fetch-ui-folder",
        "cleanBackupFolder":"/feed/service/clean-backup-folder/",
        "copyFolderFromSource":"/feed/service/copy-folder-from-source/"
    };

    setInterval(function(){
        if(progressStatus.msg!==null && progressStatus.percentage!==null){
            progressBarElement.show();
            progressBarElement.find('h4').text(progressStatus.msg);
            progressBarElement.find('.progress-bar').css('width',progressStatus.percentage+'%');

        }else{
            progressBarElement.hide();
        }
    },100);

    var feedAction = function(path,data,callBack){
        $.ajax({
            url:path,
            data:data,
            success:function(callBackData){
                callBack(callBackData);
            },
            error:function(){

            }
        })
    }

    $('#alert-box .close').on('click',function(){
        $('#alert-box').data('action',null);
        $('#alert-box').fadeOut();
    });

    var Alert = function(alertObj){
        
        var targetWindow = $('#alert-box div.alert').filter('[data-type="'+alertObj.type+'"]');
        $('#alert-box').data('action',alertObj.promptAction);
        $('#alert-box div.alert').addClass('hide');
        targetWindow.removeClass('hide');
        
        targetWindow.find('input[type="text"]').attr('placeholder',alertObj.h);
        targetWindow.find('strong').text(alertObj.h+" : ");
        targetWindow.find('span').text(alertObj.msg);
        
        $('#alert-box').fadeIn();
    }
    
    var storageDataFetcher = function(){

        updateBaseLocationButton.click(function(e){
            e.preventDefault();
            window.localStorage.setItem('StandaloneEpiRunner',devBranchLocationInput.val());
            Alert({h:"Updated",msg:"Location updated",type:"alert"});
        });

        if(window.localStorage){
            if(window.localStorage.getItem('StandaloneEpiRunner')!==null){
                devBranchLocationInput.val(window.localStorage.getItem('StandaloneEpiRunner'))
            }else{
                window.localStorage.setItem('StandaloneEpiRunner',devBranchLocationInput.val());
            }
        }
        
    };

    console.log('Found '+dataFeedActionButtons.length+' buttons');
    dataFeedActionButtons.click(function(e){
        e.preventDefault();
        var feedPath = $(e.currentTarget).data('feed-action');
        
        switch(feedPath){

            case "freshFolder":
            console.log(feedUrls["freshFolder"]);
            progressStatus = {msg:"You are going to take backup",percentage:10};
            feedAction(feedUrls["freshFolder"],{},function(resultData){
                progressStatus = {msg:"Backup taken as "+resultData.data.filename,percentage:40};
                
                feedAction(feedUrls["removeUIFolder"],{},function(statusData){
                    progressStatus = {msg:"Existing UI folder removed",percentage:70};

                    feedAction(feedUrls["copyFolderFromSource"],{path:devBranchLocationInput.val()},function(copyStatusData){

                    });

                });

            });
            break;

        
            case "freshPage":
            console.log(feedUrls["freshPage"]);
            
            /*
            progressStatus = {msg:"Request received to copy new page",percentage:1};
            feedAction(feedUrls["freshPage"],{},function(resultData){
                console.log(resultData);
            });*/
            break;

            case "cleanBackupFolder":
            console.log(feedUrls["cleanBackupFolder"]);
            progressStatus = {msg:"Backup cleaning started",percentage:2};
            feedAction(feedUrls["cleanBackupFolder"],{},function(resultData){
                if(resultData.status){
                    progressStatus = {msg:"Backup cleaning done",percentage:100};
                    setTimeout(function(){progressStatus={msg:null,percentage:null}},1000);
                }
            });

        }


    });

    storageDataFetcher();
   
};

$(document).ready(AppEngine);