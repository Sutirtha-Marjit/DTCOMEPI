var AppEngine = function(){

    var progressStatus = {msg:null,percentage:null};
    var dataFeedActionButtons = $('a[data-feed-action]');
    var devBranchLocationInput = $('input[name="dev-branch-location"]');
    var updateBaseLocationButton = $('#updateLocation');
    var progressBarElement = $('[data-progress]').eq(0);
    var webURLPromptWindow = $('div.prompt.freshPage');
    var editorPromptWinodw = $('div.prompt.createPage');
    var feedUrls = {
        "createPage":"/feed/service/create-page/",
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

    var closeProgressBarSmartly = function(n,callback){

        setTimeout(function(){
            progressStatus  = {msg:null,percentage:null};
            callback();
        },n);
    };

    var feedAction = function(path,data,callBack,typeGiven){
    var type = 'GET';
        if(typeGiven===1){type='post'}
        $.ajax({
            url:path,
            data:data,
            type:type,
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

    $('.prompt .btn[data-action="create"]').on('click',function(e){
        progressStatus.msg="Creating a page for you";
        progressStatus.percentage = 40; 
        e.preventDefault();
        var obj={};
        $('form[name="createPage"] *[name]').each(function(n,p){
                obj[$(p).attr('name')] = $(p).val();
                if($(p).attr('type')==="checkbox"){
                    if(!$(p).prop('checked')){
                        obj[$(p).attr('name')] = 0;
                    }
                     
                }            
        }); 
        
        
        feedAction(feedUrls["createPage"],obj,function(data){
            if(data.status){
                progressStatus = {msg:'Your file has been created with filename '+data.filename,percentage:100};
            }else{
                progressStatus = {msg:'Error ',percentage:100};
            }
            closeProgressBarSmartly(1000,function(){
                window.location.reload();
            });
        },1);
       
    });

    $('.prompt .btn[data-action="done"]').on('click',function(e){
        e.preventDefault();
        var val = $('#WebURL').val();
        if(val.length===0){
           Alert({type:'alert',h:'Blank not allowed',msg:'Please dont leave the field blank'}); 
        }else{
            feedAction(feedUrls["freshPage"],{targetPage:val},function(data){
                console.log(data);
            });
        }
    })

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

            case "createPage":
            $('[data-feed-action]').removeClass('active');
            $('[data-feed-action="createPage"]').addClass('active');
            $('div.prompt').addClass('hide');
            editorPromptWinodw.removeClass('hide');
            break;
        
            case "freshPage":
            $('[data-feed-action]').removeClass('active');
            $('[data-feed-action="freshPage"]').addClass('active');
            $('div.prompt').addClass('hide');
            webURLPromptWindow.removeClass('hide');
            /*
            if(!$('[data-feed-action="freshPage"]').hasClass('active')){
                $('[data-feed-action="freshPage"]').addClass('active');
                webURLPromptWindow.removeClass('hide');            
            }else{
                $('[data-feed-action="freshPage"]').removeClass('active');
                 webURLPromptWindow.addClass('hide');
            }*/
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