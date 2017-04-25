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
        "cleanBackupFolder":"/feed/service/clean-backup-folder/"
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
        $('#alert-box').fadeOut();
    })
    var Alert = function(alertObj){
        
        $('#alert-box strong').text(alertObj.h+" : ");
        $('#alert-box span').text(alertObj.msg);

        $('#alert-box').fadeIn();
    }
    
    var storageDataFetcher = function(){

        updateBaseLocationButton.click(function(e){
            e.preventDefault();
            window.localStorage.setItem('StandaloneEpiRunner',devBranchLocationInput.val());
            Alert({h:"Updated",msg:"Location updated"});
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
                progressStatus = {msg:"Backup taken as "+resultData.data.filename,percentage:60};
                

            });
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